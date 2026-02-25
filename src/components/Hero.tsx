"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onSearch: (query: string) => void;
  onCategoryChange?: (id: number) => void;
  userName?: string;
}

export default function Hero({ onSearch, onCategoryChange, userName }: HeroProps) {
  const { t } = useLanguage();
  const displayUserName = userName || t.user;
  const heroRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trendingTags = [
    { id: 'fast', name: t.tags.fast, catId: 1 },
    { id: 'cafe', name: t.tags.cafe, catId: 1 },
    { id: 'cloth', name: t.tags.cloth, catId: 2 },
    { id: 'book', name: t.tags.book, catId: 3 },
    { id: 'cinema', name: t.tags.cinema, catId: 4 },
  ];

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Parallax Background Layers */}
      <div
        className={styles.parallaxBg}
        style={{ transform: `translateY(${offset * 0.4}px)` }}
      />
      <div
        className={styles.parallaxOrb1}
        style={{ transform: `translate(${offset * 0.15}px, ${offset * 0.25}px)` }}
      />
      <div
        className={styles.parallaxOrb2}
        style={{ transform: `translate(${-offset * 0.1}px, ${offset * 0.3}px)` }}
      />
      <div
        className={styles.parallaxOrb3}
        style={{ transform: `translate(${offset * 0.2}px, ${-offset * 0.15}px)` }}
      />

      {/* Floating decorative cards - parallax at different speeds */}
      <div
        className={`${styles.floatingDeco} ${styles.deco1}`}
        style={{ transform: `translateY(${offset * 0.2}px)` }}
      >
        🎓 <span>{t.parallax.deco1}</span>
      </div>
      <div
        className={`${styles.floatingDeco} ${styles.deco2}`}
        style={{ transform: `translateY(${offset * 0.35}px)` }}
      >
        ⭐ <span>{t.parallax.deco2}</span>
      </div>
      <div
        className={`${styles.floatingDeco} ${styles.deco3}`}
        style={{ transform: `translateY(${offset * 0.15}px)` }}
      >
        🎁 <span>{t.parallax.deco3}</span>
      </div>

      {/* Main content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.heroContent}>
          <div className={styles.welcomeBadge}>
            👋 {t.welcome}
          </div>
          <h1>
            <span className={styles.nameHighlight}>{displayUserName}</span>
            <span style={{ whiteSpace: 'nowrap' }}>! 👋</span>
          </h1>
          <p>{t.discoverDeals}</p>

          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <div className={styles.inputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              <button className="btn-primary" style={{ borderRadius: '50px', padding: '12px 35px' }}>{t.searchBtn}</button>
            </div>

            <div className={styles.trending}>
              <span className={styles.trendingLabel}>{t.trendingLabel}</span>
              <div className={styles.tagList}>
                {trendingTags.map((tag) => (
                  <button
                    key={tag.id}
                    className={styles.trendingTag}
                    onClick={() => {
                      onSearch(tag.name);
                      if (onCategoryChange) onCategoryChange(tag.catId);
                    }}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
