<!-- note

Let's move on to the first part.

-->

# Declarative Programming for UI

---------------

<!-- note
According to Wikipedia, Declarative Programming is described like this.
I think "the logic of a computation without describing its control flow" and "describing what the program must accomplish in terms of the problem domain" are important as describing what Declarative Programming is.

-->

# Declarative Programming

> In computer science, declarative programming is a programming paradigm—a style of building the structure and elements of computer programs—that expresses **the logic of a computation without describing its control flow**.

> Many languages that apply this style attempt to minimize or eliminate side effects by **describing what the program must accomplish in terms of the problem domain**, rather than describe how to accomplish it as a sequence of the programming language primitives

https://en.wikipedia.org/wiki/Declarative_programming

---------------

<!-- note
This is the description cited from Desclarative section in the official website of React.
The documentation says that "Declarative views make your code more predictable and easier to debug"
We cal also see declarative programming in other programming languages.
-->

# Declarative in React

> React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

> **Declarative views make your code more predictable and easier to debug**.

https://reactjs.org

---------------

<!-- note
SwiftUI is a new UI framework by Apple.
SwiftUI is similar to React, it describes views declaratively.

-->

# SwiftUI

```swift
import SwiftUI

struct Content: View {
    var body: some View {
        VStack {
            Text("Hello")
                .font(.title)
            Text("World!")
                .font(.body)
        }
    }
}
```

https://developer.apple.com/documentation/swiftui/

---------------

<!-- note
I don't describe SwitUI today,
So if you are interested in SwiftUI I recommend to watch SwiftUI Essentilals.
You can see many similar concepts with React on the video.

I also recommend to watch Data Flow Through SwiftUI if you are intested in managing data on applications.
SwiftUI has some ideas to manage data like Bindable Object, Environment Object.
-->

# SwiftUI

- SwiftUI Essentials
    - https://developer.apple.com/videos/play/wwdc2019/216/
- Data Flow Through SwiftUI
    - https://developer.apple.com/videos/play/wwdc2019/226

---------------

<!-- note
With Declarative Programming, you write what you want to do rather than how you want to do it.
How to do is a job for a compiler, not for you.

It also create an abstraction layer that is declarative.
It hides a underlying layer how to do it so a compiler can optimize the underlying layer.
In addition to that, you can define primitives on the declarative layer as domain logic layer.
So it makes possible to provide a high level abstraction.
-->

# Why Declarative?

- what you want to do, not how you want to do it
    - How to do is a job of compiler
- It's an abstraction layer
    - Be able to optimize in the underlying the layer
    - Your domain as a primitive

---------------

<!-- note
OK, let's move on more specific topics.
For application running on browsers, DOM is a primitive and you would write DOM manipuration to update your views.
As you may know, DOM manipuration is based on imperative operations, isn't it.
-->

# DOM manipuration is based on imperative operations

---------------

<!-- note
Let's take an example to update a view when a button is clicked.
It writes a DOM manipuration in the event listener of the click event.
This is an imperative operation and describes how to update the view, not what the view should be.
-->

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

<!-- note
These are imperative operations.
They chage the DOM based on the caller DOM objects so the results depends on the caller itself not only the arguments.
appendChild appends the argument into the caller view object.
removeChild remvoves the argument from the caller view object.
insertBefore appends the 1st argument before the 2nd argument.
-->

# Imperative

- `view.appendChild(child)`
- `view.removeChild(child)`
- `view.insertBefore(child, child2)`
- ...

---------------

<!-- note
Let's look at Declarative version.
This becomes longer than the imperative version.
I've separated updating the state and displaying the view.
the render function is displaying the view, which describes what the view should be, not how to update the view.
So the render function is declarative, which is based on the passed state.
Of course, we still need an imperative operation to update the state but the updating the state part is now separated from the view.
-->

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

<!-- note
This is an application with React.
This is of course declarative.
This includes how to update the state, but doesn't include how to update the view.
So the view is only based on the state. If the state is same, the view must be same, which means that we can only focus on the state.
the view is a mirror of the state
If you want to add a feature to remove an item, what you have to do are writing removing an item from the state and adding a UI to call the function.

This also shows an interesting point.
React provides an abstraction layer for DOM operations,
But you can create own abstraction layer like this.
DOM might be too low level your application. So you can build your component layer on top of DOM.
-->

# Declarative with React

```js
const view = document.querySelector('.view');

// describing what the view should display
const App = () => {
    const [items, setItems] = useState([]);
    return (
        <Layout>
            <Header>title</Header>
            <ItemList>
                {items.map(item => <Item key={item.id} item={item} />)}
            </ItemList>
            <AddItem onAddItem={(item) => {
                setItems(items.concat(item));
            }} />
        </Layout>
    );
}

ReactDOM.render(<App />, view);
```

---------------

<!-- note
You can treat updating a state as imperative and updating views as declarative.
- easy to test
    State is a JavaScript object and the view is described declaratively.
    Mutation is only for state, not for views.
- reuseable
    Because updating a state and describing a view are loose coupled.
- `👀 = View(State)`
    View is just a function.
    React components are basically just idempotent functions.
    You can think just like a server-rendered app.
    You can think as data driven way and treat the state as single source of the truth.
-->

# Benefits

- Easy to test
    - State is just a JavaScript object
- Reusable
    - View is loose coupled from the state
- 👀 = View(State)
    - View is just an idempotent function

----------------------

<!-- note

-->

# But....

Do you create an entire view each updates...?

You have to keep track of scroll position and focus management and so on, don't you?

----------------------

<!-- note

-->

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

<!-- note

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
// li.removeChild(b);
// li.insertBefore(b, a);
```

----------------------

<!-- note

-->

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

<!-- note

-->

# So

- You dont' have to write how to chage the view
- Describe what the view should be

----------------------

<!-- note

-->

# You can describe imperative operations as declarative

Do you know `react-native`, `ink`, `react-konva`?

You can create own renderer with React!!!

- `react-native` ... Native Apps
- `ink` ... CLI Output
- `react-konva` ... Canvas

----------------------

<!-- note

-->

# ReactNative

```js
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Hello, world!</Text>
</View>
```

----------------------

<!-- note

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

-->

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

<!-- note

-->

# Abstract your application components

- DOM is an implementation detail
- You can build own layers for your application on top of any hosts not only DOM

----------------------

<!-- note

-->

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

<!-- note

-->

# DOM as a Second-class Citizen

<Card>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Zemce4Y1Y-A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</Card>

Sebastian Markbåge / React Europe 2015
