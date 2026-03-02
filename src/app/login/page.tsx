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
  const { login } = useAuth();
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
      </div>
    </div>
  );
}
