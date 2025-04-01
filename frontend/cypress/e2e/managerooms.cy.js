describe('ManageRooms Page', () => {
  beforeEach(() => {
    cy.visit('/managerooms');
  });

  it('displays add room form by default', () => {
    cy.contains('Enter Room Details').should('be.visible');
    cy.get('label').contains('Room Type').should('exist');
    cy.get('label').contains('Room Number').should('exist');
    cy.get('label').contains('Price').should('exist');
    cy.get('label').contains('Vacancies').should('exist');
    cy.contains('button', /^Add Room$/i).should('exist');
  });

  it('adds a room and calls the backend API', () => {
    cy.intercept('POST', '**/api/rooms/', {
      statusCode: 200,
      body: { message: 'Room added successfully!' }
    }).as('addRoom');

    cy.get('label').contains('Room Type').siblings('input').type('Deluxe');
    cy.get('label').contains('Room Number').siblings('input').type('101');
    cy.get('label').contains('Price').siblings('input').type('1200');
    cy.get('label').contains('Vacancies').siblings('input').type('2');

    cy.contains('button', /^Add Room$/i).click();

    cy.wait('@addRoom').its('request.body').should((body) => {
      expect(body).to.include({
        type: 'Deluxe',
        room_number: 101,
        price: 1200,
        vacancy: 2
      });
    });

    cy.on('window:alert', (msg) => {
      expect(msg).to.eq('Room added successfully!');
    });
  });
});
