# Business PRO DS → iOS/iPadOS 27 Migration Audit

Obiectiv: folosim elementele din kitul **iOS and iPadOS 27 (Community)** cât mai 1:1 posibil și nu reinventăm componente de la zero. Business PRO DS rămâne sursa tehnică unică pentru platforme, dar structura vizuală/comportamentală se aliniază cu kitul Figma.

## Principii

1. Mai întâi mapăm elementele existente din DS la echivalentul din kitul iOS/iPadOS 27.
2. Dacă există echivalent în kit, adaptăm DS-ul la acel model.
3. Dacă nu există echivalent în kit, păstrăm componenta Business PRO doar dacă este necesară pentru aplicațiile business.
4. Dacă o componentă lipsește din DS, dar există în kit și este utilă platformelor, o creăm în DS ca element reutilizabil.
5. Nu creăm componente dedicate unei singure platforme.
6. Platformele consumă doar `https://ds.business-pro.eu/dev/assets/css/business-pro.css` și `business-pro.js`.

## Inventar tehnic curent

Scanare locală `ds/dev/assets/css`:

| Fișier | Clase DS |
|---|---:|
| `foundation.css` | 28 |
| `components.css` | 386 |
| `advanced.css` | 317 |
| `documents.css` | 49 |
| `business-pro.css` | 1 |
| `gallery.css` | 20 |
| Total clase unice | 777 |

## Progres migrare

### 20260906-1 — Mobile Nav Capsule / 6-item Fit

Comparația cu barele de navigare Revolut și IKEA confirmă două reguli pentru
Business PRO DS:

- containerul și selecția activă sunt capsule complete, pentru a repeta
  rotunjirea percepută a ecranului iPhone;
- șase destinații pot fi afișate simultan fără scroll prin
  `bp-mobile-nav--6`; iconurile și etichetele sunt compactate, iar etichetele
  folosesc obligatoriu `bp-mobile-nav__label` pentru truncare controlată.

API-ul de personalizare este: `--bp-mobile-nav-radius`,
`--bp-mobile-nav-item-radius`, `--bp-mobile-nav-padding` și
`--bp-mobile-nav-gap`. `--bp-mobile-nav-bottom-offset` separă constant bara
de muchia de jos, apoi safe-area-ul iOS este adăugat automat.

### 20260709-7 — Apple semantic tokens

Tokenurile light/dark pentru labels, fills, backgrounds, separators, system
colors și glass labels au fost extrase din kitul Sketch local și adăugate în DS
ca strat `--bp-apple-*`. Tokenurile publice Business PRO rămân API-ul folosit de
platforme.

### 20260709-8 — Buttons

Pagina Apple `Buttons` include variante Light/Dark pentru `Bordered`,
`Bordered Prominent`, `Borderless` și `Destructive`, pe dimensiuni Small/Medium/
Large. Mapping-ul DS este:

- `bp-button` → Apple Bordered
- `bp-button--primary` → Apple Bordered Prominent
- `bp-button--ghost` → Apple Borderless
- `bp-button--danger` → Apple Destructive Prominent
- `bp-button--success` → Business PRO semantic prominent, pe același model
- `bp-icon-button` → Apple symbol button / toolbar control

Butoanele folosesc acum tokenuri publice `--bp-button-*`, iar forma implicită
este capsule/pill, conform stilului iOS.

### 20260709-9 — Menus / Popovers

Paginile Apple `Menus`, `Popovers` și `Action Sheets` au fost mapate inițial pe
DS:

- `bp-popover` → Apple Popover material
- `bp-overflow__menu` → Apple Menu / pull-down menu
- `bp-select-control__menu` și `bp-combobox__menu` → Apple Menu item list
- `bp-mobile-group-menu` → Action Sheet / compact mobile menu
- `bp-menu-section-title` și `bp-menu-separator` → section title / separator

