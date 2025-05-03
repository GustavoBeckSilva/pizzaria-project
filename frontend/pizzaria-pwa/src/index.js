import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Habilita o service worker (cache offline)
serviceWorkerRegistration.register();
