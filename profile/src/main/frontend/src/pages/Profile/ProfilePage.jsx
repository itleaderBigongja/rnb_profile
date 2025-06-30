// src/pages/Profile/ProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react'; // useRef, useEffect 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 추가 (MainPage Header용)
import Header from '../../components/header/Header.jsx';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate(); // useNavigate 훅 추가

    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Header 드롭다운을 위한 상태
    const dropdownRef = useRef(null); // Header 드롭다운 외부 클릭 감지를 위한 ref

    const [profileData, setProfileData] = useState({
        name: '홍길동',
        gender: '남성',
        birthDate: '1990-01-01',
        workExperience: '5년',
        position: '선임연구원',
        department: '개발팀',
        techGrade: 'A급',
        address: '서울특별시 강남구',
        education: [
            {
                startDate: '2008-03-01',
                endDate: '2012-02-28',
                content: '○○대학교 컴퓨터공학과 학사 졸업'
            }
        ],
        career: [
            {
                startDate: '2020-01-01',
                endDate: '2025-06-30',
                content: '○○회사 개발팀 근무'
            }
        ],
        certificates: [
            {
                authority: '한국산업인력공단',
                name: '정보처리기사',
                date: '2019-12-15'
            }
        ],
        techSkills: {
            language: { skill: 'Java, JavaScript, Python', level: '상' },
            framework: { skill: 'React, Spring Boot', level: '상' },
            database: { skill: 'MySQL, PostgreSQL', level: '중' },
            devops: { skill: 'Docker, Jenkins', level: '중' },
            cloud: { skill: 'AWS, Azure', level: '하' },
            others: { skill: 'Git, Jira', level: '상' }
        },
        training: [
            {
                institution: '○○교육원',
                content: 'React 심화 과정',
                startDate: '2024-01-15',
                endDate: '2024-02-15'
            }
        ]
    });

    const handleInputChange = (field, value, index = null, subField = null) => {
        if (index !== null) {
            const newData = { ...profileData };
            if (subField) {
                newData[field][index][subField] = value;
            } else {
                newData[field][index] = value;
            }
            setProfileData(newData);
        } else if (field.includes('.')) {
            const [mainField, subField] = field.split('.');
            setProfileData(prev => ({
                ...prev,
                [mainField]: {
                    ...prev[mainField],
                    [subField]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const addItem = (field) => {
        const newItem = field === 'education'
            ? { startDate: '', endDate: '', content: '' }
            : field === 'career'
                ? { startDate: '', endDate: '', content: '' }
                : field === 'certificates'
                    ? { authority: '', name: '', date: '' }
                    : { institution: '', content: '', startDate: '', endDate: '' };

        setProfileData(prev => ({
            ...prev,
            [field]: [...prev[field], newItem]
        }));
    };

    const removeItem = (field, index) => {
        setProfileData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        alert('프로필이 저장되었습니다.');
        // TODO: 여기에 실제 저장 (API 호출 등) 로직을 추가
    };

    const handleCancel = () => {
        setIsEditing(false);
        // TODO: 원래 데이터로 복구하는 로직을 여기에 추가할 수 있습니다.
        // 예: setProfileData(originalProfileData);
    };

    return (
        <div className="main-container"> {/* 최상위 컨테이너를 main-container로 변경 */}
            {/* Header (MainPage에서 가져온 부분) */}
            <Header />

            {/* Portal Tabs (MainPage에서 가져온 부분) */}
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

            {/* 기존 ProfilePage의 콘텐츠를 감싸는 새로운 div */}
            <div className="profile-content-wrapper"> {/* 기존 .profile-container의 역할 일부를 대체 */}
                <div className="profile-header">
                    <h1>프로필 관리</h1>
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn-primary" onClick={() => setIsEditing(true)}>
                                수정
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button className="btn-success" onClick={handleSave}>
                                    저장
                                </button>
                                <button className="btn-cancel" onClick={handleCancel}>
                                    취소
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="profile-content">
                    {/* 기본 정보 */}
                    <div className="profile-section">
                        <h2>기본 정보</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>성명</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    disabled
                                    className="input-disabled"
                                />
                            </div>
                            <div className="form-group">
                                <label>성별</label>
                                <input
                                    type="text"
                                    value={profileData.gender}
                                    disabled
                                    className="input-disabled"
                                />
                            </div>
                            <div className="form-group">
                                <label>생년월일</label>
                                <input
                                    type="date"
                                    value={profileData.birthDate}
                                    disabled
                                    className="input-disabled"
                                />
                            </div>
                            <div className="form-group">
                                <label>소속</label>
                                <input
                                    type="text"
                                    value={profileData.department}
                                    disabled
                                    className="input-disabled"
                                />
                            </div>
                            <div className="form-group">
                                <label>근무경력</label>
                                <input
                                    type="text"
                                    value={profileData.workExperience}
                                    onChange={(e) => handleInputChange('workExperience', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>직급</label>
                                <input
                                    type="text"
                                    value={profileData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>기술등급</label>
                                <select
                                    value={profileData.techGrade}
                                    onChange={(e) => handleInputChange('techGrade', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                >
                                    <option value="A급">A급</option>
                                    <option value="B급">B급</option>
                                    <option value="C급">C급</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>주소</label>
                                <input
                                    type="text"
                                    value={profileData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 학력사항 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>학력사항</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('education')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {profileData.education.map((edu, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>시작일자</label>
                                        <input
                                            type="date"
                                            value={edu.startDate}
                                            onChange={(e) => handleInputChange('education', e.target.value, index, 'startDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>종료일자</label>
                                        <input
                                            type="date"
                                            value={edu.endDate}
                                            onChange={(e) => handleInputChange('education', e.target.value, index, 'endDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>학력내용</label>
                                        <input
                                            type="text"
                                            value={edu.content}
                                            onChange={(e) => handleInputChange('education', e.target.value, index, 'content')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                </div>
                                {isEditing && profileData.education.length > 1 && (
                                    <button className="btn-remove" onClick={() => removeItem('education', index)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 경력사항 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>경력사항</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('career')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {profileData.career.map((career, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>시작일자</label>
                                        <input
                                            type="date"
                                            value={career.startDate}
                                            onChange={(e) => handleInputChange('career', e.target.value, index, 'startDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>종료일자</label>
                                        <input
                                            type="date"
                                            value={career.endDate}
                                            onChange={(e) => handleInputChange('career', e.target.value, index, 'endDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>경력내용</label>
                                        <input
                                            type="text"
                                            value={career.content}
                                            onChange={(e) => handleInputChange('career', e.target.value, index, 'content')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                </div>
                                {isEditing && profileData.career.length > 1 && (
                                    <button className="btn-remove" onClick={() => removeItem('career', index)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 자격증 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>자격증</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('certificates')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {profileData.certificates.map((cert, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>인증기관</label>
                                        <input
                                            type="text"
                                            value={cert.authority}
                                            onChange={(e) => handleInputChange('certificates', e.target.value, index, 'authority')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>자격증명</label>
                                        <input
                                            type="text"
                                            value={cert.name}
                                            onChange={(e) => handleInputChange('certificates', e.target.value, index, 'name')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>취득일자</label>
                                        <input
                                            type="date"
                                            value={cert.date}
                                            onChange={(e) => handleInputChange('certificates', e.target.value, index, 'date')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                </div>
                                {isEditing && profileData.certificates.length > 1 && (
                                    <button className="btn-remove" onClick={() => removeItem('certificates', index)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 주요기술 */}
                    <div className="profile-section">
                        <h2>주요기술 (기술스펙)</h2>
                        <div className="tech-skills">
                            {Object.entries(profileData.techSkills).map(([key, value]) => (
                                <div key={key} className="tech-skill-item">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>
                                                {key === 'language' ? '언어' :
                                                    key === 'framework' ? '프레임워크' :
                                                        key === 'database' ? 'DB' :
                                                            key === 'devops' ? 'DevOps' :
                                                                key === 'cloud' ? '클라우드' : '기타'}
                                            </label>
                                            <input
                                                type="text"
                                                value={value.skill}
                                                onChange={(e) => handleInputChange(`techSkills.${key}`, { ...value, skill: e.target.value })}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>숙련도</label>
                                            <select
                                                value={value.level}
                                                onChange={(e) => handleInputChange(`techSkills.${key}`, { ...value, level: e.target.value })}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            >
                                                <option value="상">상</option>
                                                <option value="중">중</option>
                                                <option value="하">하</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 교육기관 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>교육기관</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('training')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {profileData.training.map((training, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>교육기관명</label>
                                        <input
                                            type="text"
                                            value={training.institution}
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'institution')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>교육내용</label>
                                        <input
                                            type="text"
                                            value={training.content}
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'content')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>교육 시작일자</label>
                                        <input
                                            type="date"
                                            value={training.startDate}
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'startDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>교육 종료일자</label>
                                        <input
                                            type="date"
                                            value={training.endDate}
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'endDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                </div>
                                {isEditing && profileData.training.length > 1 && (
                                    <button className="btn-remove" onClick={() => removeItem('training', index)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;