Meniurile folosesc tokenuri publice `--bp-menu-*`, cu item-uri selected/hover
separate de active state-ul navigației principale.

### 20260709-10 — Forms / Fields

Paginile Apple `Text Fields`, `Toggles`, `Color Wells and Pickers` și `Steppers`
au fost mapate inițial pe DS:

- `bp-input`, `bp-select`, `bp-textarea`, `bp-file-input` → Apple Text Field
- `bp-select-control__trigger`, `bp-combobox` → Apple field + menu pattern
- `bp-switch` → Apple Toggle
- `bp-checkbox` → native checkbox cu accent Business PRO
- `bp-checklist-select__trigger`, `bp-fieldset`, `bp-input-unit` → field tokens reutilizabile

Form fields folosesc tokenuri publice `--bp-field-*`, iar toggles folosesc
`--bp-switch-*`.

### 20260709-11 — Search / Filters / Toolbars

Paginile Apple `Toolbars`, împreună cu pattern-urile de search și filter, au
fost mapate inițial pe DS:

- `bp-toolbar`, `bp-data-toolbar`, `bp-command-panel` → toolbar material
- `bp-search-box` → search field
- `bp-filter`, `bp-filter-group` → toolbar filter chips
- `bp-filter-panel` → compact filter panel / public booking filter bar

Aceste componente folosesc tokenuri publice `--bp-toolbar-*`,
`--bp-search-*` și `--bp-filter-*`.

### 20260709-12 — Segmented Controls / Tabs

Pagina Apple `Segmented Controls` a fost mapată inițial pe DS:

- `bp-segmented-control` → segmented control
- `bp-segmented-control--soft` → glass/compact segmented control
- `bp-segmented-control__item` → segment item
- `bp-tabs` / `bp-tab` → tablist pe același model vizual

Stările active acoperă `aria-pressed`, `aria-selected`, `.active` și
`.is-active`, pentru compatibilitate cu platformele existente. Componentele
folosesc tokenuri publice `--bp-segmented-*` și `--bp-segment-*`.

### 20260710-1 — Cards / Lists

Paginile Apple `Lists`, `Empty States` și pattern-urile de card din `Activity
Views` au fost mapate inițial pe DS:

- `bp-card`, `bp-dashboard-section`, `bp-form-section`, `bp-data-card`,
  `bp-record-card` → grouped card / list group surface
- `bp-list-card`, `bp-catalog__item` → list row
- `bp-empty` → empty state
- `bp-media-card`, `bp-info-panel`, `bp-fieldset` → reusable card surface

Componentele folosesc tokenuri publice `--bp-card-*`, `--bp-list-*` și
`--bp-empty-*`.

### 20260710-2 — Tables / Data Display

Pattern-urile Apple pentru `Lists`, grouped table view și data display au fost
mapate inițial pe tabelele DS:

- `bp-table-shell`, `bp-table-shell--glass` → grouped table container
- `bp-table` → table/list data display
- `bp-data-cards`, `bp-record-card`, `bp-data-card` → compact/mobile list cards
- `bp-cell-*`, `bp-row-*` → cell și row state styling
- `bp-table-col-*`, `bp-context-block`, `bp-record-count` → advanced diagnostic/operational tables aliniate la DS

Componentele folosesc tokenuri publice `--bp-table-*`, astfel încât hover,
header, row states și afișarea mobile-card să poată fi ajustate global.

### 20260710-3 — Status / Feedback

Pattern-urile Apple pentru feedback, status pills, loading și rezultat au fost
mapate inițial pe componentele DS:

- `bp-badge`, `bp-code-badge`, `bp-mini-badge` → status pill / capsule
- `bp-alert`, `bp-notice`, `bp-status-panel` → alert / inline feedback
- `bp-toast`, `bp-toast-stack` → transient feedback
- `bp-progress`, `bp-progress-native`, `bp-skeleton`, `bp-spinner` → loading /
  progress states
