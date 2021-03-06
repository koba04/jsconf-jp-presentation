### Describe the project structure

Before coding, let's take a look at the related files.
`fs-renderer-types.ts` defines type definition.
`fs-renderer.ts` creates a renderer from a host config and type definition.

--------------

### index.ts

`index.ts`はReactDOMのようなエントリーポイントです。

`index.ts` is the entry point of `react-fs`.
This exports ReactFS object having render function.
You can think of this like `ReactDOM` object.

`render` function receives a ReactElement and `rootPath`.
We'd like to use `rootPath` in the host config, so we store it in the container.

Before rendering, we remove all the files under the rootPath, which is very dangerous so be careful when you use this renderer.
I'll try to make it safer in the future.

--------------

### index.test.tsx

I have some tests for `fs-renderer`.
If all tests have been passed, I can say that `fs-renderer` works fine!

OK, Let's start coding!!

--------------

### Create a file and directory

全てのテストがスキップされているので順番に通していきます。
最初はファイル、ディレクトリを作成するテストです。

First, let's run `yarn test --watch` to run the unit tests.
All tests are skipped.

Let's see the first section of "create a file and directory".

Let's open the host config, Its implementation is almost empty.
First, let's fix type errors at `createInstance` and `createTextInstance`.

...implementing

Next, I have to imeplement to create a file and directory.
Let's implement this into `commitMount`.
Our `finalizeInitialChildren` returns `true` so `commitMount` is always called.

...implementing

The tests have been passed!

--------------

### Create a file into a directory

次はディレクトリの中にファイルがある場合です。

Let's move on to the next section "create a file into a directory".

`commitMount` is called from `child` to `parent`.
So when processing a file, its parent directory hasn't been created yet.

So I have to create a directory before creating a file.
But I don't have a way to know the parent directory path.
So let's add a `parent` property into `Instance` and `TextInstannce`.
I add the parent property at `appendChild` and `appendInitialChild`.

...implementing

Next, let's create a path for parent directory.
In order to do this, I create a `buildParentPath` function.
This function accepts an instance or textInstance and returns the parent directory path.
Let's implement this.

I have to reverse the order of the directory names.
OK, let's replace the `rootPath` with `buildParentPath` function.

The tests are still failed.
Because `mkdirSync` doesn't create a directory recursively and throws an error if the directory is already there.
Let's fix that.

...implementing

The tests have been passed!

--------------

### Update

次は更新の場合です。

Let's move on to the next section "update a content and file name".

I have to implement `commitTextUpdate` and `commitUpdate`.
That is simple.

...implementing

`react-fs` only uses `name` prop.

...implementing

The tests have been passed!

--------------

### Public Instance

最後はPublicInstanceのためのテストです。

Let's move on to the last section "get a public instance". Let's see the tests.

Let's implement `getPublicInstance` to filter `rootContainerInstance`.

...implementing

Now all tests have been passed!
Of course there are some cases I haven't implemented yet.
But it works!
