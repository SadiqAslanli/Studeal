"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register, login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isCompany: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
    // Auto login after registration
    const success = login(formData.email, formData.password);
    if (success) {
      if (formData.isCompany) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
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
        <h1>{t.register}</h1>
        <p>{t.auth.haveAccount} <Link href="/login">{t.auth.loginNow}</Link></p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.auth.fullName}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>{formData.isCompany ? '🏢' : '👤'}</span>
              <input
                type="text"
                placeholder={formData.isCompany ? t.auth.companyPlaceholder : t.auth.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>{t.auth.email}</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div
            className={styles.checkboxGroup}
            onClick={() => setFormData({ ...formData, isCompany: !formData.isCompany })}
          >
            <div className={`${styles.customCheckbox} ${formData.isCompany ? styles.checked : ''}`}>
              {formData.isCompany && <div className={styles.dot} />}
            </div>
            <span>{t.auth.companyRegister}</span>
          </div>

          <button type="submit" className={`btn-primary ${styles.btnBlock}`}>{t.register}</button>
        </form>
      </div>
    </div>
  );
}