- `bp-status-dot`, `bp-status-icon-*`, `bp-result-state`, `bp-empty` → status /
  result display

Componentele folosesc tokenuri publice `--bp-status-*`, `--bp-alert-*`,
`--bp-toast-*`, `--bp-progress-*`, `--bp-spinner-*` și tokenurile deja existente
pentru empty states.

### 20260710-4 — Modals / Sheets / Dialogs

Pattern-urile Apple pentru sheets, full-screen covers și confirmation dialogs au
fost mapate inițial pe componentele DS:

- `bp-modal-backdrop` → overlay / dimming view
- `bp-modal`, `bp-modal--wide`, `bp-modal--fullscreen-mobile` → sheet / modal presentation
- `bp-bottom-sheet`, `bp-filter-sheet` → bottom sheet / filter sheet
- `bp-confirm` → confirmation dialog
- `bp-modal__header`, `bp-modal__body`, `bp-modal__footer`, `bp-modal__section` → sheet regions

Componentele folosesc tokenuri publice `--bp-modal-*`, `--bp-sheet-*` și
`--bp-confirm-*`, păstrând materialul Liquid Glass controlabil global.

### 20260710-5 — Dashboard / Metrics / Charts

Pattern-urile Apple pentru widgets/cards, charts și metric summaries au fost
mapate inițial pe componentele DS:

- `bp-dashboard`, `bp-dashboard__grid`, `bp-dashboard-section` → widget/card dashboard layout
- `bp-kpi`, `bp-metric-grid`, `bp-metric-panel`, `bp-metric-row` → metric widgets
- `bp-chart`, `bp-chart-legend`, `bp-bar-chart` → compact chart display
- `bp-score`, `bp-summary-panel`, `bp-price-summary` → score/summary widgets

Componentele folosesc tokenuri publice `--bp-dashboard-*`, `--bp-kpi-*`,
`--bp-metric-*`, `--bp-chart-*` și `--bp-summary-panel-*`.

### 20260710-6 — Booking / Public Flow Patterns

Pattern-urile Apple pentru grouped forms, counters/steppers, calendar/date
picker, media detail și payment summary au fost mapate inițial pe componentele
DS reutilizabile:

- `bp-flow-page`, `bp-flow-card` → public flow / focused task surface
- `bp-filter-panel`, `bp-counter` → grouped form + compact stepper
- `bp-calendar` → calendar/date availability display
- `bp-detail-layout`, `bp-price-summary`, `bp-payment-panel` → detail + summary layout
- `bp-gallery-manager`, `bp-slideshow` → media/gallery controls
- `bp-rating` → rating control

Componentele folosesc tokenuri publice `--bp-flow-*`, `--bp-calendar-*`,
`--bp-counter-*`, `--bp-gallery-*`, `--bp-slideshow-*` și `--bp-rating-*`.

### 20260710-7 — Contract / Document Patterns

Pattern-urile pentru document preview, editorial editor, signature area și PDF
viewer au fost mapate inițial pe componentele DS reutilizabile:

- `bp-document`, `bp-document--corporate`, `bp-document--premium` → document preview / paper surface
- `bp-document-choice`, `bp-document-thumbnail` → document template picker / preview card
- `bp-editor-step`, `bp-editor-list`, `bp-editor-list-card` → grouped editor flow
- `bp-signature-card`, `bp-signature-pad` → signature capture area
- `bp-pdf-viewer` → PDF/document viewer shell

Fișierul `documents.css` păstrează tokenurile specifice de hârtie/PDF
`--bp-doc-*`, dar editorul, thumbnail-urile, signature pad și viewer-ul sunt
legate acum de tokenuri DS precum `--bp-editor-*`, `--bp-document-*`,
`--bp-signature-*` și `--bp-pdf-viewer-*`.

### 20260710-8 — Full Apple Component Family Coverage

Familiile Apple relevante pentru web care rămăseseră parțial acoperite sau
fără API public dedicat au fost adăugate ca elemente DS reutilizabile:

