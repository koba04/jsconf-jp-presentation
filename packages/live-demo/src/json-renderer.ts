import Reconciler from "react-reconciler";
import * as HostConfig from "./json-renderer-host-config";
import {
  Type,
  Props,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
  Container
} from "./json-renderer-types";

// eslint-disable-next-line new-cap
export const JSONRenderer = Reconciler<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
>(HostConfig);
