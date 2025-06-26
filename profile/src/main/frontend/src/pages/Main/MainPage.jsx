import React, { useState, useEffect } from 'react';
import './MainPage.css';

const MainPage = () => {
    // 현재 날짜 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    // 달력 표시용 년월 상태
    const [calendarDate, setCalendarDate] = useState(new Date());
    // 실시간 시간 표시용 상태
    const [currentTime, setCurrentTime] = useState(new Date());

    // 실시간 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                        <div className="profile-avatar"></div>
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