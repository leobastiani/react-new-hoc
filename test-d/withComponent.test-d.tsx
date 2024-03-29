/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { Fragment, FunctionComponent } from "react";
import { expectError, expectType } from "tsd";
import { PartialComponent } from "../src/@types/PartialComponent";
import { WithComponent } from "../src/@types/WithComponent";
import { withComponent } from "../src/withComponent";

function Button(props: {
  size: "lg" | "md" | "xs";
  onPress: () => void;
  disabled?: boolean;
}): JSX.Element {
  return <button>{props.size}</button>;
}

function ButtonEnhanced(props: {
  size: "lg" | "md" | "xs";
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}): JSX.Element {
  return <button>{props.size}</button>;
}

function ButtonEnhanceRequirements(props: {
  size: "lg" | "md" | "xs";
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}): JSX.Element {
  return <button>{props.size}</button>;
}

function OtherButton(_props: { size: "lg" | "md" | "xs" }): JSX.Element {
  return <button>Click me</button>;
}

{
  // override

  const PartialButton: PartialComponent<typeof Button> = undefined as any;
  <PartialButton />;
  <PartialButton size="lg" />;
  <PartialButton disabled />;
  <PartialButton disabled size="lg" />;

  const BeforeHoc: React.FC<{
    Button: PartialComponent<typeof Button>;
    oldProp: string;
    oldPropOptional?: symbol;
  }> = undefined as any;
  const AfterHoc = withComponent("Button", Button)(BeforeHoc);
  expectType<
    FunctionComponent<{
      oldProp: string;
      oldPropOptional?: symbol | undefined;
      Button?: WithComponent<typeof Button>;
    }>
  >(AfterHoc);
}

{
  // adds new state with oldProp as optional

  const BeforeHoc: React.FC<{
    oldPropOptional?: string;
  }> = undefined as any;
  const AfterHoc = withComponent("Button", Button)(BeforeHoc);
  expectType<
    FunctionComponent<{
      oldPropOptional?: string;
      Button?: WithComponent<typeof Button>;
    }>
  >(AfterHoc);

  // usage
  <AfterHoc />;
  <AfterHoc oldPropOptional="string" />;
  <AfterHoc oldPropOptional="string" Button="string" />;
  <AfterHoc Button={{ size: "lg" }} />;
  <AfterHoc Button={null} />;
  <AfterHoc Button={false} />;
  <AfterHoc Button={true} />;
  <AfterHoc Button={10} />;
  <AfterHoc Button={<OtherButton size="lg" />} />;
  // with myself
  <AfterHoc Button={() => Button} />;
  // with a button that extends
  <AfterHoc Button={() => ButtonEnhanced} />;
  // with myself but received from parameters
  <AfterHoc Button={(Button) => Button} />;
  // when it does not require any argument
  const NoneComponent: React.FC = () => <></>;
  <AfterHoc Button={() => NoneComponent} />;
  // with a button that needs less requirements
  <AfterHoc Button={() => OtherButton} />;
  // with a button that needs more requirements
  expectError(<AfterHoc Button={() => ButtonEnhanceRequirements} />);
  // with a button that needs other requirements
  expectError(<AfterHoc Button={() => Fragment} />);
}
