<!-- note

-->

# React Custom Renderer

---------------

<!-- note

-->

# Architecture of React

```text
-------------
| Component | -- Host, Custom
-------------
      |
--------------
| Reconciler | - Fiber, (Stack)
--------------
      |
------------
| Renderer | - ReactDOM, ReactNative, ...
------------
```

---------------

<!-- note

-->

# react-reconciler

```shell
npm install react-reconciler
```

https://github.com/facebook/react/tree/master/packages/react-reconciler


---------------

<!-- note

-->

# How to use

```js
import Reconciler from "react-reconciler";
const renderer = Reconciler(hostconfig);
```

https://github.com/koba04/react-custom-renderer-starter/blob/master/src/json-renderer/index.ts

---------------

<!-- note

-->

# HostConfig Interface

- getPublicInstance, getRootHostContext, getChildHostContext, prepareForCommit, resetAfterCommit, createInstance, appendInitialChild, finalizeInitialChildren, prepareUpdate, shouldSetTextContent, shouldDeprioritizeSubtree, createTextInstance scheduleDeferredCallback, cancelDeferredCallback, setTimeout, clearTimeout, noTimeout, now, isPrimaryRenderer supportsMutation, supportsPersistence, supportsHydration


### Mutation(optional)
- appendChild, appendChildToContainer, commitTextUpdate, commitMount, commitUpdate, insertBefore, insertInContainerBefore, removeChild, removeChildFromContainer,  resetTextContent


### Persistence(optional)
- cloneInstance, createContainerChildSet, appendChildToContainerChildSet, finalizeContainerChildren, replaceContainerChildren


### Hydration(optional)
- canHydrateInstance, canHydrateTextInstance, getNextHydratableSibling, getFirstHydratableChild, hydrateInstance hydrateTextInstance,didNotMatchHydratedContainerTextInstance, didNotMatchHydratedTextInstance, didNotHydrateContainerInstance, didNotHydrateInstance,didNotFindHydratableContainerInstance, didNotFindHydratableContainerTextInstance, didNotFindHydratableInstance, didNotFindHydratableTextInstance

*from @types/react-reconciler*

---------------

<!-- note

-->

# 😇

---------------

<!-- note

-->

# What we implement in HostConfig

- Apply diffs into a host environment
- Create a public instance
- Define the mode you want to use
- Hydration logic if you need

----------------------

<!-- note

-->

# HostConfig of renderers

- ReactDOM
    - https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js
- ReactNative
    - https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeHostConfig.js
    - https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactFabricHostConfig.js
- ReactTestRenderer
    - https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestHostConfig.js
- ink
    - https://github.com/vadimdemedes/ink/blob/master/src/reconciler.js
- react-konva
    - https://github.com/konvajs/react-konva/blob/master/src/ReactKonvaHostConfig.js

----------------------

<!-- note

-->

# Change the index in a list

```js
ReactDOM.render(
    <ul>
        <li key="a">a</li>
        <li key="b">b</li>
        <li key="c">c</li>
    </ul>,
    container
);

ReactDOM.render(
    <ul>
        <li key="b">b</li>
        <li key="a">a</li>
        <li key="c">c</li>
    </ul>,
    container
)
// React update the DOM like the following
// li.removeChild(b);
// li.insertBefore(b, a);
```

----------------------

<!-- note

-->

# Change the index in a list

```js
export function insertBefore(
  parentInstance: Instance,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance
): void {
  // we have to remove a current instance at first
  const index = parentInstance.children.indexOf(child);
  if (index !== -1) {
    parentInstance.children.splice(index, 1);
  }
  // And then, we insert the instance into a new index
  const beforeIndex = parentInstance.children.indexOf(beforeChild);
  parentInstance.children.splice(beforeIndex, 0, child);
}
```

### Mutation(optional)
- appendChild, appendChildToContainer, commitTextUpdate, commitMount, commitUpdate, **insertBefore**, insertInContainerBefore, removeChild, removeChildFromContainer,  resetTextContent
