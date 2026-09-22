# Спецификация прототипа

## Контекст

Большая аутсорс / project-delivery компания. Юнит ~150 инженеров (в жизни до 200): delivery + практики (platform, mobile, QA, data).

Клиенты на аккаунтах. Ключевой риск — уход Delivery/Engineering Partner: клиент, маржа, бенч.

Это не «кадровый резерв на всех». Succession только на критические роли, которые создаёт Unit Head.

Как работать с каждым экраном, включая схему 9-box (звезда / алмаз / эксперт) и калибровку HR — в [docs/UI.md](UI.md).

## Пользователи

| Роль | Что делает |
|---|---|
| Unit Head | Создаёт роли, incumbent, planned, цели, горизонт |
| HRBP | Калибрует 9-box (драг + коммент), флаг ассессмента. Не ставит primary |
| Observer | Руководитель Unit Head. Только смотрит покрытие и дыры |
| Кандидат | v1 не логинится |

## Фреймворки в продукте

1. **Critical roles, не org chart.**
2. **Slates, не один наследник.**
3. **Горизонты:** `ready_now` / `6m` / `12m` / `18m`.
4. **9-box:** performance × potential. Звезда и алмаз — вход в slate; эксперт — не partner «из уважения». Калибрует HR. Подробности — [UI.md](UI.md#экран-2a-9-box--как-читать-и-калибровать).
5. **Leadership pipeline** (упрощённо): IC → stream lead → team/tech lead → account lead → partner.
6. **Evidence-based readiness.** Горизонт только вручную после целей + комментария.
7. **Talent pool + поиск по 150.**
8. **Каденция.** Квартал — цели; review — калибровка 9-box.

## Флоу v1

1. Unit Head создаёт роль → incumbent → planned.
2. Система показывает recommended.
3. HRBP калибрует 9-box.
4. Вместе собирают slate и цели.
5. Раз в квартал отмечают цели.
6. Observer смотрит дыры.

## Правила recommended (прототип)

- не junior, не incumbent;
- potential medium/high;
- пересечение track / skills;
- performance high — бонус;
- client feedback ≥ 4.3 — бонус;
- lead/architect/principal — бонус на партнёрские роли;
- уже planned на другую критическую роль — штраф.

Топ-5 = recommended.

## Что не в v1

Оргчарт на 150, чат, автопромоушен, Workday.

## Данные UI

Тайтл, трек, навыки, проекты, фидбек клиента, толки, performance × potential (черновик 9-box).
