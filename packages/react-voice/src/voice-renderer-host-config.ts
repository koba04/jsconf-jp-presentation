import Reconciler, { OpaqueHandle } from "react-reconciler";
import { spawnSync } from "child_process";

import {
  Type,
  Instance,
  TextInstance,
  HostContext,
  PublicInstance,
  Props,
  TimeoutHandle,
  NoTimeout,
  UpdatePayload,
  Container
} from "./voice-renderer-types";

const context: HostContext = {
  name: "context"
};

// TODO: this is not a place where it should be.
const sideEffect = (method: string, text: string) => {
  console.log(method, text);
  spawnSync("say", ["-v", method, text]);
};

// HostConfig is used like the following, of which $$$hostConfig is an object exported from a HostConfig file.
// https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js

export function getPublicInstance(
  instance: Instance | TextInstance
): PublicInstance {
  return instance;
}

export function getRootHostContext(
  rootContainerInstance: Container
): HostContext {
  return context;
}

export function getChildHostContext(
  parentHostContext: HostContext,
  type: Type,
  rootContainerInstance: Container
): HostContext {
  return context;
}

export function prepareForCommit(containerInfo: Container): void {
  // noop
}

export function resetAfterCommit(containerInfo: Container): void {
  // noop
}

export function createInstance(
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): Instance {
  return {
    tag: "HOST",
    type,
    props,
    rootContainerInstance,
    children: []
  };
}

export function appendChild(parentInstance: Instance, child: Instance) {
  parentInstance.children.push(child);
}

export function appendChildToContainer(container: Container, child: Instance) {
  container.children.push(child);
}

export function commitMount(
  instance: Instance,
  type: Type,
  newProps: Props,
  internalInstanceHandle: Reconciler.Fiber
) {
  instance.rootContainerInstance.logs.push([
    "commitMount",
    {
      instance,
      type,
      newProps
    }
  ]);
}

// TODO: what ReactDOM does at this
// Maybe ReactDOM updates DOMs based on new and old props.
export function commitUpdate(
  instance: Instance,
  updatePayload: object,
  type: string,
  oldProps: { children: string },
  newProps: { children: string },
  internalInstanceHandle: Reconciler.Fiber
) {
  // TODO: diff oldProps and newProps
  instance.props = newProps;
  if (typeof newProps.children === "string") {
    if (newProps.children !== oldProps.children) {
      sideEffect(type, newProps.children);
    }
  }
}

// Update the TextInstance, ReactDOM update a textNode value
export function commitTextUpdate(
  textInstance: TextInstance,
  oldText: string,
  newText: string
) {
  if (oldText !== newText) {
    textInstance.text = newText;
  }
}

// FIXME: This is probably called on mouting...
export function appendInitialChild(
  parentInstance: Instance,
  child: Instance | TextInstance
): void {
  parentInstance.children.push(child);
}

// This is called when the index has been changed in a list
// so we have to remove an item from the old index and insert a new item with a new index
export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance
): void {
  // we have to remove a current instance at first
  const index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }
  // And then, we insert a new instance into a new index
  const beforeIndex = parentInstance.children.indexOf(beforeChild);
  parentInstance.children.splice(beforeIndex, 0, child);
}

// ReactDOM
// setInitialProperties(domElement, type, props, rootContainerInstance);
// return shouldAutoFocusHostComponent(type, props);
export function finalizeInitialChildren(
  parentInstance: Instance,
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext
): boolean {
  if (typeof props.children === "string") {
    sideEffect(type, props.children);
  }
  return true;
}

export function removeChildFromContainer() {
  // noop
}

// completeWork
// ReactDOM
// return diffProperties
export function prepareUpdate(
  instance: Instance,
  type: Type,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext
): null | UpdatePayload {
  // Return diff properties, which is passed to commitUpdate.
  // if this returns a null, commmitUpdate in this updates never been called.
  return { props: "diffs" };
}

export function shouldSetTextContent(type: Type, props: Props): boolean {
  return false;
}

export function shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
  return false;
}

export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): TextInstance {
  return {
    tag: "TEXT",
    text,
    rootContainerInstance
  };
}

export function scheduleDeferredCallback(
  callback: () => any,
  options?: { timeout: number }
): any {
  // noop
}

export function cancelDeferredCallback(callbackID: any): void {
  // noop
}
// we use the native implementation
export function setTimeout(
  handler: (...args: any[]) => void,
  timeout: number
): TimeoutHandle | NoTimeout {
  return setTimeout(handler, timeout);
}
export function clearTimeout(handle: TimeoutHandle | NoTimeout): void {
  clearTimeout(handle);
}
export const noTimeout = {};

export const now = Date.now;
// Temporary workaround for scenario where multiple renderers concurrently
// render using the same context objects. E.g. React DOM and React ART on the
// same page. DOM is the primary renderer; ART is the secondary renderer.
export const isPrimaryRenderer = true;
export const supportsMutation = true;
export const supportsPersistence = false;
export const supportsHydration = false;
