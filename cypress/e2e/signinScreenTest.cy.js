describe("SigninScreen", () => {
  it("Render all the sign-in Screen elements correctly, after clicking in sign-in link", () => {
    // Visit the main page
    cy.visit("http://192.168.178.182:8081");

    // Click on the sign-up link
    cy.get('[data-testId="signup-link-content"]').click();

    // Wait for 500 milliseconds to ensure navigation is complete
    cy.wait(500);

    // Verify that the sign-up page title exists and has the correct text
    cy.get('[data-testId="signup-page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");

    // Verify that the sign-up page subtitle exists and has the correct text
    cy.get('[data-testId="signup-page-sub-title"]')
      .should("exist")
      .should("have.text", "Account Sign Up");

    // Verify that the name input field exists
    cy.get('[data-testId="name"]').should("exist");

    // Verify that the email input field exists
    cy.get('[data-testId="email-input"]').should("exist");

    // Verify that the date of birth input field exists
    cy.get('[data-testId="date-of-birth"]').should("exist");

    // Verify that the password input field exists
    cy.get('[data-testId="password-input"]').should("exist");

    // Verify that the confirm password input field exists
    cy.get('[data-testId="confirm-password-input"]').should("exist");

    // Verify that the message box exists
    cy.get('[data-testId="msg-box"]').should("exist");

    // Verify that the styled sign-up button exists
    cy.get('[data-testId="signup-styled-button"]').should("exist");

    // Verify that the dividing line exists
    cy.get('[data-testId="line"]').should("exist");

    // Verify that the footer text exists and has the correct text
    cy.get('[data-testId="signup-footer-text"]')
      .should("exist")
      .should("have.text", "Already have an account?");

    // Verify that the footer login link exists and has the correct text
    cy.get('[data-testId="footer-login-link"]')
      .should("exist")
      .should("have.text", "Login");
  });

  it("Should fail if the user tries to sign up without a correct password", () => {
    cy.visit("http://192.168.178.182:8081");

    // Click on the sign-up link
    cy.get('[data-testId="signup-link-content"]').click();

    // Wait for 500 milliseconds to ensure navigation is complete
    cy.wait(500);

    const testName = "Len Del Rio";
    const testEmail = "testuser@example.com";
    const testDateOfBirth = "Tue Feb 01 1984";
    const testPassword = "password";
    const testConfirmPassword = "password";

    // Verify that the name input field exists
    cy.get('[data-testId="name"]')
      .should("exist")
      .type(testName)
      .should("have.value", testName);

    // Verify that the email input field exists
    cy.get('[data-testId="signup-screen-email-input"]')
      .should("exist")
      .type(testEmail)
      .should("have.value", testEmail);

    // Verify that the date of birth input field exists
    cy.get('[data-testId="date-of-birth"]')
      .should("exist")
      .invoke("val", testDateOfBirth)
      .trigger("change")
      .should("have.value", testDateOfBirth);

    // Verify that the password input field exists
    cy.get('[data-testId="signup-screen-password-input"]')
      .should("exist")
      .type(testPassword)
      .should("have.value", testPassword);

    // Verify that the confirm password input field exists
    cy.get('[data-testId="confirm-password-input"]')
      .should("exist")
      .type(testConfirmPassword)
      .should("have.value", testConfirmPassword);

    // Click the sign-up button without filling in the fields
    cy.get('[data-testId="signup-styled-button"]').click();

    // Verify that the message box exists
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should(
        "have.text",
        "Name, email, password, and date of birth are required."
      );
  });

  it("Should fail if the user tries to sign up without filling in the fields", () => {
    cy.visit("http://192.168.178.182:8081");

    // Click on the sign-up link
    cy.get('[data-testId="signup-link-content"]').click();

    // Wait for 500 milliseconds to ensure navigation is complete
    cy.wait(500);

    // Click the sign-up button without filling in the fields
    cy.get('[data-testId="signup-styled-button"]').click();

    // Verify that the message box exists
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should("have.text", "Please fill all the fields");
  });

  it("Should navigate to loginScreen when the user clicks the login button", () => {
    cy.visit("http://192.168.178.182:8081");

    // Click on the sign-up link
    cy.get('[data-testId="signup-link-content"]').click();

    // Wait for 500 milliseconds to ensure navigation is complete
    cy.wait(500);

    // Click on the footer login link
    cy.get('[data-testId="footer-login-link"]').click();

    // Verify that the page logo exists
    cy.get('[data-testId="page-logo"]').should("exist");

    // Verify that the page title exists and has the correct text
    cy.get('[data-testId="page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");
  });

  it("Should fail if the user tries to sign up without a correct confirm-password", () => {
    cy.visit("http://192.168.178.182:8081");

    //   Click on the sign-up link
    cy.get('[data-testId="signup-link-content"]').click();

    //   Wait for 500 milliseconds to ensure navigation is complete
    cy.wait(500);

    const testName = "Len Del Rio";
    const testEmail = "testuser@example.com";
    const testDateOfBirth = "Tue Feb 01 1984";
    const testPassword = "Password1234!";
    const testConfirmPassword = "password";

    //   Verify that the name input field exists
    cy.get('[data-testId="name"]')
      .should("exist")
      .type(testName)
      .should("have.value", testName);

    //   Verify that the email input field exists
    cy.get('[data-testId="signup-screen-email-input"]')
      .should("exist")
      .type(testEmail)
      .should("have.value", testEmail);

    //   Verify that the date of birth input field exists
    cy.get('[data-testId="date-of-birth"]')
      .should("exist")
      .invoke("val", testDateOfBirth)
      .trigger("change")
      .should("have.value", testDateOfBirth);

    //   Verify that the password input field exists
    cy.get('[data-testId="signup-screen-password-input"]')
      .should("exist")
      .type(testPassword)
      .should("have.value", testPassword);

    //   Verify that the confirm password input field exists
    cy.get('[data-testId="confirm-password-input"]')
      .should("exist")
      .type(testConfirmPassword)
      .should("have.value", testConfirmPassword);

    //   Click the sign-up button without filling in the fields
    cy.get('[data-testId="signup-styled-button"]').click();

    //   Verify that the message box exists
    cy.get('[data-testId="msg-box"]')
      .should("exist")
      .should("have.text", "Passwords do not match");
  });
});
