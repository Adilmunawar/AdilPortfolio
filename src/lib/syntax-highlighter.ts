// Light build of react-syntax-highlighter with only the grammars the
// blog posts and case studies actually use. Importing `Prism` from the
// package root pulls in every refractor grammar, every highlight.js
// grammar, and every theme (~2,000 modules); this file pulls ~15.
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';

import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import ini from 'react-syntax-highlighter/dist/esm/languages/prism/ini';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';

const grammars: Record<string, unknown> = {
  bash, sh: bash, shell: bash,
  sql,
  typescript, ts: typescript, tsx: typescript,
  javascript, js: javascript, jsx: javascript,
  yaml, yml: yaml,
  python, py: python,
  json,
  ini,
  cpp,
};

for (const [name, grammar] of Object.entries(grammars)) {
  SyntaxHighlighter.registerLanguage(name, grammar);
}

export { SyntaxHighlighter, atomDark };
