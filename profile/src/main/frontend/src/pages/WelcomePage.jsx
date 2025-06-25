import React from 'react';
import { useNavigate} from "react-router-dom";          // URL 변경을 위한 훅 임포트
import '../App.css';

function WelcomePage() {

    const navigate = useNavigate();      // navigate 함수를 사용할 준비
    const goToLoginPage = () => {
        navigate('/login');
    }

    const goToMainPage = () => {
        navigate('/main')
    }
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>환영합니다!</h1>
            <p>로그인하여 서비스를 이용해주세요.</p>
            <button className="button" onClick={goToLoginPage}> {/* 버튼 클릭 시 goToLoginPage 함수 실행 */}
                로그인
            </button>
            <button className="button" onClick={goToMainPage}>
                메인화면
            </button>
        </div>
    );
}

export default WelcomePage;