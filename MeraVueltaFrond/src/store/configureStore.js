// import { unstable_batchedUpdates } from "react-dom";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
import { createRootReducer } from "./reducer";
import rootSaga from "./middleware/sagas/index";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
    // other options if needed
    // batch: unstable_batchedUpdates,
  });

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  routerMiddleware,
  ...getDefaultMiddleware({
    thunk: false,
  }),
  sagaMiddleware,
];

export const store = configureStore({
  reducer: createRootReducer(routerReducer),
  middleware,
  // preloadedState,
});

// make sure to start saga before creating history listener
sagaMiddleware.run(rootSaga);

export const history = createReduxHistory(store);
