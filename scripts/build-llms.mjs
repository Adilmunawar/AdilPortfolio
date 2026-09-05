// Generates public/llms.txt, public/llms-full.txt and public/ai-profile.json
// from the site's data files so AI crawlers and search engines get the same
// facts the pages show. Runs on `npm run build` via the "prebuild" script.
//
// Sources: src/lib/projects.json, case-studies.json, blog-data.json,
// leetcode-stats.json, github-contributions.json, zenith-knowledge.ts and the
// literal arrays in ServicesSection, SkillsSection, Achievements,
// BadgesShowcase and ContactSection. Output is deterministic for a given set
// of inputs; nothing here is fetched or dated from the wall clock.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://adilmunawar.vercel.app';

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));

// ---------------------------------------------------------------------------
// Static profile facts (mirrors HeroSection, ContactSection and layout.tsx)
// ---------------------------------------------------------------------------

const PROFILE = {
  name: 'Adil Munawar',
  alternateNames: ['AdilMunawarX', 'Adil Khokhar'],
  headline: 'Machine-learning engineer for agricultural remote sensing · full-stack developer',
  lede:
    'I train segmentation and time-series models on satellite imagery to map fields and crops, and build the web products that put those maps in front of people.',
  roles: [
    'Machine Learning Engineer — agricultural remote sensing',
    'Project Lead & Web Developer at Nexsus Orbits',
    'Database Administrator at AOS',
  ],
  organizations: [
    { name: 'Nexsus Orbits', url: 'https://nexsusorbits.com' },
    { name: 'AOS', url: null },
  ],
  education: 'Govt. Islamia Graduate College Civil Lines, Lahore',
  location: { city: 'Lahore', region: 'Punjab', country: 'Pakistan', countryCode: 'PK', timezone: 'UTC+5' },
  availability: 'Available for new engagements; remote worldwide. Email is best; replies within a day.',
  awards: [
    'LeetCode Top 5% Global Solver',
    'GitHub Achievement: Pull Shark (Gold)',
    'GitHub Achievement: Pair Extraordinaire (Gold)',
    'GitHub Achievement: Galaxy Brain (Silver)',
    'Google Ads Apps Certification (2025)',
    'AWS Building Language Models (2025)',
    'Microsoft Azure Cloud Computing (2025)',
  ],
  sameAs: [
    'https://github.com/AdilMunawar',
    'https://www.linkedin.com/in/adilmunawar/',
    'https://x.com/adilmunawarx',
    'https://dev.to/adilmunawar',
    'https://leetcode.com/u/AdilMunawar/',
    'https://www.instagram.com/adilmunawarx/',
  ],
};

// ---------------------------------------------------------------------------
// Lightweight extraction of literal arrays from TSX/TS source
// ---------------------------------------------------------------------------

const STR = `(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)"|\`((?:[^\`\\\\]|\\\\.)*)\`)`;
const unescape = (s) => s.replace(/\\(['"`\\])/g, '$1');

/** Text of `const NAME = [ ... ];` (first match). */
function sliceArray(src, name) {
  const m = src.match(new RegExp(`const\\s+${name}\\b[^=]*=\\s*\\[`));
  if (!m) throw new Error(`Array ${name} not found`);
  const open = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']' && --depth === 0) return src.slice(open + 1, i);
  }
  throw new Error(`Array ${name} is not closed`);
}

/** Split an array body into the text of each top-level `{ ... }` object. */
function objects(body) {
  const out = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '{') {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && start >= 0) out.push(body.slice(start, i));
    }
  }
  return out;
}

function field(block, name) {
  const m = block.match(new RegExp(`\\b${name}\\s*:\\s*${STR}`));
  if (!m) return null;
  return unescape(m[1] ?? m[2] ?? m[3] ?? '');
}

function strings(text) {
  const re = new RegExp(STR, 'g');
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push(unescape(m[1] ?? m[2] ?? m[3] ?? ''));
  return out;
}

function stringArrayField(block, name) {
  const m = block.match(new RegExp(`\\b${name}\\s*:\\s*\\[([^\\]]*)\\]`));
  return m ? strings(m[1]) : [];
}

