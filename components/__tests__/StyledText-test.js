import * as React from "react";
import renderer, { act } from "react-test-renderer";

import { MonoText } from "../StyledText";

jest.mock("../useColorScheme", () => ({
  useColorScheme: () => "light",
}));

it(`renders correctly`, () => {
  let rendered;

  act(() => {
    rendered = renderer.create(<MonoText>Snapshot test!</MonoText>);
  });

  expect(rendered.toJSON()).toMatchSnapshot();

  act(() => {
    rendered.unmount();
  });
});
