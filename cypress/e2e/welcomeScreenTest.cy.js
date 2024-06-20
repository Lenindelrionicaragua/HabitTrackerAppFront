describe("welcomeScreen", () => {
  it("Render all the WelcomeScreen elements correctly, when the email and password are valids", () => {
    cy.visit("http://192.168.178.182:8081");

    const testEmail = "usertest@gmail.com";
    const testPassword = "Password1234!";

    cy.get('[data-testId="email-input"]').type(testEmail);
    cy.get('[data-testId="password-input"]').type(testPassword);
    cy.get('[data-testId="login-styled-button"]').click();

    cy.get('[data-testId="welcome-image"]').should("exist");

    cy.get('[data-testId="welcome-title"]')
      .should("exist")
      .and("have.text", "Welcome!");

    cy.get('[data-testId="user-name"]')
      .should("exist")
      .and("have.text", "Len Del Rio");

    cy.get('[data-testId="user-email"]')
      .should("exist")
      .and("have.text", "usertest@gmail.com");

    cy.get('[data-testId="avatar-image"]').should("exist");

    cy.get('[data-testId="line"]').should("exist");

    cy.get('[data-testId="logout-button-text"]')
      .should("exist")
      .and("have.text", "Logout");
  });
});
