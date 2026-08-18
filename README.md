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

Сейчас зафиксирована карта курса и контракт короткой учебной сессии:

- [обзор всех разделов и сессий](curriculum/README.md);
- [контракт сессии](curriculum/session-contract.md);
- [машиночитаемая карта курса](curriculum/course.json);
- [handoff для session runner](curriculum/runner-handoff.md).

Следующий этап — реализовать runner с командами `session:start`, `session:check`, `session:review` и `session:finish`, после чего подготовить первый учебный раздел.
