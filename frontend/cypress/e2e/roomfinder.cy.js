/// <reference types="cypress" />

describe("RoomFinder Tests", () => {
  beforeEach(() => {
    cy.visit("/roomfinder");
    cy.get("body").should("be.visible");
  });

  it("should display all flat types", () => {
    cy.contains("Select Your Flat Type").should("be.visible");
    cy.contains("1B1B").should("be.visible");
    cy.contains("2B2B").should("be.visible");
    cy.contains("3B3B").should("be.visible");
  });

  it("should display room table for 1B1B", () => {
    cy.contains("1B1B").click();
    cy.contains("Room Details for 1B1B").should("exist");
    cy.get("table").should("exist");
    cy.get("td").contains("7075").should("exist");
  });

  it("should display room table for 2B2B", () => {
    cy.contains("2B2B").click();
    cy.contains("Room Details for 2B2B").should("exist");
    cy.get("table").should("exist");
    cy.get("td").contains("1234").should("exist");
  });

  it("should display room table for 3B3B", () => {
    cy.contains("3B3B").click();
    cy.contains("Room Details for 3B3B").should("exist");
    cy.get("table").should("exist");
    cy.get("td").contains("120").should("exist");
  });

  it("should simulate clicking 'I am Interested' and validate mailto link", () => {
    cy.contains("1B1B").click();
    cy.get("button").contains("I am Interested").first().click();

    cy.get('[data-testid="mailto-link"]')
      .should("exist")
      .invoke("attr", "href")
      .should("include", "mailto:")
      .and("include", "Room 7075")
      .and("include", "admin@gatornest.com");
  });
});
