# Business PRO DS Component Inventory

Inventar generat din `ds/dev/assets/css/*.css`. Acesta este documentul de lucru pentru maparea 1:1 cu kitul Figma `iOS and iPadOS 27 (Community)`.

Clase unice totale: **544** (după eliminarea claselor nefolosite, DS 20261030-1; a doua eliminare în DS 20261030-3: 263 de clase fără nicio folosire în platformele PHP, în galerie sau în JS — familiile document, flatpickr, media-card, checklist-select, detail-layout, filter-panel, integration-card, slideshow ș.a.; `bp-badge--neutral`/`--muted` → `--plain`, `bp-code-chip` → `bp-code-badge`, `bp-chip` → `bp-badge--plain`; rămân Quill și Tagify) (adăugate 2026-10-12: `bp-login-card--md/--lg`, `bp-page--narrow/--wide`, `bp-card--roomy`, `bp-table--fit` (DS 20261012-2), `bp-fieldset--plain`, `bp-form-actions`, `bp-form-actions__push`, `bp-rule-list`, `bp-feedback-slot` (DS 20261012-3), `bp-eyebrow` (DS 20261012-4); token nou `--bp-shadow-page-edge` (DS 20261012-5); custom property nouă `--bp-segment-width` pe `bp-import-run__segment`; adăugate 2026-10-23 (DS 20261023-1): `bp-wizard` (+`__steps`, `__panel`), `bp-stepper--vertical`, `bp-stepper__label`, `bp-choice-grid--tiles`, `bp-choice-card--tile`, `bp-choice-card__meta`, `bp-toggle-list` (+`--compact`, `--single`, `--scroll`), `bp-header-metric` (+`__icon`, `__value`, `__unit`), `bp-popover--hover`, `bp-header-profile--single-line`, `bp-table--fixed`, `bp-col--xs/sm/md/lg/xl`, `bp-form-grid--start`, `bp-filter-dropdown__menu--scroll`, `bp-dashboard-section__header--steady`; stare `is-group-start` pe rândurile de tabel; adăugate în DS 20261023-2: `bp-page-brand`, `bp-page-footer`, `bp-disclosure`, `bp-plain-list`, `bp-text-wrap`, `bp-alert__body`, `bp-select-control--block`, `bp-select-control__search`, `bp-select-control__options`, `bp-select-control__menu--searchable`, `bp-col--xxl`, `bp-choice-card--sortable`, `bp-choice-card__order`, `bp-choice-card__move`, `bp-modal-backdrop--raised`, `bp-modal--contained`; stare `is-dimmed`, regulă globală de 16px pentru câmpuri pe ecrane tactile).

## Rezumat pe fișiere

| Fișier | Clase |
|---|---:|
| `advanced.css` | 161 |
| `business-pro.css` | 1 |
| `components.css` | 208 |
| `documents.css` | 22 |
| `foundation.css` | 26 |
| `gallery.css` | 20 |
| `tokens.css` | 0 |

## Rezumat pe familii

| Familie | Clase |
|---|---:|
| App shell / navigation | 29 |
| Booking / public flow | 53 |
| Buttons / actions | 29 |
| Cards / lists | 76 |
| Contracts / documents | 20 |
| Dashboard / metrics / charts | 69 |
| Documentation gallery only | 0 |
| Forms / inputs | 47 |
| Foundation / layout | 51 |
| Glass / surfaces | 0 |
| Legacy/general settings helpers | 0 |
| Menus / popovers / disclosure | 21 |
| Modals / sheets / dialogs | 11 |
| Other utilities / specialized patterns | 129 |
| Search / filters / command | 44 |
| Segmented / tabs | 24 |
| Status / feedback | 55 |
| Tables / data display | 34 |
| Typography / text utilities | 21 |

## Inventar pe familii

### App shell / navigation

- `bp-app-header`
- `bp-app-header__inner`
- `bp-app-layout`
- `bp-brand`
- `bp-brand--image`
- `bp-brand-group`
- `bp-desktop-nav`
- `bp-header-popover-anchor`
- `bp-header-tools`
- `bp-mobile-group-menu`
- `bp-mobile-group-menu__item`
- `bp-mobile-nav`
- `bp-mobile-nav--2`
- `bp-mobile-nav--3`
- `bp-mobile-nav--4`
- `bp-mobile-nav--5`
- `bp-mobile-nav--6`
- `bp-mobile-nav--enhanced`
- `bp-mobile-nav--scrollable`
- `bp-mobile-nav__item`
- `bp-mobile-nav__label`
- `bp-mobile-nav__track`
- `bp-nav-link`
- `bp-product-badge`
- `bp-theme-logo`
- `bp-theme-logo__image`
- `bp-theme-logo__image--dark`
- `bp-theme-logo__image--light`

### Booking / public flow

- `bp-calendar`
- `bp-calendar__cell`
- `bp-calendar__cell--empty`
- `bp-calendar__cell--header`
- `bp-calendar__cell--today`
- `bp-calendar__grid`
- `bp-calendar__nav`

### Buttons / actions

- `bp-action-footer`
- `bp-action-grid-mobile`
- `bp-action-group`
- `bp-action-group--end`
- `bp-action-group--wrap`
- `bp-bulk-bar`
- `bp-button`
- `bp-button--block`
- `bp-button--danger`
- `bp-button--danger-ghost`
- `bp-button--ghost`
- `bp-button--icon-only`
- `bp-button--icon-only-mobile`
- `bp-button--secondary`
- `bp-button--sm`
- `bp-button__label`
- `bp-icon--lg`
- `bp-icon--sm`
- `bp-icon--xl`
- `bp-icon-button`
- `bp-icon-button--danger`
- `bp-icon-button--info`
- `bp-icon-button--label`
- `bp-icon-button--success`
- `bp-icon-button--neutral`
- `bp-icon-button--sm`
- `bp-icon-button--warning`
- `bp-sticky-action-bar`

