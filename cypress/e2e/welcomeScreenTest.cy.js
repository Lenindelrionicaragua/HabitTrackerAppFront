describe("WelcomeScreen", () => {
  const testEmail = "testuser@example.com";
  const testPassword = "Password1234!";

  const performLogin = () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    // Navigate to LoginScreen
    cy.get('[data-testId="home-banner-button"]').click();

    // Input the test email
    cy.get('[data-testId="email-input"]').type(testEmail);

    // Input the test password
    cy.get('[data-testId="password-input"]').type(testPassword);

    // Click the login button
    cy.get('[data-testId="login-styled-button"]').click();
  };

  beforeEach(() => {
    performLogin();
  });

  it("Renders all WelcomeScreen elements correctly", () => {
    // Verify that the welcome image exists
    cy.get('[data-testId="welcome-image"]').should("exist");

    // Verify that the welcome title and user information exist and have correct text
    cy.get('[data-testId="welcome-title"]')
      .should("exist")
      .and("have.text", "Welcome!");

    cy.get('[data-testId="user-name"]')
      .should("exist")
      .and("have.text", "testuser");

    cy.get('[data-testId="user-email"]')
      .should("exist")
      .and("have.text", "testuser@example.com");

    // Verify that the avatar image, dividing line, and logout button exist
    cy.get('[data-testId="avatar-image"]').should("exist");
    cy.get('[data-testId="line"]').should("exist");

    cy.get('[data-testId="logout-button-text"]')
      .should("exist")
      .and("have.text", "Logout");
  });

  it("Navigates to LoginScreen when the user clicks the logout button", () => {
    // Verify that the welcome image exists
    cy.get('[data-testId="welcome-image"]').should("exist");

    // Click the logout button
    cy.get('[data-testId="logout-styled-button"]').click();

    // Verify that the user navigates to the login screen after logging out
    cy.get('[data-testId="page-logo"]').should("exist");
    cy.get('[data-testId="page-title"]')
      .should("exist")
      .and("have.text", "Habit Tracker");

    // Verify that the email input exists on the login screen
    cy.get('[data-testId="email-input"]').should("exist");
  });
});
