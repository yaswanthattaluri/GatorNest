import React from "react";
import { render, screen } from "@testing-library/react";
import AppFooter from "../src/pages/AppFooter"; // adjust the path if needed
import "@testing-library/jest-dom";

describe("AppFooter Component", () => {
    test("renders Contact Us section", () => {
        render(<AppFooter />);
      
        expect(screen.getByText("Contact Us")).toBeInTheDocument();
      
        // ✅ Use custom matcher functions to handle split elements
        expect(
          screen.getByText((_, el) => el?.textContent === "Phone: 1234567890")
        ).toBeInTheDocument();
      
        expect(
          screen.getByText((_, el) => el?.textContent === "Address: Florida")
        ).toBeInTheDocument();
      });        

  test("renders Office Hours section", () => {
    render(<AppFooter />);
    expect(screen.getByText("Office Hours")).toBeInTheDocument();
    expect(screen.getByText("Monday - Friday: 9 AM - 5 PM")).toBeInTheDocument();
    expect(screen.getByText("Saturday - Sunday: Closed")).toBeInTheDocument();
  });

  test("renders Staff Login button with correct link", () => {
    render(<AppFooter />);
    const loginLink = screen.getByRole("link", { name: /staff login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/stafflogin");
  });
});
