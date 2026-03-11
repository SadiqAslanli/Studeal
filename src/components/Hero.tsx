"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import styles from './Hero.module.css';

interface HeroProps {
  onCategoryChange?: (id: number) => void;
  userName?: string;
}

export default function Hero({ onCategoryChange, userName }: HeroProps) {
  const { t } = useLanguage();
  const displayUserName = userName || t.user;

  const trendingTags = ['KFC', 'CinemaPlus', 'Nike', 'Pizza Mizza'];

  return (
    <section className={styles.hero}>
      {/* Mesh Gradient Background layers */}
      <div className={styles.heroBackground} />
      <div className={styles.parallaxOrb1} />
      <div className={styles.parallaxOrb2} />

      <div className={styles.heroContent}>
        <div className={styles.welcomeBadge}>
          <Sparkles size={14} className={styles.sparkleIcon} />
          {t.welcome}
        </div>
        <h1>
          {t.heroTitlePrefix}<span className={styles.nameHighlight}>StuDeal</span>{t.heroTitleSuffix}
        </h1>
        <p>
          {t.heroDesc}
        </p>
      </div>
    </section>
  );
}
