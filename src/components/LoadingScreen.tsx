"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Stop body from scrolling
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setIsVisible(false);
            // Re-enable scroll
            document.body.style.overflow = 'unset';
            setTimeout(() => setShouldRender(false), 800);
        }, 2200);

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
