import React from "react";
import renderer from "react-test-renderer";
import RootStack from "../../navigators/RootStack";

let rootStackInstance;

beforeEach(() => {
  rootStackInstance = renderer.create(<RootStack />);
});

test("RootStack snapshot matches previous version", () => {
  const rootStackJson = rootStackInstance.toJSON();
  expect(rootStackJson).toBeTruthy();
  expect(rootStackJson).toMatchSnapshot();
});
