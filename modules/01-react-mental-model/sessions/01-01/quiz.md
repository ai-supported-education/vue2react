# Quiz: render snapshot

В каждом вопросе сначала прочитайте код как обычный JavaScript. Затем отметьте,
из какого render взято каждое значение. Запишите букву выбранного ответа в
`answers.json`, а в `reasons` объясните выбор через snapshot или identity.

Не запускайте фрагменты до прогноза: цель — научиться выполнять эту подстановку
в голове.

## q1. Setter и текущий handler

~~~tsx
function ScoreButton() {
  const [score, setScore] = useState(7);

  function handleIncrease() {
    setScore(score + 5);
    console.log("inside handler:", score);
  }

  return <button onClick={handleIncrease}>Score: {score}</button>;
}
~~~

Пользователь нажимает кнопку один раз. Что выведет `console.log` внутри
`handleIncrease`?

- A. `7`
- B. `12`
- C. Зависит от скорости render

В reason назовите render, которому принадлежит `score` в этой функции.

## q2. Два одинаковых запроса обновления

~~~tsx
function TemperatureButton() {
  const [temperature, setTemperature] = useState(10);

  function handleWarmUp() {
    setTemperature(temperature + 2);
    setTemperature(temperature + 2);
  }

  return (
    <button onClick={handleWarmUp}>
      Temperature: {temperature}
    </button>
  );
}
~~~

После одного click что покажет button в следующем render?

- A. `10`
- B. `12`
- C. `14`

В reason подставьте исходное `temperature` в оба вызова setter.

## q3. Callback, уже переданный в timeout

~~~tsx
function DraftDemo() {
  const [draftVersion, setDraftVersion] = useState(3);

  function logVersionLater() {
    window.setTimeout(() => {
      console.log("draft version:", draftVersion);
    }, 1_000);
  }

  return (
    <>
      <button onClick={logVersionLater}>Log version in 1 second</button>
      <button onClick={() => setDraftVersion(4)}>Update to version 4</button>
      <output>Version: {draftVersion}</output>
    </>
  );
}
~~~

Порядок действий такой:

1. Пользователь нажимает `Log version in 1 second`, пока отображается version 3.
2. До истечения секунды нажимает `Update to version 4`.
3. UI уже показывает `Version: 4`.

Какую version напечатает callback из timeout?

- A. `3`
- B. `4`
- C. `undefined`

В reason объясните, в каком render был создан callback.

## q4. Мутация без сигнала React

~~~tsx
function ProfileScore() {
  const [profile] = useState({ name: "Ada", score: 0 });

  function handleIncrease() {
    profile.score += 1;
  }

  return (
    <>
      <output>Score: {profile.score}</output>
      <button onClick={handleIncrease}>Increase score</button>
    </>
  );
}
~~~

После click `profile.score` в объекте изменился. Что этот код сам по себе
сделает с уже показанным UI?

- A. React сразу выполнит новый render
- B. React обновит только `<output>`
- C. Новый render не был запрошен

В reason отделите JavaScript-мутацию от сигнала, который понимает React.

## q5. Та же ссылка передана setter

~~~tsx
function ProfileScore() {
  const [profile, setProfile] = useState({ name: "Ada", score: 0 });

  function handleIncrease() {
    profile.score += 1;
    setProfile(profile);
  }

  return (
    <>
      <output>Score: {profile.score}</output>
      <button onClick={handleIncrease}>Increase score</button>
    </>
  );
}
~~~

Как React сравнит значение, переданное в `setProfile`, с предыдущим state?

- A. Глубоко сравнит каждое поле объекта
- B. Сравнит ссылки через `Object.is` и может пропустить render
- C. Всегда выполнит render после setter

В reason укажите, является ли `profile` после мутации новым объектом.
