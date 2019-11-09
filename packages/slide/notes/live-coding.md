# Describe what I'm going to create

First, I'm going to introduce a custom renderer that I'm going to create.
Let's take a look at README.md.

This is a custom renderer for file system, which creates files and directories declaratively.
This example creates README.md and index.js in a src directory.

Let's start!

# Describe the project structure

Before coding, let's take a look the project structure.

## fs-renderer-types.ts

`fs-renderer-types.ts` is a file to define type definition of `fs-renderer`.
This is a minimum set of definition.
You can see type definition for `Type`, `Props`, `Instance`, `PublicInstance`, `Container`, and so on.

## fs-renderer.ts

`fs-renderer.ts` creates a renderer from a host config object.
I'm passing the host config and type definition for this renderer to create the `fs-renderer`.

## index.ts

`index.ts` is the entry point of `react-fs`.
This exports ReactFS object having render function.
You can think of this like `ReactDOM.render`.

`render` function recives a ReactElement and `rootPath`.
`rootPath` is a root path that ReactFS uses.

Custom renderer needs to create a container by `createContainer`.
`createContainer` returns a `fiberRoot` object, which is used in React internal.
When calling `createContainer`, we have to path a container info as the 1st argument.

We can use the container info from the host config APIs, in this time, we store `rootPath` to refer it from the host config.

Before processing the ReactElement, we remove the rootPath to clean up, which is a very dangerous operation so be careful.
I'll make the implementation more safety.

`createContainer` doesn't render anything. `updateContainer` is the one.
`updateContainer` processes the passed ReactElement.
If we pass a same `fiberRoot` to `updateContainer`, this is treated as an update.
So I store `rootContainer` into a Map object, of which key is a `rootPath`.
As the result, if we call the `render` method with same `rootPath` again, the update is processed as an update.

Finally, we can use `fs-renderer`!

## index.test.tsx

I have some tests to verify that `fs-renderer` works how I expect.
I create a `fs-render` by passing these tests.
If I could pass all tests, I can say that `fs-renderer` works fine!

# Start Coding

## Passing Static TypeChecking

## Create a file

## Create a directory

## Create a file into a directory

## Create a file into a nested directory

## Create multiple fles into a directory

## Update a content of a file

## Update a file name

## Add a new file

## Get an instance removed rootContainerInstance through ref (3ms)