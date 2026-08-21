# 01-04. Batching и функциональный updater

Ожидаемое время: 40–50 минут.

## Результат сессии

Вы научитесь читать очередь state updates и выбирать между:

- setter со следующим значением;
- setter с updater function.

После упражнения вы сможете объяснить, почему три вызова setter не обязательно означают три последовательных изменения.

## Starter

~~~tsx
const [count, setCount] = useState(0);

function handleIncreaseByThree() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
~~~

При count равном 0 следующий UI показывает 1, а не 3.

## Что означает batching

React обычно ждёт завершения event handler, прежде чем обработать собранные state updates. Это позволяет не выполнять промежуточный render после каждой строки.

Batching не означает, что React игнорирует вызовы. В очередь попадают три запроса, но каждый из них уже вычислил одно и то же значение из snapshot:

~~~tsx
setCount(0 + 1);
setCount(0 + 1);
setCount(0 + 1);
~~~

Очередь можно мысленно записать так:

    replace with 1
    replace with 1
    replace with 1

Итог очереди — 1.

## Updater function

Setter также принимает функцию:

~~~tsx
setCount((previousCount) => previousCount + 1);
~~~

В этом случае вычисление откладывается. React последовательно передаёт результат предыдущего элемента очереди следующему updater.

Другой пример — увеличение количества товара на два:

~~~tsx
function handleAddPair() {
  setQuantity((previous) => previous + 1);
  setQuantity((previous) => previous + 1);
}
~~~

Если quantity была 4:

| Элемент очереди | Получил | Вернул |
|---|---:|---:|
| updater 1 | 4 | 5 |
| updater 2 | 5 | 6 |

Следующий render получает 6.

## Когда достаточно прямого значения

Прямой setter понятен, если новое значение не зависит от предыдущего:

~~~tsx
setIsOpen(true);
setSelectedId(nextId);
setStatus("success");
~~~

Для toggle или increment зависимость есть:

~~~tsx
setIsOpen((previous) => !previous);
setCount((previous) => previous + 1);
~~~

Правило не состоит в том, чтобы всегда использовать callback. Вопрос: нужно ли вычислению предыдущее queued state.

## Vue-сравнение

Во Vue:

~~~ts
count.value += 1;
count.value += 1;
count.value += 1;
~~~

Каждая следующая строка читает уже изменённое count.value. Vue также batch-ит обновление DOM, но сама реактивная ячейка синхронно содержит новое значение.

В React batch может содержать:

- готовое replacement value;
- updater function, которая будет вычислена по очереди.

Это одна из областей, где одинаковая внешняя оптимизация DOM скрывает разную модель данных.

## Чистота updater

Updater должен быть чистой функцией:

~~~tsx
setCount((previous) => previous + 1);
~~~

Не размещайте внутри:

- API request;
- запись в localStorage;
- изменение внешнего объекта;
- analytics event.

React может вызывать updater дополнительно в development-режиме, чтобы обнаружить нечистую логику. Updater должен только вычислять следующее state.

## Задание

Измените только handleIncreaseByThree:

- оставьте три отдельных setter-вызова;
- каждый запрос должен зависеть от предыдущего queued value;
- не заменяйте упражнение одним setCount(count + 3);
- не добавляйте timeout;
- не отключайте StrictMode.

Почему запрещён один count + 3: он дал бы правильный UI, но обошёл бы учебную цель — очередь updater functions.

Автоматическая проверка:

    pnpm session:check

Unit test проверяет два clicks: значения должны стать 3 и 6.

После зелёных тестов нужен отдельный Codex-review. Команда ниже только собирает
review-пакет и сама агента не запускает:

    pnpm session:review

Попросите Codex проверить не только результат, но и три updater functions без внешнего чтения count.
Записывайте PASS только после фактической проверки rubric:

    pnpm session:review --record PASS

Подсказка раскрывается отдельно:

    pnpm session:hint

## DONE

- первый click даёт 3;
- второй click даёт 6;
- handler содержит три updater functions;
- updater functions чистые;
- unit test зелёный;
- записан PASS review.

Завершение:

    pnpm session:finish
