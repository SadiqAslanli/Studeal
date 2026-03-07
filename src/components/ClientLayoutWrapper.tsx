"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ContactFloat from "@/components/ContactFloat";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Define pages where header and footer should not be shown
    const isDashboard = pathname?.startsWith('/dashboard');
    const isAdminPage = pathname?.startsWith('/admin');
    const isAuthPage = pathname === '/login' || pathname === '/register';
    const hideLayout = isAuthPage || isDashboard || isAdminPage;

    // Restriction Logic: Admins and Companies should only see their own dashboards
    useEffect(() => {
        if (isLoading || !user) return;

        // Skip restriction for auth pages (so they can logout or switch)
        if (isAuthPage) return;

        if (user.isAdmin) {
            // Admins can go anywhere, no restrictions
            return;
        } else if (user.isCompany) {
            // Companies are restricted to dashboard
            if (!isDashboard && !isAuthPage) {
                router.push('/dashboard');
            }
        } else {
            // Students/Guests - kick out of restricted pages
            if (isAdminPage || isDashboard) {
                router.push('/');
            }
        }
    }, [user, pathname, isAdminPage, isDashboard, isAuthPage, isLoading, router]);

    return (
        <div suppressHydrationWarning>
            <ScrollToTop />
            {!hideLayout && <ContactFloat />}
            {!hideLayout && <Header />}
            <main style={{ minHeight: !hideLayout ? '60vh' : 'auto' }}>
                {children}
            </main>
            {!hideLayout && <Footer />}
        </div>
    );
}
