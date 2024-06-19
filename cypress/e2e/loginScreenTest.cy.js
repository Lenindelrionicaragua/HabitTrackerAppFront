describe("LoginScreen", () => {
  it("render the elements of the LoginScreen", () => {
    cy.visit("http://192.168.178.182:8081");

    cy.get('[data-testId="page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");

    cy.get('[data-testId="email-input"]').should("exist");

    cy.get('[data-testId="password-input"]').should("exist");

    cy.get('[data-testId="login-styled-button"]').should("exist");
  });
});
