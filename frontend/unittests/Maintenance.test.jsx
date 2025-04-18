import React from "react";
import Maintenance from "../src/pages/Maintenance";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";


// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

global.alert = jest.fn();

describe("Maintenance Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  test("renders submit form by default", async () => {
    await act(async () => {
      render(<Maintenance />);
    });
    expect(screen.getByText("Submit a Maintenance Request")).toBeInTheDocument();
  });

  test("renders request history when button is clicked", async () => {
    render(<Maintenance />);
    fireEvent.click(screen.getByText("Request History"));
    expect(await screen.findByText("Maintenance Request History")).toBeInTheDocument();
  });

  test("fills and submits form correctly", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 101, name: "John" }),
      })
    );

    await act(async () => {
      render(<Maintenance />);
    });
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "John Doe" } });
    fireEvent.change(inputs[1], { target: { value: "A101" } });
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "High" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "Plumbing" } });

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "Leak" } });
    });

    fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "Yes" } });
    fireEvent.change(inputs[2], { target: { value: "Water leakage under sink." } });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test("disables subcategory until category is selected", () => {
    render(<Maintenance />);
    expect(screen.getAllByRole("combobox")[2]).toBeDisabled();
  });

  test("enables subcategory when category is selected", () => {
    render(<Maintenance />);
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "Plumbing" } });
    expect(screen.getAllByRole("combobox")[2]).not.toBeDisabled();
  });

  test("form resets after successful submission", async () => {
    fetch
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }))
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 1 }) })
      );

    await act(async () => {
      render(<Maintenance />);
    });

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "John" } });
    fireEvent.change(inputs[1], { target: { value: "B202" } });
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "Low" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "Electrical" } });

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "Lighting" } });
    });

    fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "No" } });
    fireEvent.change(inputs[2], { target: { value: "Light not working" } });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(inputs[0].value).toBe("");
    });
  });

  test("shows alert on submission failure", async () => {
    fetch
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }))
      .mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<Maintenance />);
    });

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Fail Case" } });
    fireEvent.change(inputs[1], { target: { value: "C303" } });
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "High" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "Plumbing" } });

    await waitFor(() => {
      fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "Clog" } });
    });

    fireEvent.change(screen.getAllByRole("combobox")[3], { target: { value: "Yes" } });
    fireEvent.change(inputs[2], { target: { value: "Clogged sink" } });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Submission failed. Please check your backend or try again.");
    });
  });

  test("renders correct number of category options", () => {
    render(<Maintenance />);
    const categorySelect = screen.getAllByRole("combobox")[1];
    const options = categorySelect.querySelectorAll("option");
    expect(options.length).toBe(4);
  });
});