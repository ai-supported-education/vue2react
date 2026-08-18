import { useState } from "react";

export default function BatchedCounter() {
  const [count, setCount] = useState(0);

  function handleIncreaseByThree() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <section className="stack">
      <output aria-label="Count">{count}</output>
      <button onClick={handleIncreaseByThree}>Increase by 3</button>
    </section>
  );
}
