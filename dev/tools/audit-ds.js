#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const dsRoot = path.resolve(__dirname, '..');
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function rel(file) {
  return path.relative(dsRoot, file);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const files = walk(dsRoot);

for (const file of files) {
  const name = path.basename(file);
  if (name === '.DS_Store') fail(`Artefact macOS publicat: ${rel(file)}`);
  if (/\.(bak|tmp|log|map)$/i.test(name) || name.endsWith('~')) {
    fail(`Artefact temporar/public debug: ${rel(file)}`);
  }
}

for (const file of files.filter((item) => item.endsWith('.svg'))) {
  const source = read(file);
  if (/<!DOCTYPE/i.test(source)) fail(`SVG cu DOCTYPE extern: ${rel(file)}`);
  if (/<script\b/i.test(source)) fail(`SVG cu script: ${rel(file)}`);
  if (/\son[a-z]+\s*=/i.test(source)) fail(`SVG cu event handler inline: ${rel(file)}`);
  if (/<foreignObject\b/i.test(source)) fail(`SVG cu foreignObject: ${rel(file)}`);
  if (/\b(?:href|xlink:href)\s*=\s*["']https?:\/\//i.test(source)) {
    fail(`SVG cu link extern: ${rel(file)}`);
  }
}

for (const file of files.filter((item) => item.endsWith('.js') && rel(item).startsWith('assets/js/'))) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`JS invalid: ${rel(file)}\n${result.stderr.trim()}`);
  }
  const source = read(file);
  if (/\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/.test(source)) {
    fail(`JS folosește HTML string injection: ${rel(file)}`);
  }
  if (/\b(?:eval|Function)\s*\(/.test(source)) {
    fail(`JS folosește execuție dinamică: ${rel(file)}`);
  }
}

