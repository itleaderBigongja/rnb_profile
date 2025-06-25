// src/main/frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import MainPage from "./pages/Main/MainPage.jsx";

// App.css는 App.jsx와 같은 디렉토리에 있음
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* 기본 경로(/)에 접속하면 WelcomePage를 렌더링합니다. */}
                <Route path="/" element={<WelcomePage />} />

                {/* '/login' 경로에 접속하면 LoginPage를 렌더링합니다. */}
                <Route path="/login" element={<LoginPage />} />

                {/* '/main' 경로에 접속하면 MainPage를 렌더링합니다. */}
                <Route path="/main" element={<MainPage/>} />
            </Routes>
        </Router>
    );
}

export default App;