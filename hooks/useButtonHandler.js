import { useState, useCallback } from "react";

export const useButtonHandler = (initialButtonIds = []) => {
  const initialActiveButtonsState = initialButtonIds.reduce((acc, buttonId) => {
    acc[buttonId] = false;
    return acc;
  }, {});

  const [activeButtons, setActiveButtons] = useState(initialActiveButtonsState);

  const handleButtonPress = useCallback(buttonId => {
    setActiveButtons(prevState => ({
      ...prevState,
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
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
