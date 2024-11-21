import React, { useState } from "react";
import {
  StyledButton,
  ButtonText
} from "../../screens/MetricsScreen/MetricsScreenStyles";

const UpgradeButton = ({ onPress }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handlePress = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onPress();
  };

  return (
    <StyledButton onPress={handlePress}>
      <ButtonText isClicked={isClicked}>Upgrade to Premium</ButtonText>
    </StyledButton>
  );
};

export default UpgradeButton;
