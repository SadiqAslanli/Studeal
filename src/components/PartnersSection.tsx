"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { listCompanies } from '@/app/admin/actions';
import styles from './PartnersSection.module.css';

export default function PartnersSection() {
    const { t } = useLanguage();
    const [partners, setPartners] = useState<any[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            const data = await listCompanies();
            setPartners(data.filter(p => p.is_active !== false).slice(0, 10)); // Show top 10
        };
        fetchPartners();
    }, []);

    if (partners.length === 0) return null;

    return (
        <section className={styles.partnersSection}>
            <div className={styles.sectionHeader}>
                <h2>{t.partnersPage.title}</h2>
                <div className={styles.line} />
            </div>
            <div className={styles.partnersMarquee}>
                <div className={styles.marqueeContent}>
                    {[...partners, ...partners].map((partner, index) => (
                        <div key={index} className={styles.partnerLogo}>
                            <img src={(partner as any).metadata?.image || '/logo.png'} alt={partner.full_name || 'Partner'} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
