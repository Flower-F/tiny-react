import { appendInitialChild, createInstance, createTextInstance, Instance } from 'hostConfig';
import { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

export function completeWork(workInProgress: FiberNode) {
  const newProps = workInProgress.pendingProps;
  const current = workInProgress.alternate;

  switch (workInProgress.tag) {
    // case IndeterminateComponent:
    // case FunctionComponent:
    //   return null;
    case HostComponent:
      if (current !== null) {
        // update
      } else {
        // mount
        // 1. create the DOM node
        const instance = createInstance(workInProgress.type, newProps);
        // 2. insert the DOM node into the DOM tree
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      }
      bubbleProperties(workInProgress);
      return null;
    case HostText:
      if (current !== null) {
        // update
      } else {
        // mount
        const newText = newProps;
        const instance = createTextInstance(newText);
        workInProgress.stateNode = instance;
      }
      bubbleProperties(workInProgress);
      return null;
    case HostRoot:
      bubbleProperties(workInProgress);
      return null;
    default:
      if (__DEV__) {
        console.warn('The type of completeWork is not implemented');
      }
      return null;
  }
}

function appendAllChildren(parent: Instance, workInProgress: FiberNode) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === workInProgress) {
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function bubbleProperties(completedWork: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = completedWork;
    child = child.sibling;
  }

  completedWork.subtreeFlags |= subtreeFlags;
}
