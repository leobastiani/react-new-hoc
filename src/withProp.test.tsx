import { render } from "@testing-library/react";
import { componentDisplayName } from "./componentDisplayName";
import { withProp } from "./withProp";

function Example(props: { someProp: number }): JSX.Element {
  return <pre>{JSON.stringify(props)}</pre>;
}

it("withProps name", () => {
  const Component = withProp("someProp", 1)(Example);
  expect(componentDisplayName.get(Component)).toBe(
    "withProp.someProp(Example)"
  );
});

it("withProps with value", () => {
  const Component = withProp("someProp", 1)(Example);
  render(<Component />);
  expect(document.body.children[0].innerHTML).toBe('<pre>{"someProp":1}</pre>');
});

it("withProps with function", () => {
  const Component = withProp("someProp", () => 1, [])(Example);
  render(<Component />);
  expect(document.body.children[0].innerHTML).toBe('<pre>{"someProp":1}</pre>');
});

it("withProps overridden", () => {
  const Component = withProp("someProp", 10)(Example);
  render(<Component someProp={20} />);
  expect(document.body.children[0].innerHTML).toBe(
    '<pre>{"someProp":20}</pre>'
  );
});

it("withProps rewritten", () => {
  const Component = withProp(
    "someProp",
    ({ someProp }: { someProp: number }) => someProp + 10,
    ["someProp"]
  )(Example);
  render(<Component someProp={20} />);
  expect(document.body.children[0].innerHTML).toBe(
    '<pre>{"someProp":30}</pre>'
  );
});
