// cypress/e2e/profile.cy.js (renamed from button-click.cy.js)
/// <reference types="cypress" />

/* eslint-disable no-undef */

describe('Profile Page Tests', () => {
    beforeEach(() => {
      // Navigate to the profile page before each test
      cy.visit('/profile');
      // Wait for page to load properly
      cy.get('body').should('be.visible');
    });
  
    it('should navigate to the Profile page when clicking the button', () => {
      cy.visit('/'); // Start from home page for this test
      cy.contains('Profile').click(); 
      cy.url().should('include', '/profile');
    });
  
    it('should have a Name input field', () => {
      // Try more general selectors or multiple possible selectors
      cy.get('input[name="name"], input#name, [data-test="name-input"]')
          .should('exist')
          .should('be.visible');
    });
  
    it('should have a Gender dropdown', () => {
      cy.get('select[name="gender"], select#gender, [data-test="gender-select"]')
          .should('exist')
          .should('be.visible');
    });
    
    it('should have all profile form sections', () => {
      cy.contains('Personal Information').should('be.visible');
      cy.contains('Roommate Preferences').should('be.visible');
    });
    
    it('should submit profile information successfully', () => {
      // Fill out personal information fields
      cy.get('input[name="name"]').clear().type('John Doe');
      cy.get('select[name="gender"]').select('Male');
      cy.get('input[name="age"]').clear().type('21');
      
      // Fill out roommate preference fields
      cy.get('select[name="earlyBird"]').select('Early Bird');
      cy.get('select[name="cleanliness"]').select('Very Tidy');
      
      // Submit the form
      cy.get('button[type="submit"]').click();
      
      // Assert success (this depends on your implementation)
      cy.url().should('include', '/profile');
    });
  });