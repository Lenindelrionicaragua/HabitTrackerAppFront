Cypress.on("uncaught:exception", (err, runnable) => {
  // return false to prevent Cypress from
  // failing the test on uncaught exceptions
  return false;
});
