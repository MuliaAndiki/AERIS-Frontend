'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Eye, EyeOff, Mail, Phone, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const RegisterSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('USER');
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        .reg-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          background: #0b2626;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .reg-root { grid-template-columns: 1fr; }
          .reg-left { display: none !important; }
        }

        /* ── LEFT ── */
        .reg-left {
          position: relative;
          overflow: hidden;
          background: #071a1a;
        }

        .reg-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 70% at 30% 40%, rgba(4,102,103,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(42,147,136,0.18) 0%, transparent 55%),
            #071a1a;
        }

        .reg-welcome {
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

        .reg-welcome span {
          display: block;
          font-weight: 700;
          font-size: 0.42em;
          letter-spacing: 0.55em;
          color: rgba(89,170,176,0.85);
          margin-bottom: 10px;
          font-family: 'Outfit', sans-serif;
        }

        .reg-tagline {
          position: absolute;
          bottom: calc(15% - 52px);
          left: 50px;
          z-index: 10;
          color: rgba(255,255,255,0.38);
          font-size: 13px;
          letter-spacing: 0.12em;
          font-weight: 300;
        }

        .reg-divider-left {
          position: absolute;
          bottom: calc(15% + 8px);
          left: 50px;
          width: 48px;
          height: 1.5px;
          background: rgba(89,170,176,0.5);
          z-index: 10;
        }

        /* ── RIGHT ── */
        .reg-right {
          background: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 56px;
          position: relative;
          overflow: hidden;
        }

        .reg-right::before {
          content: '';
          position: absolute;
          top: -180px; right: -180px;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(4,102,103,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .reg-right::after {
          content: '';
          position: absolute;
          bottom: -160px; left: -100px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(42,147,136,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .reg-logo {
          position: absolute;
          top: 28px; right: 36px;
        }

        .reg-form-container {
          width: 100%;
          max-width: 400px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(18px)'};
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .reg-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 58px;
          font-weight: 700;
          color: #046667;
          letter-spacing: 0.1em;
          margin: 0 0 4px;
          line-height: 1;
        }

        .reg-subheading {
          font-size: 13px;
          color: #8ea4a5;
          letter-spacing: 0.06em;
          margin-bottom: 30px;
        }

        /* Step indicator */
        .step-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 28px;
        }

        .step-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(4,102,103,0.18);
          transition: all 0.3s ease;
        }

        .step-dot.active {
          width: 22px;
          border-radius: 3px;
          background: #046667;
        }

        /* Two-column grid for fields */
        .fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 24px;
        }

        .field-full { grid-column: 1 / -1; }

        .field-group { margin-bottom: 22px; }

        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #59aab0;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1.5px solid #d6d0c8;
          padding-bottom: 9px;
          transition: border-color 0.2s ease;
        }

        .field-wrap.focused { border-bottom-color: #046667; }

        .field-icon {
          color: #a8b8b9;
          flex-shrink: 0;
          transition: color 0.2s ease;
          width: 14px; height: 14px;
        }

        .field-wrap.focused .field-icon { color: #046667; }

        .field-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #3a4a4b;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          min-width: 0;
        }

        .field-input::placeholder { color: #b5c4c5; }

        .eye-btn {
          background: none; border: none; cursor: pointer;
          color: #a8b8b9; padding: 0; display: flex; align-items: center;
          transition: color 0.2s ease;
        }

        .eye-btn:hover { color: #046667; }
        .eye-btn svg { width: 15px; height: 15px; }

        /* Role selector */
        .role-select-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1.5px solid #d6d0c8;
          padding-bottom: 9px;
          transition: border-color 0.2s ease;
        }

        .role-select-wrap.focused { border-bottom-color: #046667; }

        .role-select {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          appearance: none;
          font-size: 14px;
          font-weight: 600;
          color: #046667;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          letter-spacing: 0.08em;
        }

        .chevron-icon {
          color: #a8b8b9;
          width: 14px; height: 14px;
          flex-shrink: 0;
          pointer-events: none;
          transition: color 0.2s;
        }

        .role-select-wrap.focused .chevron-icon { color: #046667; }

        /* Role pills */
        .role-pills {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .role-pill {
          border: 1.5px solid rgba(4,102,103,0.18);
          background: transparent;
          color: #7a9a9b;
          border-radius: 50px;
          padding: 5px 16px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.22s ease;
        }

        .role-pill.active {
          background: rgba(4,102,103,0.1);
          border-color: #046667;
          color: #046667;
        }

        /* Submit */
        .reg-submit-wrap {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .reg-submit-btn {
          background: #046667; color: #fff;
          border: none; cursor: pointer;
          border-radius: 50px;
          padding: 13px 36px;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          font-family: 'Outfit', sans-serif;
          display: flex; align-items: center; gap: 9px;
          transition: all 0.22s ease;
          box-shadow: 0 10px 28px rgba(4,102,103,0.28);
        }

        .reg-submit-btn:hover {
          background: #035657;
          transform: translateY(-2px);
          box-shadow: 0 16px 38px rgba(4,102,103,0.34);
        }

        .reg-submit-btn:active { transform: translateY(0); }
        .reg-submit-btn svg { width: 14px; height: 14px; transition: transform 0.2s; }
        .reg-submit-btn:hover svg { transform: translateX(3px); }

        /* T&C note */
        .terms-note {
          font-size: 11px;
          color: #a0b0b1;
          line-height: 1.6;
          margin-top: 14px;
        }

        .terms-note a {
          color: #046667;
          font-weight: 600;
          text-decoration: none;
        }

        /* Login strip */
        .login-strip {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(4,102,103,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .login-strip-text { font-size: 13px; color: #90a2a3; }

        .login-link {
          font-size: 12px; font-weight: 700;
          color: #046667; text-decoration: none;
          letter-spacing: 0.1em; text-transform: uppercase;
          display: flex; align-items: center; gap: 5px;
          transition: gap 0.2s, color 0.2s;
        }

        .login-link:hover { gap: 9px; color: #2a9388; }

        .reg-cm {
          position: absolute; bottom: 22px; left: 40px;
          display: flex; align-items: center; gap: 7px; opacity: 0.22;
        }

        .reg-cm-line { width: 22px; height: 1px; background: #046667; }
        .reg-cm-text { font-size: 9px; letter-spacing: 0.2em; color: #046667; text-transform: uppercase; }
      `}</style>

      <section className="reg-root">
        {/* ── LEFT ── */}
        <div className="reg-left" style={{ display: 'flex' }}>
          <div className="reg-left-bg" />

          <svg style={{ position: 'absolute', top: -30, right: -20, width: 280, height: 280, opacity: 0.22, pointerEvents: 'none' }} viewBox="0 0 280 280">
            <ellipse cx="155" cy="120" rx="115" ry="60" fill="#2a9388" transform="rotate(-35 155 120)" />
            <ellipse cx="150" cy="116" rx="105" ry="52" fill="none" stroke="#59aab0" strokeWidth="1" transform="rotate(-35 150 116)" />
            {[80, 108, 136, 164].map((x2, i) => (
              <line key={i} x1="52" y1="152" x2={x2} y2={70 + i * 8} stroke="#59aab0" strokeWidth="0.6" opacity="0.7" />
            ))}
          </svg>

          <svg style={{ position: 'absolute', bottom: -10, right: 0, width: 340, height: 340, opacity: 0.17, pointerEvents: 'none' }} viewBox="0 0 340 340">
            <ellipse cx="175" cy="175" rx="140" ry="72" fill="#046667" transform="rotate(18 175 175)" />
            <ellipse cx="175" cy="175" rx="130" ry="64" fill="none" stroke="#2a9388" strokeWidth="1.2" transform="rotate(18 175 175)" />
            {[78, 106, 134, 162, 190].map((x2, i) => (
              <line key={i} x1="44" y1="195" x2={x2} y2={140 - i * 6} stroke="#59aab0" strokeWidth="0.6" opacity="0.6" />
            ))}
          </svg>

          <svg style={{ position: 'absolute', top: '35%', left: 12, width: 180, height: 180, opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 180 180">
            <ellipse cx="90" cy="90" rx="76" ry="40" fill="#59aab0" transform="rotate(-55 90 90)" />
          </svg>

          <svg style={{ position: 'absolute', top: '14%', right: 44, width: 2, height: '66%', opacity: 0.15, pointerEvents: 'none' }}>
            <line x1="1" y1="0" x2="1" y2="100%" stroke="#59aab0" strokeWidth="1" strokeDasharray="4 8" />
          </svg>

          <div className="reg-welcome">
            <span>AERIS</span>
            Welcome
          </div>
          <div className="reg-divider-left" />
          <p className="reg-tagline">Your environment. Your control.</p>
        </div>

        {/* ── RIGHT ── */}
        <div className="reg-right">
          <div className="reg-logo">
            <Image
              src="/images/logo.png"
              alt="AERIS"
              width={72}
              height={72}
              priority
              style={{ width: 64, height: 64, objectFit: 'contain' }}
            />
          </div>

          <div className="reg-form-container">
            <h1 className="reg-heading">Register</h1>
            <p className="reg-subheading">Create your AERIS account</p>

            {/* Step dots decoration */}
            <div className="step-indicator">
              <div className="step-dot active" />
              <div className="step-dot" />
              <div className="step-dot" />
            </div>

            <form noValidate>
              <div className="fields-grid">

                {/* Full Name */}
                <div className="field-group field-full">
                  <label className="field-label">Full Name</label>
                  <div className={`field-wrap ${focusedField === 'name' ? 'focused' : ''}`}>
                    <User className="field-icon" />
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="field-input"
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="field-group">
                  <label className="field-label">Email</label>
                  <div className={`field-wrap ${focusedField === 'email' ? 'focused' : ''}`}>
                    <Mail className="field-icon" />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      className="field-input"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="field-group">
                  <label className="field-label">Phone</label>
                  <div className={`field-wrap ${focusedField === 'phone' ? 'focused' : ''}`}>
                    <Phone className="field-icon" />
                    <input
                      type="tel"
                      placeholder="+62 81 ···"
                      className="field-input"
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="field-group field-full">
                  <label className="field-label">Password</label>
                  <div className={`field-wrap ${focusedField === 'password' ? 'focused' : ''}`}>
                    <svg className="field-icon" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="7" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <circle cx="8" cy="11" r="1.2" fill="currentColor" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className="field-input"
                      style={{ letterSpacing: showPassword ? '0' : '0.12em' }}
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
                </div>

                {/* Role */}
                <div className="field-group field-full">
                  <label className="field-label">Role</label>
                  <div className="role-pills">
                    {['USER', 'ADMIN'].map(r => (
                      <button
                        key={r}
                        type="button"
                        className={`role-pill ${role === r ? 'active' : ''}`}
                        onClick={() => setRole(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="reg-submit-wrap">
                <button type="submit" className="reg-submit-btn">
                  Create Account <ArrowRight />
                </button>
              </div>

              <p className="terms-note">
                By registering, you agree to AERIS&rsquo;s{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
              </p>
            </form>

            <div className="login-strip">
              <span className="login-strip-text">Already have an account?</span>
              <Link href="/login" className="login-link">
                Sign in <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="reg-cm">
            <div className="reg-cm-line" />
            <span className="reg-cm-text">AERIS &copy; 2025</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterSection;