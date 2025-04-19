/// <reference types="cypress" />

describe('Find Roommate Tests', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
    });

    cy.intercept('GET', 'http://localhost:8080/api/student/get-all', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Jane Doe",
          gender: "Female",
          sleep_schedule: "Early Bird",
          cleanliness: "Very Tidy",
          social_preference: "Private Space"
        },
        {
          id: 2,
          name: "John Smith",
          gender: "Male",
          sleep_schedule: "Night Owl",
          cleanliness: "Messy",
          social_preference: "Social Space"
        }
      ]
    }).as('getStudents');

    cy.visit('/findroommate');
  });

  it('should load profiles after fetch', () => {
    cy.wait('@getStudents');
    cy.contains('Jane Doe').should('exist');
    cy.contains('John Smith').should('exist');
  });

  it('should apply and clear filters correctly', () => {
    cy.wait('@getStudents');

    cy.get('select[name="gender"]').select('Female');
    cy.contains('Jane Doe').should('exist');
    cy.contains('John Smith').should('not.exist');

    cy.get('.clear-filters-btn').click();
    cy.contains('John Smith').should('exist');
  });

  it('should favorite and unfavorite a profile', () => {
    cy.wait('@getStudents');

    // Favorite
    cy.contains('Jane Doe')
      .parents('.profile-card')
      .find('.favorite-btn')
      .click()
      .should('have.text', '★');

    // Unfavorite
    cy.contains('Jane Doe')
      .parents('.profile-card')
      .find('.favorite-btn')
      .click()
      .should('have.text', '☆');
  });
});
