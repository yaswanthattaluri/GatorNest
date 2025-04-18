import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FloatingWidget from "../src/pages/FloatingWidget"; // Update path if needed
import '@testing-library/jest-dom';


// ✅ Mock the icon with a test ID
jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  MessageCircle: (props) => <svg data-testid="message-icon" {...props} />,
}));

describe("FloatingWidget Component", () => {
  test("renders the floating icon button", () => {
    render(<FloatingWidget />);
    const icon = screen.getByTestId("message-icon");
    expect(icon).toBeInTheDocument();
  });

  test("does not show email and call links initially", () => {
    render(<FloatingWidget />);
    expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Call/i)).not.toBeInTheDocument();
  });

  test("shows email and call links on first click", () => {
    render(<FloatingWidget />);
    const toggleDiv = screen.getByTestId("message-icon").parentElement;
    fireEvent.click(toggleDiv);

    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Call/i)).toBeInTheDocument();
  });

  test("toggles widget closed on second click", () => {
    render(<FloatingWidget />);
    const toggleDiv = screen.getByTestId("message-icon").parentElement;

    fireEvent.click(toggleDiv); // open
    expect(screen.getByText(/Email/i)).toBeInTheDocument();

    fireEvent.click(toggleDiv); // close
    expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
  });

  test("contains correct mailto and tel links", () => {
    render(<FloatingWidget />);
    const toggleDiv = screen.getByTestId("message-icon").parentElement;
    fireEvent.click(toggleDiv);

    const emailLink = screen.getByText(/Email/i).closest("a");
    const phoneLink = screen.getByText(/Call/i).closest("a");

    expect(emailLink).toHaveAttribute("href", "mailto:gatorsnestfl@gmail.com");
    expect(phoneLink).toHaveAttribute("href", "tel:+1234567890");
  });
});
