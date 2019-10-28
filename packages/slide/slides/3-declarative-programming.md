import { Img } from '@fusuma/client';

<!-- note

Let's start!
-->

# Declarative Programming for UI

---------------

<!-- note
On this slide, we have the Wikipedia definition of Declarative Programming.
Please take a look at these two points in bold
because they are important to understand what Declarative Programming is.
"the logic of a computation without describing its control flow"
"describing what the program must accomplish in terms of the problem domain"
-->

# Declarative Programming

> In computer science, declarative programming is a programming paradigm—a style of building the structure and elements of computer programs—that expresses **the logic of a computation without describing its control flow**.

> Many languages that apply this style attempt to minimize or eliminate side effects by **describing what the program must accomplish in terms of the problem domain**, rather than describe how to accomplish it as a sequence of the programming language primitives

https://en.wikipedia.org/wiki/Declarative_programming

---------------

<!-- note
Now let's take a look at what React official website says.
Please keep these words in mind as I will later talk more about it.

We can also see declarative programming in other programming languages.
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
So if you are interested in SwiftUI I recommend watching the video SwiftUI Essentilals.
You can see many similar concepts with React on the video.

if you are intested in managing data on applications, I also recommend watching the video Data Flow Through SwiftUI.
SwiftUI has some interesting ideas to manage data like Bindable Object, Environment Object.
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

It also creates an abstraction layer that is declarative.
The abstraction layer hides an underlying layer that manages how to do it.
So a compiler can optimize on the underlying layer.

In addition to that, you can define primitives in the declarative layer as domain logic.
So it makes possible to provide a high level abstraction.
-->

# Why Declarative?

- What Not How
    - How -> Compiler
- Abstraction layer
    - Optimization in the underlying layer
    - Primitive as domain

---------------

<!-- note
With briefly go back to the Wikipedia definition
"The logic of a computation without describing its control flow"
-->


# The logic of a computation without describing its control flow

---------------

<!-- note
For application running on browsers, DOM is a primitive and you would write DOM manipulations to update your views.
As you may know, DOM manipulation is based on imperative operations.
-->

# DOM manipulation is based on imperative operations

---------------

<!-- note
Let's take an example for the view update when a button is clicked.

You would write a DOM manipulation in the event listener of the click event.
This is an imperative operation and describes how to update the view, not what the view should be.
-->

# Imperative

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

They change the DOM based on the caller DOM objects so the results depends on the caller itself not only the arguments.

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

I've separated the state update and the view display.
the render function displays the view, which describes what the view should be, not how to update the view.
So the render function is declarative, which is based on the passed state.
Of course, we still need an imperative operation to update the state.
But the state update part is now separated from the view.
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

This is definitely declarative.
This includes how to update the state, but doesn't include how to update the view.
So the view is only based on the state. If the state is the same, the view must be the same, which means that we can focus on the state only.

the view is a mirror of the state
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
You can update a state imperatively and you can update a view declaratively.

- easy to test
    State is a JavaScript object and the view is described declaratively.
    Mutation is only for state, not for views, which means we can write tests for state and view easily.
- reuseable
    Because updating a state and describing a view are loose coupled.
- `👀 = View(State)`
    View is just a function.
    React components are basically just idempotent functions.
    You can think just like a server-rendered app.
    You can think as data driven way and treat the state as single source of the truth.

Do you create an entire view each updates...?
Do you have to keep track of the scroll position and focus management and so on?

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
No, React updates views efficiently.
The feature is called Virtual DOM, which calculates the diffs and applies the diffs.
So the scroll position and the focus status aren't lost.

Please take a look at the slide,
This updates the textContent of p tag only.
So the second render, React calculates the diffs between the render functions,
and applies the diff by p.textContent = 2;
-->

# React updates views efficiently

- a.k.a. Virtual DOM

```js
let count = 1;
ReactDOM.render(
    <div>
        <Header />
        <p>{count}</p>
    </div>,
    container
);

count = 2;
ReactDOM.render(
    <div>
        <Header />
        <p>{count}</p>
    </div>,
    container
)
// p.textContent = 2; // React updates the DOM
```

----------------------

<!-- note
Let's take another example.
This changes the order in the list.
This updates item b from second to first.

React determines the change by the key props.
React moves the item b before item a by insertBefore function.

These are jobs for React DOM renderer.
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
// li.insertBefore(b, a);
```

----------------------

<!-- note
React DOM calculates the diffs for an update by comparing components between previous and current one.
React interprets the diffs to transform them to imperative operations

So we are able to write components declaratively without caring about actual imperative operations.

As the result, we don't have to write how to chage the view.
We can focus on what the view should be
-->

# ReactDOM Renderer

<img src="../images/what-react-does.png" />

----------------------

<!-- note
With briefly go back to the Wikipedia definition
"Describing what the program must accomplish in terms of the problem domain"
-->

# Describing what the program must accomplish in terms of the problem domain

----------------------

<!-- note
As I've explained, React processes imperative DOM operations for you.
Even though we write div tag as JSX, it's not a div tag of DOM.
It's a React Element.
React creates an abstraction layer using React Element on top of the DOM.

But it might be too low level as primitivies for your application.
You can build your abstraction layer on the layer React creates.
It makes your applications clean and keep consistency.
-->

# Abstract your application components

- DOM is an implementation detail
- React Component is a primitive of your domain.

----------------------

<!-- note
Let's take a look.

This App isn't using any DOM Components directly.
It uses components based on DOM Components.

This makes it possible to hide many details like styles, markups and so on.
Of course you have to create these primitive components, but developers who creates an application don't care about it.
Just use them.

Designing primitive components is very hard.
Which props should be expose or not...

If primitive components are too high-level abstraction, they wouldn't be used...
If primitive components are leaking details unnecessarily, the application would lose consistency...

So thinking about your domain primitives is your job,
it's very hard but important.
-->

# Build own domain layers with React

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
            <AddItemButton
                onAddItem={item => setItems(items.concat(item))}
            />
        </Layout>
    );
}

ReactDOM.render(<App />, view);
```

----------------------

<!-- note
This is a great talk about this topic.
He involves the design of React architecure.

I'm recommend watching the video.
-->

# DOM as a Second-class Citizen

<Card>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Zemce4Y1Y-A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</Card>

Sebastian Markbåge / React Europe 2015

----------------------

<!-- note
I've talked about React on the DOM environment.
But React is not only for DOM.

Of course, ReactNative is one of them, which is not for DOM environment.
So on the next, I'm talk about React for other environments and how to create a custom renderer!
-->

# React is not only for DOM

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
