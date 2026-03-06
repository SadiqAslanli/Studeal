"use client";

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { staticDeals, allCompanies } from '@/utils/dealsData';
import { Heart, ArrowUpRight, GraduationCap, Star, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './favorites.module.css';

export default function Favorites() {
    const { t } = useLanguage();
    const { user, toggleFavorite } = useAuth();
    const router = useRouter();

    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.emptyState}>
                    <Heart size={48} color="#cbd5e1" />
                    <h2>{t.favPage.loginHeader}</h2>
                    <p>{t.favPage.loginReq}</p>
                    <Link href="/login" className={styles.btnPrimary}>{t.favPage.loginBtn}</Link>
                </div>
            </div>
        );
    }

    const favoriteIds = user.favorites || [];

    // Filter restaurants (from staticDeals)
    const favoriteRestaurants = staticDeals.filter(deal => favoriteIds.includes(deal.id));

    // Filter menus (from allCompanies.deals AND dynamic deals from all users)
    const favoriteMenus: any[] = [];
    
    // 1. From static companies
    allCompanies.forEach(company => {
        company.deals.forEach(deal => {
            if (favoriteIds.includes(deal.id)) {
                favoriteMenus.push({ ...deal, companyName: company.name, companyId: company.id });
            }
        });
    });

    // 2. From dynamic companies (saved in localStorage users)
    const allUsersFromStorage = JSON.parse(localStorage.getItem('users') || '[]');
    allUsersFromStorage.forEach((u: any) => {
        if (u.isCompany && u.deals) {
            u.deals.forEach((deal: any) => {
                if (favoriteIds.includes(deal.id)) {
                    favoriteMenus.push({ ...deal, companyName: u.name, companyId: u.email });
                }
            });
        }
    });

    // Remove duplicates if any
    const uniqueMenus = Array.from(new Map(favoriteMenus.map(m => [m.id, m])).values());

    return (
        <div className={styles.favoritesPage}>
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div className={styles.titleGroup}>
                            <h1>{t.favPage.title} <span>{t.favPage.titleSpan}</span> {t.favPage.titleEnd}</h1>
                            <p>{t.favPage.subTitle}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className={styles.content}>
                <div className="container">
                    {/* Restaurants Section */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>{t.favPage.restaurants}</h2>
                            <span className={styles.countBadge}>{favoriteRestaurants.length}</span>
                        </div>

                        {favoriteRestaurants.length > 0 ? (
                            <div className={styles.grid}>
                                {favoriteRestaurants.map(deal => (
                                    <div key={deal.id} className={styles.card} onClick={() => router.push(`/company/${deal.id}`)}>
                                        <div className={styles.cardImage}>
                                            <img src={deal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} alt={deal.title} />
                                            <div className={styles.discountBadge}>-{deal.discount}</div>
                                            <button
                                                className={styles.favBtn}
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(deal.id); }}
                                            >
                                                <Heart size={20} fill="#ee5d50" color="#ee5d50" />
                                            </button>
                                        </div>
                                        <div className={styles.cardBody}>
                                            <span className={styles.typeBadge}>{deal.type}</span>
                                            <h3>{deal.company}</h3>
                                            <p>{deal.title}</p>
                                            <div className={styles.cardFooter}>
                                                <div className={styles.studentNotice}>
                                                    <GraduationCap size={14} /> Tələbə kartı
                                                </div>
                                                <div className={styles.btnDetails}>
                                                    {t.common.showMore} <ArrowUpRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptySection}>
                                <p>{t.favPage.noFavs}</p>
                                <button className={styles.btnPrimary} style={{ marginTop: '20px' }} onClick={() => router.push('/brands')}>
                                    Restoranlara bax
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Menus Section */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>{t.favPage.menus}</h2>
                            <span className={styles.countBadge}>{favoriteMenus.length}</span>
                        </div>

                        {uniqueMenus.length > 0 ? (
                            <div className={styles.grid}>
                                {uniqueMenus.map(deal => (
                                    <div key={deal.id} className={styles.menuCard} onClick={() => router.push(`/company/${deal.companyId}`)}>
                                        <div className={styles.menuHeader}>
                                            <span className={styles.menuIcon}>{deal.icon || '🍔'}</span>
                                            <button
                                                className={styles.favBtn}
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(deal.id); }}
                                            >
                                                <Heart size={20} fill="#ee5d50" color="#ee5d50" />
                                            </button>
                                        </div>
                                        <div className={styles.menuBody}>
                                            <span className={styles.companySub}>{deal.companyName}</span>
                                            <h3>{deal.title}</h3>
                                            <p>{deal.desc || deal.description}</p>
                                            <div className={styles.menuPrice}>
                                                <span className={styles.price}>{deal.price} AZN</span>
                                                <span className={styles.discount}>-{deal.discount}%</span>
                                            </div>
                                            <div className={styles.btnViewMenu}>
                                                <Info size={16} /> {t.common.showMore}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptySection}>
                                <p>{t.favPage.noMenuFavs}</p>
                                <button className={styles.btnPrimary} style={{ marginTop: '20px' }} onClick={() => router.push('/brands')}>
                                    Menyulara bax
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
