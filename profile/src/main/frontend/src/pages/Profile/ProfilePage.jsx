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

// 이수 분류 코드 (COMPLETE_TB)
const COMPLETE_DIV_CODES = {
    EDUCATION: 'EDUCATION', // 학력
    TRAINING: 'TRAINING',   // 교육
};

// 이력 분류 코드 (PERSON_HISTORY_TB)
const PERSON_HISTORY_DIV_CODES = {
    CAREER: 'CAREER',           // 경력
    CERTIFICATE: 'CERTIFICATE', // 자격증
};


const ProfilePage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Daum Postcode API 로드 상태
    const [isDaumPostcodeLoaded, setIsDaumPostcodeLoaded] = useState(false);

    const [profileData, setProfileData] = useState({
        // EMPLOYEE_TB와 매핑되는 필드 (DB 컬럼명과 일치)
        firstName: '길동', // FIRST_NAME
        lastName: '홍',    // LAST_NAME
        gender: '남성',    // EMPLOYEE_TB에 직접적인 필드 없음, 프론트엔드에서만 표시용
        birthday: '1990-01-01', // BIRTHDAY
        workCareer: '5년', // WORK_CAREER
        position: '선임연구원', // EMPLOYEE_TB에 직접 필드 없음, 프론트엔드에서만 표시용
        department: '개발팀', // DEPT_CODE (DB에는 코드값 저장)
        abilityLevel: '초급', // ABILITY_LEVEL

        // 주소 관련 필드 (DB 컬럼명과 일치)
        zipNo: '',           // ZIP_NO
        address: '',         // ADDRESS
        addressDtl: '',      // ADDRESS_DTL
        addressDivCode: 'ROAD', // ADDRESS_DIV_CODE

        // COMPLETE_TB (이수) - 학력사항
        // complDivCode: 'EDUCATION'
        completes: [
            {
                id: 1, // 프론트엔드에서 고유 식별용 (COMPL_SEQ_NO와는 다름)
                complDivCode: COMPLETE_DIV_CODES.EDUCATION, // 이수분류코드: EDUCATION
                complOrgName: '○○대학교', // COMPL_ORG_DIV_NAME (학교명)
                complName: '컴퓨터공학과 학사 졸업', // COMPL_NAME (학력내용)
                complDate: '2012-02-28', // COMPL_DATE (졸업일)
                startDate: '2008-03-01', // 편의상 추가 (입학일 같은), DB에는 COMPL_DATE만
            }
        ],
        // PERSON_HISTORY_TB (개인이력) - 경력사항
        // hstDivCode: 'CAREER'
        personHistories: [
            {
                id: 1, // 프론트엔드에서 고유 식별용 (HIS_SEQ_NO와는 다름)
                hstDivCode: PERSON_HISTORY_DIV_CODES.CAREER, // 이력분류코드: CAREER
                hstOrgName: '○○회사', // HST_ORG_NAME (회사명)
                histStartDate: '2020-01-01', // HIST_START_DATE
                histEndDate: '2025-06-30', // HIST_END_DATE
                histContent: '개발팀 근무', // HIST_CONTENT (경력내용)
            },
            // PERSON_HISTORY_TB (개인이력) - 자격증
            // hstDivCode: 'CERTIFICATE'
            {
                id: 2, // 고유 id
                hstDivCode: PERSON_HISTORY_DIV_CODES.CERTIFICATE, // 이력분류코드: CERTIFICATE
                hstOrgName: '한국산업인력공단', // HST_ORG_NAME (인증기관)
                histContent: '정보처리기사',     // HIST_CONTENT (자격증명)
                histStartDate: '2019-12-15',     // HIST_START_DATE (취득일자)
                histEndDate: '',                 // 자격증은 종료일 없음
            }
        ],
        // TECH_SKILL_TB (기술스펙)
        techSkills: [
            { id: 1, category: 'language', skill: 'Java, JavaScript, Python', level: '상' },
            { id: 2, category: 'framework', skill: 'React, Spring Boot', level: '상' },
            { id: 3, category: 'database', skill: 'MySQL, PostgreSQL', level: '중' },
            { id: 4, category: 'devops', skill: 'Docker, Jenkins', level: '중' },
            { id: 5, category: 'cloud', skill: 'AWS, Azure', level: '하' },
            { id: 6, category: 'others', skill: 'Git, Jira', level: '상' }
        ],
        // COMPLETE_TB (이수) - 교육기관
        // complDivCode: 'TRAINING'
        training: [ // 편의상 별도 필드로 유지 (backend 전송 시 completes 배열로 합치거나 분류)
            {
                id: 1, // 고유 id
                complDivCode: COMPLETE_DIV_CODES.TRAINING, // 이수분류코드: TRAINING
                complOrgName: '○○교육원', // COMPL_ORG_DIV_NAME (교육기관명)
                complName: 'React 심화 과정', // COMPL_NAME (교육내용)
                complDate: '2024-02-15', // COMPL_DATE (종료일)
                startDate: '2024-01-15', // 편의상 추가 (시작일), DB에는 COMPL_DATE만
            }
        ]
    });

    const [originalProfileData, setOriginalProfileData] = useState({});

    useEffect(() => {
        const scriptId = 'daum-postcode-script';
        if (document.getElementById(scriptId)) {
            if (window.daum && window.daum.Postcode) {
                setIsDaumPostcodeLoaded(true);
                console.log('Daum Postcode API already loaded.');
            }
            return;
        }

        const script = document.createElement('script');
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
    }, []);

    useEffect(() => {
        setOriginalProfileData({ ...profileData });
    }, []);

    // handleInputChange 함수 수정: 테이블 필드명에 맞게 변경
    const handleInputChange = (field, value, index = null, subField = null) => {
        if (index !== null) {
            setProfileData(prev => {
                let updatedList;
                if (field === 'completes') {
                    updatedList = [...prev.completes];
                    updatedList[index] = { ...updatedList[index], [subField]: value };
                } else if (field === 'personHistories') {
                    updatedList = [...prev.personHistories];
                    updatedList[index] = { ...updatedList[index], [subField]: value };
                } else if (field === 'techSkills') {
                    updatedList = [...prev.techSkills];
                    updatedList[index] = { ...updatedList[index], [subField]: value };
                } else if (field === 'training') { // training은 completes 배열에 속하지만, 편의상 별도로 처리
                    updatedList = [...prev.training];
                    updatedList[index] = { ...updatedList[index], [subField]: value };
                }
                return { ...prev, [field]: updatedList };
            });
        } else {
            setProfileData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const addItem = (field) => {
        const tempId = Date.now(); // 고유 ID 생성 (프론트엔드 전용)
        let newItem = {};

        if (field === 'completes' || field === 'education') { // 학력 추가
            newItem = {
                id: tempId,
                complDivCode: COMPLETE_DIV_CODES.EDUCATION,
                complOrgName: '',
                complName: '',
                complDate: '',
                startDate: '', // UI 편의상
            };
            setProfileData(prev => ({
                ...prev,
                completes: [...prev.completes, newItem]
            }));
        } else if (field === 'personHistories' || field === 'career') { // 경력 추가
            newItem = {
                id: tempId,
                hstDivCode: PERSON_HISTORY_DIV_CODES.CAREER,
                hstOrgName: '',
                histStartDate: '',
                histEndDate: '',
                histContent: '',
            };
            setProfileData(prev => ({
                ...prev,
                personHistories: [...prev.personHistories, newItem]
            }));
        } else if (field === 'certificates') { // 자격증 추가
            newItem = {
                id: tempId,
                hstDivCode: PERSON_HISTORY_DIV_CODES.CERTIFICATE,
                hstOrgName: '',
                histContent: '',
                histStartDate: '', // 취득일
                histEndDate: '',   // 자격증은 종료일 없음
            };
            // personHistories 배열에 추가
            setProfileData(prev => ({
                ...prev,
                personHistories: [...prev.personHistories, newItem]
            }));
        } else if (field === 'training') { // 교육 추가
            newItem = {
                id: tempId,
                complDivCode: COMPLETE_DIV_CODES.TRAINING,
                complOrgName: '',
                complName: '',
                complDate: '', // 종료일
                startDate: '', // UI 편의상
            };
            // training 배열에 추가 (추후 백엔드 전송 시 completes로 통합)
            setProfileData(prev => ({
                ...prev,
                training: [...prev.training, newItem]
            }));
        } else if (field === 'techSkills') {
            newItem = {
                id: tempId,
                category: TECH_CATEGORIES[0].value,
                skill: '',
                level: SKILL_LEVELS[1]
            };
            setProfileData(prev => ({
                ...prev,
                techSkills: [...prev.techSkills, newItem]
            }));
        }
    };

    const removeItem = (field, index) => {
        setProfileData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

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

    const handleSave = () => {
        setIsEditing(false);
        alert('프로필이 저장되었습니다.');
        // TODO: 여기에 실제 저장 (API 호출 등) 로직을 추가
        // 백엔드로 전송할 데이터 구조를 최종적으로 변환해야 할 수 있음.
        // 예를 들어, training 배열을 completes 배열에 complDivCode: 'TRAINING'으로 추가하거나,
        // 별도의 DTO로 묶어서 전송하는 방식 고려.
        console.log("Saving profile data:", profileData);
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
                                <input type="text" value={`${profileData.lastName}${profileData.firstName}`} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>성별</label>
                                <input type="text" value={profileData.gender} disabled className="input-disabled" />
                            </div>
                            <div className="form-group">
                                <label>생년월일</label>
                                <input
                                    type="date"
                                    value={profileData.birthday}
                                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>소속</label>
                                <input
                                    type="text"
                                    value={profileData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                />
                            </div>
                            <div className="form-group">
                                <label>근무경력</label>
                                <input
                                    type="text"
                                    value={profileData.workCareer}
                                    onChange={(e) => handleInputChange('workCareer', e.target.value)}
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
                                    value={profileData.abilityLevel}
                                    onChange={(e) => handleInputChange('abilityLevel', e.target.value)}
                                    disabled={!isEditing}
                                    className={isEditing ? '' : 'input-readonly'}
                                >
                                    <option value="초급">초급</option>
                                    <option value="중급">중급</option>
                                    <option value="고급">고급</option>
                                    <option value="특급">특급</option>
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
                                        readOnly
                                        disabled={!isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddressSearch}
                                        className="search-button"
                                        disabled={!isDaumPostcodeLoaded || !isEditing}
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
                                    readOnly
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
                        </div>
                    </div>

                    {/* 학력사항 - COMPLETE_TB 매핑 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>학력사항</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('completes')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {/* profileData.completes 배열에서 education 타입만 필터링하여 렌더링 */}
                        {profileData.completes
                            .filter(item => item.complDivCode === COMPLETE_DIV_CODES.EDUCATION)
                            .map((edu, index) => (
                                <div key={edu.id || index} className="dynamic-item">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>시작일자</label>
                                            <input
                                                type="date"
                                                value={edu.startDate} // UI용 시작일
                                                onChange={(e) => handleInputChange('completes', e.target.value, index, 'startDate')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>졸업일자</label>
                                            <input
                                                type="date"
                                                value={edu.complDate} // DB에 매핑될 필드: COMPL_DATE
                                                onChange={(e) => handleInputChange('completes', e.target.value, index, 'complDate')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>학교명</label>
                                            <input
                                                type="text"
                                                value={edu.complOrgName} // DB에 매핑될 필드: COMPL_ORG_DIV_NAME
                                                onChange={(e) => handleInputChange('completes', e.target.value, index, 'complOrgName')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>학력내용</label>
                                            <input
                                                type="text"
                                                value={edu.complName} // DB에 매핑될 필드: COMPL_NAME
                                                onChange={(e) => handleInputChange('completes', e.target.value, index, 'complName')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                    </div>
                                    {isEditing && profileData.completes.filter(item => item.complDivCode === COMPLETE_DIV_CODES.EDUCATION).length > 1 && (
                                        <button className="btn-remove" onClick={() => removeItem('completes', index)}>
                                            삭제
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* 경력사항 - PERSON_HISTORY_TB 매핑 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>경력사항</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('personHistories')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {/* profileData.personHistories 배열에서 career 타입만 필터링하여 렌더링 */}
                        {profileData.personHistories
                            .filter(item => item.hstDivCode === PERSON_HISTORY_DIV_CODES.CAREER)
                            .map((career, index) => (
                                <div key={career.id || index} className="dynamic-item">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>시작일자</label>
                                            <input
                                                type="date"
                                                value={career.histStartDate} // DB에 매핑될 필드: HIST_START_DATE
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'histStartDate')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>종료일자</label>
                                            <input
                                                type="date"
                                                value={career.histEndDate} // DB에 매핑될 필드: HIST_END_DATE
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'histEndDate')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>회사명</label>
                                            <input
                                                type="text"
                                                value={career.hstOrgName} // DB에 매핑될 필드: HST_ORG_NAME
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'hstOrgName')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>경력내용</label>
                                            <input
                                                type="text"
                                                value={career.histContent} // DB에 매핑될 필드: HIST_CONTENT
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'histContent')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                    </div>
                                    {isEditing && profileData.personHistories.filter(item => item.hstDivCode === PERSON_HISTORY_DIV_CODES.CAREER).length > 1 && (
                                        <button className="btn-remove" onClick={() => removeItem('personHistories', index)}>
                                            삭제
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* 자격증 - PERSON_HISTORY_TB 매핑 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>자격증</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('certificates')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {/* profileData.personHistories 배열에서 certificate 타입만 필터링하여 렌더링 */}
                        {profileData.personHistories
                            .filter(item => item.hstDivCode === PERSON_HISTORY_DIV_CODES.CERTIFICATE)
                            .map((cert, index) => (
                                <div key={cert.id || index} className="dynamic-item">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>인증기관</label>
                                            <input
                                                type="text"
                                                value={cert.hstOrgName} // DB에 매핑될 필드: HST_ORG_NAME
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'hstOrgName')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>자격증명</label>
                                            <input
                                                type="text"
                                                value={cert.histContent} // DB에 매핑될 필드: HIST_CONTENT
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'histContent')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>취득일자</label>
                                            <input
                                                type="date"
                                                value={cert.histStartDate} // DB에 매핑될 필드: HIST_START_DATE (자격증은 보통 시작일만)
                                                onChange={(e) => handleInputChange('personHistories', e.target.value, index, 'histStartDate')}
                                                disabled={!isEditing}
                                                className={isEditing ? '' : 'input-readonly'}
                                            />
                                        </div>
                                    </div>
                                    {isEditing && profileData.personHistories.filter(item => item.hstDivCode === PERSON_HISTORY_DIV_CODES.CERTIFICATE).length > 1 && (
                                        <button className="btn-remove" onClick={() => removeItem('personHistories', index)}>
                                            삭제
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* 주요기술 (기술스펙) */}
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
                                <div className="form-grid tech-skill-grid">
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
                                {isEditing && profileData.techSkills.length > 1 && (
                                    <button className="btn-remove" onClick={() => removeItem('techSkills', index)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 교육기관 - COMPLETE_TB 매핑 */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>교육기관</h2>
                            {isEditing && (
                                <button className="btn-add" onClick={() => addItem('training')}>
                                    + 추가
                                </button>
                            )}
                        </div>
                        {/* profileData.training 배열에서 렌더링 (원래는 completes 배열에 포함되어야 함) */}
                        {profileData.training.map((train, index) => (
                            <div key={train.id || index} className="dynamic-item">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>교육기관명</label>
                                        <input
                                            type="text"
                                            value={train.complOrgName} // DB에 매핑될 필드: COMPL_ORG_DIV_NAME
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'complOrgName')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>교육내용</label>
                                        <input
                                            type="text"
                                            value={train.complName} // DB에 매핑될 필드: COMPL_NAME
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'complName')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>시작일자</label>
                                        <input
                                            type="date"
                                            value={train.startDate} // UI용 시작일
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'startDate')}
                                            disabled={!isEditing}
                                            className={isEditing ? '' : 'input-readonly'}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>종료일자</label>
                                        <input
                                            type="date"
                                            value={train.complDate} // DB에 매핑될 필드: COMPL_DATE
                                            onChange={(e) => handleInputChange('training', e.target.value, index, 'complDate')}
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