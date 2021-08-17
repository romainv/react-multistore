import React from "react"
import ReactDOM from "react-dom"
import { StoreProvider } from "./store"
import { useApi } from "../src"
import Likes from "./Likes"
import Views from "./Views"

function App() {
  // Demonstrate the use of a local apiFactory
  const { isVisible, toggle } = useApi(
    (state, setState) => ({
      ...state,
      toggle() {
        setState({ isVisible: !state.isVisible })
      },
    }),
    { isVisible: true } // Initial state
  )
  return (
    <React.Fragment>
      <Likes />
      <br />
      <button onClick={() => toggle()}>Toggle view count</button>
      {isVisible && <Views />}
    </React.Fragment>
  )
}

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
)
