// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';            
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);         
root.render(<App />);

serviceWorkerRegistration.register();
