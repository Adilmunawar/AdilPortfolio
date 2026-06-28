'use client';
import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export const MermaidDiagram = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState('');
  const [id] = useState(`mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.render(id, chart).then((result) => {
      setSvg(result.svg);
    }).catch((e) => {
      console.error('Mermaid render error', e);
    });
  }, [chart, id]);

  return (
    <div 
      className="my-8 flex justify-center w-full overflow-x-auto bg-[#0a0f1c]/80 p-6 rounded-3xl border border-white/10 shadow-2xl"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};
