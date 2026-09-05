'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, ANIM, caption, CoverFrame, Edge, GREEN, label, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

const INK = '#0b0f17';

const travel = (path: string, delayMs: number): CSSProperties => ({
  offsetPath: `path("${path}")`,
  offsetRotate: '0deg',
  animationDelay: `${delayMs}ms`,
});

/* A dot that travels along a local path; place inside a translated group. */
function Pulse({ path, delayMs, tone = ACCENT }: { path: string; delayMs: number; tone?: string }) {
  return (
    <g className={ANIM.travel} style={travel(path, delayMs)}>
      <circle r={2.4} fill={tone} />
      <circle r={5} fill={tone} fillOpacity={0.25} />
    </g>
  );
}

/* Text lines of a reply growing in from the left, one after another. */
function ReplyLines({ x, y, widths, delayStep = 220 }: { x: number; y: number; widths: number[]; delayStep?: number }) {
  return (
    <g>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * 12}
          width={w}
          height={5}
          rx={2.5}
          fill={ACCENT}
          fillOpacity={0.55}
          className={ANIM.grow}
          style={{ transformOrigin: `${x}px ${y + i * 12 + 2.5}px`, animationDelay: `${i * delayStep}ms` }}
        />
      ))}
    </g>
  );
}

/* Card cover: browser, route handler and model with tokens one way and the abort signal the other. */
const StreamCover: CoverComponent = ({ uid, title, className }) => {
  const slots = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 220]}>
      <text {...caption} x={40} y={56}>Browser</text>
      <text {...caption} x={320} y={56} textAnchor="middle">Route handler</text>
      <text {...caption} x={600} y={56} textAnchor="end">Model provider</text>

      <Panel x={40} y={80} w={160} h={192} />
      <text {...label} x={56} y={104}>Zenith reply</text>
      <ReplyLines x={56} y={118} widths={[112, 96, 120, 72]} />
      <rect x={56} y={170} width={6} height={11} fill={ACCENT} className={ANIM.blink} />
      <rect x={56} y={200} width={52} height={20} rx={4} fill={NODE_FILL_2} stroke={ROSE} strokeOpacity={0.6} strokeWidth={1} />
      <text {...caption} x={82} y={214} textAnchor="middle" fill={ROSE}>stop</text>
      <text {...mono} x={56} y={248} fill={TEXT_MUTED}>ac.abort()</text>

      <Panel x={264} y={80} w={112} h={192} />
      <text {...label} x={320} y={104} textAnchor="middle">pull()</text>
      {slots.map(i => (
        <rect key={i} x={280} y={120 + i * 14} width={80} height={9} rx={2} fill={i < 5 ? ACCENT : INK} fillOpacity={i < 5 ? 0.45 : 1} stroke={LINE_SOFT} strokeWidth={1} />
      ))}
      <text {...caption} x={320} y={248} textAnchor="middle">queue of 8</text>

      <Panel x={440} y={80} w={160} h={192} />
      <text {...label} x={456} y={104}>OpenRouter</text>
      <text {...mono} x={456} y={130} fill={ACCENT}>stream: true</text>
      <text {...mono} x={456} y={152}>delta.content</text>
      <text {...caption} x={456} y={204} fill={GREEN}>stops on abort</text>
      <text {...caption} x={456} y={224} fill={TEXT_MUTED}>no unread tokens</text>

      <Edge uid={uid} d="M440 132H380" />
      <Edge uid={uid} d="M264 132H204" />
      <text {...caption} x={410} y={124} textAnchor="middle">delta</text>
      <text {...caption} x={234} y={124} textAnchor="middle">frame</text>
      <path d="M200 232H260" fill="none" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <path d="M376 232H436" fill="none" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={230} y={252} textAnchor="middle" fill={ROSE}>abort</text>
      <text {...caption} x={406} y={252} textAnchor="middle" fill={ROSE}>abort</text>

      <g transform="translate(440 132)"><Pulse path="M0 0 L-60 0" delayMs={0} /></g>
      <g transform="translate(264 132)"><Pulse path="M0 0 L-60 0" delayMs={500} /></g>
      <g transform="translate(200 232)"><Pulse path="M0 0 L60 0" delayMs={1200} tone={ROSE} /></g>
      <g transform="translate(376 232)"><Pulse path="M0 0 L60 0" delayMs={1600} tone={ROSE} /></g>

      <Tag x={40} y={312} text="SSE over POST" />
      <Tag x={136} y={312} text="AbortSignal" tone="rose" />
      <Tag x={224} y={312} text="highWaterMark: 8" tone="accent" />
      <Tag x={340} y={312} text="Last-Event-ID" tone="green" />
    </CoverFrame>
  );
};

