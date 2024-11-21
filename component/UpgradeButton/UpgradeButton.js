import React, { useState } from "react";
import {
  StyledButton,
  ButtonText
} from "../../screens/MetricsScreen/MetricsScreenStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

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
      <FontAwesome5 name="chess-queen" size={24} color="gold" />
    </StyledButton>
  );
};

export default UpgradeButton;
