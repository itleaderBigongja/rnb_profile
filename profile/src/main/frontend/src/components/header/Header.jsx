// src/frontend/src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Header 전용 CSS 임포트

const Header = () => {
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Header 드롭다운 토글 핸들러
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // '기본정보' 클릭 핸들러
    const handleBasicInfoClick = () => {
        setIsDropdownOpen(false);
        // 필요하다면 여기에 특정 경로로 이동하는 로직을 추가할 수 있습니다.
        navigate('/baseinfo');
        alert("기본정보 페이지로 이동 (개발 예정)"); // 테스트용 알림
    };

    // '로그아웃' 클릭 핸들러
    const handleLogout = () => {
        console.log("로그아웃 처리");
        setIsDropdownOpen(false);
        navigate('/login'); // 로그인 페이지로 리디렉션 (예시)
    };

    // 외부 클릭 감지 (드롭다운 메뉴 닫기)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // 클릭된 요소가 드롭다운 메뉴 바깥에 있고, 아바타 클릭이 아닌 경우에만 닫기
                if (!event.target.closest('.profile-avatar')) {
                    setIsDropdownOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="main-header">
            <div className="header-left">
                <div className="logo-section">
                    <div className="header-logo">
                        <img src="/images/rnbsoft_logo2.jpg"
                             alt="R&B 알엔비소프트 로고"
                             className="logo-image"/>
                    </div>
                    <span className="company-title">알앤비소프트</span>
                </div>
                <nav className="main-nav">
                    <a href="#" className="nav-item">프로필관리</a>
                    <a href="#" className="nav-item">프로젝트관리</a>
                    <a href="#" className="nav-item">부서관리</a>
                    <a href="#" className="nav-item">투입인력관리</a>
                    <a href="#" className="nav-item">코드관리</a>
                    <a href="#" className="nav-item">메뉴관리</a>
                    <a href="#" className="nav-item">게시판</a>
                    <a href="#" className="nav-item">주소록</a>
                    <a href="#" className="nav-item">자료실</a>
                </nav>
            </div>
            <div className="header-right">
                <div className="user-profile">
                    <div className="profile-avatar" onClick={toggleDropdown}>
                        <img src="/images/rnbsoft_logo.jpg" alt="User Avatar" className="avatar-image" />
                    </div>
                    {isDropdownOpen && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <ul>
                                <li onClick={handleBasicInfoClick}>기본정보</li>
                                <li onClick={handleLogout}>로그아웃</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;