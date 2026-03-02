"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, Send, Instagram, Music2 } from 'lucide-react';
import styles from '@/app/page.module.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogoWrap}>
                            <Link href="/" className={styles.logo}>
                                <img src="/logo.png" alt="Studeal Logo" className={styles.logoImg} />
                            </Link>
                        </div>
                        <p>{t.footerSection.desc}</p>
                        <div className={styles.footerSocials}>
                            <a href="https://instagram.com" target="_blank" rel="noopener" className={styles.footerSocialBtn} aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener" className={styles.footerSocialBtn} aria-label="TikTok">
                                <Music2 size={20} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.footerCol}>
                        <h4 className={styles.footerTitle}>{t.footerSection.platform}</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/deals">{t.footerSection.allDeals}</Link></li>
                            <li><Link href="/categories">{t.categories.label}</Link></li>
                            <li><Link href="/brands">{t.footerSection.brands}</Link></li>
                            <li><Link href="/partners">{t.footerSection.partnerWithUs}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h4 className={styles.footerTitle}>{t.footerSection.support}</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/faq">{t.footerSection.helpCenter}</Link></li>
                            <li><Link href="/verify">{t.footerSection.studentVerification}</Link></li>
                            <li><Link href="/terms">{t.footerSection.terms}</Link></li>
                            <li><Link href="/privacy">{t.footerSection.privacy}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h4 className={styles.footerTitle}>{t.footerSection.newsletter}</h4>
                        <p className={styles.newsletterText}>{t.footerSection.newsletterDesc}</p>
                        <div className={styles.newsletterBox}>
                            <input
                                type="email"
                                placeholder={t.footerSection.emailPlaceholder}
                                className={styles.newsletterInput}
                            />
                            <button className={styles.newsletterBtn}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} Studeal Inc. {t.footer}.</p>
                    <p>Designed for students, by students.</p>
                </div>
            </div>
        </footer>
    );
}
