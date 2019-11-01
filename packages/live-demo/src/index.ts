import React from "react";
import { JSONRenderer } from "./json-renderer";
import { Container, Instance, TextInstance } from "./json-renderer-types";
import ReactReconciler from "react-reconciler";
import blessed from "blessed";
import { rmdirSync } from "fs";

export type RootContainer = {
  fiberRoot?: ReactReconciler.FiberRoot;
  container: Container;
};

const rootContainerMap = new Map<string, RootContainer>();

const toJSON = (instance: Instance | TextInstance): object | string => {
  if (instance.tag === "TEXT") {
    return instance.text;
  }
  // ignore children in props, we use children in the instance.
  const { children, ...props } = instance.props;
  return {
    type: instance.type,
    props,
    // child might include ReactElement so this is a type mismatch
    children: Array.isArray(instance.children)
      ? instance.children.map((child: any) => toJSON(child))
      : toJSON(instance.children)
  };
};

const createRootContainer: (rootPath: string) => RootContainer = (
  rootPath: string
) => {
  return {
    container: {
      rootPath,
      logs: [],
      effects: [],
      children: []
      /*
      screen: blessed.screen({
        smartCSR: true
      })
      */
    }
  };
};

export const ReactJSON = {
  render(element: React.ReactNode, root: string, callback = () => {}) {
    const rootContainer =
      rootContainerMap.get(root) || createRootContainer(root);
    // First, we remove the root to clean up.
    rmdirSync(root, { recursive: true });
    rootContainer.fiberRoot = JSONRenderer.createContainer(
      rootContainer.container,
      false,
      false
    );
    JSONRenderer.updateContainer(element, rootContainer.fiberRoot, null, () => {
      console.log(rootContainer.container.effects);
      callback();
    });
  },
  toJSON(container: Container): object | string {
    if (container.children.length === 1) {
      return toJSON(container.children[0]);
    }
    return container.children.map(toJSON);
  },
  getLogs(container: RootContainer): any[] {
    return container.container ? container.container.logs : [];
  }
};
