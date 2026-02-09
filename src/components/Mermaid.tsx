import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const [svg, setSvg] = useState<string>('');
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
        });

        const renderChart = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (error) {
                console.error('Failed to render mermaid chart:', error);
                // Display error in the component if rendering fails
                setSvg(`<pre class="text-red-500 p-4 bg-red-50 rounded">Error rendering chart: ${error instanceof Error ? error.message : String(error)}</pre>`);
            }
        };

        if (chart) {
            renderChart();
        }
    }, [chart]);

    return (
        <div
            className="mermaid-diagram my-8 flex justify-center overflow-x-auto"
            ref={elementRef}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default Mermaid;
