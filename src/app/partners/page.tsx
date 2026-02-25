"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './partners.module.css';
import Link from 'next/link';

export default function PartnersPage() {
    const { t } = useLanguage();

    const partners = [
        { name: 'KFC', logo: '🍗', category: 'Food' },
        { name: 'McDonalds', logo: '🍔', category: 'Food' },
        { name: 'Nike', logo: '👟', category: 'Fashion' },
        { name: 'Apple Store', logo: '💻', category: 'Tech' },
        { name: 'CinemaPlus', logo: '🍿', category: 'Entertainment' },
        { name: 'Baku Book Center', logo: '📚', category: 'Education' },
        { name: 'Starbucks', logo: '☕️', category: 'Cafe' },
        { name: 'Bravo', logo: '🛒', category: 'Market' },
        { name: 'Wolfe', logo: '🚲', category: 'Delivery' },
    ];

    return (
        <div className={styles.partnersContainer}>
            <header className={styles.header}>
                <h1>{t.partnersPage.title}</h1>
                <p>{t.partnersPage.subtitle}</p>
            </header>

            <div className={styles.partnersGrid}>
                {partners.map((partner, index) => (
                    <div key={index} className={styles.partnerCard}>
                        <div className={styles.logoWrapper}>
                            <span className={styles.logoIcon}>{partner.logo}</span>
                        </div>
                        <h3>{partner.name}</h3>
                        <span className={styles.categoryBadge}>{partner.category}</span>
                    </div>
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
