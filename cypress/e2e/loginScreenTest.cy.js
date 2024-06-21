describe("LoginScreen", () => {
  it("Render the elements of the LoginScreen", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    // Verify that the page logo exists
    cy.get('[data-testId="page-logo"]').should("exist");

    // Verify that the page title exists and has the correct text
    cy.get('[data-testId="page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");

    // Verify that the subtitle exists and has the correct text
    cy.get('[data-testId="sub-title"]')
      .should("exist")
      .should("have.text", "Account Login");

    // Verify that the email input field exists
    cy.get('[data-testId="email-input"]').should("exist");

    // Verify that the password input field exists
    cy.get('[data-testId="password-input"]').should("exist");

    // Verify that the message box exists
    cy.get('[data-testId="msg-box"]').should("exist");

    // Verify that the dividing line exists
    cy.get('[data-testId="line"]').should("exist");

    // Verify that the login button exists and has the correct text
    cy.get('[data-testId="login-styled-button"]')
      .should("exist")
      .should("have.text", "Login");

    // Verify that the Google sign-in button exists and has the correct text
    cy.get('[data-testId="google-styled-button"]')
      .should("exist")
      .should("have.text", "Sign in with Google");

    // Verify that the Google icon exists
    cy.get('[data-testId="google-icon"]').should("exist");

    // Verify that the footer text exists and has the correct text
    cy.get('[data-testId="footer-text"]')
      .should("exist")
      .should("have.text", "Don't you have an account already?");

    // Verify that the sign-up link exists and has the correct text
    cy.get('[data-testId="signup-link-content"]')
      .should("exist")
      .should("have.text", "Signup");
  });

  it("Inputs register user information correctly", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    const testEmail = "testuser@example.com";
    const testPassword = "password123";

    // Input the test email and verify its value
    cy.get('[data-testId="email-input"]')
      .type(testEmail)
      .should("have.value", testEmail);

    // Input the test password and verify its value
    cy.get('[data-testId="password-input"]')
      .type(testPassword)
      .should("have.value", testPassword);
  });

  it("Should fail when the user doesn't exist", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    const testEmail = "invaliduser@gmail.com";
    const testPassword = "invalidpassword";

    // Input the invalid email
    cy.get('[data-testId="email-input"]').type(testEmail);
    // Input the invalid password
    cy.get('[data-testId="password-input"]').type(testPassword);
    // Click the login button
    cy.get('[data-testId="login-styled-button"]').click();
    // Verify the error message
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should(
        "have.text",
        "No user was found associated with the provided email address. Please verify your email and try again or register if you are a new user."
      );
  });

  it("Should fail when the password is not correct", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    const testEmail = "usertest@gmail.com";
    const testPassword = "invalidPassword";

    // Input the email
    cy.get('[data-testId="email-input"]').type(testEmail);
    // Input the incorrect password
    cy.get('[data-testId="password-input"]').type(testPassword);
    // Click the login button
    cy.get('[data-testId="login-styled-button"]').click();
    // Verify the error message
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should(
        "have.text",
        "The password provided is incorrect. Please verify your password and try again."
      );
  });
});
