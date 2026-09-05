'use client';
import { useId } from 'react';
import { CoverFrame, Panel, Tag, label, type CoverComponent } from './shared';
import { AGRI_COVERS } from './projects/agri';
import { ML_COVERS } from './projects/ml';
import { LLM_COVERS } from './projects/llm';
import { PRODUCT_COVERS } from './projects/products';
import { HRNET_COVER } from './projects/hrnet';

const REGISTRY: Record<string, CoverComponent> = {
  ...AGRI_COVERS,
  ...ML_COVERS,
  ...LLM_COVERS,
  ...PRODUCT_COVERS,
  ...HRNET_COVER,
};

const Fallback: CoverComponent = ({ uid, title, className }) => (
  <CoverFrame uid={uid} title={title} className={className}>
    <Panel x={224} y={124} w={192} h={112} r={12} />
    <text x={320} y={186} textAnchor="middle" {...label}>{title.slice(0, 28)}</text>
    <Tag x={280} y={214} text="Project" tone="accent" />
  </CoverFrame>
);

export function hasProjectCover(id: string) {
  return id in REGISTRY;
}

export function ProjectCover({ id, title, className }: { id: string; title: string; className?: string }) {
  const uid = `pc-${id}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Cover = REGISTRY[id] ?? Fallback;
  return <Cover uid={uid} title={title} className={className} />;
}
