# Declarative Programming for UI

---------------

# Declarative Programming

> In computer science, declarative programming is a programming paradigm—a style of building the structure and elements of computer programs—that expresses the logic of a computation without describing its control flow.

> Many languages that apply this style attempt to minimize or eliminate side effects by describing what the program must accomplish in terms of the problem domain, rather than describe how to accomplish it as a sequence of the programming language primitives

https://en.wikipedia.org/wiki/Declarative_programming

---------------

# Declarative in React

> React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

> Declarative views make your code more predictable and easier to debug.

https://reactjs.org

---------------

# SwiftUI

```
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

# DOM manipuration is based on imperative operations

---------------

# Imperative

Decribing how to update the view

```js
const view = document.querySelector('.view');
const addButton = document.querySelector('.add-button');
addButton.addEventListener('click', () => {
    view.appendChild(child)
});
const updateButton = document.querySelector('.update-button');
updateButton.addEventListener('click', () => {
    // write logic to update the view
});
// You have to implement these logic each operations
```

---------------

# Declarative

Describing whathow to update the view

```js
const view = document.querySelector('.view');
const addButton = document.querySelector('.add-button');
const state = [];
addButton.addEventListener('click', () => {
    // update the state impleratively
    state.push(child);
    render(state);
});
const updateButton = document.querySelector('.update-button');
updateButton.addEventListener('click', () => {
    // update the state impleratively
    // ...
    render(state);
});

// describing what the view should display declaratively
const render = state => {
    view.innerHTML = state.map(s => `<span>${s}</span>`).join('');
}
```

---------------

# Benifits

- You can separate application logic and view logic
    - easy to test
    - reuseable
- View is just a function without side-effects
    - `👀 = View(State)`

----------------------

# But....

Do you create an entire views each updates...?

----------------------

# React updates view efficiently

- a.k.a Virtual DOM

```jsx
let count = 1;
ReactDOM.render(
    <div>
        <p>{count}</p>
    </div>,
    container
);

count = 2;
ReactDOM.render(
    <div>
        <p>{count}</p>
    </div>,
    container
)
// React update the DOM like the following
// p.textContent = 2;
```

----------------------

# Change the index in a list

```jsx
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

```
Declarative
↓
React
↓
Imperative
```

----------------------

# You can represent imperative operations declaratively other than DOM

Do you know `react-native`, `ink`, `react-konva`?
You can create own renderer with React!!!

- `react-native` ... Native Apps
- `ink` ... CLI Output
- `react-konva` ... Canvas

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