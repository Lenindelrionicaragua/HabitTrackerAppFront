describe("SigninScreen", () => {
  //   it("Render all the sign-in Screen elements correctly, after clicking in sign-in link", () => {
  //     // Visit the main page
  //     cy.visit("http://192.168.178.182:8081");

  //     // Click on the sign-up link
  //     cy.get('[data-testId="signup-link-content"]').click();

  //     // Wait for 500 milliseconds to ensure navigation is complete
  //     cy.wait(500);

  //     // Verify that the sign-up page title exists and has the correct text
  //     cy.get('[data-testId="signup-page-title"]')
  //       .should("exist")
  //       .should("have.text", "ZenTimer");

  //     // Verify that the sign-up page subtitle exists and has the correct text
  //     cy.get('[data-testId="signup-page-sub-title"]')
  //       .should("exist")
  //       .should("have.text", "Account Sign Up");

  //     // Verify that the name input field exists
  //     cy.get('[data-testId="name"]').should("exist");

  //     // Verify that the email input field exists
  //     cy.get('[data-testId="email-input"]').should("exist");

  //     // Verify that the date of birth input field exists
  //     cy.get('[data-testId="date-of-birth"]').should("exist");

  //     // Verify that the password input field exists
  //     cy.get('[data-testId="password-input"]').should("exist");

  //     // Verify that the confirm password input field exists
  //     cy.get('[data-testId="confirm-password-input"]').should("exist");

  //     // Verify that the message box exists
  //     cy.get('[data-testId="msg-box"]').should("exist");

  //     // Verify that the styled sign-up button exists
  //     cy.get('[data-testId="signup-styled-button"]').should("exist");

  //     // Verify that the dividing line exists
  //     cy.get('[data-testId="line"]').should("exist");

  //     // Verify that the footer text exists and has the correct text
  //     cy.get('[data-testId="signup-footer-text"]')
  //       .should("exist")
  //       .should("have.text", "Already have an account?");

  //     // Verify that the footer login link exists and has the correct text
  //     cy.get('[data-testId="footer-login-link"]')
  //       .should("exist")
  //       .should("have.text", "Login");
  //   });

  it("Should Navigate to loginScreen when the user click de login button", () => {
    cy.visit("http://192.168.178.182:8081");

    // Click on the sign-up link
    cy.get('[data-testId="signup-link-content"]').click();

    // Wait for 500 milliseconds to ensure navigation is complete
    cy.wait(500);

    cy.get('[data-testId="footer-login-link"]').click();

    // Verify that the page logo exists
    cy.get('[data-testId="page-logo"]').should("exist");

    // Verify that the page title exists and has the correct text
    cy.get('[data-testId="page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");
  });
});
