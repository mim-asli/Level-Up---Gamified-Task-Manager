import { GoogleGenAI, GenerateContentResponse, Type, GenerateContentParameters, Content, FinishReason, Schema } from "@google/genai";
import { LocalAIConfig, Language } from "../types.js";

// Helper to check for rate limit errors
const isRateLimitError = (error: any): boolean => {
    const message = error.message?.toLowerCase() || '';
    // Check for common rate limit messages from Google API
    return message.includes('rate limit') || message.includes('quota') || message.includes('resource has been exhausted') || error.status === 429;
};

// Helper to convert Gemini content to OpenAI/Mistral format
const convertToOpenAIMessages = (contents: GenerateContentParameters['contents']): { role: 'system' | 'user' | 'assistant', content: string }[] => {
    const messages: { role: 'system' | 'user' | 'assistant', content: string }[] = [];

    // Handle string content
    if (typeof contents === 'string') {
        messages.push({ role: 'user', content: contents });
        return messages;
    }

    // Handle Content object or array of Content objects
    const contentArray = Array.isArray(contents) ? contents : [contents];

    for (const content of contentArray) {
        if (typeof content === 'object' && content !== null && 'parts' in content) {
             const text = content.parts.map(p => 'text' in p ? p.text : '').join('\n');
             const role = content.role === 'model' ? 'assistant' : 'user';
             messages.push({ role, content: text });
        }
    }
    
    return messages;
};


// Enhances prompts specifically for local models like Mistral
const enhanceMessagesForLocalAI = (
    params: GenerateContentParameters,
    messages: { role: 'system' | 'user' | 'assistant', content: string }[]
): { role: 'system' | 'user' | 'assistant', content: string }[] => {
    
    const enhancedMessages = [...messages];
    const systemInstruction = params.config?.systemInstruction;
    const responseSchema = params.config?.responseSchema as Schema | undefined;

    // Wrap system instructions in Mistral-style instruction tags for better role-playing
    if (systemInstruction) {
        const systemMsgIndex = enhancedMessages.findIndex(m => m.role === 'system');
        const instructionText = `[INST] ${systemInstruction} [/INST]`;

        if (systemMsgIndex !== -1) {
            enhancedMessages[systemMsgIndex].content = instructionText;
        } else {
            enhancedMessages.unshift({ role: 'system', content: instructionText });
        }
    }
    
    // Add explicit JSON instructions if a schema is present, as local models often need more guidance
    if (params.config?.responseMimeType === 'application/json' && responseSchema) {
        const lastUserMessage = enhancedMessages.slice().reverse().find(m => m.role === 'user');
        if (lastUserMessage) {
            let jsonInstruction = "\n\nIMPORTANT: Your entire response MUST be a single, valid JSON object and nothing else. Do not add any text, explanation, or markdown backticks before or after the JSON object.";

            // Provide a structural example for common complex schemas to improve reliability
            if (responseSchema.properties?.['quests']) {
                jsonInstruction += "\nYour response structure must be: `{\"quests\": [{\"description\": \"...\", ...}]}`";
            } else if (responseSchema.properties?.['subtasks']) {
                jsonInstruction += "\nYour response structure must be: `{\"subtasks\": [\"First task...\", \"Second task...\"]}`";
            } else if (responseSchema.properties?.['suggestions']) {
                 jsonInstruction += "\nYour response structure must be: `{\"suggestions\": [{\"name\": \"...\", ...}]}`";
            }

            lastUserMessage.content += jsonInstruction;
        }
    }
    
    return enhancedMessages;
};


export const aiGenerateContent = async (
    providers: { geminiApiKey: string | null, localAI: LocalAIConfig },
    params: GenerateContentParameters,
    language: Language
): Promise<GenerateContentResponse> => {
    // Try Gemini first if a key is available
    if (providers.geminiApiKey) {
        try {
            const ai = new GoogleGenAI({ apiKey: providers.geminiApiKey });
            const response = await ai.models.generateContent(params);
            return response;
        } catch (e) {
            console.warn("Gemini API call failed. Checking for fallback.", e);
            
            // If no local AI is enabled/configured, always re-throw the error.
            if (!providers.localAI.enabled || !providers.localAI.url) {
                throw e;
            }

            // For Persian, only fallback on rate limit errors. For other errors (e.g. content safety),
            // re-throw because the local model's quality is likely worse than a Gemini error message.
            if (language === 'fa' && !isRateLimitError(e)) {
                throw e;
            }
            
            // For English (or if it was a rate limit error for Persian), proceed to fallback.
            console.log("Proceeding to local AI fallback.");
        }
    }

    // Fallback to or direct call to Local AI
    if (providers.localAI.enabled && providers.localAI.url) {
        console.log(`Falling back to local AI model at ${providers.localAI.url}`);
        try {
            let messages = convertToOpenAIMessages(params.contents);
            messages = enhanceMessagesForLocalAI(params, messages);
            
            const body = {
                model: providers.localAI.modelName,
                messages: messages,
                ...(params.config?.responseMimeType === 'application/json' ? { response_format: { type: "json_object" } } : {})
            };

            const response = await fetch(providers.localAI.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${providers.localAI.apiKey || 'no-key'}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Local AI request failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            const rawContent = data.choices[0]?.message?.content;
            
            // Ensure text is a string, even if the model returns a JSON object directly
            const text = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);

            // Mock a Gemini response object for consistency
            const mockedResponse: GenerateContentResponse = {
                text,
                candidates: [{
                    content: {
                        parts: [{ text }],
                        role: 'model'
                    },
                    finishReason: data.choices[0]?.finish_reason === 'stop' ? FinishReason.STOP : FinishReason.FINISH_REASON_UNSPECIFIED,
                    index: 0,
                    safetyRatings: [],
                    // These fields are optional and can be undefined
                    // citationMetadata: undefined,
                    // groundingMetadata: undefined,
                }],
                // These fields are optional and can be undefined
                // promptFeedback: undefined
                 data: undefined,
                functionCalls: undefined,
                executableCode: undefined,
                codeExecutionResult: undefined,
            };
            return mockedResponse;
        } catch (e) {
            console.error("Local AI call failed:", e);
            throw new Error(`Local AI call failed: ${(e as Error).message}`);
        }
    }

    throw new Error("No available AI provider. Check your Gemini API key or local AI fallback settings.");
};

export async function* aiGenerateContentStream(
    providers: { geminiApiKey: string | null, localAI: LocalAIConfig },
    params: GenerateContentParameters,
    language: Language
): AsyncGenerator<GenerateContentResponse> {
    if (providers.geminiApiKey) {
        try {
            const ai = new GoogleGenAI({ apiKey: providers.geminiApiKey });
            const responseStream = await ai.models.generateContentStream(params);
            
            for await (const chunk of responseStream) {
                yield chunk;
            }
            return; // End the generator
        } catch (e) {
            console.error("Gemini API stream failed:", e);
            // Don't fallback for streams, just re-throw.
            throw e;
        }
    }

    // If no Gemini key, streaming is not supported.
    throw new Error("Streaming is only supported with a configured Gemini API key.");
}