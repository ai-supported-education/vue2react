import { useRef, useState } from "react";

type Recipient = "Alice" | "Bob";

export default function DelayedMessage() {
  const [recipient, setRecipient] = useState<Recipient>("Alice");
  const [status, setStatus] = useState("Idle");
  const latestRecipient = useRef<Recipient>("Alice");

  function handleSend() {
    setStatus("Sending");
    window.setTimeout(() => {
      setStatus("Sent to " + latestRecipient.current);
    }, 500);
  }

  return (
    <section className="stack">
      <label>
        Recipient
        <select
          value={recipient}
          onChange={(event) => {
            const nextRecipient = event.target.value as Recipient;
            latestRecipient.current = nextRecipient;
            setRecipient(nextRecipient);
          }}
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
