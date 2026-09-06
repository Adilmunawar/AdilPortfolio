'use client';
import type { CSSProperties } from 'react';
import { ACCENT, AMBER, caption, CoverFrame, delay, Edge, GREEN, label, LINE, LINE_SOFT, mono, NODE_FILL_2, Panel, ROSE, Tag, TEXT_MUTED, type CoverComponent } from '../shared';

/* SPEED is px per ms of the 16px pulse dash; rls-stop parks it 86px along its edge, inside the gate. */
const SPEED = 0.1;
const STYLE = `
.rls-hl,.rls-cur{opacity:0}
@media (hover: hover) and (min-width: 768px){
.cover-live .rls-stop{animation:rls-stop 8s linear infinite}
.cover-live .rls-run{animation:rls-run 8s linear infinite}
.cover-live .rls-cur{animation:rls-scan 8s linear infinite}
.cover-live .rls-show{animation:rls-show 8s linear infinite backwards}
}
@media (prefers-reduced-motion: reduce){.rls-stop,.rls-run,.rls-cur,.rls-show{animation:none !important}}
@keyframes rls-stop{0%{stroke-dashoffset:18;opacity:1}11%{stroke-dashoffset:-70}17%{stroke-dashoffset:-70;opacity:1}21%{stroke-dashoffset:-70;opacity:0}100%{stroke-dashoffset:-70;opacity:0}}
@keyframes rls-run{0%{stroke-dashoffset:18}64%{stroke-dashoffset:-494}100%{stroke-dashoffset:-494}}
@keyframes rls-scan{0%{transform:translate(0,0);opacity:0}2%{opacity:1}44%{transform:translate(calc(var(--rls-dx,0)*1px),calc(var(--rls-dy,0)*1px));opacity:1}47%{opacity:0}100%{transform:translate(calc(var(--rls-dx,0)*1px),calc(var(--rls-dy,0)*1px));opacity:0}}
@keyframes rls-show{0%{opacity:var(--rls-off,0.3)}4%{opacity:1}84%{opacity:1}90%{opacity:var(--rls-off,0.3)}100%{opacity:var(--rls-off,0.3)}}
`;

const show = (ms: number): CSSProperties => delay(ms);
const light = (ms: number): CSSProperties => ({ ...delay(ms), '--rls-off': '0' } as CSSProperties);

function cubicLen(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  let len = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const u = 1 - t;
    const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
    const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len;
}
/* Length of the S bend used between panels: C(dx/2 0, dx/2 dy, dx dy). */
const bendLen = (dx: number, dy: number) => cubicLen(0, 0, dx / 2, 0, dx / 2, dy, dx, dy);

function Pulse({ d, tone, ms, stop = false }: { d: string; tone: string; ms: number; stop?: boolean }) {
  return <path d={d} fill="none" stroke={tone} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="16 1000" className={stop ? 'rls-stop' : 'rls-run'} style={delay(ms)} />;
}

function Cursor({ x, y, w, h, dx = 0, dy = 0, ms }: { x: number; y: number; w: number; h: number; dx?: number; dy?: number; ms: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={3} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1} className="rls-cur" style={{ ...delay(ms), '--rls-dx': String(dx), '--rls-dy': String(dy) } as CSSProperties} />
  );
}

/* A heap row: tenant stripe on the left, name on the right. */
function Row({ x, y, w, tenant, name, tone, className, style }: { x: number; y: number; w: number; tenant: string; name: string; tone: string; className?: string; style?: CSSProperties }) {
  return (
    <g className={className} style={style}>
      <rect x={x} y={y} width={w} height={18} rx={3} fill={NODE_FILL_2} stroke={LINE_SOFT} strokeWidth={1} />
      <rect x={x} y={y} width={4} height={18} rx={2} fill={tone} fillOpacity={0.9} />
      <text {...mono} x={x + 12} y={y + 12.5} fill={tone}>{tenant}</text>
      <text {...mono} x={x + 26} y={y + 12.5}>{name}</text>
    </g>
  );
}

const HEAP: [string, string][] = [
  ['A', 'acme one'], ['B', 'globex one'], ['A', 'acme two'], ['B', 'globex two'],
  ['A', 'acme three'], ['B', 'globex three'], ['A', 'acme four'], ['B', 'globex four'],
];

/* Cover: a select from tenant A passes the policy gate; tenant B rows stop inside it. */
const Cover: CoverComponent = ({ uid, title, className }) => {
  const rows = HEAP.slice(0, 6);
  const rowY = (i: number) => 88 + i * 30;
  const visit = (i: number) => 500 + i * 704;
  let out = 0;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 170, 220]}>
      <style>{STYLE}</style>
      <text {...caption} x={40} y={44}>select from projects as a member of tenant A</text>
      <text {...caption} x={600} y={44} textAnchor="end">Rows returned</text>

      <Panel x={40} y={56} w={176} h={240} />
      <text {...caption} x={56} y={76}>heap: projects</text>
      {rows.map(([t, n], i) => (
        <Row key={n} x={56} y={rowY(i)} w={144} tenant={t} name={n} tone={t === 'A' ? GREEN : ROSE} />
      ))}
      <Cursor x={56} y={rowY(0)} w={144} h={18} dy={rowY(5) - rowY(0)} ms={visit(0)} />

      <Panel x={248} y={56} w={144} h={240} />
      <text {...caption} x={264} y={76}>policy gate</text>
      <text {...mono} x={264} y={104} fill={ACCENT}>using (</text>
      <text {...mono} x={264} y={118} fill={ACCENT}> tenant_id = any(</text>
      <text {...mono} x={264} y={132} fill={ACCENT}>  (select app.</text>
      <text {...mono} x={264} y={146} fill={ACCENT}>   my_tenant_ids())</text>
      <text {...mono} x={264} y={160} fill={ACCENT}>)</text>
      <g className="rls-show" style={show(0)}>
        <text {...mono} x={264} y={190} fill={GREEN}>$0 = {'{A}'}</text>
        <text {...caption} x={264} y={206}>resolved once</text>
      </g>
      <text {...caption} x={264} y={256} fill={ROSE} className="rls-show" style={show(visit(1) + 1000)}>B rows: using is false</text>
      <text {...caption} x={264} y={272} fill={GREEN} className="rls-show" style={show(visit(0) + 1000)}>A rows: using is true</text>

      <Panel x={424} y={56} w={176} h={240} />
      <text {...caption} x={440} y={76}>result</text>
      {rows.map(([t, n], i) => {
        if (t !== 'A') return null;
        const j = out++;
        const y0 = rowY(i) + 9;
        const y1 = rowY(j) + 9;
        const leave = visit(i) + 1400;
        const arrive = leave + (106 + bendLen(48, y1 - y0)) / SPEED;
        return (
          <g key={n}>
            <Row x={440} y={rowY(j)} w={144} tenant={t} name={n} tone={GREEN} className="rls-show" style={show(arrive)} />
            <Edge d={`M200 ${y0}H248`} opacity={0.7} />
            <Edge d={`M392 ${y0}C416 ${y0} 416 ${y1} 440 ${y1}`} opacity={0.7} />
            <Pulse d={`M200 ${y0}H286`} tone={GREEN} ms={visit(i)} stop />
            <Pulse d={`M286 ${y0}H392C416 ${y0} 416 ${y1} 440 ${y1}`} tone={GREEN} ms={leave} />
          </g>
        );
      })}
      {rows.map(([t, n], i) => {
        if (t !== 'B') return null;
        const y0 = rowY(i) + 9;
        return (
          <g key={n}>
            <Edge d={`M200 ${y0}H248`} dashed opacity={0.5} />
            <Pulse d={`M200 ${y0}H286`} tone={ROSE} ms={visit(i)} stop />
          </g>
        );
      })}

      <Tag x={40} y={324} text="USING per row" tone="accent" />
      <Tag x={140} y={324} text="WITH CHECK per write" tone="amber" />
      <Tag x={274} y={324} text="InitPlan, not per row call" tone="green" />
      <Tag x={438} y={324} text="service role bypasses" tone="rose" />
    </CoverFrame>
  );
};

/* Figure 1: eight heap rows through the USING gate; the four from tenant A reach the result. */
const PolicyGate: CoverComponent = ({ uid, title, className }) => {
  const rowY = (i: number) => 88 + i * 26;
  const visit = (i: number) => 500 + i * 503;
  let out = 0;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 220]}>
      <style>{STYLE}</style>
      <text {...caption} x={40} y={44}>select id, name from projects, caller belongs to tenant A</text>
      <text {...caption} x={600} y={44} textAnchor="end">Result set</text>

      <Panel x={40} y={56} w={176} h={256} />
      <text {...caption} x={56} y={76}>heap: rows the scan visits</text>
      {HEAP.map(([t, n], i) => (
        <Row key={n} x={56} y={rowY(i)} w={144} tenant={t} name={n} tone={t === 'A' ? GREEN : ROSE} />
      ))}
      <Cursor x={56} y={rowY(0)} w={144} h={18} dy={rowY(7) - rowY(0)} ms={visit(0)} />

      <Panel x={248} y={56} w={144} h={256} />
      <text {...caption} x={264} y={76}>policy for select</text>
      <text {...mono} x={264} y={104} fill={ACCENT}>using (</text>
      <text {...mono} x={264} y={118} fill={ACCENT}> tenant_id = any(</text>
      <text {...mono} x={264} y={132} fill={ACCENT}>  (select app.</text>
      <text {...mono} x={264} y={146} fill={ACCENT}>   my_tenant_ids())</text>
      <text {...mono} x={264} y={160} fill={ACCENT}>)</text>
      <g className="rls-show" style={show(0)}>
        <text {...mono} x={264} y={190} fill={GREEN}>$0 = {'{A}'}</text>
        <text {...caption} x={264} y={206}>InitPlan, evaluated once</text>
      </g>
      <text {...caption} x={264} y={256} fill={ROSE} className="rls-show" style={show(visit(1) + 1000)}>B rows: using is false</text>
      <text {...caption} x={264} y={272} fill={GREEN} className="rls-show" style={show(visit(0) + 1000)}>A rows: using is true</text>
      <text {...caption} x={264} y={292} fill={TEXT_MUTED}>dropped rows never</text>
      <text {...caption} x={264} y={306} fill={TEXT_MUTED}>leave the scan</text>

      <Panel x={424} y={56} w={176} h={256} />
      <text {...caption} x={440} y={76}>rows returned to the client</text>
      {HEAP.map(([t, n], i) => {
        if (t !== 'A') return null;
        const j = out++;
        const y0 = rowY(i) + 9;
        const y1 = rowY(j) + 9;
        const leave = visit(i) + 1400;
        const arrive = leave + (106 + bendLen(48, y1 - y0)) / SPEED;
        return (
          <g key={n}>
            <Row x={440} y={rowY(j)} w={144} tenant={t} name={n} tone={GREEN} className="rls-show" style={show(arrive)} />
            <Edge d={`M200 ${y0}H248`} opacity={0.7} />
            <Edge d={`M392 ${y0}C416 ${y0} 416 ${y1} 440 ${y1}`} opacity={0.7} />
            <Pulse d={`M200 ${y0}H286`} tone={GREEN} ms={visit(i)} stop />
            <Pulse d={`M286 ${y0}H392C416 ${y0} 416 ${y1} 440 ${y1}`} tone={GREEN} ms={leave} />
          </g>
        );
      })}
      {HEAP.map(([t, n], i) => {
        if (t !== 'B') return null;
        const y0 = rowY(i) + 9;
        return (
          <g key={n}>
            <Edge d={`M200 ${y0}H248`} dashed opacity={0.5} />
            <Pulse d={`M200 ${y0}H286`} tone={ROSE} ms={visit(i)} stop />
          </g>
        );
      })}

      <Tag x={40} y={334} text="USING evaluated per row" tone="accent" />
      <Tag x={189} y={334} text="InitPlan $0 once" tone="green" />
      <Tag x={299} y={334} text="other tenants never leave the scan" tone="rose" />
    </CoverFrame>
  );
};

