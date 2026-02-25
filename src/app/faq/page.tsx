"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './faq.module.css';

export default function FaqPage() {
    const { t } = useLanguage();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const faqs = [
        {
            category: t.faq.cats.platform,
            items: [
                {
                    az: { q: "StuDeal nədir?", a: "StuDeal, Azərbaycandakı tələbələrə xüsusi endirim və bonuslar təklif edən rəqəmsal platformadır." },
                    en: { q: "What is StuDeal?", a: "StuDeal is a digital platform offering special discounts and bonuses for students in Azerbaijan." },
                    ru: { q: "Что такое StuDeal?", a: "StuDeal — это цифровая платформа, предлагающая специальные скидки и бонусы для студентов в Азербайджане." }
                },
                {
                    az: { q: "StuDeal pulsuz istifadə olunur?", a: "Bəli, StuDeal-da qeydiyyat tamamilə pulsuzdur." },
                    en: { q: "Is StuDeal free to use?", a: "Yes, registration on StuDeal is completely free." },
                    ru: { q: "Является ли StuDeal бесплатным?", a: "Да, регистрация на StuDeal совершенно бесплатна." }
                }
            ]
        },
        {
            category: t.faq.cats.points,
            items: [
                {
                    az: { q: "Xalları necə qazanıram?", a: "Tərəfdaş brendlərdə QR kodunuzu göstərərək hər ödənişin 5%-i xal kimi hesabınıza düşür." },
                    en: { q: "How do I earn points?", a: "By showing your QR code at partner brands, 5% of each payment is added to your account as points." },
                    ru: { q: "Как я могу заработать баллы?", a: "Показывая свой QR-код у брендов-партнеров, 5% от каждого платежа зачисляются на ваш счет в виде баллов." }
                }
            ]
        }
    ];

    const toggle = (key: string) => {
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const { lang } = useLanguage();
    const currentLang = (lang as 'az' | 'en' | 'ru') || 'az';

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className="container">
                    <Link href="/" className={styles.backLink}>← {t.common.backHome}</Link>
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>{t.faq.heroBadge}</span>
                        <h1>{t.faq.heroTitle}<br /><span>{t.faq.heroTitleSpan}</span></h1>
                        <p>{t.faq.heroDesc}</p>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className={styles.faqLayout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <h3>{t.faq.catTitle}</h3>
                            <ul>
                                {faqs.map(cat => (
                                    <li key={cat.category}>
                                        <a href={`#${cat.category}`}>{cat.category}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.contactCard}>
                            <div className={styles.contactIcon}>💬</div>
                            <h4>{t.faq.noAnswer}</h4>
                            <p>{t.faq.noAnswerDesc}</p>
                            <Link href="/feedback" className={styles.contactBtn}>{t.faq.contactBtn}</Link>
                        </div>
                    </aside>

                    <main className={styles.faqContent}>
                        {faqs.map((cat) => (
                            <section key={cat.category} id={cat.category} className={styles.categorySection}>
                                <h2 className={styles.categoryTitle}>{cat.category}</h2>
                                <div className={styles.accordionList}>
                                    {cat.items.map((item: any, i) => {
                                        const key = `${cat.category}-${i}`;
                                        const isOpen = openItems[key];
                                        const content = item[currentLang];
                                        return (
                                            <div
                                                key={key}
                                                className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}
                                            >
                                                <button
                                                    className={styles.accordionBtn}
                                                    onClick={() => toggle(key)}
                                                >
                                                    <span>{content.q}</span>
                                                    <span className={styles.chevron}>
                                                        {isOpen ? '−' : '+'}
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className={styles.accordionAnswer}>
                                                        <p>{content.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    );
}
