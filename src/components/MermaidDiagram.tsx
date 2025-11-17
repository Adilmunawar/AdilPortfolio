
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
  // Using a simpler, client-side only ID to avoid hydration mismatch
  const [chartId] = useState(() => `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        background: '#1E1E39',
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
        // Fallback to show an error message
        setSvg('<div class="text-white">Error rendering diagram.</div>');
      }
    };

    renderMermaid();
  }, [chart, chartId]);
  
  useEffect(() => {
    if (!play || !svg || !ref.current || animationOrder.length === 0) {
      if (ref.current) {
        const elements = ref.current.querySelectorAll('.node, .edge-path');
        elements.forEach(el => el.classList.remove('mermaid-animate', 'mermaid-active-node', 'mermaid-active-edge'));
      }
      setCurrentIndex(-1);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1);
        if (nextIndex >= animationOrder.length) {
            // Reset animation
            if (ref.current) {
                const elements = ref.current.querySelectorAll('.mermaid-active-node, .mermaid-active-edge');
                elements.forEach(el => el.classList.remove('mermaid-animate', 'mermaid-active-node', 'mermaid-active-edge'));
            }
            return -1;
        }
        return nextIndex;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [play, svg, animationOrder]);
  
  useEffect(() => {
     if (!ref.current || currentIndex < 0) return;

      const currentNodeId = animationOrder[currentIndex];
      const prevNodeId = currentIndex > 0 ? animationOrder[currentIndex - 1] : null;

      // Animate current node
      const currentNodeElement = ref.current.querySelector(`#${currentNodeId}`);
      if (currentNodeElement) {
        currentNodeElement.classList.add('mermaid-animate', 'mermaid-active-node');
      }

      // Animate edge from previous to current
      if (prevNodeId) {
        const edge = ref.current.querySelector(`.edge-path[data-from="${prevNodeId}"][data-to="${currentNodeId}"] path`);
        if (edge) {
            edge.classList.add('mermaid-animate', 'mermaid-active-edge');
        }
      }

  }, [currentIndex, animationOrder]);


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
