# 01-06. React и Vue: карта реактивности

Ожидаемое время: 45–55 минут.

## Результат сессии

Вы завершите первый раздел картой выбора механизма данных. Для нового требования вы сможете сначала определить владельца и жизненный цикл данных, а затем выбрать React API.

Цель — перестать переводить Vue-код по названиям:

- computed → useMemo;
- watch → useEffect;
- ref → useState.

Такие пары иногда совпадают по форме, но часто скрывают разные обязанности.

## Первый вопрос: данные вообще нужно хранить?

~~~tsx
function UserName({
  firstName,
  lastName
}: {
  firstName: string;
  lastName: string;
}) {
  const fullName = firstName + " " + lastName;
  return <strong>{fullName}</strong>;
}
~~~

fullName вычисляется из props текущего render. У него нет собственного жизненного цикла.

Лишняя модель:

~~~tsx
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);
~~~

Она добавляет:

- лишний state;
- лишний render;
- промежуточный момент рассинхронизации;
- dependencies, которых можно избежать.

Vue-аналог — computed. Но в React обычное вычисление во время render часто уже выполняет роль computed. useMemo нужен не для реактивности, а для измеренной оптимизации или стабильной identity.

## Второй вопрос: что стало причиной действия?

Если причину можно назвать конкретным пользовательским событием, логика обычно принадлежит handler:

~~~tsx
function handleSave() {
  saveDraft(draft);
}
~~~

Не нужно создавать флаг shouldSave и следить за ним effect:

~~~tsx
setShouldSave(true);

useEffect(() => {
  if (shouldSave) {
    saveDraft(draft);
  }
}, [shouldSave, draft]);
~~~

Так теряется связь между причиной и действием.

Vue watch также не является обязательным способом выполнить операцию после click. Обычный event handler остаётся лучшим владельцем.

## Третий вопрос: есть ли система вне React?

Effect синхронизирует React с тем, чем React не управляет:

~~~tsx
useEffect(() => {
  document.title = title;
}, [title]);
~~~

Другие примеры:

- browser event subscription;
- imperative map/video/chart API;
- WebSocket connection;
- timer как внешний процесс;
- сторонний widget.

Если effect только копирует одни React-данные в другие, сначала ищите обычное вычисление, event handler или правильно расположенный state.

Ближайший Vue-аналог может быть watch или watchEffect, но критерий тот же: побочный внешний процесс, а не желание «отреагировать на переменную».

## Четвёртый вопрос: кто владеет состоянием?

### Локальный UI state

~~~tsx
const [isOpen, setIsOpen] = useState(false);
~~~

Подходит, если данные нужны небольшой части дерева и влияют на render.

Vue: локальный ref.

### URL state

~~~tsx
const [searchParams, setSearchParams] = useSearchParams();
const query = searchParams.get("query") ?? "";
~~~

Подходит, если состояние должно:

- пережить reload;
- поддерживать back/forward;
- передаваться ссылкой;
- описывать текущую навигацию.

Vue: route.query и router.

### Server state

~~~tsx
const incidentsQuery = useQuery({
  queryKey: ["incidents", filters],
  queryFn: () => fetchIncidents(filters)
});
~~~

Серверные данные:

- принадлежат серверу;
- устаревают;
- кэшируются;
- повторно загружаются;
- могут изменяться другими пользователями.

Копирование response в Zustand или Redux не превращает их в client state. Для курса основным владельцем таких данных будет TanStack Query.

Vue-аналог — тот же TanStack Query для Vue либо другая server-state библиотека, а не обязательно Pinia.

### Context

~~~tsx
const theme = useContext(ThemeContext);
~~~

Context передаёт зависимость через дерево без промежуточного prop drilling. Это механизм доставки, а не универсальный store.

Vue: provide/inject.

### Client store

Store нужен, когда сложное client-owned state действительно используется разными удалёнными частями приложения и локального подъёма state недостаточно.

В курсе будут отдельно сравнены Zustand и Redux Toolkit. Store не используется автоматически только потому, что приложение большое.

## Пятый вопрос: значение должно вызывать render?

Если значение участвует в JSX, это обычно state, props, Context или подписанный store.

Если значение должно переживать render, но его изменение не должно обновлять UI:

~~~tsx
const timerId = useRef<number | null>(null);
~~~

Ref подходит для:

- DOM node;
- timer id;
- imperative instance;
- технического latest value с осознанной семантикой.

Не переносите видимое значение из state в ref ради сокращения renders: UI перестанет получать сигнал.

## Короткое дерево выбора

    Можно вычислить из текущих props/state?
      └─ да → вычислить во время render

    Причина — конкретное действие пользователя?
      └─ да → event handler

    Данные описывают shareable navigation?
      └─ да → URL

    Данные принадлежат серверу и устаревают?
      └─ да → query cache

    Это внешняя система, которую нужно синхронизировать?
      └─ да → effect

    Это локальная память, влияющая на UI?
      └─ да → state

    Это стабильная зависимость дерева?
      └─ да → Context

    Значение техническое и не должно рендерить UI?
      └─ да → ref

    Осталось сложное shared client state?
      └─ рассмотреть store

## Задание

Откройте `quiz.md`: в нём восемь небольших фрагментов кода и контекст каждого
решения. `quiz.json` остаётся техническим контрактом для runner. В answers.json
для каждого:

1. выберите механизм;
2. объясните ownership и жизненный цикл;
3. назовите ближайший Vue-аналог;
4. укажите, где аналогия перестаёт работать.

Автоматическая часть:

    pnpm session:check

Она проверит выбранные механизмы и наличие reason. Правильные ответы находятся в support-ветке, а не рядом с quiz.

Семантическая часть:

    pnpm session:review

Codex проверит качество объяснений по rubric. Автоматический quiz не способен определить, действительно ли reason объясняет ownership или просто содержит случайный текст.

После PASS:

    pnpm session:review --record PASS
    pnpm session:finish

Подсказки раскрываются последовательно:

    pnpm session:hint

## DONE

- восемь вариантов прошли автоматическую проверку;
- каждый reason содержит ownership, lifecycle и Vue-сравнение;
- effect не используется для derived value или пользовательского события;
- server state не помещён в client store без причины;
- Codex-review записан как PASS.
