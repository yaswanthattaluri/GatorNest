import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StaffLogin from "../src/pages/StaffLogin";

// ✅ Mock navigation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("StaffLogin", () => {
  test("renders heading and form inputs", () => {
    render(
      <BrowserRouter>
        <StaffLogin />
      </BrowserRouter>
    );

    expect(screen.getByText("Admin Login")).toBeTruthy();
    expect(screen.getByRole("textbox")).toBeTruthy(); // Username input
    expect(screen.getByRole("button", { name: "Login" })).toBeTruthy();
  });

  test("calls fetch on form submit with values", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      })
    );

    render(
      <BrowserRouter>
        <StaffLogin />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const usernameInput = inputs[0];
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(usernameInput, {
      target: { value: "admin@test.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // ✅ Simple, exact match for error message
    await screen.findByText("Invalid credentials");
  });
});
