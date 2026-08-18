import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import BatchedCounter from "./App";

describe("BatchedCounter", () => {
  it("queues three updates based on the previous queued value", async () => {
    const user = userEvent.setup();
    render(<BatchedCounter />);
    const count = screen.getByRole("status", { name: "Count" });

    await user.click(screen.getByRole("button", { name: "Increase by 3" }));
    expect(count).toHaveTextContent("3");

    await user.click(screen.getByRole("button", { name: "Increase by 3" }));
    expect(count).toHaveTextContent("6");
  });
});
