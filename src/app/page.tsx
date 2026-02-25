"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import Filters from "@/components/Filters";
import DealList from "@/components/DealList";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "./page.module.css";

export default function Home() {
  const { user } = useAuth();
  const [activeCategoryId, setActiveCategoryId] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <LoadingScreen />
      <div className={styles.homeLayout}>
        {/* Left Ad */}
        <div className={`${styles.sideAd} ${styles.adLeft}`}>
          <div className={styles.adBanner}>
            <div className={styles.adDecor}>
              <span></span><span></span><span></span>
            </div>
            <div className={styles.adTop}>
              <span className={styles.adBrand}>Pizza Mizza</span>
              <h2 className={styles.adTitle}>GECƏ TƏKLİFİ!</h2>
            </div>
            <div className={styles.adPrice}>
              <span className={styles.priceVal}>13.90</span>
              <span className={styles.priceSymbol}>AZN</span>
              <div className={styles.oldPrice}>18.60</div>
            </div>
            <div className={styles.adItems}>🍕 + 🍟 + 🥤</div>
            <button className={styles.adBtn}>Sifariş et</button>
          </div>
        </div>

        <div className={styles.homeContent}>
          <Hero
            onSearch={(q) => setSearchQuery(q)}
            onCategoryChange={(id) => setActiveCategoryId(id)}
            userName={user ? user.name : "İstifadəçi"}
          />
          <Filters onCategoryChange={(id) => setActiveCategoryId(id)} />
          <DealList activeCategoryId={activeCategoryId} searchQuery={searchQuery} />
        </div>

        {/* Right Ad */}
        <div className={`${styles.sideAd} ${styles.adRight}`}>
          <div className={styles.adBannerKfc}>
            <div className={styles.adDecorKfc}>
              <span></span><span></span><span></span>
            </div>
            <div className={styles.adTop}>
              <span className={styles.adBrand}>KFC</span>
              <h2 className={styles.adTitle}>TƏLƏBƏ MENYUSU</h2>
            </div>
            <div className={styles.adPrice}>
              <span className={styles.priceVal}>5.90</span>
              <span className={styles.priceSymbol}>AZN</span>
            </div>
            <div className={styles.adItems}>🍔 + 🍟 + 🥤</div>
            <button className={styles.adBtnKfc}>Eksklüziv</button>
          </div>
        </div>
      </div>
    </>
  );
}
