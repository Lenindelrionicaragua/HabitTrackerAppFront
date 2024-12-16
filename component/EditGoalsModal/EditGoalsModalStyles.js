import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";
import { Animated } from "react-native";

const { black, white, darkGrey, red } = Colors;

export const ModalBackground = styled(Animated.View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${white};
  padding: 20px;
  border-radius: 10px;
  width: 90%;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${darkGrey};
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const TriggerButton = styled.TouchableOpacity`
  padding: 10px;
  width: 100px;
  background-color: ${black};
  align-items: center;
  border-radius: 5px;
`;

export const TriggerButtonText = styled.Text`
  color: ${white};
  font-weight: bold;
`;

export const ErrorText = styled.Text`
  color: ${red};
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
`;
