/// <reference types="cypress" />

describe("Student Payments Tests", () => {
    beforeEach(() => {
      // Mock the authentication token
      localStorage.setItem("token", "test-token");
      
      // Visit the payments page
      cy.visit("/payments");
      cy.get("body").should("be.visible");
    });
  
    it("should display the correct page title and balance", () => {
      cy.contains("Student Payments").should("be.visible");
      cy.contains("Current Balance").should("be.visible");
      cy.get(".balance-amount").should("contain", "$1250.00");
    });
  
    it("should show the payment form when 'Pay Now' button is clicked", () => {
      cy.contains("Pay Now").click();
      cy.contains("Make a Payment").should("be.visible");
      cy.get('input[name="cardName"]').should("be.visible");
      cy.get('input[name="cardNumber"]').should("be.visible");
      cy.get('input[name="expiryDate"]').should("be.visible");
      cy.get('input[name="cvv"]').should("be.visible");
    });
  
  
    it("should validate card number format correctly", () => {
      cy.contains("Pay Now").click();
  
      // Fill out form with invalid card number
      cy.get('input[name="cardName"]').type("Test User");
      cy.get('input[name="cardNumber"]').type("12345"); // Too short
      cy.get('input[name="expiryDate"]').type("12/25");
      cy.get('input[name="cvv"]').type("123");
      
      cy.contains("Pay $1250").click();
      
      // Check for error notification about invalid card number with timeout
      // Be more flexible with the error message selector
      cy.contains("valid card number", { timeout: 10000 }).should("be.visible");
    });
  
    it("should format card inputs correctly while typing", () => {
      cy.contains("Pay Now").click();
      
      // Test card number formatting
      cy.get('input[name="cardNumber"]').type("4111111111111111");
      cy.get('input[name="cardNumber"]').should("have.value", "4111 1111 1111 1111");
      
      // Test expiry date formatting
      cy.get('input[name="expiryDate"]').type("1225");
      cy.get('input[name="expiryDate"]').should("have.value", "12/25");
    });
  
    it("should display payment history table with correct entries", () => {
      cy.contains("Payment History").should("be.visible");
      cy.get('.payment-history-table').should("be.visible");
      
      // Check for table headers
      cy.get('.payment-history-table th').eq(0).should("contain", "Date");
      cy.get('.payment-history-table th').eq(1).should("contain", "Amount");
      cy.get('.payment-history-table th').eq(2).should("contain", "Status");
      
      // Check for at least one payment record
      cy.get('.payment-history-table td').contains("$1250.00").should("exist");
      cy.get('.payment-history-table td').contains("Completed").should("exist");
    });
  
    it("should process successful payment and update balance", () => {
      cy.contains("Pay Now").click();
      
      // Fill out valid payment information
      cy.get('input[name="cardName"]').type("Test User");
      cy.get('input[name="cardNumber"]').type("4111111111111111");
      cy.get('input[name="expiryDate"]').type("1225");
      cy.get('input[name="cvv"]').type("123");
      
      // Submit payment
      cy.contains("Pay $1250").click();
      
      // Verify successful payment notification with timeout
      cy.get('.notification.success', { timeout: 10000 }).should("be.visible");
      cy.get('.notification.success').should("contain", "Payment");
      cy.get('.notification.success').should("contain", "successful");
      
      // Verify balance is updated
      cy.get(".balance-amount").should("contain", "$0.00");
      
      // Verify new entry in payment history
      cy.get('.payment-history-table tr').should("have.length.at.least", 3);
    });
  
    it("should cancel payment form when Cancel button is clicked", () => {
      cy.contains("Pay Now").click();
      cy.contains("Make a Payment").should("be.visible");
      
      cy.contains("Cancel").click();
      
      // Form should disappear
      cy.contains("Make a Payment").should("not.exist");
    });
  });