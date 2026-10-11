# Business PRO DS × Apple iOS/iPadOS 27 — audit comparativ final

Data audit: 2026-07-10  
DS analizat: `20260712-1`  
Sursă Apple analizată local:

- `.analysis/apple-ios27-sketch`
- `ds/dev/APPLE-IOS27-KIT-INVENTORY.md`

## Concluzie scurtă

Migrarea DS este completă pentru componentele folosite în platformele Business
PRO actuale și este coerentă cu direcția iOS/iPadOS 27 / Liquid Glass.

Nu este încă 1:1 complet cu întreg Apple UI Kit. Apple kit include familii care
nu există încă în DS ca API public dedicat, pentru că nu au apărut încă în
platforme sau sunt acoperite doar prin componente generale.

Verdict:

- acoperire pentru platformele curente: foarte bună;
- acoperire pentru familiile Apple relevante web: completă ca API DS;
- pentru “100% pixel-perfect Apple UI Kit” ar fi nevoie de ajustări vizuale
  suplimentare pe fiecare variantă de stare, nu de familii DS noi.

## Date verificate

Apple Sketch extraction:

- 34 pagini;
- 1.459 artboard-uri/componente;
- 105 shared text styles;
- 42 shared layer styles;
- 107 swatches.

DS curent:

- 833 clase `bp-*` detectate în CSS;
- 469 token-uri `--bp-*` detectate în CSS;
- versiune curentă: `20260712-1`;
- toate platformele verificate încarcă `business-pro.css?v=20260712-1`.

## Matrice comparativă Apple → DS

| Apple kit family | DS coverage | Clase DS relevante | Status |
| --- | --- | --- | --- |
| Materials / Liquid Glass | Tokenizat | `--bp-color-glass-*`, `--bp-glass-*`, `bp-card--glass`, `bp-table-shell--glass`, `bp-command-panel--glass` | Acoperit |
| Colors / Labels / Fills / Separators | Tokenizat | `--bp-apple-label-*`, `--bp-apple-fill-*`, `--bp-apple-bg-*`, `--bp-apple-separator*`, `--bp-apple-system-*` | Acoperit |
| Text Styles / Dynamic Type | Adaptat web | `--bp-font-*`, `bp-heading-*`, `bp-text-*` | Acoperit funcțional, nu 1:1 Dynamic Type nativ |
| System / app shell | Adaptat platformelor | `bp-topbar`, `bp-header-tools`, `bp-container`, `bp-page`, `bp-mobile-nav` | Parțial 1:1; web app shell, nu shell nativ |
| Buttons | Acoperit | `bp-button`, `bp-button--primary`, `bp-button--ghost`, `bp-button--danger`, `bp-icon-button` | Acoperit |
| Text Fields | Acoperit | `bp-input`, `bp-select`, `bp-textarea`, `bp-combobox`, `bp-select-control` | Acoperit |
| Toggles | Acoperit | `bp-switch` | Acoperit |
| Checkboxes | DS propriu | `bp-checkbox` | Acoperit DS; Apple kit are mai mult toggle/selection patterns |
| Segmented Controls | Acoperit | `bp-segmented-control`, `bp-segmented-control__item`, `bp-tabs`, `bp-tab` | Acoperit |
| Menus | Acoperit | `bp-overflow__menu`, `bp-menu-section-title`, `bp-menu-separator`, `bp-mobile-group-menu` | Acoperit pentru nevoi curente |
| Popovers | Acoperit | `bp-popover`, `bp-popover--header-end`, `bp-metric-panel` | Acoperit |
| Sheets | Acoperit | `bp-modal`, `bp-bottom-sheet`, `bp-filter-sheet`, `bp-modal-backdrop` | Acoperit |
| Alerts | Acoperit | `bp-alert`, `bp-confirm`, `bp-toast` | Acoperit funcțional; Apple alert input variants nu sunt API separat |
| Action Sheets | Acoperit | `bp-action-sheet`, `bp-action-sheet__group`, `bp-action-sheet__item` | Acoperit în `20260710-8` |
| Activity Views | Acoperit | `bp-activity-view`, `bp-activity-view__grid`, `bp-activity-view__item` | Acoperit în `20260710-8` |
| Lists | Acoperit | `bp-card`, `bp-list-card`, `bp-record-card`, `bp-data-card`, `bp-empty` | Acoperit |
| Tables / grouped table | Acoperit adaptat web | `bp-table`, `bp-table-shell`, `bp-data-cards`, `bp-record-card` | Acoperit |
| Tab Bars | Acoperit web/mobile | `bp-mobile-nav`, `bp-mobile-nav--4`, `bp-mobile-nav--enhanced` | Acoperit pentru platforme; nu toate variantele Apple search/tab bar |
| Toolbars | Acoperit | `bp-toolbar`, `bp-data-toolbar`, `bp-command-panel`, `bp-header-tools` | Acoperit |
| Sidebars | Acoperit | `bp-sidebar`, `bp-sidebar__nav`, `bp-sidebar__item` | Acoperit în `20260710-8` |
| Empty States | Acoperit | `bp-empty`, `bp-result-state` | Acoperit |
| Progress Indicators | Acoperit | `bp-progress`, `bp-progress-native`, `bp-spinner`, `bp-skeleton` | Acoperit |
| Steppers | Acoperit | `bp-counter`, `bp-stepper`, `bp-stepper-control` | Acoperit în `20260710-8` |
| Date and Time Pickers | Acoperit | `bp-calendar`, `bp-date-picker`, `bp-time-picker`, flatpickr styling | Acoperit în `20260710-8` |
| Sliders | Acoperit | `bp-slider`, `bp-slider__control` | Acoperit în `20260710-8` |
| Page Controls | Acoperit | `bp-page-control`, `bp-page-control__dot` | Acoperit în `20260710-8` |
| Color Wells and Pickers | Acoperit | `bp-color-well`, `bp-color-picker`, `bp-color-control`, `bp-icon-picker` | Acoperit în `20260710-8` |
| Keyboards | Neaplicabil web | — | Nu implementăm în DS web |
| FaceID | Neaplicabil web | — | Nu implementăm în DS web |
| Document/editorial patterns | DS extra | `bp-document`, `bp-editor-step`, `bp-signature-pad`, `bp-pdf-viewer` | Acoperit DS; nu este Apple kit direct |
| Dashboard/KPI/charts | DS extra | `bp-dashboard`, `bp-kpi`, `bp-chart`, `bp-metric-panel` | Acoperit DS; nu este Apple kit direct |

