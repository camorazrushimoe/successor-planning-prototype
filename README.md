# Successor Planning Prototype

Прототип системы succession planning для юнита большой аутсорс-компании (~150–200 инженеров).

Публичный репо: https://github.com/camorazrushimoe/successor-planning-prototype

## Зачем

Unit Head создаёт карточки критических ролей (имя свободное), указывает incumbent, planned successor. Система добавляет recommended. HRBP калибрует 9-box.

Готовность: ready now / 6м / 12м / 18+. Цели на человеке можно отмечать — чип на таймлайне едет зелёный/жёлтый.

## Документы

- [docs/SPEC.md](docs/SPEC.md) — продукт и фреймворки
- [docs/UI.md](docs/UI.md) — экраны и флоу создания роли
- [docs/DATA.md](docs/DATA.md) — схема JSON

## Данные

Полный seed (150 людей + 8 ролей):

```bash
python3 scripts/generate_seed.py
# пишет data/unit.json
```

Детерминированный `random.seed(42)`.

Пример структуры человека: [data/people.sample.json](data/people.sample.json).

У каждого: трек, тайтл (junior…partner), навыки, клиентские проекты, фидбек клиента, толки с руководителем, performance × potential.

Синтетика для демо, не прод-HR-данные.

## Статус

Спецификация + seed. UI читает `data/unit.json`.
