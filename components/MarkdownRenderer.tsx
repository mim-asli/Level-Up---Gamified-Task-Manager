
import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    // A simple parser to avoid full libraries.
    // This supports **bold** and * list items.
    const renderLine = (line: string, index: number) => {
        // Use a simple regex for bold. It's not perfect but works for this case.
        const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-200">$1</strong>');
        
        // Handle list items
        if (boldedLine.trim().startsWith('* ')) {
            const listItemContent = boldedLine.trim().substring(2);
            return (
                <li key={index} dangerouslySetInnerHTML={{ __html: listItemContent }} />
            );
        }
        
        // Handle headings (e.g., # My Title)
        if (boldedLine.trim().startsWith('# ')) {
             const headingContent = boldedLine.trim().substring(2);
             return <h3 key={index} className="text-2xl font-bold text-green-300 mt-4 mb-2" dangerouslySetInnerHTML={{ __html: headingContent }} />
        }

        // Regular paragraph
        return <p key={index} dangerouslySetInnerHTML={{ __html: boldedLine }} />;
    };

    const lines = content.split('\n');
    const elements = [];
    let listItems: JSX.Element[] = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ')) {
            listItems.push(renderLine(line, index));
        } else {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${index}`} className="list-disc list-outside space-y-2 my-4 pl-5 marker:text-green-400">{listItems}</ul>);
                listItems = [];
            }
            if (trimmedLine !== '') {
                elements.push(renderLine(line, index));
            } else {
                 elements.push(<br key={`br-${index}`}/>);
            }
        }
    });

    if (listItems.length > 0) {
        elements.push(<ul key="ul-end" className="list-disc list-outside space-y-2 my-4 pl-5 marker:text-green-400">{listItems}</ul>);
    }

    return <div className="text-green-400 leading-relaxed space-y-4">{elements}</div>;
};

export default MarkdownRenderer;