function nonEmpty(list, what) {
  if (!list.length) throw new Error(`No ${what} extracted; source layout changed?`);
  return list;
}

// ---------------------------------------------------------------------------
// Load data
// ---------------------------------------------------------------------------

const projects = json('src/lib/projects.json');
const caseStudies = json('src/lib/case-studies.json');
const notes = json('src/lib/blog-data.json');
const leetcode = json('src/lib/leetcode-stats.json');
const github = json('src/lib/github-contributions.json');

const servicesSrc = read('src/components/ServicesSection.tsx');
const services = nonEmpty(
  objects(sliceArray(servicesSrc, 'services')).map((b) => ({
    title: field(b, 'title'),
    description: field(b, 'description'),
    deliverable: field(b, 'deliverable'),
  })),
  'services',
);

const skillsSrc = read('src/components/SkillsSection.tsx');
const toolkit = nonEmpty(
  objects(sliceArray(skillsSrc, 'toolkit')).map((b) => ({
    group: field(b, 'group'),
    items: stringArrayField(b, 'items'),
  })),
  'toolkit groups',
);

const certSrc = read('src/components/Achievements.tsx');
const certifications = nonEmpty(
  objects(sliceArray(certSrc, 'certificates')).map((b) => ({
    name: field(b, 'alt'),
    issuer: field(b, 'issuer'),
    description: field(b, 'description'),
    image: `${SITE}${field(b, 'src')}`,
  })),
  'certificates',
);

const badgeSrc = read('src/components/BadgesShowcase.tsx');
const badgeGroups = nonEmpty(
  objects(sliceArray(badgeSrc, 'GROUPS')).map((b) => {
    const title = field(b, 'title');
    const ref = b.match(/badges\s*:\s*([A-Z_]+)/)?.[1];
    if (!ref) throw new Error(`Badge group ${title} has no array reference`);
    const badges = objects(sliceArray(badgeSrc, ref)).map((x) => field(x, 'alt'));
    return { group: title, badges: nonEmpty(badges, `badges in ${title}`) };
  }),
  'badge groups',
);

const contactSrc = read('src/components/ContactSection.tsx');
const EMAIL = strings(contactSrc.match(/const EMAIL\s*=\s*[^;]+;/)[0])[0];
// Inline the EMAIL constant so `handle: EMAIL` and `mailto:${EMAIL}` read as literals.
const contactInlined = contactSrc.replaceAll('${EMAIL}', EMAIL).replace(/:\s*EMAIL\b/g, `: '${EMAIL}'`);
const contact = nonEmpty(
  objects(sliceArray(contactInlined, 'channels')).map((b) => ({
    label: field(b, 'label'),
    handle: field(b, 'handle'),
    href: field(b, 'href'),
  })),
  'contact channels',
);

const zenithSrc = read('src/lib/zenith-knowledge.ts');
const specialities = nonEmpty(strings(sliceArray(zenithSrc, 'SPECIALITIES')), 'specialities');

// Date the profile from the last commit that touched a source file, so the
// output only changes when the inputs do. Without git (or with uncommitted
// sources only) fall back to the newest data point GitHub Actions committed.
// Override with LLMS_LAST_UPDATED=YYYY-MM-DD.
const SOURCE_FILES = [
  'src/lib/projects.json',
  'src/lib/case-studies.json',
  'src/lib/blog-data.json',
  'src/lib/leetcode-stats.json',
  'src/lib/github-contributions.json',
  'src/lib/zenith-knowledge.ts',
  'src/components/ServicesSection.tsx',
  'src/components/SkillsSection.tsx',
  'src/components/Achievements.tsx',
  'src/components/BadgesShowcase.tsx',
  'src/components/ContactSection.tsx',
  'scripts/build-llms.mjs',
];

function gitDate() {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...SOURCE_FILES], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

const dataDate = github.contributions.map((c) => c.date).sort().at(-1) || null;
const lastUpdated =
  process.env.LLMS_LAST_UPDATED || [gitDate(), dataDate].filter(Boolean).sort().at(-1) || '1970-01-01';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const wc = (s) => s.split(/\s+/).filter(Boolean).length;
const pct = (n) => `${Math.round(n * 10) / 10}%`;

