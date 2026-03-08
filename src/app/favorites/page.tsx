"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { staticDeals, allCompanies } from '@/utils/dealsData';
import { Heart, ArrowUpRight, ChevronRight, Star, Info, Sparkles, Building2, LayoutGrid, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './favorites.module.css';

import LoadingScreen from '@/components/LoadingScreen';

export default function Favorites() {
    const { t } = useLanguage();
    const { user, toggleFavorite, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'venues' | 'menus'>('all');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) return <LoadingScreen />;
    if (!user) return null;

    const favoriteIds = user.favorites || [];
    const companyFavoriteIds = user.companyFavorites || [];

    // Filter saved companies (Venues)
    const savedCompanies = allCompanies.filter((c: any) => companyFavoriteIds.includes(c.id));

    // Filter favorite deals from staticDeals
    const favoriteStaticDeals = staticDeals.filter((deal: any) => favoriteIds.includes(deal.id));

    // Split static deals into Restaurant
    const favRestaurantDeals = favoriteStaticDeals.filter(d => d.type === 'Restaurant');

    // Filter favorite menus from company deals
    const rawFavoriteMenus: any[] = [];
    allCompanies.forEach((company: any) => {
        company.deals.forEach((deal: any) => {
            if (favoriteIds.includes(deal.id)) {
                rawFavoriteMenus.push({ ...deal, companyName: company.name, companyId: company.id });
            }
        });
    });

    const favoriteMenus = Array.from(new Map(rawFavoriteMenus.map(m => [m.id, m])).values());

    const hasAnyFav = savedCompanies.length > 0 || favRestaurantDeals.length > 0 || favoriteMenus.length > 0;

    return (
        <div className={styles.favoritesPage}>
            <div className={styles.blob1} />
            <div className={styles.blob2} />

            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <Sparkles size={14} style={{ marginRight: '8px' }} />
                            {t.favPage.allInOne}
                        </div>
                        <h1>{t.favPage.title}<span>.</span></h1>
                        <p>{t.favPage.subTitle}</p>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                <div className="container">

                    {/* Tabs Navigation */}
                    <div className={styles.tabNav}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <LayoutGrid size={18} />
                            {t.favPage.tabs.all}
                            <span className={styles.tabCount}>{savedCompanies.length + favRestaurantDeals.length + favoriteMenus.length}</span>
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'venues' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('venues')}
                        >
                            <Building2 size={18} />
                            {t.favPage.tabs.venues}
                            <span className={styles.tabCount}>{savedCompanies.length}</span>
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'menus' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('menus')}
                        >
                            <Utensils size={18} />
                            {t.favPage.tabs.menus}
                            <span className={styles.tabCount}>{favRestaurantDeals.length + favoriteMenus.length}</span>
                        </button>
                    </div>

                    {!hasAnyFav ? (
                        <div className={styles.emptyCard}>
                            <span className={styles.emptyIcon}>✨</span>
                            <h3>{t.favPage.noFavs}</h3>
                            <p>{t.favPage.exploring}</p>
                            <Link href="/" className={styles.btnExplore}>
                                {t.favPage.exploreBtn}
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.tabPanel}>
                            {/* Favori Restoranlar Section (Saved Venues) */}
                            {(activeTab === 'all' || activeTab === 'venues') && savedCompanies.length > 0 && (
                                <section className={styles.section}>
                                    <div className={styles.sectionTitle}>
                                        <h2>🏙️ {t.favPage.savedVenues}</h2>
                                        <div className={styles.countLabel}>
                                            <span>{savedCompanies.length} məkan</span>
                                        </div>
                                    </div>
                                    <div className={styles.companyRow}>
                                        {savedCompanies.map((company: any) => (
                                            <div key={company.id} className={styles.companyCard} onClick={() => router.push(`/company/${company.id}`)}>
                                                <div className={styles.companyIcon}>
                                                    {company.image ? (
                                                        <img 
                                                          src={company.image} 
                                                          alt={company.name} 
                                                          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                                        />
                                                    ) : (
                                                        <Building2 size={32} />
                                                    )}
                                                </div>
                                                <div className={styles.companyInfo}>
                                                    <h3>{company.name}</h3>
                                                    <p>{company.tagline}</p>
                                                </div>
                                                <ArrowUpRight className={styles.arrowIcon} size={24} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Favori Menyular Section */}
                            {(activeTab === 'all' || activeTab === 'menus') && (favRestaurantDeals.length > 0 || favoriteMenus.length > 0) && (
                                <section className={styles.section}>
                                    <div className={styles.sectionTitle}>
                                        <h2>🍔 {t.favPage.favoriteMenus}</h2>
                                        <div className={styles.countLabel}>
                                            <span>{favRestaurantDeals.length + favoriteMenus.length} təklif</span>
                                        </div>
                                    </div>

                                    <div className={styles.dealGrid}>
                                        {/* Static Restaurant Deals */}
                                        {favRestaurantDeals.map((deal: any) => (
                                            <div key={deal.id} className={styles.dealCard} onClick={() => router.push(`/company/${deal.id}`)}>
                                                <div className={styles.dealImage}>
                                                    <img src={deal.image} alt={deal.title} />
                                                    <div className={styles.discount}>-{deal.discount}</div>
                                                    <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); toggleFavorite(deal.id); }}>
                                                        <Heart size={20} fill="#ff4d4d" strokeWidth={0} />
                                                    </button>
                                                </div>
                                                <div className={styles.dealBody}>
                                                    <span className={styles.typeTag}>{t.categories.restaurant}</span>
                                                    <h3>{deal.company}</h3>
                                                    <p>{deal.title}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Dynamic Menus from Companies */}
                                        {favoriteMenus.map((menu: any) => (
                                            <div key={menu.id} className={styles.dealCard} onClick={() => router.push(`/company/${menu.companyId}`)}>
                                                <div className={styles.dealImage}>
                                                    <img src={menu.image} alt={menu.title} />
                                                    <div className={styles.discount}>-{menu.discount}</div>
                                                    <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); toggleFavorite(menu.id); }}>
                                                        <Heart size={20} fill="#ff4d4d" strokeWidth={0} />
                                                    </button>
                                                </div>
                                                <div className={styles.dealBody}>
                                                    <span className={styles.typeTag}>Menyu</span>
                                                    <h3>{menu.companyName}</h3>
                                                    <p>{menu.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
