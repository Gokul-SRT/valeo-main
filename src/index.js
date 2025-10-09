import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createHashHistory } from "history";
import { createStore, applyMiddleware, compose } from "redux";
import { logger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";

import reducers from "./redux/reducers";
import sagas from "./redux/sagas";
import Router from "./router/AppRouter";
import * as serviceWorker from "./serviceWorker";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "./Utills/agGridModules";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Middlewares
const history = createHashHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [sagaMiddleware, routeMiddleware];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

// ✅ Use native Redux DevTools support
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers(history),
  composeEnhancers(applyMiddleware(...middlewares))
);

sagaMiddleware.run(sagas);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router history={history} />
  </Provider>
);

serviceWorker.unregister();

export { store, history };
