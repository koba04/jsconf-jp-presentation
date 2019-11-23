## Describe what I'm going to create

First, I'm going to introduce a custom renderer that I'm going to create.
Let's take a look at README.md.

This is a custom renderer for file system, which creates files and directories declaratively.
This example creates README.md and index.js in a src directory.

Let's start!

## Describe the project structure

Before coding, let's take a look the related files.
`fs-renderer-types.ts` defines type definition.
`fs-renderer.ts` creates a renderer from a host config object and type definition.

### index.ts

`index.ts` is the entry point of `react-fs`.
This exports ReactFS object having render function.
You can think of this like `ReactDOM` object.

`render` function receives a ReactElement and `rootPath`.
We'd like to use `rootPath` in the host config, so we store it in the container.

Before rendering, we remove the all files under the rootPath, which is a very dangerous operation so be careful to use this renderer.
I'll make the implementation more safe.

Finally, we can use `fs-renderer`!

### index.test.tsx

I have some tests for `fs-renderer`.
If all tests have been passed, I can say that `fs-renderer` works fine!

## Start Coding

OK, Let's start coding!!

### Create a file and directory

First, let's run `yarn test --watch` to run the unit tests.
We now skip all tests.

Let's run the tests for creating file and directory.

The tests were failed.

Let's see the host config file.
You can see type errors at `createInstance` and `createTextInstance`.
Let's fix them at first.

...implementing

OK, But the tests are still failing.

So I imeplement to create a file and directory.
Let's implement this into `commitMount`.
Our `finalizeInitialChildren` returns `true` so `commitMount` is always called.

```ts
  const parentPath = instance.rootContainerInstance.rootPath;
  const targetPath = path.join(parentPath, newProps.name);
  if (type === "file") {
    writeFileSync(targetPath, newProps.children);
  } else if (type === "directory") {
    mkdirSync(targetPath);
  }
```

The tests are still failed.
Because we have to create a `parentPath` directory before creating a file.

```ts
  if (!existsSync(parentPath)) {
    mkdirSync(parentPath);
  }
```

### Create a file into a directory

Let's test creating a file into a directory.

`commitMount` is called from `child` to `parent`.
So when `commitMount` for a file is called, the parent directory hasn't been created yet.

So I have to create a directory before processing the file.
But I don't have a way to know the parent directory path.
So let's add a `parent` property into `Instance` and `TextInstannce`.
I add the parent property at `appendChild` and `appendInitialChild`.

```ts
export const appendChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
) => {
  child.parent = parentInstance;
};

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

OK, let's replace the `rootPath` with `buildParentPath` function.

The tests are still failed.
Because `mkdirSync` doesn't create a directory recursively and `mkdirSync` throw an error if the directory is already there.

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

The tests have been passed!

### Update

So Let's test updating a file and text content.
I have to implement `commitTextUpdate` and `commitUpdate`.

`commitTextUpdate` is simple.
if the text has been changed, I write a new text into a file.

```ts
  if (newText !== oldText) {
    textInstance.text = newText;
    writeFileSync(buildParentPath(textInstance), newText);
  }
```

So let's implement `commitUpdate`.

`react-fs` only uses `name` prop,
so if `name` prop has been changed, we have to rename the file name.

```ts
  if (newProps.name !== oldProps.name) {
    instance.props = newProps;
    renameSync(
      path.join(buildParentPath(instance), oldProps.name),
      path.join(buildParentPath(instance), newProps.name)
    );
  }
```

### Public Instance

Let's implement `getPublicInstance` to filter `rootContainerInstance`.

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
