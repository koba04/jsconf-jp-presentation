# Describe what I'm going to create

First, I'm going to introduce a custom renderer that I'm going to create.
Let's take a look at README.md.

This is a custom renderer for file system, which creates files and directories declaratively.
This example creates README.md and index.js in a src directory.

Let's start!

# Describe the project structure

Before coding, let's take a look the project structure.

## fs-renderer-types.ts

`fs-renderer-types.ts` defines type definition.

## fs-renderer.ts

`fs-renderer.ts` creates a renderer from a host config object and type definition.

## index.ts

`index.ts` is the entry point of `react-fs`.
This exports ReactFS object having render function.
You can think of this like `ReactDOM` object.

`render` function receives a ReactElement and `rootPath`.
We'd like to use `rootPath` in the host config, so we store it in the container info.

Before rendering, we remove the all files under the rootPath, which is a very dangerous operation so be careful to use this renderer.
I'll make the implementation more safe.

Finally, we can use `fs-renderer`!

## index.test.tsx

I have some tests for `fs-renderer`.
If all tests are passed, I can say that `fs-renderer` works fine!

We use `tmpdir` for the `rootPath` of the tests.

# Start Coding

OK, Let's start coding!!

## Create a file

First, let's run `yarn test` to run the unit tests.
We define `xit` so all tests never run.

So I change the first test from `xit` to `it`.
The test is `should be able to create a file`.

Let's run again with `watch` option.

> yarn test --watch

The test was failed.
Let's see the host config file.

You can see type errors at `createInstance` and `createTextInstance`.
Let's fix them at first.

> impl...

`createIntance` must returns a `Instance`.
`createTextIntance` must returns a `TextInstance`.

OK, type errors has gone.

But the test is still failing.

So I imeplement to create a file.
Let's implement this into `commitMount`.
Our `finalizeInitialChildren` returns `true` so `commitMount` is always called.

```ts
  const { rootPath } = instance.rootContainerInstance;
  const targetPath = path.join(rootPath, newProps.name);
  if (type === "file") {
    writeFileSync(targetPath, newProps.children);
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

To pass the test, I have to add implementation for `directory` component.
I create a directory if the type is `directory`.

```ts
  } else if (type === "directory") {
    mkdirSync(targetPath);
  }
```

OK, the test is passed!

## Create a file into a directory

`commitMount` is called from `child` to `parent`.
So when `commitMount` for a file is called, the parent directory hasn't been created yet.

So I have to create a directory before processing the file.
But I don't have a way to know the parent directory path.
So let's add a `parent` property into `Instance` and `TextInstannce`.
I add the parent property at `appendInitialChild`.

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

Let's implement this.
I have to reverse the order of the directory names.

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
And `mkdirSync` for a directory component try to create a directory even if this is already there.
So I check whether existing the target directory or not.

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

This is a simillar case with a previous case.
I've implemented `appendInitialChildren` for the case.
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
