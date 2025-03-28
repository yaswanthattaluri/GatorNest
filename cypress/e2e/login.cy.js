// cypress/e2e/login.cy.js
/// <reference types="cypress" />

/* eslint-disable no-undef */

describe('Student Login Tests', () => {
    // Test for student login form display
    it('should display student login form with required fields', () => {
      cy.visit('/studentlogin');
      
      // Check form title
      cy.contains('Student Login').should('be.visible');
      
      // Check input fields
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      
      // Check login button
      cy.get('button[type="submit"]').should('be.visible').contains('Login');
    });
    
    // Test for student login functionality
    it('should login student with valid credentials', () => {
      // Visit first, then stub the alert in the page context
      cy.visit('/studentlogin');
      
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });
      
      // Intercept the login API call
      cy.intercept('POST', 'http://localhost:8080/api/student/login', {
        statusCode: 200,
        body: {
          message: 'Login successful',
          token: 'fake-jwt-token',
          userId: 123
        }
      }).as('loginRequest');
      
      // Fill login form
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Wait for the intercepted request
      cy.wait('@loginRequest').its('request.body').should('deep.equal', {
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Check if token is stored in localStorage
      cy.window().then((win) => {
        // Use chai should syntax to avoid eslint errors
        cy.wrap(win.localStorage.getItem('token')).should('eq', 'fake-jwt-token');
      });
      
      // Verify the alert was called with the expected message
      cy.get('@alertStub').should('be.called');
    });
    
    // Test for failed login attempt
    it('should show error when login fails', () => {
      // Visit first, then stub the alert in the page context
      cy.visit('/studentlogin');
      
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });
      
      // Intercept the login API call to simulate a failure
      cy.intercept('POST', 'http://localhost:8080/api/student/login', {
        statusCode: 401,
        body: 'Invalid credentials'
      }).as('failedLoginRequest');
      
      // Fill login form with invalid credentials
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Wait for the intercepted request
      cy.wait('@failedLoginRequest');
      
      // Check for alert with error message
      cy.get('@alertStub').should('be.called');
    });
    
    // Test for remembering login credentials
    it('should remember email if "Remember me" is checked', () => {
      cy.visit('/studentlogin');
      
      // If your form has a remember me checkbox
      // cy.get('input[type="checkbox"]').check();
      
      // Fill form
      cy.get('input[name="email"]').type('remember@example.com');
      cy.get('input[name="password"]').type('password123');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Revisit login page
      cy.visit('/studentlogin');
      
      // Email should be pre-filled
      // cy.get('input[name="email"]').should('have.value', 'remember@example.com');
    });
  });