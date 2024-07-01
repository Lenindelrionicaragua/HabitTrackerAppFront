import styled from "styled-components/native";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, orange, grey, yellow, lightGrey, black } = Colors;

const green = "#00ff00";
const red = "#ff0000";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${lightGrey};
  width: 100%;
  justify-content: left;
  align-items: center;
  padding: 2%;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  margin-top: 0px;
  padding-bottom: 0%;
  margin-bottom: 0%;
`;

export const FocusTitle = styled(Text)`
  font-size: 18px;
  text-align: center;
  align-self: center;
  margin-bottom: 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${grey};
`;

// export const SelectorTimerContainer = styled(View)`
//   flex: 1;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   padding: 0%;
//   margin-bottom: 15%;
// `;

export const DecreaseTime = styled(Pressable)`
  flex-direction: row;
  padding: 10px;
  align-items: center;
`;

export const IncreaseTime = styled(Pressable)`
  flex-direction: row;
  padding: 10px;
  align-items: center;
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${orange};
  margin-vertical: 5px;
  padding-vertical: 0px;
`;

// export const ButtonsContainer = styled(View)`
//   flex: 1;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   padding: 0%;
//   margin-bottom: 15%;
// `;

export const ButtonText = styled(Text)`
  color: ${black};
  font-size: 10px;
`;

export const StyledButtonLeft = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  /* background-color: ${black}; */
  justify-content: center;
  align-items: center;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

export const StyledButtonRight = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
`;

export const RowContainer = styled(View)`
  flex-direction: row;

  justify-content: space-between;
  margin-top: 2%;
  padding: 5px;
  width: 100%;
  background-color: ${orange};
`;

export const StyledStartButton = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;

  transform: scale(1.5);
  /* 
  border-radius: 50px; 
  border-width: 1px;
  border-color: ${black};
  */
`;
