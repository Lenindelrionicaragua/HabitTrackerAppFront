import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";

const { green, white, softGray } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  background-color: ${white};
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const MessageText = styled.Text`
  color: ${green};
  font-size: 22px;
  text-align: center;
  margin-bottom: 30px;
`;

export const ButtonGroup = styled.View`
  width: 100%;
  align-items: center;
`;

export const StyledButton = styled.TouchableOpacity`
  background-color: ${softGray};
  padding: 15px 30px;
  border-radius: 10px;
  margin-vertical: 8px;
  width: 80%;
`;

export const ButtonText = styled.Text`
  color: ${green};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
