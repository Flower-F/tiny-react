import { Container } from 'hostConfig';
import { ReactNode } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { FiberRootNode } from './fiberRoot';
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';

export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}

export function updateContainer(element: ReactNode, root: FiberRootNode) {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactNode>(element);

  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactNode>, update);

  scheduleUpdateOnFiber(hostRootFiber);

  return element;
}
