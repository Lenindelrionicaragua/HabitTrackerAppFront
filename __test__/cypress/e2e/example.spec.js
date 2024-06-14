describe("LoginScreen", () => {
  it("render correctly the loginScreen ", () => {
    cy.visit("https://zentimerappfront.netlify.app/");
    cy.get('input[type="text"]').type("ZenTimer");
  });
});
