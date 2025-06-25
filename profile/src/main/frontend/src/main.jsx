// src/main/frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // App.jsx는 main.jsx와 같은 디렉토리에 있음
import './index.css'; // index.css도 main.jsx와 같은 디렉토리에 있음

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);