"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Building, ArrowLeft, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import styles from '../auth-side.module.css';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { user, register, login, loginWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      const registerSuccess = await register({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
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
              Tələbə endirimlərindən faydalanmaq üçün qoşulun.
            </h1>
            <div className={styles.sliderLines}>
              <div className={styles.line}></div>
              <div className={`${styles.line} ${styles.lineActive}`}></div>
              <div className={styles.line}></div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2>{t.register}</h2>
            <p>
              {t.auth.haveAccount}
              <Link href="/login">{t.auth.loginNow}</Link>
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.gridRow}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Ad"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Soyad"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.inputField}
                placeholder={t.auth.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                className={styles.inputField}
                placeholder="Şifrəniz"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>


            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "..." : t.register}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.line}></div>
            <span className={styles.divText}>Və ya bunlarla davam et</span>
            <div className={styles.line}></div>
          </div>

          <div className={styles.socialFull}>
            <button className={styles.socialBtn} type="button" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24">
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
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