/* Figure: tokens flow left through three hops, the abort signal flows right through the same three. */
const AbortPropagation: CoverComponent = ({ uid, title, className }) => {
  const stages = ['req.signal', 'pull()', 'queue: 8 frames', 'cancel()', 'upstream.abort()'];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[332, 176, 220]}>
      <text {...caption} x={40} y={56}>Browser</text>
      <text {...caption} x={332} y={56} textAnchor="middle">Route handler</text>
      <text {...caption} x={600} y={56} textAnchor="end">Model provider</text>

      <Panel x={40} y={80} w={168} h={200} />
      <text {...label} x={56} y={104}>useStreamedReply</text>
      <text {...mono} x={56} y={128} fill={ACCENT}>fetch(url, {'{ signal }'})</text>
      <text {...mono} x={56} y={148}>reader.read()</text>
      <ReplyLines x={56} y={160} widths={[128, 96, 112]} />
      <rect x={56} y={204} width={52} height={20} rx={4} fill={NODE_FILL_2} stroke={ROSE} strokeOpacity={0.6} strokeWidth={1} />
      <text {...caption} x={82} y={218} textAnchor="middle" fill={ROSE}>stop</text>
      <text {...caption} x={116} y={218} fill={TEXT_MUTED}>or unmount</text>
      <text {...mono} x={56} y={252} fill={ROSE}>ac.abort()</text>
      <text {...caption} x={56} y={268} fill={TEXT_MUTED}>fetch rejects, socket closes</text>

      <Panel x={264} y={80} w={136} h={200} />
      <text {...label} x={332} y={104} textAnchor="middle">POST handler</text>
      {stages.map((s, i) => (
        <g key={s}>
          <rect x={276} y={116 + i * 28} width={112} height={20} rx={4} fill={NODE_FILL_2} stroke={i >= 3 ? ROSE : LINE_SOFT} strokeOpacity={i >= 3 ? 0.5 : 1} strokeWidth={1} />
          <text {...mono} x={332} y={130 + i * 28} textAnchor="middle" fill={i >= 3 ? ROSE : undefined}>{s}</text>
        </g>
      ))}
      <text {...caption} x={332} y={268} textAnchor="middle" fill={TEXT_MUTED}>runtime cancels the body</text>

      <Panel x={456} y={80} w={144} h={200} />
      <text {...label} x={472} y={104}>OpenRouter</text>
      <text {...mono} x={472} y={128} fill={ACCENT}>stream: true</text>
      <text {...caption} x={472} y={148}>generating</text>
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={472 + i * 22} y={156} width={18} height={9} rx={2} fill={ACCENT} fillOpacity={0.5} className={ANIM.pulse} style={{ animationDelay: `${i * 300}ms` }} />
      ))}
      <text {...caption} x={472} y={200} fill={ROSE}>fetch aborted</text>
      <text {...caption} x={472} y={216} fill={GREEN}>generation stops</text>
      <text {...caption} x={472} y={232} fill={TEXT_MUTED}>billing stops</text>
      <circle cx={584} cy={212} r={3} fill={GREEN} className={ANIM.blink} />

      <Edge uid={uid} d="M456 124H404" />
      <Edge uid={uid} d="M264 124H212" />
      <text {...caption} x={430} y={116} textAnchor="middle">delta</text>
      <text {...caption} x={238} y={116} textAnchor="middle">frame</text>

      <path d="M208 236H260" fill="none" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <path d="M400 236H452" fill="none" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={234} y={252} textAnchor="middle" fill={ROSE}>abort</text>
      <text {...caption} x={426} y={252} textAnchor="middle" fill={ROSE}>abort</text>

      <g transform="translate(456 124)"><Pulse path="M0 0 L-52 0" delayMs={0} /></g>
      <g transform="translate(264 124)"><Pulse path="M0 0 L-52 0" delayMs={400} /></g>
      <g transform="translate(208 236)"><Pulse path="M0 0 L52 0" delayMs={1100} tone={ROSE} /></g>
      <g transform="translate(400 236)"><Pulse path="M0 0 L52 0" delayMs={1500} tone={ROSE} /></g>

      <Tag x={40} y={316} text="AbortError" tone="rose" />
      <Tag x={124} y={316} text="cancel() releases upstream" tone="amber" />
      <Tag x={300} y={316} text="one signal, three hops" tone="accent" />
      <Tag x={450} y={316} text="no orphan tokens" tone="green" />
    </CoverFrame>
  );
};

