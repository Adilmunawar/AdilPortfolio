import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { serviceGlyphs, type ServiceGlyphKey } from './covers/ServiceGlyphs';

type Service = {
  id: string;
  glyph: ServiceGlyphKey;
  title: string;
  positioning: string;
  deliverables: string[];
  stack: string[];
  engagement: string;
};

const services: Service[] = [
  {
    id: 'ml',
    glyph: 'ml',
    title: 'Machine learning & remote sensing',
    positioning: 'Field and crop maps from satellite imagery, delivered as models you can run.',
    deliverables: [
      'Field-boundary and crop-type models (HRNet, U-Net, LSTM)',
      'Evaluation report with metrics and failure cases',
      'FastAPI inference service, containerised',
      'Training code and experiment tracking (MLflow)',
    ],
    stack: ['PyTorch', 'Sentinel-2', 'Rasterio', 'GDAL', 'GeoPandas', 'MLflow'],
    engagement: 'Fixed-scope model build or monthly retainer',
  },
  {
    id: 'rag',
    glyph: 'rag',
    title: 'RAG & agentic systems',
    positioning: 'Language-model systems grounded in your own documents and internal APIs.',
    deliverables: [
      'RAG pipeline with hybrid search and inline citations',
      'MCP tool server with typed, schema-validated tools',
      'Guardrails, evaluation set and cost controls',
    ],
    stack: ['LangChain', 'pgvector', 'MCP', 'Claude API', 'Gemini', 'Redis'],
    engagement: 'Fixed-scope build or monthly retainer',
  },
  {
    id: 'product',
    glyph: 'product',
    title: 'Full-stack products',
    positioning: 'Web products that put models and maps in front of the people who need them.',
    deliverables: [
      'Next.js and Supabase product, deployed on Vercel',
      'Dashboards and internal tools for model outputs',
      'Source, tests and hand-over notes',
    ],
    stack: ['Next.js', 'TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Vercel'],
    engagement: 'Fixed-scope build or ongoing product work',
  },
  {
    id: 'data',
    glyph: 'data',
    title: 'Data & cloud engineering',
    positioning: 'Pipelines that turn raw imagery and tables into queryable, monitored data.',
    deliverables: [
      'PostGIS pipelines from raw imagery to vector parcels',
      'Scheduled inference jobs over areas of interest',
      'Run logging, drift checks and monitoring',
      'Docker images and CI for repeatable deploys',
    ],
    stack: ['Docker', 'FastAPI', 'PostGIS', 'Airflow', 'GDAL', 'Azure'],
    engagement: 'Fixed-scope pipeline or monthly retainer',
  },
];

const steps = [
  { title: 'Discovery call', text: 'A short call on the problem, the data you already have and what a good result looks like.' },
  { title: 'Scoped proposal', text: 'A written scope with deliverables, assumptions and the engagement model, before any work starts.' },
  { title: 'Build in weekly increments', text: 'Short cycles with something to review at the end of each, so course corrections stay cheap.' },
  { title: 'Hand-over with docs', text: 'Source, environment setup, run instructions and a walkthrough so your team owns the result.' },
];

const HAIRLINE = 'bg-[linear-gradient(135deg,rgba(92,157,255,0.28),rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.05))]';
const HAIRLINE_HOVER = 'bg-[linear-gradient(135deg,rgba(92,157,255,0.7),rgba(255,255,255,0.18)_45%,rgba(92,157,255,0.3))]';
const DOT_GRID =
  'bg-[radial-gradient(rgba(255,255,255,0.11)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(70%_80%_at_50%_50%,#000_30%,transparent_100%)]';

const Check = () => (
  <span aria-hidden className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text">
    <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  </span>
);

const ServicesSection = () => {
  return (
    <section id="services" className="px-5 py-16 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-page">
        <Reveal className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-12">
          <div className="max-w-prose">
            <p className="text-small font-medium text-secondary">Services</p>
            <h2 className="mt-2 text-h2 text-primary">What I do</h2>
            <p className="mt-3 text-lede text-secondary">Four kinds of work I take on, from a single model to a shipped product.</p>
          </div>
          <a href="#contact" className="btn-secondary focus-ring h-11 shrink-0 self-start md:h-10 md:self-auto">
            Get in touch
          </a>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {services.map((service, i) => {
            const Glyph = serviceGlyphs[service.glyph];
            return (
              <Reveal key={service.id} delay={Math.min(i, 2) * 60} className="min-w-0">
                <article className={`group relative h-full rounded-[13px] p-px transition-transform duration-200 ease-out-quart md:hover:-translate-y-0.5 ${HAIRLINE}`}>
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 rounded-[13px] opacity-0 transition-opacity duration-200 ease-out-quart md:group-hover:opacity-100 ${HAIRLINE_HOVER}`}
                  />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-bg-1">
                    <div className="relative aspect-[2/1] w-full border-b border-subtle">
                      <span aria-hidden className={`absolute inset-0 ${DOT_GRID}`} />
                      <div className="absolute inset-0 p-4 sm:p-5 lg:p-6">
                        <Glyph uid={`svc-${service.id}`} className="mx-auto h-full w-full max-w-[460px]" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-8">
                      <h3 className="text-h3 text-primary">{service.title}</h3>
                      <p className="mt-2 text-body text-secondary">{service.positioning}</p>

                      <ul className="mt-5 space-y-2">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex gap-2.5 text-small text-secondary">
                            <Check />
                            <span className="min-w-0">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex flex-wrap items-center gap-1.5">
                        <span className="mr-1 text-caption text-tertiary">Stack</span>
                        {service.stack.map((tech) => (
                          <span key={tech} className="inline-flex h-6 items-center rounded-xs border border-subtle bg-bg-2 px-2 text-caption text-secondary">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <p className="mt-5 text-small text-tertiary">
                        <span className="text-secondary">Engagement</span> · {service.engagement}
                      </p>

                      <div className="mt-auto border-t border-subtle pt-4">
                        <a
                          href="#contact"
                          className="focus-ring group/link -my-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-md text-small font-medium text-accent-text transition-colors duration-150 ease-standard md:hover:text-[#8ab8ff]"
                        >
                          Start a conversation
                          <ArrowRight size={16} strokeWidth={1.75} aria-hidden className="transition-transform duration-200 ease-out-quart md:group-hover/link:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 lg:mt-14">
          <div className="rounded-[13px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-px">
            <div className="rounded-lg bg-bg-1 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-h3 text-primary">How an engagement runs</h3>
                <p className="text-small text-tertiary">Scope first, then short increments you can review.</p>
              </div>
              <ol className="mt-6 grid gap-6 md:grid-cols-4 lg:mt-8">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4 md:block md:pt-7">
                    <span aria-hidden className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-accent-text bg-bg-1 md:absolute md:left-0 md:top-0 md:mt-0" />
                    {i < steps.length - 1 && (
                      <>
                        <span aria-hidden className="absolute -bottom-[30px] left-[5.5px] top-[18px] w-px bg-white/10 md:hidden" />
                        <span aria-hidden className="absolute -right-6 left-3 top-[5.5px] hidden h-px bg-white/10 md:block" />
                      </>
                    )}
                    <div className="min-w-0">
                      <p className="font-mono text-mono text-tertiary">0{i + 1}</p>
                      <p className="mt-1 text-body font-medium text-primary">{step.title}</p>
                      <p className="mt-1 text-small text-secondary">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ServicesSection;
