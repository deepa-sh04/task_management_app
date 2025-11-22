import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Tax Management heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Tax Management/i);
  expect(headingElement).toBeInTheDocument();
});
