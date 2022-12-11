import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { ReactElement } from 'shared/ReactTypes';
import { createFiberFromElement, createFiberFromText, FiberNode } from './fiber';
import { Placement } from './fiberFlags';

function createChildReconciler(shouldTrackSideEffects: boolean) {
  function reconcileSingleElement(returnFiber: FiberNode, _currentFirstChild: FiberNode | null, element: ReactElement) {
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    _currentFirstChild: FiberNode | null,
    textContent: string | number,
  ) {
    const fiber = createFiberFromText(textContent);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(newFiber: FiberNode) {
    // This is simpler for the single child case. We only need to do a placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function reconcileChildFibers(returnFiber: FiberNode, currentFirstChild: FiberNode | null, newChild: ReactElement) {
    // SingleElement
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
        default:
          if (__DEV__) {
            console.warn('The type of reconcileChildFibers is not implemented');
          }
          return null;
      }
    }

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, newChild));
    }

    if (__DEV__) {
      console.warn('The type of reconcileChildFibers is not implemented');
    }
    return null;
  }

  return reconcileChildFibers;
}

export const reconcileChildFibers = createChildReconciler(true);
export const mountChildFibers = createChildReconciler(false);
