#!/usr/bin/env node
/**
 * Generează assets/css/icons.css din tools/icon-map.json (nume DS -> pictogramă Tabler) și tools/icons-src/*.svg (Tabler Icons, MIT).
 * Fiecare pictogramă devine o mască CSS: <i class="bp-icon bp-outline-icon bp-outline-icon--NUME" aria-hidden="true"></i>.
 * Numele DS sunt cele folosite în cod (ex: xmark, trash-can); forma vine din pictograma Tabler indicată în icon-map.json.
 * Pictogramă nouă: copiază SVG-ul Tabler (outline) în tools/icons-src/, adaugă numele în icon-map.json, rulează acest script.
 */
const fs = require('fs');
const path = require('path');

const dsRoot = path.resolve(__dirname, '../..');
const map = JSON.parse(fs.readFileSync(path.join(__dirname, 'icon-map.json'), 'utf8'));
const src = path.join(__dirname, 'icons-src');

function inner(file) {
  const svg = fs.readFileSync(file, 'utf8');
  const body = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return body
    .replace(/<path\s+stroke="none"\s+d="M0 0h24v24H0z"\s+fill="none"\s*\/>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ \/>/g, '/>')
    .replace(/> </g, '><')
    .trim();
}

function mask(content) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>${content.replace(/"/g, "'")}</svg>`;
  return 'url("data:image/svg+xml,' + svg.replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E') + '")';
}

const byShape = new Map();
for (const [name, tabler] of Object.entries(map).sort(([a], [b]) => a.localeCompare(b))) {
  const file = path.join(src, `${tabler}.svg`);
  if (!fs.existsSync(file)) throw new Error(`Lipsește tools/icons-src/${tabler}.svg (pentru ${name})`);
  if (!byShape.has(tabler)) byShape.set(tabler, { names: [], mask: mask(inner(file)) });
  byShape.get(tabler).names.push(name);
}
// o singură mască pentru toate numele care folosesc aceeași formă
const rules = [...byShape.values()].map(({ names, mask: m }) => `${names.map((n) => `.bp-outline-icon--${n}`).join(',\n')} { --bp-outline-icon-mask: ${m}; }`);

const placeholder = mask(inner(path.join(src, 'circle-dashed.svg')));
const header = `/* Pictograme (generat de tools/generate-icons.js din tools/icon-map.json; nu edita direct).
   Forme Tabler Icons (outline, MIT, vezi tools/icons-src/LICENSE) desenate ca măști CSS: nu depind de fonturi sau imagini.
   Se folosesc ca <i class="bp-icon bp-outline-icon bp-outline-icon--NUME" aria-hidden="true"></i>; culoarea urmează currentColor. Un nume fără intrare în icon-map.json se vede ca cerc punctat (semnal vizibil de eroare). */
.bp-outline-icon { --bp-outline-icon-mask: ${placeholder}; display: inline-block; flex: 0 0 auto; width: 1em; height: 1em; background-color: currentColor; -webkit-mask: var(--bp-outline-icon-mask) center / contain no-repeat; mask: var(--bp-outline-icon-mask) center / contain no-repeat; vertical-align: -0.125em; }
.bp-icon--spin { animation: bp-spin 0.9s linear infinite; }
`;
fs.writeFileSync(path.join(dsRoot, 'assets/css/icons.css'), header + rules.join('\n') + '\n');
console.log(`Generated assets/css/icons.css: ${Object.keys(map).length} nume, ${byShape.size} forme.`);
