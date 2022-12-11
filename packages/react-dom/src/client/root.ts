// ReactDOM.createRoot(root).render(<App />)

import { createContainer, updateContainer } from 'react-reconciler/src/fiberReconciler';
import { ReactNode } from 'shared/ReactTypes';
import { Container } from './hostConfig';

export type RootType = {
  render(children: ReactNode): void;
  // unmount(): void,
};

export function createRoot(container: Container): RootType {
  const root = createContainer(container);

  return {
    render(children) {
      return updateContainer(children, root);
    },
  };
}
