# 01-01. UI как snapshot рендера

Ожидаемое время: 35–45 минут.

## Результат сессии

После этой карточки вы сможете по коду определить:

- какое значение state видит конкретный render;
- что увидит созданный в нём event handler;
- почему setter не меняет уже выполняющуюся функцию;
- когда React вызовет компонент ещё раз;
- чем эта модель отличается от ref во Vue.

Здесь пока не нужно писать компонент. Цель — построить модель, с которой последующие упражнения перестанут выглядеть набором странных правил.

## На что именно реагирует React

Название React не означает, что библиотека наблюдает за каждой JavaScript-мутацией.

React пересчитывает часть UI, когда получает известный ему сигнал:

- setter локального state;
- новый props после рендера родителя;
- новое значение Context;
- уведомление подписанного внешнего store.

Обычная переменная или объект не становятся специальными после того, как попали в компонент. React не оборачивает их в Proxy и не перехватывает присваивания.

Упрощённая модель одного обновления:

    событие
       ↓
    setter получает следующее значение
       ↓
    React ставит render в очередь
       ↓
    React снова вызывает component function
       ↓
    функция возвращает новый snapshot JSX
       ↓
    React приводит DOM в соответствие snapshot

Render здесь — не обязательная полная перерисовка DOM. Это повторный вызов component function, после которого React сравнивает результат с предыдущим и применяет необходимые DOM-изменения.

Setter именно **запрашивает** обновление, а не гарантирует новый render. Если
запрошенное state совпадает с предыдущим по `Object.is`, React может отбросить
запрос. Ниже это станет видно на примере объекта; базовая схема показывает путь,
когда следующее значение действительно отличается.

## Первый пример: setter не переписывает текущую переменную

Рассмотрим компонент:

~~~tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log("inside handler:", count);
  }

  console.log("during render:", count);

  return <button onClick={handleClick}>Count: {count}</button>;
}
~~~

При первом render React вызывает Counter и передаёт ему snapshot, в котором count равен 0.

Результат этого render можно мысленно представить так:

~~~tsx
function handleClickFromRender0() {
  setCount(0 + 1);
  console.log("inside handler:", 0);
}

return <button onClick={handleClickFromRender0}>Count: 0</button>;
~~~

После click происходит следующее:

1. Запускается handler, созданный render 0.
2. setCount получает следующее значение 1.
3. React ставит обновление в очередь.
4. console.log всё ещё читает count из render 0 и печатает 0.
5. После завершения handler React вызывает Counter ещё раз.
6. Render 1 получает count равный 1 и создаёт новый handler.
7. DOM-кнопка начинает показывать Count: 1.

Важно: строка const [count, setCount] не объявляет изменяемую локальную ячейку count. Для каждого вызова Counter создаётся новая локальная переменная со значением snapshot этого render.

Само состояние хранится у React, вне конкретного вызова функции. useState просит React вернуть значение, относящееся к текущей позиции компонента в дереве.

## Сравнение с Vue ref

Ближайший Vue-пример ведёт себя иначе внутри той же функции:

~~~ts
const count = ref(0);

function handleClick() {
  count.value += 1;
  console.log(count.value);
}
~~~

count — ссылка на реактивную ячейку. После записи чтение count.value в этом же handler уже возвращает новое значение.

В React:

~~~tsx
setCount(count + 1);
console.log(count);
~~~

count — значение snapshot, а не ссылка на текущую ячейку React. Setter планирует следующее значение, но локальное count не меняется.

Полезное соответствие:

| Вопрос | Vue ref | React state |
|---|---|---|
| Где читается текущее значение | ref.value | snapshot текущего render |
| Как сообщить об изменении | запись в ref.value | вызов setter |
| Изменится ли последующее чтение в том же handler | да | нет |
| Как обновится template/JSX | dependency tracking | новый render snapshot |

Это соответствие не означает, что useState является синтаксической заменой ref. У них различается модель чтения во времени.

