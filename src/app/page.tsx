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
  PlusCircle,
  Heart
} from 'lucide-react';
import Hero from "@/components/Hero";
import Filters from "@/components/Filters";
import DealList from "@/components/DealList";
import FeaturedSlider from "@/components/FeaturedSlider";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "./page.module.css";
import { useLanguage } from '@/context/LanguageContext';
import { getSidebarAds } from './admin/contentActions';

export default function Home() {
  const { t } = useLanguage();
  const { user, toggleFavorite, addNotification } = useAuth();
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("new");

  const [dynamicAds, setDynamicAds] = useState<any[]>([]);

  useEffect(() => {
    const loadAds = async () => {
        const ads = await getSidebarAds();
        setDynamicAds(ads);
    };
    loadAds();

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

  const Sidebar = () => (
    <aside className={styles.sideAd}>
      <p className={styles.adLabel}>
        <Megaphone size={14} className={styles.adLabelIcon} />
        {t.partnersPage.partnerAds}
      </p>

      <Link href="/partners/ad-request" className={styles.adRequestBtn}>
        {t.footerSection.partnerWithUs}
        <PlusCircle size={14} />
      </Link>

      <div className={styles.adsList}>
        {dynamicAds.map((ad, i) => {
          const isFavorite = user?.favorites?.includes(ad.id);
          
          const handleFavorite = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!user) {
              router.push('/login');
              return;
            }
            toggleFavorite(ad.id);
            if (!isFavorite) {
              addNotification({
                title: t.fav.added,
                message: `${ad.brand || 'Endirim'} ${t.fav.addedMsg}`
              });
            }
          };

          return (
            <div
              key={ad.id || i}
              className={styles.adCard}
              onClick={() => {
                if (ad.company_id) {
                  router.push(`/company/${ad.company_id}`);
                } else if (!user) {
                  router.push('/login');
                }
              }}
            >
              <div className={styles.adImageWrapper}>
                {ad.image_url?.toLowerCase().includes('/video/') || ad.image_url?.endsWith('.mp4') ? (
                  <video src={ad.image_url} className={styles.adImgVideo} autoPlay muted loop playsInline />
                ) : (
                  <img src={ad.image_url} alt="Partner Ad" />
                )}
                <div className={styles.adImgOverlay} />
                <div className={styles.newDiscountBadge}>{ad.discount}</div>
                <button 
                  className={`${styles.favoriteBtn} ${isFavorite ? styles.isFavorite : ''}`}
                  onClick={handleFavorite}
                >
                  <Heart 
                    size={18} 
                    fill={isFavorite ? "white" : "none"} 
                    strokeWidth={isFavorite ? 0 : 2.5}
                  />
                </button>
              </div>
            </div>
          );
        })}

        {dynamicAds.length === 0 && (
          <div className={styles.adCard} style={{ opacity: 0.5, border: '2px dashed #e0e5f2', background: 'none' }}>
            <div className={styles.adCardBody} style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#a3aed0' }}>{t.partnersPage.noAdsYet}</p>
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
            onCategoryChange={(id) => setActiveCategoryId(id)}
            userName={user ? user.name : t.user}
          />
          <FeaturedSlider />
          <Filters
            onCategoryChange={(id) => setActiveCategoryId(id)}
            onSortChange={(opt) => setSortOption(opt)}
            onSearch={(q) => setSearchQuery(q)}
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