### Cards / lists

- `bp-card`
- `bp-card--roomy`
- `bp-card--flush`
- `bp-card--glass`
- `bp-card--interactive`
- `bp-card__body`
- `bp-card__footer`
- `bp-card__header`
- `bp-card__title`
- `bp-catalog`
- `bp-catalog__item`
- `bp-catalog__list`
- `bp-catalog__name`
- `bp-choice-card`
- `bp-choice-card--compact`
- `bp-data-cards`
- `bp-data-cards--grid`
- `bp-list-card`
- `bp-list-card--danger`
- `bp-list-card--glass`
- `bp-list-card--warning`
- `bp-list-card__body`
- `bp-list-card__icon`
- `bp-list-card__meta`
- `bp-list-card__title`
- `bp-list-stack`
- `bp-record-card`
- `bp-record-card--glass`
- `bp-record-card__details`
- `bp-input--picker` (read-only display of a date/calendar picker; normal text colour)
- `bp-table--fixed` (+ `bp-col--xs`, `--sm`, `--md`, `--lg`, `--xl` column widths)
- `bp-record-card__chips-section` (+ `__chips-title`, `__chips`, `__chip`, `__chip-value`, `__chip-label`, `is-empty`; table attributes `data-bp-cards-chip-columns`, `data-bp-cards-chips-title`)
- `bp-record-card__footer`
- `bp-record-card__header`
- `bp-record-card__subtitle`
- `bp-record-card__title`
- `bp-record-card__title-group`
- `bp-record-card__value`
- `bp-profile-grid`
- `bp-profile-grid--three`
- `bp-summary-panel`
- `bp-summary-panel--flush`
- `bp-summary-panel__row`
- `bp-feature-grid`
- `bp-feature-grid--2`

### Contracts / documents


### Dashboard / metrics / charts

- `bp-bar-chart`
- `bp-bar-chart__bar`
- `bp-bar-chart__label`
- `bp-chart`
- `bp-chart--12`
- `bp-chart--responsive-period`
- `bp-chart-legend`
- `bp-chart-legend__dot`
- `bp-chart-legend__dot--cost`
- `bp-chart__bar`
- `bp-chart__bar--cost`
- `bp-chart__bar--h-0`
- `bp-chart__bar--h-10`
- `bp-chart__bar--h-100`
- `bp-chart__bar--h-15`
- `bp-chart__bar--h-20`
- `bp-chart__bar--h-25`
- `bp-chart__bar--h-30`
- `bp-chart__bar--h-35`
- `bp-chart__bar--h-40`
- `bp-chart__bar--h-45`
- `bp-chart__bar--h-5`
- `bp-chart__bar--h-50`
- `bp-chart__bar--h-55`
- `bp-chart__bar--h-60`
- `bp-chart__bar--h-65`
- `bp-chart__bar--h-70`
- `bp-chart__bar--h-75`
- `bp-chart__bar--h-80`
- `bp-chart__bar--h-85`
- `bp-chart__bar--h-90`
- `bp-chart__bar--h-95`
- `bp-chart__bars`
- `bp-chart__group`
- `bp-chart__group--extended`
- `bp-chart__label`
- `bp-dashboard`
- `bp-dashboard-section`
- `bp-dashboard-section--glass`
- `bp-dashboard-section__header`
- `bp-dashboard-section__title`
- `bp-dashboard__grid`
- `bp-dashboard__grid--2`
- `bp-kpi`
- `bp-kpi--centered`
- `bp-kpi__label`
- `bp-kpi__value`
- `bp-metric-grid`
- `bp-metric-grid--4`
- `bp-metric-grid--spaced`
- `bp-metric-panel`
- `bp-metric-panel__empty`
- `bp-metric-panel__loading`
- `bp-metric-panel__section`
- `bp-metric-panel__title`
- `bp-metric-row`
- `bp-metric-row__fill`
- `bp-metric-row__label`
- `bp-metric-row__meter`
- `bp-metric-row__value`
- `bp-metric-row__value--danger`
- `bp-metric-row__value--success`
- `bp-metric-row__value--warning`
- `bp-progress`
- `bp-progress__bar`

### Documentation gallery only

- `ds-code`
- `ds-demo-panel`
- `ds-demo-panel__surface`
- `ds-hero`
- `ds-hero__copy`
- `ds-hero__inner`
- `ds-hero__meta`
- `ds-hero__title`
- `ds-preview-shell`
- `ds-section`
- `ds-section__header`
- `ds-swatch`
- `ds-swatch-grid`
- `ds-swatch__color`
- `ds-swatch__label`
- `ds-table-desktop-label`
- `ds-table-mobile-label`

### Forms / inputs

