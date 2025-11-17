
'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import panzoom from 'panzoom';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const chartId = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        background: 'transparent',
        primaryColor: '#2a2a3e',
        primaryTextColor: '#fff',
        primaryBorderColor: '#3b1d8a',
        lineColor: '#4338ca',
        textColor: '#fff',
        fontSize: '16px',
        edgeLabelBackground: 'transparent',
        tertiaryColor: 'transparent'
      }
    });

    const renderMermaid = async () => {
      try {
        if (ref.current && chart) {
          const { svg } = await mermaid.render(chartId, chart);
          setSvg(svg);
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        setSvg('<div class="text-white">Error rendering diagram.</div>');
      }
    };

    renderMermaid();
  }, [chart, chartId]);

  useEffect(() => {
    if (svg && ref.current) {
      const diagramContainer = ref.current.querySelector('div');
      if (diagramContainer) {
        const instance = panzoom(diagramContainer, {
          maxZoom: 3,
          minZoom: 0.5,
          autocenter: true,
          bounds: true,
          boundsPadding: 0.1,
        });
        return () => {
          instance.dispose();
        };
      }
    }
  }, [svg]);
  
  return (
    <div
      ref={ref}
      className="flex justify-center items-center w-full mermaid-container cursor-grab"
      style={{ minHeight: '400px' }}
      dangerouslySetInnerHTML={{ __html: svg ? `<div>${svg}</div>` : '<div class="text-white animate-pulse">Loading Diagram...</div>' }}
    />
  );
};

export default MermaidDiagram;
