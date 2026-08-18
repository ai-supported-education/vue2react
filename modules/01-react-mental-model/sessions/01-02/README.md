# 01-02. Изменение state как сигнал

Ожидаемое время: 35–45 минут.

## Результат сессии

Вы исправите первый React-компонент и сможете объяснить:

- почему module-level переменная не является состоянием компонента;
- что возвращает useState;
- почему setter приводит к новому render;
- почему обработчик передаётся в JSX, а не вызывается во время render.

## Starter и наблюдаемая ошибка

Откройте App.tsx:

~~~tsx
let count = 0;

export default function Counter() {
  function handleIncrement() {
    count += 1;
  }

  return <button onClick={handleIncrement}>Count: {count}</button>;
}
~~~

После click значение JavaScript-переменной действительно меняется. Однако button продолжает показывать Count: 0.

Причина не в том, что React запрещает мутации. React просто не получил сигнал выполнить Counter ещё раз.

Текущий поток:

    первый render читает count = 0
       ↓
    JSX содержит Count: 0
       ↓
    click меняет count на 1
       ↓
    нового render нет
       ↓
    DOM остаётся прежним

Если какой-нибудь другой повод позже заставит Counter отрендериться, он прочитает module-level count и внезапно покажет накопленное значение. Такое поведение особенно неприятно: ошибка может временно казаться рабочей.

## Почему module-level state опасен

Переменная за пределами компонента:

- общая для всех экземпляров Counter;
- не сбрасывается при unmount нового экземпляра ожидаемым способом;
- не сообщает React об изменениях;
- усложняет server rendering и изоляцию тестов.

Если на странице отрендерить два Counter, оба будут менять одну переменную, но ни один не знает, когда нужно обновить собственный UI.

## useState как память React

Минимальная форма:

~~~tsx
const [value, setValue] = useState(initialValue);
~~~

useState возвращает два разных по роли значения:

1. value — snapshot state для текущего render;
2. setValue — стабильная функция, через которую запрашивается следующее значение.

Пример с текстом:

~~~tsx
import { useState } from "react";

function Greeting() {
  const [name, setName] = useState("Ada");

  function handleRename() {
    setName("Grace");
  }

  return <button onClick={handleRename}>Hello, {name}</button>;
}
~~~

Первый render получает name Ada. После click setter ставит Grace в очередь, React снова вызывает Greeting, а следующий render получает name Grace.

## Почему нельзя присвоить value напрямую

Такой код не компилируется и концептуально неверен:

~~~tsx
const [count] = useState(0);
count += 1;
~~~

count — локальная const-переменная snapshot. Даже если бы присваивание было разрешено, оно не меняло бы состояние, которое React хранит между рендерами.

## Handler в JSX

Правильно:

~~~tsx
<button onClick={handleIncrement}>Increment</button>
~~~

JSX получает функцию и сможет вызвать её позже, когда произойдёт click.

Другая семантика:

~~~tsx
<button onClick={handleIncrement()}>Increment</button>
~~~

Здесь функция вызывается немедленно во время render, а результат вызова пытается стать handler. Если функция вызывает setter, можно получить цикл renders.

Inline handler тоже допустим:

~~~tsx
<button onClick={() => setCount(count + 1)}>Increment</button>
~~~

В этой карточке именованная функция удобнее для чтения, но отдельный handler не является обязательным правилом React.

## Сравнение с Vue

Vue Composition API:

~~~vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value += 1;
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>
~~~

Vue связывает template с зависимостью count и отслеживает запись в count.value.

React:

~~~tsx
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
}

return <button onClick={increment}>Count: {count}</button>;
~~~

React не отслеживает чтение count внутри JSX. Setter сообщает, что нужно получить новый JSX snapshot.

## Задание

Измените только App.tsx:

- уберите module-level mutable state;
- добавьте React state внутри Counter;
- запросите следующее значение из handleIncrement;
- сохраните текущий button contract.

Не используйте:

- document.querySelector;
- изменение textContent;
- force update;
- дополнительный effect;
- mutable переменную за пределами Counter.

Интерактивный запуск:

    pnpm session:dev

Автоматическая проверка:

    pnpm session:check

Для этой карточки check выполняет:

1. TypeScript typecheck.
2. Vitest + Testing Library: два последовательных clicks должны показать Count: 1 и Count: 2.

Агент в этой сессии не нужен: архитектурная развилка слишком мала, поэтому в manifest нет review.

Если нужен следующий уровень помощи:

    pnpm session:hint

## DONE

- после первого click button показывает Count: 1;
- после второго — Count: 2;
- нет module-level mutable state;
- typecheck и unit test зелёные.

После этого:

    pnpm session:finish
