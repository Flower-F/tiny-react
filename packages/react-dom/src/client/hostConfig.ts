import { Props } from 'shared/ReactTypes';

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

export function createInstance(type: string, _props: Props): Instance {
  // TODO: 处理 props
  const domElement = document.createElement(type);
  return domElement;
}

export function appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
  parentInstance.appendChild(child);
}

export function createTextInstance(text: string): TextInstance {
  const textNode = document.createTextNode(text);
  return textNode;
}

export const appendChildToContainer = appendInitialChild;
export const appendChild = appendInitialChild;

export function insertInContainerBefore(
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance,
) {
  container.insertBefore(child, beforeChild);
}

export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance,
) {
  parentInstance.insertBefore(child, beforeChild);
}
