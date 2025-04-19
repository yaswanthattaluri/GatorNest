/// <reference types="cypress" />

describe('Admin Maintenance Request Flow', () => {
  beforeEach(() => {
    // Clear all tokens before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('logs in as staff and views maintenance requests', () => {
    // Step 1: Go to Staff Login
    cy.contains('Staff Login').click();

    // Step 2: Intercept login and fill form
    cy.intercept('POST', 'http://localhost:8080/api/admin/login', {
      statusCode: 200,
      body: { token: 'staff-mock-token' },
    }).as('staffLogin');

    // Fill login form
    cy.get('input[name="username"]').type('admin@gatornest.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Wait for login and redirect to /staffhome
    cy.wait('@staffLogin');
    cy.url().should('include', '/staffhome');

    // Step 3: Navigate to maintenance inbox
    cy.contains('View Maintenance Requests').click();
    cy.url().should('include', '/maintenanceinbox');

    // Step 4: Intercept maintenance request list
    cy.intercept('GET', 'http://localhost:8080/api/maintenance-requests', {
      statusCode: 200,
      body: [
        {
          id: 301,
          room_number: 'C101',
          name: 'Alex Turner',
          priority: 'High',
          category: 'Electrical',
          sub_category: 'Outlet',
          permission_to_enter: 'Yes',
          description: 'Outlet sparks when used',
          technician_notes: '',
          status: 'New',
          completed: '-'
        }
      ]
    }).as('getRequests');

    // Reload to trigger fetch
    cy.reload();
    cy.wait('@getRequests');

    // Step 5: Verify request data appears
    cy.contains('C101').should('exist');
    cy.contains('Alex Turner').should('exist');
    cy.contains('Outlet sparks when used').should('exist');
  });
});
