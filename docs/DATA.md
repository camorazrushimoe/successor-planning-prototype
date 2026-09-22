# Данные прототипа

Файл: `data/unit.json`

```
{
  unit: { name, company, head, hrbp, headcount, last_talent_review },
  people: Person[],
  roles: Role[]
}
```

## Person

- id, name, email, location
- track, level, title
- years_experience, years_in_company, manager_id
- utilization_pct, bench_risk, english
- skills[]
- projects[]: client, domain, role_on_project, duration_months, status, impact
- client_feedback[]: source, date, score, summary
- manager_talks[]: date, author_role, summary
- performance: low | medium | high
- potential: low | medium | high
- notes

level: junior | middle | senior | lead | principal | architect | partner

## Role

- id, name (свободное имя от босса), purpose
- created_by, incumbent_id, criticality
- success_profile: must_have[], nice_to_have[], competencies[]
- emergency_cover_id
- slates[]
- hr_notes

## Slate entry

- person_id
- kind: planned | recommended
- primary: bool
- readiness: ready_now | 6m | 12m | 18m
- track_status: on_track | at_risk | stalled | ready | not_started
- goals[]: id, title, due, status, evidence
- why

Seed уже содержит 8 ролей и slates, чтобы UI не стартовал с пустой доски. Босс в прототипе может создать девятую.
