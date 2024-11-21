import React, { useState } from "react";
import { StyledButton, ButtonText } from "../UpgradeButton/UpgradeButtonStyles";

const UpgradeButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handlePress = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <StyledButton onPress={handlePress}>
      <ButtonText isClicked={isClicked}>Upgrade Now</ButtonText>
    </StyledButton>
  );
};

export default UpgradeButton;
