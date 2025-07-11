// src/main/frontend/src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

/**
 * 사용자 로그인 인터페이스를 제공하는 React 함수형 컴포넌트입니다.
 * 사용자가 입력한 계정 아이디와 비밀번호를 백엔드 API로 전송하여 인증을 시도하고,
 * 결과에 따라 다른 페이지로 이동하거나 알림 메시지를 표시합니다.
 */
const LoginPage = () => {
    // 폼 입력 필드(계정, 비밀번호)의 값을 관리하는 상태
    const [loginData, setLoginData] = useState({
        id: '', // 백엔드 LoginRequest DTO의 'id' 필드와 매핑
        password: ''  // 백엔드 LoginRequest DTO의 'password' 필드와 매핑
    });
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    /**
     * 입력 필드(input)의 값이 변경될 때마다 호출되는 이벤트 핸들러.
     * 해당 필드의 `name` 속성과 `value`를 사용하여 `loginData` 상태를 업데이트합니다.
     * @param {Object} e 이벤트 객체
     */
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

    /**
     * 로그인 폼이 제출(Submit)될 때 호출되는 비동기 이벤트 핸들러.
     * 백엔드 `/api/login` 엔드포인트로 로그인 요청을 보냅니다.
     * @param {Object} e 이벤트 객체
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작(페이지 새로고침)을 막습니다.

        console.log('프론트엔드에서 백엔드로 보낼 로그인 데이터:', loginData);
        console.log('계정 저장 여부:', rememberMe);

        try {
            // 백엔드 API 엔드포인트에 맞게 수정: /profile/api/login
            // war로 배포할 때 profile.war로 배포를 했기 때문에 앞에 /profile 경로를 추가
            // fetch : http://192.168.0.25:8080/profile/api/login'
            // fetch : http://192.168.227.131:8080/profile/api/login'
            // fetch : http://192.168.1.181:8080/profile/api/login'
            const response = await fetch('http://192.168.1.181:8080/profile/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('백엔드로부터 받은 로그인 성공 응답:', data);
                alert(data.message || '로그인 성공!');
                localStorage.setItem('token', data.token);
                navigate('/main'); // 로그인 성공 시 이동
            } else {
                const errorData = await response.json();
                console.error('백엔드로부터 받은 로그인 실패 응답:', response.status, errorData);
                alert(`로그인 실패: ${errorData.message || '아이디 또는 비밀번호를 확인해주세요.'}`);
            }
        } catch (error) {
            console.error('로그인 요청 중 네트워크 오류 발생:', error);
            alert('로그인 요청 중 네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
        }
    };

    // 회원가입 페이지로 이동하는 함수
    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <div className="logo-container">
                    <img src="/images/rnbsoft_logo.jpg"
                         alt="R&B 알엔비소프트 로고"
                         className="logo-image"/>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text"
                               name="id" // DTO 필드명과 일치
                               placeholder="계정"
                               value={loginData.id}
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

                    <div className="button-group"> {/* 새롭게 추가된 버튼 그룹 */}
                        <button type="submit" className="login-button">로그인</button>
                        <button type="button" className="register-button" onClick={handleRegisterClick}>
                            회원가입
                        </button>
                    </div>

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