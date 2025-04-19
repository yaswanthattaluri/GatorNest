/// <reference types="cypress" />

describe('Student Profile Page Tests', () => {
  beforeEach(() => {
    // Simulate login by setting localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('userId', '123');
    });

    cy.visit('/profile');
  });

  it('should load and display profile form', () => {
    cy.contains('Student Profile & Preferences').should('be.visible');

    cy.get('form').within(() => {
      cy.get('input[name="name"]').should('exist');
      cy.get('select[name="gender"]').should('exist');
      cy.get('input[name="age"]').should('exist');
      cy.get('input[name="major"]').should('exist');
      cy.get('input[name="language"]').should('exist');
      cy.get('input[name="contact"]').should('exist');
      cy.get('select[name="earlyBird"]').should('exist');
      cy.get('select[name="cleanliness"]').should('exist');
      cy.get('select[name="diet"]').should('exist');
      cy.get('select[name="visitors"]').should('exist');
      cy.get('select[name="sameLanguage"]').should('exist');
    });
  });

  it('should submit profile form successfully', () => {
    // Intercept the PUT request made on form submission
    cy.intercept('PUT', 'http://localhost:8080/api/student/profile', {
      statusCode: 200,
      body: { message: 'Profile updated successfully' },
    }).as('updateProfile');

    // Stub the alert popup
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('form').within(() => {
      cy.get('input[name="name"]').type('Alice');
      cy.get('select[name="gender"]').select('Female');
      cy.get('input[name="age"]').type('21');
      cy.get('input[name="major"]').type('Biology');
      cy.get('input[name="language"]').type('English');
      cy.get('input[name="contact"]').type('123-456-7890');

      cy.get('select[name="earlyBird"]').select('Early Bird');
      cy.get('select[name="cleanliness"]').select('Very Tidy');
      cy.get('select[name="diet"]').select('Vegetarian');
      cy.get('select[name="visitors"]').select('Occasionally');
      cy.get('select[name="sameLanguage"]').select("Yes");

      cy.get('button[type="submit"]').click();
    });

    // Confirm request happened
    cy.wait('@updateProfile');

    // Confirm alert showed correct message
    cy.get('@alertStub').should('have.been.calledWith', 'Profile preferences saved successfully!');
  });
});
