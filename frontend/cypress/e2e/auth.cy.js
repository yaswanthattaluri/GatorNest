// cypress/e2e/auth.cy.js
/// <reference types="cypress" />

/* eslint-disable no-undef */

describe('Registration Tests', () => {
    // Test for Registration form display
    it('should display registration form with all required fields', () => {
      cy.visit('/registration');
      
      // Check form title
      cy.contains('Hostel Registration').should('be.visible');
      
      // Check all required fields are present
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="phone"]').should('be.visible');
      cy.get('input[name="dormPreference"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      
      // Check submit button
      cy.get('button[type="submit"]').should('be.visible').contains('Register');
    });
  
    // Test for student registration
    it('should register a new student successfully', () => {
      cy.visit('/registration');
      
      // Setup alert stub before visiting the page
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });
      
      // Generate unique email to avoid conflicts
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      // Intercept the API call
      cy.intercept('POST', 'http://localhost:8080/api/student/register', {
        statusCode: 200,
        body: {
          message: 'Registration successful',
          userId: 123
        }
      }).as('registerRequest');
      
      // Fill registration form
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="phone"]').type('1234567890');
      cy.get('input[name="dormPreference"]').type('1B1B');
      cy.get('input[name="password"]').type('Password123!');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Wait for the intercepted request
      cy.wait('@registerRequest').its('request.body').should('include', {
        name: 'Test User',
        email: uniqueEmail
      });
      
      // Verify alert was called with success message
      cy.get('@alertStub').should('be.calledWith', `Registration successful for Test User!`);
    });
  
    // Test for registration form validation
    it('should show validation errors for empty fields', () => {
      cy.visit('/registration');
      
      // Submit empty form
      cy.get('button[type="submit"]').click();
      
      // Check that form validation prevents submission
      cy.url().should('include', '/registration');
      
      // Check for HTML5 validation messages
      // This depends on how your form validation is implemented
      cy.get('input:invalid').should('exist');
    });
  });