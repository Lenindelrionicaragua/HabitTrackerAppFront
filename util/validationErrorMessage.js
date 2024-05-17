/**
 * In our models, we will have validation checkers that should return an array of error messages.
 * This function creates a user-friendly message for the API user, indicating what is wrong.
 */

// errorList should be an array of strings
const validationErrorMessage = errorList => {
  return `BAD REQUEST: ${errorList.join(", ")}`;
};

export default validationErrorMessage;
