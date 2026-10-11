#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { spawnSync } = require('child_process');

const dsRoot = path.resolve(__dirname, '..');
const version = fs.readFileSync(path.join(dsRoot, 'VERSION'), 'utf8').trim();

const categories = {
  security: [],
  codeQuality: [],
  observability: [],
  performance: [],
  maintainability: [],
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
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

function add(category, message) {
  categories[category].push(message);
}

function gzipSize(file) {
  return zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length;
}

function checkVersionedAssetRefs(file, category) {
  const source = read(file);
  const refs = [...source.matchAll(/\b(?:href|src)=["']([^"']+\.(?:css|js)(?:\?v=([^"']+))?)["']/g)];
  for (const [, href, refVersion] of refs) {
    if (/^(?:https?:)?\/\//.test(href)) continue;
    if (!refVersion) add(category, `${rel(file)} referă asset fără ?v=: ${href}`);
    else if (refVersion !== version && !/^7\./.test(refVersion)) add(category, `${rel(file)} referă versiune ${refVersion}, VERSION este ${version}: ${href}`);
  }
}

const files = walk(dsRoot);
const sourceFiles = files.filter((file) => !rel(file).startsWith('assets/vendor/'));
const jsFiles = sourceFiles.filter((file) => file.endsWith('.js'));
const cssFiles = sourceFiles.filter((file) => file.endsWith('.css'));
const svgFiles = sourceFiles.filter((file) => file.endsWith('.svg'));

for (const file of files) {
  const name = path.basename(file);
  if (name === '.DS_Store') add('security', `Artefact macOS publicat: ${rel(file)}`);
  if (/\.(bak|tmp|log|map)$/i.test(name) || name.endsWith('~')) add('security', `Artefact temporar/debug publicat: ${rel(file)}`);
}

for (const file of svgFiles) {
  const source = read(file);
  if (/<!DOCTYPE/i.test(source)) add('security', `SVG cu DOCTYPE: ${rel(file)}`);
  if (/<script\b/i.test(source)) add('security', `SVG cu script: ${rel(file)}`);
  if (/\son[a-z]+\s*=/i.test(source)) add('security', `SVG cu event handler inline: ${rel(file)}`);
  if (/<foreignObject\b/i.test(source)) add('security', `SVG cu foreignObject: ${rel(file)}`);
  if (/\b(?:href|xlink:href)\s*=\s*["']https?:\/\//i.test(source)) add('security', `SVG cu referință externă: ${rel(file)}`);
}

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) add('codeQuality', `JS invalid: ${rel(file)} ${result.stderr.trim()}`);
  const source = read(file);
  const isPublicRuntimeJs = rel(file).startsWith('assets/js/');
  if (isPublicRuntimeJs && /\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write)\b/.test(source)) add('security', `HTML string injection în JS DS: ${rel(file)}`);
  if (isPublicRuntimeJs && /\b(?:eval|Function)\s*\(/.test(source)) add('security', `Execuție dinamică în JS DS: ${rel(file)}`);
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

for (const file of cssFiles) {
  const source = read(file);
  const open = (source.match(/{/g) || []).length;
  const close = (source.match(/}/g) || []).length;
  if (open !== close) add('codeQuality', `CSS cu acolade dezechilibrate: ${rel(file)} (${open}/${close})`);
  if (hasHardcodedEffect(source)) add('maintainability', `CSS conține shadow/backdrop-filter cu valori hard-codate (folosește token-uri --bp-*): ${rel(file)}`);
  if (/--bp-color-glass-surface-strong|glass-chrome|menu-material|bp-glass--(?:subtle|strong|tinted|flat)/.test(source)) add('maintainability', `Liquid Glass eliminat încă prezent: ${rel(file)}`);
  if (rel(file) === 'assets/css/advanced.css' && /\.(?:gs-|syslog-|diag-|ext-inst-|timing-|widget-|notif-|rt-|ver-|email-|map-|cui-)/.test(source)) {
    add('maintainability', `Selector legacy/platform-specific în advanced.css: ${rel(file)}`);
  }
}

const indexFile = path.join(dsRoot, 'index.html');
if (fs.existsSync(indexFile)) {
  const index = read(indexFile);
  if (/\son[a-z]+\s*=/i.test(index)) add('security', 'index.html conține event handler inline.');
  if (/javascript:/i.test(index)) add('security', 'index.html conține javascript: URL.');
  if (/<script(?![^>]+\bsrc=)/i.test(index)) add('security', 'index.html conține script inline.');
  if (/\b(?:src|href)=["']https?:\/\//i.test(index)) add('performance', 'index.html referă asset extern HTTP(S).');
  checkVersionedAssetRefs(indexFile, 'maintainability');
}

const modularCss = path.join(dsRoot, 'assets/css/business-pro.css');
if (fs.existsSync(modularCss)) {
  const source = read(modularCss);
  const imports = [...source.matchAll(/@import\s+url\(["'][^"']+\?v=([^"']+)["']\)/g)].map((m) => m[1]).filter((v) => !/^7\./.test(v));
  if (!imports.length) add('maintainability', 'business-pro.css nu are importuri DS versionate.');
  if (imports.some((importVersion) => importVersion !== version)) add('maintainability', `business-pro.css are importuri care nu corespund VERSION ${version}.`);
}

if (fs.existsSync(path.join(dsRoot, 'assets/css/legacy-platform.css'))) {
  add('maintainability', 'legacy-platform.css încă există.');
}

const manifestFile = path.join(dsRoot, 'manifest.json');
const healthFile = path.join(dsRoot, 'health.json');
if (!fs.existsSync(manifestFile)) {
  add('observability', 'manifest.json lipsește.');
} else {
  try {
    const manifest = JSON.parse(read(manifestFile));
    if (manifest.version !== version) add('observability', `manifest.version=${manifest.version}, VERSION=${version}.`);
    if (!manifest.entrypoints?.css || !manifest.entrypoints?.js || !manifest.entrypoints?.theme) add('observability', 'manifest.json nu expune entrypoint-urile css/js/theme.');
    if (!Array.isArray(manifest.files) || !manifest.files.length) add('observability', 'manifest.json nu conține files.');
    if (manifest.files?.some((entry) => entry.path === 'assets/css/legacy-platform.css')) add('observability', 'manifest.json încă publică legacy-platform.css.');
    for (const entry of manifest.files || []) {
      const file = path.join(dsRoot, entry.path || '');
      if (!entry.path || !fs.existsSync(file)) {
        add('observability', `manifest referă fișier lipsă: ${entry.path || '(gol)'}`);
        continue;
      }
      const stat = fs.statSync(file);
      if (entry.bytes !== stat.size) add('observability', `manifest stale bytes pentru ${entry.path}.`);
      if (entry.sha256 !== sha256(file)) add('observability', `manifest stale checksum pentru ${entry.path}.`);
    }
  } catch (error) {
    add('observability', `manifest.json invalid: ${error.message}`);
  }
}

if (!fs.existsSync(healthFile)) {
  add('observability', 'health.json lipsește.');
} else {
  try {
    const health = JSON.parse(read(healthFile));
    if (health.ok !== true) add('observability', 'health.json nu are ok=true.');
    if (health.version !== version) add('observability', `health.version=${health.version}, VERSION=${version}.`);
    if (!health.generatedAt) add('observability', 'health.json nu are generatedAt.');
  } catch (error) {
    add('observability', `health.json invalid: ${error.message}`);
  }
}

const bundle = path.join(dsRoot, 'assets/css/business-pro.bundle.css');
const appJs = path.join(dsRoot, 'assets/js/business-pro.js');
const themeJs = path.join(dsRoot, 'assets/js/theme.js');
const galleryJs = path.join(dsRoot, 'assets/js/gallery.js');
const performanceBudgets = [
  [bundle, 80 * 1024, 'CSS bundle gzip'],
  [appJs, 25 * 1024, 'business-pro.js gzip'],
  [themeJs, 2 * 1024, 'theme.js gzip'],
  [galleryJs, 5 * 1024, 'gallery.js gzip'],
];
for (const [file, maxBytes, label] of performanceBudgets) {
  if (!fs.existsSync(file)) add('performance', `${label} lipsește: ${rel(file)}`);
  else {
    const size = gzipSize(file);
    if (size > maxBytes) add('performance', `${label} depășește bugetul: ${size} > ${maxBytes} bytes.`);
  }
}
if (fs.existsSync(bundle) && (/legacy-platform|glass-chrome|menu-material/.test(read(bundle)) || hasHardcodedEffect(read(bundle)))) add('performance', 'Bundle CSS conține cod legacy eliminat.');

const audit = spawnSync(process.execPath, [path.join(dsRoot, 'tools/audit-ds.js')], { encoding: 'utf8' });
if (audit.status !== 0) add('codeQuality', `audit-ds.js eșuează: ${(audit.stderr || audit.stdout).trim()}`);

const labels = {
  security: 'Securitate',
  codeQuality: 'Code Quality',
  observability: 'Observability',
  performance: 'Performanță',
  maintainability: 'Maintainability',
};

const summary = Object.entries(categories).map(([key, issues]) => ({
  key,
  label: labels[key],
  score: issues.length ? 0 : 100,
  issues,
}));

for (const item of summary) {
  console.log(`${item.label}: ${item.score}/100`);
  for (const issue of item.issues) console.log(`  - ${issue}`);
}

const failed = summary.filter((item) => item.score !== 100);
if (failed.length) {
  process.exit(1);
}

console.log('DS score: 100/100.');