- `bp-otp`
- `bp-otp__digit`
- `bp-otp__switch`
- `bp-checkbox`
- `bp-color-control`
- `bp-color-control__swatch`
- `bp-color-control__value`
- `bp-field`
- `bp-fieldset`
- `bp-file-drop`
- `bp-file-drop__copy`
- `bp-file-drop__icon`
- `bp-file-drop__input`
- `bp-file-drop__meta`
- `bp-file-drop__target`
- `bp-form-grid`
- `bp-form-grid--2`
- `bp-form-grid--3`
- `bp-form-grid--4`
- `bp-form-grid--5`
- `bp-form-grid__full`
- `bp-form-section`
- `bp-form-section-label`
- `bp-help`
- `bp-input`
- `bp-input-action`
- `bp-input-action__button`
- `bp-input-group`
- `bp-input-icon`
- `bp-input-icon__icon`
- `bp-label`
- `bp-select`
- `bp-select-control`
- `bp-select-control--content`
- `bp-select-control__icon`
- `bp-select-control__menu`
- `bp-select-control__menu--portal`
- `bp-select-control__option`
- `bp-select-control__sizer`
- `bp-select-control__trigger`
- `bp-select-control__value`
- `bp-switch`
- `bp-switch__track`

### Foundation / layout

- `bp-cluster`
- `bp-cluster--between`
- `bp-cluster--centered`
- `bp-cluster--start`
- `bp-constrain-md`
- `bp-container`
- `bp-display-contents`
- `bp-grid`
- `bp-grid--2`
- `bp-grid--3`
- `bp-grid-full`
- `bp-grid-span-2`
- `bp-grid-span-3`
- `bp-grow`
- `bp-hidden`
- `bp-min-w-0`
- `bp-page`
- `bp-page--narrow`
- `bp-page--wide`
- `bp-page-footer`
- `bp-app-footer`
- `bp-app-footer__inner`
- `bp-app-footer__copyright`
- `bp-app-footer__legal`
- `bp-app-footer__link`
- `bp-overflow__menu--note`
- `bp-wordmark`
- `bp-desktop-nav--adaptive`
- `bp-rank-list`
- `bp-rank-list__row`
- `bp-rank-list__row--placeholder`
- `bp-rank-list__rank`
- `bp-rank-list__main`
- `bp-rank-list__label`
- `bp-rank-list__sub`
- `bp-rank-list__value`
- `bp-rank-list__share`
- `bp-wordmark__accent`
- `bp-page-header`
- `bp-page-header--inline`
- `bp-record-card__parents`, `bp-record-card__parents-label`, `bp-record-card__parents-list`: parents block of a record card (label + e-mail rows)
- `bp-page-header--center`
- `bp-page-header--centered`
- `bp-page-header__actions`
- `bp-page-header__copy`
- `bp-push-end`
- `bp-root`
- `bp-shrink-0`
- `bp-sr-only`
- `bp-stack`
- `bp-stack--page`
- `bp-stack--sections`
- `bp-stack--sm`
- `bp-view`

### Glass / surfaces


### Legacy/general settings helpers

- `gs-spam-channel-label`
- `gs-spam-divider`
- `gs-spam-grid`
- `gs-zone-label`

### Menus / popovers / disclosure

- `bp-disclosure`
- `bp-disclosure-menu`
- `bp-disclosure__body`
- `bp-disclosure__chevron`
- `bp-disclosure__header`
- `bp-dropdown-list`
- `bp-dropdown-search`
- `bp-menu-toggle-state`
- `bp-overflow`
- `bp-overflow__item`
- `bp-overflow__item--danger`
- `bp-overflow__menu`
- `bp-overflow__menu--actions`
- `bp-overflow__menu--lookup`
- `bp-overflow__menu--start`
- `bp-overflow__trigger`
- `bp-popover`
- `bp-popover--compact`
- `bp-popover--header-end`
- `bp-popover__body`

### Modals / sheets / dialogs

- `bp-modal`
- `bp-modal--fullscreen-mobile`
- `bp-modal--wide`
- `bp-modal-backdrop`
- `bp-modal__body`
- `bp-modal__footer`
- `bp-modal__footer--actions`
- `bp-modal__footer--flush`
- `bp-modal__header`
- `bp-modal__section`
- `bp-modal__section-title`
- `bp-modal__title`

### Other utilities / specialized patterns

- `bp-choice-grid`
- `bp-choice-grid--5`
- `bp-combobox`
- `bp-combobox__empty`
- `bp-combobox__menu`
- `bp-combobox__option`
- `bp-combobox__toggle`
- `bp-contact-list`
- `bp-contact-list__item`
- `bp-contact-list__value`
- `bp-control-fill`
- `bp-control-narrow`
- `bp-diagnostic-block`
- `bp-diagnostic-block__body`
- `bp-diagnostic-block__header`
- `bp-diagnostic-block__title`
- `bp-diagnostic-list`
- `bp-diagnostic-row`
- `bp-diagnostic-row--surface`
- `bp-diagnostic-row__detail`
- `bp-diagnostic-row__label`
- `bp-diagnostic-row__label--strong`
- `bp-icon`
- `bp-icon-choice`
- `bp-icon-picker`
- `bp-inline-status`
- `bp-inline-status--centered`
- `bp-interactive-text`
- `bp-issue-list`
- `bp-key-value`
- `bp-key-value__key`
- `bp-key-value__value`
- `bp-link`
- `bp-link-list`
- `bp-link-list--plain`
- `bp-link-list__anchor`
- `bp-link-list__item`
- `bp-link-list__label`
- `bp-link-muted`
- `bp-login-card`
- `bp-login-stack`
- `bp-login-card--lg`
- `bp-login-card--md`
- `bp-login-card--glass`
- `bp-login-card__brand`
- `bp-login-page`
- `bp-mb-0`
- `bp-mb-lg`
- `bp-mb-md`
- `bp-mb-sm`
- `bp-ml-auto`
- `bp-mobile-filter-source--mounted`
- `bp-mobile-filter-trigger`
- `bp-mt-0`
- `bp-mt-md`
- `bp-mt-sm`
- `bp-note-button`
- `bp-note-button__count`
- `bp-report-block`
- `bp-report-card`
- `bp-report-header`
- `bp-responsive-label__desktop`
- `bp-responsive-label__mobile`
- `bp-rich-editor`
- `bp-rich-editor__body`
- `bp-rich-editor__button`
- `bp-rich-editor__menu`
- `bp-rich-editor__select`
- `bp-rich-editor__separator`
- `bp-rich-editor__toolbar`
- `bp-row-brand`
- `bp-row-danger`
- `bp-row-subtle`
- `bp-section-title`
- `bp-smart-tip`
- `bp-smart-tip--bottom`
- `bp-smart-tip--end`
- `bp-stat-grid`
- `bp-stepper`
- `bp-stepper__item`
- `bp-stepper__marker`
- `bp-subdued`
- `bp-subsection`
- `bp-subsection--dashed`
- `bp-tags`
- `bp-toolbar`
- `bp-toolbar-separator`
- `bp-toolbar__actions`
- `bp-tooltip`
- `bp-tooltip--aside`
- `bp-tooltip-anchor`
- `bp-tooltip__bubble`
- `bp-tooltip__line`
- `bp-usage-pill`
- `bp-usage-pill--danger`
- `bp-usage-pill--success`
- `bp-usage-pill--warning`

