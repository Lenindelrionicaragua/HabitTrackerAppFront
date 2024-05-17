/**
 * Combine all the logging options into one file.
 *
 * For now we log to the console, but if in the future we want to add a logging service
 * we only need to adjust this file.
 */

/**
 * logInfo should be used to log anything that can be used for debugging but is not a problem
 */
export const logInfo = message => {
  // eslint-disable-next-line no-console
  console.log(message);
};

/**
 * logWarning should be used to log anything that signals a problem that is not app breaking
 */
export const logWarning = message => {
  // eslint-disable-next-line no-console
  console.warn(message);
};

/**
 * logError should be used to log anything that is app breaking
 */
export const logError = error => {
  if (error instanceof Error) {
    console.error(error.message, error.stack);
    if (error.innerError) {
      console.error("Inner Error: ", error.innerError);
    }
  } else if (typeof error === "object") {
    console.error("ERROR: ", JSON.stringify(error, null, 2));
  } else {
    console.error("ERROR: ", error);
  }
};

/**
 * handleError should be used to log and handle any errors in the application
 */
export const handleError = error => {
  // Log the error
  logError(error);

  // Handle the error as needed
  // For example, you could send it to an error tracking service
  // or display a user-friendly error message to the user
};
