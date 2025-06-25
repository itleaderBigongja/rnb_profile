import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('로그인 데이터:', loginData);
        console.log('자동 저장:', rememberMe);
        // 여기에 로그인 로직을 구현하세요
        alert("로그인 버튼이 클릭되었습니다!");
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <div className="logo-container">
                    <img src="/src/assets/images/rnbsoft_logo.jpg"
                         alt="R&B 알엔비소프트 로고"
                         className="logo-image"/>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text"
                               name="username"
                               placeholder="계정"
                               value={loginData.username}
                               onChange={handleInputChange}
                               className="login-input"
                               required/>
                    </div>

                    <div className="input-group">
                        <input type="password"
                               name="password"
                               placeholder="비밀번호"
                               value={loginData.password}
                               onChange={handleInputChange}
                               className="login-input"
                               required/>
                    </div>
                    <button type="submit" className="login-button">로그인</button>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input type="checkbox"
                                   checked={rememberMe}
                                   onChange={handleRememberMeChange}
                                   className="checkbox-input"/>
                            <span className="checkbox-text">계정 저장</span>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;