- `bp-slider` → slider/range control
- `bp-page-control` → dots/page control
- `bp-action-sheet` → mobile action sheet
- `bp-activity-view` → share/activity grid
- `bp-date-picker`, `bp-time-picker` → date/time picker wrappers
- `bp-color-well`, `bp-color-picker` → color well / color picker
- `bp-sidebar` → sidebar iPad/desktop-style
- `bp-inspector-panel` → inspector side panel
- `bp-stepper-control` → compact Apple-style stepper

Componentele folosesc tokenuri publice dedicate, de forma
`--bp-slider-*`, `--bp-page-control-*`, `--bp-action-sheet-*`,
`--bp-activity-view-*`, `--bp-date-picker-*`, `--bp-color-well-*`,
`--bp-color-picker-*`, `--bp-sidebar-*`, `--bp-inspector-*` și
`--bp-stepper-control-*`.

### 20260710-9 — Apple Subcomponents / Future Patterns

Sub-componentele utile din kitul Apple, inclusiv variante nefolosite încă în
platforme, au fost adăugate ca elemente DS reutilizabile:

- `bp-list-accessory` → trailing values, disclosure, checkmark, info,
  delete/insert state
- `bp-menu-shortcut`, `bp-menu-submenu-indicator` → meniuri avansate
- `bp-toolbar-title`, `bp-search-toolbar`, `bp-tabbar-search` → toolbar/search
  variants
- `bp-alert-field` → alert/confirm cu input
- `bp-activity-header` → header pentru share/activity view
- `bp-avatar`, `bp-avatar-stack`, `bp-thumbnail` → person/app/thumb previews
- `bp-keyboard-accessory` → accessory bar pentru contexte mobile/editor

### 20260710-10 — Header / Mobile Navigation Hardening

Headerul și meniul mobile au fost auditate și întărite ca structură comună DS:

- `bp-mobile-nav--scrollable` afișează stabil 4 itemuri + peek din următorul;
- `bp-mobile-nav__label` este standardul recomandat pentru toate itemurile mobile;
- linkurile din mobile nav și group menu sunt protejate global împotriva underline;
- `bp-mobile-group-menu` are limită de înălțime și scroll intern pentru meniuri lungi;
- platformele au fost aliniate gradual la același markup pentru itemurile mobile.

### 20260710-11 — Header Tools Icon Button Normalization

Butoanele icon din `bp-header-tools` sunt normalizate global, indiferent dacă
sunt elemente directe, linkuri, butoane în form sau butoane în wrapper de
popover:

- aceeași lățime/înălțime: `--bp-control-height-sm`;
- padding resetat;
- `min-width`/`min-height` fixate;
- hover și `aria-expanded` aplicate pe orice `.bp-icon-button` din header tools.

### 20260710-12 — iOS-style Mobile Tab Bar Redesign

`bp-mobile-nav` a fost redesenat pentru a fi mai aproape de tab bar-ul iOS /
Liquid Glass:

- bară floating mai compactă, cu margini safe-area;
- material translucid mai fin, cu blur mai puternic;
- active state subtil, fără fundal portocaliu plin;
- iconuri mai clare și text mai discret;
- token-uri publice dedicate: `--bp-mobile-nav-*`;
- variante light/dark separate pentru material, border, shadow și active state.

### 20260710-13 — Mobile Nav Active State Alignment

Starea activă pentru `bp-mobile-nav__item` a fost aliniată cu meniul din header:

- fundal portocaliu Business PRO;
- icon și text alb;
- regula este definită global în DS, nu pe platforme individuale.

### 20260710-15 — Mobile Nav 5-item Variant

`bp-mobile-nav--5` este folosit pentru meniurile mobile unde vrem 5 itemuri
vizibile direct:

- track-ul scrollable folosește 5 coloane vizibile;
- nu mai există peek pentru al cincilea item;
- itemurile sunt ușor mai compacte pentru a încăpea pe ecrane mici.

### 20260710-16 — Unified Liquid Glass Transparency

Materialul Liquid Glass a fost uniformizat cu transparența headerului:

- `--bp-color-glass-surface` este suprafața unică pentru materialul Liquid Glass;
- border-ul strong a fost aliniat cu border-ul headerului;
- mobile nav folosește același material de fundal ca headerul;
- regulile sunt aplicate prin token-uri globale, deci afectează carduri,
  toolbar-uri, meniuri, modale și panouri fără CSS dedicat pe platforme.

### 20260710-17 — Dashboard Chart Panel

Dashboard-urile pot folosi acum `bp-chart-panel` ca wrapper reutilizabil pentru
grafice canvas / Chart.js:

- înălțime stabilă bazată pe `--bp-chart-height`;
- fundal Liquid Glass aliniat cu cardurile DS;
- border și radius DS;
- canvas responsiv care umple cardul.

### 20260711-1 — Flat List Cards for Nested Dashboards

`bp-list-card--flat` oferă o variantă de list row pentru interiorul cardurilor
Liquid Glass:

- fără efect de card în card;
- background transparent;
- border discret;
- hover cu fill subtil Apple/DS.

### 20260715-1 — Dropdown Material Alignment

Dropdown-urile și popover-ele folosesc acum același material Liquid Glass ca
headerul:

- `bp-popover`, `bp-overflow__menu`, `bp-select-control__menu`,
  `bp-combobox__menu`, `bp-mobile-group-menu`, `bp-icon-picker` și
  `bp-rich-editor__menu` sunt aliniate vizual cu headerul prin rețeta unică
  `bp-glass`;
- s-au eliminat gradientele/highlight-urile suplimentare care făceau unele
  dropdown-uri să pară mai transparente decât headerul.

- `bp-wheel-picker` → picker tip iOS wheel
- `bp-opacity-meter` → opacity/color picker helper
- `bp-inspector-toolbar` → toolbar pentru inspector/side panels

Aceste componente există în DS pentru utilizare ulterioară și nu schimbă markup
în platformele existente.

## Familii DS existente de parcurs

### 1. Foundation / layout

- `bp-root`
- `bp-container`
- `bp-page`
- `bp-view`
- `bp-stack`
- `bp-cluster`
- `bp-grid`
- `bp-reading-width`
- `bp-min-w-0`
- `bp-hidden`
- `bp-sr-only`

Echivalent iOS/iPadOS 27 de verificat:

- safe areas;
- layout margins;
- content containers;
- adaptive iPhone/iPad layout;
- spacing scale.

Status: mapat inițial în `20260710-3`.

### 2. App shell / navigation

- `bp-app-header`
- `bp-app-header__inner`
- `bp-app-header__title`
- `bp-brand`
- `bp-brand-group`
- `bp-product-badge`
- `bp-desktop-nav`
- `bp-nav-link`
- `bp-mobile-nav`
- `bp-mobile-nav__item`
- `bp-mobile-nav__track`
- `bp-mobile-group-menu`
- `bp-header-tools`

Echivalent iOS/iPadOS 27 de verificat:

- navigation bar;
- tab bar;
- toolbar;
- compact/regular size classes;
- overflow / more menu.

Status: mapat inițial în `20260710-6`.

### 3. Liquid Glass / surfaces

- `bp-glass`
- `bp-card--glass`
- `bp-dashboard-section--glass`
- `bp-data-toolbar--glass`
- `bp-table-shell--glass`
- `bp-record-card--glass`
- `bp-login-card--glass`
- `bp-command-panel--glass`
- `bp-list-card--glass`

Echivalent iOS/iPadOS 27 de verificat:

- Liquid Glass material;
- regular/thin/thick materials;
- toolbar material;
- sheet material;
- popover material.

Status: parțial implementat, trebuie aliniat 1:1 cu kitul.

### 4. Buttons / actions

