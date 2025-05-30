import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";

const { red, white } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  background-color: ${white};
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const MessageText = styled.Text`
  color: ${red};
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

export const StyledButton = styled.TouchableOpacity`
  background-color: ${red};
  padding: 15px 30px;
  border-radius: 10px;
`;

export const ButtonText = styled.Text`
  color: ${white};
  font-size: 16px;
  font-weight: bold;
`;
