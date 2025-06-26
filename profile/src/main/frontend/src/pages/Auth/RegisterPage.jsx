import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        // ACCOUNT_TB 필드
        id: '',
        password: '',
        email: '',
        // EMPLOYEE_TB 필드
        firstName: '',
        lastName: '',
        birthday: '',
        phoneNumber: '',
        address: '',
        abilityLevel: '',
        workCareer: ''
    });

    const [errors, setErrors] = useState({});
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 아이디가 변경되면 중복체크 상태 초기화
        if (name === 'id') {
            setIsIdChecked(false);
            setIsIdAvailable(false);
        }

        // 실시간 유효성 검사
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'id':
                if (!value) {
                    newErrors.id = '아이디를 입력해주세요.';
                } else if (value.length < 4) {
                    newErrors.id = '아이디는 4자 이상이어야 합니다.';
                } else {
                    delete newErrors.id;
                }
                break;
            case 'password':
                if (!value) {
                    newErrors.password = '비밀번호를 입력해주세요.';
                } else if (value.length < 6) {
                    newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
                } else {
                    delete newErrors.password;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.email = '이메일을 입력해주세요.';
                } else if (!emailRegex.test(value)) {
                    newErrors.email = '올바른 이메일 형식이 아닙니다.';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'firstName':
            case 'lastName':
                if (!value) {
                    newErrors[name] = '이름을 입력해주세요.';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'phoneNumber':
                const phoneRegex = /^[0-9-]+$/;
                if (!value) {
                    newErrors.phoneNumber = '전화번호를 입력해주세요.';
                } else if (!phoneRegex.test(value)) {
                    newErrors.phoneNumber = '올바른 전화번호 형식이 아닙니다.';
                } else {
                    delete newErrors.phoneNumber;
                }
                break;
            default:
                if (!value) {
                    newErrors[name] = '필수 입력 항목입니다.';
                } else {
                    delete newErrors[name];
                }
        }

        setErrors(newErrors);
    };

    const handleIdCheck = async () => {
        if (!formData.id) {
            alert('아이디를 입력해주세요.');
            return;
        }

        if (formData.id.length < 4) {
            alert('아이디는 4자 이상이어야 합니다.');
            return;
        }

        // 실제 구현에서는 서버 API 호출
        try {
            // 임시로 랜덤하게 중복/사용가능 결과 반환
            const isAvailable = Math.random() > 0.5;

            setIsIdChecked(true);
            setIsIdAvailable(isAvailable);

            if (isAvailable) {
                alert('사용 가능한 아이디입니다.');
            } else {
                alert('이미 사용 중인 아이디입니다.');
            }
        } catch (error) {
            alert('아이디 중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleAddressSearch = () => {
        // 실제 구현에서는 다음 우편번호 API 등을 사용
        alert('주소 검색 기능이 실행됩니다.');
        // 예시: 임시 주소 설정
        setFormData(prev => ({
            ...prev,
            address: '서울특별시 강남구 테헤란로 123'
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 아이디 중복체크 확인
        if (!isIdChecked || !isIdAvailable) {
            alert('아이디 중복체크를 완료해주세요.');
            return;
        }

        // 모든 필드 유효성 검사
        const requiredFields = [
            'id', 'password', 'email', 'firstName', 'lastName',
            'birthday', 'phoneNumber', 'address', 'abilityLevel', 'workCareer'
        ];

        let hasError = false;
        requiredFields.forEach(field => {
            if (!formData[field]) {
                validateField(field, formData[field]);
                hasError = true;
            }
        });

        if (hasError || Object.keys(errors).length > 0) {
            alert('입력 정보를 확인해주세요.');
            return;
        }

        // 회원가입 처리
        console.log('회원가입 데이터:', formData);
        alert('회원가입이 완료되었습니다.');
    };

    return (
        <div className="register-container">
            <div className="register-header">
                <h1>회원가입</h1>
                <p>알앤비소프트에 오신 것을 환영합니다</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-section">
                    <h2>계정 정보</h2>

                    <div className="form-group">
                        <label htmlFor="id">아이디 * </label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                id="id"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                placeholder="아이디를 입력하세요"
                                className={errors.id ? 'error' : isIdAvailable ? 'success' : ''}
                            />
                            <button
                                type="button"
                                onClick={handleIdCheck}
                                className="check-button"
                            >
                                중복확인
                            </button>
                        </div>
                        {errors.id && <span className="error-message">{errors.id}</span>}
                        {isIdChecked && isIdAvailable && (
                            <span className="success-message">사용 가능한 아이디입니다.</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호 *</label>
                        <input
                             type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 입력하세요"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">이메일 *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="이메일을 입력하세요"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                </div>

                <div className="form-section">
                    <h2>개인 정보</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">성 *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="성을 입력하세요"
                                className={errors.firstName ? 'error' : ''}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">이름 *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="이름을 입력하세요"
                                className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthday">생년월일 *</label>
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            className={errors.birthday ? 'error' : ''}
                        />
                        {errors.birthday && <span className="error-message">{errors.birthday}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">전화번호 *</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="010-1234-5678"
                            className={errors.phoneNumber ? 'error' : ''}
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">주소 *</label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="주소를 검색해주세요"
                                className={errors.address ? 'error' : ''}
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={handleAddressSearch}
                                className="search-button"
                            >
                                주소검색
                            </button>
                        </div>
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="abilityLevel">능력 수준 *</label>
                        <select
                            id="abilityLevel"
                            name="abilityLevel"
                            value={formData.abilityLevel}
                            onChange={handleInputChange}
                            className={errors.abilityLevel ? 'error' : ''}
                        >
                            <option value="">선택해주세요</option>
                            <option value="초급">초급</option>
                            <option value="중급">중급</option>
                            <option value="고급">고급</option>
                            <option value="특급">특급</option>
                        </select>
                        {errors.abilityLevel && <span className="error-message">{errors.abilityLevel}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="workCareer">경력 *</label>
                        <select
                            id="workCareer"
                            name="workCareer"
                            value={formData.workCareer}
                            onChange={handleInputChange}
                            className={errors.workCareer ? 'error' : ''}
                        >
                            <option value="">선택해주세요</option>
                            <option value="신입">신입</option>
                            <option value="1년 이하">1년 이하</option>
                            <option value="1-3년">1-3년</option>
                            <option value="3-5년">3-5년</option>
                            <option value="5-10년">5-10년</option>
                            <option value="10년 이상">10년 이상</option>
                        </select>
                        {errors.workCareer && <span className="error-message">{errors.workCareer}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button">
                        취소
                    </button>
                    <button type="submit" className="submit-button">
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;