# Визуальный стиль · spec 0.6

Источник: [Linear DESIGN.md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md).

Near-black canvas, один хроматический акцент, hairline-бордеры. Акцент только на CTA, focus и активный таб — не декор.

## Токены

| Токен | Hex |
|---|---|
| canvas | `#010102` |
| surface-1 | `#0f1011` |
| surface-2 | `#141516` |
| surface-3 | `#18191a` |
| hairline | `#23252a` |
| hairline-strong | `#34343a` |
| ink | `#f7f8f8` |
| ink-muted | `#d0d6e0` |
| ink-subtle | `#8a8f98` |
| primary | `#5e6ad2` |
| primary-hover | `#828fff` |
| primary-focus | `#5e69d1` |
| on-primary | `#ffffff` |
| success | `#27a644` |

Шрифт: `-apple-system, SF Pro Display, system-ui`. Body 14/16, caption 12, button 14/500. Radius: xs 4, sm 6, md 8, lg 12. Spacing 4–24.

## Роли пользователя

Canvas один. Меняется только `--acc` на активных табах и primary-CTA:

- Unit Head — `#5e6ad2`
- HRBP — `#7a7fad` (brand-secure)
- Observer — `#8a8f98`
- Candidate — `#d0d6e0` (светлый ink, без второго хрома)

Ready-now = success `#27a644`, не primary.