/** First sentence of a description, for the short file. */
function firstSentence(text) {
  const m = text.match(/^(.*?\.)\s+[A-Z]/);
  return m ? m[1] : text;
}

function clientLabel(p) {
  if (p.kind === 'model') {
    if (p.client === 'Internal R&D') return 'internal R&D, no public repository';
    if (p.client === 'Private client') return 'private client work, no public repository';
    return `built for ${p.client}, no public repository`;
  }
  return null;
}

function projectLinks(p) {
  const links = [];
  if (p.live) links.push(`live: ${p.live}`);
  if (p.github) links.push(`code: ${p.github}`);
  return links;
}

/** Shift markdown headings so the smallest level in `md` becomes `target`. */
function shiftHeadings(md, target) {
  const lines = md.split('\n');
  let fence = false;
  let min = 7;
  for (const line of lines) {
    if (/^\s*```/.test(line)) fence = !fence;
    else if (!fence) {
      const m = line.match(/^(#{1,6})\s/);
      if (m) min = Math.min(min, m[1].length);
    }
  }
  if (min === 7) return md;
  const delta = target - min;
  fence = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        fence = !fence;
        return line;
      }
      if (fence) return line;
      const m = line.match(/^(#{1,6})(\s.*)$/);
      if (!m) return line;
      return '#'.repeat(Math.min(6, m[1].length + delta)) + m[2];
    })
    .join('\n');
}

const categories = [...new Set(projects.map((p) => p.category))];
const byCategory = (cat) => projects.filter((p) => p.category === cat);
const publicProjects = projects.filter((p) => p.github || p.live);
const privateProjects = projects.filter((p) => !p.github && !p.live);

const contactLines = contact.map((c) =>
  c.href.startsWith('mailto:') ? `- ${c.label}: ${c.handle} (${c.href})` : `- ${c.label}: ${c.handle} — ${c.href}`,
);

const activityLines = [
  `- LeetCode: ${leetcode.totalSolved} problems solved (${leetcode.easy.solved} easy, ${leetcode.medium.solved} medium, ${leetcode.hard.solved} hard), acceptance rate ${pct(leetcode.acceptanceRate)}, global ranking ${leetcode.ranking.toLocaleString('en-US')} — https://leetcode.com/u/AdilMunawar/`,
  `- GitHub: ${github.totalContributions.toLocaleString('en-US')} public contributions in the last year — https://github.com/AdilMunawar`,
];

// ---------------------------------------------------------------------------
// llms.txt (concise)
// ---------------------------------------------------------------------------

function buildShort() {
  const out = [];
  out.push(`# ${PROFILE.name}`);
  out.push('');
  out.push(
    `> ${PROFILE.name} is a machine-learning engineer for agricultural remote sensing and a full-stack developer based in ${PROFILE.location.city}, ${PROFILE.location.country}, working remotely worldwide. He trains segmentation and time-series models on Sentinel-2 and high-resolution satellite imagery to map field boundaries, crop types and phenology, builds RAG pipelines and MCP-based agentic systems, and ships the Next.js, TypeScript and PostgreSQL products that put those models in front of people.`,
  );
  out.push('');
  out.push(
    `This file is the concise machine-readable summary of ${SITE}. Every fact here is taken from the site's own data files; nothing is estimated. For every project description, the full case studies, the notes and the complete credential list, read ${SITE}/llms-full.txt. A structured JSON version is at ${SITE}/ai-profile.json. Client and model entries below are private work and have no public repository; only the products and repositories with links are public.`,
  );
  out.push('');
  out.push('## Profile');
  out.push('');
  out.push(`- Name: ${PROFILE.name} (also ${PROFILE.alternateNames.join(', ')})`);
  out.push(`- Headline: ${PROFILE.headline}`);
  out.push(`- Roles: ${PROFILE.roles.join('; ')}`);
  out.push(`- Location: ${PROFILE.location.city}, ${PROFILE.location.region}, ${PROFILE.location.country} (${PROFILE.location.timezone}); remote worldwide`);
  out.push(`- Education: ${PROFILE.education}`);
  out.push(`- Availability: ${PROFILE.availability}`);
  out.push(`- Canonical URL: ${SITE}`);
  out.push('');
  out.push('## Specialities');
  out.push('');
  specialities.forEach((s) => out.push(`- ${s}`));
  out.push('');
  out.push(`## Services`);
  out.push('');
  services.forEach((s) => out.push(`- ${s.title}: ${s.description} You get: ${s.deliverable}`));
  out.push(`- [Full service descriptions](${SITE}/#services)`);
  out.push('');
  out.push('## Projects');
  out.push('');
  out.push(`${projects.length} projects across ${categories.length} categories; ${privateProjects.length} are private client or internal models and pipelines without public code, ${publicProjects.length} have public repositories or live sites. Full descriptions and tech stacks are in llms-full.txt.`);
  out.push('');
  for (const cat of categories) {
    out.push(`### ${cat}`);
    out.push('');
    for (const p of byCategory(cat)) {
      const meta = [clientLabel(p), ...projectLinks(p)].filter(Boolean);
      out.push(`- ${p.title}: ${firstSentence(p.description)}${meta.length ? ` (${meta.join('; ')})` : ''}`);
    }
    out.push('');
  }
  out.push(`- [All projects on the site](${SITE}/#projects)`);
  out.push('');
  out.push('## Case studies');
  out.push('');
  caseStudies.forEach((c) => out.push(`- ${c.title}: ${c.excerpt}`));
  out.push(`- [Read the case studies](${SITE}/#case-studies)`);
  out.push('');
  out.push('## Notes');
  out.push('');
  notes.forEach((n) => out.push(`- ${n.title} (${n.tags.join(', ')}): ${n.excerpt}`));
  out.push(`- [Read the notes](${SITE}/#blog)`);
  out.push('');
  out.push('## Toolkit');
  out.push('');
  toolkit.forEach((t) => out.push(`- ${t.group}: ${t.items.join(', ')}`));
  out.push('');
  out.push('## Certifications and credentials');
  out.push('');
  out.push(`- Certificates (${certifications.length}): ${certifications.map((c) => `${c.name} (${c.issuer})`).join('; ')}`);
  badgeGroups.forEach((g) => out.push(`- ${g.group} badges (${g.badges.length}): ${g.badges.join(', ')}`));
  out.push(`- Recognition: ${PROFILE.awards.join('; ')}`);
  out.push('');
  out.push('## Activity');
  out.push('');
  activityLines.forEach((l) => out.push(l));
  out.push('');
  out.push('## Contact');
  out.push('');
  contactLines.forEach((l) => out.push(l));
  out.push(`- [Contact section](${SITE}/#contact)`);
  out.push('');
  out.push('## Optional');
  out.push('');
  out.push(`- [llms-full.txt](${SITE}/llms-full.txt): complete profile, every project, full case studies and notes`);
  out.push(`- [ai-profile.json](${SITE}/ai-profile.json): the same facts as structured JSON`);
  out.push(`- [Sitemap](${SITE}/sitemap.xml)`);
  PROFILE.sameAs.forEach((u) => out.push(`- [${new URL(u).hostname.replace(/^www\./, '')}](${u})`));
  out.push('');
  out.push(`Last updated: ${lastUpdated}.`);
  out.push('');
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// llms-full.txt (complete)
// ---------------------------------------------------------------------------

function buildFull() {
  const out = [];
  out.push(`# ${PROFILE.name} — full profile`);
  out.push('');
  out.push(
    `> Complete machine-readable profile of ${PROFILE.name}: machine-learning engineer for agricultural remote sensing and full-stack developer in ${PROFILE.location.city}, ${PROFILE.location.country}. Generated from the data behind ${SITE}; the concise version is ${SITE}/llms.txt and the JSON version is ${SITE}/ai-profile.json.`,
  );
  out.push('');
  out.push('## Profile');
  out.push('');
  out.push(`- Name: ${PROFILE.name}`);
  out.push(`- Also known as: ${PROFILE.alternateNames.join(', ')}`);
  out.push(`- Headline: ${PROFILE.headline}`);
  out.push(`- Summary: ${PROFILE.lede}`);
  out.push(`- Roles: ${PROFILE.roles.join('; ')}`);
  out.push(`- Organisations: ${PROFILE.organizations.map((o) => (o.url ? `${o.name} (${o.url})` : o.name)).join('; ')}`);
  out.push(`- Education: ${PROFILE.education}`);
  out.push(`- Location: ${PROFILE.location.city}, ${PROFILE.location.region}, ${PROFILE.location.country} (${PROFILE.location.timezone})`);
  out.push(`- Work mode: remote worldwide`);
  out.push(`- Availability: ${PROFILE.availability}`);
  out.push(`- Canonical URL: ${SITE}`);
  out.push(`- Profiles: ${PROFILE.sameAs.join(', ')}`);
  out.push('');
  out.push('## Specialities');
  out.push('');
  specialities.forEach((s) => out.push(`- ${s}`));
  out.push('');
  out.push('## Services');
  out.push('');
  out.push('Four kinds of work taken on, from a single model to a shipped product.');
  out.push('');
  services.forEach((s, i) => {
    out.push(`### ${String(i + 1).padStart(2, '0')} ${s.title}`);
    out.push('');
    out.push(s.description);
    out.push('');
    out.push(`You get: ${s.deliverable}`);
    out.push('');
  });
  out.push('## Projects');
  out.push('');
  out.push(
    `${projects.length} projects. Entries marked "model" are private client or internal R&D work: they are described here but have no public repository or live URL, and no metrics or dates are claimed for them. Products and repositories list their public links.`,
  );
  out.push('');
  for (const cat of categories) {
    out.push(`### ${cat}`);
    out.push('');
    for (const p of byCategory(cat)) {
      out.push(`#### ${p.title}`);
      out.push('');
      out.push(`- Kind: ${p.kind}${p.highlight ? ' (highlighted on the site)' : ''}`);
      out.push(`- Domain: ${p.domain}`);
      if (p.client) out.push(`- Client: ${p.client}`);
      if (p.spec) out.push(`- Architecture: ${p.spec.architecture}; task: ${p.spec.task}; framework: ${p.spec.framework}`);
      out.push(`- Tech: ${p.tech.join(', ')}`);
      const links = projectLinks(p);
      out.push(links.length ? `- Links: ${links.join('; ')}` : `- Links: none (${clientLabel(p) ?? 'not public'})`);
      out.push('');
      out.push(p.description);
      out.push('');
    }
  }
  out.push('## Toolkit');
  out.push('');
  toolkit.forEach((t) => out.push(`- ${t.group}: ${t.items.join(', ')}`));
  out.push('');
  out.push('## Certifications');
  out.push('');
  out.push('Courses and assessments from Google Cloud, AWS, Microsoft, Anthropic and LinkedIn.');
  out.push('');
  certifications.forEach((c) => out.push(`- ${c.name} — ${c.issuer}. ${c.description}`));
  out.push('');
  out.push('## Badges and learning paths');
  out.push('');
  badgeGroups.forEach((g) => out.push(`- ${g.group}: ${g.badges.join(', ')}`));
  out.push('');
  out.push('## Recognition');
  out.push('');
  PROFILE.awards.forEach((a) => out.push(`- ${a}`));
  out.push('');
  out.push('## Activity');
  out.push('');
  out.push('Public commits and problem-solving over the last year, refreshed automatically by GitHub Actions.');
  out.push('');
  activityLines.forEach((l) => out.push(l));
  out.push('');
  out.push('## Case studies');
  out.push('');
  out.push(`Long-form write-ups published at ${SITE}/#case-studies. Diagrams are given as Mermaid source.`);
  out.push('');
  caseStudies.forEach((c) => {
    out.push(`### ${c.title}`);
    out.push('');
    out.push(`- Stack: ${c.techStack.join(', ')}`);
    out.push(`- Summary: ${c.excerpt}`);
    out.push(`- Challenge: ${c.challenge}`);
    out.push(`- Solution: ${c.solution}`);
    out.push('');
    out.push(shiftHeadings(c.content.trim(), 4));
    out.push('');
  });
  out.push('## Notes');
  out.push('');
  out.push(`Security and engineering write-ups published at ${SITE}/#blog.`);
  out.push('');
  notes.forEach((n) => {
    out.push(`### ${n.title}`);
    out.push('');
    out.push(`- Tags: ${n.tags.join(', ')}`);
    out.push(`- Summary: ${n.excerpt}`);
    out.push('');
    out.push(shiftHeadings(n.content.trim(), 4));
    out.push('');
  });
  out.push('## Contact');
  out.push('');
  out.push(PROFILE.availability);
  out.push('');
  contactLines.forEach((l) => out.push(l));
  out.push('');
  out.push('## How to cite / contact');
  out.push('');
  out.push(`- Cite as: ${PROFILE.name}, "${PROFILE.headline}", ${SITE} (accessed via llms-full.txt, last updated ${lastUpdated}).`);
  out.push(`- Canonical source for all facts above: ${SITE}. Concise summary: ${SITE}/llms.txt. Structured data: ${SITE}/ai-profile.json.`);
  out.push(`- Do not attribute metrics, prices, dates or client names that are not stated here; the private model entries deliberately carry none.`);
  out.push(`- For hiring or collaboration, email ${EMAIL} or use the channels in the Contact section.`);
  out.push('');
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// ai-profile.json (structured)
// ---------------------------------------------------------------------------

function buildJson() {
  return {
    name: PROFILE.name,
    alternate_names: PROFILE.alternateNames,
    headline: PROFILE.headline,
    summary: PROFILE.lede,
    roles: PROFILE.roles,
    organizations: PROFILE.organizations,
    education: PROFILE.education,
    location: PROFILE.location,
    work_mode: 'remote worldwide',
    availability: PROFILE.availability,
    canonical_url: SITE,
    same_as: PROFILE.sameAs,
    specialities,
    services: services.map((s) => ({ title: s.title, description: s.description, deliverable: s.deliverable })),
    toolkit,
    projects: projects.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      kind: p.kind,
      client: p.client,
      domain: p.domain,
      description: p.description,
      tech: p.tech,
      spec: p.spec ?? null,
      github: p.github,
      live: p.live,
      public: Boolean(p.github || p.live),
      highlight: Boolean(p.highlight),
    })),
    case_studies: caseStudies.map((c) => ({
      title: c.title,
      excerpt: c.excerpt,
      tech_stack: c.techStack,
      challenge: c.challenge,
      solution: c.solution,
      url: `${SITE}/#case-studies`,
    })),
    notes: notes.map((n) => ({ title: n.title, excerpt: n.excerpt, tags: n.tags, url: `${SITE}/#blog` })),
    certifications: certifications.map((c) => ({ name: c.name, issuer: c.issuer, description: c.description, image: c.image })),
    badges: badgeGroups,
    recognition: PROFILE.awards,
    activity: {
      leetcode: {
        solved: leetcode.totalSolved,
        easy: leetcode.easy.solved,
        medium: leetcode.medium.solved,
        hard: leetcode.hard.solved,
        acceptance_rate: Math.round(leetcode.acceptanceRate * 10) / 10,
        ranking: leetcode.ranking,
        url: 'https://leetcode.com/u/AdilMunawar/',
      },
      github: { contributions_last_year: github.totalContributions, url: 'https://github.com/AdilMunawar' },
    },
    contact: contact.map((c) => ({ channel: c.label, handle: c.handle, url: c.href })),
    links: {
      site: SITE,
      llms_txt: `${SITE}/llms.txt`,
      llms_full_txt: `${SITE}/llms-full.txt`,
      sitemap: `${SITE}/sitemap.xml`,
      projects: `${SITE}/#projects`,
      case_studies: `${SITE}/#case-studies`,
      notes: `${SITE}/#blog`,
      contact: `${SITE}/#contact`,
    },
    last_updated: lastUpdated,
  };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

const outputs = [
  ['public/llms.txt', buildShort()],
  ['public/llms-full.txt', buildFull()],
  ['public/ai-profile.json', JSON.stringify(buildJson(), null, 2) + '\n'],
];

for (const [rel, content] of outputs) {
  const abs = path.join(ROOT, rel);
  const prev = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (prev !== content) fs.writeFileSync(abs, content, 'utf8');
  console.log(`${prev === content ? 'unchanged' : 'wrote'} ${rel} (${wc(content)} words)`);
}
