import type { CoverComponent } from '../shared';
import * as m0 from './adinox-authenticator';
import * as m1 from './boundary-aware-losses';
import * as m2 from './enterprise-rag-pipeline';
import * as m3 from './evaluating-rag-before-tuning';
import * as m4 from './farm-digitisation-pipeline';
import * as m5 from './gpu-memory-training-budget';
import * as m6 from './hnsw-vector-index-internals';
import * as m7 from './hrnet-kishtwar-boundaries';
import * as m8 from './llm-inference-internals';
import * as m9 from './mcp-tool-server-design';
import * as m10 from './model-serving-scheduled-inference';
import * as m11 from './postgres-rls-multi-tenant';
import * as m12 from './sentinel2-crop-timeseries';
import * as m13 from './streaming-llm-responses';
import * as m14 from './tiled-inference-large-rasters';
import * as m15 from './totp-internals-authenticator';

export const ARTICLE_COVERS: Record<string, CoverComponent> = {
  'adinox-authenticator': m0.COVER,
  'boundary-aware-losses': m1.COVER,
  'enterprise-rag-pipeline': m2.COVER,
  'evaluating-rag-before-tuning': m3.COVER,
  'farm-digitisation-pipeline': m4.COVER,
  'gpu-memory-training-budget': m5.COVER,
  'hnsw-vector-index-internals': m6.COVER,
  'hrnet-kishtwar-boundaries': m7.COVER,
  'llm-inference-internals': m8.COVER,
  'mcp-tool-server-design': m9.COVER,
  'model-serving-scheduled-inference': m10.COVER,
  'postgres-rls-multi-tenant': m11.COVER,
  'sentinel2-crop-timeseries': m12.COVER,
  'streaming-llm-responses': m13.COVER,
  'tiled-inference-large-rasters': m14.COVER,
  'totp-internals-authenticator': m15.COVER,
};

export const ARTICLE_FIGURES: Record<string, CoverComponent> = {
  ...m0.FIGURES,
  ...m1.FIGURES,
  ...m2.FIGURES,
  ...m3.FIGURES,
  ...m4.FIGURES,
  ...m5.FIGURES,
  ...m6.FIGURES,
  ...m7.FIGURES,
  ...m8.FIGURES,
  ...m9.FIGURES,
  ...m10.FIGURES,
  ...m11.FIGURES,
  ...m12.FIGURES,
  ...m13.FIGURES,
  ...m14.FIGURES,
  ...m15.FIGURES,
};