/* Figure: a fast producer, a bounded queue at its high water mark, and a slow consumer. */
const Backpressure: CoverComponent = ({ uid, title, className }) => {
  const slots = [0, 1, 2, 3, 4, 5, 6, 7];
  const events: [number, string, string][] = [
    [96, 'pull()', ACCENT],
    [208, 'queue fills', ACCENT],
    [320, 'desiredSize hits 0', ROSE],
    [432, 'consumer reads', GREEN],
    [544, 'pull() again', ACCENT],
  ];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 220]}>
      <text {...caption} x={40} y={56}>Producer</text>
      <text {...caption} x={320} y={56} textAnchor="middle">ReadableStream queue</text>
      <text {...caption} x={600} y={56} textAnchor="end">Consumer</text>

      <Panel x={40} y={96} w={136} h={136} />
      <text {...label} x={56} y={120}>upstream iterator</text>
      <text {...mono} x={56} y={146} fill={ACCENT}>iterator.next()</text>
      <text {...mono} x={56} y={174} fill={AMBER} className={ANIM.blink}>awaiting pull</text>
      <text {...caption} x={56} y={200} fill={TEXT_MUTED}>provider blocks</text>
      <text {...caption} x={56} y={214} fill={TEXT_MUTED}>on its socket write</text>

      <Panel x={232} y={96} w={176} h={136} />
      <text {...label} x={320} y={120} textAnchor="middle">highWaterMark: 8</text>
      {slots.map(i => (
        <g key={i}>
          <rect x={248 + i * 19} y={134} width={15} height={40} rx={2} fill={INK} stroke={LINE_SOFT} strokeWidth={1} />
          <rect
            x={248 + i * 19}
            y={134}
            width={15}
            height={40}
            rx={2}
            fill={ACCENT}
            fillOpacity={0.5}
            className={ANIM.grow}
            style={{ transformOrigin: `${248 + i * 19}px 154px`, animationDelay: `${i * 160}ms` }}
          />
        </g>
      ))}
      <text {...mono} x={320} y={200} textAnchor="middle" fill={ROSE} className={ANIM.blink}>desiredSize: 0</text>
      <text {...caption} x={320} y={218} textAnchor="middle" fill={TEXT_MUTED}>pull() is not called</text>

      <Panel x={456} y={96} w={144} h={136} />
      <text {...label} x={472} y={120}>slow reader</text>
      <text {...mono} x={472} y={146} fill={ACCENT}>reader.read()</text>
      <rect x={472} y={160} width={112} height={6} rx={3} fill={INK} stroke={LINE_SOFT} strokeWidth={1} />
      <rect x={472} y={160} width={40} height={6} rx={3} fill={GREEN} fillOpacity={0.8} className={ANIM.grow} style={{ transformOrigin: '472px 163px', animationDelay: '1500ms' }} />
      <text {...caption} x={472} y={190} fill={TEXT_MUTED}>phone on a bad link</text>
      <text {...caption} x={472} y={206} fill={TEXT_MUTED}>one chunk per read</text>

      <Edge uid={uid} d="M176 150H228" />
      <text {...caption} x={202} y={142} textAnchor="middle">enqueue</text>
      <path d="M228 180H180" fill="none" stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} strokeDasharray="4 4" className={ANIM.flow} markerEnd={`url(#${uid}-arrow)`} />
      <text {...caption} x={202} y={196} textAnchor="middle" fill={ROSE}>waits</text>
      <Edge uid={uid} d="M408 164H452" />
      <text {...caption} x={430} y={156} textAnchor="middle">read</text>

      <g transform="translate(176 150)"><Pulse path="M0 0 L52 0" delayMs={0} /></g>
      <g transform="translate(176 150)"><Pulse path="M0 0 L52 0" delayMs={350} /></g>
      <g transform="translate(176 150)"><Pulse path="M0 0 L52 0" delayMs={700} /></g>
      <g transform="translate(408 164)"><Pulse path="M0 0 L44 0" delayMs={1500} tone={GREEN} /></g>

      <Edge uid={uid} d="M96 264H544" />
      {events.map(([x, t, tone]) => (
        <g key={t}>
          <circle cx={x} cy={264} r={3.5} fill={tone} />
          <text {...caption} x={x} y={284} textAnchor="middle" fill={tone}>{t}</text>
        </g>
      ))}
      <text {...caption} x={320} y={312} textAnchor="middle" fill={TEXT_MUTED}>memory is bounded by the mark, not by the length of the reply</text>

      <Tag x={40} y={340} text="pull, never push" tone="accent" />
      <Tag x={158} y={340} text="CountQueuingStrategy" />
      <Tag x={306} y={340} text="reader paces the model" tone="green" />
    </CoverFrame>
  );
};

