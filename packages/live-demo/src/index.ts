import React from "react";
import { FSRenderer } from "./fs-renderer";
import { Container } from "./fs-renderer-types";
import ReactReconciler from "react-reconciler";
import { rmdirSync } from "fs";

export type RootContainer = {
  fiberRoot?: ReactReconciler.FiberRoot;
  container: Container;
};

const rootContainerMap = new Map<string, RootContainer>();

const createRootContainer: (rootPath: string) => RootContainer = (
  rootPath: string
) => {
  return {
    container: {
      rootPath,
      children: []
    }
  };
};

export const ReactFS = {
  render(element: React.ReactNode, root: string, callback = () => {}) {
    const rootContainer =
      rootContainerMap.get(root) || createRootContainer(root);
    // First, we remove the root to clean up.
    rmdirSync(root, { recursive: true });
    rootContainer.fiberRoot = FSRenderer.createContainer(
      rootContainer.container,
      false,
      false
    );
    FSRenderer.updateContainer(element, rootContainer.fiberRoot, null, () => {
      callback();
    });
  }
};