## Diferențe importante față de 1:1 Apple

### 1. Apple are foarte multe variante de stare, DS are API compact

Exemplu: Apple Buttons are variante Light/Dark, Small/Medium/Large, Text,
Symbol, Symbol + Text, Disabled, Idle, Pressed, Bordered, Prominent etc.

DS are o API mai compactă:

- `bp-button`
- `bp-button--primary`
- `bp-button--ghost`
- `bp-button--danger`
- `bp-button--sm`
- `bp-icon-button`

Este corect pentru web și pentru cod curat, dar nu este 1:1 ca număr de
variante.

### 2. Familiile Apple rămase au fost componentizate explicit în `20260710-8`

Componentele adăugate pentru acoperire de familie:

- `bp-slider`;
- `bp-page-control`;
- `bp-action-sheet`;
- `bp-activity-view`;
- `bp-color-well`;
- `bp-color-picker`;
- `bp-date-picker`;
- `bp-time-picker`;
- `bp-sidebar`;
- `bp-inspector-panel`;
- `bp-stepper-control`, ca stepper Apple-style separat de `bp-counter`.

### 3. Sub-componentele Apple utile pentru viitor au fost adăugate în `20260710-9`

Pe lângă familiile mari, DS include acum și sub-elemente/variante utile din kit:

- `bp-list-accessory` pentru trailing value, disclosure, checkmark, info,
  delete/insert state;
- `bp-menu-shortcut` și `bp-menu-submenu-indicator`;
- `bp-toolbar-title`, `bp-search-toolbar`, `bp-tabbar-search`;
- `bp-alert-field`;
- `bp-activity-header`;
- `bp-avatar`, `bp-avatar-stack`, `bp-thumbnail`;
- `bp-keyboard-accessory`;
- `bp-wheel-picker`;
- `bp-opacity-meter`;
- `bp-inspector-toolbar`.

### 4. Headerul și meniul mobile au fost întărite în `20260712-1`

Versiunea `20260712-1` păstrează acoperirea Apple existentă și adaugă
standardizare pentru shell-ul aplicațiilor:

- mobile nav scrollable cu 4 itemuri vizibile + peek;
- label standardizat prin `bp-mobile-nav__label`;
- protecție anti-underline pentru itemurile mobile;
- scroll intern pentru `bp-mobile-group-menu`.

### 5. DS este adaptat pentru web, nu copie pixel-perfect nativă

Apple UI Kit descrie componente native iOS/iPadOS. DS trebuie să rămână web,
responsive și multi-platformă. Din acest motiv, echivalarea corectă este:

- token-uri Apple → token-uri DS;
- comportament Apple → pattern DS;
- material/glass Apple → suprafețe DS;
- nu copiere pixel-perfect a tuturor artboard-urilor.

## Recomandare pentru “100% component coverage”

Începând cu `20260710-9`, DS are clase publice pentru toate familiile Apple
relevante pentru web și pentru sub-componentele utile în aplicațiile Business
PRO. Componentele noi sunt create ca elemente reutilizabile, nu ca stiluri
pentru o platformă anume.

Următorul pas nu este să mai adăugăm clase preventiv, ci să le folosim gradual
în platforme când apar cazuri reale.

## Recomandare pentru “100% platform coverage”

Dacă obiectivul este doar ca platformele Business PRO existente să fie complet
migrate și coerente, nu este obligatoriu să implementăm toate componentele
lipsă de mai sus acum.

Pentru platformele actuale, prioritățile reale sunt:

1. audit vizual în browser pentru fiecare platformă;
2. verificare light/dark/system theme;
3. verificare mobile-first;
4. verificare popovers/modals/dropdowns în viewport mic;
5. eliminare stiluri locale rămase în platforme;
6. implementarea componentelor lipsă doar când apar cazuri reale.

## Verdict final

DS `20260712-1` este matur și coerent cu iOS/iPadOS 27 pentru componentele
folosite acum.

DS `20260712-1` acoperă și familiile Apple relevante pentru web care nu erau
încă folosite în platforme, plus sub-componente utile pentru migrare viitoare.

Pentru un standard sănătos pe termen lung, recomand:

- să nu copiem toate variantele Apple doar ca să avem “număr complet”;
- să folosim componentele noi gradual, când apar cazuri reale;
- să păstrăm auditul acesta ca checklist pentru următoarea etapă.
