describe("welcomeScreen", () => {
  it("Render all the WelcomeScreen elements correctly, when the email and password are valids", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    const testEmail = "usertest@gmail.com";
    const testPassword = "Password1234!";

    // Input the test email
    cy.get('[data-testId="email-input"]').type(testEmail);
    // Input the test password
    cy.get('[data-testId="password-input"]').type(testPassword);
    // Click the login button
    cy.get('[data-testId="login-styled-button"]').click();

    // Verify that the welcome image exists
    cy.get('[data-testId="welcome-image"]').should("exist");

    // Verify that the welcome title exists and has the correct text
    cy.get('[data-testId="welcome-title"]')
      .should("exist")
      .and("have.text", "Welcome!");

    // Verify that the user's name exists and has the correct text
    cy.get('[data-testId="user-name"]')
      .should("exist")
      .and("have.text", "Len Del Rio");

    // Verify that the user's email exists and has the correct text
    cy.get('[data-testId="user-email"]')
      .should("exist")
      .and("have.text", "usertest@gmail.com");

    // Verify that the avatar image exists
    cy.get('[data-testId="avatar-image"]').should("exist");

    // Verify that the dividing line exists
    cy.get('[data-testId="line"]').should("exist");

    // Verify that the logout button text exists and has the correct text
    cy.get('[data-testId="logout-button-text"]')
      .should("exist")
      .and("have.text", "Logout");
  });

  it("Navigate to loginScreen when the user click the logout button", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    const testEmail = "usertest@gmail.com";
    const testPassword = "Password1234!";

    // Input the test email
    cy.get('[data-testId="email-input"]').type(testEmail);
    // Input the test password
    cy.get('[data-testId="password-input"]').type(testPassword);
    // Click the login button
    cy.get('[data-testId="login-styled-button"]').click();

    // Click the logout button
    cy.get('[data-testId="logout-button-text"]').click();

    // Verify that the user navigate to the loginScreen after click de logout
    cy.get('[data-testId="page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");
  });
});
