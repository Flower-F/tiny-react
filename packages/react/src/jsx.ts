import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Type, Key, Ref, Props, ElementType, ReactElement } from 'shared/ReactTypes';

/** The constructor of  ReactElement */
function ReactElement(type: Type, key: Key, ref: Ref, props: Props): ReactElement {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    key,
    ref,
    props,
    type,
    __mark: 'YunHan',
  };

  return element;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const propName in config) {
    const val = config[propName];
    if (propName === 'key') {
      if (val !== undefined) {
        key = String(val);
      }
      continue;
    }
    if (propName === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // Remaining properties are added to a new props object
    if ({}.hasOwnProperty.call(config, propName)) {
      props[propName] = val;
    }
  }

  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    // the props.children could be only an element or an array
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }

  return ReactElement(type, key, ref, props);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const propName in config) {
    const val = config[propName];
    if (propName === 'key') {
      if (val !== undefined) {
        key = String(val);
      }
      continue;
    }
    if (propName === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // Remaining properties are added to a new props object
    if ({}.hasOwnProperty.call(config, propName)) {
      props[propName] = val;
    }
  }

  return ReactElement(type, key, ref, props);
};
