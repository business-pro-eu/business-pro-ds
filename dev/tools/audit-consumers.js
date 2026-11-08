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
 *  6. Singurele foi de stil permise sunt cele ale DS-ului (bundle-ul); biblioteci terțe doar din tools/consumer-allowlist.json.
 *  7. Versiunea DS din link-urile literale (bundle CSS și business-pro.js) trebuie să fie egală cu ds/dev/VERSION.
 *  8. Clasele fără prefix bp- din markup trebuie să existe în bundle sau să fie hook-uri de comportament.
 *
 * Excepțiile stau în tools/consumer-allowlist.json, fiecare cu motiv. Dacă un stil lipsește, se creează în DS.
 *
 * Rulare: node tools/audit-consumers.js [--platform=php/crm]   (exit 1 la încălcări)
 */

const fs = require('fs');
const path = require('path');

const dsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(dsRoot, '../..');
// Layout since 2026-10-11: every PHP platform is its own repository under php/ (the CRM is php/crm, formerly "leads").
const allPlatforms = ['php/crm', 'php/profit', 'php/fleet', 'php/domain-tools', 'php/pusculita', 'php/idp', 'php/bookings'];
const onlyArg = process.argv.find((a) => a.startsWith('--platform='));
const platforms = onlyArg ? allPlatforms.filter((p) => p === onlyArg.split('=')[1]) : allPlatforms;
if (!platforms.length) { console.error('Platformă necunoscută.'); process.exit(1); }

// Excepții documentate, în tools/consumer-allowlist.json.
const allowlist = JSON.parse(fs.readFileSync(path.join(__dirname, 'consumer-allowlist.json'), 'utf8'));
for (const [group, entries] of Object.entries(allowlist)) {
  if (group.startsWith('_')) continue;
  for (const entry of entries) {
    if (!entry.pattern || !entry.reason || String(entry.reason).trim().length < 10) {
      console.error(`consumer-allowlist.json: intrarea din "${group}" cere pattern și un motiv documentat: ${JSON.stringify(entry)}`);
      process.exit(1);
    }
    entry.rx = new RegExp(entry.pattern);
  }
}
const allowed = (group, file) => allowlist[group].find((e) => e.rx.test(file));

// Nu sunt suprafețe servite de platformă: teste, mockup-uri, rapoarte generate, documentație și extensia de browser (rulează în
// paginile altor site-uri și își livrează propriul CSS în pachet).
const skippedDirs = new Set(['node_modules', '.git', 'vendor', 'tests', 'mockups', 'graphify-out', 'docs', 'extension', 'imports', 'database']);

// Datorie cunoscută, pe regulă și fișier: numărul maxim de încălcări tolerate. Poate doar să scadă (o încălcare nouă pică,
// iar una rezolvată cere coborârea alocației). Se șterge intrarea când ajunge la zero.
const knownDebt = {};
const markerClasses = new Set(['bp-theme-dark']);

const failures = [];
const debtCount = new Map();
const debtMessages = new Map();
function fail(message, key = null) {
  if (key === null) { failures.push(message); return; }
  debtCount.set(key, (debtCount.get(key) || 0) + 1);
  if (!debtMessages.has(key)) debtMessages.set(key, []);
  debtMessages.get(key).push(message);
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skippedDirs.has(entry.name)) continue;
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
}).filter((f) => !allowed('thirdParty', rel(f))); // biblioteci terțe documentate în allowlist
const webFiles = files.filter((f) => /\.(php|html|js)$/.test(f) && !/\.min\./.test(f));
const corpus = new Map(webFiles.map((f) => [f, read(f)]));

// 1. Fișiere CSS în platforme.
for (const f of files.filter((f) => f.endsWith('.css'))) {
  fail(`CSS de platformă interzis: ${rel(f)}`, `css|${rel(f)}`);
}

