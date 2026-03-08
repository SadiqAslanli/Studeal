"use client";

import { useState, useEffect } from 'react';
import styles from './contact.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactFloat() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        // Show greeting bubble 1 second after loading screen ends (3s + 1s = 4s)
        const greetingTimer = setTimeout(() => {
            setShowGreeting(true);
        }, 4000);

        // Hide greeting after 12 seconds
        const hideTimer = setTimeout(() => {
            setShowGreeting(false);
        }, 12000);

        return () => {
            clearTimeout(greetingTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            setIsOpen(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    const handleOpen = () => {
        setShowGreeting(false);
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.contactWrapper}>
            {/* Greeting bubble */}
            {showGreeting && !isOpen && (
                <div className={styles.greetingBubble}>
                    <span>{t.contactForm.greeting}</span>
                    <button className={styles.greetingClose} onClick={() => setShowGreeting(false)}>✕</button>
                    <div className={styles.bubbleTail} />
                </div>
            )}

            <div className={`${styles.popup} ${isOpen ? styles.popupOpen : ''}`}>
                <div className={styles.popupHeader}>
                    <h3>{t.contactForm.title}</h3>
                    <p>{t.contactForm.subtitle}</p>
                </div>

                {isSent ? (
                    <div className={styles.successView}>
                        <span className={styles.successCheck}>✅</span>
                        <h4>{t.contactForm.success}</h4>
                        <p>{t.contactForm.successMsg}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.contactForm}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                placeholder={t.contactForm.name}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                placeholder={t.contactForm.email}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <textarea
                                placeholder={t.contactForm.message}
                                rows={3}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.submitBtn}>{t.contactForm.send}</button>
                    </form>
                )}
            </div>

            <button
                className={`${styles.floatBtn} ${isOpen ? styles.floatBtnActive : ''}`}
                onClick={handleOpen}
                aria-label="Contact Support"
            >
                <div className={styles.btnIcons}>
                    <span className={styles.chatIcon}>💬</span>
                    <span className={styles.closeIcon}>✕</span>
                </div>
                {!isOpen && <span className={styles.badge}>1</span>}
            </button>
        </div>
    );
}
