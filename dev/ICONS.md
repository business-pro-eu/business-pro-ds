# Iconuri Business PRO

Standardul oficial este **Font Awesome Free 7.2.0**, găzduit local.

## Fișiere incluse

```text
assets/vendor/fontawesome/css/fontawesome.min.css
assets/vendor/fontawesome/css/solid.min.css
assets/vendor/fontawesome/css/brands.min.css
assets/vendor/fontawesome/webfonts/fa-solid-900.woff2
assets/vendor/fontawesome/webfonts/fa-brands-400.woff2
assets/vendor/fontawesome/LICENSE.txt
```

Nu este inclus `all.css`. Design System-ul livrează doar nucleul, stilul Solid și
fontul Solid. Brands este disponibil separat prin `business-pro-brands.css`.

## Utilizare

Icon decorativ într-un buton cu text:

```html
<button class="bp-button bp-button--primary">
  <i class="bp-icon fa-solid fa-plus" aria-hidden="true"></i>
  Adaugă
</button>
```

Buton exclusiv cu icon:

```html
<button class="bp-icon-button" aria-label="Editează">
  <i class="bp-icon fa-solid fa-pen-to-square" aria-hidden="true"></i>
</button>
```

Icon de brand:

```html
<i class="bp-icon fa-brands fa-google" aria-hidden="true"></i>
```

## Reguli

- Folosim `fa-solid` pentru interfața produselor.
- Folosim `fa-brands` numai pentru mărci externe.
- Nu amestecăm iconuri outline custom cu Font Awesome.
- Iconurile decorative primesc `aria-hidden="true"`.
- Butoanele icon-only primesc întotdeauna `aria-label`.
- Versiunea Font Awesome este fixată împreună cu versiunea Design System.
