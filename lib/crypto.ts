// Utility to convert ArrayBuffer to Base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

// Utility to convert Base64 to ArrayBuffer
const base64ToBuffer = (b64: string): ArrayBuffer => {
    const byteString = atob(b64);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }
    return byteArray.buffer;
};

// Derives a key from a password using PBKDF2
const getKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
};

/**
 * Encrypts a string of data with a master password.
 * @param data The string data to encrypt.
 * @param password The master password.
 * @returns A promise that resolves to a Base64 encoded string containing the salt, IV, and ciphertext.
 */
export const encrypt = async (data: string, password: string): Promise<string> => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey(password, salt);
    
    const enc = new TextEncoder();
    const encodedData = enc.encode(data);
    
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedData
    );
    
    // Combine salt, iv, and ciphertext into a single Base64 string for easy storage
    return `${bufferToBase64(salt)}.${bufferToBase64(iv)}.${bufferToBase64(ciphertext)}`;
};


/**
 * Decrypts a Base64 encoded string with a master password.
 * @param encryptedData The Base64 string from the encrypt function.
 * @param password The master password.
 * @returns A promise that resolves to the decrypted string data. Throws an error if decryption fails (e.g., wrong password).
 */
export const decrypt = async (encryptedData: string, password: string): Promise<string> => {
    try {
        const [saltB64, ivB64, ciphertextB64] = encryptedData.split('.');
        
        const salt = base64ToBuffer(saltB64);
        const iv = base64ToBuffer(ivB64);
        const ciphertext = base64ToBuffer(ciphertextB64);
        
        const key = await getKey(password, new Uint8Array(salt));
        
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(iv) },
            key,
            ciphertext
        );
        
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (e) {
        console.error("Decryption failed:", e);
        throw new Error("Invalid password or corrupted data.");
    }
};