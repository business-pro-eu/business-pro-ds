# Pictograme

Singurul set permis este **Font Awesome Free 7 — Solid** (`fa-solid`) și **Brands** (`fa-brands`), din `assets/vendor/fontawesome`.

```html
<i class="bp-icon fa-solid fa-trash-can" aria-hidden="true"></i>
<i class="bp-icon fa-brands fa-whatsapp" aria-hidden="true"></i>
```

- Fără `fa-regular`/`fa-light`/`fa-thin`/`fa-duotone`, fără `bp-outline-icon` și fără măști SVG: `audit-consumers.js` (secțiunea 9) respinge orice altceva.
- Rotire: `fa-spin`. Dimensiuni: `bp-icon--sm` (16 px), implicit 18 px, `bp-icon--lg` (24 px), `bp-icon--xl` (32 px).
- Butoane doar cu pictogramă: `bp-icon-button` (vezi DS-COMPONENT-INVENTORY.md).
- Alegerea numelor: ultima rundă de alegere a pictogramelor (octombrie 2026) este aplicată în toate platformele (de ex. `fa-arrow-left-long`, `fa-envelope`).
- Experimentul Tabler (măști CSS) este păstrat doar în `tools/_tabler/`, nefolosit.
