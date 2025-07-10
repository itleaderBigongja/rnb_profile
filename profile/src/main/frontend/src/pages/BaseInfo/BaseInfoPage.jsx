// src/pages/BaseInfo/BaseInfoPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// lucide-react에서 필요한 아이콘들을 임포트합니다.
import { User, Building2, MapPin, Mail, Phone, Edit3, Camera } from 'lucide-react';
import Header from '../../components/header/Header.jsx';
import './BaseInfoPage.css'; // BaseInfo.css 임포트

const BaseInfoPage = () => {
    const navigate = useNavigate();

    // 상태 정의
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 메뉴 열림 여부
    const dropdownRef = useRef(null); // 드롭다운 메뉴 외부 클릭 감지를 위한 ref
    const fileInputRef = useRef(null); // 파일 업로드를 위한 ref

    // 사용자 프로필 데이터 (초기값 설정)
    const [baseInfoData, setBaseInfoData] = useState({
        name: '알앤비 직원',
        position: '사원',
        company: '알앤비소프트', // 회사는 고정값이거나 백엔드에서 가져올 값으로 가정
        department: '인력풀',
        email: 'hong.gildong@rnbsoft.co.kr',
        phone: '010-9983-0561',
        directPhone: '02-1234-5678',
        baseInfoImage: null, // 프로필 이미지 상태 추가
        // 여기에 추가적으로 필요한 프로필 정보 필드를 정의할 수 있습니다.
        // 예: userId, birthday, hireDate, abilityLevel, workCareer 등
        // 실제 데이터는 백엔드에서 불러와야 합니다.
    });

    // 입력 필드 값 변경 핸들러
    const handleInputChange = (field, value) => {
        setBaseInfoData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 프로필 이미지 업로드 핸들러
    const handleBaseInfoImageUpload = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 시 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 이미지 파일인지 확인
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setBaseInfoData(prev => ({
                        ...prev,
                        baseInfoImage: e.target.result
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('이미지 파일만 업로드 가능합니다.');
            }
        }
    };

    // '저장' 버튼 클릭 핸들러
    const handleSave = () => {
        // TODO: 여기서 백엔드로 프로필 데이터를 업데이트하는 API 호출 로직을 구현합니다.
        console.log("프로필 데이터 저장:", baseInfoData);
        alert("프로필 정보가 저장되었습니다.");
        setIsEditing(false); // 저장 후 편집 모드 종료
    };

    // TODO: 컴포넌트 마운트 시 백엔드에서 초기 프로필 데이터를 불러오는 useEffect 추가 필요
    // useEffect(() => {
    //     const fetchBaseInfoData = async () => {
    //         try {
    //             // 예시: API 호출
    //             const response = await fetch('/api/baseInfo');
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setBaseInfoData(data); // 불러온 데이터로 상태 업데이트
    //             } else {
    //                 console.error("프로필 데이터를 불러오는데 실패했습니다.");
    //             }
    //         } catch (error) {
    //             console.error("네트워크 오류:", error);
    //         }
    //     };
    //     fetchBaseInfoData();
    // }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

    return (
        <div className="main-container">
            {/* Header */}
            <Header />

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

            {/* Main Content Area */}
            <div className="main-content">
                {/* 중앙 정렬된 컨테이너 */}
                <div className="baseInfo-container">
                    {/* "기본정보" 제목과 버튼 섹션 */}
                    <div className="baseInfo-header">
                        <h1 className="baseInfo-title">기본정보</h1>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className="edit-button"
                        >
                            <Edit3 size={16} />
                            {isEditing ? '저장' : '편집'}
                        </button>
                    </div>

                    {/* BaseInfo Content (흰색 카드 부분) */}
                    <div className="baseInfo-card">
                        {/* BaseInfo Photo Section */}
                        <div className="baseInfo-photo-section">
                            <div className="photo-container">
                                <div className="photo-placeholder">
                                    {baseInfoData.baseInfoImage ? (
                                        <img
                                            src={baseInfoData.baseInfoImage}
                                            alt="BaseInfo"
                                            className="baseInfo-image"
                                        />
                                    ) : (
                                        <User size={64} className="photo-icon" />
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        className="photo-edit-button"
                                        onClick={handleBaseInfoImageUpload}
                                    >
                                        <Camera size={16} />
                                    </button>
                                )}
                                {/* 숨겨진 파일 입력 */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <p className="photo-notice">
                                ※ 사진은 자동으로 150x150 사이즈로 적용 됩니다.
                            </p>
                        </div>

                        {/* BaseInfo Information Grid */}
                        <div className="baseInfo-grid">
                            {/* Name - 편집 불가능 */}
                            <div className="form-group">
                                <label className="form-label">
                                    <User size={16} />
                                    이름
                                </label>
                                <div className="form-display readonly">
                                    {baseInfoData.name}
                                </div>
                            </div>

                            {/* Position */}
                            <div className="form-group">
                                <label className="form-label">
                                    <Building2 size={16} />
                                    직위
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="position"
                                        value={baseInfoData.position}
                                        onChange={(e) => handleInputChange('position', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <div className="form-display">
                                        {baseInfoData.position}
                                    </div>
                                )}
                            </div>

                            {/* Company */}
                            <div className="form-group">
                                <label className="form-label">
                                    <Building2 size={16} />
                                    회사
                                </label>
                                <div className="form-display">
                                    {baseInfoData.company}
                                </div>
                            </div>

                            {/* Department */}
                            <div className="form-group">
                                <label className="form-label">
                                    <MapPin size={16} />
                                    부서
                                </label>
                                {isEditing ? (
                                    <div className="department-input-container">
                                        <span className="department-icon">💡</span>
                                        <input
                                            type="text"
                                            name="department"
                                            value={baseInfoData.department}
                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                            className="form-input department-input"
                                            placeholder="부서를 입력하세요"
                                        />
                                    </div>
                                ) : (
                                    <div className="form-display department-display">
                                        <span className="department-icon">💡</span>
                                        {baseInfoData.department}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label className="form-label">
                                    <Mail size={16} />
                                    이메일
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={baseInfoData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <div className="form-display">
                                        {baseInfoData.email}
                                    </div>
                                )}
                            </div>

                            {/* Cell Phone */}
                            <div className="form-group">
                                <label className="form-label">
                                    <Phone size={16} />
                                    Cell.
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={baseInfoData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <div className="form-display">
                                        {baseInfoData.phone}
                                    </div>
                                )}
                            </div>

                            {/* Direct Phone - 빈 칸 추가하여 우측 컬럼에 배치 */}
                            <div className="form-group-empty"></div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Phone size={16} />
                                    Dir.
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="directPhone"
                                        value={baseInfoData.directPhone}
                                        onChange={(e) => handleInputChange('directPhone', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <div className="form-display">
                                        {baseInfoData.directPhone}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="action-buttons">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="cancel-button"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="save-button"
                                >
                                    저장
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaseInfoPage;