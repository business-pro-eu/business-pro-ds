# Distribuire fără build

Design System-ul este static și modular. Nu există pas de compilare.

## Dezvoltare

```html
<link rel="stylesheet" href="https://ds.business-pro.eu/dev/assets/css/business-pro.bundle.css?v=20260715-1">
```

Parametrul `v` se schimbă când trebuie invalidat cache-ul. Aplicațiile încarcă
`business-pro.bundle.min.css`, generat din modulele CSS DS. Fișierul
`business-pro.css` rămâne disponibil pentru dezvoltare și galerie, dar nu este
entrypoint-ul recomandat pentru platforme. Înainte de upload, rulează:

```bash
node tools/generate-css-bundle.js
node tools/generate-manifest.js
node tools/audit-ds.js
node tools/audit-consumers.js
```

`generate-css-bundle.js` produce și `business-pro.bundle.min.css` (entrypoint-ul
recomandat pentru platforme). `audit-consumers.js` verifică platformele:
fără CSS propriu, fără `<style>`/`style=`/`.style.*` în afara excepțiilor
documentate și fără clase `bp-*` inexistente în bundle. `check-contrast.js`
raportează perechile de token-uri sub pragul WCAG AA.

După upload se pot verifica:

```text
/dev/manifest.json
/dev/health.json
```

## Producție

Versiunile stabile sunt directoare imuabile:

```text
/v1.0.0/assets/css/business-pro.css
/v1.0.1/assets/css/business-pro.css
```

Pentru publicare se copiază directorul `dev` într-un director nou de versiune.
Aplicațiile aleg explicit versiunea folosită.

## Cache recomandat

- `/dev/`: `Cache-Control: no-cache`
- `/vX.Y.Z/`: `Cache-Control: public, max-age=31536000, immutable`

## Font Awesome Brands

Nucleul încarcă doar Font Awesome Solid. Pentru iconuri de brand:

```html
<link rel="stylesheet" href="https://ds.business-pro.eu/v1.0.0/assets/css/business-pro-brands.css">
```
