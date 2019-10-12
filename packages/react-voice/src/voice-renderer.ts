import Reconciler from "react-reconciler";
import * as HostConfig from "./voice-renderer-host-config";
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
} from "./voice-renderer-types";

// eslint-disable-next-line new-cap
export const VoiceRenderer = Reconciler<
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
