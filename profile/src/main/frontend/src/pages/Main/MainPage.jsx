import React, { useState, useEffect, useRef } from 'react'; // useRef 임포트 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트 추가
import './MainPage.css'; // MainPage 전용 CSS 파일 (아래에 CSS 코드도 제공됩니다)

const MainPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 초기화

    // 현재 날짜 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    // 달력 표시용 년월 상태
    const [calendarDate, setCalendarDate] = useState(new Date());
    // 실시간 시간 표시용 상태
    const [currentTime, setCurrentTime] = useState(new Date());

    // 드롭다운 메뉴의 표시 여부를 관리하는 상태
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 추가: 드롭다운 상태
    // 드롭다운 영역 외부 클릭을 감지하기 위한 ref
    const dropdownRef = useRef(null); // 추가: 드롭다운 ref

    // 실시간 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 드롭다운 외부 클릭 감지 useEffect
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 드롭다운 영역 외부를 클릭했고, 드롭다운이 열려있다면
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // 드롭다운 닫기
            }
        };

        // 문서 전체에 클릭 이벤트 리스너 추가
        document.addEventListener('mousedown', handleClickOutside);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행됨을 의미


    // 날짜 포맷팅 함수들
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];

        return `${year}-${month}-${day}(${dayName})`;
    };

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    };

    // 달력 관련 함수들
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(calendarDate);
        const firstDay = getFirstDayOfMonth(calendarDate);
        const days = [];

        // 이전 달의 마지막 날들
        const prevMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                isPrevMonth: true
            });
        }

        // 현재 달의 날들
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDate.getDate() &&
                calendarDate.getMonth() === currentDate.getMonth() &&
                calendarDate.getFullYear() === currentDate.getFullYear();

            days.push({
                day,
                isCurrentMonth: true,
                isToday
            });
        }

        // 다음 달의 시작 날들 (42칸을 채우기 위해)
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                isNextMonth: true
            });
        }

        return days;
    };

    // 드롭다운 토글 함수
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // 로그아웃 핸들러 함수
    const handleLogout = () => {
        // 1. 로컬 스토리지 또는 세션 스토리지에서 사용자 정보 제거
        localStorage.removeItem('loggedInUser'); // 예시: 로그인 사용자 정보를 저장했다면
        localStorage.removeItem('authToken');    // 예시: JWT 토큰을 저장했다면

        // 2. 드롭다운 닫기
        setIsDropdownOpen(false);

        // 3. 사용자에게 로그아웃 메시지 표시 (선택 사항)
        alert('로그아웃 되었습니다.');

        // 4. 로그인 페이지로 리디렉션
        navigate('/login');
    };

    // '기본정보' 클릭 시 동작 (예시)
    const handleBasicInfoClick = () => {
        // 여기에 기본정보 페이지로 이동하거나 모달을 띄우는 로직 구현
        alert('기본정보 페이지로 이동합니다. (구현 예정)');
        setIsDropdownOpen(false); // 드롭다운 닫기
        // navigate('/basic-info'); // 예시: 기본정보 페이지 라우팅이 있다면
    };


    const calendarDays = generateCalendarDays();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="main-container">
            {/* Header */}
            <header className="main-header">
                <div className="header-left">
                    <div className="logo-section">
                        <div className="header-logo">
                            <img src="/src/assets/images/rnbsoft_logo2.jpg"
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
                        {/* profile-avatar 클릭 시 드롭다운 토글 */}
                        <div className="profile-avatar" onClick={toggleDropdown}>
                            {/* 아바타 이미지 또는 아이콘 */}
                            <img src="/src/assets/images/rnbsoft_logo.jpg" alt="User Avatar" className="avatar-image" />
                        </div>
                        {/* 드롭다운 메뉴 */}
                        {isDropdownOpen && ( // isDropdownOpen이 true일 때만 렌더링
                            <div className="dropdown-menu" ref={dropdownRef}> {/* ref 연결 */}
                                <ul>
                                    <li onClick={handleBasicInfoClick}>기본정보</li> {/* 기본정보 항목 */}
                                    <li onClick={handleLogout}>로그아웃</li> {/* 로그아웃 항목 */}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Portal Tabs */}
            <div className="portal-tabs">
                <div className="tab active">메인</div>
                <div className="tab">일정</div>
                <div className="tab">업무</div>
                <div className="tab-add">+</div>
                <div className="portal-menu">
                    <span>포털설정</span>
                    <span>레이아웃</span>
                    <span>새창</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Left Sidebar */}
                <div className="left-sidebar">
                    {/* User Info Widget */}
                    <div className="user-info-widget">
                        <div className="user-avatar-large"></div>
                        <div className="user-name">알앤비 사원</div>
                        <div className="user-department">인력풀</div>
                    </div>
                    {/* Clock Widget */}
                    <div className="clock-widget">
                        <div className="date-display">
                            {formatDate(currentTime)}
                        </div>
                        <div className="time-display">
                            {formatTime(currentTime)}
                        </div>
                    </div>
                </div>

                {/* Center Content */}
                <div className="center-content">
                    {/* Calendar Widget */}
                    <div className="calendar-widget">
                        {/* Calendar Header */}
                        <div className="calendar-header">
                            <button className="calendar-nav" onClick={handlePrevMonth}>
                                ◀
                            </button>
                            <h3>
                                {calendarDate.getFullYear()}. {String(calendarDate.getMonth() + 1).padStart(2, '0')}
                            </h3>
                            <button className="calendar-nav" onClick={handleNextMonth}>
                                ▶
                            </button>
                        </div>

                        {/* Calendar Weekdays */}
                        <div className="calendar-weekdays">
                            {dayNames.map((day, index) => (
                                <div
                                    key={day}
                                    className={`weekday ${index === 0 ? 'sunday' : ''}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="calendar-grid">
                            {calendarDays.map((dateInfo, index) => {
                                const dayOfWeek = index % 7;
                                let className = 'calendar-day';

                                if (!dateInfo.isCurrentMonth) {
                                    className += ' other-month';
                                }
                                if (dateInfo.isToday) {
                                    className += ' today';
                                }
                                if (dayOfWeek === 0 || dayOfWeek === 6) {
                                    className += ' weekend';
                                }

                                return (
                                    <div key={index} className={className}>
                                        {dateInfo.day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Schedule Widget */}
                    <div className="schedule-widget">
                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="date-number">25</div>
                                <div className="date-day">수요일</div>
                            </div>
                            <div className="schedule-content">
                                등록된 일정이 없습니다.
                            </div>
                        </div>

                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="date-number">26</div>
                                <div className="date-day">목요일</div>
                            </div>
                            <div className="schedule-content">
                                등록된 일정이 없습니다.
                            </div>
                        </div>

                        <div className="schedule-item">
                            <div className="schedule-date">
                                <div className="date-number">27</div>
                                <div className="date-day">금요일</div>
                            </div>
                            <div className="schedule-content">
                                등록된 일정이 없습니다.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="right-content">
                    {/* News Widget */}
                    <div className="news-widget">
                        <div className="news-header">
                            <h3>전사게시판 최근글</h3>
                            <div className="news-tabs">
                                <button className="news-tab active">전체</button>
                                <button className="news-tab">공지</button>
                            </div>
                            <div className="news-nav">
                                <button className="news-nav-btn">◀</button>
                                <button className="news-nav-btn">▶</button>
                            </div>
                        </div>

                        <div className="news-list">
                            <div className="news-item">
                                <div className="news-title">
                                    [KENCAI (대출)] AI Chat GPT를 활용한 연구니어로 대외 터널식(7.14-15) 과정 주차자 모집 및 과정 안내
                                </div>
                                <div className="news-meta">
                                    <span>2025-06-18 13:42</span>
                                    <span>부산네신 정보</span>
                                    <span className="news-category">공지</span>
                                </div>
                            </div>

                            <div className="news-item">
                                <div className="news-title">
                                    [KENCAI (대출)] 삼송 가람의 프로젝션 인공 지능 공장(7.14-16) 주차자 모집 및 과정 안내
                                </div>
                                <div className="news-meta">
                                    <span>2025-06-16 09:21</span>
                                    <span>부산네신 정보</span>
                                    <span className="news-category">공지</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;