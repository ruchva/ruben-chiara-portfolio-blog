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
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
                darkMode: true,
                background: '#0a0f14',
                mainBkg: '#111820',
                primaryColor: '#111820',
                primaryBorderColor: '#137fec',
                primaryTextColor: '#ffffff',
                secondaryColor: '#1e2936',
                secondaryBorderColor: '#2c4255',
                secondaryTextColor: '#92adc9',
                tertiaryColor: '#0a0f14',
                tertiaryBorderColor: '#1e2936',
                tertiaryTextColor: '#92adc9',
                lineColor: '#2c4255',
                textColor: '#e5edf5',
                nodeTextColor: '#ffffff',
                edgeLabelBackground: '#111820',
                clusterBkg: '#0d141c',
                clusterBorder: '#1e2936',
                actorBkg: '#111820',
                actorBorder: '#137fec',
                actorTextColor: '#ffffff',
                actorLineColor: '#2c4255',
                signalColor: '#92adc9',
                signalTextColor: '#e5edf5',
                labelBoxBkgColor: '#111820',
                labelBoxBorderColor: '#2c4255',
                labelTextColor: '#e5edf5',
                loopTextColor: '#92adc9',
                noteBkgColor: '#1e2936',
                noteTextColor: '#e5edf5',
                noteBorderColor: '#2c4255',
                fontFamily: 'Inter, sans-serif',
            },
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
