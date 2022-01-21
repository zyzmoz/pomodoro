import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './app/reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(registration => {
    console.log("ServiceWorker registred!!", {registration})
  }).catch(error => {
    console.error({error})
  })
}