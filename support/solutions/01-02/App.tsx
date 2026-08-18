import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    setCount((previous) => previous + 1);
  }

  return <button onClick={handleIncrement}>Count: {count}</button>;
}
