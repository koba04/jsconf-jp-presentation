import React from "react";
import { JSONRenderer } from "./json-renderer";
import { Container, Instance, TextInstance, Type } from "./json-renderer-types";
import ReactReconciler from "react-reconciler";

export type RootContainer = {
  fiberRoot?: ReactReconciler.FiberRoot;
  container?: Container;
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
      container.fiberRoot = JSONRenderer.createContainer(
        rootContainer,
        false,
        false
      );
    }
    JSONRenderer.updateContainer(element, container.fiberRoot, null, () => {
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
