import { Props, ReactElement, Type } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { FiberNode } from './fiber';
import { renderWithHooks } from './fiberHooks';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags';

// Compare React Element with FiberNode, and return the child fiber
export function beginWork(workInProgress: FiberNode) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(workInProgress);
    case HostComponent:
      return updateHostComponent(workInProgress);
    case HostText:
      // no children
      return null;
    case FunctionComponent: {
      const Component = workInProgress.type;
      const props = workInProgress.pendingProps;
      return updateFunctionComponent(workInProgress, Component, props);
    }
    default:
      if (__DEV__) {
        console.warn('The type of beginWork is not implemented');
      }
      return null;
  }
}

function updateHostRoot(workInProgress: FiberNode) {
  const baseState = workInProgress.memoizedState;
  const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;

  const { memorizedState } = processUpdateQueue(baseState, pending);
  workInProgress.memoizedState = memorizedState;

  const nextChildren = workInProgress.memoizedState;
  reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(workInProgress: FiberNode) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;

  reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

function updateFunctionComponent(workInProgress: FiberNode, Component: Type, nextProps: Props) {
  const nextChildren = renderWithHooks(workInProgress, Component, nextProps);
  reconcileChildren(workInProgress, nextChildren);

  return workInProgress.child;
}

function reconcileChildren(workInProgress: FiberNode, nextChildren: ReactElement) {
  // Compare the current fiberNode with ReactElement, to get the workInProgress fiberNode
  const current = workInProgress.alternate;

  if (current !== null) {
    // update
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
  } else {
    // mount
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  }
}
