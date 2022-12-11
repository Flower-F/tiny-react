import { Key, Props, ReactElement, Ref, Type } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { UpdateQueue } from './updateQueue';
import { FunctionComponent, HostComponent, HostText, WorkTag } from './workTags';

export class FiberNode {
  type: any;
  tag: WorkTag;
  pendingProps: Props;
  key: Key;
  stateNode: any;
  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;
  ref: Ref;
  memoizedProps: Props;
  alternate: FiberNode | null;
  flags: Flags;
  updateQueue: UpdateQueue<unknown> | null;
  memoizedState: any;
  subtreeFlags: number;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.stateNode = null;
    this.type = null;

    // Fiber
    this.return = null; // point to the parent fiber
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.ref = null;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;

    // Effects
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;

    this.alternate = null;
  }
}

// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current: FiberNode, pendingProps: unknown): FiberNode {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    // mount
    workInProgress = new FiberNode(current.tag, pendingProps, current.key);
    workInProgress.stateNode = current.stateNode;

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // update
    workInProgress.pendingProps = pendingProps;
    // cleanup the side effects
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }

  workInProgress.type = current.type;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;

  return workInProgress;
}

export function createFiberFromElement(element: ReactElement) {
  const { type, key, props: pendingProps } = element;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps);
  return fiber;
}

export function createFiberFromText(content: string | number) {
  const fiber = new FiberNode(HostText, content, null);
  return fiber;
}

function createFiberFromTypeAndProps(type: Type, key: Key, pendingProps: unknown) {
  let fiberTag: WorkTag = FunctionComponent;

  if (typeof type === 'string') {
    // <div /> => { type: 'div' }
    fiberTag = HostComponent;
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn(
      `Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: ${
        type === null ? type : typeof type
      }`,
    );
  }

  const fiber = new FiberNode(fiberTag, pendingProps, key);
  fiber.type = type;

  return fiber;
}
