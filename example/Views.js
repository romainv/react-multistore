import React from "react"
import { createStore } from "../src"
import { useMultiStore } from "./store"
import { useLikeStore } from "./Likes"

// A dummy store to increment or decrement a view count
const [useViewStore, ViewStoreProvider] = createStore(
  (state, setState) => {
    return {
      // Make only the views attribute available to consumers (not 'dummy')
      views: state.views,
      view() {
        setState({ views: state.views + 1 })
      },
    }
  },
  { views: 0, dummy: 0 } // Initial state
)

export { ViewStoreProvider }

export default function Views() {
  useMultiStore("views", ViewStoreProvider) // Dynamic store registration
  const { views, view } = useViewStore()
  const { likes } = useLikeStore()
  return (
    <div>
      <h2>{`Views: ${views}`}</h2>
      <button onClick={() => view()}>View</button>
      <h2>{`Likes/view: ${
        views !== 0 ? (likes / views).toPrecision(2) : "no views yet"
      }`}</h2>
    </div>
  )
}
