import React from "react"
import { createStore } from "../src"

// A dummy store to increment or decrement a like count
const [useLikeStore, LikeStoreProvider] = createStore(
  (state, setState) => ({
    ...state, // Make all the state available for use in components
    like() {
      setState({ likes: state.likes + 1 })
    },
    unlike() {
      setState({ likes: state.likes - 1 })
    },
  }),
  { likes: 0 } // Initial state
)
export { LikeStoreProvider, useLikeStore }

export default function Likes() {
  const { likes, like, unlike } = useLikeStore()
  return (
    <div>
      <h2>{`Likes: ${likes}`}</h2>
      <button onClick={() => like()}>Like</button>
      <button onClick={() => unlike()}>Unlike</button>
    </div>
  )
}
