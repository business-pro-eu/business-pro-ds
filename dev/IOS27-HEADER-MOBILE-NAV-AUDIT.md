# Business PRO DS — audit header + mobile navigation

Data audit: 2026-07-10  
Versiune DS analizată: `20260712-1`

## Scop

Auditul verifică dacă headerul, meniul desktop, meniul mobile și elementele incluse sunt construite pe același contract vizual DS în toate platformele Business PRO:

- Profit
- Leads
- Domain Tools
- Contracts
- Bookings

Obiectivul nu este să creăm stiluri dedicate unei platforme, ci să stabilim o structură unică, reutilizabilă, inspirată de iOS/iPadOS 27 / Liquid Glass.

## Standard DS existent

DS are deja baza necesară pentru această zonă:

- `bp-app-header`
- `bp-app-header__inner`
- `bp-brand-group`
- `bp-brand`
- `bp-theme-logo`
- `bp-product-badge`
- `bp-desktop-nav`
- `bp-nav-link`
- `bp-header-tools`
- `bp-header-popover-anchor`
- `bp-popover--header-end`
- `bp-icon-button`
- `bp-mobile-nav`
- `bp-mobile-nav--2/3/4/5/6`
- `bp-mobile-nav--enhanced`
- `bp-mobile-nav--scrollable`
- `bp-mobile-nav__track`
- `bp-mobile-nav__item`
- `bp-mobile-nav__label`
- `bp-mobile-group-menu`
- `bp-mobile-group-menu__item`
- `bp-tabbar-search`
- `bp-search-toolbar`

Concluzie: nu este nevoie de un sistem nou. Avem nevoie de un contract unic de markup și de o migrare a platformelor către acel contract.

## Inventar pe platforme

| Platformă | Header | Desktop nav | Header tools | Mobile nav | Observații |
| --- | --- | --- | --- | --- | --- |
| Profit | `bp-app-header`, `bp-brand-group`, `bp-product-badge` | generat din JS în `#topbarMainNav` | theme, search, currency, logout | generat din JS în `#mobileMainNav.bp-mobile-nav--4` | Structură bună, dar labelurile mobile sunt text direct, nu `bp-mobile-nav__label`. |
| Leads | `bp-app-header`, `bp-brand-group`, `bp-product-badge` | static, cu dropdown-uri Outreach/Settings | stats, search, theme, logout | static `bp-mobile-nav--4`, dar are 5 elemente + group menus | Cea mai complexă zonă. Trebuie standardizată. |
| Domain Tools | `bp-app-header`, `bp-brand-group`, `bp-product-badge` | generat din JS | theme, search, logout | generat din JS, `bp-mobile-nav--2` | Simplu și aproape de standard, dar labelurile mobile sunt text direct. |
| Contracts | `bp-app-header`, `bp-brand-group`, `bp-product-badge` | static, 4 linkuri principale | theme, overflow menu, logout | static `bp-mobile-nav--4`, sincronizat din desktop | Bun, dar overflow-ul din header nu are echivalent mobile explicit pentru toate itemurile secundare. |
| Bookings | `bp-app-header`, `bp-brand-group`, `bp-product-badge` | generat din JS în `#desktopNav` | theme, search, currency, logout | generat din JS în `#mobileNav` | Cel mai aproape de standardul propus: folosește deja `bp-mobile-nav__label`. |

## Probleme găsite

### P1 — Structura mobile nav nu este unică

În prezent există trei variante:

1. Linkuri puse direct în `.bp-mobile-nav`.
2. Linkuri generate din JS.
3. Linkuri + submeniuri mobile în Leads.

DS suportă deja varianta mai robustă:

```html
<nav class="bp-mobile-nav bp-mobile-nav--4 bp-mobile-nav--enhanced bp-mobile-nav--scrollable">
  <div class="bp-mobile-nav__track">
    <a class="bp-mobile-nav__item">
      <i class="bp-icon ..."></i>
      <span class="bp-mobile-nav__label">Label</span>
    </a>
  </div>
</nav>
```

Recomandare: aceasta să devină structura oficială pentru toate platformele care au mai mult de 3-4 itemuri sau pot crește în timp.

### P1 — Leads are `bp-mobile-nav--4`, dar 5 elemente directe

În `leads/public/app.php`, meniul mobile are clasa `bp-mobile-nav--4`, însă conține 5 itemuri:

- Dashboard
- Leads
- Contacts
- Outreach
- Settings

Asta poate produce înghesuire, mai ales pe telefoane mici. Este și împotriva regulii discutate anterior: desktop și mobile trebuie să păstreze același index, dar mobile trebuie să fie optimizat cu maximum 4 elemente vizibile.

Recomandare:

- folosim `bp-mobile-nav--4 bp-mobile-nav--enhanced bp-mobile-nav--scrollable`;
- punem itemurile într-un `bp-mobile-nav__track`;
- păstrăm 4 vizibile + “peek” din următorul element;
- păstrăm indexul desktop/mobile prin `data-bp-nav-index`.

### P1 — Labelurile mobile nu sunt uniforme

Bookings folosește:

```html
<span class="bp-mobile-nav__label">...</span>
```

Profit, Domain Tools, Leads și Contracts folosesc în multe locuri text direct după icon.

Recomandare: toate itemurile mobile să aibă aceeași structură:

```html
<i class="bp-icon ..."></i>
<span class="bp-mobile-nav__label">...</span>
```

Beneficii:

- truncare uniformă;
- control mai bun pe font/spacing;
- viitoare traduceri RO/EN mai sigure;
- audit vizual mai simplu.

### P1 — Submeniurile mobile pot deveni prea înalte

`bp-mobile-group-menu` este folosit în Leads pentru Outreach și Settings. Settings are 7 opțiuni.

În DS, meniul are poziționare și glass styling, dar nu are încă o limită clară de înălțime cu scroll intern.

Recomandare DS:

- `max-height: calc(100dvh - var(--bp-bottom-nav-height) - var(--bp-space-10));`
- `overflow-y: auto;`
- `overscroll-behavior: contain;`

### P1 — Desktop nav centrat absolut poate suprapune brand/tools

`bp-desktop-nav` este centrat cu `left: 50%` + `transform`. Este corect vizual pentru meniuri scurte, dar poate deveni riscant în Leads, unde avem dropdown-uri și mai multe zone.

Recomandare:

- păstrăm centrat pe desktop larg;
- adăugăm o regulă DS de protecție pentru viewport mediu: nav-ul să se restrângă cu `max-width`, `overflow-x: auto` sau să intre în overflow.

### P2 — Header tools diferă ca structură între platforme

Toate folosesc `bp-header-tools`, dar conținutul diferă:

- Profit: theme, search, currency, logout
- Leads: stats, search, theme, logout
- Domain Tools: theme, search, logout
- Contracts: theme, overflow menu, logout
- Bookings: theme, search, currency, logout

Diferența este normală, dar contractul intern trebuie standardizat:

- orice popover din header să fie într-un `bp-header-popover-anchor`;
- orice buton să fie `bp-icon-button`;
- orice meniu secundar să folosească `bp-overflow` sau `bp-popover`;
- logout să fie același tip vizual peste tot.

### P2 — Linkurile mobile ar trebui protejate global împotriva underline

`bp-nav-link` are deja protecție cu `text-decoration: none !important`.

`bp-mobile-nav__item` are `text-decoration: none`, dar nu are selectorul complet pentru stări.

Recomandare DS:

```css
.bp-mobile-nav__item:is(:link, :visited, :hover, :active, :focus),
.bp-mobile-group-menu__item:is(:link, :visited, :hover, :active, :focus) {
  text-decoration: none !important;
}
```

### P2 — Contracts are overflow desktop, dar mobile nu expune toate itemurile secundare la fel

Contracts pune în header overflow menu pentru:

- Șabloane
- Servicii
- Setări
- Utilizatori

Meniul mobile static are doar:

- Dashboard
- Contract nou
- Contracte
- Beneficiari

JS-ul sincronizează linkurile principale din desktop, nu și overflow menu. Dacă acele pagini trebuie accesibile pe mobile, ar trebui să existe un `bp-mobile-group-menu` sau un item “Mai multe”.

## Contract propus pentru header

Structură unică:

```html
<header class="topbar bp-app-header">
  <div class="bp-app-header__inner">
    <div class="bp-brand-group">
      <a class="bp-brand bp-brand--image">
        <span class="bp-theme-logo">
          <img class="bp-theme-logo__image">
        </span>
      </a>
      <span class="bp-product-badge">Platformă</span>
    </div>

    <nav class="bp-desktop-nav" aria-label="Navigare principală"></nav>

    <div class="bp-header-tools">
      <!-- bp-icon-button / bp-header-popover-anchor / bp-overflow -->
    </div>
  </div>
</header>
```

## Contract propus pentru mobile nav

Structură unică:

```html
<nav class="bp-mobile-nav bp-mobile-nav--4 bp-mobile-nav--enhanced bp-mobile-nav--scrollable" aria-label="Navigare mobilă">
  <div class="bp-mobile-nav__track">
    <a class="bp-mobile-nav__item" aria-current="page">
      <i class="bp-icon fa-solid fa-chart-line" aria-hidden="true"></i>
      <span class="bp-mobile-nav__label">Dashboard</span>
    </a>
  </div>
</nav>
```

Reguli:

- maximum 4 itemuri vizibile pe mobile;
- dacă există mai multe, se folosește swipe cu “peek” din următorul item;
- fără săgeți;
- toate itemurile au icon + `bp-mobile-nav__label`;
- desktop și mobile păstrează același `data-bp-nav-index`;
- orice item nou în desktop trebuie adăugat și în mobile;
- aria-current se setează pe itemul activ;
- submeniurile mobile folosesc `bp-mobile-group-menu`.

## Recomandare de implementare

### Etapa 1 — DS hardening

1. Adăugăm protecție anti-underline pentru mobile nav și group menu.
2. Adăugăm max-height + scroll intern pentru `bp-mobile-group-menu`.
3. Adăugăm reguli mai bune pentru `bp-mobile-nav__label`.
4. Verificăm `bp-mobile-nav--scrollable` astfel încât să afișeze 4 itemuri + peek clar.

### Etapa 2 — Markup standardizat în platforme

1. Profit: generarea JS să includă `bp-mobile-nav__label`.
2. Domain Tools: generarea JS să includă `bp-mobile-nav__label`.
3. Leads: meniul static să treacă pe `bp-mobile-nav__track`; să păstreze 4 vizibile + peek.
4. Contracts: meniul static să includă `bp-mobile-nav__label`; decizie pentru overflow mobile.
5. Bookings: deja este aproape corect; doar verificare finală.

### Etapa 3 — Audit vizual

După implementare, testăm pe:

- desktop larg;
- laptop;
- tabletă;
- mobile 390px;
- mobile 360px;
- dark mode;
- light mode.

## Concluzie

Headerul este deja aproape unificat. Meniul mobile este zona care trebuie curățată înainte de auditul pixel-perfect.

Nu recomand crearea de componente noi pentru fiecare platformă. Recomand să transformăm structura Bookings + capabilitățile DS existente într-un standard unic și să migrăm celelalte platforme către el.
