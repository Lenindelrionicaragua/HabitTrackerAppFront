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
  beforeEach(() => {
    cy.visit("http://192.168.178.182:8081");
  });

  // Test to verify the initial rendering of the StopwatchScreen elements
  describe("Initial Rendering", () => {
    it("should render all screen elements correctly", () => {
      cy.get('[data-testId="stopwatch-screen-container"]').should("exist");

      // Title
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
        });

      // SVG elements
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
        .should("contain.text", "00:00:00");

      cy.get('[data-testId="svg-info-text"]')
        .should("exist")
        .should(
          "contain.text",
          "Choose your task\nand adjust the time\n to start the tracker."
        );

      // Info text
      cy.get('[data-testId="info-text-stopwatch-screen"]')
        .should("exist")
        .should("contain.text", "I'm focusing on");

      // Focus activity button
      cy.get('[data-testId="focus-activity-button"]')
        .should("exist")
        .should("contain.text", "Click here");

      // Row buttons
      cy.get('[data-testId="save-button"]').should("exist");
      cy.get('[data-testId="start-button"]').should("exist");
      cy.get('[data-testId="reset-button"]').should("exist");
    });
  });

  // Test for a long user flow scenario
  describe("User Flow: Complete Usage", () => {
    it("should handle a typical user flow correctly", () => {
      // Select time
      cy.get('[data-testId="stopwatch-time-buttons"]').children().eq(3).click();

      // Select activity
      cy.get('[data-testId="focus-activity-button"]')
        .click()
        .should("contain.text", "Work")
        .click()
        .should("contain.text", "Exercise");

      // Start timer
      cy.get('[data-testId="start-button"]').click();

      cy.wait(500);

      cy.get('[data-testId="stopwatch-time-buttons"]').should("not.be.visible");

      // Pause and reset timer
      cy.get('[data-testId="pause-button"]').click();

      cy.get('[data-testId="reset-button"]')
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

      // Try to save without recording time
      cy.get('[data-testId="save-button"]').click();

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "No time recorded. Please start the timer before saving."
      );

      // Start with default settings
      cy.get('[data-testId="start-button"]').click();

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "Default time and activity selected"
      );

      cy.get('[data-testId="start-button"]').click();

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "Timer started with the selected activity."
      );

      // Save action
      cy.get('[data-testId="save-button"]').should("exist").click();

      cy.wait(500);

      cy.get('[data-testId="svg-info-text"]').should("contain.text", "Saving");

      cy.wait(1000);

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "Time saved successfully! Your activity has been recorded."
      );

      cy.get('[data-testId="svg-info-text"]').should("contain.text", "");

      // Change activity and time after only one click on the Start button

      cy.get('[data-testId="start-button"]').click();

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "Default time and activity selected"
      );

      // Select time
      cy.get('[data-testId="stopwatch-time-buttons"]').children().eq(5).click();
      cy.get('[data-testId="stopwatch-time-buttons"]').children().eq(6).click();

      // Select activity
      cy.get('[data-testId="focus-activity-button"]')
        .should("contain.text", "Study")
        .click()
        .should("contain.text", "Work");

      //reset timer
      cy.get('[data-testId="reset-button"]').should("exist").click();

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "Are you sure you want to reset the stopwatch?"
      );

      cy.get('[data-testId="reset-button"]').should("exist").click();

      cy.get('[data-testId="svg-info-text"]').should(
        "contain.text",
        "Stopwatch has been reset."
      );

      // Select time + 1 minute
      cy.get('[data-testId="stopwatch-time-buttons"]').children().eq(6).click();

      // start the timer
      cy.get('[data-testId="start-button"]').click();
      cy.get('[data-testId="start-button"]').click();
    });
  });
});
