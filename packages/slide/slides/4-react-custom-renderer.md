<!-- note
Before explaining Custom Renderer, I'd like to introduce existing renderers.
-->

# React Custom Renderer

----------------------

<!-- note
I guess that you already know `react-native`, `react-test-renderer`.
There are more renderers for various environments.

So I'd like to introduce those renderers briefly.
-->

# Renderers

<img src="../images/renderers.png" />

----------------------

<!-- note
React Native is a renderer for Native Apps like iOS and Android.
Of course, This is implemented as a custom renderer.
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
Ink is a custom renderer for CLI output.
This makes it easy to create interactive command line applications.
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
React Konva is a custom renderer for Canvas.
This makes it possible to draw canvas graphics declaratively.
-->

# ReactKonva

```js
ReactKonva.render(
    <Stage width={300} height={300}>
      <Layer>
        <Text text="Hello, world!" fontSize={30} />
        <Star
          x={50}
          y={70}
          innerRadius={20}
          outerRadius={40}
          fill="tomato"
        />
      </Layer>
    </Stage>,
    el
);
```

---------------

<!-- note
React Three Fiber is a custom renderer for Three.js.
This makes it possible to draw 3D graphics declaratively.
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
This is an interesting renderer.
React AST is a custom renderer for AST. What??

You can define an abstract syntax tree declaratively as JSX.
This can generate source code and an AST object from JSX.

I'm not sure whether it's useful or not.
But It's fun!
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
Custom renderer is useful even on a DOM environment.
If you feel that the size of React DOM is so big.
You can create a lightweight React DOM implementation as a custom renderer like ReactDOMLite.

If you are interested in creating a custom renderer for DOM.
I recommend watching the video of Sophie's talk at this year's React Conf.

Before going over React custom renderer, I'd like to introduce the architecture of React.
-->

# Building a Custom React DOM Renderer

- https://github.com/jquense/react-dom-lite
- https://conf.reactjs.org/event.html?sophiebits

---------------


<!-- note
This is an overview of the architecture of React.

Component is a layer to define components.
Host components are provided by a renderer.
ReactDOM provides DOM components as host components.
these components start with a lower case.
These are processed by a renderer.

Custom components are built by application developers.
These are what you create for your applications.

Reconciler is a layer of React core.
It manages updates and calls functions of a host config.
It makes possible many features like Hooks, Suspense, and Concurrent Mode.

Finally, Renderer is a layer for an implementation depending on a host environment.
So when we create a custom renderer, we have to implement this.

In other words, you can enable Hooks, Suspense, and Concurrent Mode on your custom renderer without implementing them yourself.

If you are interested in the architecure, you can see my slide, "Algorithms in React".
-->

# Architecture of React


<img src="../images/architecture.png" />

- https://speakerdeck.com/koba04/algorithms-in-react

---------------

<!-- note
Ok, It's time to imeplement a custom renderer!

First, we have to install `react-reconciler` package from npm.
-->

# react-reconciler

```shell
npm install react-reconciler
```

[packages/react-reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler)


---------------

<!-- note
And then, we can create a renderer by passing a host config to the reconciler.

After creating a renderer, we create a container for the renderer at the first rendering.
And then, we update the container to render the passed element.

`createContainer` doesn't render anything. `updateContainer` is the one.
`updateContainer` processes the passed ReactElement.
If we pass a same `fiberRoot` to `updateContainer`, this is treated as an update.

Next, let's see the host config interface.
-->

# How to use

```js
import Reconciler from "react-reconciler";

const renderer = Reconciler(hostconfig);

export const YourReact = {
  render(
    element: React.ReactNode,
    rootContainer: RootContainer,
    callback = () => {}
  ) {
    if (!rootContainer.container) {
      rootContainer.container = {}
      rootContainer.container.fiberRoot = renderer.createContainer(
        container,
        false,
        false
      );
    }
    renderer.updateContainer(element, container.fiberRoot, null, callback);
  }
}
```

---------------

<!-- note
You have to implement many interfaces to create a custom renderer.
Here is the interfaces.

The first part is the interfaces you must implement.
The second part is an optional interfaces for mutation.
We have to implement them if we'd like to use a mutation mode.

Number 1 means that there is a Number 2...
Yes, they are not all.
-->

# HostConfig Interface \#1


> getPublicInstance, getRootHostContext, getChildHostContext, prepareForCommit, resetAfterCommit, createInstance, appendInitialChild, finalizeInitialChildren, prepareUpdate, shouldSetTextContent, shouldDeprioritizeSubtree, createTextInstance scheduleDeferredCallback, cancelDeferredCallback, setTimeout, clearTimeout, noTimeout, now, isPrimaryRenderer supportsMutation, supportsPersistence, supportsHydration


### Mutation(optional)

> appendChild, appendChildToContainer, commitTextUpdate, commitMount, commitUpdate, insertBefore, insertInContainerBefore, removeChild, removeChildFromContainer,  resetTextContent

---------------

