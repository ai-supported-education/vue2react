# 01-05. Snapshot в асинхронном обработчике

Ожидаемое время: 40–50 минут.

## Результат сессии

Вы научитесь отличать:

- значение, сохранённое в closure конкретного render;
- latest value, намеренно читаемое через ref;
- корректный snapshot операции от настоящего stale-value bug.

## Closure до React

Поведение начинается не с hook, а с обычного JavaScript:

~~~ts
function createMessage(name: string) {
  return () => console.log("Hello, " + name);
}

const adaMessage = createMessage("Ada");
adaMessage(); // Hello, Ada
~~~

Функция сохраняет доступ к name из вызова createMessage, в котором была создана.

React component function тоже создаёт новые closures при каждом render:

~~~tsx
function Greeting({ name }: { name: string }) {
  function handleClick() {
    console.log(name);
  }

  return <button onClick={handleClick}>Log name</button>;
}
~~~

Render с name Ada создаёт один handleClick. Следующий render с name Grace создаёт другой handleClick. Старый handler не переписывается.

## Асинхронность не меняет snapshot

~~~tsx
function handleSubmit() {
  window.setTimeout(() => {
    sendMessage(recipient, message);
  }, 3000);
}
~~~

Callback timeout создан handler текущего render и замыкает recipient/message этого render.

Пусть последовательность такая:

1. Render 0: recipient Alice.
2. Пользователь нажал Send — создан timeout 0.
3. Пользователь выбрал Bob.
4. Render 1: recipient Bob.
5. Сработал timeout 0.

Timeout 0 использует Alice. Для отправки это обычно правильно: уже запланированная операция не должна самопроизвольно сменить адресата.

## Когда latest ref меняет контракт

Starter намеренно делает следующее:

~~~tsx
const latestRecipient = useRef<Recipient>("Alice");

function handleRecipientChange(nextRecipient: Recipient) {
  latestRecipient.current = nextRecipient;
  setRecipient(nextRecipient);
}

function handleSend() {
  window.setTimeout(() => {
    setStatus("Sent to " + latestRecipient.current);
  }, 500);
}
~~~

Ref — стабильный mutable object. Здесь он обновляется из пользовательского event
handler, а не во время render:

~~~ts
{
  current: ...
}
~~~

Каждый change event переписывает current. Когда timeout срабатывает, он читает не
snapshot операции, а самое последнее выбранное значение.

В последовательности Alice → Send → Bob результат становится Sent to Bob. Технически код получил latest value, но нарушил предметный контракт.

## Ref не плох и snapshot не всегда хорош

Представьте interval, который должен каждый раз использовать текущую громкость:

~~~tsx
const latestVolume = useRef(volume);

function handleVolumeChange(nextVolume: number) {
  latestVolume.current = nextVolume;
  setVolume(nextVolume);
}

useEffect(() => {
  const id = setInterval(() => {
    audioEngine.setVolume(latestVolume.current);
  }, 1000);

  return () => clearInterval(id);
}, []);
~~~

Здесь latest value может быть намеренным. Interval представляет один долгоживущий
внешний процесс, а ref обновляется в том же event, который меняет volume. Общие
способы синхронизации ref с props и внешними источниками относятся к следующим
разделам; запись в ref во время render не является предлагаемым shortcut.

Другой пример: search request. Обычно правильный путь — отменить или проигнорировать устаревший request, а не заставить его callback притвориться запросом нового query.

Выбор определяется семантикой операции:

| Вопрос | Snapshot | Latest ref |
|---|---|---|
| Нужно помнить параметры в момент запуска | да | нет |
| Долгоживущий callback должен читать текущую настройку | нет | возможно |
| Значение участвует в UI | state/props | ref не подходит |
| Изменение должно вызвать render | state | ref не подходит |

## Vue-сравнение

Vue ref является объектом со стабильной identity:

~~~ts
const recipient = ref("Alice");

setTimeout(() => {
  console.log(recipient.value);
}, 500);
~~~

Callback читает recipient.value в момент выполнения и получает latest value.

Чтобы сохранить snapshot во Vue, значение нужно скопировать перед созданием callback:

~~~ts
const recipientAtSend = recipient.value;

setTimeout(() => {
  console.log(recipientAtSend);
}, 500);
~~~

В React локальная recipient уже является значением render snapshot. Поэтому перенос привычки «прочитать ref позже» может незаметно поменять контракт.

## Задание

Starter воспроизводит:

1. Alice выбрана.
2. Нажат Send.
3. До timeout выбран Bob.
4. Status ошибочно становится Sent to Bob.

Исправьте App.tsx:

- запланированная операция должна сохранить Alice;
- select остаётся controlled;
- status остаётся state;
- timeout не читает latestRecipient.current;
- удалите ставший ненужным latestRecipient и его обновление из change handler;
- не добавляйте effect.

Допустимы два решения:

- локальная константа внутри handler;
- прямое замыкание recipient из render scope.

Автоматическая проверка:

    pnpm session:check

Test использует fake timers и два зеркальных сценария:

- Bob → Send → Alice должен завершиться как `Sent to Bob`;
- Alice → Send → Bob должен завершиться как `Sent to Alice`.

Поэтому hardcoded имя не проходит автоматическую проверку.

Codex-review — отдельный шаг. Команда ниже только собирает review-пакет и сама агента не запускает:

    pnpm session:review

Review отклонит решение с uncontrolled select, чтением DOM или другим обходом семантики snapshot. Попросите
Codex фактически проверить rubric и запишите PASS только после этого:

После PASS:

    pnpm session:review --record PASS
    pnpm session:finish

Подсказка:

    pnpm session:hint

## DONE

- status использует recipient, выбранный в момент Send, а не initial или latest
  hardcoded значение;
- последующие renders не меняют уже созданную операцию;
- нет effect и latest-ref чтения в timeout;
- test зелёный;
- Codex-review записан как PASS.
