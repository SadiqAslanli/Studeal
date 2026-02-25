"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (success) {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      if (loggedUser.isCompany) {
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
        <span>←</span>
      </Link>

      <div className={styles.authCard}>
        <Link href="/" className={styles.authLogo}>
          Stu<span>Deal</span>
        </Link>
        <h1>{t.login}</h1>
        <p>{t.auth.noAccount} <Link href="/register">{t.auth.registerNow}</Link></p>

        {error && <p style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.auth.email}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
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
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className={`btn-primary ${styles.btnBlock}`}>{t.login}</button>
        </form>
      </div>
    </div>
  );
}
