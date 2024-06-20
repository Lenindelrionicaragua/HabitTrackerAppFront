describe("SigninScreen", () => {
  it("Render all the sign-in Screen elements correctly, after clicking in sign-in link", () => {
    cy.visit("http://192.168.178.182:8081");

    cy.get('[data-testId="signup-link-content"]').click();

    cy.wait(500);

    cy.get('[data-testId="signup-page-title"]')
      .should("exist")
      .should("have.text", "ZenTimer");

    cy.get('[data-testId="signup-page-sub-title"]')
      .should("exist")
      .should("have.text", "Account Sign Up");

    //formik
    cy.get('[data-testId="name"]').should("exist");

    cy.get('[data-testId="email-input"]').should("exist");

    cy.get('[data-testId="date-of-birth"]').should("exist");

    cy.get('[data-testId="password-input"]').should("exist");

    cy.get('[data-testId="confirm-password-input"]').should("exist");

    cy.get('[data-testId="msg-box"]').should("exist");

    cy.get('[data-testId="signup-styled-button"]').should("exist");

    cy.get('[data-testId="line"]').should("exist");

    cy.get('[data-testId="signup-footer-text"]')
      .should("exist")
      .should("have.text", "Already have an account?");

    cy.get('[data-testId="footer-login-link"]')
      .should("exist")
      .should("have.text", "Login");
  });
});