### Search / filters / command

- `bp-autocomplete`
- `bp-autocomplete__empty`
- `bp-autocomplete__item`
- `bp-autocomplete__item--active`
- `bp-autocomplete__item__meta`
- `bp-autocomplete__item__name`
- `bp-autocomplete__list`
- `bp-command-panel`
- `bp-command-panel--flat`
- `bp-command-panel--glass`
- `bp-command-panel--spaced`
- `bp-command-panel__actions`
- `bp-command-panel__grid`
- `bp-command-panel__help`
- `bp-command-panel__options`
- `bp-filter`
- `bp-filter-group`
- `bp-filter-group--centered`
- `bp-filter-group--prominent`
- `bp-search-box`
- `bp-search-box--toolbar`
- `bp-search-box__clear`

### Segmented / tabs

- `bp-segmented-control`
- `bp-segmented-control--2`
- `bp-segmented-control--3`
- `bp-segmented-control--4`
- `bp-segmented-control--center`
- `bp-segmented-control--scrollable`
- `bp-segmented-control--soft`
- `bp-segmented-control--tabs`
- `bp-segmented-control__item`
- `bp-tab-panel`
- `bp-table`
- `bp-table--centered`
- `bp-table--compact`
- `bp-table--fit`
- `bp-table--wide`
- `bp-table-card-value`
- `bp-table-cell__contact`
- `bp-table-cell__primary`
- `bp-table-cell__title`
- `bp-table-scroll`
- `bp-table-shell`
- `bp-table-shell--glass`
- `bp-table-shell--responsive`
- `bp-table__row--interactive`

### Status / feedback

- `bp-alert`
- `bp-alert--danger`
- `bp-alert--info`
- `bp-alert--success`
- `bp-alert--warning`
- `bp-badge`
- `bp-badge--danger`
- `bp-badge--info`
- `bp-badge--plain`
- `bp-badge--success`
- `bp-badge--warning`
- `bp-due`
- `bp-due--overdue`
- `bp-due--safe`
- `bp-due--soon`
- `bp-due--urgent`
- `bp-empty`
- `bp-empty--compact`
- `bp-empty--plain`
- `bp-empty__icon`
- `bp-money`
- `bp-money--cost`
- `bp-money--income`
- `bp-skeleton`
- `bp-status-danger`
- `bp-status-dot`
- `bp-status-dot--danger`
- `bp-status-dot--info`
- `bp-status-dot--muted`
- `bp-status-dot--success`
- `bp-status-dot--warning`
- `bp-status-icon--danger`
- `bp-status-icon--success`
- `bp-status-icon--unknown`
- `bp-status-icon--warning`
- `bp-status-muted`
- `bp-status-success`
- `bp-status-warning`
- `bp-toast`
- `bp-toast--danger`
- `bp-toast--info`
- `bp-toast--success`
- `bp-toast--warning`
- `bp-toast-source`
- `bp-toast-stack`
- `bp-toast__close`
- `bp-toast__message`

### Tables / data display

- `bp-cell-center`
- `bp-cell-cost`
- `bp-cell-empty`
- `bp-cell-end`
- `bp-cell-icon`
- `bp-cell-income`
- `bp-cell-mono`
- `bp-cell-nowrap`
- `bp-cell-number`
- `bp-cell-strong`
- `bp-cell-wrap`
- `bp-code-badge`
- `bp-code-badge--brand`
- `bp-code-badge--info`
- `bp-code-badge--purple`
- `bp-code-badge--success`
- `bp-code-badge--warning`
- `bp-code-block`
- `bp-code-display`
- `bp-code-display--clickable`
- `bp-code-inline`
- `bp-data-row--danger`
- `bp-data-row--warning`
- `bp-data-row-selected`
- `bp-data-toolbar`
- `bp-data-toolbar--directory`
- `bp-data-toolbar--footer`
- `bp-data-toolbar--glass`
- `bp-data-toolbar__control`
- `bp-data-toolbar__pagination`
- `bp-data-toolbar__search`
- `bp-pagination`
- `bp-pagination--inline`
- `bp-pagination__label`

### Typography / text utilities

- `bp-break-anywhere`
- `bp-font-mono`
- `bp-heading-1`
- `bp-heading-2`
- `bp-heading-3`
- `bp-text-brand`
- `bp-text-center`
- `bp-text-danger`
- `bp-text-muted`
- `bp-text-sm`
- `bp-text-small`
- `bp-text-strong`
- `bp-text-success`
- `bp-text-warning`
- `bp-text-xs`
- `bp-textarea`
- `bp-textarea--tall`
- `bp-truncate`

