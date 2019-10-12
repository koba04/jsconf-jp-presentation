import React from "react";
import { VoiceRenderer } from "./voice-renderer";
import { Container } from "./voice-renderer-types";
import ReactReconciler from "react-reconciler";

export type RootContainer = {
  fiberRoot?: ReactReconciler.FiberRoot;
  container?: Container;
};

export const ReactVoice = {
  render(
    element: React.ReactNode,
    container: RootContainer,
    callback = () => {}
  ) {
    let rootContainer: Container;
    if (container.container) {
      rootContainer = container.container;
    } else {
      rootContainer = {
        name: "container",
        logs: [],
        children: []
      };
      container.container = rootContainer;
    }
    if (typeof container.fiberRoot === "undefined") {
      container.fiberRoot = VoiceRenderer.createContainer(
        rootContainer,
        false,
        false
      );
    }
    VoiceRenderer.updateContainer(element, container.fiberRoot, null, () => {
      callback();
    });
  }
};
