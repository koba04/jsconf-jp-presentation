# Declarative Programming for UI

---------------

# Declarative Programming

> In computer science, declarative programming is a programming paradigm—a style of building the structure and elements of computer programs—that expresses **the logic of a computation without describing its control flow**.

> Many languages that apply this style attempt to minimize or eliminate side effects by **describing what the program must accomplish in terms of the problem domain**, rather than describe how to accomplish it as a sequence of the programming language primitives

https://en.wikipedia.org/wiki/Declarative_programming

---------------

# Declarative in React

> React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

> **Declarative views make your code more predictable and easier to debug**.

https://reactjs.org

---------------

# SwiftUI

```swift
import SwiftUI

struct Content: View {
    var body: some View {
        Text("Hello")
            .font(.title)
    }
}
```

https://developer.apple.com/documentation/swiftui/

---------------

# SwiftUI

- SwiftUI Essentials
    - https://developer.apple.com/videos/play/wwdc2019/216/
- Data Flow Through SwiftUI
    - https://developer.apple.com/videos/play/wwdc2019/226

---------------

# DOM manipuration is based on imperative operations

---------------

# Imperative

Decribing how to update the view

```js
const view = document.querySelector('.view');
const addButton = document.querySelector('.add-button');

// You have to implement how to update the view
addButton.addEventListener('click', () => {
    view.appendChild(child)
});
```

---------------

# Imperative

- `view.appendChild(child)`
- `view.removeChild(child)`
- `view.insertBefore(child)`
- ...

---------------

# Declarative

Describing what to update the view

```js
const view = document.querySelector('.view');
const addButton = document.querySelector('.add-button');
const state = [];

addButton.addEventListener('click', () => {
    // update the state impleratively
    state.push(child);
    // describe the view declaratively based on the state
    render(state);
});

// describing what the view should display
const render = state => {
    view.innerHTML = state.map(s => `<span>${s}</span>`).join('');
}
```

---------------

# Declarative

- `view.innerHTML = state.map(s => `<span>${s}</span>`).join('');`

Describing that the view should be displayed based on the state

You still have to update the state imperatively but don't have to care about how to update the view.

---------------

# Benefits

- You can treat updating a state as imperative and updating views as declarative
    - easy to test
        - state is a JavaScript object and the view is described declaratively
    - reusable
        - because updating a state and describing a view are loose coupled
- View is just a function
    - `👀 = View(State)`
    - React components are basically just idempotent functions
    - You can think just like a server-rendered app
    - Data Driven
    - Single Source of the Truth
    - mutation state not view

----------------------

# But....

Do you create an entire view each updates...?

You have to keep track of scroll position and focus management and so on, don't you.

----------------------

# React updates view efficiently

- a.k.a Virtual DOM

```js
let count = 1;
ReactDOM.render(
    <div>
        <Header />
        <p>{count}</p>
        <Footer />
    </div>,
    container
);

count = 2;
ReactDOM.render(
    <div>
        <Header />
        <p>{count}</p>
        <Footer />
    </div>,
    container
)
// React update the DOM like the following
// p.textContent = 2;
```

----------------------

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

# What React does

React interprets diffs for updates and transforms the diffs to imperative operations

```text
Component ... Declarative

↓ <div>hello</div>

React ... Imperative

↓ div.textContent = 'hello';

👀
```

----------------------

# So

- You dont' have to write how to chage the view
- Describe what the view should be

----------------------

# You can describe imperative operations as declarative

Do you know `react-native`, `ink`, `react-konva`?

You can create own renderer with React!!!

- `react-native` ... Native Apps
- `ink` ... CLI Output
- `react-konva` ... Canvas

----------------------

# ReactNative

```js
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Hello, world!</Text>
</View>
```

----------------------

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

----------------------

# Abstract your application components

- DOM is an implementation detail
- You can build own layers for your application on top of any hosts not only DOM

----------------------

```js
YourRenderer.render(
    <Hello>
        <jsconf country="japan">
            <talk
                title="Make it Declative with React"
                speaker="koba04"
            >
                Let's create a your custom renderer!!!
            </talk>
        </jsconf>
    </Hello>
)
```

----------------------

# DOM as a Second-class Citizen

<Card>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Zemce4Y1Y-A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</Card>

Sebastian Markbåge / React Europe 2015
