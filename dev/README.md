# Business PRO Design System

Fundația vizuală comună pentru aplicațiile Business PRO.

Proiectul este construit mobile-first și poate fi dezvoltat independent înainte ca
aplicațiile existente să înceapă migrarea.

## Regula „doar design system”

Platformele PHP nu au CSS propriu; stilurile care lipsesc se creează aici. Detalii, verificări și procedură: [GOVERNANCE.md](GOVERNANCE.md).

## Pornire locală

Deschide `index.html` direct în browser sau pornește un server static:

```bash
python3 -m http.server 8080
```

Galeria va fi disponibilă la `http://localhost:8080`.

## Structură

```text
assets/css/tokens.css       Design tokens și teme
assets/css/foundation.css   Reset izolat, tipografie și layout
assets/css/components.css   Componente reutilizabile
assets/css/advanced.css     Tipare avansate reutilizabile pentru aplicații
assets/css/business-pro.bundle.min.css Entrypoint recomandat pentru aplicații (minificat)
assets/css/business-pro.bundle.css Bundle nemificat pentru dezvoltare/diff
assets/css/business-pro.css Entrypoint modular pentru dezvoltare
assets/css/gallery.css      Stiluri folosite doar de documentație
assets/js/business-pro.js   Comportamente accesibile opționale și API-ul de notificări
assets/js/gallery.js        Interacțiunile galeriei
assets/css/icons.css       pictograme Tabler (măști CSS), generat din tools/icon-map.json
tools/generate-css-bundle.js Generează CSS-ul concatenat pentru aplicații
tools/audit-ds.js           Audit local pentru securitate/calitate DS
tools/audit-consumers.js    Audit de governance pentru platformele consumatoare
tools/check-contrast.js     Raport de contrast WCAG pe token-uri
index.html                  Galerie și pagină de documentație
```

## Convenții

- Toate clasele publice sunt prefixate cu `bp-`.
- CSS-ul de bază este pentru telefon; ecranele mai mari extind layoutul.
- Pe desktop, `bp-container` folosește întreaga lățime disponibilă, cu gutterul standard `--bp-page-gutter`.
- Componentele trebuie să funcționeze fără JavaScript atunci când este posibil.
- O componentă nu folosește culori sau dimensiuni hardcodate dacă există un token.
- Componentele noi trebuie să fie reutilizabile și prefixate `bp-`.
- Stilurile platform-specific nu intră în DS; componentele noi trebuie modelate ca tipare reutilizabile `bp-*`.
- Stările nu sunt comunicate exclusiv prin culoare.
- Ținta tactilă standard este de minimum 44 × 44 px.
- Iconurile folosesc exclusiv `bp-outline-icon` (forme Tabler outline, măști CSS din `icons.css`); Font Awesome nu mai există.
- `Brands` este încărcat pentru integrările care afișează mărci externe.

## Audit înainte de publicare

Înainte de upload pe `ds.business-pro.eu/dev`, rulează:

```bash
node tools/generate-manifest.js
node tools/audit-ds.js
```

`generate-manifest.js` rulează după generarea bundle-ului CSS:

```bash
node tools/generate-css-bundle.js
node tools/generate-manifest.js
node tools/score-ds.js
node tools/audit-ds.js
```

Auditul blochează artefacte publice inutile, SVG-uri nesigure, JavaScript cu
HTML injection, token-uri Liquid Glass eliminate, CSS corupt, bundle CSS stale
și importuri cu versiuni inconsistente. `generate-manifest.js` actualizează
`manifest.json` și `health.json`, astfel încât platformele și verificările
externe pot confirma versiunea și checksum-urile DS încărcate.
`score-ds.js` raportează scorul pe Securitate, Code Quality, Observability,
Performanță și Maintainability și eșuează dacă oricare categorie scade sub
100/100.

## Suprafețe opace

DS folosește suprafețe opace, lizibile și predictibile pentru header, dropdown,
popover, toolbar, carduri, tabele, sheet-uri și modale. Efectul Liquid Glass cu
transparență și `backdrop-filter` a fost eliminat pentru a evita problemele de
lizibilitate și suprapunere peste conținut.

Clasele existente cu sufix `--glass` și clasa `bp-glass` rămân disponibile doar
ca aliasuri de compatibilitate pentru platformele deja migrate. Ele randază acum
aceleași suprafețe opace DS și nu trebuie folosite pentru variante noi.