/* Figure 2: a correlated subplan fans one call per row into the membership check; the InitPlan form calls once. */
const InitPlanVsPerRow: CoverComponent = ({ uid, title, className }) => {
  const cells = Array.from({ length: 12 }, (_, i) => 56 + i * 24);
  const matching = [0, 3, 6, 9];
  const isMatch = new Set(matching);
  const visit = (i: number) => 400 + i * 320;
  const probe = (cx: number) => `M${cx + 10} 106C${cx + 10} 150 380 150 416 99`;
  const firstHit = visit(0) + cubicLen(cells[0] + 10, 106, cells[0] + 10, 150, 380, 150, 416, 99) / SPEED;
  const paramAt = 600 + 68 / SPEED;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 240]}>
      <style>{STYLE}</style>
      <text {...caption} x={40} y={44}>Correlated subquery in the policy</text>
      <text {...caption} x={600} y={44} textAnchor="end">one membership probe per row</text>

      <Panel x={40} y={56} w={560} h={120} />
      <text {...label} x={56} y={78}>Seq Scan on projects</text>
      {cells.map((cx, i) => (
        <g key={cx}>
          <rect x={cx} y={92} width={20} height={14} rx={2} fill={isMatch.has(i) ? GREEN : ROSE} fillOpacity={isMatch.has(i) ? 0.55 : 0.35} stroke={LINE_SOFT} strokeWidth={1} />
          <path d={probe(cx)} fill="none" stroke={LINE} strokeWidth={1} opacity={0.6} />
          <rect x={cx} y={92} width={20} height={14} rx={2} fill="#fff" fillOpacity={0.22} className="rls-hl rls-show" style={light(visit(i))} />
          <Pulse d={probe(cx)} tone={ROSE} ms={visit(i)} />
        </g>
      ))}
      <Cursor x={cells[0]} y={92} w={20} h={14} dx={cells[11] - cells[0]} ms={visit(0)} />
      <rect x={420} y={84} width={164} height={30} rx={4} fill={NODE_FILL_2} stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} />
      <rect x={420} y={84} width={164} height={30} rx={4} fill="none" stroke={ROSE} strokeWidth={2} className="rls-hl rls-show" style={light(firstHit)} />
      <text {...mono} x={428} y={97} fill={ROSE}>SubPlan 1</text>
      <text {...caption} x={428} y={109}>memberships probe + auth.uid()</text>
      <text {...mono} x={420} y={136} fill={ROSE}>calls: 12, one per row visited</text>
      <text {...mono} x={420} y={150} fill={TEXT_MUTED}>its own policy runs each time</text>
      <text {...mono} x={56} y={166} fill={ROSE}>Filter: (SubPlan 1)</text>

      <text {...caption} x={40} y={188}>InitPlan in the policy</text>
      <text {...caption} x={600} y={188} textAnchor="end">one lookup, then the index</text>

      <Panel x={40} y={200} w={560} h={120} />
      <text {...label} x={56} y={222}>Index Scan using projects_tenant_idx</text>
      {cells.map((cx, i) => (
        <rect key={cx} x={cx} y={236} width={20} height={14} rx={2} fill={isMatch.has(i) ? GREEN : 'none'} fillOpacity={0.55} stroke={isMatch.has(i) ? GREEN : LINE_SOFT} strokeOpacity={isMatch.has(i) ? 0.8 : 1} strokeWidth={1} strokeDasharray={isMatch.has(i) ? undefined : '2 2'} />
      ))}
      {matching.map((i, k) => (
        <rect key={i} x={cells[i]} y={236} width={20} height={14} rx={2} fill="#fff" fillOpacity={0.22} className="rls-hl rls-show" style={light(paramAt + 200 + k * 400)} />
      ))}
      <rect x={420} y={228} width={164} height={30} rx={4} fill={NODE_FILL_2} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1.25} />
      <rect x={420} y={228} width={164} height={30} rx={4} fill="none" stroke={GREEN} strokeWidth={2} className="rls-hl rls-show" style={light(400)} />
      <text {...mono} x={428} y={241} fill={GREEN}>InitPlan 1 (returns $0)</text>
      <text {...caption} x={428} y={253}>app.my_tenant_ids() as a param</text>
      <Edge uid={uid} d="M420 243H352" />
      <Pulse d="M420 243H352" tone={GREEN} ms={600} />
      <text {...mono} x={420} y={280} fill={GREEN}>calls: 1 per statement</text>
      <text {...mono} x={420} y={294} fill={TEXT_MUTED}>only matching rows are visited</text>
      <text {...mono} x={56} y={280} fill={GREEN} className="rls-show" style={show(paramAt)}>Index Cond: (tenant_id = ANY ($0))</text>
      <text {...mono} x={56} y={294} fill={TEXT_MUTED}>dashed cells are skipped by the index</text>

      <Tag x={40} y={340} text="per row: N calls, N policy checks on memberships" tone="rose" />
      <Tag x={323} y={340} text="once: parameter $0 reused by every row" tone="green" />
    </CoverFrame>
  );
};

