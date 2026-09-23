# Successor Planning Prototype

Прототип succession planning. Спека 0.7.

Выгрузка людей **не живёт в git**. Её кладёт агент локально.

## Как развернуть локально (для агента)

Нужно: этот репозиторий + локальный JSON с людьми (контракт — [DATA_CONTRACT.md](DATA_CONTRACT.md)).

```bash
git clone https://github.com/camorazrushimoe/successor-planning-prototype.git
cd successor-planning-prototype

# положи выгрузку ровно сюда, имя файла строго people.json
cp /path/to/export.json prototype/people.json

cd prototype
python3 -m http.server 8080
```

Открыть http://127.0.0.1:8080/

Без HTTP (`file://`) `fetch('people.json')` часто не работает — пул не подхватится.

Не коммить боевую выгрузку. Файл в `prototype/people.json` в репо — только короткий сэмпл; его можно перезаписать локально.

Проверка: в шапке счётчик `пул N` = число людей в JSON. «+ из пула» ищет по этому списку.

## Документы

[DATA_CONTRACT.md](DATA_CONTRACT.md) · [SPEC](docs/SPEC.md) · [UI](docs/UI.md) · [DESIGN](docs/DESIGN.md) · [DEMO](docs/DEMO.md)
