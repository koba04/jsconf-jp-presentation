# react-fs

**The GitHub repository will be published soon!!**

A React custom renderer for file system APIs.

```js
// This packages hasn't been published npm yet.
const ReactFS = require('@koba04/react-fs');

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
