import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';        // default CRA styles
import './styles/theme.css'; // ✅ our K-SMART theme
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// For performance measurement
reportWebVitals();