// Efectele vizuale (shadow/backdrop-filter) sunt permise doar prin token-uri
// --bp-*; valorile hard-codate rămân interzise în afara tokens.css.
function hasHardcodedEffect(rawSource) {
  const source = rawSource.replace(/@supports[^{]+/gi, '');
  const declarations = [...source.matchAll(/(?:-webkit-)?(?:backdrop-filter|box-shadow)\s*:\s*([^;}]+)/gi)];
  return declarations.some(([, value]) => {
    const trimmed = value.trim();
    if (/^none\b/i.test(trimmed)) return false;
    const withoutVars = trimmed.replace(/var\(--bp-[a-z0-9-]+\)/gi, '');
    return /(?:\d|rgba?\(|#[0-9a-f]{3}|blur\(\s*\d|drop-shadow\()/i.test(withoutVars);
  });
}

// Guard de universalitate (vezi NAMING.md): selectorii și token-urile DS nu au
// voie să refere aplicații/platforme sau să folosească stări "goale".
const APP_WORD = /(^|[^a-z])(lead|leads|crm|campaign|invoice|driver|vehicle|beneficiar|booking|brevo|smtp|onrc|apple|guest|reservation|checkin)(?![a-z])/i;
const BARE_STATE = /\.(open|active|done|current|visible|selected|dragging|drag-over)(?![a-zA-Z0-9_-])/;
const VENDOR_SELECTOR = /flatpickr|\.ql-|tagify|maplibregl/;
function checkNamingGovernance(file, source) {
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of stripped.matchAll(/([^{};]+)\{/g)) {
    const selector = match[1];
    if (VENDOR_SELECTOR.test(selector)) continue;
    if (BARE_STATE.test(selector)) fail(`Stare fără prefix is-/has- în ${rel(file)}: ${selector.trim().slice(0, 70)}`);
    for (const cls of selector.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) {
      if (!/^(bp-|is-|has-|ds-)/.test(cls[1])) fail(`Selector fără namespace DS în ${rel(file)}: .${cls[1]}`);
      if (APP_WORD.test(cls[1]) && !/^bp-(brand-|outline-icon--)/.test(cls[1])) fail(`Nume de aplicație/platformă în selector DS ${rel(file)}: .${cls[1]}`);
    }
  }
  for (const tok of stripped.matchAll(/--bp-[a-z0-9-]+/g)) {
    if (APP_WORD.test(tok[0])) fail(`Nume de aplicație/platformă în token DS ${rel(file)}: ${tok[0]}`);
  }
}

for (const file of files.filter((item) => item.endsWith('.css'))) {
  const source = read(file);
  const open = (source.match(/{/g) || []).length;
  const close = (source.match(/}/g) || []).length;
  if (open !== close) fail(`CSS cu acolade dezechilibrate: ${rel(file)} (${open}/${close})`);
  if (!rel(file).startsWith('assets/vendor/') && hasHardcodedEffect(source)) {
    fail(`CSS conține shadow/backdrop-filter cu valori hard-codate (folosește token-uri --bp-*): ${rel(file)}`);
  }
  if (!rel(file).startsWith('assets/vendor/') && !rel(file).endsWith('.min.css')) {
    checkNamingGovernance(file, source);
  }
  if (/--bp-color-glass-surface-strong|glass-chrome|menu-material|bp-glass--(?:subtle|strong|tinted|flat)/.test(source)) {
    fail(`CSS conține token/clasă Liquid Glass eliminată: ${rel(file)}`);
  }
}

const advancedCss = path.join(dsRoot, 'assets/css/advanced.css');
if (fs.existsSync(advancedCss)) {
  const source = read(advancedCss);
  const legacySelectorPattern = /\.(?:gs-|syslog-|diag-|ext-inst-|timing-|widget-|notif-|rt-|ver-|email-|map-|cui-)/;
  if (legacySelectorPattern.test(source)) {
    fail('advanced.css conține selectori legacy/platform-specific. Migrează-i la clase reutilizabile bp-*.');
  }
}

const entrypoint = path.join(dsRoot, 'assets/css/business-pro.css');
const versionFile = path.join(dsRoot, 'VERSION');
const version = fs.existsSync(versionFile) ? read(versionFile).trim() : '';

if (!version) fail('VERSION lipsește sau este gol.');

if (fs.existsSync(entrypoint)) {
  const source = read(entrypoint);
  const imports = [...source.matchAll(/@import\s+url\(["'][^"']+\?v=([^"']+)["']\)/g)].map((match) => match[1]);
  const appImports = imports.filter((version) => !/^7\./.test(version));
  if (new Set(appImports).size > 1) {
    fail(`Versiuni diferite în importurile business-pro.css: ${[...new Set(appImports)].join(', ')}`);
  }
  if (!appImports.length) warn('business-pro.css nu conține importuri versionate pentru modulele DS.');
  if (version && appImports.some((importVersion) => importVersion !== version)) {
    fail(`Importurile business-pro.css nu corespund cu VERSION ${version}: ${[...new Set(appImports)].join(', ')}`);
  }
}

const manifestFile = path.join(dsRoot, 'manifest.json');
const healthFile = path.join(dsRoot, 'health.json');
const bundleFile = path.join(dsRoot, 'assets/css/business-pro.bundle.css');

if (!fs.existsSync(bundleFile)) {
  fail('assets/css/business-pro.bundle.css lipsește. Rulează node tools/generate-css-bundle.js.');
} else {
  const before = read(bundleFile);
  const generator = spawnSync(process.execPath, [path.join(dsRoot, 'tools/generate-css-bundle.js')], { encoding: 'utf8' });
  if (generator.status !== 0) {
    fail(`Generatorul CSS bundle a eșuat:\n${generator.stderr.trim()}`);
  } else {
    const after = read(bundleFile);
    if (after !== before) {
      fail('business-pro.bundle.css era stale. A fost regenerat; rulează auditul din nou.');
    }
  }
}

if (!fs.existsSync(manifestFile)) {
  fail('manifest.json lipsește. Rulează node tools/generate-manifest.js.');
} else {
  try {
    const manifest = JSON.parse(read(manifestFile));
    if (manifest.version !== version) fail(`manifest.json are versiunea ${manifest.version}, dar VERSION este ${version}.`);
    if (!Array.isArray(manifest.files) || !manifest.files.length) fail('manifest.json nu conține lista de fișiere.');
    for (const entry of manifest.files || []) {
      const file = path.join(dsRoot, entry.path || '');
      if (!entry.path || !fs.existsSync(file)) {
        fail(`manifest.json referă fișier lipsă: ${entry.path || '(gol)'}`);
        continue;
      }
      const stat = fs.statSync(file);
      if (entry.bytes !== stat.size) fail(`manifest stale pentru ${entry.path}: bytes ${entry.bytes} != ${stat.size}`);
      const currentHash = sha256(file);
      if (entry.sha256 !== currentHash) fail(`manifest stale pentru ${entry.path}: checksum diferit`);
    }
  } catch (error) {
    fail(`manifest.json invalid: ${error.message}`);
  }
}

if (!fs.existsSync(healthFile)) {
  fail('health.json lipsește. Rulează node tools/generate-manifest.js.');
} else {
  try {
    const health = JSON.parse(read(healthFile));
    if (health.ok !== true) fail('health.json nu are ok=true.');
    if (health.version !== version) fail(`health.json are versiunea ${health.version}, dar VERSION este ${version}.`);
  } catch (error) {
    fail(`health.json invalid: ${error.message}`);
  }
}

const staleDocs = files
  .filter((file) => /\.(md|html|php|css|js)$/.test(file))
  .filter((file) => /20260711-(?:5|10)/.test(read(file)))
  .map(rel);
if (staleDocs.length) {
  warn(`Referințe vechi 20260711-* rămase: ${staleDocs.join(', ')}`);
}

if (warnings.length) {
  console.warn('DS audit warnings:');
  warnings.forEach((message) => console.warn(`- ${message}`));
}

if (failures.length) {
  console.error('DS audit failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('DS audit passed.');