/* Figure: frames 1 to 7 delivered, the connection drops, the client resumes from 8 with Last-Event-ID. */
const ResumeOffset: CoverComponent = ({ uid, title, className }) => {
  const frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 220]}>
      <text {...caption} x={40} y={56}>Server buffer for generation g1</text>
      <text {...caption} x={600} y={56} textAnchor="end">Reconnect with Last-Event-ID: 7</text>

      {frames.map((n, i) => {
        const delivered = n <= 7;
        return (
          <g key={n}>
            <rect x={40 + i * 46} y={84} width={40} height={28} rx={4} fill={delivered ? ACCENT : INK} fillOpacity={delivered ? 0.18 : 1} stroke={delivered ? ACCENT : LINE_SOFT} strokeOpacity={delivered ? 0.6 : 1} strokeWidth={1} />
            <text {...mono} x={60 + i * 46} y={102} textAnchor="middle" fill={delivered ? ACCENT : TEXT_MUTED}>{n}</text>
          </g>
        );
      })}

      <path d="M359 76V122" stroke={ROSE} strokeOpacity={0.8} strokeWidth={1.25} strokeDasharray="3 3" />
      <g className={ANIM.blink} stroke={ROSE} strokeWidth={1.25} strokeLinecap="round">
        <path d="M355 66l8 8M363 66l-8 8" />
      </g>
      <text {...caption} x={352} y={140} textAnchor="end" fill={ROSE}>connection dropped</text>

      <path d="M40 120V126H354V120" fill="none" stroke={LINE_SOFT} strokeWidth={1.25} />
      <text {...caption} x={180} y={140} textAnchor="middle" fill={TEXT_MUTED}>delivered before the drop</text>
      <path d="M364 120V126H592V120" fill="none" stroke={LINE_SOFT} strokeWidth={1.25} />
      <text {...caption} x={478} y={140} textAnchor="middle" fill={TEXT_MUTED}>stored, not yet delivered</text>
      <Edge uid={uid} d="M500 144V160" dashed className={ANIM.flow} />

      <Panel x={40} y={164} w={200} h={96} />
      <text {...label} x={56} y={188}>client</text>
      <text {...mono} x={56} y={212} fill={ACCENT}>lastEventId = 7</text>
      <text {...caption} x={56} y={232} fill={TEXT_MUTED}>text on screen up to frame 7</text>
      <rect x={56} y={242} width={6} height={10} fill={ACCENT} className={ANIM.blink} />

      <Panel x={400} y={164} w={200} h={96} stroke={ACCENT} strokeOpacity={0.5} />
      <text {...label} x={416} y={188}>server</text>
      <text {...mono} x={416} y={212} fill={GREEN}>replay 8..12 from buffer</text>
      <text {...caption} x={416} y={232} fill={TEXT_MUTED}>then live frames, then done</text>
      <text {...caption} x={416} y={248} fill={TEXT_MUTED}>generation g1 never restarted</text>

      <Edge uid={uid} d="M240 196H396" />
      <text {...mono} x={318} y={188} textAnchor="middle" fill={ACCENT}>Last-Event-ID: 7</text>
      <Edge uid={uid} d="M400 228H244" />
      <text {...caption} x={318} y={246} textAnchor="middle" fill={GREEN}>frames 8 to 12</text>

      <g transform="translate(240 196)"><Pulse path="M0 0 L156 0" delayMs={0} /></g>
      <g transform="translate(400 228)"><Pulse path="M0 0 L-156 0" delayMs={900} tone={GREEN} /></g>
      <g transform="translate(400 228)"><Pulse path="M0 0 L-156 0" delayMs={1150} tone={GREEN} /></g>
      <g transform="translate(400 228)"><Pulse path="M0 0 L-156 0" delayMs={1400} tone={GREEN} /></g>

      <text {...caption} x={320} y={288} textAnchor="middle" fill={TEXT_MUTED}>the generation kept running; only the connection restarted</text>

      <Tag x={40} y={320} text="id on every frame" />
      <Tag x={160} y={320} text="buffer per generation id" tone="accent" />
      <Tag x={320} y={320} text="idempotent resume" tone="green" />
      <Tag x={440} y={320} text="nothing regenerated" tone="amber" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = StreamCover;

export const FIGURES: Record<string, CoverComponent> = {
  'streaming-llm-responses/abort-propagation': AbortPropagation,
  'streaming-llm-responses/backpressure': Backpressure,
  'streaming-llm-responses/resume-offset': ResumeOffset,
};
