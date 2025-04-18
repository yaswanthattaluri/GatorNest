import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminMaintenancePanel from "../src/pages/ViewMaintenanceRequests"; // adjust if path differs
import "@testing-library/jest-dom";

// Sample mock data
const mockRequests = [
  {
    id: 1,
    room_number: "A101",
    name: "John Doe",
    priority: "High",
    category: "Electrical",
    sub_category: "Outlet",
    permission_to_enter: "Yes",
    description: "Broken socket",
    technician_notes: "",
    status: "New",
    completed: "-"
  }
];

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options?.method === "PUT") {
      // PUT update request mock
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            ...mockRequests[0],
            technician_notes: "Replaced fuse",
            status: "Resolved",
            completed: "Today"
          })
      });
    }

    // Initial GET request
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockRequests)
    });
  });
});

describe("AdminMaintenancePanel", () => {
  test("renders loading state initially", async () => {
    render(<AdminMaintenancePanel />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await screen.findByText("John Doe");
  });

  test("renders fetched maintenance request", async () => {
    render(<AdminMaintenancePanel />);
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Broken socket")).toBeInTheDocument();
  });

  test("filters requests by status", async () => {
    render(<AdminMaintenancePanel />);
    await screen.findByText("John Doe");

    fireEvent.click(screen.getByText("Resolved Requests"));
    expect(
      screen.getByText(/no resolved requests found/i)
    ).toBeInTheDocument();
  });

  test("allows technician note editing", async () => {
    render(<AdminMaintenancePanel />);
    await screen.findByText("John Doe");

    const editBtn = screen.getAllByRole("button").find((btn) =>
      btn.className.includes("icon-button")
    );
    fireEvent.click(editBtn);

    const input = screen.getByDisplayValue("");
    fireEvent.change(input, { target: { value: "Replaced fuse" } });
    fireEvent.blur(input);

    expect(screen.queryByDisplayValue("Replaced fuse")).not.toBeInTheDocument();
  });

  test("handles save success and updates state", async () => {
    render(<AdminMaintenancePanel />);
    await screen.findByText("John Doe");

    // Update dropdown
    fireEvent.change(screen.getByDisplayValue("New"), {
      target: { value: "Resolved" }
    });

    // Get and click the actual button (not the <th>)
    const saveButtons = screen.getAllByText("Save");
    fireEvent.click(saveButtons.find((btn) => btn.tagName === "BUTTON"));

    // Expect "Saved!" message
    await waitFor(() =>
      expect(screen.getByText("Saved!")).toBeInTheDocument()
    );
  });

  test("displays error on failed save", async () => {
    // First fetch returns data
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRequests)
        })
      )
      // Second fetch (PUT) fails
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false
        })
      );

    render(<AdminMaintenancePanel />);
    await screen.findByText("John Doe");

    const saveButtons = screen.getAllByText("Save");
    fireEvent.click(saveButtons.find((btn) => btn.tagName === "BUTTON"));

    await waitFor(() =>
      expect(
        screen.getByText(/error saving\. please try again\./i)
      ).toBeInTheDocument()
    );
  });
});
