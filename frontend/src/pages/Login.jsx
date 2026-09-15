import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FaPhoneAlt, FaLock, FaUserShield, FaArrowLeft } from "react-icons/fa";

function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [localError, setLocalError] = useState("");

    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLocalError("");

        try {
            const data = await login(phone.trim(), password, rememberMe);
            if (data) {
                showToast("வெற்றிகரமாக உள்நுழைந்தீர்கள்!", "success");
                const destination = location.state?.from?.pathname || "/books";
                navigate(destination, { replace: true });
            } else {
                setLocalError("தவறான தொடர்பு எண் அல்லது கடவுச்சொல்.");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.";
            setLocalError(msg);
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className='login-page-modern min-vh-100 d-flex align-items-center justify-content-center p-3'>
            <div className='card-glass-modern p-4 p-md-5 rounded-4 shadow-lg max-w-md w-100'>
                {/* Back Link */}
                <div className="mb-4">
                    <Link to="/books" className="text-secondary small text-decoration-none d-inline-flex align-items-center gap-1">
                        <FaArrowLeft size={11} />
                        <span>நூல் பட்டியலுக்கு திரும்பு</span>
                    </Link>
                </div>

                {/* Header */}
                <div className='text-center mb-4'>
                    <div className="login-icon-circle mx-auto mb-3">
                        <FaUserShield size={28} className="text-warning" />
                    </div>
                    <h2 className='fw-bold text-white mb-1'>
                        நிர்வாக உள்நுழைவு
                    </h2>
                    <p className='text-secondary small'>
                        நூல் விபரங்களை நிர்வகிக்க மற்றும் திருத்த உள்நுழையவும்.
                    </p>
                </div>

                {/* Redirect Notice */}
                {redirectMessage && (
                    <div className='alert alert-warning small rounded-3 mb-3'>
                        {redirectMessage}
                    </div>
                )}

                {/* Error */}
                {localError && (
                    <div className='alert alert-danger small rounded-3 mb-3'>
                        {localError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Phone */}
                    <div className='mb-3'>
                        <label className='form-label-modern' htmlFor='phone'>
                            <FaPhoneAlt size={12} className="me-1 text-warning" />
                            தொடர்பு எண் (Phone Number)
                        </label>
                        <input
                            type='tel'
                            className='form-control-modern'
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder='எ.கா. 9597964813'
                            id="phone"
                            autoComplete="tel"
                        />
                    </div>

                    {/* Password */}
                    <div className='mb-3'>
                        <label className='form-label-modern' htmlFor="password">
                            <FaLock size={12} className="me-1 text-warning" />
                            கடவுச்சொல் (Password)
                        </label>
                        <input
                            className='form-control-modern'
                            placeholder='கடவுச்சொல்லை உள்ளிடவும்'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            id="password"
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Remember Me */}
                    <div className='form-check mb-4'>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            id='remember'
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className='form-check-label text-secondary small ms-1' htmlFor="remember">
                            என்னை நினைவில் கொள்க (Remember Me)
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='btn btn-warning w-100 py-2 rounded-pill fw-bold shadow'
                        disabled={loginLoading}
                    >
                        {loginLoading ? (
                            <span className="d-flex align-items-center justify-content-center gap-2">
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                <span>உள்நுழைகிறது...</span>
                            </span>
                        ) : (
                            "உள்நுழையவும் (Login)"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
