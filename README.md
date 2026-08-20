# React training for a Vue developer

Практический курс по React и его экосистеме для разработчика, знакомого с Vue 3, Composition API и TypeScript.

Курс состоит из коротких сессий продолжительностью 30–60 минут. Каждая сессия начинается с рабочего состояния, решает одну задачу и заканчивается проверяемым результатом без обязательных незавершённых хвостов.

## Что входит в курс

- ментальная модель React в сравнении с реактивностью Vue;
- компоненты, state, effects, refs, context и custom hooks;
- React Router, React Hook Form, Zod и TanStack Query;
- MSW, Zustand и Redux Toolkit;
- Feature-Sliced Design;
- Tailwind CSS, shadcn/ui, Storybook и accessibility;
- Vitest, Testing Library и Playwright;
- auth, i18n, error handling и frontend observability;
- Docker, Nginx, GitHub Actions и Vercel;
- отдельная лаборатория по Next.js;
- итоговый operations dashboard.

## Статус

Реализованы session runner и первый учебный раздел 01-01 — 01-06:

- [обзор всех разделов и сессий](curriculum/README.md);
- [контракт сессии](curriculum/session-contract.md);
- [стандарт учебного материала](curriculum/authoring-standard.md);
- [машиночитаемая карта курса](curriculum/course.json);
- [описание session runner](curriculum/runner-handoff.md);
- [первый раздел](modules/01-react-mental-model/README.md).

## Начало работы

Установите зависимости и посмотрите следующую карточку:

    pnpm install
    pnpm session:validate
    pnpm session:next
    pnpm session:start 01-01

Основной цикл:

    pnpm session:check
    pnpm session:finish

`session:check` запускает только локальные автоматические проверки: quiz,
TypeScript, Vitest и другие checks из карточки. Команда не обращается к Codex.

Если среди checks указан `review`, после зелёного check попросите Codex:

    Проверь активную учебную сессию

Codex запустит `pnpm session:review`, проверит объяснение, соответствие условию и
best practices, затем запишет `PASS` или `NEEDS_WORK`. Сама shell-команда
`pnpm session:review` лишь печатает пакет для проверки — агента она не запускает.

Для code-сессий доступен интерактивный UI:

    pnpm session:dev

Если нужен ограниченный уровень помощи:

    pnpm session:hint

Каждый вызов раскрывает ровно один следующий уровень. Подсказки, ключи quiz и
эталонные решения находятся в отдельной Git-ветке `course-support`, поэтому не
видны рядом с упражнением в IDE. Намеренно прочитать эту ветку всё равно можно:
это защита от случайного спойлера, а не от владельца локального repository.

Прогресс хранится в игнорируемой Git папке .training. Runner не создаёт commits, не переключает branches и не применяет решение автоматически.

## Personal fork

Официальный repository хранит чистый курс. Решения, заполненные `answers.json`
и изменённые `App.tsx` держите в личном fork на отдельной ветке, например
`progress/<ваше-имя>`.

Один раз добавьте официальный repository как `upstream` и создайте ветку
прохождения:

    git remote add upstream https://github.com/ai-supported-education/vue2react.git
    git fetch upstream
    git switch -c progress/<ваше-имя>
    git push -u origin progress/<ваше-имя>

Когда официальный курс обновился, сначала обновите личный `master`, затем
влейте его в ветку прохождения:

    git fetch upstream
    git switch master
    git merge --ff-only upstream/master
    git push origin master
    git switch progress/<ваше-имя>
    git merge master
    git push origin progress/<ваше-имя>

При конфликте в ветке `progress/<ваше-имя>` сохраните собственное решение,
проверьте текущую учебную сессию и только затем завершите merge. После
`git fetch upstream` runner сам использует `upstream/course-support` для hints
и quiz keys; вручную переключаться на эту ветку не нужно.
