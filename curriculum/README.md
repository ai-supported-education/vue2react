# Карта курса

Курс содержит 17 тематических разделов и итоговый operations dashboard:

- 102 базовые сессии;
- 24 capstone-сессии;
- 126 завершённых шагов;
- 5970 минут, или 99,5 часа по оценкам;
- средняя сессия — 47 минут;
- самая короткая — 35 минут, самая длинная — 60 минут.

Эта страница служит навигацией. Канонические outcomes, критерии DONE и checks находятся в [course.json](course.json).

## 01. Ментальная модель React

- 01-01 UI как snapshot рендера — 35 минут
- 01-02 Изменение state как сигнал — 40 минут
- 01-03 Почему мутация не обновляет UI — 45 минут
- 01-04 Batching и функциональный updater — 40 минут
- 01-05 Snapshot в асинхронном обработчике — 45 минут
- 01-06 React и Vue: карта реактивности — 50 минут

## 02. JSX, компоненты и props

- 02-01 Выражения внутри JSX — 35 минут
- 02-02 Компонент вместо шаблона — 40 минут
- 02-03 Readonly props и defaults — 45 минут
- 02-04 Композиция через children — 45 минут
- 02-05 Условный UI — 50 минут
- 02-06 Составной информационный блок — 55 минут

## 03. State и события

- 03-01 State против локальной переменной — 35 минут
- 03-02 Событие как намерение — 45 минут
- 03-03 Форма state — 45 минут
- 03-04 Иммутабельное обновление массива — 50 минут
- 03-05 Не хранить derived state — 45 минут
- 03-06 Переходы через useReducer — 55 минут

## 04. Identity, коллекции и controlled UI

- 04-01 Key как identity — 35 минут
- 04-02 Редактируемый список — 45 минут
- 04-03 Controlled input — 45 минут
- 04-04 Подъём state — 50 минут
- 04-05 Сохранить или сбросить state — 50 минут
- 04-06 Поиск по каталогу — 55 минут

## 05. Effects и внешние системы

- 05-01 Effect не равен watch — 35 минут
- 05-02 Синхронизация с browser API — 45 минут
- 05-03 Cleanup подписки — 50 минут
- 05-04 Dependencies и stale closure — 50 минут
- 05-05 Отмена устаревшей операции — 50 минут
- 05-06 Удаление лишнего effect — 55 минут

## 06. Refs, Context и custom hooks

- 06-01 DOM ref и focus — 35 минут
- 06-02 Mutable ref без рендера — 45 минут
- 06-03 Context как зависимость — 50 минут
- 06-04 Граница обновления Context — 45 минут
- 06-05 Контракт custom hook — 50 минут
- 06-06 Комбинация hook, ref и Context — 55 минут

## 07. TypeScript-контракты React

- 07-01 Props и event contracts — 35 минут
- 07-02 Discriminated union для вариантов — 45 минут
- 07-03 Children и render callbacks — 45 минут
- 07-04 Generic-компонент списка — 50 минут
- 07-05 Nullable refs и form events — 50 минут
- 07-06 Типизированный hook API — 55 минут

## 08. React Router и URL state

- 08-01 Route tree и Link — 35 минут
- 08-02 Nested layout и Outlet — 45 минут
- 08-03 Route params — 45 минут
- 08-04 Фильтр в search params — 50 минут
- 08-05 Protected layout — 50 минут
- 08-06 Lazy route и route error — 55 минут

## 09. Формы и валидация

- 09-01 Нативная семантика form — 35 минут
- 09-02 React Hook Form registration — 45 минут
- 09-03 Zod-схема — 45 минут
- 09-04 Доступные ошибки полей — 50 минут
- 09-05 Server error при submit — 50 минут
- 09-06 Форма создания инцидента — 55 минут

## 10. MSW и TanStack Query

- 10-01 Server state против client state — 35 минут
- 10-02 Контракт API через MSW — 45 минут
- 10-03 QueryClient и query keys — 50 минут
- 10-04 Loading, empty, error и retry — 50 минут
- 10-05 Mutation и invalidation — 55 минут
- 10-06 Optimistic update и rollback — 55 минут

