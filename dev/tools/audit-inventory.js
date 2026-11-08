#!/usr/bin/env node

/**
 * Audit de inventar: orice clasă bp-* din bundle care nu era în baseline trebuie documentată în DS-COMPONENT-INVENTORY.md.
 * Baseline-ul (tools/inventory-baseline.json) se actualizează doar după documentare: node tools/audit-inventory.js --update-baseline
 *
 * Rulare: node tools/audit-inventory.js   (exit 1 dacă există clase noi nedocumentate)
 */

const fs = require('fs');
const path = require('path');

const dsRoot = path.resolve(__dirname, '..');
const baselineFile = path.join(__dirname, 'inventory-baseline.json');
const bundle = fs.readFileSync(path.join(dsRoot, 'assets/css/business-pro.bundle.css'), 'utf8');
const inventory = fs.readFileSync(path.join(dsRoot, 'DS-COMPONENT-INVENTORY.md'), 'utf8');
// Pictogramele (bp-outline-icon--<nume>) sunt generate din tools/icon-map.json și documentate în ICONS.md, nu una câte una în inventar.
const classes = [...new Set([...bundle.matchAll(/\.(bp-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]))].filter((c) => !c.startsWith('bp-outline-icon--')).sort();
const documented = new Set([...inventory.matchAll(/bp-[a-zA-Z0-9_-]+/g)].map((m) => m[0]));

const baseline = new Set(fs.existsSync(baselineFile) ? JSON.parse(fs.readFileSync(baselineFile, 'utf8')) : []);
const missing = classes.filter((c) => !baseline.has(c) && !documented.has(c));

if (missing.length) {
  console.error(`Inventar incomplet: ${missing.length} clase bp-* noi fără intrare în DS-COMPONENT-INVENTORY.md:`);
  missing.slice(0, 60).forEach((c) => console.error(`- ${c}`));
  if (missing.length > 60) console.error(`… și încă ${missing.length - 60}`);
  process.exit(1);
}
if (process.argv.includes('--update-baseline')) {
  fs.writeFileSync(baselineFile, JSON.stringify(classes, null, 0) + '\n');
  console.log(`Baseline actualizat: ${classes.length} clase.`);
} else {
  console.log(`Inventar OK (${classes.length} clase, ${classes.filter((c) => !baseline.has(c)).length} noi, toate documentate).`);
}
