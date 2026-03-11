"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from '../info.module.css';

export default function PrivacyPage() {
    const { t } = useLanguage();
    const privacyData = t.privacyPage;

    if (!privacyData) return null;

    return (
        <div className={styles.infoPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1>{privacyData.title}</h1>
                    <p className={styles.intro}>{privacyData.intro}</p>
                </header>

                <main className={styles.termsGrid}>
                    {privacyData.sections.map((section: any, index: number) => (
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
