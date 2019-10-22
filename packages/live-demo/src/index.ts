import React from "react";
import { JSONRenderer } from "./json-renderer";
import { Container, Instance, TextInstance } from "./json-renderer-types";
import ReactReconciler from "react-reconciler";
import blessed from "blessed";

export type RootContainer = {
  fiberRoot?: ReactReconciler.FiberRoot;
  container: Container;
};

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

export const ReactJSON = {
  createRootContainer(): RootContainer {
    return {
      container: {
        name: "container",
        logs: [],
        children: [],
        screen: blessed.screen({
          smartCSR: true
        })
      }
    };
  },
  render(
    element: React.ReactNode,
    rootContainer: RootContainer,
    callback = () => {}
  ) {
    if (typeof rootContainer.fiberRoot === "undefined") {
      rootContainer.fiberRoot = JSONRenderer.createContainer(
        rootContainer.container,
        false,
        false
      );
    }
    JSONRenderer.updateContainer(element, rootContainer.fiberRoot, null, () => {
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
