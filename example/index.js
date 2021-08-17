import React from "react"
import ReactDOM from "react-dom"
import { StoreProvider } from "./store"
import Likes from "./Likes"
import Views from "./Views"

function App() {
  return (
    <React.Fragment>
      <Likes />
      <Views />
    </React.Fragment>
  )
}

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
)
