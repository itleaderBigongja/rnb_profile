import React, { useState, useEffect } from 'react';
import './MainPage.css';

const MainPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(25);
    const [currentTime, setCurrentTime] = useState('15:02:49');

    // 현재 시간 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('ko-KR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }));
            setCurrentDate(now);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 캘린더 데이터 생성
    const generateCalendarDays = () => {
        const year = 2025;
        const month = 5; // 6월 (0-based)
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        const days = [];

        // 이전 달 마지막 날들
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                isToday: false
            });
        }

        // 현재 달 날들
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                isToday: day === 25,
                isWeekend: new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6
            });
        }

        // 다음 달 첫 날들
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                isToday: false
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    const scheduleData = [
        { date: 25, day: '수요일', message: '등록된 일정이 없습니다.' },
        { date: 26, day: '목요일', message: '등록된 일정이 없습니다.' },
        { date: 27, day: '금요일', message: '등록된 일정이 없습니다.' }
    ];

    const newsData = [
        {
            title: '[KENCAI (데온)] AI Chat GPT를 활용한 연구니어링 데이터 분석(7.14-15) 과정 수강자 모집 및 과정 안내',
            date: '2025-06-18 13:45',
            author: '부산대 전략',
            category: '과정'
        },
        {
            title: '[KENCAI (데온)] 심층 기반의 프로젝션 인공 지능공정(7.14-16) 수강자 모집 및 과정 안내',
            date: '2025-06-16 09:21',
            author: '부산대 전략',
            category: '과정'
        }
    ];

    return (
        <div className="main-container">
            {/* Header */}
            <header className="main-header">
                <div className="header-left">
                    <div className="logo-section">
                        <img src="/path/to/your/logo.png" alt="알엔비소프트" className="header-logo" />
                        <span className="company-title">알엔비소프트</span>
                    </div>
                    <nav className="main-nav">
                        <a href="#" className="nav-item">홈</a>
                        <a href="#" className="nav-item">전자결재</a>
                        <a href="#" className="nav-item">메일</a>
                        <a href="#" className="nav-item">그룹웨어</a>
                        <a href="#" className="nav-item">게시판</a>
                        <a href="#" className="nav-item">캘린더</a>
                        <a href="#" className="nav-item">온세프런</a>
                        <a href="#" className="nav-item">예약</a>
                        <a href="#" className="nav-item dropdown">
                            소셜
                            <span className="dropdown-arrow">▼</span>
                        </a>
                        <a href="#" className="nav-item dropdown">
                            협업
                            <span className="dropdown-arrow">▼</span>
                        </a>
                        <a href="#" className="nav-item">전자 우체통</a>
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
            <div className="portal-tabs"></div>

            {/* Main Content */}
            <main className="main-content">
                {/* Left Sidebar */}
                <aside className="left-sidebar">
                    {/* Clock */}
                    <div className="clock-widget">
                        <div className="date-display">2025-06-25(수)</div>
                        <div className="time-display">{currentTime}</div>
                    </div>

                    {/* User Info */}
                    <div className="user-info-widget">
                        <div className="user-avatar-large"></div>
                        <div className="user-name">알앤비 사원</div>
                        <div className="user-department">인력풀</div>
                    </div>
                </aside>

                {/* Center Content */}
                <section className="center-content">
                    {/* Calendar */}
                    <div className="calendar-widget">
                        <div className="calendar-header">
                            <button className="calendar-nav">‹</button>
                            <h3>2025. 06</h3>
                            <button className="calendar-nav">›</button>
                        </div>
                        <div className="calendar-weekdays">
                            {weekDays.map((day, index) => (
                                <div key={index} className={`weekday ${index === 0 ? 'sunday' : ''}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="calendar-grid">
                            {calendarDays.map((dayObj, index) => (
                                <div
                                    key={index}
                                    className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} 
                    ${dayObj.isToday ? 'today' : ''} 
                    ${dayObj.isWeekend && dayObj.isCurrentMonth ? 'weekend' : ''}`}
                                >
                                    {dayObj.day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="schedule-widget">
                        {scheduleData.map((schedule, index) => (
                            <div key={index} className="schedule-item">
                                <div className="schedule-date">
                                    <span className="date-number">{schedule.date}</span>
                                    <span className="date-day">{schedule.day}</span>
                                </div>
                                <div className="schedule-content">
                                    {schedule.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Right Content */}
                <section className="right-content">
                    <div className="news-widget">
                        <div className="news-header">
                            <h3>전사게시판 최근글</h3>
                            <div className="news-tabs">
                                <button className="news-tab active">전체</button>
                                <button className="news-tab">공지</button>
                            </div>
                            <div className="news-nav">
                                <button className="news-nav-btn">‹</button>
                                <button className="news-nav-btn">›</button>
                            </div>
                        </div>
                        <div className="news-list">
                            {newsData.map((news, index) => (
                                <div key={index} className="news-item">
                                    <div className="news-title">{news.title}</div>
                                    <div className="news-meta">
                                        <span>{news.date}</span>
                                        <span>{news.author}</span>
                                        <span className="news-category">{news.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MainPage;