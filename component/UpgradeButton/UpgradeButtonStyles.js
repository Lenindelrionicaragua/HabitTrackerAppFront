import styled from "styled-components/native";
import { Text, Pressable } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { skyBlue, white } = Colors;

export const StyledButton = styled(Pressable)`
  padding: 5px 15px;
  background-color: ${skyBlue};
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  overflow: hidden;
`;

export const ButtonText = styled(Text)`
  color: ${white};
  font-size: 16px;
  transition: color 0.3s ease-in-out;
  ${({ isClicked }) =>
    isClicked &&
    `
    color: yellow;
  `}
`;
