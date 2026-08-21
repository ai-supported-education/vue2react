# 01-03. Почему мутация объекта не обновляет UI

Ожидаемое время: 40–50 минут.

## Результат сессии

Вы исправите обновление object state и сможете объяснить:

- почему объект внутри useState остаётся обычным JavaScript-объектом;
- почему React важна identity значения;
- чем создание следующего snapshot отличается от мутации предыдущего;
- зачем updater callback получает previous state.

## Starter

Сокращённая проблемная часть App.tsx:

~~~tsx
const [profile, setProfile] = useState({
  name: "Ada",
  score: 0
});

function handleIncreaseScore() {
  profile.score += 1;
  setProfile(profile);
}
~~~

После click score в UI остаётся 0.

## Что произошло в памяти

Пусть переменная profile указывает на объект A:

    profile ──→ object A { name: "Ada", score: 0 }

Строка:

~~~ts
profile.score += 1;
~~~

не создаёт новое значение state. Она меняет object A:

    profile ──→ object A { name: "Ada", score: 1 }

Затем setter получает тот же object A:

~~~ts
setProfile(profile);
~~~

React сравнивает следующее state с предыдущим примерно через Object.is. Для одной и той же ссылки:

~~~ts
Object.is(profile, profile); // true
~~~

React имеет право пропустить render, потому что новое значение не отличается по identity.

Проблема шире отсутствующего render: object A был snapshot прошлого render. После мутации старые handlers, логи или history больше не могут увидеть его прежнее состояние.

## Следующий snapshot

Вместо изменения A нужно создать object B:

    previous ──→ object A { name: "Ada", score: 0 }
    next     ──→ object B { name: "Ada", score: 1 }

Для неглубокого объекта используется spread:

~~~tsx
setProfile({
  ...profile,
  score: profile.score + 1
});
~~~

React получает другую ссылку и может построить следующий snapshot.

Однако когда новое значение зависит от предыдущего, устойчивее использовать updater callback:

~~~tsx
setProfile((previousProfile) => ({
  ...previousProfile,
  score: previousProfile.score + 1
}));
~~~

React сам передаёт callback актуальное предыдущее значение из очереди обновлений. Код не зависит от profile конкретного render.

## Shallow copy — не deep clone

Spread копирует только один уровень:

~~~ts
const next = { ...previous };
~~~

Если profile содержит вложенный объект:

~~~ts
{
  name: "Ada",
  stats: {
    score: 0
  }
}
~~~

такое обновление всё ещё мутирует прошлый snapshot:

~~~ts
const next = { ...previous };
next.stats.score += 1;
~~~

Для изменения stats нужно создать новый объект на каждом изменяемом уровне:

~~~tsx
setProfile((previous) => ({
  ...previous,
  stats: {
    ...previous.stats,
    score: previous.stats.score + 1
  }
}));
~~~

В starter только один уровень, поэтому deep update пока не требуется.

## Сравнение с Vue reactive

Vue:

~~~ts
const profile = reactive({
  name: "Ada",
  score: 0
});

profile.score += 1;
~~~

reactive возвращает Proxy. Vue перехватывает запись score и уведомляет подписанные вычисления/template.

React:

~~~tsx
const [profile, setProfile] = useState({
  name: "Ada",
  score: 0
});
~~~

profile не Proxy. Его поля технически mutable, но state нужно рассматривать как readonly snapshot. Сигналом служит setter с новым значением.

Поэтому прямой перенос привычки из reactive в useState приводит к особенно коварным ошибкам.

## Ложные исправления

Мутация, а затем clone:

~~~tsx
profile.score += 1;
setProfile({ ...profile });
~~~

UI, вероятно, обновится, но прошлый snapshot уже повреждён до clone. Это не корректное immutable update.

Dummy state:

~~~tsx
profile.score += 1;
forceRender((value) => value + 1);
~~~

Так код вручную маскирует отсутствие правильного state transition.

Effect:

~~~tsx
useEffect(() => {
  // попытка синхронизировать копию score
}, [profile]);
~~~

Effect не исправляет identity и создаёт второй источник истины.

## Задание

Исправьте handleIncreaseScore в App.tsx:

- previous profile не мутирует;
- setter получает updater function, которая возвращает новый объект;
- score вычисляется из аргумента previous state, переданного React в updater;
- name сохраняется;
- остальная разметка не меняется.

Автоматическая проверка:

    pnpm session:check

Check запускает TypeScript и поведенческий тест двух clicks. Тест не проверяет имя hook или точный текст реализации.

После зелёного check обязателен отдельный Codex-review: он проверяет, что решение не мутирует
предыдущий state snapshot и вычисляет next state из аргумента updater-функции. Эти критерии
не стоит выражать хрупким поиском конкретного текста реализации.

Команда ниже только собирает review-пакет и сама не запускает агента. Попросите Codex
проверить активную сессию; после фактической проверки он запишет PASS или NEEDS_WORK.

    pnpm session:review

Подсказка:

    pnpm session:hint

## DONE

- два clicks выводят score 2;
- heading по-прежнему содержит Ada;
- handler передаёт setter updater function, вычисляет score из её аргумента
  previous state и не мутирует этот snapshot независимо от имени переменной;
- typecheck и unit test проходят.
- Codex-review записан как PASS.

Завершение:

    pnpm session:finish
