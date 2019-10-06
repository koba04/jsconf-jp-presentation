# React Custom Renderer

---------------

# Architecture of React

- Component
    - Host
    - Custom
- Reconcler
- Renderer

---------------

# react-reconciler

```
npm install react-reconciler
```

https://github.com/facebook/react/tree/master/packages/react-reconciler


---------------

# How to use

```
import Reconciler from "react-reconciler";
const renderer = Reconciler(hostconfig);
```

https://github.com/koba04/react-custom-renderer-starter/blob/master/src/json-renderer/index.ts

---------------

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

# 😇

---------------

# What we implement in HostConfig

- Apply diffs into a host environment
- Create a public instance
- Define the mode you want to use
- Hydration logic if you need

----------------------

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