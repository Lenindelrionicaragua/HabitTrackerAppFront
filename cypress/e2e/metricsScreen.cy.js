describe("MetricsScreen", () => {
  const testEmail = "testuser@example.com";
  const testPassword = "Password1234!";

  const performLogin = () => {
    // Navigate to the main page
    cy.visit("http://192.168.178.182:8081");

    // Navigate to LoginScreen
    cy.get('[data-testId="home-banner-button"]').click();

    // Enter email and password
    cy.get('[data-testId="email-input"]').type(testEmail);
    cy.get('[data-testId="password-input"]').type(testPassword);

    // Click the login button
    cy.get('[data-testId="login-styled-button"]').click();
  };

  beforeEach(() => {
    performLogin();
  });

  it("Renders all MetricsScreen elements correctly", () => {
    cy.get('[data-testId="metrics-banner-button"]').click();

    // Verify main screen elements
    cy.get('[data-testId="metrics-container"]').should("exist");
    cy.get('[data-testId="inner-container"]').should("exist");
    cy.get('[data-testId="header"]').should("exist");

    // Verify header elements
    cy.get('[data-testId="avatar-container"]').should("exist");
    cy.get('[data-testId="avatar-metrics-image"]').should("exist");
    cy.get('[data-testId="title-container"]').should("exist");
    cy.get('[data-testId="metrics-title"]').should("exist");
    cy.get('[data-testId="metrics-title"]').should(
      "contain.text",
      "Habit Tracker"
    );

    cy.get('[data-testId="pie-chart-icon"]').should("exist");

    // Verify additional elements
    cy.get('[data-testId="line"]').should("exist");
  });
});
