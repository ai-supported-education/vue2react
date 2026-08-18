import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProfileEditor from "./App";

describe("ProfileEditor", () => {
  it("renders a new immutable profile snapshot for each update", async () => {
    const user = userEvent.setup();
    render(<ProfileEditor />);

    await user.click(screen.getByRole("button", { name: "Increase score" }));
    await user.click(screen.getByRole("button", { name: "Increase score" }));

    expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Score" })).toHaveTextContent("2");
  });
});
