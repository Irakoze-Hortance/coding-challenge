import { render, screen, fireEvent } from "@testing-library/react";

import Home from "@/app/page";

describe("Home", () => {
  it("Rendering ", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name:/BAG APP/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

test("running jest test", () => {
  render(<Home />);

  const input = screen.getByPlaceholderText("Add Todo") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "Test add" } });

  expect(input.value).toBe("Test add");
});

