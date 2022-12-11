import { Props, Type } from 'shared/ReactTypes';
import { FiberNode } from './fiber';

export function renderWithHooks(_workInProgress: FiberNode, Component: Type, props: Props) {
  const children = Component(props);
  return children;
}