## Apple iOS/iPadOS 27 tokens

Începând cu `20260709-7`, DS include un strat semantic extras din kitul local
Apple iOS/iPadOS 27:

- `--bp-apple-label-*`
- `--bp-apple-fill-*`
- `--bp-apple-bg-*`
- `--bp-apple-separator*`
- `--bp-apple-system-*`
- `--bp-apple-glass-label-*`

Tokenurile publice Business PRO (`--bp-color-bg`, `--bp-color-surface`,
`--bp-color-text`, `--bp-color-border`, stările success/warning/danger/info etc.)
sunt legate gradual de aceste valori Apple. Platformele trebuie să continue să
folosească clasele și tokenurile `bp-*`; stratul `bp-apple-*` este fundația de
design, nu API-ul principal pentru aplicații.

Aliasuri compatibile:

```html
<section class="bp-card bp-card--glass">...</section>
<div class="bp-glass">...</div>
```

Pentru implementări noi se folosesc clasele de bază (`bp-card`, `bp-toolbar`,
`bp-table-shell`, `bp-popover`, `bp-modal`) fără a crea variante glass noi.

## Tabele responsive

Un tabel poate genera automat carduri mobile reutilizabile prin atributele DS:

```html
<div class="bp-table-shell">
  <table class="bp-table" id="clientsTable"
         data-bp-responsive-cards
         data-bp-cards-title-column="0"
         data-bp-cards-subtitle-column="1"
         data-bp-cards-action-column="5">
  </table>
</div>
```

Pe desktop rămâne tabelul, iar pe mobil DS afișează `bp-record-card`. Acțiunile
clonate în card sunt redirecționate către controalele originale, astfel încât
logica existentă a aplicației rămâne funcțională.

## Grile de indicatori

`bp-metric-grid` este grila comună pentru KPI-uri și rezumate. Este mobile-first,
cu două coloane implicit:

```html
<div class="bp-metric-grid bp-metric-grid--4">...</div>
<div class="bp-metric-grid bp-metric-grid--6 bp-metric-grid--spaced">...</div>
```

Varianta `--4` ajunge la patru coloane pe desktop, iar `--6` folosește trei
coloane pe tabletă și șase pe desktop. `--spaced` adaugă distanța standard față
de secțiunea următoare.

## Butoane

Începând cu `20260709-8`, butoanele sunt mapate pe familia Apple iOS/iPadOS 27
`Buttons`:

- `bp-button` = acțiune principală (plin, brand; negru la hover);
- `bp-button--secondary` = contur, devine ca principalul la hover;
- `bp-button--ghost` = fără fundal, text brand;
- `bp-button--danger` = distructiv plin (negru la hover); `bp-button--danger-ghost` = distructiv fără fundal;
- `bp-icon-button` = cerc plin doar cu pictogramă (culori: `--danger`, `--success`, `--info`; compact: `--sm`).

Pentru ajustări globale se folosesc tokenurile `--bp-button-*`, nu stiluri locale
în platforme.

## Meniuri și popovers

Începând cu `20260709-9`, meniurile sunt mapate pe familiile Apple iOS/iPadOS 27
`Menus`, `Popovers` și `Action Sheets`:

- `bp-popover` = popover material;
- `bp-overflow__menu` = pull-down menu;
- `bp-select-control__menu` / `bp-combobox__menu` = menu item list;
- `bp-mobile-group-menu` = action sheet / compact mobile menu.

Pentru ajustări globale se folosesc tokenurile `--bp-menu-*`. Item-urile active
din dropdown-uri folosesc selected state subtil, separat de active state-ul
navigației principale.

## Formulare și câmpuri

Începând cu `20260709-10`, câmpurile sunt mapate pe familiile Apple iOS/iPadOS
27 `Text Fields`, `Toggles` și `Controls`:

- `bp-input`, `bp-select`, `bp-textarea`, `bp-file-input` = text field;
- `bp-select-control__trigger` / `bp-combobox` = field + menu pattern;
- `bp-switch` = toggle;
- `bp-checkbox` = native checkbox cu accent Business PRO.

Pentru ajustări globale se folosesc tokenurile `--bp-field-*` și
`--bp-switch-*`.

## Search, filtre și toolbars

Începând cu `20260709-11`, toolbars și filtrele sunt mapate pe familia Apple
iOS/iPadOS 27 `Toolbars`:

- `bp-toolbar`, `bp-data-toolbar`, `bp-command-panel` = toolbar material;
- `bp-search-box` = search field;
- `bp-filter`, `bp-filter-group` = toolbar filter chips;
- `bp-filter-panel` = compact filter panel.

Pentru ajustări globale se folosesc tokenurile `--bp-toolbar-*`,
`--bp-search-*` și `--bp-filter-*`.

## Segmented controls și tabs

Începând cu `20260709-12`, segmented controls și tab-urile sunt mapate pe
familia Apple iOS/iPadOS 27 `Segmented Controls`:

- `bp-segmented-control` = segmented control;
- `bp-segmented-control--soft` = compact segmented control;
- `bp-segmented-control__item` = segment item;
- `bp-tabs` / `bp-tab` = tablist pe același model vizual.

Stările active suportă `aria-pressed`, `aria-selected`, `.active` și
`.is-active`, pentru compatibilitate cu platformele existente. Pentru ajustări
globale se folosesc tokenurile `--bp-segmented-*` și `--bp-segment-*`.

## Navigație mobilă

`bp-mobile-nav` este o bară floating în formă de capsulă, aliniată vizual cu
raza ecranului iPhone. Pentru 2–6 destinații se folosesc modifierii
`bp-mobile-nav--2` până la `bp-mobile-nav--6`. Varianta cu șase destinații
afișează toate itemurile direct; fiecare item trebuie să conțină iconul și
`bp-mobile-nav__label`, astfel încât etichetele lungi să fie trunchiate sigur.

```html
<nav class="bp-mobile-nav bp-mobile-nav--6" aria-label="Navigare principală">
  <a class="bp-mobile-nav__item" href="#" aria-current="page">
    <i class="bp-icon fa-solid fa-table-cells-large" aria-hidden="true"></i>
    <span class="bp-mobile-nav__label">Dashboard</span>
  </a>
  <!-- încă 5 destinații -->
</nav>
```

Personalizarea se face prin tokenurile `--bp-mobile-nav-radius`,
`--bp-mobile-nav-item-radius`, `--bp-mobile-nav-padding` și
`--bp-mobile-nav-gap`. `--bp-mobile-nav-bottom-offset` controlează spațiul
optic de sub bară, peste safe-area-ul iOS; valorile implicite păstrează atât
bara, cât și selecția activă în formă de pill.

## Carduri, liste și empty states

Începând cu `20260710-1`, cardurile și listele sunt mapate pe familia Apple
iOS/iPadOS 27 `Lists` și pe pattern-urile de grouped cards:

- `bp-card`, `bp-dashboard-section`, `bp-form-section`, `bp-data-card`,
  `bp-record-card` = grouped card / list group surface;
- `bp-list-card`, `bp-catalog__item` = list row;
- `bp-empty` = empty state;
- `bp-media-card`, `bp-info-panel`, `bp-fieldset` = reusable card surface.

Pentru ajustări globale se folosesc tokenurile `--bp-card-*`, `--bp-list-*` și
`--bp-empty-*`.

## Tabele și data display

Începând cu `20260710-2`, tabelele sunt mapate pe modelul Apple iOS/iPadOS 27
de grouped table/list data display:

- `bp-table-shell`, `bp-table-shell--glass` = container pentru grouped table (`--glass` este alias compatibil);
- `bp-table` = tabel standard;
- `bp-data-cards`, `bp-record-card`, `bp-data-card` = transformare mobile /
  list card;
- `bp-cell-*`, `bp-row-*` = aliniere, valori și stări pentru celule/rânduri;
- `bp-table-col-*`, `bp-context-block`, `bp-record-count` = helpers avansate reutilizabile pentru tabele operaționale.

Pentru ajustări globale se folosesc tokenurile `--bp-table-*`. Acestea controlează
background-ul containerului, header-ul, hover-ul, separatoarele și valorile din
cardurile mobile.

## Status, feedback și loading

Începând cu `20260710-3`, componentele de feedback sunt mapate pe pattern-uri
Apple iOS/iPadOS 27 pentru status pills, alerts și loading states:

