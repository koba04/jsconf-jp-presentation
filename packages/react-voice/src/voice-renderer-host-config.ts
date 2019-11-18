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

// TODO: this is not a place where it should be.
const sideEffect = (method: string, text: string | number) => {
  console.log(method, text);
  spawnSync("say", ["-v", method, text.toString()]);
};

const HOST_CONTEXT: HostContext = {};

export const getPublicInstance = (instance: Instance) => instance;
export const getRootHostContext = (): HostContext => HOST_CONTEXT;
export const getChildHostContext = () => HOST_CONTEXT;

export const prepareForCommit = () => {};
export const resetAfterCommit = () => {};
export const createInstance = (
  type: string,
  props: Props,
  rootContainerInstance: Container
): Instance => ({
  type,
  props,
  rootContainerInstance
});
export const createTextInstance = (
  text: string,
  rootContainerInstance: Container
): TextInstance => ({
  text,
  rootContainerInstance
});
export const appendInitialChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {
  child.parent = parentInstance;
};
export const finalizeInitialChildren = () => true;
export const prepareUpdate = () => ({});
export const shouldSetTextContent = () => false;
export const shouldDeprioritizeSubtree = () => false;

export const appendChildToContainer = () => {};

export const commitMount = (
  instance: Instance,
  type: Type,
  newProps: Props
) => {
  if (
    typeof newProps.children === "string" ||
    typeof newProps.children === "number"
  ) {
    sideEffect(type, newProps.children);
  }
};

export const commitUpdate = (
  instance: Instance,
  updatePayload: UpdatePayload,
  type: Type,
  oldProps: Props,
  newProps: Props
) => {};

export const commitTextUpdate = (
  textInstance: TextInstance,
  oldText: string,
  newText: string
) => {
  if (oldText !== newText) {
    if (typeof textInstance.parent === "undefined") {
      throw new Error(`Can't find the parentInstance: ${newText}`);
    }
    sideEffect(textInstance.parent.type, newText);
    textInstance.text = newText;
  }
};
export const removeChild = () => {};
export const appendChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {
  child.parent = parentInstance;
};

export const scheduleDeferredCallback = () => {};
export const cancelDeferredCallback = () => {};
export const setTimeout = global.setTimeout;
export const clearTimeout = global.clearTimeout;
export const noTimeout = {};
export const now = () => Date.now();

export const isPrimaryRenderer = true;
export const supportsMutation = true;
export const supportsPersistence = false;
export const supportsHydration = false;
