import React from 'react';
import '../css/Login.css';

function Login() {
    // 카카오 로그인 시작: Spring Security가 제공하는 OAuth2 엔드포인트로 리다이렉트
    const handleKakaoLogin = () => {
        window.location.href = `/oauth2/authorization/kakao`;
    };



    return (
        <div className="Login_page">
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}></div>
            <div className="Login_container">
                <img className="Login_logoimage" alt="teamlogo" src="/seoul_logo.png" />
                <span className="Login_text">
          myFCseoul
        </span>
            </div>
            <form>
                <div className="Login_input" onClick={handleKakaoLogin} style={{ cursor: 'pointer' }}>
                    <img className="kakao_login_medium_narrow" alt="카카오 로그인" src="/kakao_login_medium_narrow.png" />
                </div>
            </form>
        </div>
    );
}

export default Login;
