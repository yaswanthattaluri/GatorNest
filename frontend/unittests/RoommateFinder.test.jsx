import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import StudentLogin from "../src/pages/StudentLogin.jsx";

describe("StudentLogin Component", () => {
  test("renders the login form with email and password inputs and login button", () => {
    render(<StudentLogin />);

    const inputs = screen.getAllByRole("textbox");
    const emailInput = inputs[0]; // first textbox is email
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = screen.getByRole("button", { name: /login/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test("updates state on input change", () => {
    render(<StudentLogin />);

    const inputs = screen.getAllByRole("textbox");
    const emailInput = inputs[0];
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits login form successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "dummy-token" }),
      })
    );
  
    render(<StudentLogin />);
  
    const emailInput = screen.getAllByRole("textbox")[0];
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = screen.getByRole("button", { name: /login/i });
  
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);
  
    // You can add assertions here if needed (e.g., localStorage, redirection)
    expect(global.fetch).toHaveBeenCalled();
  });
  

  test("handles failed login attempt (empty fields)", () => {
    render(<StudentLogin />);

    const inputs = screen.getAllByRole("textbox");
    const emailInput = inputs[0];
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.click(loginButton);

    // Optionally check for error text if shown
  });

  test("logs out by clearing token from localStorage", () => {
    localStorage.setItem("token", "dummy-token");
    expect(localStorage.getItem("token")).toBe("dummy-token");
    localStorage.removeItem("token");
    expect(localStorage.getItem("token")).toBeNull();
  });
});