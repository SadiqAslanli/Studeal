"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
    ArrowLeft,
    Sparkles,
    Shield,
    History,
    Award,
    User,
    Mail,
    ClipboardList,
    MessageSquareText,
    Send
} from 'lucide-react';
import styles from './feedback.module.css';
import { addMessage } from '../admin/contentActions';

export default function FeedbackPage() {
    const { t } = useLanguage();
    const { user, addNotification } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.fullName || '',
        email: user?.email || '',
        type: 'suggestion',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.message.trim()) return;

        // Save to Supabase
        const result = await addMessage(formData);
        
        if (result.ok) {
            addNotification({
                title: t.feedback.successTitle,
                message: t.feedback.successMsg
            });
            setSubmitted(true);
        } else {
            alert("Xəta: " + result.error);
        }
    };

    if (submitted) {
        return (
            <div className={styles.feedbackPage}>
                <div className="container">
                    <div className={styles.successWrapper}>
                        <div className={styles.successCard}>
                            <div className={styles.confettiContainer}>
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className={styles.confettiBit}></div>
                                ))}
                            </div>
                            <div className={styles.successIcon}>
                                <Sparkles size={48} />
                            </div>
                            <h1>{t.feedback.successTitle}</h1>
                            <p>{t.feedback.successMsg}</p>
                            <Link href="/" className={styles.homeBtn}>
                                <ArrowLeft size={18} /> {t.common.backHome}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedbackPage}>

            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div className={styles.badge}>{t.nav.feedback}</div>
                        <h1>{t.feedback.title}</h1>
                        <p>{t.feedback.subTitle}</p>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className={styles.gridContainer}>
                    {/* Left: Info Cards */}
                    <div className={styles.infoCol}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <Shield size={26} color="#4318ff" />
                            </div>
                            <div className={styles.infoText}>
                                <h4>Məxfilik</h4>
                                <p>Sizin rəyləriniz tam məxfi saxlanılır və yalnız xidmət keyfiyyətini artırmaq üçün istifadə olunur.</p>
                            </div>
                        </div>
                        <div className={styles.infoCard} style={{ animationDelay: '0.1s' }}>
                            <div className={styles.infoIcon}>
                                <History size={26} color="#ffb547" />
                            </div>
                            <div className={styles.infoText}>
                                <h4>Sürətli Cavab</h4>
                                <p>Hər bir müraciətə 24 saat ərzində komandamız tərəfindən baxılır.</p>
                            </div>
                        </div>
                        <div className={styles.infoCard} style={{ animationDelay: '0.2s' }}>
                            <div className={styles.infoIcon}>
                                <Award size={26} color="#01b574" />
                            </div>
                            <div className={styles.infoText}>
                                <h4>Xal Qazan</h4>
                                <p>Dəyərli rəy və təkliflərinizə görə balansınıza 20 xal əlavə olunur.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form Card */}
                    <div className={styles.formCard}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>
                                        <User size={16} /> {t.feedback.labelName}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t.auth.namePlaceholder}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>
                                        <Mail size={16} /> {t.feedback.labelEmail}
                                    </label>
                                    <input
                                        type="email"
                                        placeholder={t.auth.emailPlaceholder}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    <ClipboardList size={16} /> {t.feedback.labelType}
                                </label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="suggestion">💡 {t.feedback.typeSuggestion}</option>
                                        <option value="complaint">⚠️ {t.feedback.typeComplaint}</option>
                                        <option value="ads">📈 {t.feedback.typeAds}</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    <MessageSquareText size={16} /> {t.feedback.labelMessage}
                                </label>
                                <textarea
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder={t.feedback.placeholderMessage}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                {t.feedback.submitBtn}
                                <Send size={20} className={styles.btnArrow} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
