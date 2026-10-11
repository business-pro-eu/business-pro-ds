# Acoperire Business PRO Profit

Componentele necesare migrării platformei Profit sunt reprezentate în Design
System.

| Element Profit | Componentă Design System |
|---|---|
| Topbar și navigare | `bp-app-header`, `bp-nav-link` |
| Căutare contextuală | `bp-popover`, `bp-search-box` |
| Selector RON/EUR/USD | `bp-segmented-control` |
| Dashboard KPI | `bp-metric-grid`, `bp-metric-grid--4`, `bp-card`, `bp-kpi` |
| Dashboard operațional | `bp-dashboard`, `bp-dashboard-section`, `bp-list-stack`, `bp-list-card`, `bp-chart` |
| Butoane și acțiuni icon-only | `bp-button`, `bp-icon-button`, `bp-action-group` |
| Formulare | `bp-field`, `bp-input`, `bp-select`, `bp-textarea` |
| Formulare tranzacție/subscripție | `bp-form-grid`, `bp-form-section` |
| Filtre | `bp-filter-group`, `bp-filter` |
| Tabele și carduri mobile | `bp-table-shell`, `bp-table`, `bp-data-cards`, `bp-record-card` |
| Statusuri | `bp-badge` și variantele semantice |
| Încasări și plăți | `bp-money--income`, `bp-money--cost` |
| Scadențe | `bp-due` și variantele de severitate |
| Conversii valutare | `bp-tooltip` |
| Paginare | `bp-pagination` |
| Modale standard și late | `bp-modal`, `bp-modal--wide` |
| Manager categorii/parteneri/pachete | `bp-catalog` |
| Confirmare ștergere | `bp-confirm` |
| Alerte FX și erori | `bp-alert` |
| Login | `bp-login-page`, `bp-login-card` |
| Empty/loading | `bp-empty`, `bp-skeleton` |
| Densitate compactă/comfortable | `bp-density-compact`, `bp-density-comfortable` |
| Stări disabled/readonly/loading/success | stări native și `is-loading`, `is-success` |
| Meniu „Mai multe” | `bp-overflow` |
| Comportament modal accesibil | `assets/js/business-pro.js` |

## Starea migrării

Profit folosește acum direct stylesheet-ul publicat de Design System și nu mai
încarcă un stylesheet propriu. Stările vizuale, layout-ul, formularele,
tabelele, toolbar-urile, modalele, login-ul și navigarea responsive sunt
controlate prin clase `bp-*`.

Clasele istorice rămase în markup sunt doar hook-uri de comportament sau
compatibilitate și nu mai au reguli CSS locale. Logica JavaScript și API-urile
platformei au rămas neschimbate.
