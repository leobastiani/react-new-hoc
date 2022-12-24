import { act, render } from "@testing-library/react";
import { FunctionComponent } from "react";
import { componentDisplayName } from "./componentDisplayName";
import { withState } from "./withState";

let setSomeState: (n: number) => void;
interface ExampleProps {
  someState: number;
  setSomeState: typeof setSomeState;
}
let Example: FunctionComponent<ExampleProps>;

beforeEach(() => {
  // eslint-disable-next-line react/display-name
  Example = (props: ExampleProps): JSX.Element => {
    setSomeState = props.setSomeState;
    return <pre>{JSON.stringify(props)}</pre>;
  };
});

it("withState", () => {
  const Component = withState("someState", { init: 0 })(Example);
  render(<Component />);
  expect(document.body.children[0].innerHTML).toBe(
    '<pre>{"someState":0}</pre>'
  );
  expect(componentDisplayName.get(Component)).toBe(
    "withState.someState(Example)"
  );
  act(() => {
    setSomeState(1);
  });
  expect(document.body.children[0].innerHTML).toBe(
    '<pre>{"someState":1}</pre>'
  );
});

it("withState overridden", () => {
  const Component = withState("someState", { init: 0 })(Example);
  render(<Component someState={10} />);
  expect(document.body.children[0].innerHTML).toBe(
    '<pre>{"someState":10}</pre>'
  );
  act(() => {
    setSomeState(1);
  });
  expect(document.body.children[0].innerHTML).toBe(
    '<pre>{"someState":10}</pre>'
  );
});