import { useState, useCallback } from "react";

export const useButtonHandler = (initialButtonIds = []) => {
  // Initialize activeButtons with all buttonIds set to false
  const initialActiveButtonsState = initialButtonIds.reduce((acc, buttonId) => {
    acc[buttonId] = false;
    return acc;
  }, {});

  const [activeButtons, setActiveButtons] = useState(initialActiveButtonsState);

  const handleButtonPress = useCallback(buttonId => {
    setActiveButtons(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        // Reset all buttons to false
        acc[key] = false;
        return acc;
      }, {}),
      // Set the pressed button to true
      [buttonId]: true
    }));

    setTimeout(() => {
      setActiveButtons(prevState => ({
        ...prevState,
        [buttonId]: false
      }));
    }, 500);
  }, []);

  return { activeButtons, handleButtonPress };
};
