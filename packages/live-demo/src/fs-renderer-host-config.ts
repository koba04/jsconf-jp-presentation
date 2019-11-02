import Reconciler, { OpaqueHandle } from "react-reconciler";
import fs from "fs";
import path from "path";

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
} from "./fs-renderer-types";
import { debug } from "./logger";

const context: HostContext = {
  name: "context"
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
  if (!fs.existsSync(containerInfo.rootPath)) {
    fs.mkdirSync(containerInfo.rootPath, { recursive: true });
  }
  debug("prepareForCommit", { containerInfo });
}

export function resetAfterCommit(containerInfo: Container): void {
  debug("resetAfterCommit", { containerInfo });
}

export function createInstance(
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): Instance {
  debug("createInstance", {
    type,
    props,
    rootContainerInstance,
    hostContext,
    children: props.children
  });
  return {
    tag: "HOST",
    type,
    props,
    rootContainerInstance,
    children: []
  };
}

export function appendChild(parentInstance: Instance, child: Instance) {
  debug("appendChild", { parentInstance, child });
  parentInstance.children.push(child);
  child.parent = parentInstance;
}

// This is called on commitWork, which append DOM nodes to the container that is passed as the second argument of ReactDOM.render.
// As the result, React Components are mounted at the DOM tree, which is a side-effect.
export function appendChildToContainer(container: Container, child: Instance) {
  debug("appendChildToContainer", { container, child });
  container.children.push(child);
}

const buildPath = (inst: Instance | undefined) => {
  const paths: string[] = [];
  let current: Instance | undefined = inst;
  if (typeof inst === "undefined") {
    return paths;
  }
  while (current) {
    paths.push(current.props.name);
    current = current.parent;
  }
  return [inst.rootContainerInstance.rootPath, ...paths.reverse()];
};

// ReactDOM call .focus() for components that have autoFocus prop
// https://github.com/facebook/react/blob/42b75ab007a5e7c159933cfdbf2b6845d89fc7f2/packages/react-dom/src/client/ReactDOMHostConfig.js#L346-L351
// Despite the naming that might imply otherwise, this method only
// fires if there is an `Update` effect scheduled during mounting.
// This happens if `finalizeInitialChildren` returns `true` (which it
// does to implement the `autoFocus` attribute on the client). But
// there are also other cases when this might happen (such as patching
// up text content during hydration mismatch). So we'll check this again.
export function commitMount(
  instance: Instance,
  type: Type,
  newProps: Props,
  internalInstanceHandle: Reconciler.Fiber
) {
  debug("commitMount", {
    instance,
    type,
    newProps /* , internalInstanceHandle */
  });

  if (type === "file") {
    if (instance.parent) {
      fs.mkdirSync(path.join(...buildPath(instance.parent)), {
        recursive: true
      });
      fs.writeFileSync(
        path.join(...buildPath(instance.parent), newProps.name),
        newProps.children
      );
      // a file in children of rootContainer
    } else {
      fs.writeFileSync(
        path.join(instance.rootContainerInstance.rootPath, newProps.name),
        newProps.children
      );
    }
  }
  if (type === "directory") {
    fs.mkdirSync(path.join(...buildPath(instance)), {
      recursive: true
    });
  }
}

// TODO: what ReactDOM does at this
// Maybe ReactDOM updates DOMs based on new and old props.
export function commitUpdate(
  instance: Instance,
  updatePayload: object,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Reconciler.Fiber
) {
  debug("commitUpdate", {
    instance,
    updatePayload,
    type,
    oldProps,
    newProps
  });
  // TODO: diff oldProps and newProps
  if (newProps.name !== oldProps.name) {
    fs.renameSync(
      path.join(...buildPath(instance)),
      path.join(...buildPath({ ...instance, props: newProps }))
    );
  }
  instance.props = newProps;
}

// Update the TextInstance, ReactDOM update a textNode value
export function commitTextUpdate(
  textInstance: TextInstance,
  oldText: string,
  newText: string
) {
  debug("commitTextUpdate", { textInstance, oldText, newText });
  if (oldText !== newText) {
    // textInstance.inst.setText(newText);
    // textInstance.rootContainerInstance.screen.render();
    textInstance.text = newText;
    //    fs.readFileSync();
    fs.writeFileSync(path.join(...buildPath(textInstance.parent)), newText);
  }
}

// FIXME: This is probably called on mouting...
export function appendInitialChild(
  parentInstance: Instance,
  child: Instance | TextInstance
): void {
  debug("appendInitialChild", { parentInstance, child });
  if (child.tag === "TEXT") {
    // child.rootContainerInstance.screen.append(child.inst);
    // child.rootContainerInstance.screen.render();
  }
  child.parent = parentInstance;
  parentInstance.children.push(child);
}

// This is called when the index has been changed in a list
// so we have to remove an item from the old index and insert a new item with a new index
export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance
): void {
  debug("insertBefore", { parentInstance, child, beforeChild });
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
  debug("finalizeInitialChildren");
  return true;
}

export function removeChildFromContainer() {
  debug("removeChildFromContainer");
}

export function removeChild(parent: Instance, instance: Instance) {
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
  debug("prepareUpdate");
  // Return diff properties, which is passed to commitUpdate.
  // if this returns a null, commmitUpdate in this updates never been called.
  return {};
}

export function shouldSetTextContent(type: Type, props: Props): boolean {
  debug("shouldSetTextContent");
  return false;
}

export function shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
  debug("shouldDeprioritizeSubtree");
  return false;
}

// FIXME: this is a temporary hack
let top = 0;
export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): TextInstance {
  debug("createTextInstance");
  top += 1;
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
