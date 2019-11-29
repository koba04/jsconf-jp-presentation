# @koba04/react-fs

**This repository exists only for JSConf JP presentation. If you'd like to use this renderer, please visit [koba04/react-fs](https://github.com/koba04/react-fs).**

A React custom renderer for file system APIs.


## Install

This package depends on `recursive` option of `fs.rmdirSync`, so you have to use Node.js higher that `v12.10.0`.

```
npm i @koba04/react-fs
```

## How to use

```js
const React = require('react');
const { ReactFS } = require('@koba04/react-fs');

const targetDir = "test-react-fs-project";
ReactFS.render(
  <>
    <file name="README.md">
      # Title
    </file>
    <directory name="src">
      <file name="index.js">
        console.log("Hello");
      </file>
    </directory>
  </>,
  targetDir
);
```

## TypeScript

If you use `@koba04/react-fs` with TypeScript, you have to edit `typeRoots` like the following.

```json
    "typeRoots": [
      "node_modules/@types",
      "node_modules/@koba04/react-fs/types",
    ]
```