- `bp-badge`, `bp-code-badge`, `bp-mini-badge` = capsule/status pill;
- `bp-alert`, `bp-notice`, `bp-status-panel` = feedback inline;
- `bp-toast`, `bp-toast-stack` = mesaj temporar;
- `bp-progress`, `bp-progress-native`, `bp-skeleton`, `bp-spinner` = loading /
  progress;
- `bp-status-dot`, `bp-status-icon-*`, `bp-result-state`, `bp-empty` = indicatori
  și stări finale.

Pentru ajustări globale se folosesc tokenurile `--bp-status-*`, `--bp-alert-*`,
`--bp-toast-*`, `--bp-progress-*`, `--bp-spinner-*` și `--bp-empty-*`.

### Notificări tranzitorii

`business-pro.js` expune `window.BPToast(message, type, duration, onDismiss)`
și `window.BPDesignSystem.toast(...)`. Sistemul creează automat o stivă,
folosește text sigur (fără HTML), permite închiderea manuală și elimină mesajele
după 4 secunde implicit. Tipurile sunt `success`, `danger`, `warning` și
`info`; `error` este un alias pentru `danger`. Pentru o eroare persistentă se
transmite durata `0`:

```js
BPToast('Nu s-au putut salva modificările.', 'error', 0);
BPToast('Modificările au fost salvate.', 'success');
```

Mesajele de tip `danger` folosesc `role="alert"`; celelalte folosesc
`role="status"`. Evenimentele `bp:toast` și `bp:toastdismiss` permit aplicației
să observe ciclul de viață fără a modifica implementarea DS.

## Modale, sheets și dialoguri

Începând cu `20260710-4`, modalele sunt mapate pe modelul Apple iOS/iPadOS 27
de sheet/dialog presentation:

- `bp-modal-backdrop` = overlay / dimming view;
- `bp-modal`, `bp-modal--wide`, `bp-modal--fullscreen-mobile` = modal / sheet;
- `bp-bottom-sheet`, `bp-filter-sheet` = bottom sheet / filter sheet;
- `bp-confirm` = confirmation dialog;
- `bp-modal__header`, `bp-modal__body`, `bp-modal__footer`, `bp-modal__section` = regiuni reutilizabile.

Pentru ajustări globale se folosesc tokenurile `--bp-modal-*`, `--bp-sheet-*`
și `--bp-confirm-*`.

## Dashboard, metrici și grafice

Începând cu `20260710-5`, componentele de dashboard sunt mapate pe pattern-uri
Apple iOS/iPadOS 27 pentru widgets/cards și compact chart display:

- `bp-dashboard`, `bp-dashboard__grid`, `bp-dashboard-section` = layout dashboard;
- `bp-kpi`, `bp-metric-grid`, `bp-metric-panel`, `bp-metric-row` = widget-uri de metrici;
- `bp-chart`, `bp-chart-legend`, `bp-bar-chart` = grafice compacte;
- `bp-score`, `bp-summary-panel`, `bp-price-summary` = score/summary widgets.

Pentru ajustări globale se folosesc tokenurile `--bp-dashboard-*`,
`--bp-kpi-*`, `--bp-metric-*`, `--bp-chart-*` și `--bp-summary-panel-*`.

## Public flow, booking și media controls

Începând cu `20260710-6`, pattern-urile folosite în fluxuri publice și booking
sunt mapate pe componente reutilizabile DS:

- `bp-flow-page`, `bp-flow-card` = pagină / card pentru task focusat;
- `bp-filter-panel`, `bp-counter` = grouped form + compact stepper;
- `bp-calendar` = calendar / availability display;
- `bp-detail-layout`, `bp-price-summary`, `bp-payment-panel` = detail + summary layout;
- `bp-gallery-manager`, `bp-slideshow` = galerie și media controls;
- `bp-rating` = rating control.

Pentru ajustări globale se folosesc tokenurile `--bp-flow-*`,
`--bp-calendar-*`, `--bp-counter-*`, `--bp-gallery-*`, `--bp-slideshow-*` și
`--bp-rating-*`.

## Contracte, documente și PDF viewer

Începând cu `20260710-7`, layouturile document/editor sunt mapate pe componente
reutilizabile DS:

- `bp-document`, `bp-document--corporate`, `bp-document--premium` = document preview / paper surface;
- `bp-document-choice`, `bp-document-thumbnail` = template picker / preview card;
- `bp-editor-step`, `bp-editor-list`, `bp-editor-list-card` = grouped editor flow;
- `bp-signature-card`, `bp-signature-pad` = signature capture area;
- `bp-pdf-viewer` = shell pentru PDF/document viewer.

