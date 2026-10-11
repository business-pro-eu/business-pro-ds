#!/usr/bin/env node

/**
 * Verificare de contrast WCAG 2.2 pe perechile de token-uri DS uzuale,
 * pentru temele light și dark. Raportează perechile sub 4.5:1 (text normal)
 * și sub 3:1 (text mare / componente UI). Doar raportare — nu modifică nimic.
 *
 * Rulare: node tools/check-contrast.js
 */

const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '../assets/css/tokens.css'), 'utf8');

function extractBlock(selectorRegex) {
  const map = {};
  const re = new RegExp(selectorRegex.source + '\\s*{([\\s\\S]*?)\\n  }', 'g');
  for (const m of source.matchAll(re)) {
    for (const decl of m[1].matchAll(/(--bp-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      map[decl[1]] = decl[2].trim();
    }
  }
  return map;
}

const light = extractBlock(/:root/);
const dark = { ...light, ...extractBlock(/\[data-bp-theme="dark"\]/) };

function resolve(vars, value, depth = 0) {
  if (depth > 12 || !value) return null;
  value = value.trim();
  const varMatch = value.match(/^var\((--bp-[a-z0-9-]+)(?:,\s*([^)]+))?\)$/);
  if (varMatch) {
    const inner = vars[varMatch[1]];
    return resolve(vars, inner !== undefined ? inner : varMatch[2], depth + 1);
  }
  return value;
}

function parseColor(value) {
  if (!value) return null;
  value = value.trim().toLowerCase();
  let m = value.match(/^#([0-9a-f]{6})$/);
  if (m) {
    const n = parseInt(m[1], 16);
    return [n >> 16, (n >> 8) & 255, n & 255, 1];
  }
  m = value.match(/^#([0-9a-f]{3})$/);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16)).concat(1);
  m = value.match(/^rgba?\(([\d.\s,%/]+)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  }
  if (value === 'white' || value === '#fff') return [255, 255, 255, 1];
  if (value === 'black') return [0, 0, 0, 1];
  return null; // color-mix, gradienți etc. — neevaluabile static
}

function blend(fg, bg) {
  const a = fg[3];
  return [0, 1, 2].map((i) => Math.round(fg[i] * a + bg[i] * (1 - a))).concat(1);
}

function luminance([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function ratio(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [descriere, token text, token fundal, prag]
const pairs = [
  ['Text pe fundal pagină', '--bp-color-text', '--bp-color-bg', 4.5],
  ['Text pe surface', '--bp-color-text', '--bp-color-surface', 4.5],
  ['Text muted pe fundal pagină', '--bp-color-text-muted', '--bp-color-bg', 4.5],
  ['Text muted pe surface', '--bp-color-text-muted', '--bp-color-surface', 4.5],
  ['Text muted pe surface-subtle', '--bp-color-text-muted', '--bp-color-surface-subtle', 4.5],
  ['Text strong pe surface', '--bp-color-text-strong', '--bp-color-surface', 4.5],
  ['Status success text/bg', '--bp-status-success-text', '--bp-status-success-bg', 4.5],
  ['Status warning text/bg', '--bp-status-warning-text', '--bp-status-warning-bg', 4.5],
  ['Status danger text/bg', '--bp-status-danger-text', '--bp-status-danger-bg', 4.5],
  ['Status info text/bg', '--bp-status-info-text', '--bp-status-info-bg', 4.5],
  ['Brand 500 ca text pe surface', '--bp-color-brand-500', '--bp-color-surface', 4.5],
  ['Brand 700 ca text pe surface', '--bp-color-brand-700', '--bp-color-surface', 4.5],
  ['Alb pe brand 500 (butoane/chips)', null, '--bp-color-brand-500', 4.5, [255, 255, 255, 1]],
  ['Alb pe brand 600 (butoane)', null, '--bp-color-brand-600', 4.5, [255, 255, 255, 1]],
];

let issues = 0;
for (const [themeName, vars] of [['light', light], ['dark', dark]]) {
  console.log(`\n=== Tema ${themeName} ===`);
  const pageBg = parseColor(resolve(vars, `var(--bp-color-bg)`)) || [255, 255, 255, 1];
  for (const [label, fgToken, bgToken, threshold, fixedFg] of pairs) {
    const fgRaw = fixedFg ? null : resolve(vars, `var(${fgToken})`);
    const bgRaw = resolve(vars, `var(${bgToken})`);
    let fg = fixedFg || parseColor(fgRaw);
    let bg = parseColor(bgRaw);
    if (!fg || !bg) { console.log(`  ?  ${label}: neevaluabil static (${fgRaw || 'fix'} / ${bgRaw})`); continue; }
    if (bg[3] < 1) bg = blend(bg, pageBg);
    if (fg[3] < 1) fg = blend(fg, bg);
    const r = ratio(fg, bg);
    const mark = r >= threshold ? 'OK ' : (r >= 3 ? 'AA-large' : 'FAIL');
    if (r < threshold) issues++;
    console.log(`  ${mark.padEnd(8)} ${label}: ${r.toFixed(2)}:1`);
  }
}
console.log(`\n${issues} perechi sub pragul AA (4.5:1).`);
