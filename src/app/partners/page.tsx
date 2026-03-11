"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './partners.module.css';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { listCompanies } from '../admin/actions';

export default function PartnersPage() {
    const { t } = useLanguage();
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            const data = await listCompanies();
            const formatted = data
                .filter(p => p.is_active !== false)
                .map(p => ({
                    id: p.id,
                    name: p.full_name || 'Sahibkar',
                    categoryId: p.category_id,
                    image: (p as any).metadata?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
                    logo: '🏢'
                }));
            setPartners(formatted);
            setLoading(false);
        };
        fetchPartners();
    }, []);

    const getCategoryName = (id: number | null | undefined) => {
        switch(id) {
            case 1: return t.categories.restaurant;
            case 2: return t.categories.shop;
            case 3: return t.categories.education;
            case 4: return t.categories.entertainment;
            case 5: return t.categories.tech;
            default: return t.categories.all;
        }
    };

    return (
        <div className={styles.partnersContainer}>
            <header className={styles.header}>
                <h1>{t.partnersPage.title}</h1>
                <p>{t.partnersPage.subtitle}</p>
            </header>

            <div className={styles.partnersGrid}>
                {loading ? (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#a3aed0' }}>
                        {t.common.loading}
                    </div>
                ) : partners.length === 0 ? (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#a3aed0' }}>
                        Hələ heç bir sahibkar əlavə olunmayıb.
                    </div>
                ) : partners.map((partner, index) => (
                    <Link key={index} href={`/company/${partner.id}`} className={styles.partnerCard}>
                        <div className={styles.cardImage}>
                            <img src={partner.image} alt={partner.name} />
                            <div className={styles.logoBadge}>
                                {partner.logo}
                            </div>
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>{partner.name}</h3>
                            <span className={styles.categoryBadge}>{getCategoryName(partner.categoryId)}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <section className={styles.becomePartner}>
                <div className={styles.ctaContent}>
                    <h2>{t.partnersPage.becomePartner}</h2>
                    <p>{t.footerSection.desc}</p>
                    <Link href="/feedback" className="btn-primary">
                        {t.partnersPage.contactUs}
                    </Link>
                </div>
            </section>
        </div>
    );
}
