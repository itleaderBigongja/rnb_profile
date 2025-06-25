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

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('로그인 데이터:', loginData);
        console.log('자동 저장:', rememberMe);

        // 여기에 로그인 로직을 구현하세요
        alert("로그인 버튼이 클릭되었습니다!");

        // 여기서 실제 로그인 로직 (백엔드 API 호출) 구현
        try {
            // Spring Boot 백엔드의 로그인 API 엔드포인트 URL
            // 실제 API 경로에 맞게 수정해주세요 (예: 'http://localhost:8080/api/auth/login')
            const response = await fetch('http://localhost:8080/api/login', { // 🌟 fetch 호출에 await 사용
                method: 'POST', // 로그인 요청은 주로 POST 방식
                headers: {
                    'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
                },
                // 로그인 데이터를 JSON 문자열로 변환하여 본문에 포함
                body: JSON.stringify(loginData),
            });

            // 응답이 성공적인지 확인 (HTTP 상태 코드 200번대)
            if (response.ok) {
                const data = await response.json(); // 🌟 응답 본문 파싱에 await 사용
                console.log('로그인 성공:', data);

                // 로그인 성공 시 /main 경로로 리다이렉트
                navigate('/main');
            } else {
                // 로그인 실패 (예: 잘못된 사용자 이름/비밀번호)
                const errorData = await response.json(); // 🌟 에러 응답 본문 파싱에 await 사용
                console.error('로그인 실패:', response.status, errorData);
                alert(`로그인 실패: ${errorData.message || '아이디 또는 비밀번호를 확인해주세요.'}`);
            }
        } catch (error) {
            console.log("로그인 중 오류 발생", error);
            alert("로그인 요청 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요");
        }

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