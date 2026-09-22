# Спецификация прототипа

## Контекст

Большая аутсорс / project-delivery компания. Юнит ~150 инженеров (в жизни до 200).

Succession только на критические роли, которые создаёт Unit Head.

Экраны: [UI.md](UI.md). Демо 8 мин и актёры: [DEMO.md](DEMO.md).

## Пользователи

| Роль | Что делает |
|---|---|
| Unit Head | Роли, planned, цели, горизонт |
| HRBP | 9-box + коммент. Не ставит primary |
| Observer | Только покрытие и дыры |
| Кандидат | v1 не логинится, slate не видит |

В прототипе — переключатель трёх ролей в шапке, не настоящий логин.

## Правила, которые легко упустить

1. **Тула не назначает.** Статус роли: `open | ready_to_fill | filled_outside`.
2. **Emergency ≠ successor.** Cover — завтра. Planned — рост в роль.
3. **Slate конфиденциален.** Кандидат не видит, что он в списке.
4. **Recommended с why-строкой.** Не один score.
5. **Один primary на двух ролях** — флаг «bench горит».
6. **Каденция в шапке:** last review / next review.
7. **9-box ≠ готовность.** Клетка = в кого вкладываться. Горизонт = цели.

## Фреймворки

Critical roles · slates · горизонты ready_now/6m/12m/18m · 9-box · pipeline проходов · evidence-based readiness.

## Recommended

Не junior, не incumbent; potential medium/high; track/skills; бонус за performance, client ≥ 4.3, lead+; штраф за другой primary. Топ-5 + why.

## Демо-данные

Полный пул: `python3 scripts/generate_seed.py` → `data/unit.json`.

Сюжет демо не должен зависеть от генератора: жёсткий каст в [data/demo-cast.json](../data/demo-cast.json).

## Не в v1

Оргчарт, чат, автопромо, Workday, кабинет кандидата.
