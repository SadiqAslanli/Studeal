"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Building, ArrowLeft, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { user, register, login, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isCompany: false
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirection logic when user is authenticated
  useEffect(() => {
    if (!isLoading && user) {
      if (user.isCompany) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const registerSuccess = await register(formData);
      if (registerSuccess) {
        // Auto login after registration
        const loginSuccess = await login(formData.email, formData.password);
        if (!loginSuccess) {
          setError(t.auth.error);
        }
      } else {
        setError("Registration failed. Please check your details.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
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
        <h1>{t.register}</h1>
        <p>
          {t.auth.haveAccount} <Link href="/login">{t.auth.loginNow}</Link>
        </p>

        {error && (
          <div className={styles.errorMsg}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t.auth.fullName}</label>
            <div className={styles.inputWrapper}>
              {formData.isCompany ? (
                <Building size={20} className={styles.inputIcon} />
              ) : (
                <User size={20} className={styles.inputIcon} />
              )}
              <input
                type="text"
                placeholder={
                  formData.isCompany ? t.auth.companyPlaceholder : t.auth.namePlaceholder
                }
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>{t.auth.email}</label>
            <div className={styles.inputWrapper}>
              <Mail size={20} className={styles.inputIcon} />
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
              <Lock size={20} className={styles.inputIcon} />
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
            <div
              className={`${styles.customCheckbox} ${formData.isCompany ? styles.checked : ''
                }`}
            >
              {formData.isCompany && <Check size={14} color="white" />}
            </div>
            <span>{t.auth.companyRegister}</span>
          </div>

          <button type="submit" className={styles.btnBlock} disabled={submitting}>
            {submitting ? "..." : t.register}
          </button>
        </form>
      </div>
    </div>
  );
}
