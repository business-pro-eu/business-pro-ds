# Apple iOS/iPadOS 27 UI Kit — local extraction inventory

Source files:

- `/Users/gheorghe.marius.alexandru/Downloads/Apple iOS 27 UI Kit.sketch`
- `/Users/gheorghe.marius.alexandru/Downloads/iOS and iPadOS 27 - Business PRO.fig`

Working extraction folders:

- `.analysis/apple-ios27-sketch`
- `.analysis/apple-ios27-fig`

## Conclusion

The Sketch file is the best source for migration because it extracts into readable JSON pages, shared styles, shared swatches, fonts and images.

The `.fig` file is useful as a Figma backup/preview, but the Sketch archive gives a more direct component inventory without relying on the Figma connector rate limit.

## Extracted Sketch structure

- Pages: 34
- Shared text styles: 105
- Shared layer styles: 42
- Shared swatches: 107
- Includes local font files and image assets.

## Available Apple component pages

| Apple kit page | Artboards/components | DS migration relevance |
| --- | ---: | --- |
| Materials | 0 artboards | Glass/material tokens, base surfaces |
| Colors | 0 artboards | Light/dark color tokens |
| Text Styles and Dynamic Type | 0 artboards | Typography scale |
| System | 322 | App shell, status bars, system surfaces |
| Buttons | 264 | `bp-button`, icon buttons, split/action buttons |
| Lists | 117 | Tables, mobile cards, list rows |
| Menus | 108 | Dropdowns, action menus, context menus |
| Popovers | 26 | Header panels, filters, search panels |
| Sheets | 10 | Mobile modal/sheet behavior |
| Alerts | 18 | `bp-alert`, confirmations, destructive actions |
| Action Sheets | 4 | Mobile action menus |
| Activity Views | 38 | Share/export style actions |
| Text Fields | 11 | Inputs, search, editable fields |
| Segmented Controls | 16 | Tabs, filters, status switches |
| Toggles | 14 | Switches/settings controls |
| Sliders | 30 | Range controls if needed later |
| Steppers | 14 | Counters, booking adults/children/pets |
| Date and Time Pickers | 50 | Date inputs and booking date flows |
| Progress Indicators | 10 | Loading, spinner/progress states |
| Page Controls | 44 | Carousel/pagination patterns |
| Tab Bars | 52 | Mobile bottom nav |
| Toolbars | 188 | Header actions, mobile/desktop toolbars |
| Sidebars | 54 | Desktop navigation/sidebar patterns |
| Empty States | 3 | `bp-empty` |
| Color Wells and Pickers | 9 | Color picker/branding settings |
| Keyboards | 158 | Not a direct DS target for web |
| FaceID | 2 | Not a direct DS target for current web apps |

## Shared style examples found in the kit

Text styles include:

- LargeTitle
- Title1
- Title2
- Title3
- Headline
- Body
- Callout
- Subheadline
- Footnote
- Caption1
- Caption2

Layer/material styles include:

- Liquid Glass / Light / Regular — Small, Medium, Large
- Liquid Glass / Dark / Regular — Small, Medium, Large
- Liquid Glass / Clear
- Liquid Glass / Tinted variants
- Materials / Light / Thick, Regular, Thin, Ultrathin
- Materials / Dark / Thick, Regular, Thin, Ultrathin
- Controls / Tracks and Knobs states

Swatches include:

- Labels / Light and Dark / Primary, Secondary, Tertiary, Quaternary
- Fills / Light and Dark / Primary, Secondary, Tertiary, Quaternary
- System Colors / Light and Dark / Red, Orange, Yellow, Green, Mint, Teal, Blue, Purple, Pink, Brown

## Recommended migration order

1. Map Apple tokens to DS tokens:
   - typography
   - labels/fills
   - materials/glass
   - system colors
   - radius/shadow/blur states

2. Map structural components:
   - buttons
   - inputs/search
   - menus/popovers
   - cards/lists/tables
   - modals/sheets
   - mobile nav/tab bar
   - toolbars/page headers

3. Update DS CSS classes without creating platform-specific styles.

4. Update platform markup/classes only where the DS API changes.

5. At the end, create only the missing reusable DS components that are not covered by Apple’s kit.

