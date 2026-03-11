"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, AlertCircle, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import styles from '../auth-side.module.css';

export default function LoginPage() {
  const { t } = useLanguage();
  const { user, login, loginWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirection logic when user is authenticated
  useEffect(() => {
    if (!isLoading && user) {
      if (user.isAdmin) {
        router.push('/admin');
      } else if (user.isCompany) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const checkCapsLock = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setIsCapsLock(true);
    } else {
      setIsCapsLock(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const success = await login(email.trim().toLowerCase(), password);
      // AuthContext will handle the session and update the 'user' state,
      // which triggers the useEffect redirection logic below.
      if (!success) {
        setError(t.auth.error);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg === 'user_not_found') {
        setError(t.auth.userNotFound);
      } else if (msg === 'Email not confirmed' || msg.toLowerCase().includes('email not confirmed')) {
        setError(t.auth.emailNotConfirmed);
      } else {
        setError(msg || t.auth.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.mainCard}>
        {/* Left Section - Image */}
        <div className={styles.imageSection}>
          <div className={styles.sideHeader}>
            <Link href="/" className={styles.logo}>
              Stu<span>Deal</span>
            </Link>
            <Link href="/" className={styles.backLink}>
              Ana səhifə <ArrowLeft size={16} />
            </Link>
          </div>
          <div className={styles.imageFooter}>
            <h1 className={styles.footerTitle}>
              Endirimləri kəşf edin, büdcənizə qənaət edin.
            </h1>
            <div className={styles.sliderLines}>
              <div className={`${styles.line} ${styles.lineActive}`}></div>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2>{t.login}</h2>
            <p>
              {t.auth.noAccount}
              <Link href="/register">{t.auth.registerNow}</Link>
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}


          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.inputField}
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.inputField}
                  placeholder="Şifrənizi daxil edin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                  required
                />
                {isCapsLock && (
                  <div className={styles.capsWarn}>
                    Caps Lock
                  </div>
                )}
                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "..." : t.login}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.line}></div>
            <span className={styles.divText}>Və ya bunlarla davam et</span>
            <div className={styles.line}></div>
          </div>

          <div className={styles.socialFull}>
            <button className={styles.socialBtn} onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google ilə daxil ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
