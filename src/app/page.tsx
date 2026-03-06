"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Utensils,
  PlusCircle
} from 'lucide-react';
import Hero from "@/components/Hero";
import Filters from "@/components/Filters";
import DealList from "@/components/DealList";
import FeaturedSlider from "@/components/FeaturedSlider";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "./page.module.css";
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("new");

  const [adData, setAdData] = useState({ left: '', right: '' });

  const [dynamicAds, setDynamicAds] = useState<any[]>([]);
  
  useEffect(() => {
    const savedAds = JSON.parse(localStorage.getItem('adminAdsList') || '[]');
    setDynamicAds(savedAds);

    // Track daily visits
    const today = new Date().toISOString().split('T')[0];
    const visits = JSON.parse(localStorage.getItem('siteVisits') || '{}');
    const hasVisited = sessionStorage.getItem('visitedToday');

    if (!hasVisited) {
      visits[today] = (visits[today] || 0) + 1;
      localStorage.setItem('siteVisits', JSON.stringify(visits));
      sessionStorage.setItem('visitedToday', 'true');
    }
  }, []);

  const ads = [
    {
      brand: 'Pizza Mizza', tag: 'GECƏ TƏKLİFİ',
      discount: '25% ENDİRİM', price: '13.90 AZN', oldPrice: '18.60 AZN',
      icon: <Pizza size={18} />, iconBg: '#fff1f1', iconColor: '#ff4d4d',
      g1: '#ff6b6b', g2: '#ff4d4d',
      image: adData.left || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'KFC', tag: 'TƏLƏBƏ MENYUSU',
      discount: '20% ENDİRİM', price: '5.90 AZN', oldPrice: '7.40 AZN',
      icon: <Flame size={18} />, iconBg: '#fef2f2', iconColor: '#e4002b',
      g1: '#e4002b', g2: '#c40025',
      image: adData.right || 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'Starbucks', tag: 'SƏHƏR TƏKLİFİ',
      discount: '15% ENDİRİM', price: '4.50 AZN', oldPrice: '5.30 AZN',
      icon: <Coffee size={18} />, iconBg: '#f0faf4', iconColor: '#00704a',
      g1: '#00704a', g2: '#00582f',
      image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=400',
    },
    {
      brand: 'CinemaPlus', tag: 'HƏFTƏSONU',
      discount: '50% ENDİRİM', price: '3.50 AZN', oldPrice: '7.00 AZN',
      icon: <Clapperboard size={18} />, iconBg: '#f5f0ff', iconColor: '#7c3aed',
      g1: '#7c3aed', g2: '#6d28d9',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400',
    },
    {
      isPlaceholder: true,
      brand: 'Sənin Reklamın', tag: 'İNDİ YERLƏŞDİR',
      discount: 'MÜNASİB QİYMƏT', price: 'Bizimlə əlaqə', oldPrice: '',
      icon: <PlusCircle size={18} />, iconBg: '#f0f4ff', iconColor: '#4318ff',
      g1: '#4318ff', g2: '#3311cc',
      image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400',
      link: '/partners/ad-request'
    }
  ];

  const Sidebar = () => (
    <aside className={styles.sideAd}>
      <p className={styles.adLabel}>
        <Megaphone size={14} className={styles.adLabelIcon} />
        PARTNER ADS
      </p>

      <Link href="/partners/ad-request" className={styles.adRequestBtn}>
        {t.footerSection.partnerWithUs}
        <PlusCircle size={14} />
      </Link>

      <div className={styles.adsList}>
        {dynamicAds.map((ad, i) => (
          <div
            key={ad.id || i}
            className={styles.adCard}
            onClick={() => {
              if (ad.companyId) {
                router.push(`/company/${ad.companyId}`);
              } else if (!user) {
                router.push('/login');
              }
            }}
          >
            <div className={styles.adImageWrapper}>
              <img src={ad.image} alt="Partner Ad" />
              <div className={styles.adImgOverlay} />
              <div className={styles.newDiscountBadge}>{ad.discount}</div>
            </div>
          </div>
        ))}

        {dynamicAds.length === 0 && (
          <div className={styles.adCard} style={{ opacity: 0.5, border: '2px dashed #e0e5f2', background: 'none' }}>
            <div className={styles.adCardBody} style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#a3aed0' }}>Hələ reklam yoxdur</p>
            </div>
          </div>
        )}
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
            userName={user ? user.name : t.user}
          />
          <FeaturedSlider />
          <Filters
            onCategoryChange={(id) => setActiveCategoryId(id)}
            onSortChange={(opt) => setSortOption(opt)}
          />
          <div id="deals">
            <DealList
              activeCategoryId={activeCategoryId}
              searchQuery={searchQuery}
              sortOption={sortOption}
            />
          </div>
        </div>
      </div>
    </>
  );
}
