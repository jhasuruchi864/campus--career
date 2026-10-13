import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Design System CSS
import './css/variables.css';
import './css/global.css';
import './css/components.css';
import './css/layout.css';
import './css/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
