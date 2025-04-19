/// <reference types="cypress" />

describe('Student Registration Page', () => {
  beforeEach(() => {
    cy.visit('/registration'); // Adjust if route is different
  });

  it('should display the registration form with all fields', () => {
    cy.contains('🏡 Hostel Registration').should('be.visible');

    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="phone"]').should('exist');
    cy.get('input[name="dormPreference"]').should('exist');
    cy.get('input[name="password"]').should('exist');

    cy.get('button[type="submit"]').should('contain', 'Register');
  });

  it('should submit the form and show success alert', () => {
    cy.intercept('POST', 'http://localhost:8080/api/student/register', {
      statusCode: 200,
      body: { message: 'Registration successful' },
    }).as('registerStudent');

    // Stub window.alert
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    // Fill the form
    cy.get('input[name="name"]').type('Test Student');
    cy.get('input[name="email"]').type('test@student.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('input[name="dormPreference"]').type('2B2B');
    cy.get('input[name="password"]').type('securepassword');

    // Submit
    cy.get('button[type="submit"]').click();

    // Wait for request and assert
    cy.wait('@registerStudent').its('request.body').should((body) => {
      expect(body).to.include({
        name: 'Test Student',
        email: 'test@student.com',
        phone: '1234567890',
        dorm_preference: '2B2B',
        password: 'securepassword',
      });
    });

    cy.get('@alertStub').should('have.been.calledWith', 'Registration successful for Test Student!');
  });
});
