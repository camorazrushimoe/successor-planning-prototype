# DATA CONTRACT · people.json

Файл для программиста: выгрузка из БД для прототипа successor planning.

Положить готовый файл как:

```
prototype/people.json
```

Прототип читает только этот путь (`fetch('people.json')`). Открывать UI через локальный HTTP (не raw `file://`), иначе fetch может не сработать — тогда есть fallback-пул внутри JS.

Ожидается ~150–200 профилей юнита.

---

## Корень файла

Два допустимых варианта. Предпочтительный — объект:

```json
{
  "version": "1.0",
  "unit": {
    "name": "Engineering Unit — Delivery Center East",
    "headcount": 200,
    "exported_at": "2026-09-23"
  },
  "people": [ { "...Person" } ]
}
```

Допустимо также голый массив `Person[]`.

UTF-8. Даты — ISO `YYYY-MM-DD`. `id` уникален, стабилен между выгрузками.

Роли successor и slate в этот файл **не входят**. Это только справочник людей. Позиции создаёт Unit Head в UI и выбирает кандидатов из `people`.

---

## Person — обязательные поля

| поле | тип | правило |
|---|---|---|
| `id` | string | стабильный ключ, напр. `p001` |
| `name` | string | «Имя Фамилия» |
| `title` | string | текущий тайтл в компании |
| `level` | enum | `junior` \| `middle` \| `senior` \| `lead` \| `principal` \| `architect` \| `partner` |
| `track` | string | `backend` `frontend` `fullstack` `mobile` `qa` `devops` `data` `ml` `security` `platform` `architecture` `delivery` `ba` `pm` |
| `performance` | enum | `low` \| `medium` \| `high` |
| `potential` | enum | `low` \| `medium` \| `high` |

`performance` × `potential` собирают клетку 9-box (см. ниже). Без них человек не попадает на матрицу.

---

## Person — рекомендуемые поля

| поле | тип | зачем |
|---|---|---|
| `email` | string | |
| `location` | string | город / Remote |
| `years_experience` | int | лет в индустрии |
| `years_in_company` | int | |
| `manager_id` | string \| null | `id` руководителя из этого же файла |
| `utilization_pct` | int | 0–100 |
| `bench_risk` | bool | на бенче / скоро сойдёт |
| `english` | string | B1–C2 |
| `skills` | string[] | 3–8 скиллов |
| `projects` | Project[] | клиентский опыт |
| `client_feedback` | Feedback[] | фидбек клиента |
| `manager_talks` | Talk[] | 1:1 / talent talk |
| `notes` | string | короткая служебная пометка |

### Project

```json
{
  "client": "Helix Health",
  "domain": "healthcare",
  "role_on_project": "tech lead on stream",
  "duration_months": 14,
  "status": "active",
  "impact": "Stabilized release train"
}
```

`status`: `active` | `completed`.

### Feedback

```json
{
  "source": "client",
  "date": "2026-06-25",
  "score": 4.8,
  "summary": "Trusted by the client PO"
}
```

`score` — число 1.0–5.0. `source`: `client` | `account` | `internal stakeholder`.

### Talk

```json
{
  "date": "2026-09-04",
  "author_role": "line manager",
  "summary": "Ready for lead track if given P&L exposure"
}
```

`author_role`: `line manager` | `HRBP` | `delivery partner`.

---

## 9-box (считает прототип, в JSON не класть)

| potential \ performance | low | medium | high |
|---|---|---|---|
| high | puzzle | diamond | star |
| medium | weak | core | ic |
| low | out | steady | expert |

HR в UI может переклассифицировать. Исходние `performance`/`potential` остаются в выгрузке.

---

## Минимальный пример одного человека

```json
{
  "id": "p042",
  "name": "Maria Iyer",
  "email": "maria.iyer@company.example",
  "location": "Bengaluru",
  "track": "delivery",
  "level": "lead",
  "title": "Delivery Lead",
  "years_experience": 9,
  "years_in_company": 4,
  "manager_id": "p003",
  "utilization_pct": 100,
  "bench_risk": false,
  "english": "C1",
  "skills": ["Stakeholder mgmt", "Estimation", "P&L awareness"],
  "projects": [
    {
      "client": "NordBank",
      "domain": "fintech",
      "role_on_project": "Delivery Lead",
      "duration_months": 18,
      "status": "active",
      "impact": "Owned integration with client core"
    }
  ],
  "client_feedback": [
    {
      "source": "account",
      "date": "2026-06-25",
      "score": 4.8,
      "summary": "Trusted by the client PO"
    }
  ],
  "manager_talks": [
    {
      "date": "2026-09-04",
      "author_role": "line manager",
      "summary": "Ready for lead track if given P&L exposure"
    }
  ],
  "performance": "high",
  "potential": "high",
  "notes": "Needs visibility with partners"
}
```

---

## Что не класть в этот файл

- пароли, токены, зарплаты, персональные документы
- цели successor и горизонты готовности — это состояние UI, не справочник
- чужие юниты, уволенные без пометки (esli нужны — отдельный флаг `active: false` не требуется в v1; выгружать только активных)

---

## Как прототип это ест

1. Кладёшь `prototype/people.json`.
2. Открываешь `prototype/index.html` через статический сервер из этой папки.
3. Пул в «+ из пула», incumbent и Candidate-switcher — все `people[]`.
4. Поиск по `name` / `title` / `id`.
