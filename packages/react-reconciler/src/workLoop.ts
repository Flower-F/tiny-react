import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { FiberRootNode } from './fiberRoot';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // schedule
  const root = markUpdateFromFiberToRoot(fiber);

  if (root === null) {
    return;
  }

  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = fiber.return;

  // The hostRootFiber doesn't have the return pointer
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  if (node.tag === HostRoot) {
    return node.stateNode;
  }

  return null;
}

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);

  do {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn('Some errors happen in workLoop:', error);
      }
      // workInProgress = null;
    }
  } while (true);

  if (workInProgress !== null) {
    // This is a sync render, so we should have finished the whole tree.
    throw new Error(
      'Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.',
    );
  }

  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }

  if (__DEV__) {
    console.warn('begin to commit: ', finishedWork);
  }

  root.finishedWork = null;

  const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation

    // Mutation
    commitMutationEffects(root, finishedWork);
    root.current = finishedWork;

    // Layout
  } else {
    root.current = finishedWork;
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork: FiberNode) {
  const next = beginWork(unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    // go on
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork: FiberNode) {
  let completedWork: FiberNode | null = unitOfWork;

  do {
    const next = completeWork(completedWork);
    if (next !== null) {
      workInProgress = next;
      return;
    }

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      workInProgress = siblingFiber;
      return;
    }

    // go back
    completedWork = completedWork.return;
    workInProgress = completedWork;
  } while (completedWork !== null);
}
