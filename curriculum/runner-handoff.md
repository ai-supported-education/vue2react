# Handoff: session runner

## Назначение

Runner превращает course.json в последовательность коротких учебных сессий. Он управляет прогрессом и проверками, но не решает упражнения и не выполняет скрытые Git-операции.

## Источники данных

- course.json — единственный источник структуры, порядка, duration, outcome, DONE и checks.
- session-contract.md — правила поведения runner и Codex-review.
- Порядок modules и sessions задаёт линейную зависимость по умолчанию.
- Capstone открывается после последней базовой сессии.

Runner обязан проверять manifest до любой операции:

- JSON читается;
- module и session ids уникальны;
- duration находится в диапазоне 30–60 минут;
- kind входит в разрешённый список;
- outcome, done и checks заполнены;
- каждый раздел содержит хотя бы одну сессию.

## Локальное состояние

Прогресс хранится в .training/progress.json, а каталог .training игнорируется Git.

Минимальная форма состояния:

    {
      "schemaVersion": 1,
      "activeSessionId": null,
      "completedSessionIds": [],
      "startedAt": null,
      "lastCheck": null
    }

Запись должна быть атомарной: сначала временный файл в .training, затем rename. Повреждённый progress не перезаписывается молча — runner сообщает путь и предлагает восстановление из последнего валидного backup.

## Команды

### session:next

- Только читает данные.
- Если есть activeSessionId, показывает активную карточку.
- Иначе показывает первую незавершённую доступную сессию.
- Выводит id, title, minutes, outcome, done и checks.
- Не раскрывает последующие карточки сверх одной ближайшей.

### session:start ID

- Проверяет существование и доступность ID.
- Если активна другая сессия, завершает работу без изменений.
- Повторный start текущего ID идемпотентен.
- Записывает activeSessionId и startedAt.
- Показывает только материалы текущей сессии.
- Не копирует solution и не выполняет Git commit, checkout или branch switch.

### session:check

- Требует активную сессию.
- Сопоставляет labels из checks с заранее объявленными командами.
- Запускает проверки последовательно и останавливает итоговый verdict при ошибке, сохраняя результаты всех безопасно выполнимых checks.
- Записывает время, exit codes и краткий report в lastCheck.
- Не исправляет файлы и не запускает formatter в write-режиме.

### session:review

- Требует выполненный session:check.
- Собирает task, outcome, done, rubric, diff текущей работы и результаты checks.
- Выводит готовый review-пакет для Codex.
- Инструктирует Codex вернуть PASS или NEEDS_WORK и не менять файлы.
- Неблокирующие улучшения отделяются от обязательного scope.

### session:finish

- Требует зелёный актуальный lastCheck и PASS review, если check review указан в manifest.
- Добавляет ID в completedSessionIds, очищает activeSessionId и startedAt.
- Создаёт локальный checkpoint metadata.
- Не создаёт Git commit автоматически.
- Показывает короткое подтверждение завершения и следующую карточку.

### session:rescue

- Доступна только для активной сессии.
- Показывает уровни помощи по одному: concept, location, reference diff.
- Никогда не применяет diff автоматически.
- После применения reference решения обычные check и finish остаются обязательными.

## Check registry

Первая версия runner должна поддерживать labels:

- quiz и review — проверка материала и rubric;
- typecheck, lint, unit, integration — локальные code checks;
- fsd — Steiger;
- storybook и a11y — component-level checks;
- e2e — Playwright;
- build — production build;
- docker — image, healthcheck и SPA deep-link smoke;
- ci и deploy — статическая проверка workflow плюс документируемая внешняя проверка;
- observability — disabled-mode test и test-event contract.

Точная shell-команда для label задаётся в централизованном registry. Manifest не может содержать произвольную shell-команду.

## Acceptance criteria runner

1. Новый пользователь получает 01-01 через session:next.
2. Нельзя начать 01-03 до завершения 01-02.
3. Повторный start активной карточки не повреждает progress.
4. Нельзя открыть вторую карточку при незавершённой первой.
5. Failed check не закрывает сессию и сохраняет диагностический report.
6. Успешный finish делает следующую карточку доступной.
7. Повреждённый progress не приводит к потере предыдущего состояния.
8. Review и rescue не изменяют tracked files.
9. Runner одинаково работает из корня workspace на macOS и Linux CI.
10. Все 126 карточек из manifest достижимы в заданном порядке.

## Следующая реализация

1. Добавить JSON Schema и dependency-free validator manifest.
2. Создать TypeScript CLI и progress storage.
3. Реализовать next/start без exercise-файлов.
4. Добавить check registry и test doubles для внешних checks.
5. Покрыть lifecycle runner unit и integration tests.
6. После стабильного runner подготовить материалы 01-01 — 01-06.
