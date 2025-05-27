import React from "react";
import { Text } from "react-native";

const mockIcon = props => <Text testID={props.testID}>{props.name}</Text>;

export default mockIcon;
export const Ionicons = mockIcon;
export const FontAwesome = mockIcon;
export const MaterialIcons = mockIcon;