### iOS/iPadOS 27 family coverage additions

Adăugate în `20260710-8` pentru acoperire completă a familiilor Apple relevante
pentru web:


Adăugate în `20260710-9` pentru sub-componente și variante Apple utile ulterior:


## Clase adăugate la migrarea CSS-ului local (DS 20261025-3)

Adăugate când Pușculița, Domain Tools și CRM au renunțat la CSS-ul local. Regula: dacă un stil lipsește, se creează aici, nu în platformă. `tools/audit-inventory.js` cere ca orice clasă nouă să apară în acest document.

| Familie | Clase | Rol |
|---|---|---|
| `bp-app-footer` | `bp-app-footer--credit`, `bp-app-footer__line` | Pattern extras din platformă (vezi advanced.css) |
| `bp-app-header` | `bp-app-header__actions` | Pattern extras din platformă (vezi advanced.css) |
| `bp-auto-grid` | `bp-auto-grid` | Pattern extras din platformă (vezi advanced.css) |
| `bp-balance-card` | `bp-balance-card`, `bp-balance-card--negative`, `bp-balance-card--positive`, `bp-balance-card--zero`, `bp-balance-card__label`, `bp-balance-card__value` | Pattern extras din platformă (vezi advanced.css) |
| `bp-brand` | `bp-brand--image-lg` | Pattern extras din platformă (vezi advanced.css) |
| `bp-brand-icon` | `bp-brand-icon`, `bp-brand-icon--astro` | Pattern extras din platformă (vezi advanced.css) |
| `bp-calendar` | `bp-calendar__cell--unavailable`, `bp-calendar__grid--weekdays` | Pattern extras din platformă (vezi advanced.css) |
| `bp-col` | `bp-col--lg`, `bp-col--md`, `bp-col--sm`, `bp-col--xl` | Pattern extras din platformă (vezi advanced.css) |
| `bp-copy-value` | `bp-copy-value` | Pattern extras din platformă (vezi advanced.css) |
| `bp-cursor-pointer` | `bp-cursor-pointer` | Pattern extras din platformă (vezi advanced.css) |
| `bp-danger-zone` | `bp-danger-zone` | Pattern extras din platformă (vezi advanced.css) |
| `bp-data-cards` | `bp-data-cards--always`, `bp-data-cards--dense` | Pattern extras din platformă (vezi advanced.css) |
| `bp-day-activities` | `bp-day-activities__actions`, `bp-day-activities__icon` | Pattern extras din platformă (vezi advanced.css) |
| `bp-day-cal` | `bp-day-cal`, `bp-day-cal__act`, `bp-day-cal__act-text`, `bp-day-cal__act-toggle`, `bp-day-cal__acts`, `bp-day-cal__cell`, `bp-day-cal__cell--absent`, `bp-day-cal__cell--edge`, `bp-day-cal__cell--free`, `bp-day-cal__cell--off`, `bp-day-cal__cell--present`, `bp-day-cal__cell--today`, `bp-day-cal__count`, `bp-day-cal__d-full`, `bp-day-cal__d-short`, `bp-day-cal__drop`, `bp-day-cal__end`, `bp-day-cal__grid--week`, `bp-day-cal__toolbar--own`, `bp-day-cal__drop-icon`, `bp-day-cal__grid`, `bp-day-cal__head`, `bp-day-cal__initials`, `bp-day-cal__legend`, `bp-day-cal__m-full`, `bp-day-cal__m-short`, `bp-day-cal__nav`, `bp-day-cal__num`, `bp-day-cal__spacer`, `bp-day-cal__swatch`, `bp-day-cal__swatch--absent`, `bp-day-cal__swatch--present`, `bp-day-cal__swatch--today`, `bp-day-cal__tag`, `bp-day-cal__tag-text`, `bp-day-cal__toolbar` | Pattern extras din platformă (vezi advanced.css) |
| `bp-day-chip` | `bp-day-chip--art`, `bp-day-chip--danger`, `bp-day-chip--dance`, `bp-day-chip--english`, `bp-day-chip--info`, `bp-day-chip--music`, `bp-day-chip--other`, `bp-day-chip--primary`, `bp-day-chip--religion`, `bp-day-chip--secondary`, `bp-day-chip--sport`, `bp-day-chip--success`, `bp-day-chip--theatre`, `bp-day-chip--warning` | One colour per kind of activity (background, border, text); "other" keeps the orange of .bp-day-kind--activity. Tone modifiers (secondary/info/primary/warning/success/danger) colour a chip by status. |
| `bp-day-kind` | `bp-day-kind--activity`, `bp-day-kind--closed`, `bp-day-kind--edge`, `bp-day-kind--holiday`, `bp-day-kind--vacation` | Pattern extras din platformă (vezi advanced.css) |
| `bp-day-kind-icon` | `bp-day-kind-icon` | Pattern extras din platformă (vezi advanced.css) |
| `bp-day-weekdays` | `bp-day-weekdays` | Pattern extras din platformă (vezi advanced.css) |
| `bp-definition-grid` | `bp-definition-grid` | Pattern extras din platformă (vezi advanced.css) |
| `bp-field` | `bp-field--spaced-top` | Pattern extras din platformă (vezi advanced.css) |
| `bp-file-card` | `bp-file-card`, `bp-file-card__icon`, `bp-file-card__icon--img`, `bp-file-card__meta`, `bp-file-card__name`, `bp-file-card__rename`, `bp-file-card__sub` | ── Proof-of-payment files (edit payment modal): one card per file ── |
| `bp-file-card-list` | `bp-file-card-list` | Pattern extras din platformă (vezi advanced.css) |
| `bp-file-drop` | `bp-file-drop--single-border` | Pattern extras din platformă (vezi advanced.css) |
| `bp-file-viewer` | `bp-file-viewer`, `bp-file-viewer__body`, `bp-file-viewer__doc`, `bp-file-viewer__doclabel`, `bp-file-viewer__docs`, `bp-file-viewer__image`, `bp-file-viewer__message`, `bp-file-viewer__page`, `bp-file-viewer__pages`, `bp-file-viewer__scrollprobe`, `bp-file-viewer__title`, `bp-file-viewer__tools` | ── File viewer modal (assets/file-viewer.js): sits above the edit-payment modal ── |
| `bp-file-viewer-backdrop` | `bp-file-viewer-backdrop` | ── File viewer modal (assets/file-viewer.js): sits above the edit-payment modal ── |
| `bp-filter-dropdown` | `bp-filter-dropdown__menu--collapsible`, `bp-filter-dropdown__menu--end` | Pattern extras din platformă (vezi advanced.css) |
| `bp-filter-menu` | `bp-filter-menu--scrollable` | Pus de `business-pro.js` când lista meniului are scroll (spațiu lângă scrollbar) |
| `bp-form` | `bp-form--rhythm` | Pattern extras din platformă (vezi advanced.css) |
| `bp-form-actions` | `bp-form-actions--wrap` | Row of form buttons: full width; an item with __push (and the ones after it) sits at the end. |
| `bp-form-grid` | `bp-form-grid--collapse-hidden` | Pattern extras din platformă (vezi advanced.css) |
| `bp-header-metric` | `bp-header-metric__icon`, `bp-header-metric__unit`, `bp-header-metric__value` | Header metric: a compact pill with an icon, a value and a unit; warning/danger states flag a low allowance. |
| `bp-field` | `is-from-document` | State: the field was filled from a document by the automatic reading; the field gets a brand-coloured border and its label a "from document" note (text in `data-extracted`) until the person edits it. |
| `bp-scan` | `bp-scan__canvas`, `bp-scan__handle`, `bp-scan__loupe`, `bp-scan__loupe--below`, `bp-scan__meta`, `bp-scan__panels`, `bp-scan__result`, `bp-scan__shape`, `bp-scan__stage`, `bp-scan__status`, `bp-scan__svg`, `bp-scan__toolbar` | Document scan at upload: the photo on a canvas with 4 draggable corner handles (position in % through `--bp-x` / `--bp-y`), the document outline in SVG, the straightened result beside it, a status line (`is-warning` when the detection is unsure), and a round magnifier (`bp-scan__loupe`, a canvas inside it; position in % through `--bp-x` / `--bp-y`, `--below` when the corner is near the top edge) shown while a corner is dragged. |
| `bp-header-profile` | `bp-header-profile--link`, `bp-header-profile__logout` | Header account control; `--link` = whole control is clickable (opens the profile), cursor pointer. |
| `bp-hide-empty` | `bp-hide-empty` | Pattern extras din platformă (vezi advanced.css) |
| `bp-icon-button` | `bp-icon-button--brand-astro`, `bp-icon-button--brand-shopify`, `bp-icon-button--brand-wordpress` | Pattern extras din platformă (vezi advanced.css) |
| `bp-kpi` | `bp-kpi__icon`, `bp-kpi__icon--brand`, `bp-kpi__icon--danger`, `bp-kpi__icon--info`, `bp-kpi__icon--success`, `bp-kpi__note` | Pattern extras din platformă (vezi advanced.css) |
| `bp-list-chip` | `bp-list-chip` | Pattern extras din platformă (vezi advanced.css) |
| `bp-setting-tile-grid` | `bp-setting-tile-grid--fill` | Ultimul tile rămas singur pe rând ocupă tot rândul |
| `bp-stamp-preview` | `bp-stamp-preview` | Ștampila unei companii, pe fundal alb |
| `bp-checklist-grid` | `bp-checklist-grid--3`, `bp-checklist-grid--4` | Liste de carduri din profiluri: 1 / 2 / 3-4 coloane după lățime |
| `bp-feature-grid` | `bp-feature-grid`, `bp-feature-grid--2` | Grilă de facilități și dotări pe 4 coloane (implicit) sau 2 coloane fixe (`--2`) |
| `bp-dashboard-grid` | `bp-dashboard-grid--3`, `bp-dashboard-grid--start` | Grilă pe 2 coloane cu carduri la înălțimea lor |
| `bp-dashboard__grid` | `bp-dashboard__grid--start` | Cardurile din grilă își păstrează înălțimea proprie (nu se întind) |
| `bp-list-stack` | `bp-list-stack--limited`, `bp-list-stack--rows` | Pattern extras din platformă (vezi advanced.css) |
| `bp-login-card` | `bp-login-card--lg-logo` | Pattern extras din platformă (vezi advanced.css) |
| `bp-login-page` | `bp-login-page--footer` | Pattern extras din platformă (vezi advanced.css) |
| `bp-metric-grid` | `bp-metric-grid--cards` | Pattern extras din platformă (vezi advanced.css) |
| `bp-modal-backdrop` | `bp-modal-backdrop--sheet` | Pattern extras din platformă (vezi advanced.css) |
| `bp-multiselect` | `bp-multiselect`, `bp-multiselect__checklist`, `bp-multiselect__menu`, `bp-multiselect__search`, `bp-multiselect__select-all` | Pattern extras din platformă (vezi advanced.css) |
| `bp-overflow` | `bp-overflow__group-label`, `bp-overflow__item--danger-soft`, `bp-overflow__item-separator`, `bp-overflow__menu--roomy`, `bp-overflow__menu--scroll` | Pattern extras din platformă (vezi advanced.css) |
| `bp-parent-row` | `bp-parent-row`, `bp-parent-row__avatar`, `bp-parent-row__avatar--pending`, `bp-parent-row__email` | Pattern extras din platformă (vezi advanced.css) |
| `bp-popup` | `bp-popup--anchored`, `bp-popup--floating` | Pozitionare ancorata la un camp: JS seteaza doar --bp-popup-top / --bp-popup-left (pozitia/z-index vin din clasa popup-ului). |
| `bp-preview-banner` | `bp-preview-banner`, `bp-preview-banner__inner` | Pattern extras din platformă (vezi advanced.css) |
| `bp-preview-toggle` | `bp-preview-toggle` | Pattern extras din platformă (vezi advanced.css) |
| `bp-record-card` | `bp-record-card--flush-help`, `bp-record-card__chip`, `bp-record-card__chip-label`, `bp-record-card__chip-value`, `bp-record-card__chips`, `bp-record-card__chips-title`, `bp-record-card__subtitle--muted` | Pattern extras din platformă (vezi advanced.css) |
| `bp-root` | `bp-root--sticky-footer` | Pattern extras din platformă (vezi advanced.css) |
| `bp-segmented-control` | `bp-segmented-control--fit`, `bp-segmented-control--center`, `bp-segmented-control--tabs` | Pattern extras din platformă; `--tabs` = navigație de tab-uri cu fundal/bordură de card și tab activ ca buton primar (vezi advanced.css) |
| `bp-setting-tile-grid` | `bp-setting-tile-grid--4-fluid` | Pattern extras din platformă (vezi advanced.css) |
| `bp-skip-link` | `bp-skip-link` | Pattern extras din platformă (vezi advanced.css) |
| `bp-status-dot` | `bp-status-dot--off`, `bp-status-dot--on` | Pattern extras din platformă (vezi advanced.css) |
| `bp-tab-panel` | `bp-tab-panel--rhythm`, `bp-tab-panel__section` | Pattern extras din platformă (vezi advanced.css) |
| `bp-tip` | `bp-tip` | ── Tooltip cu poziție măsurată în JS (--bp-tip-left / --bp-tip-top) ── |
| `bp-title-row` | `bp-title-row` | Pattern extras din platformă (vezi advanced.css) |
| `bp-toggle-list` | `bp-toggle-list--compact`, `bp-toggle-list--scroll`, `bp-toggle-list--single` | Toggle list: switch rows laid out in a responsive grid, optionally scrolling when the list is long. |
| `bp-visually-hidden` | `bp-visually-hidden` | ── Utilitare de pagină reutilizabile ───────────────────────────────────────────────────────────────── |
| `bp-wizard` | `bp-wizard__panel`, `bp-wizard__steps` | Wizard: a guided multi-step form. A vertical step list sits beside the active panel; on phones the steps become a scrolling row. |

