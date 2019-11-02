import {
  Instance,
  HostContext,
  Props,
  Container,
  TextInstance
} from "./fs-renderer-types";
import { Fiber } from "react-reconciler";

const HOST_CONTEXT: HostContext = {
  name: "context"
};

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
  tag: "HOST",
  type,
  props,
  children: [],
  rootContainerInstance
});
export const createTextInstance = (
  text: string,
  rootContainerInstance: Container
): TextInstance => ({
  tag: "TEXT",
  text,
  rootContainerInstance
});
export const appendInitialChild = () => {};
export const finalizeInitialChildren = () => true;
export const prepareUpdate = () => ({});
export const shouldSetTextContent = () => false;
export const shouldDeprioritizeSubtree = () => false;

export const scheduleDeferredCallback = () => {};
export const cancelDeferredCallback = () => {};
export const setTimeout = global.setTimeout;
export const clearTimeout = () => {};
export const noTimeout = () => {};
export const now = () => Date.now();

export const isPrimaryRenderer = true;
export const supportsMutation = true;
export const supportsPersistence = false;
export const supportsHydration = false;
