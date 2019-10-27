<!-- note
Before explaining Custom Renderer, I'd like to introduce existing renderers.
-->

# React Custom Renderer

----------------------

<!-- note
Do you know `react-native`, `ink`, `react-konva`?

-->

# Renderers

- `react-native` ... Native Apps
- `react-test-renderer` ... For testing components
- `ink` ... CLI Output
- `react-konva` ... Canvas
- `react-three-fiber` ... Threejs
- `react-ast` ... AST

and so on...

----------------------

<!-- note

-->

# ReactNative

```js
<View
    style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }}
>
    <Text style={{ fontSize: 50 }}>
        Hello, world!
    </Text>
</View>
```

----------------------

<!-- note

-->

# Ink

```js
import React from 'react';
import {render, Box, Color} from 'ink';

render(
  <Box>
      <Color green>Hello world!</Color>
  </Box>
);
```

----------------------

<!-- note

-->

# ReactKonva

```js
ReactKonva.render(
    <Stage width={100} height={100}>
        <Layer>
            <Text text="Hello world!" />
        </Layer>
    </Stage>,
    el
);
```

---------------

<!-- note

-->

# ReactThreeFiber

```js
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame } from 'react-three-fiber'

const Cube = () => {
    const ref = useRef()
    useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))
    return (
        <mesh ref={ref}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshNormalMaterial attach="material" />
        </mesh>
    )
}
ReactDOM.render(<Canvas><Cube /></Canvas>, el);
```


---------------

<!-- note

-->

# ReactAST

```js
import React from 'react';
import {
    renderAst,
    Code,
    ClassDeclaration,
    FunctionDeclaration
} from 'react-ast';

const ast = renderAst(
    <ClassDeclaration name="Hello" superClassName="Array">
        <Code>const hello = 'world'</Code>
        <FunctionDeclaration name="foo">
            <Code>return 'bar'</Code>
        </FunctionDeclaration>
    </ClassDeclaration>
);

console.log(ast);
```

---------------
<!-- note
You can create alternative React DOM implementation
-->

# React DOM Lite

- https://github.com/jquense/react-dom-lite

---------------


<!-- note

-->

# Architecture of React


<img src="../images/architecture.png" />

---------------
<!-- note

-->

# Algorithms in React

- https://speakerdeck.com/koba04/algorithms-in-react


---------------

<!-- note

-->

# react-reconciler

```shell
npm install react-reconciler
```

[packages/react-reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler)


---------------

<!-- note

-->

# How to use

```js
import Reconciler from "react-reconciler";
const renderer = Reconciler(hostconfig);
```

[koba04/react-custom-renderer-starter](https://github.com/koba04/react-custom-renderer-starter/blob/master/src/json-renderer/index.ts)

---------------

<!-- note

-->

# HostConfig Interface \#1


> getPublicInstance, getRootHostContext, getChildHostContext, prepareForCommit, resetAfterCommit, createInstance, appendInitialChild, finalizeInitialChildren, prepareUpdate, shouldSetTextContent, shouldDeprioritizeSubtree, createTextInstance scheduleDeferredCallback, cancelDeferredCallback, setTimeout, clearTimeout, noTimeout, now, isPrimaryRenderer supportsMutation, supportsPersistence, supportsHydration


### Mutation(optional)

> appendChild, appendChildToContainer, commitTextUpdate, commitMount, commitUpdate, insertBefore, insertInContainerBefore, removeChild, removeChildFromContainer,  resetTextContent

---------------

<!-- note

-->

# HostConfig Interface \#2

### Persistence(optional)

> cloneInstance, createContainerChildSet, appendChildToContainerChildSet, finalizeContainerChildren, replaceContainerChildren


### Hydration(optional)

> canHydrateInstance, canHydrateTextInstance, getNextHydratableSibling, getFirstHydratableChild, hydrateInstance hydrateTextInstance,didNotMatchHydratedContainerTextInstance, didNotMatchHydratedTextInstance, didNotHydrateContainerInstance, didNotHydrateInstance,didNotFindHydratableContainerInstance, didNotFindHydratableContainerTextInstance, didNotFindHydratableInstance, didNotFindHydratableTextInstance

*from @types/react-reconciler*

---------------

<!-- note

-->

# 😇

----------------------

<!-- note

-->

# HostConfig of renderers

- ReactDOM
    - [packages/react-dom/src/client/ReactDOMHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js)
- ReactNative
    - [packages/react-native-renderer/src/ReactNativeHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeHostConfig.js)
    - [packages/react-native-renderer/src/ReactFabricHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactFabricHostConfig.js)
- ReactTestRenderer
    - [packages/react-test-renderer/src/ReactTestHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestHostConfig.js)
- ink
    - [vadimdemedes/ink/blob/master/src/reconciler.js](https://github.com/vadimdemedes/ink/blob/master/src/reconciler.js)
- react-konva)
    - [konvajs/react-konva/blob/master/src/ReactKonvaHostConfig.js](https://github.com/konvajs/react-konva/blob/master/src/ReactKonvaHostConfig.js)

----------------------

<!-- note

-->

# HostConfig?

- Side effects for a Host environment
- Define public instance
- Define the mode for a renderer
- Hydration logic (if you need)

---------------

<!-- note
APIs for side effects are very similar with DOM APIs
-->

# Side effects for a Host environment

---------------
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
### Mutation(optional)

-->

# insertBefore

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

----------------------

<!-- note

-->

# Others

- appendChild, appendInitialChild, appendChildToContainer
- commitTextUpdate, commitMount, commitUpdate
- insertBefore, insertInContainerBefore
- removeChild, removeChildFromContainer, resetTextContent

---------------

<!-- note

-->

# Define public instance

---------------

<!-- note

-->

# createInstance, createTextInstance

```js
export function createInstance(
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): Instance {
  return createYourHostInstance(type, props);
}

export function createTextInstance(
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): TextInstance {
  return createYourTextInstacne(text);
}
```

---------------

<!-- note

-->

# getPublicInstance

```js
export function getPublicInstance(
  instance: Instance | TextInstance
): PublicInstance {
  return convertToPublicInstance(instance);
  // react-dom
  // return instance;
}
```

---------------

<!-- note

-->

# Define the mode for a renderer

```js
export const isPrimaryRenderer = true;
export const supportsMutation = true;
export const supportsPersistence = false;
export const supportsHydration = false;
```

---------------
<!-- note

-->

# Type Definition for custom host config

```js
namespace JSX {
  interface IntrinsicElements {
    text: {
      color: string;
      children?: React.ReactNode;
    };
  }
}
```

https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements