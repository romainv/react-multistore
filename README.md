# react-multistore
_A lightweight library to manage a global store using React hooks_

react-multistore enables to manage the state of a [`react`](https://reactjs.org) 
app in a similar fashion as [`redux`](https://redux.js.org), i.e. by creating a 
single store which can be composed of multiple individual stores, and which uses 
actions (aka reducers) to modify the state.  
The main difference is that react-multistore is a pure React solution in that it 
uses only the new [`react hooks`](https://reactjs.org/docs/hooks-intro.html). The 
library has no dependencies besides React and weighs only a few Kb before gzip.

## Install
```bash
npm install --save react-multistore
```

## Usage
The below demonstrates the basic usage of the library, from the simplest use-case 
to the most advanced.
### Create a standalone hook
At its core, react-multistore relies on `useApi` which is a simple wrapper around 
react's `useReducer` that enables using an 'apiFactory' to update the state while 
preventing unnecessary re-renders:
```javascript
import React from "react"
import { useApi } from "react-multistore"

const initialState = { likes: 0 }
const apiFactory = (state, setState) => ({
  ...state,
  like() {
    setState({ likes: state.likes + 1 })
  },
})

function MyComponent() {
  const { likes, like } = useApi(apiFactory, initialState)
  return (
    <div>
      <h2>{`Likes: ${likes}`}</h2>
      <button onClick={() => like()}>Like</button>
    </div>
  )
}
```
The state managed by `useApi` is only available in the component that uses the 
hook. To share the state among multiple components, create a store instead 
(see below).
### Create a shared store
To share `state` and `apiFactory` among components, you create a store using 
`createStore` and make use of the `useStore` hook and the store's `Provider` 
component as follow:
```javascript
import React from "react"
import ReactDOM from "react-dom"

const [useStore, StoreProvider] = createStore(
  (state, setState) => ({
    ...state,
    like() {
      setState({ likes: state.likes + 1 })
    },
  }),
  { likes: 0 } // Initial state
)

function MyComponent() {
  const { likes, like } = useStore()
  return (
    <div>
      <h2>{`Likes: ${likes}`}</h2>
      <button onClick={() => like()}>Like</button>
    </div>
  )
}

ReactDOM.render(
  <StoreProvider>
    <MyComponent />
  </StoreProvider>,
  document.getElementById("root")
)
```
### Create a multistore
To combine multiple stores (e.g. to split your code into logical modules), you 
register individual stores into a `multistore` as follow:
```javascript
import { createMultiStore } from "react-multistore"
import { useLikeStore, LikeStoreProvider } from "./Likes"
import { useViewStore, ViewStoreProvider } from "./Views"

const [useMultiStore, MultiStoreProvider] = createMultiStore({
  likes: LikeStoreProvider,
  views: ViewStoreProvider,
})

function App() {
  const { likes } = useLikeStore()
  const { views } = useViewStore()
  return (
   <h2>{`Likes/view: ${
      views !== 0 ? (likes / views).toPrecision(2) : "no views yet"
    }`}</h2>
  )
}

ReactDOM.render(
  <MultiStoreProvider>
    <App />
  </MultiStoreProvider>,
  document.getElementById("root")
)
```
There may be situations in which an individual store needs to be registered 
dynamically (e.g. when loaded on demand with code splitting). To do so, you 
can use the `useMultiStore` hook in the dynamically-loaded component. See 
below for an example.

## Example
Check the [example](./example) folder for a live demonstration of the various 
methods of react-multistore. To run it locally, simply use `npm start` and 
navigate to `http://localhost:9000` on your browser.  
The example is a dummy application with a `Likes` and a `Views` counters, 
demonstrating:
* the [`Likes`](./example/Likes.js) counter uses a store registered immediately 
within the multistore
* the [`Views`](./example/Views.js) counter defines its store dynamically and 
uses the likes store
* the [`App`](./example/index.js) component uses a component-specific 
hook to toggle the `View` counter
* The `Likes` view is not re-rendered upon modification of the views count

## License
react-multistore is [MIT licensed](./LICENSE)

