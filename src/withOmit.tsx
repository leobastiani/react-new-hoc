import { ComponentType, FunctionComponent } from "react";
import { newHocNamedWithProps } from "./newHoc";
import { render } from "./render";

interface WithOmitHoc {
  <Props extends {}, OmitNames extends readonly string[]>(
    omitNames: OmitNames
  ): <ClosureProps extends Props>(
    Component: ComponentType<ClosureProps>
  ) => FunctionComponent<ClosureOmit<ClosureProps, OmitNames>>;
}

export const withOmit = ((): WithOmitHoc => {
  function withOmit(
    Component: ComponentType,
    omitNames: string[]
  ): FunctionComponent {
    function WithOmit(props: any): JSX.Element {
      const newProps: any = {};
      const omitSet = new Set(omitNames);
      for (const key in props) {
        if (!omitSet.has(key)) {
          newProps[key] = props[key];
        }
      }
      if ("key" in props) {
        newProps.key = props.key;
      }

      return render(Component, newProps);
    }
    return WithOmit;
  }

  return newHocNamedWithProps(withOmit) as WithOmitHoc;
})();
