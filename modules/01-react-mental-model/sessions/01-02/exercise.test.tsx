import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Counter from "./App";

describe("Counter", () => {
  it("renders each requested state snapshot", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    const button = screen.getByRole("button", { name: "Count: 0" });

    await user.click(button);
    expect(button).toHaveAccessibleName("Count: 1");

    await user.click(button);
    expect(button).toHaveAccessibleName("Count: 2");
  });
});
