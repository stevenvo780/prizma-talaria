/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/paper-dashboard.scss';
import { Provider } from 'react-redux';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// Olympo design tokens (copia self-hosted de @olympo/tokens — sin dependencias nuevas)
import './assets/scss/cauce-tokens.css';
// Puente Bootstrap/Paper Dashboard -> tokens Olympo (acento del módulo meravuelta)
import './assets/scss/cauce-brand.css';
import { store } from './store/configureStore';
import App from './App';
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    {/* Olympo: chrome unificado + acento del módulo "meravuelta" (data-module) */}
    <div className="cauce cui-root" data-module="meravuelta">
      <App />
    </div>
  </Provider>,
  document.getElementById('root')
);

if (process.env.REACT_APP_PROJECT_STATUS !== "development") {
  //serviceWorkerRegistration.register();
  reportWebVitals();
}


