"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Store,
    FileText,
    Phone,
    Send,
    Sparkles,
    Megaphone,
    CheckCircle2
} from 'lucide-react';
import styles from './ad-request.module.css';
import { submitAdRequest } from '../../admin/contentActions';

export default function AdRequestPage() {
    const { t } = useLanguage();
    const { user, addNotification } = useAuth();
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        restaurantName: '',
        content: '',
        phoneNumber: '',
        email: user?.email || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.restaurantName || !formData.content || !formData.phoneNumber) {
            addNotification({
                title: "Xəta",
                message: "Zəhmət olmasa bütün sahələri doldurun.",
                type: 'error'
            } as any);
            return;
        }

        // Save to Supabase
        const result = await submitAdRequest({
            company_id: user?.id,
            company_name: formData.restaurantName,
            content: formData.content,
            phone: formData.phoneNumber,
            email: formData.email
        });

        if (result.ok) {
            addNotification({
                title: "Müraciət Göndərildi",
                message: "Reklam müraciətiniz qəbul edildi. Tezliklə sizinlə əlaqə saxlayacağıq."
            });
            setSubmitted(true);
        } else {
            alert("Xəta: " + result.error);
        }
    };

    if (submitted) {
        return (
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <CheckCircle2 size={64} color="#05cd99" />
                    </div>
                    <h1>Təşəkkür edirik!</h1>
                    <p>
                        <strong>{formData.restaurantName}</strong> üçün reklam müraciətiniz uğurla göndərildi.
                        Komandamız <strong>{formData.phoneNumber}</strong> nömrəsi ilə ən qısa zamanda sizinlə əlaqə saxlayacaq.
                    </p>
                    <div className={styles.successActions}>
                        <button onClick={() => router.push('/')} className={styles.primaryBtn}>
                            Ana səhifəyə qayıt
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Geri qayıt
                </Link>
                <div className={styles.headerTitle}>
                    <div className={styles.iconBox}>
                        <Megaphone size={32} />
                    </div>
                    <h1>Reklam Yerləşdir</h1>
                    <p>Platformamızda reklam yerləşdirərək minlərlə tələbəyə çatın.</p>
                </div>
            </div>

            <main className={styles.main}>
                <div className={styles.formCard}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="restaurantName">
                                <Store size={18} />
                                Restoran / Brend Adı
                            </label>
                            <input
                                id="restaurantName"
                                type="text"
                                placeholder="Məs: Pizza Mizza"
                                value={formData.restaurantName}
                                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber">
                                <Phone size={18} />
                                Əlaqə Nömrəsi
                            </label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                placeholder="Məs: +994 50 123 45 67"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="content">
                                <FileText size={18} />
                                Reklam Haqqında Qısa Məzmun
                            </label>
                            <textarea
                                id="content"
                                rows={4}
                                placeholder="Kampaniya və ya təklifiniz barədə qısa məlumat yazın..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Müraciəti Tamamla
                            <Send size={18} />
                        </button>
                    </form>
                </div>

                <div className={styles.infoCol}>
                    <div className={styles.infoBox}>
                        <Sparkles size={24} color="#0066ff" />
                        <h3>Niyə StuDeal-da reklam?</h3>
                        <ul>
                            <li>Geniş tələbə auditoriyası</li>
                            <li>Yüksək görünürlük</li>
                            <li>Hədəfli reklam imkanları</li>
                            <li>Sürətli geri dönüş</li>
                        </ul>
                    </div>

                    <div className={styles.contactSupport}>
                        <p>Sualınız var? Birbaşa bizimlə əlaqə saxlayın:</p>
                        <a href="mailto:ads@studeal.com">ads@studeal.com</a>
                    </div>
                </div>
            </main>
        </div>
    );
}
