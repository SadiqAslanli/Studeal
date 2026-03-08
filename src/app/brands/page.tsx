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
        { id: 1, title: 'KFC Tələbə Menyu', company: 'KFC Azerbaijan', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7OOVEsL1bzTuB4MJfCc8BCCqSBGoOTQVmVQ&s' },
        { id: 2, title: 'Nike Tələbə Kartı', company: 'Nike Store', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
        { id: 3, title: 'IELTS Hazırlığı', company: 'CELT Colleges', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' },
        { id: 4, title: 'Sinema Bileti', company: 'CinemaPlus', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800' },
        { id: 5, title: 'MacBook Pro', company: 'Alma Store', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
        { id: 6, title: 'Pizza Festivalı', company: 'Pizza Mizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
        { id: 7, title: 'McDonalds Tələbə Kombo', company: 'McDonalds', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' },
        { id: 8, title: 'Mado Səhər Yeməyi', company: 'Mado', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800' },
        { id: 9, title: 'Starbucks Coffee', company: 'Starbucks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800' },
        { id: 10, title: 'Fryday Menyu', company: 'Fryday', image: 'https://imageproxy.wolt.com/mes-image/0207ffda-d544-4106-ae2d-c371ec2070b8/e85043fa-6d4c-4380-8622-35c89b68dd25' },
        { id: 11, title: 'Vapiano Pasta', company: 'Vapiano', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800' },
        { id: 12, title: 'Entree Bakery', company: 'Entree', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
        { id: 13, title: 'Baku Book Center', company: 'BBC', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
        { id: 14, title: 'Ali & Nino', company: 'Ali & Nino', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800' },
        { id: 15, company: 'Bravo', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' },
    ];

    const uniqueBrands = Array.from(new Set(staticDeals.map(d => d.company))).map(company => {
        return staticDeals.find(d => d.company === company);
    }).filter(d => d?.company.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={styles.brandsPage}>
            <header className={styles.hero}>
                <div className="container">
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