## Fișa de entitate și linkul-pastilă (DS 20261025-3)

Folosite de profilul site-ului din Domain Tools (`#monitorizare/<domeniu>`). Linkul-pastilă este alternativa la linkul subliniat: navigare (`--back`), linkuri externe (`--external`) și linkuri din text (`--inline`).

| Familie | Clase | Rol |
|---|---|---|
| `bp-link-chip` | `bp-link-chip`, `bp-link-chip--back`, `bp-link-chip--external`, `bp-link-chip--inline` | Link ca pastilă discretă, cu pictogramă care se mișcă la hover |
| `bp-entity-grid` | `bp-entity-grid`, `bp-entity-grid__main`, `bp-entity-grid__side` | Profil de entitate: coloană principală + laterală, ca profilul companiei din CRM |
| `bp-facet` | `bp-facet`, `bp-facet--ok`, `bp-facet--warn`, `bp-facet--stale`, `bp-facet--bad`, `bp-facet__head`, `bp-facet__title`, `bp-facet__detail`, `bp-facet__foot` | Card de verificare cu bandă de stare |
| `bp-sub-row` | `bp-sub-row`, `bp-sub-row__icon`, `bp-sub-row__main`, `bp-sub-row__title`, `bp-sub-row__meta`, `bp-sub-row__date` | Rând de abonament |

