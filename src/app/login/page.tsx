"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, AlertCircle, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import styles from '../auth.module.css';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  const checkCapsLock = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setIsCapsLock(true);
    } else {
      setIsCapsLock(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (success) {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (loggedUser.isAdmin) {
        router.push('/admin');
      } else if (loggedUser.isCompany) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } else {
      setError(t.auth.error);
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (loggedUser.isAdmin) {
        router.push('/admin');
      } else if (loggedUser.isCompany) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={20} />
      </Link>

      <div className={styles.authCard}>
        <Link href="/" className={styles.authLogo}>
          <ShoppingBag size={32} /> Stu<span>Deal</span>
        </Link>
        <h1>{t.login}</h1>
        <p>
          {t.auth.noAccount} <Link href="/register">{t.auth.registerNow}</Link>
        </p>

        {error && (
          <div className={styles.errorMsg}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isCapsLock && (
          <div className={styles.capsWarn}>
            <AlertCircle size={16} />
            <span>Caps Lock aktivdir</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.auth.email}</label>
            <div className={styles.inputWrapper}>
              <Mail size={20} className={styles.inputIcon} />
              <input
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>{t.auth.password}</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={checkCapsLock}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.btnBlock}>
            {t.login}
          </button>
        </form>

        <div className={styles.divider}>Və ya</div>

        <button className={styles.googleBtn} onClick={handleGoogleLogin}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google ilə daxil ol
        </button>
      </div>
    </div>
  );
}
