import React from "react";
import renderer from "react-test-renderer";
import RootStack from "../navigators/RootStack";
import App from "../App";

const renderAppWithRenderer = () => renderer.create(<App />);

let appRenderWithRenderer;

beforeEach(async () => {
  appRenderWithRenderer = renderAppWithRenderer();
});

test("renders RootStack correctly", () => {
  const appInstance = appRenderWithRenderer.root;
  const rootStackElement = appInstance.findByType(RootStack);
  expect(rootStackElement).toBeTruthy();
});
