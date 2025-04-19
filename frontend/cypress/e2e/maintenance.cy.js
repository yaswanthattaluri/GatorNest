/// <reference types="cypress" />

describe("Maintenance Request Flow", () => {
  beforeEach(() => {
    cy.clearLocalStorage(); // Reset state
    cy.visit("/"); // Start at home page
  });

  it("logs in and navigates to maintenance request form", () => {
    // Step 1: Go to Student Login page
    cy.contains("Student Login").click();

    // Step 2: Fill login form + intercept login API
    cy.intercept("POST", "http://localhost:8080/api/student/login", {
      statusCode: 200,
      body: {
        message: "Login successful",
        token: "test-token-123",
        userId: 101,
      },
    }).as("studentLogin");

    // Fill login fields
    cy.get("input[name='email']").type("test@student.com");
    cy.get("input[name='password']").type("password123");

    // Stub alert before submitting
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });

    // Submit login
    cy.get("button[type='submit']").click();

    // Step 3: Wait for login API and redirect to home
    cy.wait("@studentLogin");
    cy.url().should("eq", "http://localhost:5173/");

    // Check localStorage token
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.eq("test-token-123");
    });

    // Confirm login alert shown
    cy.get("@alertStub").should("have.been.calledWith", "Login successful for test@student.com!");

    // Step 4: Navigate to Maintenance Request page
    cy.contains("Maintenance Request").click();

    // Step 5: Ensure form loads
    cy.contains("Submit a Maintenance Request").should("exist");

    // Step 6: Fill and submit the form
    cy.intercept("POST", "http://localhost:8080/api/maintenance-requests").as("submitRequest");

    cy.get("input[name='name']").type("Alice");
    cy.get("input[name='roomNumber']").type("B205");
    cy.get("select[name='priority']").select("High");
    cy.get("select[name='category']").select("Plumbing");
    cy.get("select[name='subCategory']").select("Leak");
    cy.get("select[name='permissionToEnter']").select("Yes");
    cy.get("textarea[name='description']").type("Water leaking from ceiling.");

    cy.get("button[type='submit']").click();

    // Step 7: Validate form submission
    cy.wait("@submitRequest").its("request.body").should((body) => {
      expect(body).to.include({
        name: "Alice",
        room_number: "B205",
        category: "Plumbing",
        sub_category: "Leak",
        priority: "High",
        permission_to_enter: "Yes",
        description: "Water leaking from ceiling.",
      });
    });

    // Confirm success alert
    cy.on("window:alert", (msg) => {
      expect(msg).to.eq("Request submitted successfully.");
    });
  });
});