// 2. Blocuri <style>.
for (const [f, s] of corpus) {
  if (/<style\b/i.test(s) && !allowed('styleBlocks', rel(f))) {
    fail(`Bloc <style> nedocumentat: ${rel(f)}`);
  }
}

// 3. Atribute style="…".
for (const [f, s] of corpus) {
  if (allowed('inlineStyle', rel(f))) continue;
  for (const m of s.matchAll(/style="([^"]*)"/g)) {
    const value = m.group ? m.group(1) : m[1];
    const declarations = value.split(';').map((d) => d.trim()).filter(Boolean);
    if (declarations.every((d) => /^--bp-[a-z0-9-]+\s*:/.test(d))) continue;
    fail(`style= interzis în ${rel(f)}: "${value.slice(0, 80)}"`, `inline|${rel(f)}`);
  }
}

// 4. Prezentare imperativă din JS.
for (const [f, s] of corpus) {
  const runtimeAllowed = allowed('runtimeStyle', rel(f));
  for (const m of s.matchAll(/\.style\.([a-zA-Z]+)\s*=|\.cssText\s*=|\.style\.setProperty\(\s*['"`]([^'"`]+)/g)) {
    const prop = m[1] || m[2] || 'cssText';
    if (/^--bp-/.test(prop)) continue;
    if (runtimeAllowed && runtimeAllowed.props.includes(prop)) continue;
    fail(`JS setează prezentare în ${rel(f)}: ${m[0].trim().slice(0, 60)}`, `runtime|${rel(f)}`);
  }
}

// 5. Clase bp-* inexistente în DS.
const bundle = read(path.join(dsRoot, 'assets/css/business-pro.bundle.css'));
const dsClasses = new Set([...bundle.matchAll(/\.((?:bp|is|has)-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]));
const dsJs = fs.readdirSync(path.join(dsRoot, 'assets/js')).filter((n) => n.endsWith('.js')).map((n) => read(path.join(dsRoot, 'assets/js', n))).join('\n');
const dsPlainClasses = new Set([...bundle.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g)].map((m) => m[1]));
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
  // Hook de comportament: clasa apare și în afara atributelor class= (selectori JS), în ACEEAȘI platformă. O clasă folosită în două
  // platforme nu se acoperă reciproc: fiecare trebuie să o definească sau să o folosească ca hook.
  const platformOf = (file) => platforms.find((p) => rel(file).startsWith(`${p}/`));
  const usedIn = new Set(where.map(platformOf));
  const isHook = [...corpus].filter(([f]) => usedIn.has(platformOf(f))).map(([, s]) => s).some((s) => {
    const total = (s.match(new RegExp(c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
    let inAttr = 0;
    for (const m of s.matchAll(/class(?:Name)?=["`']([^"`']*)["`']/g)) {
      inAttr += m[1].split(/\s+/).filter((x) => x === c).length;
    }
    return total > inAttr;
  });
  if (!isHook) fail(`Clasă bp-* fără definiție în DS: ${c} (${rel(where[0])})`, `class|${rel(where[0])}`);
}

// 6. Foi de stil din afara DS-ului.
for (const [f, s] of corpus) {
  for (const m of s.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)) {
    const tag = m[0];
    if (/ds\.business-pro\.eu|ds_base|dsBase|\$ds\b|bpdt_ds_base|bppusculita_ds_base|business-pro\.(bundle\.)?(min\.)?css/.test(tag)) continue;
    if (allowlist.styleLinks.some((e) => e.rx.test(tag) || e.rx.test(rel(f)))) continue;
    fail(`Foaie de stil din afara DS în ${rel(f)}: ${tag.slice(0, 100)}`, `link|${rel(f)}`);
  }
}

// 7. Versiunea DS din link-urile literale.
const dsVersion = read(path.join(dsRoot, 'VERSION')).trim();
for (const [f, s] of corpus) {
  for (const m of s.matchAll(/business-pro(?:\.bundle)?(?:\.min)?\.(?:css|js)\?v=(\d{8}-\d+)/g)) {
    if (m[1] !== dsVersion) fail(`Versiune DS ${m[1]} în ${rel(f)}; versiunea curentă este ${dsVersion}`, `version|${rel(f)}`);
  }
}

// 8. Clase fără prefix bp- care nu există în DS.
const plainUndefined = new Map();
for (const [f, s] of corpus) {
  if (f.endsWith('.js') && /\/lib\//.test(f)) continue;
  for (const m of s.matchAll(/class(?:Name)?=["`']([^"`']*)["`']/g)) {
    if (/[$<{(]/.test(m[1])) continue;
    for (const c of m[1].split(/\s+/)) {
      if (!c || c.startsWith('bp-') || c.startsWith('fa-') || c === 'fa-solid' || c === 'fa-brands' || /^(is|has)-/.test(c)) continue;
      if (dsPlainClasses.has(c) || markerClasses.has(c) || dsJs.includes(c)) continue;
      if (allowlist.unknownClasses.some((e) => e.rx.test(c))) continue;
      if (!plainUndefined.has(c)) plainUndefined.set(c, []);
      plainUndefined.get(c).push(f);
    }
  }
}
for (const [c, where] of plainUndefined) {
  const platformOf = (file) => platforms.find((p) => rel(file).startsWith(`${p}/`));
  const usedIn = new Set(where.map(platformOf));
  const isHook = [...corpus].filter(([f]) => usedIn.has(platformOf(f))).map(([, s]) => s).some((s) => {
    const rx = new RegExp(`(?<![\\w-])${c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![\\w-])`, 'g');
    const total = (s.match(rx) || []).length;
    let inAttr = 0;
    for (const m of s.matchAll(/class(?:Name)?=["`']([^"`']*)["`']/g)) inAttr += m[1].split(/\s+/).filter((x) => x === c).length;
    return total > inAttr;
  });
  if (!isHook) fail(`Clasă fără definiție în DS: ${c} (${rel(where[0])})`, `plainclass|${rel(where[0])}`);
}

for (const key of new Set([...debtCount.keys(), ...Object.keys(knownDebt)])) {
  const found = debtCount.get(key) || 0;
  const allowed = knownDebt[key] || 0;
  if (found > allowed) {
    fail(`${key}: ${found} încălcări, ${allowed} tolerate:`);
    debtMessages.get(key).forEach((m) => fail(`  ${m}`));
  } else if (found < allowed) {
    fail(`${key}: doar ${found} încălcări rămase, ${allowed} tolerate: coboară alocația din knownDebt`);
  }
}

// 9. Pictograme: doar Font Awesome Solid (fa-solid) sau Brands (fa-brands). Fără bp-outline-icon, fa-regular/light/thin/duotone sau măști SVG.
{
  const banned = /(?<![\w-])(bp-outline-icon(?:--[a-z0-9-]+)?|fa-regular|fa-light|fa-thin|fa-duotone|fa-sharp|far|fal|fat|fad)(?![\w$-])/;
  for (const [f, s] of corpus) {
    for (const m of s.matchAll(/class(?:Name)?\s*=\s*(["'`])((?:(?!\1)[^])*)\1/g)) {
      const hit = m[2].match(banned);
      if (hit) fail(`Pictogramă nepermisă (${hit[1]}) în ${rel(f)}: folosește fa-solid sau fa-brands`);
    }
  }
}

if (failures.length) {
  console.error('Consumer audit failed:');
  failures.forEach((m) => console.error(`- ${m}`));
  process.exit(1);
}
const toleratedTotal = Object.values(knownDebt).reduce((a, b) => a + b, 0);
console.log(`Consumer audit passed (${platforms.join(', ')}); datorie cunoscută tolerată: ${toleratedTotal} încălcări în ${Object.keys(knownDebt).length} fișiere.`);