## 11. Context, Zustand и Redux Toolkit

- 11-01 Карта владения состоянием — 35 минут
- 11-02 Context и reducer как baseline — 45 минут
- 11-03 Zustand store и selectors — 50 минут
- 11-04 Persisted UI preferences — 50 минут
- 11-05 Redux Toolkit slice и selectors — 55 минут
- 11-06 Нормализация и ADR выбора store — 55 минут

## 12. Feature-Sliced Design

- 12-01 Смысл FSD-слоёв — 35 минут
- 12-02 Page-first без преждевременного slicing — 40 минут
- 12-03 Public API slice — 45 минут
- 12-04 Направление зависимостей — 50 минут
- 12-05 Feature или entity — 50 минут
- 12-06 Архитектурный аудит — 55 минут

## 13. UI-system, Storybook и accessibility

- 13-01 Tailwind composition — 35 минут
- 13-02 Владение shadcn/ui компонентом — 45 минут
- 13-03 Семантическая таблица — 45 минут
- 13-04 Stories как каталог состояний — 50 минут
- 13-05 Interaction и a11y story — 50 минут
- 13-06 Responsive dashboard widget — 55 минут

## 14. Стратегия тестирования

- 14-01 Чистая логика и unit test — 35 минут
- 14-02 Testing Library глазами пользователя — 45 минут
- 14-03 Асинхронный тест с MSW — 45 минут
- 14-04 Удалить implementation-detail test — 50 минут
- 14-05 Playwright critical flow — 50 минут
- 14-06 Матрица test levels — 55 минут

## 15. Performance и надёжность UI

- 15-01 Профилирование рендера — 35 минут
- 15-02 Мемоизация по доказательству — 45 минут
- 15-03 Transition для non-urgent UI — 45 минут
- 15-04 Lazy и Suspense boundary — 50 минут
- 15-05 Error Boundary и recovery — 50 минут
- 15-06 Надёжный экран данных — 55 минут

## 16. Product concerns и delivery

- 16-01 Mock auth и role capabilities — 35 минут
- 16-02 i18n и fallback — 45 минут
- 16-03 Runtime config и env validation — 50 минут
- 16-04 Docker image и Nginx SPA fallback — 50 минут
- 16-05 GitHub Actions и Vercel preview — 55 минут
- 16-06 Sentry errors и source maps — 55 минут

## 17. Next.js и server-first React

- 17-01 SPA, SSR, RSC и hydration — 35 минут
- 17-02 App Router route — 45 минут
- 17-03 Server и Client Components — 50 минут
- 17-04 Loading и error route UI — 50 минут
- 17-05 Mutation на server boundary — 50 минут
- 17-06 ADR: Vite SPA или Next.js — 55 минут

## Capstone: Operations dashboard

- CP-01 Домен и acceptance map — 45 минут
- CP-02 App shell и providers — 50 минут
- CP-03 Route tree и layouts — 50 минут
- CP-04 MSW login contract — 50 минут
- CP-05 Session restore и protected routes — 55 минут
- CP-06 Role capabilities — 45 минут
- CP-07 Assets API — 45 минут
- CP-08 Assets query states — 50 минут
- CP-09 Assets table — 50 минут
- CP-10 Фильтры в URL — 50 минут
- CP-11 Asset detail — 45 минут
- CP-12 Incident form schema — 50 минут
- CP-13 Create incident mutation — 50 минут
- CP-14 Optimistic acknowledge и rollback — 55 минут
- CP-15 Zustand UI preferences — 45 минут
- CP-16 FSD audit и public APIs — 55 минут
- CP-17 Storybook и accessibility — 50 минут
- CP-18 Unit и integration regression — 55 минут
- CP-19 Playwright role workflow — 55 минут
- CP-20 i18n и fallback states — 45 минут
- CP-21 Error Boundary и Sentry — 50 минут
- CP-22 Docker и Nginx — 55 минут
- CP-23 GitHub Actions и Vercel — 55 минут
- CP-24 Финальный acceptance review — 60 минут
