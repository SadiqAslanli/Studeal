"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react';
import styles from './FeaturedSlider.module.css';
import { getFeaturedDeals } from '@/app/admin/contentActions';

export default function FeaturedSlider() {
    const { t } = useLanguage();
    const [current, setCurrent] = useState(0);
    const [featuredItems, setFeaturedItems] = useState<any[]>([]);

    useEffect(() => {
        const loadFeatured = async () => {
            const items = await getFeaturedDeals();
            setFeaturedItems(items);
        };
        loadFeatured();
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
                {featuredItems.map((deal, index) => {
                    const isVideo = deal.image?.toLowerCase().includes('/video/') || deal.image?.endsWith('.mp4');
                    return (
                        <div
                            key={deal.id}
                            className={`${styles.slide} ${index === current ? styles.activeSlide : ''}`}
                            style={{ display: index === current ? 'flex' : 'none' }}
                        >
                            <div className={styles.slideMedia}>
                                {isVideo ? (
                                    <video 
                                        src={deal.image_url} 
                                        className={styles.slideVideo} 
                                        autoPlay 
                                        muted 
                                        loop 
                                        playsInline 
                                    />
                                ) : (
                                    <img src={deal.image_url} alt={deal.title} className={styles.slideImg} />
                                )}
                                <div className={styles.slideOverlay} />
                            </div>
                            <div className={styles.slideContent}>
                                <div className={styles.badgeRow}>
                                    <span className={styles.discountBadge}>-{deal.discount}</span>
                                    <span className={styles.limitedBadge}><Clock size={14} /> {t.featured.limited}</span>
                                </div>
                                <h3 className={styles.dealTitle}>{deal.title}</h3>
                                <p className={styles.dealDesc}>{deal.description}</p>
                                <button className={styles.btnAction}>
                                    {t.featured.getNow} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
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
