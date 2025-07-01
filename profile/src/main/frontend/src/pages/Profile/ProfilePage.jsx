// src/pages/Profile/ProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header.jsx';
import './ProfilePage.css';

// 공통 테이블(목업 데이터) 역할을 할 상수 정의
// 실제 환경에서는 API 호출을 통해 DB에서 가져와야 합니다.
const TECH_CATEGORIES = [
    { value: 'language', label: '언어' },
    { value: 'framework', label: '프레임워크' },
    { value: 'database', label: 'DB' },
    { value: 'devops', label: 'DevOps' },
    { value: 'cloud', label: '클라우드' },
    { value: 'others', label: '기타' },
];

const SKILL_LEVELS = ['상', '중', '하'];


const ProfilePage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Daum Postcode API 로드 상태
    const [isDaumPostcodeLoaded, setIsDaumPostcodeLoaded] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '홍길동',
        gender: '남성',
        birthDate: '1990-01-01',
        workExperience: '5년',
        position: '선임연구원',
        department: '개발팀',
        techGrade: 'A급',

        // 주소 관련 필드 추가
        zipNo: '',
        address: '',
        addressDtl: '',
        addressDivCode: 'ROAD',

        education: [
            {
                id: 1, // id 추가 (고유성을 위해)
                startDate: '2008-03-01',
                endDate: '2012-02-28',
                content: '○○대학교 컴퓨터공학과 학사 졸업'
            }
        ],
        career: [
            {
                id: 1, // id 추가
                startDate: '2020-01-01',
                endDate: '2025-06-30',
                content: '○○회사 개발팀 근무'
            }
        ],
        certificates: [
            {
                id: 1, // id 추가
                authority: '한국산업인력공단',
                name: '정보처리기사',
                date: '2019-12-15'
            }
        ],
        // 객체에서 배열로 변경 (다중 항목을 위해)
        techSkills: [
            { id: 1, category: 'language', skill: 'Java, JavaScript, Python', level: '상' },
            { id: 2, category: 'framework', skill: 'React, Spring Boot', level: '상' },
            { id: 3, category: 'database', skill: 'MySQL, PostgreSQL', level: '중' },
            { id: 4, category: 'devops', skill: 'Docker, Jenkins', level: '중' },
            { id: 5, category: 'cloud', skill: 'AWS, Azure', level: '하' },
            { id: 6, category: 'others', skill: 'Git, Jira', level: '상' }
        ],
        training: [
            {
                id: 1, // id 추가
                institution: '○○교육원',
                content: 'React 심화 과정',
                startDate: '2024-01-15',
                endDate: '2024-02-15'
            }
        ]
    });

    const [originalProfileData, setOriginalProfileData] = useState({});

    // Daum Postcode API 스크립트 로드 및 준비 확인
    useEffect(() => {
        const scriptId = 'daum-postcode-script';

        // 스크립트가 이미 존재하면 재로딩하지 않음
        if (document.getElementById(scriptId)) {
            // 이전에 로드된 스크립트가 있다면 isDaumPostcodeLoaded를 true로 설정
            if (window.daum && window.daum.Postcode) {
                // autoload=false를 사용했다면 여기서 load() 호출이 필요할 수 있지만,
                // 현재 코드(autoload=true)에서는 이미 Postcode 객체가 생성되어 있음.
                // 따라서 상태만 true로 설정.
                setIsDaumPostcodeLoaded(true);
                console.log('Daum Postcode API already loaded.');
            }
            return;
        }

        const script = document.createElement('script');
        // ✅ autoload=true (기본) 유지. 불필요한 load() 호출 제거 (아래 handleAddressSearch 함수에서 new Postcode()로 사용)
        script.src = '//t1.daumcdn.net/map_js_init/postcode.v2.js';
        script.id = scriptId;
        script.async = true;
        script.onload = () => {
            if (window.daum && window.daum.Postcode) {
                setIsDaumPostcodeLoaded(true);
                console.log('Daum Postcode API loaded successfully.');
            } else {
                console.error('Daum Postcode API not available after script load.');
            }
        };
        document.head.appendChild(script);

        // SPA에서는 스크립트를 유지하는 것이 일반적
        // return () => { ... } 주석 처리 유지 (이전과 동일)
    }, []);

    // 초기 데이터 로딩 (목업 데이터)
    useEffect(() => {
        setOriginalProfileData({ ...profileData });
    }, []);

    // ✅ handleInputChange 함수 수정: techSkills 배열에 대한 처리 포함
    const handleInputChange = (field, value, index = null, subField = null) => {
        if (index !== null) {
            setProfileData(prev => {
                const newList = [...prev[field]];
                if (subField) {
                    newList[index] = { ...newList[index], [subField]: value };
                } else {
                    newList[index] = value;
                }
                return { ...prev, [field]: newList };
            });
        }
            // ✅ techSkills는 더 이상 중첩된 객체로 접근하지 않고, 배열 항목으로 직접 접근하므로 이 조건 제거
            // else if (field.includes('.')) {
            //     const [mainField, subField] = field.split('.');
            //     setProfileData(prev => ({
            //         ...prev,
            //         [mainField]: {
            //             ...prev[mainField],
            //             [subField]: {
            //                 ...prev[mainField][subField],
            //                 skill: value.skill !== undefined ? value.skill : prev[mainField][subField].skill,
            //                 level: value.level !== undefined ? value.level : prev[mainField][subField].level
            //             }
            //         }
            //     }));
        // }
        else {
            setProfileData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // ✅ addItem 함수 수정: techSkills 항목 추가 로직 포함
    const addItem = (field) => {
        const newItem = {};
        const tempId = Date.now(); // 고유 ID 생성

        if (field === 'education') {
            Object.assign(newItem, { id: tempId, startDate: '', endDate: '', content: '' });
        } else if (field === 'career') {
            Object.assign(newItem, { id: tempId, startDate: '', endDate: '', content: '' });
        } else if (field === 'certificates') {
            Object.assign(newItem, { id: tempId, authority: '', name: '', date: '' });
        } else if (field === 'training') {
            Object.assign(newItem, { id: tempId, institution: '', content: '', startDate: '', endDate: '' });
        } else if (field === 'techSkills') {
            // ✅ 새로운 기술 스킬 항목 추가
            Object.assign(newItem, {
                id: tempId,
                category: TECH_CATEGORIES[0].value, // 첫 번째 카테고리로 기본 설정
                skill: '',
                level: SKILL_LEVELS[1] // '중'으로 기본 설정
            });
        }

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

    // --- 카카오 주소 검색 API 관련 코드 시작 (회원가입 로직 반영) ---
    const handleAddressSearch = () => {
        if (!isDaumPostcodeLoaded || !window.daum || !window.daum.Postcode) {
            alert('주소 검색 API가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
            console.error('Daum Postcode API not ready.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddress !== '') {
                    fullAddress += ' (' + extraAddress + ')';
                }

                setProfileData(prev => ({
                    ...prev,
                    zipNo: data.zonecode,
                    address: fullAddress,
                    addressDtl: '',
                    addressDivCode: data.userSelectedType === 'R' ? 'ROAD' : 'JIBUN'
                }));

                const detailInput = document.getElementById('addressDtl');
                if (detailInput) {
                    detailInput.focus();
                }
            }
        }).open();
    };
    // --- 카카오 주소 검색 API 관련 코드 끝 ---

    const handleSave = () => {
        setIsEditing(false);
        alert('프로필이 저장되었습니다.');
        // TODO: 여기에 실제 저장 (API 호출 등) 로직을 추가
        // console.log("Saving profile data:", profileData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileData(originalProfileData);
        alert('프로필 수정이 취소되었습니다.');
    };

    return (
        <div className="main-container">
            <Header />

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

            <div className="profile-content-wrapper">
                <div className="profile-header">
                    <h1>프로필 관리</h1>
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn-primary" onClick={() => {
                                setIsEditing(true);
                                setOriginalProfileData({ ...profileData });
                            }}>
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
                                <input type="text" value={profileData.name} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>성별</label>
                                <input type="text" value={profileData.gender} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>생년월일</label>
                                <input type="date" value={profileData.birthDate} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>소속</label>
                                <input type="text" value={profileData.department} disabled className="input-disabled" />
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
                            {/* 주소 관련 필드 시작 */}
                            <div className="form-group full-width">
                                <label htmlFor="zipNo">우편번호</label>
                                <div className="input-with-button">
                                    <input
                                        type="text"
                                        id="zipNo"
                                        name="zipNo"
                                        value={profileData.zipNo}
                                        placeholder="우편번호"
                                        maxLength="5"
                                        readOnly // 수동 입력 방지 (주소 검색으로만 입력)
                                        disabled={!isEditing} // 편집 모드에서만 활성화 (버튼과 함께)
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddressSearch}
                                        className="search-button"
                                        disabled={!isDaumPostcodeLoaded || !isEditing} // API 로딩 전, 편집 모드 아닐 때 비활성화
                                    >
                                        주소검색
                                    </button>
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="address">기본 주소</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={profileData.address}
                                    placeholder="주소를 검색하여 입력됩니다"
                                    readOnly // 수동 입력 방지 (주소 검색으로만 입력)
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="addressDtl">상세 주소</label>
                                <input
                                    type="text"
                                    id="addressDtl"
                                    name="addressDtl"
                                    value={profileData.addressDtl}
                                    onChange={(e) => handleInputChange('addressDtl', e.target.value)}
                                    placeholder="나머지 주소를 입력하세요 (예: 동/호수)"
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>주소 분류</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="addressDivCode"
                                            value="ROAD"
                                            checked={profileData.addressDivCode === 'ROAD'}
                                            onChange={(e) => handleInputChange('addressDivCode', e.target.value)}
                                            disabled={!isEditing}
                                        /> 도로명 주소
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="addressDivCode"
                                            value="JIBUN"
                                            checked={profileData.addressDivCode === 'JIBUN'}
                                            onChange={(e) => handleInputChange('addressDivCode', e.target.value)}
                                            disabled={!isEditing}
                                        /> 지번 주소
                                    </label>
                                </div>
                            </div>
                            {/* 주소 관련 필드 끝 */}
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
                            <div key={edu.id || index} className="dynamic-item">
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
                            <div key={career.id || index} className="dynamic-item">
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
                            <div key={cert.id || index} className="dynamic-item">
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

                    {/* 주요기술 (기술스펙) - ✅ 수정된 부분 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>주요기술 (기술스펙)</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('techSkills')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {profileData.techSkills.map((tech, index) => (
                            <div key={tech.id || index} className="dynamic-item tech-skill-item">
                                <div className="form-grid tech-skill-grid"> {/* 새로운 클래스 적용 */}
                                    <div className="form-group">
                                        <label>카테고리</label>
                                        <select
                                            value={tech.category}
                                            onChange={(e) => handleInputChange('techSkills', e.target.value, index, 'category')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        >
                                            {TECH_CATEGORIES.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>기술명</label>
                                        <input
                                            type="text"
                                            value={tech.skill}
                                            onChange={(e) => handleInputChange('techSkills', e.target.value, index, 'skill')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                            placeholder="예: Java, Spring Boot"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>숙련도</label>
                                        <select
                                            value={tech.level}
                                            onChange={(e) => handleInputChange('techSkills', e.target.value, index, 'level')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        >
                                            {SKILL_LEVELS.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {/* 여기 조건 수정: profileData.techSkills.length > 1 일 때만 삭제 버튼 보이게 */}
                                {isEditing && profileData.techSkills.length > 1 && (
                                    <button className="btn-remove" onClick={() => removeItem('techSkills', index)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
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
                            <div key={training.id || index} className="dynamic-item">
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