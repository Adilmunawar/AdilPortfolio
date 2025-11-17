
'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  animationOrder: string[];
  play: boolean;
}

const MermaidDiagram = ({ chart, animationOrder, play }: MermaidDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [chartId] = useState(() => `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`);
  const [currentIndex, setCurrentIndex] = useState(-1);

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
        fontSize: '16px'
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
    const container = ref.current;
    if (!play || !svg || !container || animationOrder.length === 0) {
      if (container) {
        // Clear all animations if not playing
        container.querySelectorAll('.mermaid-active-node, .mermaid-active-edge').forEach(el => {
          el.classList.remove('mermaid-active-node', 'mermaid-active-edge');
        });
      }
      setCurrentIndex(-1);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1));
    }, 1500);

    return () => clearInterval(interval);
  }, [play, svg, animationOrder.length]);
  
  useEffect(() => {
     const container = ref.current;
     if (!container || !play) return;
     
     if (currentIndex >= animationOrder.length) {
       // Reset animation
        container.querySelectorAll('.mermaid-active-node, .mermaid-active-edge').forEach(el => {
            el.classList.remove('mermaid-active-node', 'mermaid-active-edge');
        });
        setCurrentIndex(0);
        return;
     }

     if (currentIndex < 0) return;

      const currentNodeId = animationOrder[currentIndex];
      const prevNodeId = currentIndex > 0 ? animationOrder[currentIndex - 1] : null;

      // Activate current node
      const currentNodeElement = container.querySelector(`#${chartId}-${currentNodeId}`);
      if (currentNodeElement) {
        currentNodeElement.classList.add('mermaid-animate', 'mermaid-active-node');
      }
      
      // Activate edge from previous node
      if (prevNodeId) {
        // MermaidJS creates edge IDs like `L-prevNodeId-currentNodeId` within a subgraph, or just `L-prevNodeId-currentNodeId` at the root
        const edgeElements = container.querySelectorAll(`[id*="-${prevNodeId}-"][id*="-${currentNodeId}"]`);
        edgeElements.forEach(edge => {
            if (edge.id.includes(`${chartId}-`)) { // ensure it's for the current chart
                edge.classList.add('mermaid-animate', 'mermaid-active-edge');
            }
        });
      }

  }, [currentIndex, animationOrder, chartId, play]);


  return (
    <div
      ref={ref}
      className="flex justify-center items-center w-full"
      style={{ minHeight: '400px' }}
      dangerouslySetInnerHTML={{ __html: svg ?? '<div class="text-white animate-pulse">Loading Diagram...</div>' }}
    />
  );
};

export default MermaidDiagram;
