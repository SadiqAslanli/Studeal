"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const LangSelector = () => (
    <div className={styles.langSelector}>
      {['az', 'ru', 'en'].map((l) => (
        <button
          key={l}
          className={`${styles.langBtn} ${lang === l ? styles.activeLang : ''}`}
          onClick={() => setLang(l as any)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const AuthButtons = () => (
    <div className={styles.authBtns}>
      {user ? (
        <div className={styles.userWrapper}>
          <Link href="/points" className={styles.pointsBadge}>
            <span className={styles.pointsIcon}>⭐️</span>
            <span className={styles.pointsCount}>{user.points || 0}</span>
          </Link>
          <div className={styles.userDropdownTrigger} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <div className={styles.userName}>
              {user.name}
              <span className={styles.chevron}>▾</span>
            </div>
          </div>

          {isUserMenuOpen && (
            <div className={styles.userDropdown}>
              <Link
                href={user.isCompany ? "/dashboard" : "/profile"}
                className={styles.dropdownItem}
                onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}
              >
                👤 {user.isCompany ? t.dashboard.overview : t.nav.home}
              </Link>
              <button
                onClick={() => { logout(); setIsUserMenuOpen(false); setIsMenuOpen(false); }}
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
              >
                🚪 {t.dashboard.logout}
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="btn-primary"
          style={{ borderRadius: '50px', padding: '10px 25px' }}
          onClick={() => setIsMenuOpen(false)}
        >
          {t.login}
        </Link>
      )}
    </div>
  );

  const NavLinks = () => (
    <nav className={styles.mainNav}>
      <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <span className={styles.navIcon}>🏠</span> {t.nav.home}
      </Link>
      <Link href="/points" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <span className={styles.navIcon}>⭐️</span> {t.nav.points}
      </Link>
      <Link href="/feedback" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <span className={styles.navIcon}>💬</span> {t.nav.feedback}
      </Link>
    </nav>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.logo}>
              Stu<span>Deal</span>
            </Link>
            <NavLinks />
          </div>

          <div className={styles.navActions}>
            <LangSelector />
            <AuthButtons />
            <button className={styles.burgerBtn} onClick={() => setIsMenuOpen(true)}>
              <div className={styles.burgerIcon}>
                <span />
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`${styles.menuOverlay} ${isMenuOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <NavLinks />
          <LangSelector />
          <AuthButtons />
        </div>
      </div>
    </>
  );
}
