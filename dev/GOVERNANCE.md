# Regula „doar design system"

În platformele PHP nu există CSS propriu. Tot ce ține de aspect vine din DS (`ds.business-pro.eu/dev`). Dacă un stil lipsește, se creează în DS.

## Migrări de clase (redenumiri, unificări, ștergeri)

Când o clasă din DS se redenumește sau dispare, markup-ul se migrează în **toate** locurile care o folosesc: platformele PHP (`php/*`), galeria și JS-ul DS (`ds/dev/index.html`, `ds/dev/assets/js`), **extensia CRM** (`php/crm/extension/options.html` și `options.js`, care încarcă DS-ul) și copiile de lucru. Model de script: `tools/migrate-buttons-20261031.js`. `tools/sync-consumers.js` aliniază versiunea DS și în extensie; auditul de consumatori nu scanează extensia (conține scripturi injectate în pagini terțe), deci verificarea ei rămâne manuală: caută clasa veche în `php/crm/extension`.

## Ce interzice `tools/audit-consumers.js`

1. Fișiere `.css` în platforme.
2. Blocuri `<style>`.
3. `style="…"` care setează altceva decât custom properties `--bp-*`.
4. Prezentare imperativă din JS (`el.style.top = …`, `cssText`); sunt permise doar `style.setProperty('--bp-…', valoare)`.
5. Clase `bp-*` folosite în markup care nu există în bundle.
6. Clase fără prefix (`topbar-logo`, `quick-item`…) care nu există în bundle și nu sunt hook-uri JS.
7. Foi de stil din afara DS (`<link rel="stylesheet">`).
8. Versiune DS veche în link-urile literale (`business-pro.bundle.min.css?v=…`, `business-pro.js?v=…`).

Excepțiile reale (email, PDF, pagini offline, tema de brand dinamică, biblioteci terțe) stau în `tools/consumer-allowlist.json`, fiecare cu motiv scris. Nu se adaugă excepții pentru comoditate.

## Când lipsește un stil

1. Caută o clasă sau un modificator existent (`DS-COMPONENT-INVENTORY.md`, galeria `index.html`).
2. Dacă nu există, creează `bp-*` în `assets/css/advanced.css` (sau `components.css`), cu tokens și custom properties, nu valori fixe. Valorile calculate la rulare (poziții, procente) trec prin `--bp-*`.
3. Documentează clasa în `DS-COMPONENT-INVENTORY.md` (`tools/audit-inventory.js` pică dacă lipsește), apoi `node tools/audit-inventory.js --update-baseline`.
4. `node tools/generate-css-bundle.js && node tools/generate-manifest.js`, ridică `VERSION` și versiunea din `index.html` / `business-pro.css`.
5. `node tools/sync-consumers.js` aliniază versiunea în toate platformele.
6. `bash tools/ds-governance.sh` trebuie să treacă (scor 100/100, audit DS, inventar, consumatori).

## Unde se rulează

- Local: `bash ds/dev/tools/install-hooks.sh` instalează `pre-commit` și `pre-push` în fiecare platformă și în repo-ul DS (repo-ul DS trebuie clonat la `../../ds` față de platformă).
- CI: `.github/workflows/ds-governance.yml` în fiecare platformă (și în DS), pentru că hook-urile locale pot fi ocolite cu `--no-verify`.
- Manual: `bash ds/dev/tools/ds-governance.sh [php/<platformă>]`.
