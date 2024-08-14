import { useState, useCallback } from "react";

export const useButtonHandler = () => {
  const [activeButtons, setActiveButtons] = useState({});

  const handleButtonPress = useCallback(buttonId => {
    setActiveButtons(prevState => ({
      ...Object.fromEntries(Object.keys(prevState).map(key => [key, false])), // Reset all buttons to false
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
