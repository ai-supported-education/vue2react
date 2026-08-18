import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DelayedMessage from "./App";

describe("DelayedMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the recipient snapshot captured by the send action", () => {
    render(<DelayedMessage />);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Recipient" }), {
      target: { value: "Bob" }
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole("status", { name: "Status" })).toHaveTextContent(
      "Sent to Alice"
    );
  });
});
