// src/main/frontend/src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // RegisterPage.css 임포트

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // ACCOUNT_TB 필드
        id: '', // 백엔드 Account 엔티티의 userId에 매핑
        password: '',
        email: '',
        // EMPLOYEE_TB 필드
        firstName: '',
        lastName: '',
        birthday: '', // 'YYYY-MM-DD' 형식의 문자열로 관리 (Employee 엔티티에서 string 타입)
        phoneNumber: '',
        zipNo: '', // 우편번호
        address: '', // 기본 주소 (도로명 또는 지번)
        addressDtl: '', // 상세주소
        hireDate: '',
        addressDivCode: 'ROAD', // 주소 분류 코드 (기본값 'ROAD' - 도로명주소)
        abilityLevel: '',
        workCareer: ''
    });

    const [errors, setErrors] = useState({});
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 사용 가능 여부

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

        // 실시간 유효성 검사 (개선된 방식)
        const fieldErrors = { ...errors }; // 기존 에러 복사
        validateField(name, value, fieldErrors); // 해당 필드만 검사
        setErrors(fieldErrors); // 업데이트된 에러 상태로 설정
    };

    const validateField = (name, value, currentErrors) => {
        // currentErrors 객체를 직접 수정하여 사용
        switch (name) {
            case 'id':
                if (!value) {
                    currentErrors.id = '아이디를 입력해주세요.';
                } else if (value.length < 4) {
                    currentErrors.id = '아이디는 4자 이상이어야 합니다.';
                } else {
                    delete currentErrors.id;
                }
                break;
            case 'password':
                if (!value) {
                    currentErrors.password = '비밀번호를 입력해주세요.';
                } else if (value.length < 8) {
                    currentErrors.password = '비밀번호는 8자 이상이어야 합니다.';
                } else {
                    delete currentErrors.password;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    currentErrors.email = '이메일을 입력해주세요.';
                } else if (!emailRegex.test(value)) {
                    currentErrors.email = '올바른 이메일 형식이 아닙니다.';
                } else {
                    delete currentErrors.email;
                }
                break;
            case 'firstName':
            case 'lastName':
                if (!value) {
                    currentErrors[name] = '이름을 입력해주세요.';
                } else {
                    delete currentErrors[name];
                }
                break;
            case 'birthday':
                if (!value) {
                    currentErrors.birthday = '생년월일을 입력해주세요.';
                } else {
                    delete currentErrors.birthday;
                }
                break;
            case 'phoneNumber':
                const phoneRegex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
                if (!value) {
                    currentErrors.phoneNumber = '전화번호를 입력해주세요.';
                } else if (!phoneRegex.test(value)) {
                    currentErrors.phoneNumber = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
                } else {
                    delete currentErrors.phoneNumber;
                }
                break;
            case 'zipNo':
                if (!value) {
                    currentErrors.zipNo = '우편번호를 입력해주세요.';
                } else if (value.length !== 5 || !/^\d{5}$/.test(value)) {
                    currentErrors.zipNo = '유효한 5자리 우편번호를 입력해주세요.';
                } else {
                    delete currentErrors.zipNo;
                }
                break;
            case 'address':
                if (!value) {
                    currentErrors.address = '주소를 검색해주세요.';
                } else {
                    delete currentErrors.address;
                }
                break;
            case 'addressDivCode':
                if (!value) {
                    currentErrors.addressDivCode = '주소 분류를 선택해주세요.';
                } else {
                    delete currentErrors.addressDivCode;
                }
                break;
            case 'abilityLevel':
            case 'workCareer':
                if (!value) {
                    currentErrors[name] = '필수 선택 항목입니다.';
                } else {
                    delete currentErrors[name];
                }
                break;
            default:
                break;
        }
    };


    // 첫 번째: 아이디 중복 체크 함수
    const handleIdCheck = async () => {
        if (!formData.id) {
            setErrors(prev => ({ ...prev, id: '아이디를 입력해주세요.' }));
            return;
        }
        if (formData.id.length < 4) {
            setErrors(prev => ({ ...prev, id: '아이디는 4자 이상이어야 합니다.' }));
            return;
        }

        try {
            // 백엔드 API 엔드포인트에 맞게 수정: /api/account/check-id
            // war로 배포할 때 profile.war로 배포를 했기 때문에 앞에 /profile 경로를 추가

            // fetch : http://192.168.0.25:8080/profile/api/account/check-id?id=${formData.id}`);
            // fetch : http://192.168.227.131:8080/profile/api/account/check-id?id=${formData.id}`);
            // fetch : http://192.168.1.181:8080/profile/api/account/check-id?id=${formData.id}`);
            const response = await fetch(`http://192.168.0.25:8080/profile/api/account/check-id?id=${formData.id}`);

            if (response.ok) {
                const data = await response.json(); // 먼저 선언

                if (data.isDuplicated) {
                    alert('이미 사용 중인 아이디입니다.');
                    setIsIdAvailable(false);
                    setErrors(prev => ({ ...prev, id: '이미 사용 중인 아이디입니다.' }));
                } else {
                    alert('사용 가능한 아이디입니다.');
                    setIsIdAvailable(true);
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.id;
                        return newErrors;
                    });
                }
            } else {
                // 응답 본문이 JSON이 아닐 수도 있으므로 예외 처리
                const text = await response.text(); // 안전하게 텍스트 처리
                alert(`아이디 중복 확인 실패: ${text || '알 수 없는 오류'}`);
                setIsIdAvailable(false);
                setErrors(prev => ({ ...prev, id: text || '아이디 중복 확인 중 오류가 발생했습니다.' }));
            }
        } catch (error) {
            console.error('아이디 중복 확인 중 네트워크 오류 발생:', error);
            alert('아이디 중복 확인 중 네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
            setIsIdAvailable(false);
            setErrors(prev => ({ ...prev, id: '네트워크 오류가 발생했습니다.' }));
        } finally {
            setIsIdChecked(true);
        }
    };

    // --- 여기부터 카카오 주소 검색 API 관련 코드 추가 ---
    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색 결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
                let fullAddress = data.address; // 최종 주소 변수
                let extraAddress = ''; // 조합형 주소 변수 (법정동명, 건물명 등)

                // 법정동명이 있을 경우 추가 (읍면동, 리)
                // 법정동명이 없는 경우(아파트 단지 등)에는 CSD(Common Service Data)를 참조합니다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddress += data.bname;
                }
                // 건물명이 있을 경우 추가
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형 주소 최종 문자열
                if (extraAddress !== '') {
                    fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
                }

                // 주소 정보를 formData에 업데이트
                setFormData(prev => ({
                    ...prev,
                    zipNo: data.zonecode, // 우편번호 (5자리)
                    address: fullAddress, // 기본 주소 (도로명 또는 지번 주소 + 조합형 주소)
                    addressDtl: '', // 상세 주소는 초기화 (사용자가 직접 입력)
                    addressDivCode: data.userSelectedType === 'R' ? 'ROAD' : 'JIBUN' // 사용자가 선택한 주소 타입 (R: 도로명, J: 지번)
                }));

                // 주소 필드에 대한 에러 메시지 제거
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.zipNo;
                    delete newErrors.address;
                    return newErrors;
                });

                // 상세 주소 입력 필드에 포커스 (사용자 편의를 위해)
                const detailInput = document.getElementById('addressDtl');
                if (detailInput) {
                    detailInput.focus();
                }
            }
        }).open(); // 주소 검색 팝업 열기
    };
    // --- 카카오 주소 검색 API 관련 코드 끝 ---


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 모든 필드에 대한 최종 유효성 검사
        const finalErrors = {};
        const allFields = Object.keys(formData);
        allFields.forEach(field => {
            // addressDtl은 필수가 아니므로 validateField에서 제외될 수 있음
            // 하지만 제출 시에는 필수 여부를 다시 확인해야 함
            if (field !== 'addressDtl') { // addressDtl은 필수가 아니므로
                validateField(field, formData[field], finalErrors);
            }
        });

        // addressDtl의 에러 메시지는 항상 제거
        if ('addressDtl' in finalErrors) {
            delete finalErrors.addressDtl;
        }

        // 특정 필수 필드에 대한 재확인
        const requiredFields = [
            'id', 'password', 'email', 'firstName', 'lastName',
            'birthday', 'phoneNumber', 'zipNo', 'address', 'addressDivCode',
            'abilityLevel', 'workCareer'
        ];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                finalErrors[field] = '필수 입력 항목입니다.';
            }
        });


        setErrors(finalErrors); // 최종 에러 상태 업데이트

        if (Object.keys(finalErrors).length > 0) {
            alert('필수 입력 항목 또는 유효하지 않은 정보가 있습니다. 확인해주세요.');
            console.log("유효성 검사 실패:", finalErrors);
            return;
        }

        // 아이디 중복 체크 여부 최종 확인
        if (!isIdChecked || !isIdAvailable) {
            alert('아이디 중복 확인을 완료하고 사용 가능한 아이디인지 확인해주세요.');
            return;
        }

        // 백엔드로 보낼 데이터 준비
        // DTO 필드명에 맞춰서 formData를 가공
        const registerData = {
            id: formData.id, // Account.userId로 매핑
            password: formData.password,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthday: formData.birthday, // 'YYYY-MM-DD' 문자열 그대로 전송 (백엔드에서 String으로 파싱)
            phoneNumber: formData.phoneNumber,
            zipNo: formData.zipNo,
            address: formData.address,
            addressDtl: formData.addressDtl,
            hireDate: formData.hireDate,
            addressDivCode: formData.addressDivCode,
            abilityLevel: formData.abilityLevel,
            workCareer: formData.workCareer
        };

        try {
            // 세 번째: 백엔드 구현 - 회원가입 API 호출
            // war로 배포할 때 profile.war로 배포를 했기 때문에 앞에 /profile 경로를 추가
            // fetch : http://192.168.0.25:8080/profile/api/account/register'
            // fetch : http://192.168.227.131:8080/profile/api/account/register'
            // fetch : http://192.168.1.181:8080/profile/api/account/register'
            const response = await fetch('http://192.168.0.25:8080/profile/api/account/register', { // Spring Boot 서버 포트 8080, 엔드포인트 /api/account/register
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                const message = await response.text();
                alert(message);
                navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
            } else {
                const errorMessage = await response.text(); // 백엔드에서 보낸 에러 메시지를 텍스트로 받음
                console.error('회원가입 실패 응답:', response.status, errorMessage);
                alert(`회원가입 실패: ${errorMessage}`);
            }
        } catch (error) {
            console.error('회원가입 요청 중 네트워크 오류 발생:', error);
            alert('회원가입 중 네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
        }
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
                                className={`${errors.id ? 'error' : ''} ${isIdChecked && isIdAvailable ? 'success' : (isIdChecked && !isIdAvailable ? 'error' : '')}`}
                                disabled={isIdChecked && isIdAvailable}
                            />
                            <button
                                type="button"
                                onClick={handleIdCheck}
                                className="check-button"
                                disabled={isIdChecked && isIdAvailable}
                            >
                                중복확인
                            </button>
                        </div>
                        {errors.id && <span className="error-message">{errors.id}</span>}
                        {isIdChecked && isIdAvailable && (
                            <span className="success-message">사용 가능한 아이디입니다.</span>
                        )}
                        {isIdChecked && !isIdAvailable && !errors.id && ( // 아이디가 유효한데 중복인 경우
                            <span className="error-message">이미 사용 중인 아이디입니다.</span>
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
                            placeholder="비밀번호를 입력하세요 (8자 이상)"
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

                    {/* 우편번호 입력 필드 */}
                    <div className="form-group">
                        <label htmlFor="zipNo">우편번호 *</label>
                        <div className="input-with-button">
                            <input
                                type="text"
                                id="zipNo"
                                name="zipNo"
                                value={formData.zipNo}
                                onChange={handleInputChange} // readOnly여도 onChange는 필요 (다음에 값이 변경될 수 있으므로)
                                placeholder="우편번호"
                                maxLength="5"
                                className={errors.zipNo ? 'error' : ''}
                                readOnly // 주소 검색을 통해서만 입력되도록
                            />
                            <button
                                type="button"
                                onClick={handleAddressSearch}
                                className="search-button"
                            >
                                주소검색
                            </button>
                        </div>
                        {errors.zipNo && <span className="error-message">{errors.zipNo}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">기본 주소 *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange} // readOnly여도 onChange는 필요
                            placeholder="주소를 검색하여 입력됩니다"
                            className={errors.address ? 'error' : ''}
                            readOnly // 주소 검색을 통해서만 입력되도록
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    {/* 상세주소 입력 필드 */}
                    <div className="form-group">
                        <label htmlFor="addressDtl">상세 주소</label>
                        <input
                            type="text"
                            id="addressDtl"
                            name="addressDtl"
                            value={formData.addressDtl}
                            onChange={handleInputChange}
                            placeholder="나머지 주소를 입력하세요 (예: 동/호수)"
                            className={errors.addressDtl ? 'error' : ''}
                        />
                        {errors.addressDtl && <span className="error-message">{errors.addressDtl}</span>}
                    </div>

                    {/* 주소 분류 코드 라디오 버튼 그룹 */}
                    <div className="form-group">
                        <label>주소 분류 *</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="addressDivCode"
                                    value="ROAD"
                                    checked={formData.addressDivCode === 'ROAD'}
                                    onChange={handleInputChange}
                                /> 도로명 주소
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="addressDivCode"
                                    value="JIBUN"
                                    checked={formData.addressDivCode === 'JIBUN'}
                                    onChange={handleInputChange}
                                /> 지번 주소
                            </label>
                        </div>
                        {errors.addressDivCode && <span className="error-message">{errors.addressDivCode}</span>}
                    </div>

                    {/* 입사일 */}
                    <div className="form-group">
                        <label htmlFor="hireDate">입사일 *</label>
                        <input
                            type="date"
                            id="hireDate"
                            name="hireDate"
                            value={formData.hireDate}  // ✅ 수정 포인트
                            onChange={handleInputChange}
                            className={errors.hireDate ? 'error' : ''}
                        />
                        {errors.hiredate && <span className="error-message">{errors.hiredate}</span>}
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
                    <button type="button" className="cancel-button" onClick={() => navigate('/login')}>
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