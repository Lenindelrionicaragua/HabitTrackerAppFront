import { Colors } from "../../styles/AppStyles";

const {
  black,
  white,
  infoWhite,
  lightPink,
  darkGrey,
  seaGreen,
  skyBlue,
  lightGreen,
  green
} = Colors;

describe("StopwatchScreen", () => {
  it("Render all the stopwatch Screen elements correctly", () => {
    cy.visit("http://192.168.178.182:8081");

    cy.get('[data-testId="stopwatch-screen-container"]').should("exist");

    // title

    cy.get('[data-testId="stopwatch-title"]').should(
      "have.text",
      "Habit Tracker"
    );

    // Time buttons

    cy.get('[data-testId="stopwatch-time-buttons"]')
      .should("exist")
      .children()
      .should("have.length", 7)
      .each(($el, index) => {
        const expectedTexts = ["-", "05", "15", "30", "45", "55", "+"];
        cy.wrap($el).should("contain.text", expectedTexts[index]);
      })
      .eq(3)
      .click();

    //SVG

    cy.get('[data-testId="circle"]')
      .should("exist")
      .should("have.attr", "stroke", skyBlue)
      .and("have.attr", "stroke-width", "20")
      .and("have.attr", "fill", "none");

    cy.get('[data-testId="inner-circle"]')
      .should("exist")
      .should("have.attr", "stroke", white)
      .and("have.attr", "stroke-width", "20")
      .and("have.attr", "fill", "none")
      .and("have.attr", "transform", "rotate(-90 180 180)");

    cy.get('[data-testId="svg-time-text"]')
      .should("exist")
      .should("contain.text", "00:30:00");

    cy.get('[data-testId="svg-info-text"]')
      .should("exist")
      .should(
        "contain.text",
        "Choose your task\nand adjust the time\n to start the tracker."
      );

    // Info text

    cy.get('[data-testId="info-text-stopwatch-screen"]')
      .should("exist")
      .should("contain.text", "Im focusing on");

    // focus activity button

    cy.get('[data-testId="focus-activity-button"]')
      .should("exist")
      .should("contain.text", "Click here")
      .click()
      .should("contain.text", "Work")
      .click()
      .should("contain.text", "Exercise");

    // row buttons

    cy.get('[data-testId="save-button"]').should("exist");

    cy.get('[data-testId="start-button"]').should("exist").click();

    cy.wait(500);

    cy.get('[data-testId="stopwatch-time-buttons"]').should("not.be.visible");

    cy.get('[data-testId="pause-button"]').should("exist").click();

    cy.get('[data-testId="reset-button"]')
      .should("exist")
      .should("contain.text", "RESET")
      .click()
      .should("contain.text", "CONFIRM");

    cy.get('[data-testId="svg-info-text"]').should(
      "contain.text",
      "Are you sure you want to reset the stopwatch?"
    );

    cy.get('[data-testId="reset-button"]')
      .click()
      .should("contain.text", "RESET");

    cy.get('[data-testId="svg-info-text"]').should(
      "contain.text",
      "Stopwatch has been reset."
    );

    cy.get('[data-testId="save-button"]').should("exist").click();

    cy.get('[data-testId="svg-info-text"]').should(
      "contain.text",
      "No time recorded. Please start the timer before saving."
    );

    cy.get('[data-testId="reset-button"]')
      .should("exist")
      .should("contain.text", "RESET")
      .click()
      .should("contain.text", "RESET");

    cy.get('[data-testId="svg-info-text"]').should(
      "contain.text",
      "The timer is already at zero. Do you want to reset it?"
    );

    cy.get('[data-testId="start-button"]').should("exist").click();

    cy.get('[data-testId="svg-info-text"]').should(
      "contain.text",
      "Default time and activity selected"
    );

    cy.get('[data-testId="start-button"]').should("exist").click();

    cy.get('[data-testId="svg-info-text"]').should(
      "contain.text",
      "Timer start with the selected activity."
    );
  });
});
