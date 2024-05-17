import React from "react";
// import "@expo/metro-runtime";
// import { registerRootComponent } from "expo";
// React Navigation Stack
import RootStack from "./navigators/RootStack";

export default function App() {
  return <RootStack testID="root-stack" />;
}

// registerRootComponent(App);
