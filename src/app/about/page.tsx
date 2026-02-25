"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './about.module.css';
import Link from 'next/link';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.aboutContainer}>
            <header className={styles.header}>
                <h1>{t.aboutPage.title}</h1>
                <p>{t.aboutPage.subtitle}</p>
            </header>

            <section className={styles.introSection}>
                <div className={styles.introContent}>
                    <h2>{t.aboutPage.howItWorks}</h2>
                    <p className={styles.introSubtitle}>{t.aboutPage.howItWorksSubtitle}</p>
                    <div className={styles.introText}>
                        <p>{t.aboutPage.desc1}</p>
                        <p>{t.aboutPage.desc2}</p>
                    </div>
                </div>
            </section>

            <section className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.icon}>🎯</div>
                    <h3>{t.aboutPage.mission}</h3>
                    <p>{t.aboutPage.missionText}</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.icon}>🚀</div>
                    <h3>{t.aboutPage.vision}</h3>
                    <p>{t.aboutPage.visionText}</p>
                </div>
            </section>

            <section className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>10k+</span>
                    <span className={styles.statLabel}>{t.aboutPage.stats.users}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>150+</span>
                    <span className={styles.statLabel}>{t.aboutPage.stats.partners}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statNumber}>500+</span>
                    <span className={styles.statLabel}>{t.aboutPage.stats.deals}</span>
                </div>
            </section>

            <section className={styles.contactCta}>
                <p>{t.partnersPage.becomePartner}</p>
                <Link href="/feedback" className="btn-primary">
                    {t.partnersPage.contactUs}
                </Link>
            </section>
        </div>
    );
}
