import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
} from "react"
import PropTypes from "prop-types"

/**
 * A React hook that enables to use a reducer object that defines actions to
 * modify the state
 * @param {Function} apiFactory A function that takes (state, setState) as
 * arguments and returns properties and functions to be used in components
 * @param {Object} [initialState] The initial state
 * @return {Object} Properties returned by apiFactory
 */
export function useApi(apiFactory, initialState = {}) {
  const [state, setState] = useReducer(
    (prevState, stateChanges) => ({ ...prevState, ...stateChanges }),
    initialState
  )
  // Memoize the state to avoid triggering updates on every render
  return useMemo(
    () => apiFactory(state, setState),
    [state, setState, apiFactory]
  )
}

/**
 * Create a store that uses an API
 * @param {Function} apiFactory See useApi
 * @param {Object} [initialState] The initial state
 * @return {Tuple} A tuple containining:
 * 	- a hook to access the context, including from nested children
 * 	- the Provider element that will provide the context to all its children
 * 	- the Context object
 */
export function createStore(apiFactory, initialState) {
  const StoreContext = createContext(initialState)
  const StoreProvider = ({ children, ...props }) => {
    const store = useApi(apiFactory, { ...initialState, ...props })
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
  }
  StoreProvider.propTypes = { children: PropTypes.any }
  const useStore = () => useContext(StoreContext)
  return [useStore, StoreProvider, StoreContext]
}

/**
 * Create a store that is used to dynamically combine nested stores
 * @param {Object} [initialProviders] The initial providers to register
 * @return {Tuple} A tuple containining:
 * 	- a hook to register new stores
 * 	- the Provider element that contains all nested store providers
 * 	- the Context object
 */
export function createMultiStore(initialProviders) {
  const MultiContext = createContext(initialProviders)
  const MultiProvider = ({ children }) => {
    // Provide the dispatcher and registered stores
    const store = useApi(
      (providers, addProvider) => ({ ...providers, addProvider }),
      initialProviders
    )
    MultiProvider.propTypes = { children: PropTypes.any }
    /* eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }] */
    const { addProvider, ...providers } = store
    // Nest all registered providers
    return (
      <MultiContext.Provider value={store}>
        {Object.values(providers).reduce(
          (combined, Provider) => (
            <Provider>{combined}</Provider>
          ),
          children
        )}
      </MultiContext.Provider>
    )
  }

  /**
   * Hook to register a new provider to the multistore
   * @param {String} id A unique identifier for the provider. We cannot
   * generate it automatically as adding a new provider will re-mount the
   * component using this hook
   * @param {Object} Provider The provider to nest
   */
  const useMultiStore = (id, Provider) => {
    // Retrieve the dispatcher and the existing store from the context, if
    // it exists
    const { addProvider, [id]: ExistingProvider } = useContext(MultiContext)
    useEffect(() => {
      // Only register the new store once, to avoid infinite loops
      if (!ExistingProvider) addProvider({ [id]: Provider })
    }, [addProvider, Provider, ExistingProvider, id])
    return { loading: Boolean(ExistingProvider) }
  }
  return [useMultiStore, MultiProvider, MultiContext]
}