## Несколько setter-вызовов

Теперь рассмотрим:

~~~tsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
~~~

Если handler создан при count равном 0, можно выполнить мысленную подстановку:

~~~tsx
setCount(0 + 1);
setCount(0 + 1);
setCount(0 + 1);
~~~

Все три запроса предлагают одно следующее значение — 1. Они не изменяют count между строками.

Когда каждое обновление должно использовать результат предыдущего обновления в очереди, React принимает updater function:

~~~tsx
setCount((previous) => previous + 1);
~~~

В 01-03 вы впервые примените эту форму для обновления объекта, а в 01-04 отдельно разберёте, как updater-функции работают в очереди обновлений. Сейчас достаточно понимать, зачем она существует.

## Асинхронный callback принадлежит своему render

В следующем примере `Ada` и `Grace` — просто два явно заданных имени. Родитель
`GreetingDemo` хранит выбранное имя в state и передаёт его дочернему компоненту
через prop `name`:

~~~tsx
import { useState } from "react";

function GreetingDemo() {
  const [name, setName] = useState("Ada");

  return (
    <section>
      <button onClick={() => setName("Ada")}>Choose Ada</button>
      <button onClick={() => setName("Grace")}>Choose Grace</button>
      <DelayedGreeting name={name} />
    </section>
  );
}

function DelayedGreeting({ name }: { name: string }) {
  function handleClick() {
    window.setTimeout(() => {
      console.log("Hello, " + name);
    }, 3000);
  }

  return <button onClick={handleClick}>Greet {name}</button>;
}
~~~

Выполним конкретную последовательность:

1. Первый render `GreetingDemo` получает state `name = "Ada"`.
2. Он вызывает `DelayedGreeting` с prop `name="Ada"`.
3. На экране появляется кнопка `Greet Ada`.
4. Пользователь нажимает `Greet Ada`. Созданный в этом render `handleClick`
   регистрирует callback в `setTimeout`.
5. Не дожидаясь трёх секунд, пользователь нажимает `Choose Grace`.
6. `setName("Grace")` запрашивает новый render. React снова вызывает
   тот же экземпляр `DelayedGreeting`, но уже с `name="Grace"`; кнопка
   показывает `Greet Grace`.
7. Срабатывает timeout, зарегистрированный на шаге 4. Он выводит `Hello, Ada`.

Почему не `Grace`? Обычная JavaScript-функция замыкает переменные из места, где
она была создана. Callback на шаге 4 был создан внутри вызова
`DelayedGreeting({ name: "Ada" })`, поэтому его `name` относится к тому render.

Новый render не редактирует старую функцию. Он создаёт другую функцию с другим
`name`:

~~~tsx
// Упрощённо: callback, уже переданный первому timeout.
function callbackFromAdaRender() {
  console.log("Hello, " + "Ada");
}

// Новый callback появился после выбора Grace,
// но он попадёт в timeout только после нового нажатия Greet Grace.
function callbackFromGraceRender() {
  console.log("Hello, " + "Grace");
}
~~~

React здесь не делает специальную копию `name`. Это обычное JavaScript-замыкание
в сочетании с моделью render snapshot.

Это не «устаревшее значение» автоматически. Иногда сохранённый snapshot — правильный контракт операции. Например, отложенная отправка должна помнить адресата на момент нажатия Send.

В других случаях действительно требуется latest value. Тогда это отдельное архитектурное решение, обычно с ref или новой подпиской, а не свойство state по умолчанию.

## Почему мутация объекта не является сигналом

~~~tsx
const [profile, setProfile] = useState({
  name: "Ada",
  score: 0
});

function increaseScore() {
  profile.score += 1;
}
~~~

profile — обычный JavaScript-объект. Присваивание меняет объект в памяти, но:

- setter не был вызван;
- новый render не был запрошен;
- прошлый snapshot теперь повреждён мутацией.

Даже такой код остаётся неправильным:

~~~tsx
profile.score += 1;
setProfile(profile);
~~~

### Почему setter с той же ссылкой не даёт следующий snapshot

Сразу после `useState` и React, и локальная переменная `profile` указывают на
один объект. Назовём его `O`:

    state, хранимый React ──→ O { name: "Ada", score: 0 }
    profile текущего render ─┘

После прямой мутации новый объект не появляется. Меняется тот же `O`:

    state, хранимый React ──→ O { name: "Ada", score: 1 }
    profile текущего render ─┘

Поэтому в `setProfile(profile)` передаётся не «обновлённый profile» как новое
значение, а всё тот же объект `O`, который React уже хранит как предыдущее
state. Упрощённо React видит такую пару:

~~~ts
const objectO = { name: "Ada", score: 1 };
const previousState = objectO;
const requestedNextState = objectO;

Object.is(previousState, requestedNextState); // true
~~~

Для `useState` React сравнивает верхнеуровневое значение через `Object.is`.
Он не обходит автоматически каждое поле объекта и не хранит скрытую глубокую
копию прошлого state. В этом случае сравнивать уже нечего: «прошлое» и
«следующее» — одна ссылка на объект, который был изменён на месте. Поэтому
React может пропустить render для этого обновления.

Это не только про видимое обновление UI. Старый snapshot тоже уже испорчен:
любой code, который держал ссылку на `O` как на состояние с `score: 0`, теперь
увидит `score: 1` без отдельного перехода state.

Сигнал нового snapshot — отдельный объект `N`:

~~~tsx
setProfile((previous) => ({
  ...previous,
  score: previous.score + 1
}));
~~~

Теперь картина другая:

    previous state ──→ O { name: "Ada", score: 0 }
    next state     ──→ N { name: "Ada", score: 1 }

`Object.is(O, N)` возвращает `false`: React получил явно новое значение и может
построить следующий render. Здесь достаточно запомнить этот контракт identity.
В 01-03 вы разберёте его на коде: почему нельзя сначала мутировать и потом
клонировать, как обновлять вложенные объекты и зачем в таком случае нужен
updater callback.

## Техника мысленной подстановки

Когда поведение непонятно:

1. Подпишите номер render.
2. Запишите значения state и props этого render.
3. Подставьте эти значения в handlers, созданные render.
4. Отдельно выпишите значения, переданные setter.
5. Только после завершения handler переходите к следующему render.

Не смешивайте локальное значение текущего render и следующее значение, которое хранит React.

## Задание

Откройте `quiz.md`: в нём пять коротких фрагментов кода и сценарии их запуска.
`quiz.json` остаётся техническим контрактом для runner; правильных ответов в
рабочей ветке нет.

Для каждого вопроса:

1. Сначала сделайте прогноз без запуска кода.
2. Запишите букву варианта в answers.json.
3. Заполните reason своими словами.

Автоматическая проверка:

    pnpm session:check

Команда сверит варианты с ключом из отдельной support-ветки и проверит наличие объяснений. Смысл объяснений автоматически не оценивается, поэтому после зелёного check попросите Codex: `Проверь активную учебную сессию`. Codex проверит reasoning по rubric и запишет PASS или NEEDS_WORK.

Если застряли:

    pnpm session:hint

Каждый вызов раскрывает только следующий уровень. Файла с подсказками в папке сессии нет.

## DONE

- заполнены пять ответов и пять самостоятельных объяснений;
- session:check сообщает, что quiz пройден;
- Codex-review записал PASS;
- setter описан как запрос следующего render;
- локальная переменная описана как значение конкретного snapshot;
- прямая мутация не называется сигналом React.

Завершение:

    pnpm session:finish

После finish runner откроет 01-02, но не начнёт её автоматически.

В 01-02 сигнал setter не вводится заново: вы примените уже построенную модель и
перенесёте mutable-значение из module scope в state конкретного component instance.
