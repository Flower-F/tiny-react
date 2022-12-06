import { ReactElement } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

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
