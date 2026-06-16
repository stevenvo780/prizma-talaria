/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { createRoot } from 'react-dom/client';
// prizma-ui styles FIRST so own styles can override (Prizma design system)
import 'prizma-ui/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/paper-dashboard.scss';
import { Provider } from 'react-redux';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// Prizma design tokens (copia self-hosted de prizma-tokens — sin dependencias nuevas)
import './assets/scss/prizma-tokens.css';
// Puente Bootstrap/Paper Dashboard -> tokens Prizma (acento del módulo talaria)
import './assets/scss/prizma-brand.css';
import { ThemeProvider, PrizmaRoot } from 'prizma-ui';
import { store } from './store/configureStore';
import App from './App';
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <PrizmaRoot module="talaria">
        <App />
      </PrizmaRoot>
    </ThemeProvider>
  </Provider>
);

if (process.env.REACT_APP_PROJECT_STATUS !== "development") {
  //serviceWorkerRegistration.register();
  reportWebVitals();
}


