import { createMultiStore } from "../src"
import { LikeStoreProvider } from "./Likes"

const [useMultiStore, StoreProvider] = createMultiStore({
  // Here we only register the like store for the sake of demonstrating
  // dynamically registering the view store in the App component
  like: LikeStoreProvider,
})
export { StoreProvider, useMultiStore }
