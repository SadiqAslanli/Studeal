"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Star,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Heart
} from 'lucide-react';
import styles from '@/app/page.module.css';

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const LangSelector = () => (
    <div className={styles.langSelector}>
      {['az', 'en'].map((l) => (
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

  const AuthButtons = () => {
    return (
      <div className={styles.authBtns}>
        {user ? (
          <div className={styles.userWrapper}>
            <Link href="/points" className={styles.pointsBadge}>
              <Star size={14} className={styles.pointsIcon} fill="currentColor" />
              <span className={styles.pointsCount}>{user.points || 0}</span>
            </Link>
            <div className={styles.userDropdownTrigger} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div className={styles.userName}>
                {user.image ? (
                  <img src={user.image} alt="Avatar" className={styles.headerAvatar} />
                ) : null}
                {user.name}
                <ChevronDown size={14} className={styles.chevron} />
              </div>
            </div>

            {isUserMenuOpen && (
              <div className={styles.userDropdown}>
                <Link
                  href={user.isCompany ? "/dashboard" : "/profile"}
                  className={styles.dropdownItem}
                  onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}
                >
                  <User size={18} /> {user.isCompany ? t.dashboard.overview : t.profile.personalInfo}
                </Link>
                <button
                  onClick={() => { logout(); setIsUserMenuOpen(false); setIsMenuOpen(false); }}
                  className={`${styles.dropdownItem} ${styles.logoutItem}`}
                >
                  <LogOut size={18} /> {t.dashboard.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="btn-primary"
            style={{ 
              borderRadius: '50px', 
              padding: '10px 25px', 
              color: 'white',
              background: 'var(--primary)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            {t.login}
          </Link>
        )}
      </div>
    );
  };

  const NavLinks = () => (
    <nav className={styles.mainNav}>
      <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <Home size={18} className={styles.navIcon} /> {t.nav.home}
      </Link>
      <Link href="/points" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <Star size={18} className={styles.navIcon} /> {t.nav.points}
      </Link>
      <Link href="/feedback" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <MessageSquare size={18} className={styles.navIcon} /> {t.nav.feedback}
      </Link>
      <Link href="/favorites" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
        <div className={styles.iconWithBadge}>
          <Heart size={18} className={styles.navIcon} />
          {user && (user.favorites?.length || 0) > 0 && (
            <span className={styles.badgeCount}>{user.favorites.length}</span>
          )}
        </div>
        {t.favPage.title}
      </Link>
    </nav>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.logo}>
              <img src="/logo.png" alt="Studeal Logo" className={styles.logoImg} />
            </Link>
            <NavLinks />
          </div>

          <div className={styles.navActions}>
            <LangSelector />
            <AuthButtons />
            <button className={styles.burgerBtn} onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
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
          <X size={24} />
        </button>
        <div className={styles.mobileMenuContent}>
          <NavLinks />
          <LangSelector />
          <AuthButtons />
        </div>
      </div>
    </>
  );
}