`documents.css` păstrează tokenurile specifice documentelor `--bp-doc-*`, dar
zonele editoriale și interactive folosesc tokenuri DS precum `--bp-editor-*`,
`--bp-document-*`, `--bp-signature-*` și `--bp-pdf-viewer-*`.

## Componente iOS/iPadOS 27 de acoperire completă

Începând cu `20260710-8`, DS include și familiile Apple care nu erau încă
folosite direct în platforme, dar sunt necesare pentru acoperire completă:

- `bp-slider` / `bp-slider__control` = slider/range control;
- `bp-page-control` / `bp-page-control__dot` = dots pentru carousel/paging;
- `bp-action-sheet` = action sheet mobil;
- `bp-activity-view` = share/activity grid;
- `bp-date-picker`, `bp-time-picker` = wrappers pentru date/time picker;
- `bp-color-well`, `bp-color-picker` = color well și selector de culori;
- `bp-sidebar` = sidebar iPad/desktop-style;
- `bp-inspector-panel` = inspector/side panel;
- `bp-stepper-control` = stepper Apple-style compact.

Pentru ajustări globale se folosesc tokenurile:

- `--bp-slider-*`
- `--bp-page-control-*`
- `--bp-action-sheet-*`
- `--bp-activity-view-*`
- `--bp-date-picker-*`
- `--bp-color-well-*`
- `--bp-color-picker-*`
- `--bp-sidebar-*`
- `--bp-inspector-*`
- `--bp-stepper-control-*`

## Sub-componente Apple pregătite pentru viitor

Începând cu `20260710-9`, DS include și sub-componente utile din iOS/iPadOS 27,
pregătite pentru utilizare ulterioară:

- `bp-list-accessory` = trailing value, disclosure, checkmark, info,
  delete/insert state;
- `bp-menu-shortcut`, `bp-menu-submenu-indicator` = meniuri avansate;
- `bp-toolbar-title`, `bp-search-toolbar`, `bp-tabbar-search` = variante toolbar
  și search integrat;
- `bp-alert-field` = câmp input în alert/confirm;
- `bp-activity-header` = header pentru activity/share view;
- `bp-avatar`, `bp-avatar-stack`, `bp-thumbnail` = avataruri și thumbnails;
- `bp-keyboard-accessory` = accessory bar pentru contexte mobile/editor;
- `bp-wheel-picker` = picker tip wheel;
- `bp-opacity-meter` = helper pentru opacity/color picker;
- `bp-inspector-toolbar` = toolbar pentru inspector panel.

## Tipare pentru aplicații

`assets/css/advanced.css` include tipare compuse, independente de platformă:

- `bp-media-card`, `bp-slideshow` și `bp-detail-layout` pentru cataloage și pagini de detaliu;
- `bp-fieldset`, `bp-option-group` și `bp-inline-form` pentru formulare complexe;
- `bp-summary-panel`, `bp-price-summary` și `bp-payment-panel` pentru rezumate și plăți;
- `bp-integration-card`, `bp-info-grid` și `bp-info-panel` pentru integrări externe;
- `bp-result-state`, `bp-rating`, `bp-sticky-action-bar` și `bp-calendar` pentru fluxuri interactive.

Aceste clase trebuie preferate în locul stilurilor locale sau inline. Stilurile
inline rămân acceptabile numai pentru valori calculate din date, de exemplu
înălțimea procentuală a unei bare de grafic.

## Documente editoriale

Layouturile contractuale folosesc paleta stabilă `--bp-doc-*` din
`assets/css/documents.css`. Tokenurile pot fi suprascrise pentru o altă familie
de documente, dar nu urmăresc automat tema light/dark a aplicației, astfel încât
randarea și exportul PDF rămân predictibile.

## Integrare viitoare

După stabilizarea versiunii `1.0.0`, fișierele de distribuție vor putea fi
publicate la:

```text
https://ds.business-pro.eu/v1.0.0/business-pro.css
https://ds.business-pro.eu/v1.0.0/business-pro.js
```

Aplicațiile vor migra gradual, componentă cu componentă.

Pentru acoperirea platformei Profit vezi `PROFIT-COVERAGE.md`.
Pentru publicare fără build vezi `VERSIONING.md`.