/* Figure 3: two inserts from a tenant B member; the cross tenant one stops at WITH CHECK, the other lands in the heap. */
const WithCheckWrite: CoverComponent = ({ uid, title, className }) => {
  const rowY = (i: number) => 88 + i * 26;
  const yNew = rowY(3) + 9;
  const send1 = 400;
  const send2 = 2900;
  const commit = send2 + 1400;
  const landed = commit + (134 + bendLen(32, yNew - 239)) / SPEED;
  return (
    <CoverFrame uid={uid} title={title} className={className} glow={[320, 180, 220]}>
      <style>{STYLE}</style>
      <text {...caption} x={40} y={44}>insert into projects, caller belongs to tenant B</text>
      <text {...caption} x={600} y={44} textAnchor="end">Heap</text>

      <Panel x={40} y={56} w={160} h={256} />
      <text {...caption} x={52} y={72}>client, jwt sub = user 2</text>
      <rect x={52} y={84} width={136} height={50} rx={4} fill={NODE_FILL_2} stroke={ROSE} strokeOpacity={0.7} strokeWidth={1.25} />
      <rect x={52} y={84} width={136} height={50} rx={4} fill="none" stroke={ROSE} strokeWidth={2} className="rls-hl rls-show" style={light(send1 - 100)} />
      <text {...mono} x={60} y={98}>insert into projects</text>
      <text {...mono} x={60} y={112}>(tenant_id, name)</text>
      <text {...mono} x={60} y={126} fill={ROSE}>values (A, 'smuggled')</text>
      <text {...caption} x={52} y={166} fill={TEXT_MUTED}>member of B only, so</text>
      <text {...caption} x={52} y={180} fill={TEXT_MUTED}>my_tenant_ids() = {'{B}'}</text>
      <rect x={52} y={214} width={136} height={50} rx={4} fill={NODE_FILL_2} stroke={GREEN} strokeOpacity={0.7} strokeWidth={1.25} />
      <rect x={52} y={214} width={136} height={50} rx={4} fill="none" stroke={GREEN} strokeWidth={2} className="rls-hl rls-show" style={light(send2 - 100)} />
      <text {...mono} x={60} y={228}>insert into projects</text>
      <text {...mono} x={60} y={242}>(tenant_id, name)</text>
      <text {...mono} x={60} y={256} fill={GREEN}>values (B, 'ours')</text>
      <text {...caption} x={52} y={292} fill={TEXT_MUTED}>same role, same grants</text>

      <Panel x={232} y={56} w={176} h={256} />
      <text {...caption} x={248} y={72}>policy for insert</text>
      <text {...mono} x={248} y={126} fill={AMBER}>with check (</text>
      <text {...mono} x={248} y={140} fill={AMBER}> tenant_id = any(</text>
      <text {...mono} x={248} y={154} fill={AMBER}>  (select app.</text>
      <text {...mono} x={248} y={168} fill={AMBER}>   my_tenant_ids()))</text>
      <text {...mono} x={248} y={182} fill={AMBER}> and created_by =</text>
      <text {...mono} x={248} y={196} fill={AMBER}>  (select auth.uid())</text>
      <text {...mono} x={248} y={210} fill={AMBER}>)</text>
      <text {...mono} x={248} y={230} fill={GREEN} className="rls-show" style={show(0)}>$0 = {'{B}'}</text>
      <text {...caption} x={248} y={288} fill={ROSE} className="rls-show" style={show(send1 + 1000)}>A not in {'{B}'}: raise 42501</text>
      <text {...caption} x={248} y={302} fill={GREEN} className="rls-show" style={show(send2 + 1000)}>B in {'{B}'}: row written</text>

      <Edge d="M188 109H232" opacity={0.7} />
      <g className="rls-show" style={show(send1 + 1000)}>
        <path d="M325 105L331 111M331 105L325 111" stroke={ROSE} strokeWidth={1.5} strokeLinecap="round" />
        <text {...mono} x={338} y={112.5} fill={ROSE}>42501</text>
      </g>
      <Pulse d="M188 109H274" tone={ROSE} ms={send1} stop />

      <Edge d="M188 239H232" opacity={0.7} />
      <Edge uid={uid} d={`M408 239C424 239 424 ${yNew} 440 ${yNew}`} opacity={0.7} />
      <Pulse d="M188 239H274" tone={GREEN} ms={send2} stop />
      <Pulse d={`M274 239H408C424 239 424 ${yNew} 440 ${yNew}`} tone={GREEN} ms={commit} />

      <Panel x={440} y={56} w={160} h={256} />
      <text {...caption} x={452} y={72}>projects, tenant B rows</text>
      <Row x={452} y={rowY(0)} w={136} tenant="B" name="globex one" tone={GREEN} />
      <Row x={452} y={rowY(1)} w={136} tenant="B" name="globex two" tone={GREEN} />
      <Row x={452} y={rowY(2)} w={136} tenant="B" name="globex three" tone={GREEN} />
      <Row x={452} y={rowY(3)} w={136} tenant="B" name="ours" tone={GREEN} className="rls-show" style={show(landed)} />
      <text {...caption} x={452} y={rowY(4) + 12} fill={GREEN} className="rls-show" style={show(landed + 150)}>new row committed</text>
      <text {...caption} x={452} y={rowY(5) + 12} fill={TEXT_MUTED}>no row for 'smuggled':</text>
      <text {...caption} x={452} y={rowY(5) + 26} fill={TEXT_MUTED}>the statement raised</text>
      <text {...caption} x={452} y={rowY(5) + 40} fill={TEXT_MUTED}>before the heap was touched</text>

      <Tag x={40} y={334} text="USING: rows you may see" />
      <Tag x={189} y={334} text="WITH CHECK: rows you may create" tone="accent" />
      <Tag x={383} y={334} text="42501 insufficient_privilege" tone="rose" />
    </CoverFrame>
  );
};

export const COVER: CoverComponent = Cover;

export const FIGURES: Record<string, CoverComponent> = {
  'postgres-rls-multi-tenant/policy-gate': PolicyGate,
  'postgres-rls-multi-tenant/initplan-vs-per-row': InitPlanVsPerRow,
  'postgres-rls-multi-tenant/with-check-write': WithCheckWrite,
};
