"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from '../info.module.css';

export default function TermsPage() {
    const { t } = useLanguage();
    const termsData = t.termsPage;

    if (!termsData) return null;

    return (
        <div className={styles.infoPage}>
            <div className="container">
                <header className={styles.header}>
                    <span className={styles.lastUpdated}>{termsData.lastUpdated}</span>
                    <h1>{termsData.title}</h1>
                    <p className={styles.intro}>{termsData.intro}</p>
                </header>

                <main className={styles.termsGrid}>
                    {termsData.sections.map((section: any, index: number) => (
                        <section key={index} className={styles.termCard}>
                            <h3>{section.title}</h3>
                            <p>{section.content}</p>
                        </section>
                    ))}
                </main>
            </div>
        </div>
    );
}
