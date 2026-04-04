'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

type LoginMethod = 'email' | 'phone';

const LoginSection = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        .login-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          background: #0b2626;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          position: relative;
        }

        @media (max-width: 900px) {
          .login-root { grid-template-columns: 1fr; }
          .login-left { display: none !important; }
        }

        /* ─── LEFT PANEL ─────────────────────────────── */
        .login-left {
          position: relative;
          overflow: hidden;
          background: #082020;
        }

        .login-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 70% at 30% 40%, rgba(4, 102, 103, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(42, 147, 136, 0.18) 0%, transparent 55%),
            #071a1a;
        }

        .leaf-svg {
          position: absolute;
          pointer-events: none;
        }

        .welcome-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 6vw, 88px);
          font-weight: 300;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          line-height: 1;
          position: absolute;
          bottom: 15%;
          left: 48px;
          z-index: 10;
        }

        .welcome-text span {
          display: block;
          font-weight: 700;
          font-size: 0.42em;
          letter-spacing: 0.55em;
          color: rgba(89, 170, 176, 0.85);
          margin-bottom: 10px;
          font-family: 'Outfit', sans-serif;
        }

        .left-tagline {
          position: absolute;
          bottom: calc(15% - 52px);
          left: 50px;
          z-index: 10;
          color: rgba(255,255,255,0.38);
          font-size: 13px;
          letter-spacing: 0.12em;
          font-weight: 300;
        }

        .left-divider {
          position: absolute;
          bottom: calc(15% + 8px);
          left: 50px;
          width: 48px;
          height: 1.5px;
          background: rgba(89, 170, 176, 0.5);
          z-index: 10;
        }

        /* ─── RIGHT PANEL ────────────────────────────── */
        .login-right {
          background: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 56px;
          position: relative;
          overflow: hidden;
        }

        .login-right::before {
          content: '';
          position: absolute;
          top: -180px;
          right: -180px;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(4,102,103,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-right::after {
          content: '';
          position: absolute;
          bottom: -160px;
          left: -100px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(42,147,136,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .logo-wrap {
          position: absolute;
          top: 28px;
          right: 36px;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(18px)'};
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .login-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 62px;
          font-weight: 700;
          color: #046667;
          letter-spacing: 0.1em;
          margin: 0 0 6px;
          line-height: 1;
        }

        .login-subheading {
          font-size: 13px;
          color: #8ea4a5;
          letter-spacing: 0.06em;
          margin-bottom: 36px;
          font-weight: 400;
        }

        /* Toggle */
        .toggle-wrap {
          display: flex;
          background: rgba(4, 102, 103, 0.07);
          border-radius: 50px;
          padding: 4px;
          margin-bottom: 36px;
          width: fit-content;
        }

        .toggle-btn {
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 50px;
          padding: 8px 24px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.07em;
          color: #6b8e8f;
          transition: all 0.25s ease;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .toggle-btn.active {
          background: #046667;
          color: #fff;
          box-shadow: 0 6px 20px rgba(4,102,103,0.3);
        }

        .toggle-btn svg {
          width: 13px;
          height: 13px;
        }

        /* Fields */
        .field-group {
          margin-bottom: 24px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: #59aab0;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .field-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1.5px solid #d6d0c8;
          padding-bottom: 10px;
          transition: border-color 0.2s ease;
        }

        .field-wrap.focused {
          border-bottom-color: #046667;
        }

        .field-icon {
          color: #a8b8b9;
          flex-shrink: 0;
          transition: color 0.2s ease;
          width: 16px;
          height: 16px;
        }

        .field-wrap.focused .field-icon {
          color: #046667;
        }

        .field-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 15px;
          color: #3a4a4b;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
        }

        .field-input::placeholder {
          color: #b0babb;
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #a8b8b9;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .eye-btn:hover { color: #046667; }
        .eye-btn svg { width: 17px; height: 17px; }

        .forgot-link {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #94a7a8;
          text-decoration: none;
          letter-spacing: 0.04em;
          margin-top: 6px;
          transition: color 0.2s ease;
        }
        .forgot-link:hover { color: #046667; }

        /* Submit */
        .submit-wrap {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .submit-btn {
          background: #046667;
          color: #fff;
          border: none;
          cursor: pointer;
          border-radius: 50px;
          padding: 14px 40px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 12px 32px rgba(4,102,103,0.28);
        }

        .submit-btn:hover {
          background: #035657;
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(4,102,103,0.36);
        }

        .submit-btn:active { transform: translateY(0); }

        .submit-btn svg { width: 15px; height: 15px; transition: transform 0.2s; }
        .submit-btn:hover svg { transform: translateX(3px); }

        /* Register */
        .register-strip {
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid rgba(4,102,103,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .register-text {
          font-size: 14px;
          color: #90a2a3;
        }

        .register-link {
          font-size: 13px;
          font-weight: 700;
          color: #046667;
          text-decoration: none;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s ease, color 0.2s ease;
        }

        .register-link:hover { gap: 10px; color: #2a9388; }
        .register-link svg { width: 13px; height: 13px; }

        /* Decorative corner mark */
        .corner-mark {
          position: absolute;
          bottom: 32px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.3;
        }

        .corner-mark-line {
          width: 28px;
          height: 1px;
          background: #046667;
        }

        .corner-mark-text {
          font-size: 10px;
          letter-spacing: 0.22em;
          color: #046667;
          text-transform: uppercase;
        }
      `}</style>

      <section className="login-root">
        {/* ── LEFT ── */}
        <div className="login-left" style={{ display: 'flex' }}>
          <div className="login-left-bg" />

          {/* Decorative leaf shapes via SVG */}
          <svg className="leaf-svg" style={{ top: -40, right: -30, width: 320, height: 320, opacity: 0.22 }} viewBox="0 0 320 320">
            <ellipse cx="180" cy="140" rx="130" ry="70" fill="#2a9388" transform="rotate(-35 180 140)" />
            <ellipse cx="170" cy="135" rx="120" ry="60" fill="none" stroke="#59aab0" strokeWidth="1" transform="rotate(-35 170 135)" />
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="65" y1="175" x2={95 + i*28} y2={80 + i*8} stroke="#59aab0" strokeWidth="0.6" opacity="0.7" />
            ))}
          </svg>

          <svg className="leaf-svg" style={{ bottom: -20, right: 10, width: 380, height: 380, opacity: 0.18 }} viewBox="0 0 380 380">
            <ellipse cx="200" cy="200" rx="150" ry="80" fill="#046667" transform="rotate(20 200 200)" />
            <ellipse cx="200" cy="200" rx="140" ry="70" fill="none" stroke="#2a9388" strokeWidth="1.2" transform="rotate(20 200 200)" />
            {[0,1,2,3,4,5].map(i => (
              <line key={i} x1="66" y1="220" x2={100 + i*28} y2={160 - i*6} stroke="#59aab0" strokeWidth="0.6" opacity="0.6" />
            ))}
          </svg>

          <svg className="leaf-svg" style={{ top: '30%', left: 20, width: 220, height: 220, opacity: 0.12 }} viewBox="0 0 220 220">
            <ellipse cx="110" cy="110" rx="90" ry="48" fill="#59aab0" transform="rotate(-55 110 110)" />
          </svg>

          {/* Vertical botanical line accent */}
          <svg className="leaf-svg" style={{ top: '15%', right: 55, width: 2, height: '65%', opacity: 0.15 }}>
            <line x1="1" y1="0" x2="1" y2="100%" stroke="#59aab0" strokeWidth="1" strokeDasharray="4 8" />
          </svg>

          <div className="welcome-text">
            <span>AERIS</span>
            Welcome
          </div>
          <div className="left-divider" />
          <p className="left-tagline">Your environment. Your control.</p>
        </div>

        {/* ── RIGHT ── */}
        <div className="login-right">
          {/* Logo */}
          <div className="logo-wrap">
            <Image
              src="/images/logo.png"
              alt="AERIS"
              width={72}
              height={72}
              priority
              style={{ width: 64, height: 64, objectFit: 'contain' }}
            />
          </div>

          <div className="form-container">
            <h1 className="login-heading">Login</h1>
            <p className="login-subheading">Sign in to your AERIS account</p>

            {/* Method toggle */}
            <div className="toggle-wrap">
              <button
                type="button"
                className={`toggle-btn ${loginMethod === 'email' ? 'active' : ''}`}
                onClick={() => setLoginMethod('email')}
              >
                <Mail size={13} /> Email
              </button>
              <button
                type="button"
                className={`toggle-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                onClick={() => setLoginMethod('phone')}
              >
                <Phone size={13} /> Phone
              </button>
            </div>

            <form noValidate>
              {/* Email or Phone */}
              <div className="field-group">
                <label className="field-label">
                  {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <div className={`field-wrap ${focusedField === 'identity' ? 'focused' : ''}`}>
                  {loginMethod === 'email'
                    ? <Mail className="field-icon" />
                    : <Phone className="field-icon" />
                  }
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={loginMethod === 'email' ? 'name@email.com' : '+62 81 - 2345 - 6789'}
                    className="field-input"
                    onFocus={() => setFocusedField('identity')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className={`field-wrap ${focusedField === 'password' ? 'focused' : ''}`}>
                  <svg className="field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="7" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="8" cy="11" r="1.2" fill="currentColor"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="field-input"
                    style={{ letterSpacing: showPassword ? '0' : '0.14em' }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <Link href="/forgotPassword" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <div className="submit-wrap">
                <button type="submit" className="submit-btn">
                  Sign In <ArrowRight />
                </button>
              </div>
            </form>

            <div className="register-strip">
              <span className="register-text">Don&apos;t have an account?</span>
              <Link href="/register" className="register-link">
                Register <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="corner-mark">
            <div className="corner-mark-line" />
            <span className="corner-mark-text">AERIS &copy; 2025</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginSection;