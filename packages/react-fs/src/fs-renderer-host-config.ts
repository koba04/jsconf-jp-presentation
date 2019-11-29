import {
  Instance,
  HostContext,
  Props,
  Container,
  TextInstance,
  Type,
  UpdatePayload
} from "./fs-renderer-types";
import path from "path";
import { writeFileSync, existsSync, mkdirSync, renameSync } from "fs";

const HOST_CONTEXT: HostContext = {};

export const getPublicInstance = (instance: Instance) => {
};
export const getRootHostContext = (): HostContext => HOST_CONTEXT;
export const getChildHostContext = () => HOST_CONTEXT;

export const prepareForCommit = () => {};
export const resetAfterCommit = () => {};
export const createInstance = (
  type: string,
  props: Props,
  rootContainerInstance: Container
): Instance => {}
export const createTextInstance = (
  text: string,
  rootContainerInstance: Container
): TextInstance => {}
export const appendInitialChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {};
export const finalizeInitialChildren = () => true;
export const prepareUpdate = () => ({});
export const shouldSetTextContent = () => false;
export const shouldDeprioritizeSubtree = () => false;

export const appendChildToContainer = () => {};

export const commitMount = (
  instance: Instance,
  type: Type,
  newProps: Props
) => {};

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
) => {};
export const removeChild = () => {};
export const appendChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {};

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
