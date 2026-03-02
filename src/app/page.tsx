"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import {
  Megaphone,
  ArrowRight,
  Star,
  Zap,
  Flame,
  Coffee,
  Ticket,
  Pizza,
  ShoppingBag,
  Clapperboard,
  Utensils
} from 'lucide-react';
import Hero from "@/components/Hero";
import Filters from "@/components/Filters";
import DealList from "@/components/DealList";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "./page.module.css";

export default function Home() {
  const { user } = useAuth();
  const [activeCategoryId, setActiveCategoryId] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("new");

  const ads = [
    {
      brand: 'Pizza Mizza', tag: 'GECƏ TƏKLİFİ',
      discount: '25% ENDİRİM', price: '13.90 AZN', oldPrice: '18.60 AZN',
      icon: <Pizza size={18} />, iconBg: '#fff1f1', iconColor: '#ff4d4d',
      g1: '#ff6b6b', g2: '#ff4d4d',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'KFC', tag: 'TƏLƏBƏ MENYUSU',
      discount: '20% ENDİRİM', price: '5.90 AZN', oldPrice: '7.40 AZN',
      icon: <Flame size={18} />, iconBg: '#fef2f2', iconColor: '#e4002b',
      g1: '#e4002b', g2: '#c40025',
      image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'Starbucks', tag: 'SƏHƏR TƏKLİFİ',
      discount: '15% ENDİRİM', price: '4.50 AZN', oldPrice: '5.30 AZN',
      icon: <Coffee size={18} />, iconBg: '#f0faf4', iconColor: '#00704a',
      g1: '#00704a', g2: '#00582f',
      image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: "McDonald's", tag: 'KOMBO TƏKLİFİ',
      discount: '15% ENDİRİM', price: '6.90 AZN', oldPrice: '8.10 AZN',
      icon: <ShoppingBag size={18} />, iconBg: '#fffbf0', iconColor: '#ffbc0d',
      g1: '#ffbc0d', g2: '#e5a400',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'CinemaPlus', tag: 'HƏFTƏSONU',
      discount: '50% ENDİRİM', price: '3.50 AZN', oldPrice: '7.00 AZN',
      icon: <Clapperboard size={18} />, iconBg: '#f5f0ff', iconColor: '#7c3aed',
      g1: '#7c3aed', g2: '#6d28d9',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'Vapiano', tag: 'PASTA GÜN',
      discount: '10% ENDİRİM', price: '8.90 AZN', oldPrice: '9.90 AZN',
      icon: <Utensils size={18} />, iconBg: '#fff5f0', iconColor: '#df0615',
      g1: '#df0615', g2: '#b80010',
      image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const Sidebar = () => (
    <aside className={styles.sideAd}>
      <p className={styles.adLabel}>
        <Megaphone size={14} className={styles.adLabelIcon} />
        PARTNER ADS
      </p>

      <div className={styles.adsList}>
        {ads.map((ad, i) => (
          <div key={i} className={styles.adCard}>
            <div className={styles.adImageWrapper}>
              <img src={ad.image} alt={ad.brand} />
              <div className={styles.adImgOverlay} />
              <div className={styles.adDiscountRibbon}>{ad.discount}</div>
            </div>
            <div className={styles.adCardBody}>
              <div className={styles.adCardHeader}>
                <div className={styles.adIcon} style={{ background: ad.iconBg, color: ad.iconColor }}>
                  {ad.icon}
                </div>
                <div className={styles.adHeaderInfo}>
                  <p className={styles.adBrand}>{ad.brand}</p>
                  <p className={styles.adSub}>{ad.tag}</p>
                </div>
              </div>
              <div className={styles.adPriceRow}>
                <span className={styles.adPriceVal}>{ad.price}</span>
                <span className={styles.adOldPrice}>{ad.oldPrice}</span>
              </div>
              <button className={styles.adCtaBtn} style={{ background: `linear-gradient(135deg, ${ad.g1}, ${ad.g2})` }}>
                Sifariş et
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      <LoadingScreen />
      <div className={styles.homeLayout}>
        <Sidebar />

        <div className={styles.homeContent}>
          <Hero
            onSearch={(q) => setSearchQuery(q)}
            onCategoryChange={(id) => setActiveCategoryId(id)}
            userName={user ? user.name : "İstifadəçi"}
          />
          <Filters
            onCategoryChange={(id) => setActiveCategoryId(id)}
            onSortChange={(opt) => setSortOption(opt)}
          />
          <DealList
            activeCategoryId={activeCategoryId}
            searchQuery={searchQuery}
            sortOption={sortOption}
          />
        </div>
      </div>
    </>
  );
}
