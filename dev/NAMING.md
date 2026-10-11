# Convenții de denumire — Business PRO Design System

Principiu fundamental: **DS-ul descrie CE este un element de interfață, niciodată
UNDE este folosit.** Aplicațiile cunosc domeniul de business (lead, contract,
vehicul, rezervare); DS-ul cunoaște doar interfața (card, badge, toolbar, modal).

## Metodologie

Componentă → element → variantă → stare, cu prefixul de namespace `bp-`:

```
.bp-card                  componentă
.bp-card__header          element (BEM, __)
.bp-card--flush           variantă (BEM, --)
.bp-card.is-selected      stare (clasă is-*/has-* sau atribut nativ)
.bp-button--sm            dimensiune (--xs/--sm/--md/--lg/--xl)
```

`bp-` este prefixul de namespace al DS-ului (protecție la coliziuni), nu o
referință de produs. Toate clasele publice ale DS-ului îl poartă.

## Stări

O singură convenție, aplicată peste tot:

- clase de stare: `is-open`, `is-active`, `is-done`, `is-current`, `is-visible`,
  `is-selected`, `is-dragging`, `is-dragover`, `is-loading`, `has-value`, `has-notes`;
- atribute native când exprimă corect starea (au prioritate față de clase):
  `hidden`, `disabled`, `aria-expanded`, `aria-selected`, `aria-current`,
  `aria-invalid`, `aria-pressed`, `open` (pe `<details>`), `selected` (pe `<option>`);
- **interzis**: stări „goale" (`.open`, `.active`, `.done`, `.visible`) —
  auditul le respinge.

## Token-uri

- Semantice, nu de locație: `--bp-color-surface`, `--bp-color-text-muted`,
  `--bp-space-4`, `--bp-radius-md`, `--bp-status-danger-bg`.
- Paleta de fundație (`--bp-label-*`, `--bp-fill-*`, `--bp-gray-*`,
  `--bp-system-*`) este consumată doar prin token-urile semantice de deasupra ei.
- Valorile runtime intră prin custom properties publice: `--bp-progress-value`,
  `--bp-bar-value`, `--bp-zoom`, `--bp-filter-column-count`, `--bp-modal-width`.
- Interzis: nume de aplicație/platformă/vendor în token-uri (`--bp-leads-*`,
  `--bp-crm-*`, `--bp-apple-*` au fost eliminate).

## Clase CSS vs hook-uri JavaScript

- Clasele CSS aparțin prezentării. Hook-urile de comportament folosesc
  atribute `data-*`: `data-bp-filter-region`, `data-nav-dropdown`,
  `data-wizard-go`, `data-action`, `data-state`.
- Aplicațiile POT avea clase proprii de domeniu în markup (`pagespeed-badge`,
  `leads-extra-filters`) ca hook-uri JS — dar DS-ul nu are voie să le
  referențieze. Dacă DS-ul are nevoie de un punct de ancorare, definește o
  clasă `bp-*` sau un atribut `data-bp-*` generic (ex. `.bp-field-badge`).

## Când creezi o componentă / variantă / nimic

- **Componentă nouă**: conceptul UI e distinct și reutilizabil în ≥2 platforme
  (sau evident generalizabil) și nu poate fi exprimat prin compunerea celor
  existente. Numele descrie conceptul (`bp-entity-row`, `bp-step-timeline`),
  nu conținutul curent.
- **Variantă nouă**: aceeași anatomie, altă intenție vizuală reală
  (`bp-compact-stat--card`, `bp-autocomplete__list--menu`). Nu crea variante
  după locul de folosire (`--dashboard`, `--settings` — interzis).
- **Nimic**: dacă diferența e doar spațiere/aliniere, folosește utilitarele
  (`bp-mt-*`, `bp-gap-*`, `bp-flex-*`) sau token-urile de personalizare
  (`--bp-card-padding` etc.).
- Nume vagi interzise: `.bp-box`, `.bp-item`, `.bp-wrapper2`, `.bp-custom`,
  `.bp-misc`, `.bp-thing`.

## Business vs prezentare (exemplu canonic)

```html
<!-- Aplicația deține cuvântul "Qualified"; DS-ul deține aspectul badge-ului -->
<span class="bp-badge bp-badge--success">Qualified</span>
```

Variabilele PHP/JS de domeniu (`$lead`, `driver`, `beneficiary`) sunt corecte
și rămân — auditul vizează doar identificatorii de interfață.

## Excepții documentate

- Temele pentru biblioteci vendor păstrează selectorii bibliotecii
  (`.flatpickr-*`, `.ql-*`, `.tagify*`) — sunt API-ul acelor biblioteci.
- Culori de brand din lumea reală: `.bp-brand-whatsapp`.
- Markere de temă/platformă pe `<body>` (`bp-theme-dark`, `bp-contracts`) sunt
  emise de aplicații ca hook-uri; DS-ul nu le stilizează.

## Aplicare automată

`tools/audit-ds.js` respinge: selectori fără namespace (`bp-`/`is-`/`has-`/`ds-`)
în afara blocurilor vendor, stări „goale", cuvinte de aplicație/platformă în
selectori sau token-uri. `tools/audit-consumers.js` respinge CSS/stiluri inline
în platforme și clase `bp-*` inexistente în bundle.