- `bp-button`
- `bp-button--primary`
- `bp-button--ghost`
- `bp-button--danger`
- `bp-button--success`
- `bp-button--sm`
- `bp-button--block`
- `bp-button--mobile-icon-only`
- `bp-icon-button`
- `bp-icon-button--success`
- `bp-icon-button--warning`
- `bp-icon-button--danger`
- `bp-icon-button--info`
- `bp-action-group`
- `bp-action-grid-mobile`
- `bp-action-footer`

Echivalent iOS/iPadOS 27 de verificat:

- button styles;
- prominent button;
- bordered/tinted/plain button;
- destructive action;
- icon button;
- toolbar button;
- menu button.

Status: mapat inițial în `20260709-8`.

### 5. Menus / dropdowns / popovers

- `bp-popover`
- `bp-popover--header-end`
- `bp-popover--compact`
- `bp-popover--language`
- `bp-overflow`
- `bp-overflow__menu`
- `bp-overflow__menu--actions`
- `bp-overflow__menu--lookup`
- `bp-overflow__item`
- `bp-disclosure`
- `bp-disclosure-menu`

Echivalent iOS/iPadOS 27 de verificat:

- popover;
- menu;
- context menu;
- pull-down button;
- command menu.

Status: mapat inițial în `20260709-9`.

### 6. Forms / fields

- `bp-field`
- `bp-label`
- `bp-help`
- `bp-input`
- `bp-select`
- `bp-textarea`
- `bp-file-input`
- `bp-input-action`
- `bp-input-icon`
- `bp-select-control`
- `bp-combobox`
- `bp-checkbox`
- `bp-switch`
- `bp-form-grid`
- `bp-form-section`
- `bp-fieldset`
- `bp-option-group`

Echivalent iOS/iPadOS 27 de verificat:

- text field;
- secure field;
- picker/menu;
- toggle;
- checkbox alternative;
- form row/list cell;
- grouped form sections.

Status: mapat inițial în `20260709-10`.

### 7. Search / filters / command panels

- `bp-search-box`
- `bp-filter`
- `bp-filter-group`
- `bp-mobile-filter-trigger`
- `bp-filter-sheet`
- `bp-filter-panel`
- `bp-command-panel`
- `bp-command-panel--glass`
- `bp-checklist-select`
- `bp-autocomplete`

Echivalent iOS/iPadOS 27 de verificat:

- search field;
- search presentation;
- filter chips;
- sheets;
- segmented filters;
- multi-select/picker.

Status: mapat inițial în `20260709-11`.

### 8. Segmented controls / tabs

- `bp-segmented-control`
- `bp-segmented-control--soft`
- `bp-segmented-control__item`
- `bp-tabs`
- `bp-tabs--full`
- `bp-tab`
- `bp-tab-panel`

Echivalent iOS/iPadOS 27 de verificat:

- segmented control;
- tab view;
- tab bar;
- scope bar.

Status: mapat inițial în `20260709-12`.

### 9. Cards / lists

- `bp-card`
- `bp-card--flush`
- `bp-card--interactive`
- `bp-card--glass`
- `bp-list-card`
- `bp-list-card--glass`
- `bp-list-row`
- `bp-record-card`
- `bp-record-card--glass`
- `bp-data-card`
- `bp-media-card`
- `bp-integration-card`
- `bp-info-panel`
- `bp-summary-panel`

Echivalent iOS/iPadOS 27 de verificat:

- list cell;
- grouped list;
- card surface;
- media card;
- detail card.

Status: mapat inițial în `20260710-1`.

### 10. Tables / data display

- `bp-table-shell`
- `bp-table-shell--responsive`
- `bp-table-shell--glass`
- `bp-table`
- `bp-data-cards`
- `bp-data-toolbar`
- `bp-pagination`
- `bp-cell-*`
- `bp-table-card-value`

Echivalent iOS/iPadOS 27 de verificat:

- table;
- list transformation on compact screens;
- inspector/detail list;
- data table alternatives for iPad.

Status: mapat inițial în `20260710-2`.

### 11. Status / feedback

- `bp-alert`
- `bp-alert--success`
- `bp-alert--warning`
- `bp-alert--danger`
- `bp-alert--info`
- `bp-badge`
- `bp-badge--success`
- `bp-badge--warning`
- `bp-badge--danger`
- `bp-badge--info`
- `bp-status-dot`
- `bp-status-icon-*`
- `bp-toast`
- `bp-skeleton`
- `bp-empty`
- `bp-result-state`

Echivalent iOS/iPadOS 27 de verificat:

- alert;
- confirmation dialog;
- status pill;
- toast/snackbar alternative;
- progress/loading state;
- empty state.

Status: mapat inițial în `20260710-3`.

### 12. Modals / sheets / dialogs

- `bp-modal-backdrop`
- `bp-modal`
- `bp-modal--wide`
- `bp-modal--fullscreen-mobile`
- `bp-bottom-sheet`
- `bp-confirm`
- `bp-filter-sheet`

Echivalent iOS/iPadOS 27 de verificat:

- sheet;
- presentation detents;
- popover;
- alert dialog;
- full-screen cover.

Status: mapat inițial în `20260710-4`.

### 13. Dashboard / metrics / charts

- `bp-dashboard`
- `bp-dashboard-section`
- `bp-kpi`
- `bp-metric-grid`
- `bp-metric-panel`
- `bp-chart`
- `bp-bar-chart`
- `bp-progress`
- `bp-progress-native`

Echivalent iOS/iPadOS 27 de verificat:

- widgets/cards;
- charts;
- gauge/progress;
- dashboard sections.

Status: mapat inițial în `20260710-5`.

### 14. Booking / public flow patterns

- `bp-flow-page`
- `bp-flow-card`
- `bp-filter-panel`
- `bp-counter`
- `bp-calendar`
- `bp-detail-layout`
- `bp-price-summary`
- `bp-payment-panel`
- `bp-gallery-manager`
- `bp-slideshow`
- `bp-rating`

Echivalent iOS/iPadOS 27 de verificat:

- booking form as grouped form;
- counters/steppers;
- calendar/date picker;
- detail layout;
- payment summary.

Status: mapat inițial în `20260710-6`.

### 15. Contract / document patterns

- `bp-document`
- `bp-document--corporate`
- `bp-document--premium`
- `bp-document-choice`
- `bp-document-thumbnail`
- `bp-editor-step`
- `bp-editor-list`
- `bp-editor-list-card`
- `bp-signature-card`
- `bp-signature-pad`
- `bp-pdf-viewer`

Echivalent iOS/iPadOS 27 de verificat:

- document preview;
- editor stepper;
- forms/lists;
- signature area.

Status: mapat inițial în `20260710-7`.

### 16. Utilities / helpers

- spacing utilities: `bp-mt-*`, `bp-mb-*`;
- text utilities: `bp-text-*`, `bp-font-*`;
- layout utilities: `bp-grow`, `bp-shrink-0`, `bp-grid-full`, `bp-push-end`;
- color helpers: `bp-text-success`, `bp-text-warning`, `bp-text-danger`;
- misc: `bp-truncate`, `bp-break-anywhere`, `bp-display-contents`.

Echivalent iOS/iPadOS 27 de verificat:

- nu sunt componente vizuale, rămân helperi DS.

Status: verificat în `20260710-7`; păstrăm helperii DS, fără mapare vizuală.

## Ordine de lucru propusă

1. App shell: header, navigation, mobile tab bar.
2. Liquid Glass materials: surfaces, sheets, popovers.
3. Buttons and icon buttons.
4. Forms and grouped form rows.
5. Search, filters, segmented controls.
6. Menus and popovers.
7. Modals/sheets.
8. Cards/lists.
9. Tables/data cards.
10. Dashboard/KPI/charts.
11. Status/alerts/badges/toasts.
12. Booking-specific patterns.
13. Contract/document-specific patterns.
14. Utilities cleanup.
15. Final gap list: iOS elements missing from DS.

