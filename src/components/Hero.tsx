"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import styles from './Hero.module.css';

interface HeroProps {
  onSearch: (query: string) => void;
  onCategoryChange?: (id: number) => void;
  userName?: string;
}

export default function Hero({ onSearch, onCategoryChange, userName }: HeroProps) {
  const { t } = useLanguage();
  const displayUserName = userName || t.user;

  const trendingTags = [
    { id: 'fast', name: t.tags.fast, catId: 1 },
    { id: 'cafe', name: t.tags.cafe, catId: 1 },
    { id: 'cloth', name: t.tags.cloth, catId: 2 },
    { id: 'book', name: t.tags.book, catId: 3 },
    { id: 'cinema', name: t.tags.cinema, catId: 4 },
  ];

  return (
    <section className={styles.hero}>
      {/* Background with abstract graphic */}
      <div className={styles.heroBackground}>
        <img
          src="/background.png"
          alt="Hero Decoration"
        />
      </div>

      {/* Glowing orbs for depth */}
      <div className={styles.parallaxOrb1} />
      <div className={styles.parallaxOrb2} />

      <div className={styles.heroContent}>
        <div className={styles.welcomeBadge}>
          👋 {t.welcome}
        </div>
        <h1>
          Salam, <span className={styles.nameHighlight}>{displayUserName}!</span>
        </h1>
        <p>{t.discoverDeals}</p>

        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className={styles.searchBtn}>{t.searchBtn}</button>
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
    </section>
  );
}