## Pași de mapare cu Figma

| Familie DS | Pagină/nod Figma | Decizie | Status |
|---|---|---|---|
| App shell / navigation | de completat | de completat | pending |
| Booking / public flow | de completat | de completat | pending |
| Buttons / actions | de completat | de completat | pending |
| Cards / lists | de completat | de completat | pending |
| Contracts / documents | de completat | de completat | pending |
| Dashboard / metrics / charts | de completat | de completat | pending |
| Documentation gallery only | de completat | de completat | pending |
| Forms / inputs | de completat | de completat | pending |
| Foundation / layout | de completat | de completat | pending |
| Glass / surfaces | de completat | de completat | pending |
| Legacy/general settings helpers | de completat | de completat | pending |
| Menus / popovers / disclosure | de completat | de completat | pending |
| Modals / sheets / dialogs | de completat | de completat | pending |
| Other utilities / specialized patterns | de completat | de completat | pending |
| Search / filters / command | de completat | de completat | pending |
| Segmented / tabs | de completat | de completat | pending |
| Status / feedback | de completat | de completat | pending |
| Tables / data display | de completat | de completat | pending |
| Typography / text utilities | de completat | de completat | pending |

## Adăugate 2026-10-26 (Setări > Email din CRM)

| Clasă | Rol |
|---|---|
| `bp-provider-card` | card de furnizor de email, mutabil prin drag and drop (`is-dragging`, `is-drop-target`, `is-multi`, `is-selected`) |
| `bp-provider-card__order` | badge cu ordinea de prioritate a furnizorului |
| `bp-provider-card__move` | grup de butoane de mutare (sus/jos) |
| `bp-provider-card__btn` | buton de mutare al unui card de furnizor |
| `bp-connection-switch` | comutator „Active" pe antetul unei conexiuni de email (cu `is-connection-off` pe `bp-extra-connection-card` pentru starea oprită) |
| `bp-extra-connection-body` | corpul unui card de conexiune de email (se estompează când cardul are `is-connection-off`) |
| `bp-signature-pad` | canvas pentru semnătura de mână desenată pe ecranul telefonului, la aceeași dimensiune ca `bp-document-viewer` (fundal alb, `touch-action: none`) |
| `bp-document-viewer` | zonă derulabilă care arată paginile unui document (canvas-uri) de înălțimea unei pagini (`--bp-viewer-height`), pentru citit înainte de semnare |
| `bp-document-viewer-wrap` | `bp-document-viewer-wrap__toggle`, `is-fullscreen` | învelișul zonei `bp-document-viewer`: butonul din dreapta jos deschide documentul pe tot ecranul (`is-fullscreen`) și îl închide |
| `bp-search-dock` | `bp-search-dock--property`, `bp-search-dock__segment`, `bp-search-dock__segment--action`, `bp-search-dock__copy`, `bp-search-dock__label`, `bp-search-dock__value`, `bp-search-dock__value--muted`, `bp-search-dock__submit`, `bp-search-dock__popover`, `bp-search-dock__popover--start`, `bp-search-dock__popover--end` | bară de căutare segmentată tip dock pentru rezervări (Unde / Check-in / Check-out / Cine + buton Caută) |
| `bp-quantity-stepper` | `bp-quantity-stepper__row`, `bp-quantity-stepper__info`, `bp-quantity-stepper__title`, `bp-quantity-stepper__sub`, `bp-quantity-stepper__controls`, `bp-quantity-stepper__btn`, `bp-quantity-stepper__count` | rânduri cu butoane `−` / `+` pentru selectarea numărului de adulți, copii și bebeluși în popover-ul de cantități |

