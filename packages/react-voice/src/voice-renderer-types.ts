export type Type = string;
export type Props = {
  [key: string]: any;
};

export type TextInstance = {
  text: string;
  parent?: Instance;
  rootContainerInstance: Container;
};

export type Instance = {
  type: Type;
  props: Props;
  parent?: Instance;
  rootContainerInstance: Container;
};

export type ChildrenInstace = Instance | TextInstance;
export type PublicInstance = Instance | TextInstance;

export type HostContext = {};
export type Container = {};

export type HydratableInstance = object;
export type UpdatePayload = object;
export type ChildSet = object;
export type TimeoutHandle = object;
export type NoTimeout = object;
export type OpaqueHandle = any;
