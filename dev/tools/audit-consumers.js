#!/usr/bin/env node

/**
 * Audit de governance pentru platformele care consumă DS-ul.
 *
 * Reguli:
 *  1. Niciun fișier .css în platforme (CSS-ul stă în DS).
 *  2. Niciun bloc <style> (excepții documentate mai jos).
 *  3. Niciun atribut style="…" în afara valorilor runtime prin custom
 *     properties --bp-* și a HTML-ului de email (inline CSS obligatoriu).
 *  4. JS nu setează prezentare prin .style.* / cssText; sunt permise doar
 *     valorile runtime reale: coordonate din măsurători, dimensiuni măsurate
 *     și custom properties --bp-* (fișiere/paternuri whitelistate).
 *  5. Clasele bp-* folosite în markup trebuie să existe în bundle-ul DS,
 *     cu excepția hook-urilor de comportament (clase referențiate și în
 *     selectori JS) și a markerilor de temă/platformă.
 *
 * Rulare: node tools/audit-consumers.js   (exit 1 la încălcări)
 */

const fs = require('fs');
const path = require('path');

const dsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(dsRoot, '../..');
const platforms = ['bookings', 'leads', 'profit', 'fleet', 'domain-tools', 'contracts'];

// Excepții documentate (căi relative la rădăcina repo-ului).
const styleBlockExceptions = new Set([
  'fleet/public/offline.html',        // pagină offline autonomă: DS-ul remote nu e disponibil
  'fleet/public/index.php',           // <style id="bp-brand-theme">: doar token-uri --bp-* per tenant
  'fleet/public/app.php',             // idem
  'contracts/src/XlsxExporter.php',   // XML de spreadsheet, nu CSS web
]);
const inlineStyleExceptions = [
  /src\/Mailer\.php$/,                // email HTML: clienții de mail cer CSS inline
  /src\/ExtensionStopNotifier\.php$/, // email HTML
];
const runtimeStyleExceptions = [
  /leads\/public\/assets\/app\.js$/,      // poziționare popup/tooltip din getBoundingClientRect
  /bookings\/public\/assets\/app\.js$/,   // autosize textarea din scrollHeight
];
const markerClasses = new Set(['bp-contracts', 'bp-theme-dark']);

const failures = [];
function fail(message) { failures.push(message); }

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'vendor') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const rel = (file) => path.relative(repoRoot, file);
const read = (file) => fs.readFileSync(file, 'utf8');

const files = platforms.flatMap((p) => {
  const dir = path.join(repoRoot, p);
  return fs.existsSync(dir) ? walk(dir) : [];
});
const webFiles = files.filter((f) => /\.(php|html|js)$/.test(f) && !/\.min\./.test(f));
const corpus = new Map(webFiles.map((f) => [f, read(f)]));

// 1. Fișiere CSS în platforme.
for (const f of files.filter((f) => f.endsWith('.css'))) {
  fail(`CSS de platformă interzis: ${rel(f)}`);
}

// 2. Blocuri <style>.
for (const [f, s] of corpus) {
  if (/<style\b/i.test(s) && !styleBlockExceptions.has(rel(f))) {
    fail(`Bloc <style> nedocumentat: ${rel(f)}`);
  }
}

// 3. Atribute style="…".
for (const [f, s] of corpus) {
  if (inlineStyleExceptions.some((rx) => rx.test(f))) continue;
  for (const m of s.matchAll(/style="([^"]*)"/g)) {
    const value = m.group ? m.group(1) : m[1];
    const declarations = value.split(';').map((d) => d.trim()).filter(Boolean);
    if (declarations.every((d) => /^--bp-[a-z0-9-]+\s*:/.test(d))) continue;
    fail(`style= interzis în ${rel(f)}: "${value.slice(0, 80)}"`);
  }
}

// 4. Prezentare imperativă din JS.
for (const [f, s] of corpus) {
  if (runtimeStyleExceptions.some((rx) => rx.test(f))) continue;
  for (const m of s.matchAll(/\.style\.([a-zA-Z]+)\s*=|\.cssText\s*=|\.style\.setProperty\(\s*['"`]([^'"`]+)/g)) {
    const prop = m[1] || m[2] || 'cssText';
    if (/^--bp-/.test(prop)) continue;
    fail(`JS setează prezentare în ${rel(f)}: ${m[0].trim().slice(0, 60)}`);
  }
}

// 5. Clase bp-* inexistente în DS.
const bundle = read(path.join(dsRoot, 'assets/css/business-pro.bundle.css'));
const dsClasses = new Set([...bundle.matchAll(/\.((?:bp|is|has)-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]));
const undefinedUse = new Map();
for (const [f, s] of corpus) {
  for (const m of s.matchAll(/class(?:Name)?=["`']([^"`']*)["`']/g)) {
    for (const c of m[1].split(/\s+/)) {
      if (!c.startsWith('bp-') || c.includes('$') || c.includes('<')) continue;
      if (dsClasses.has(c) || markerClasses.has(c)) continue;
      if (!undefinedUse.has(c)) undefinedUse.set(c, []);
      undefinedUse.get(c).push(f);
    }
  }
}
for (const [c, where] of undefinedUse) {
  // Hook de comportament: clasa apare și în afara atributelor class= (selectori JS).
  const isHook = [...corpus.values()].some((s) => {
    const total = (s.match(new RegExp(c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
    let inAttr = 0;
    for (const m of s.matchAll(/class(?:Name)?=["`']([^"`']*)["`']/g)) {
      inAttr += m[1].split(/\s+/).filter((x) => x === c).length;
    }
    return total > inAttr;
  });
  if (!isHook) fail(`Clasă bp-* fără definiție în DS: ${c} (${rel(where[0])})`);
}

if (failures.length) {
  console.error('Consumer audit failed:');
  failures.forEach((m) => console.error(`- ${m}`));
  process.exit(1);
}
console.log(`Consumer audit passed (${platforms.join(', ')}).`);
