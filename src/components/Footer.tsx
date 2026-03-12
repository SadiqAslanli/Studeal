"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, Send, Instagram, Youtube, Clock, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from '@/app/page.module.css';

export default function Footer() {
    const { t, lang } = useLanguage();
    const [time, setTime] = useState(new Date());
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date: Date) => {
        if (lang === 'az') {
            const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
            const days = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
            
            const dayName = days[date.getDay()];
            const day = date.getDate();
            const monthName = months[date.getMonth()];
            const year = date.getFullYear();
            
            return `${day} ${monthName} ${year}, ${dayName}`;
        }
        
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerBlob1} />
            <div className={styles.footerBlob2} />
            <div className={styles.footerBlob3} />

            <div className="container">

                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogoWrap}>
                            <Link href="/" className={styles.logo}>
                                <img src="/logo2.png" alt="Studeal Logo" className={styles.logoImg} />
                                <div className={styles.logoText}>
                                    <span className={styles.logoStu}>Stu</span>
                                    <span className={styles.logoDeal}>Deal</span>
                                </div>
                            </Link>
                        </div>
                        <p className={styles.brandDesc}>{t.footerSection.desc}</p>
                        <div className={styles.footerSocials}>
                            <a href="https://instagram.com" target="_blank" rel="noopener" className={styles.footerSocialBtn} aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener" className={styles.footerSocialBtn} aria-label="TikTok">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener" className={styles.footerSocialBtn} aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.footerCol}>
                        <h4 className={styles.footerTitle}>{t.footerSection.platform}</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/brands">{t.footerSection.brands}</Link></li>
                            <li><Link href="/partners">{t.nav.sahibkarlar}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h4 className={styles.footerTitle}>{t.footerSection.support}</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/terms">{t.footerSection.terms}</Link></li>
                            <li><Link href="/privacy">{t.footerSection.privacy}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h4 className={styles.footerTitle}>{lang === 'az' ? 'CANLI SAAT' : 'LIVE TIME'}</h4>
                        <div className={styles.timeWidget}>
                            <div className={styles.timeBg} />
                            <div className={styles.timeDisplay}>
                                <Clock size={22} className={styles.timeIcon} />
                                <span>{hasMounted ? formatTime(time) : '--:--:--'}</span>
                            </div>
                            <div className={styles.dateDisplay}>
                                <Calendar size={18} className={styles.dateIcon} />
                                <span>{hasMounted ? formatDate(time) : '...'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.bottomLeft}>
                        <p>© {new Date().getFullYear()} Studeal Inc. {t.footer}.</p>
                    </div>
                    <div className={styles.bottomRight}>
                        <span>Designed by students, for the future.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
