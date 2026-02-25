"use client";

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Prevent scroll when loading
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
            setIsVisible(false);
            // Re-enable scroll
            document.body.style.overflow = 'unset';
            setTimeout(() => setShouldRender(false), 500); // Wait for fade out animation
        }, 1500);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div className={`${styles.loaderWrapper} ${!isVisible ? styles.fadeOut : ''}`}>
            <div className={styles.content}>
                <div className={styles.logo}>
                    Stu<span>Deal</span>
                    <p className={styles.slogan}>Puluna bizimlə qənaət et</p>
                </div>
                <div className={styles.loaderLine}>
                    <div className={styles.lineProgress}></div>
                </div>
            </div>

            <div className={styles.decorations}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
            </div>
        </div>
    );
}
