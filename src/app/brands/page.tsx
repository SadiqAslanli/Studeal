"use client";

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft, Search, Building2, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './brands.module.css';
import { listCompanies } from '@/app/admin/actions';

export default function BrandsPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const [uniqueBrands, setUniqueBrands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            setIsLoading(true);
            try {
                const companies = await listCompanies();
                const formattedBrands = companies
                    .filter(c => c.is_active !== false)
                    .map(c => ({
                        id: c.metadata?.slug || c.id,
                        company: c.full_name,
                        image: c.image_url || c.metadata?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
                    }));
                setUniqueBrands(formattedBrands);
            } catch (error) {
                console.error("Failed to fetch brands:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const filteredBrands = uniqueBrands.filter(brand => 
        (brand.company || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    {filteredBrands.map((brand, index) => (
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

                {filteredBrands.length === 0 && (
                    <div className={styles.noResults}>
                        <Building2 size={48} />
                        <p>Axtarışınıza uyğun brend tapılmadı.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
