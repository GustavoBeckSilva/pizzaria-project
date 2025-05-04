// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';              // ← novo import
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);         // ← createRoot em vez de render
root.render(<App />);

// Agora registramos o SW para produção (ativará offline/fallback)
serviceWorkerRegistration.register();