## Gap list final după migrarea inițială iOS/iPadOS 27

Migrarea inițială DS este acoperită pentru componentele folosite în platformele
curente. Din inventarul Apple rămân câteva familii care nu au încă o clasă DS
dedicată sau sunt doar parțial acoperite:

| Apple kit family | Status DS curent | Recomandare |
| --- | --- | --- |
| Sliders | acoperit în `20260710-8` | `bp-slider` |
| Page Controls | acoperit în `20260710-8` | `bp-page-control` |
| Color Wells and Pickers | acoperit în `20260710-8` | `bp-color-well`, `bp-color-picker` |
| Action Sheets / Activity Views | acoperit în `20260710-8` | `bp-action-sheet`, `bp-activity-view` |
| Date and Time Pickers | acoperit în `20260710-8` | `bp-date-picker`, `bp-time-picker` |
| Slideover / inspector side panels | acoperit în `20260710-8` | `bp-sidebar`, `bp-inspector-panel` |
| Keyboards / FaceID | nu sunt ținte web curente | nu implementăm în DS web |

Principiul rămâne: nu adăugăm aceste componente preventiv în platforme. Ele
există acum în DS pentru acoperire de familie, dar le folosim gradual doar când
există un caz real.

## Necesar pentru audit 1:1 cu Figma

Pentru mapare exactă trebuie acces la fișierul Figma:

- link la Community file / duplicate-ul din contul tău;
- sau să fie deschis în Figma și conectat prin plugin;
- ideal: paginile/componentele principale din kit exportate ca listă de componente.

Observație curentă: linkul primit
`https://www.figma.com/design/fXKVDQh4zMTanDBEqj1x90/iOS-and-iPadOS-27--Community-?node-id=221-56229`
expune prin connector doar pagina/nodul `Cover`:

- page/node: `221:56229`
- name: `Cover`
- child: `2401:4` / `Cover image`

Pentru audit real 1:1 avem nevoie de un link către pagina/nodul unde se află
componentele, de exemplu `Components`, `UI Components`, `Bars`, `Controls`,
`Inputs`, `Sheets`, `Materials` etc. Dacă fișierul Community trebuie duplicat
în contul tău pentru a expune paginile, acesta este următorul pas în Figma.

După acces, completăm pentru fiecare familie:

| DS component | iOS/iPadOS 27 component | Acțiune | Status |
|---|---|---|---|
| `bp-button` | Button | adaptare 1:1 | pending |
| `bp-modal` | Sheet / Alert | adaptare 1:1 | pending |
| `bp-mobile-nav` | Tab bar | adaptare 1:1 | pending |
| `bp-card` | Material/card/list cell | adaptare | pending |

## Documente de lucru

- `DS-COMPONENT-INVENTORY.md` — inventar complet generat din CSS-ul actual.

## 20260711-4 — Dashboard list sections content-start

Am adăugat în DS un modifier reutilizabil pentru secțiuni de dashboard care au
conținut de tip listă:

- `bp-dashboard-section--content-start`

Scop: păstrează aspectul existent al rândurilor (`bp-list-card--flat`), dar
oprește întinderea internă a rândurilor de grid în cardurile înalte. Astfel
conținutul din `Scheduled callbacks` și `Recent conversations` rămâne aliniat
sus, chiar dacă secțiunile din aceeași grilă au înălțimi egale.

## 20260715-1 — Liquid Glass unificat

Suprafețele de tip header, dropdown, popover, floating menu, icon picker, mobile
group menu și editor menu folosesc acum aceeași rețetă `bp-glass`. Tokenii și
clasele materiale paralele au fost eliminate pentru a evita existența mai multor
variante glass.
