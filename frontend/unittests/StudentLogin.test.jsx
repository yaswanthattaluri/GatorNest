import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StudentLogin from "../src/pages/StudentLogin";

// ✅ Setup mocks
beforeEach(() => {
  global.alert = jest.fn();
  delete window.location;
  window.location = { href: "" };
});

describe("StudentLogin Component", () => {
  test("renders heading, inputs, and button", () => {
    render(
      <BrowserRouter>
        <StudentLogin />
      </BrowserRouter>
    );

    expect(screen.getByText("Student Login")).toBeInTheDocument();

    const emailInput = screen.getByRole("textbox"); // only one textbox (email)
    const passwordInput = document.querySelector('input[type="password"]');
    const button = screen.getByRole("button", { name: "Login" });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("updates input values", () => {
    render(
      <BrowserRouter>
        <StudentLogin />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("mypassword");
  });

  test("shows alert on successful login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "dummy-token" }),
      })
    );

    render(
      <BrowserRouter>
        <StudentLogin />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');
    const button = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "user@gator.edu" } });
    fireEvent.change(passwordInput, { target: { value: "securepass" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Login successful for user@gator.edu!");
      expect(window.location.href).toBe("/");
    });
  });

  test("shows alert on failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Invalid credentials"),
      })
    );

    render(
      <BrowserRouter>
        <StudentLogin />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');
    const button = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "wrong@gator.edu" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Login failed, please check your credentials and try again."
      );
    });
  });
});
