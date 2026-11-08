#!/usr/bin/env node

/**
 * Aliniază versiunea DS din link-urile literale ale platformelor (business-pro[.bundle][.min].css / business-pro.js)
 * la ds/dev/VERSION. Se rulează după fiecare versiune nouă a DS-ului; audit-consumers pică dacă a fost uitat.
 *
 * Rulare: node tools/sync-consumers.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const dsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(dsRoot, '../..');
const platforms = ['php/crm', 'php/profit', 'php/fleet', 'php/domain-tools', 'php/pusculita', 'php/idp'];
const skipped = new Set(['node_modules', '.git', 'vendor', 'tests', 'mockups', 'graphify-out', 'docs', 'imports', 'database']);
const dry = process.argv.includes('--dry-run');
const version = fs.readFileSync(path.join(dsRoot, 'VERSION'), 'utf8').trim();
const rx = /(business-pro(?:\.bundle)?(?:\.min)?\.(?:css|js)\?v=)(\d{8}-\d+)/g;
// Pușculița: versiunea DS de rezervă din `max((string)bppusculita_cfg('ds_version', ''), 'YYYYMMDD-N')`
const rxFallback = /(bppusculita_cfg\('ds_version', ''\), ')(\d{8}-\d+)/g;

let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!/\.(php|html|js)$/.test(entry.name) || /\.min\./.test(entry.name)) continue;
    const text = fs.readFileSync(full, 'utf8');
    const bump = (m, head, v) => (v === version ? m : head + version);
    const next = text.replace(rx, bump).replace(rxFallback, bump);
    if (next !== text) {
      changed++;
      console.log(`${dry ? 'would update' : 'updated'} ${path.relative(repoRoot, full)}`);
      if (!dry) fs.writeFileSync(full, next);
    }
  }
}
for (const p of platforms) if (fs.existsSync(path.join(repoRoot, p))) walk(path.join(repoRoot, p));
console.log(`${changed} fișiere ${dry ? 'de actualizat' : 'actualizate'} la DS ${version}.`);
