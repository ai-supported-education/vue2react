import { useState } from "react";

type Recipient = "Alice" | "Bob";

export default function DelayedMessage() {
  const [recipient, setRecipient] = useState<Recipient>("Alice");
  const [status, setStatus] = useState("Idle");

  function handleSend() {
    setStatus("Sending");
    window.setTimeout(() => {
      setStatus("Sent to " + recipient);
    }, 500);
  }

  return (
    <section className="stack">
      <label>
        Recipient
        <select
          value={recipient}
          onChange={(event) => setRecipient(event.target.value as Recipient)}
        >
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <button onClick={handleSend}>Send</button>
      <output aria-label="Status">{status}</output>
    </section>
  );
}
