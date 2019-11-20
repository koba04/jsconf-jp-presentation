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
I'm passing the host config and type definition to create the `fs-renderer`.

## index.ts

`index.ts` is the entry point of `react-fs`.
This exports ReactFS object having render function.
You can think of this like `ReactDOM.render`.

`render` function receives a ReactElement and `rootPath`.
`rootPath` is a root path of a working directory.

Custom renderer needs to create a container by `createContainer`.
We can use the container info from the host config APIs, so we store `rootPath` to refer it later.

Before processing the ReactElement, we remove the all files under the rootPath to clean up, which is a very dangerous operation so be careful to use this renderer.
I'll make the implementation more safe.

Finally, we can use `fs-renderer`!

## index.test.tsx

I have some tests to verify that `fs-renderer` works how I expect.
If I could pass all tests, I can say that `fs-renderer` works fine!

We use `tmpdir` for the `rootPath` of the tests.

# Start Coding

OK, Let's start coding!!

## Create a file

First, let's run `yarn test` to run the unit tests.
We define `xit` so all tests never run.

So I change the first test from `xit` to `it`.
The test is `should be able to create a file`.

This is a case to create a file using `file` component.

Let's run again with `watch` option.

> yarn test --watch

The test was failed.
Let's see the host config file.

You can see type errors at `createInstance` and `createTextInstance`.
Let's fix them at first.

`createIntance` must returns a `Instance`.
`createTextIntance` must returns a `TextInstance`.
But currently, both functions returns nothing.
So I implement this.

> impl...

OK, type errors has gone.

But the test is still failing.

So I imeplement to create a file.
Let's implement this into `commitMount`.
Our `finalizeInitialChildren` returns `true` so `commitMount` is always called.

```ts
  const { rootPath } = instance.rootContainerInstance;
  if (type === "file") {
    writeFileSync(path.join(rootPath, newProps.name), newProps.children);
  }
```

The test is still failed.
Because we have to create a `rootPath` directory before creating a file.

```ts
  if (!existsSync(rootPath)) {
    mkdirSync(rootPath);
  }
```

The first test has been passed!

## Create a directory

Let's move on to the next test.
The next test is "should be able to create a directory".

In order to pass the test, I have to add implementation for `directory` component.
First, I create `targetPath` to store the target file path.

```ts
  const targetPath = path.join(rootPath, newProps.name);
```

And then, I create a directory if the type is `directory`.

```ts
  } else if (type === "directory") {
    mkdirSync(targetPath);
  }
```

OK, the test is passed!

## Create a file into a directory

Let's move on to the next test.
The next test is "should be able to create a file into a directory".

Because `commitMount` is called from `child` to `parent`.
So when `commitMount` for a file is called, the parent directory hasn't been created yet.

So I have to create a directory if the parent directory doesn't exist.
But I don't have a way to know the parent directory.
So let's add a `parent` property into `Instance` and `TextInstannce`.

The type definition is already defined so I add the parent property at `appendInitialChild`.

```ts
export const appendInitialChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {
  child.parent = parentInstance;
};
```

OK, let's create a path for parent directory instead of `rootPath`.

In order to this, I create a `buildParentPath` function.
This function accepts an instance or textInstance and returns the parent directory path.

First, I create an array to store directory names.
And then I return a path of the parent directory.
But I process instances from child to parent so I have to reverse the order of the directories.

```ts
const buildParentPath = (instance: Instance | TextInstance): string => {
  const names = [];
  let current = instance.parent;
  while (current) {
    names.push(current.props.name);
    current = current.parent;
  }
  return path.join(instance.rootContainerInstance.rootPath, ...names.reverse());
};
```

OK, let's replace the `rootPath` with `buildParentPath` function.

The test is still failed.
Because `mkdirSync` doesn't create a directory recursively.
So I add `recursive` option for that.

The test is still failed.
Because this `mkdirSync` try to create a directory that is already there.
So I check whether the directory already exists or not.

```ts
export const commitMount = (
  instance: Instance,
  type: Type,
  newProps: Props
) => {
  const parentPath = buildParentPath(instance);
  const targetPath = path.join(parentPath, newProps.name);

  if (!existsSync(parentPath)) {
    mkdirSync(parentPath, { recursive: true });
  }

  if (type === "file") {
    writeFileSync(targetPath, newProps.children);
  } else if (type === "directory") {
    if (!existsSync(targetPath)) {
      mkdirSync(targetPath);
    }
  }
};
```

The test is passed!
OK, let's move on to the next test!
The next 2 tests are already passed.

## Update a content of a file

The next test is "should be able to update a content of a file".

This is a update for a text content.
So I have to implement `commitTextUpdate`.
The implementation is simple.
if the text has been changed, I write a new text into a file.

```ts
  if (newText !== oldText) {
    textInstance.text = newText;
    writeFileSync(buildParentPath(textInstance), newText);
  }
```

OK, now the test is passed!

## Update a file name

The next test is "should be able to update a file name".
The test is failed.

Because this is an operation for updating, not mounting.
So let's implement `commitUpdate`.

`react-fs` only uses `name` prop, so we process `name` prop only.
If `name` prop has been changed, we have to rename the file name.

```ts
  if (newProps.name !== oldProps.name) {
    instance.props = newProps;
    renameSync(
      path.join(buildParentPath(instance), oldProps.name),
      path.join(buildParentPath(instance), newProps.name)
    );
  }
  instance.props = newProps;
```

The test is passed!
Let's move on the next test.

## Add a new file

The next test is "should be able to add a new file".
This is a simillar case with the first case.
I've implemented `appendInitialChildren` for The first one.
But this is not in a mounting phase.
So I have to the same logic in `appendChild`.

```ts
export const appendChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {
  child.parent = parentInstance;
};
```

Now the test is passed!

## Get an instance removed rootContainerInstance through ref

Let's move on the last test!
The test "should be able to get an instance removed rootContainerInstance through ref"

This test checks the value through the `ref` prop.
so we have to filter rootContainerInstance from an instance.

```ts
export const getPublicInstance = (instance: Instance) => {
  const { rootContainerInstance, ...rest } = instance;
  return rest;
};
```

Now all tests have been passed!
Of course there are some cases I haven't implemented yet.
But just works!

You can install the `react-fs` from npm as `@koba04/react-fs`.