<!-- note
Let's move on Number 2.
The first part includes optional interfaces for persistence mode.
If you'd like to impelement your custom renderer as persistence mode, you have to implement these interfaces.
The persistence mode is a mode to treat its instance as immutable.
React Native has a project for a new architecture called Fabric,
which uses Persistence mode.


The second part is an optional interfaces for hydration.
If you'd like to support hydration on your renderer, you have to implement these interfaces.
ReactDOM is implemented by these functions.

I won't talk about Persistence and Hydration mode in this talk.
So if you are interested in them, you can see the host configs of ReactNativeFabric and ReactDOM.
-->

# HostConfig Interface \#2

### Persistence(optional)

> cloneInstance, createContainerChildSet, appendChildToContainerChildSet, finalizeContainerChildren, replaceContainerChildren


### Hydration(optional)

> canHydrateInstance, canHydrateTextInstance, getNextHydratableSibling, getFirstHydratableChild, hydrateInstance hydrateTextInstance,didNotMatchHydratedContainerTextInstance, didNotMatchHydratedTextInstance, didNotHydrateContainerInstance, didNotHydrateInstance,didNotFindHydratableContainerInstance, didNotFindHydratableContainerTextInstance, didNotFindHydratableInstance, didNotFindHydratableTextInstance

*from @types/react-reconciler*

---------------

<!-- note
Does it seems to be too complecated?
I see...
But you don't have to impelement all interfaces!!
Many functions might be ok as empty functions.

You can impelement the interfaces incrementally.
-->

# 😇

----------------------

<!-- note
These are host configs of renderers I've introduced.
So I recommend referencing the host configs while implementing your custom renderer, which are very useful.
-->

# HostConfig of renderers

- ReactDOM
    - [packages/react-dom/src/client/ReactDOMHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js)
- ReactNative
    - [packages/react-native-renderer/src/ReactNativeHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeHostConfig.js)
    - [packages/react-native-renderer/src/ReactFabricHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactFabricHostConfig.js)
- ReactTestRenderer
    - [packages/react-test-renderer/src/ReactTestHostConfig.js](https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestHostConfig.js)
- Ink
    - [vadimdemedes/ink/blob/master/src/reconciler.js](https://github.com/vadimdemedes/ink/blob/master/src/reconciler.js)
- ReactKonva
    - [konvajs/react-konva/blob/master/src/ReactKonvaHostConfig.js](https://github.com/konvajs/react-konva/blob/master/src/ReactKonvaHostConfig.js)

----------------------

<!-- note
By the way, what do we implement on the host config?
we have to implement side-effects for the host environment and define a public instance and internal instance.
And we have to define the mode of your renderer and hydration logics if you need it.

Let's go over them.
-->

# HostConfig?

- Side effects for a Host environment
- Define instances
- Define the mode for a renderer
- Hydration logic (if you need)

---------------

<!-- note
The APIs for side effects are very similar with DOM APIs
So if you are faimilar with DOM APIs, you can understand them easily.
-->

# Side effects for a Host environment

---------------
<!-- note
Before describing the APIs, let's take a look at a previous example.
With ReactDOM, this change is processed as an insertBefore function.

What if we implement the function as a custom renderer?
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
// li.insertBefore(b, a);
```

----------------------

<!-- note
we implement the function as the insertBefore function like this.
when implmenting a custom renderer, writing imperative operations is your job.
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
You can imagine the implementation of many functions from the name.
But there is a caveat for commitMount.

commitMount is only called when finalizeInitialChildren returns true.
ReactDOM uses the function to implement autoFocus attribute.
ReactDOM returns true from finalizeInitialChildren if the tag is button, input, select, or textarea and autoFucos prop is true.
-->

# Others

- appendChild, appendInitialChild, appendChildToContainer
- commitTextUpdate, commitMount, commitUpdate
- insertBefore, insertInContainerBefore
- removeChild, removeChildFromContainer, resetTextContent

---------------

<!-- note
Let's move on to the defining instance.

createInstance and createTextInstance are important, which return an instance that we use in the host config.
You can return an instance as you want.

ReactDOM uses DOM APIs like createElement and createTextNode for these functions.
So ReactDOM returns a DOM node from the functions.
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
getPublicInstance is a function to define a public instance, which receives an instance and returns a public instance.
you can convert an instance to what you want to expose.

ReactDOM returns a passed instance without doing anything.
So you can get a DOM node reference through a `ref` prop.
-->

# getPublicInstance

```js
export function getPublicInstance(
  instance: Instance
): PublicInstance {
  return convertToPublicInstance(instance);
  // react-dom
  // return instance;
}
```

---------------

<!-- note
These are flags to determine how your custom renderer works.
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
For TypeScript users, you can define type definition for your host components like this.
You can override type definition for IntrisicElements.

OK, let's move on the final part.
Live coding.
-->

# Type Definition for custom host config

```js
declare namespace JSX {
  interface IntrinsicElements {
    text: {
      color: string;
      children?: React.ReactNode;
    };
  }
}
```

https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements