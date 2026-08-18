let count = 0;

export default function Counter() {
  function handleIncrement() {
    count += 1;
  }

  return <button onClick={handleIncrement}>Count: {count}</button>;
}
