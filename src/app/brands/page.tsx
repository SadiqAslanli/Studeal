"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Search, Building2, Star } from 'lucide-react';
import { useState } from 'react';
import styles from './brands.module.css';

export default function BrandsPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    // Replicating static deals data format to extract unique brands
    const staticDeals = [
        { id: 1, company: 'KFC Azerbaijan', image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=800' },
        { id: 2, company: 'Nike Store', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
        { id: 3, company: 'CELT Colleges', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' },
        { id: 4, company: 'CinemaPlus', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800' },
        { id: 5, company: 'Alma Store', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
        { id: 6, company: 'Pizza Mizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
        { id: 7, company: 'McDonalds', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' },
        { id: 8, company: 'Mado', image: 'https://images.unsplash.com/photo-1484723088339-fe28233e562e?auto=format&fit=crop&q=80&w=800' },
        { id: 9, company: 'Starbucks', image: 'https://images.unsplash.com/photo-1544787210-282aa5ac739d?auto=format&fit=crop&q=80&w=800' },
        { id: 10, company: 'Fryday', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=800' },
        { id: 11, company: 'Vapiano', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800' },
        { id: 12, company: 'Entree', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
        { id: 13, company: 'BBC', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
        { id: 14, company: 'Ali & Nino', image: 'https://images.unsplash.com/photo-1491849593786-b44c3ec82135?auto=format&fit=crop&q=80&w=800' },
        { id: 15, company: 'Bravo', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
    ];

    const uniqueBrands = Array.from(new Set(staticDeals.map(d => d.company))).map(company => {
        return staticDeals.find(d => d.company === company);
    }).filter(d => d?.company.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={styles.brandsPage}>
            <header className={styles.hero}>
                <div className="container">
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={18} /> {t.common.backHome}
                    </Link>
                    <div className={styles.heroContent}>
                        <h1>Partnyor <span>Brendlərimiz</span></h1>
                        <p>StuDeal ailəsinə qoşulan və tələbələrə özəl təkliflər təqdim edən bütün brendlər.</p>

                        <div className={styles.searchBar}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Brend axtar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className={styles.brandsGrid}>
                    {uniqueBrands.map((brand, index) => (
                        <Link
                            href={`/company/${brand?.id}`}
                            key={brand?.id}
                            className={styles.brandCard}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className={styles.brandImage}>
                                <img src={brand?.image} alt={brand?.company} />
                                <div className={styles.overlay}>
                                    <div className={styles.viewBtn}>Profilə bax</div>
                                </div>
                            </div>
                            <div className={styles.brandInfo}>
                                <h3>{brand?.company}</h3>
                                <div className={styles.brandStats}>
                                    <span className={styles.rating}><Star size={14} fill="currentColor" /> 4.8</span>
                                    <span className={styles.badge}><Building2 size={14} /> Partnyor</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {uniqueBrands.length === 0 && (
                    <div className={styles.noResults}>
                        <Building2 size={48} />
                        <p>Axtarışınıza uyğun brend tapılmadı.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
