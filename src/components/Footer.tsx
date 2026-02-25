"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from '@/app/page.module.css';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.logo}>
                            Stu<span>Deal</span>
                        </Link>
                        <p>{t.footerSection.desc}</p>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>{t.footerSection.platform}</h4>
                        <ul>
                            <li><Link href="/about">{t.footerSection.about}</Link></li>
                            <li><Link href="/partners">{t.footerSection.partners}</Link></li>
                        </ul>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>{t.footerSection.support}</h4>
                        <ul>
                            <li><Link href="/faq">{t.footerSection.faq}</Link></li>
                            <li><Link href="/feedback">{t.nav.feedback}</Link></li>
                        </ul>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>{t.footerSection.social}</h4>
                        <div className={styles.socialLinks}>
                            <Link href="#" className={styles.socialIcon} aria-label="Facebook">
                                <Facebook size={20} />
                            </Link>
                            <Link href="#" className={styles.socialIcon} aria-label="Instagram">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className={styles.socialIcon} aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; {new Date().getFullYear()} StuDeal. {t.footer}.</p>
                    <p>Made with ❤️ for students</p>
                </div>
            </div>
        </footer>
    );
}
