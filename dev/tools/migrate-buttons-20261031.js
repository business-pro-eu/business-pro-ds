#!/usr/bin/env node
// Migrare butoane DS (DS 20261031-5), păstrată ca model pentru migrări viitoare de clase.
//   node ds/dev/tools/migrate-buttons-20261031.js [--write] php ds/dev/assets/js ds/dev/index.html
// Rădăcinile trebuie să includă ȘI extensia CRM (php/crm/extension: options.html/options.js folosesc DS-ul), nu doar php/<platformă>.
const fs=require('fs'),path=require('path');
const write=process.argv.includes('--write');
const roots=process.argv.slice(2).filter(a=>!a.startsWith('--'));
const SKIP=new Set(['node_modules','vendor','lib','data','logs','uploads','.git','graphify-out','tests','extension','storage','secrets']);
function walk(p,o=[]){const st=fs.statSync(p);if(st.isFile()){if(/\.(php|js|html)$/.test(p)&&!/\.min\./.test(p)&&!/bundle/.test(p))o.push(p);return o}
 for(const e of fs.readdirSync(p,{withFileTypes:true})){if(SKIP.has(e.name))continue;walk(path.join(p,e.name),o)}return o}
const W='(?<![A-Za-z0-9_-])',E='(?![A-Za-z0-9_-])';
const rx=t=>new RegExp(W+t.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')+E,'g');
function transform(c){
  let s=c;
  const has=t=>rx(t).test(s);
  const del=t=>{s=s.replace(rx(t),'')};
  const rep=(a,b)=>{s=s.replace(rx(a),b)};
  // hybrids and icon-only: text-button classes on an icon button -> icon button
  if(has('bp-icon-button')&&has('bp-button')){['bp-button','bp-button--sm','bp-button--xs','bp-button--ghost','bp-button--primary','bp-button--secondary'].forEach(del);rep('bp-button--danger','bp-icon-button--danger')}
  if(has('bp-button--icon-only')){['bp-button','bp-button--sm','bp-button--xs','bp-button--icon-only','bp-button--primary','bp-button--ghost'].forEach(del);rep('bp-button--danger','bp-icon-button--danger');s='bp-icon-button '+s}
  // ops-card icon buttons -> compact icon button
  rep('bp-ops-card__icon-button--danger','bp-icon-button--danger');
  rep('bp-ops-card__icon-button','bp-icon-button bp-icon-button--sm');
  ['bp-button--primary','bp-button--ghost-brand','bp-icon-button--solid','bp-icon-button--brand','bp-icon-button--neutral','bp-icon-button--plain'].forEach(del);
  ['bp-icon-button--teal','bp-icon-button--indigo','bp-icon-button--purple'].forEach(t=>rep(t,'bp-icon-button--info'));
  rep('bp-icon-button--warning','bp-icon-button--danger');
  if(s===c)return c;
  // dedupe + tidy (only plain-word tokens; interpolations untouched)
  const seen=new Set();
  s=s.replace(/(?<![\w${}-])(bp-[a-z0-9_-]+)(?![\w${}-])/g,(m,t)=>{if(!/^bp-(icon-)?button/.test(t))return m;if(seen.has(t))return '';seen.add(t);return m});
  return s.replace(/[ \t]{2,}/g,' ').replace(/^ +| +$/g,'').replace(/ +(?=\$\{)|(?<=\}) +(?= )/g,m=>m);
}
const classAttr=/((?:class(?:Name)?\s*=\s*)|(?:className\s*=\s*))(["'`])((?:(?!\2)[^])*)\2/g;
let total=0,files=0;
for(const r of roots){if(!fs.existsSync(r))continue;for(const f of walk(r)){const t=fs.readFileSync(f,'utf8');let n=0;
  const out=t.replace(classAttr,(m,pre,q,val)=>{if(!/bp-(icon-)?button|bp-ops-card__icon-button/.test(val))return m;const nv=transform(val);if(nv===val)return m;n++;return pre+q+nv+q});
  if(n){files++;total+=n;if(write)fs.writeFileSync(f,out);else console.log(path.relative('/Users/gheorghe.marius.alexandru/dev',f)+': '+n)}}}
console.log((write?'SCRIS ':'DRY ')+total+' șiruri în '+files+' fișiere');
