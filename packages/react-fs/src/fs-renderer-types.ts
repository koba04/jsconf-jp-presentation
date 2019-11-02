export type Type = string;
export type Props = {
  [key: string]: any;
};

// An text instance type for your host environment
export type TextInstance = {
  text: string;
  parent?: Instance;
  rootContainerInstance: Container;
};

// An instance type for your host environment
export type Instance = {
  type: Type;
  props: Props;
  children: ChildrenInstace[];
  parent?: Instance;
  rootContainerInstance: Container;
};

export type ChildrenInstace = Instance | TextInstance;

// This type is expose to users
// react-dom's one is a HTMLElement
export type PublicInstance = Instance | TextInstance;

export type HostContext = {
  name: "context";
};

export type Container = {
  rootPath: string;
  children: ChildrenInstace[];
};

export type HydratableInstance = object;
export type UpdatePayload = object;
export type ChildSet = object;
export type TimeoutHandle = object;
export type NoTimeout = object;
export type OpaqueHandle = any;
