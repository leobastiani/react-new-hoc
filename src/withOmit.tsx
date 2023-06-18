import { Fn } from "hotscript";
import { ComponentType, FunctionComponent } from "react";
import { Hoc } from "./Hoc";
import { newHoc } from "./newHoc";

// https://github.com/gvergnaud/hotscript/issues/103
interface OmitFn<Names extends string> extends Fn {
  return: Omit<this["arg0"], Names>;
}

type WithOmitHoc = <OmitNames extends string>(
  omitNames: OmitNames[]
) => Hoc<OmitFn<OmitNames>>;

export const withOmit = newHoc(function withOmit(
  Component: ComponentType,
  omitNames: string[]
): FunctionComponent {
  const omitSet = new Set(omitNames);

  return function WithOmit(props: any): JSX.Element {
    const newProps = { ...props };
    for (const key in newProps) {
      if (omitSet.has(key)) {
        delete newProps[key];
      }
    }

    return <Component {...newProps} />;
  };
}) as WithOmitHoc;
