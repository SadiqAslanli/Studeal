"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export type Notification = {
    id: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
};

export type Transaction = {
    id: string;
    title: string;
    date: string;
    points: string;
    type: 'earn' | 'spend';
};

export type User = {
    id: string;
    email?: string;
    fullName?: string;
    username?: string;
    roles?: string[];
    role?: string;
    name: string;
    isCompany: boolean;
    isAdmin: boolean;
    points: number;
    university?: string;
    course?: string;
    phone?: string;
    favorites: number[];
    companyFavorites: number[];
    notifications: Notification[];
    transactions: Transaction[];
    usedDealsCount: number;
    viewCount: number;
    usageCount: number;
    plan: string;
    deals?: any[];
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithUser: (user: Partial<User> & { id: string }) => void;
    register: (userData: { email: string; password: string; name: string }) => Promise<boolean>;
    updateUser: (updatedUser: Partial<User>) => void;
    logout: () => Promise<void>;
    toggleFavorite: (dealId: number) => void;
    toggleCompanyFavorite: (companyId: number) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    loginWithGoogle: () => void;
    authUrl: string;
    apiUrl: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultStudealMeta = {
    points: 0,
    favorites: [] as number[],
    companyFavorites: [] as number[],
    notifications: [] as Notification[],
    transactions: [] as Transaction[],
    usedDealsCount: 0,
    viewCount: 0,
    usageCount: 0,
    plan: 'bronze',
    deals: [] as any[],
};

type ProfileRow = { 
    id: string; 
    email: string | null | undefined; 
    full_name: string | null | undefined; 
    role: string | null | undefined; 
};

function profileToUser(profile: ProfileRow, meta: Partial<User>): User {
    const role = profile.role || 'Student';
    const isAdmin = role === 'Admin' || role === 'SuperAdmin';
    const isCompany = role === 'Company';
    return {
        id: profile.id,
        email: profile.email ?? undefined,
        fullName: profile.full_name ?? undefined,
        name: profile.full_name || profile.email || 'User',
        role,
        roles: [role],
        isCompany,
        isAdmin,
        points: meta.points ?? 0,
        favorites: meta.favorites ?? [],
        companyFavorites: meta.companyFavorites ?? [],
        notifications: meta.notifications ?? [],
        transactions: meta.transactions ?? [],
        usedDealsCount: meta.usedDealsCount ?? 0,
        viewCount: meta.viewCount ?? 0,
        usageCount: meta.usageCount ?? 0,
        plan: meta.plan ?? 'bronze',
        deals: meta.deals ?? [],
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [baseUser, setBaseUser] = useState<(ProfileRow & Partial<User>) | null>(null);
    const [studealData, setStudealData] = useState<Partial<User>>({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);

    const authUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    useEffect(() => {
        if (!baseUser) return;
        const savedData = localStorage.getItem(`studeal_meta_${baseUser.id}`);
        if (savedData) {
            try {
                setStudealData(JSON.parse(savedData));
            } catch {
                setStudealData(defaultStudealMeta);
            }
        } else {
            setStudealData(defaultStudealMeta);
            localStorage.setItem(`studeal_meta_${baseUser.id}`, JSON.stringify(defaultStudealMeta));
        }
    }, [baseUser?.id]);

    const mergedUser = useMemo(() => {
        if (!baseUser) return null;
        return profileToUser(
            { id: baseUser.id, email: baseUser.email ?? null, full_name: baseUser.full_name ?? baseUser.fullName ?? null, role: baseUser.role ?? null },
            studealData
        );
    }, [baseUser, studealData]);

    const saveStudealMeta = (updated: Partial<User>) => {
        if (!baseUser) return;
        const newData = { ...studealData, ...updated };
        setStudealData(newData);
        localStorage.setItem(`studeal_meta_${baseUser.id}`, JSON.stringify(newData));
    };

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase.from('profiles').select('id, email, full_name, role').eq('id', userId).single();
        return data as ProfileRow | null;
    };

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session?.user) {
                setBaseUser(null);
                setStudealData({});
                setIsLoading(false);
                return;
            }
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                const profile = await fetchProfile(session.user.id);
                if (profile) setBaseUser(profile as any);
                setIsLoading(false);
            }
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id).then((profile) => {
                    if (profile) setBaseUser(profile as any);
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const login = async (email: string, password: string): Promise<boolean> => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        return true;
    };

    const loginWithUser = (user: Partial<User> & { id: string }) => {
        setBaseUser({
            id: user.id,
            email: user.email ?? null,
            full_name: user.name || user.fullName || user.email || '',
            role: user.role || 'Company',
        } as any);
    };

    // Only Students can register; Companies are created by Admin
    const register = async (userData: { email: string; password: string; name: string }): Promise<boolean> => {
        const { error } = await supabase.auth.signUp({
            email: userData.email.trim().toLowerCase(),
            password: userData.password,
            options: { data: { full_name: userData.name.trim() } },
        });
        if (error) throw new Error(error.message);
        return true;
    };

    const updateUser = (updatedFields: Partial<User>) => {
        saveStudealMeta(updatedFields);
    };

    const toggleFavorite = (dealId: number) => {
        const currentFavs = studealData.favorites ?? [];
        const newFavs = currentFavs.includes(dealId) ? currentFavs.filter((id) => id !== dealId) : [...currentFavs, dealId];
        saveStudealMeta({ favorites: newFavs });
    };

    const toggleCompanyFavorite = (companyId: number) => {
        const currentFavs = studealData.companyFavorites ?? [];
        const newFavs = currentFavs.includes(companyId) ? currentFavs.filter((id) => id !== companyId) : [...currentFavs, companyId];
        saveStudealMeta({ companyFavorites: newFavs });
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notif,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
            isRead: false,
        };
        saveStudealMeta({ notifications: [newNotification, ...(studealData.notifications ?? [])] });
    };

    const addTransaction = (trans: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...trans,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
        };
        saveStudealMeta({ transactions: [newTransaction, ...(studealData.transactions ?? [])] });
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            // 1. Supabase-dən rəsmi çıxış edirik
            await supabase.auth.signOut();
            
            // 2. Local yaddaşı təmizləyirik
            localStorage.clear();
            sessionStorage.clear();

            // 3. State-ləri sıfırlayırıq
            setBaseUser(null);
            setStudealData({});
            
            // 4. Giriş səhifəsinə yönləndiririk
            router.replace('/login');
            router.refresh();
        } catch (e) {
            console.error("Logout error:", e);
            // Error olsa belə dərhal təmizləyib atırıq
            localStorage.clear();
            window.location.href = '/login';
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = () => {
        supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    return (
        <AuthContext.Provider
            value={{
                user: mergedUser,
                isLoading,
                login,
                loginWithUser,
                register,
                updateUser,
                logout,
                toggleFavorite,
                toggleCompanyFavorite,
                addNotification,
                addTransaction,
                loginWithGoogle,
                authUrl,
                apiUrl,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
