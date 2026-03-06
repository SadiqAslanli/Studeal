"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react';
import styles from './FeaturedSlider.module.css';

export default function FeaturedSlider() {
    const { t } = useLanguage();
    const [current, setCurrent] = useState(0);
    const [featuredItems, setFeaturedItems] = useState<any[]>([]);

    useEffect(() => {
        const savedItems = localStorage.getItem('featuredDeals');
        if (savedItems) {
            const parsed = JSON.parse(savedItems);
            if (parsed.length > 0) {
                setFeaturedItems(parsed);
                return;
            }
        }

        // Fallback to default items if none in localStorage
        setFeaturedItems([
            {
                id: 1,
                title: t.featured.deal1Title,
                desc: t.featured.deal1Desc,
                image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=1200",
                discount: "20%"
            },
            {
                id: 2,
                title: t.featured.deal2Title,
                desc: t.featured.deal2Desc,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200",
                discount: "15%"
            },
            {
                id: 4,
                title: t.featured.deal3Title,
                desc: t.featured.deal3Desc,
                image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
                discount: "50%"
            }
        ]);
    }, [t]);

    useEffect(() => {
        if (featuredItems.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredItems.length]);

    const next = () => setCurrent((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
    const prev = () => setCurrent((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));

    return (
        <section className={styles.sliderContainer}>
            <div className={styles.sliderHeader}>
                <h2 className={styles.sectionTitle}>{t.featured.title}</h2>
                <div className={styles.controls}>
                    <button onClick={prev} className={styles.controlBtn}><ChevronLeft size={20} /></button>
                    <button onClick={next} className={styles.controlBtn}><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className={styles.sliderTrack}>
                {featuredItems.map((deal, index) => (
                    <div
                        key={deal.id}
                        className={`${styles.slide} ${index === current ? styles.activeSlide : ''}`}
                        style={{
                            display: index === current ? 'flex' : 'none',
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${deal.image})`
                        }}
                    >
                        <div className={styles.slideContent}>
                            <div className={styles.badgeRow}>
                                <span className={styles.discountBadge}>-{deal.discount}</span>
                                <span className={styles.limitedBadge}><Clock size={14} /> {t.featured.limited}</span>
                            </div>
                            <h3 className={styles.dealTitle}>{deal.title}</h3>
                            <p className={styles.dealDesc}>{deal.desc}</p>
                            <button className={styles.btnAction}>
                                {t.featured.getNow} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.dots}>
                {featuredItems.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.dot} ${index === current ? styles.activeDot : ''}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </section>
    );
}
