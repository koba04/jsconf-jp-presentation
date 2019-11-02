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

export const appendChildToContainer = (
  container: Container,
  child: Instance | TextInstance
) => {
  container.children.push(child);
};

const buildParentDirectoryPath = (
  instance: Instance | TextInstance
): string => {
  const paths = [];
  let current = instance.parent;
  while (current) {
    paths.push(current.props.name);
    current = current.parent;
  }
  paths.push(instance.rootContainerInstance.rootPath);
  return path.join(...paths.reverse());
};

export const commitMount = (
  instance: Instance,
  type: Type,
  newProps: Props
) => {
  const parentPath = buildParentDirectoryPath(instance);
  const targetPath = path.join(parentPath, newProps.name);

  if (!existsSync(parentPath)) {
    mkdirSync(parentPath, { recursive: true });
  }

  if (type === "file") {
    writeFileSync(path.join(parentPath, newProps.name), newProps.children);
  } else if (type === "directory") {
    if (!existsSync(targetPath)) {
      mkdirSync(path.join(parentPath, newProps.name));
    }
  }
  // console.log(instance, type, newProps);
};

export const commitUpdate = (
  instance: Instance,
  updatePayload: UpdatePayload,
  type: Type,
  oldProps: Props,
  newProps: Props
) => {
  if (oldProps.name !== newProps.name) {
    renameSync(
      path.join(buildParentDirectoryPath(instance), oldProps.name),
      path.join(buildParentDirectoryPath(instance), newProps.name)
    );
  }
  instance.props = newProps;
};

export const commitTextUpdate = (
  textInstance: TextInstance,
  oldText: string,
  newText: string
) => {
  if (oldText !== newText) {
    writeFileSync(buildParentDirectoryPath(textInstance), newText);
  }
};
export const removeChild = () => {};
export const appendChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {
  parentInstance.children.push(child);
  child.parent = parentInstance;
};

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