## Adăugate 2026-11-08 (meniul «Meniu» din header)
Un singur buton în header deschide un panou cu toate paginile, grupate pe secțiuni. Antetul rămâne la fel oricâte pagini există, iar bara de jos de pe mobil nu mai e necesară. Se folosește împreună cu `.bp-overflow` (deschidere, închidere, poziționare). Elementele sau secțiunile ascunse prin permisiuni folosesc atributul `hidden`.

- `bp-nav-launcher`
- `bp-nav-launcher__label`
- `bp-nav-grid`
- `bp-nav-grid--single`: set by the script when only one section is visible; hides its title
- `bp-info-tip`: info icon in a field label; its `data-tooltip` opens under the label on hover or focus
- `data-bp-client-events` (attribute on `<html>`): `business-pro.js` sends JavaScript errors, failed resources and slow loads (> 4 s) to that URL as JSON batches (max. 20 per page load; path and message only). Used by the shared diagnostics module; no attribute, no telemetry
- `bp-nav-grid__search`: search field at the top of a navigation panel; its input carries `data-bp-nav-search` and filters the items
- `bp-floating-notify`, `bp-floating-notify__count`: floating notification button fixed at the bottom-right (rings and pulses while there is something unread)
- `bp-nav-grid__section`
- `bp-nav-grid__title`
- `bp-nav-grid__items`
- `bp-nav-grid__item`
- `bp-root--no-bottom-nav`

## Adăugate 2026-11-08 (dropdown-ul «Filtre»)
Bara de instrumente păstrează un singur buton «Filtre» (`bp-mobile-filter-trigger`, mereu în stânga), iar filtrele se deschid într-un dropdown ca cel al meniului, pe orice lățime. Filtrele active se văd doar în dropdown. DS-ul mută filtrele în panou la încărcare; ele își păstrează id-urile.

- `bp-filter-panel`
- `bp-header-metric--icon`

## Adăugate 2026-11-08 (mutate din foaia de stil a platformei Bookings)
Galeria foto a camerelor, simbolul de rating, harta interactivă, tooltip-ul instant, datepicker-ul și modalele care nu depășesc ecranul. Ajustările specifice Bookings sunt modificatori de root opționali, puși pe `<body>`.

- `bp-room-gallery`
- `bp-room-gallery__image`
- `bp-room-gallery__counter`
- `bp-room-gallery__btn`
- `bp-room-gallery__text`
- `bp-daisy-symbol`
- `bp-page-header--split`
- `bp-m-0`
- `bp-block`
- `bp-fill-row`
- `bp-input--narrow`
- `bp-input-group__text`
- `bp-row-divided`
- `bp-interactive-map`
- `bp-map-popup`
- `bp-map-popup__title`
- `bp-map-popup__address`
- `bp-custom-tooltip`
- `bp-custom-tooltip--bottom`
- `bp-datepicker-popup`
- `bp-modal__form`
- `bp-record-card__full-row`
- `bp-record-card__full-row--spacer`
- `bp-root--halo-badges`
- `bp-root--aligned-cards`
- `bp-root--contained-modals`

