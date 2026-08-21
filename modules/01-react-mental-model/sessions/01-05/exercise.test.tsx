import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DelayedMessage from "./App";

describe("DelayedMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("keeps Bob when the selection changes to Alice after Send", () => {
    render(<DelayedMessage />);

    fireEvent.change(screen.getByRole("combobox", { name: "Recipient" }), {
      target: { value: "Bob" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Recipient" }), {
      target: { value: "Alice" }
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole("status", { name: "Status" })).toHaveTextContent(
      "Sent to Bob"
    );
  });

  it("keeps Alice when the selection changes to Bob after Send", () => {
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
