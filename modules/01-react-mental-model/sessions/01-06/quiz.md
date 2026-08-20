# Quiz: где живёт значение или действие

Каждый фрагмент показывает реальную границу ownership. Выберите ключ из
вариантов прямо под вопросом, внесите его в `answers.json` и объясните в
`reasons`: кто владеет данными, как долго они живут и чем React-вариант похож на
Vue, но не тождественен ему.

## q1. Производное имя

~~~tsx
function UserCard({
  firstName,
  lastName
}: {
  firstName: string;
  lastName: string;
}) {
  // Здесь нужно получить fullName для JSX.
  return <h1>{/* fullName */}</h1>;
}
~~~

`fullName` всегда вычисляется из `firstName` и `lastName` текущего render. Где
он должен появиться?

- `render` — вычислить во время render
- `state` — хранить в `useState`
- `effect` — обновлять через `useEffect`

## q2. Сохранение по конкретному click

~~~tsx
function SaveButton({ draft }: { draft: { id: string; title: string } }) {
  async function handleSave() {
    // Здесь должно начаться сохранение draft.
  }

  return <button onClick={handleSave}>Save</button>;
}
~~~

Сохранение должно произойти только после нажатия `Save`. Где размещать действие?

- `event` — выполнить в event handler
- `effect` — следить за флагом в `useEffect`
- `render` — выполнить во время render

## q3. Синхронизация с browser tab

~~~tsx
function DocumentPage({ record }: { record: { title: string } }) {
  return <h1>{record.title}</h1>;
}
~~~

Показанный документ меняется, а заголовок browser tab должен стать таким же,
как `record.title`. Какой React-механизм синхронизирует React state с внешним
объектом `window.document`?

- `effect` — синхронизировать `document.title` в `useEffect`
- `state` — скопировать title в state
- `ref` — хранить title в ref

## q4. Локальная вкладка панели

~~~tsx
function SettingsPanel() {
  // Пользователь выбирает "Profile" или "Security".
  // Выбор меняет только содержимое этой панели.
  // После reload возвращаться к выбору не требуется.
  return <section>{/* active panel */}</section>;
}
~~~

Где хранить выбранную вкладку?

- `state` — хранить в local state
- `ref` — хранить в ref
- `effect` — синхронизировать через effect

## q5. Фильтр, которым делятся ссылкой

~~~tsx
function IncidentsPage() {
  // Фильтр status=critical должен пережить reload.
  // Коллега должен получить тот же фильтр, открыв ссылку.
  return <IncidentsList />;
}
~~~

Какой владелец лучше всего подходит для фильтра?

- `url` — хранить в search params
- `state` — хранить только в component state
- `context` — хранить в Context

## q6. Данные API, общие для страниц

~~~tsx
function IncidentsPage() {
  // GET /api/incidents
  // Данные могут устареть и нужны также IncidentDetailsPage.
  return <IncidentsList />;
}
~~~

В каком типе состояния должен жить результат запроса, чтобы cache, loading,
ошибки и invalidation не пришлось реализовывать вручную в каждом component?

- `query` — хранить в server-state query cache
- `effect` — fetch в каждом component effect
- `zustand` — скопировать response в client store

## q7. Тема на глубине дерева

~~~tsx
function App() {
  return (
    <PageLayout>
      <Sidebar>
        <ThemeSwitch />
      </Sidebar>
    </PageLayout>
  );
}
~~~

`ThemeSwitch` и другие глубоко вложенные компоненты должны читать тему, не
передавая её через каждый промежуточный component. Какой механизм подходит?

- `context` — передать стабильную cross-cutting dependency через Context
- `props` — передать через каждый промежуточный component
- `effect` — синхронизировать через effect

## q8. Технический id таймера

~~~tsx
function Poller() {
  function startPolling() {
    const timerId = window.setInterval(refresh, 5_000);
    // timerId нужен позднее для clearInterval,
    // но никогда не должен показываться в JSX.
  }

  return <button onClick={startPolling}>Start polling</button>;
}
~~~

`timerId` должен пережить render, но его изменение не должно запрашивать новый
render. Какой React-механизм нужен?

- `ref` — хранить в ref
- `state` — хранить в state
- `render` — создавать заново при каждом render
