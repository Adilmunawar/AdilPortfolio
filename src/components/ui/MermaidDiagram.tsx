'use client';
import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

let initialised = false;
let renderSeq = 0;

function ensureInit() {
  if (initialised) return;
  initialised = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'strict',
    fontFamily: 'inherit',
    themeVariables: {
      background: '#0b0f17',
      primaryColor: '#171d2b',
      primaryTextColor: '#f2f4f8',
      primaryBorderColor: '#5c9dff',
      lineColor: '#6f7888',
      secondaryColor: '#1e2536',
      tertiaryColor: '#111622',
      fontSize: '13px',
    },
  });
}

export const MermaidDiagram = ({ chart }: { chart: string }) => {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureInit();
    const id = `mmd-${reactId}-${renderSeq++}`;
    mermaid
      .render(id, chart.trim())
      .then(({ svg: out }) => {
        if (!cancelled) setSvg(out);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
        document.getElementById(`d${id}`)?.remove();
      });
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (failed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-[8px] border border-white/[0.06] bg-[#0b0f17] p-4 font-mono text-[12px] leading-relaxed text-[#a4adbe]">
        {chart.trim()}
      </pre>
    );
  }

  return (
    <div
      className="mermaid-container my-6 flex w-full justify-center overflow-x-auto rounded-[12px] border border-white/[0.06] bg-[#0b0f17] p-4 md:p-6 [&_svg]:h-auto [&_svg]:max-w-full"
      aria-busy={!svg}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
