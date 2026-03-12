"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // If we've already shown the loader in this session, skip it or make it very fast
        const hasLoaded = sessionStorage.getItem('app_loaded');
        const delay = hasLoaded ? 400 : 800; // Much faster than 2200ms

        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
            sessionStorage.setItem('app_loaded', 'true');
            setTimeout(() => setShouldRender(false), 500);
        }, delay);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div className={`${styles.loaderWrapper} ${!isVisible ? styles.fadeOut : ''}`}>
            <div className={styles.bgBlur}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
            </div>

            <div className={styles.content}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logo}>
                        Stu<span>Deal</span>
                    </h1>
                    <p className={styles.slogan}>{t.common.loading}</p>
                </div>

                <div className={styles.loaderRing}>
                    <div className={styles.ringInner} />
                    <div className={styles.centerDot} />
                </div>
            </div>
        </div>
    );
}
