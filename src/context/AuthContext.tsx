"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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

// Standalone User type (no external auth package). Wire Supabase session to this shape via loginWithUser().
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
    register: (userData: any) => Promise<boolean>;
    updateUser: (updatedUser: Partial<User>) => void;
    logout: () => void;
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

function buildUser(base: Partial<User> & { id: string }, meta: Partial<User>): User {
    const roles = base.roles ?? (base.role ? [base.role] : []);
    const isAdmin = roles.some(r => r === 'Admin' || r === 'SuperAdmin') || base.role === 'Admin' || base.role === 'SuperAdmin';
    const isCompany = roles.includes('Company') || base.role === 'Company' || !!base.username?.includes('rest');
    return {
        id: base.id,
        email: base.email,
        fullName: base.fullName,
        username: base.username,
        roles,
        role: base.role,
        name: base.fullName || base.username || base.email || base.name || 'User',
        isCompany,
        isAdmin,
        points: meta.points ?? 0,
        university: meta.university ?? base.university,
        course: meta.course ?? base.course,
        phone: meta.phone ?? base.phone,
        favorites: meta.favorites ?? [],
        companyFavorites: meta.companyFavorites ?? [],
        notifications: meta.notifications ?? [],
        transactions: meta.transactions ?? [],
        usedDealsCount: meta.usedDealsCount ?? 0,
        viewCount: meta.viewCount ?? 0,
        usageCount: meta.usageCount ?? 0,
        plan: meta.plan ?? 'bronze',
        deals: meta.deals ?? base.deals ?? [],
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [baseUser, setBaseUser] = useState<(Partial<User> & { id: string }) | null>(null);
    const [studealData, setStudealData] = useState<Partial<User>>({});
    const [isLoading] = useState(false);
    const router = useRouter();

    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    // Load Studeal metadata from localStorage when base user changes
    useEffect(() => {
        if (baseUser) {
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
        } else {
            setStudealData({});
        }
    }, [baseUser?.id]);

    const mergedUser = useMemo(() => {
        if (!baseUser) return null;
        return buildUser(baseUser, studealData);
    }, [baseUser, studealData]);

    const saveStudealMeta = (updated: Partial<User>) => {
        if (!baseUser) return;
        const newData = { ...studealData, ...updated };
        setStudealData(newData);
        localStorage.setItem(`studeal_meta_${baseUser.id}`, JSON.stringify(newData));
    };

    // No-op until you wire Supabase: sign in with Supabase then call loginWithUser(mappedUser)
    const login = async (_identifier: string, _password: string): Promise<boolean> => {
        return false;
    };

    // Call this with the user from your Supabase session (mapped to User shape)
    const loginWithUser = (user: Partial<User> & { id: string }) => {
        setBaseUser(user);
    };

    // No-op until you wire Supabase auth
    const register = async (_formData: any): Promise<boolean> => {
        return false;
    };

    const updateUser = (updatedFields: Partial<User>) => {
        saveStudealMeta(updatedFields);
    };

    const toggleFavorite = (dealId: number) => {
        const currentFavs = studealData.favorites ?? [];
        const isFav = currentFavs.includes(dealId);
        const newFavs = isFav ? currentFavs.filter(id => id !== dealId) : [...currentFavs, dealId];
        saveStudealMeta({ favorites: newFavs });
    };

    const toggleCompanyFavorite = (companyId: number) => {
        const currentFavs = studealData.companyFavorites ?? [];
        const isFav = currentFavs.includes(companyId);
        const newFavs = isFav ? currentFavs.filter(id => id !== companyId) : [...currentFavs, companyId];
        saveStudealMeta({ companyFavorites: newFavs });
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notif,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
            isRead: false,
        };
        const currentNotifs = studealData.notifications ?? [];
        saveStudealMeta({ notifications: [newNotification, ...currentNotifs] });
    };

    const addTransaction = (trans: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...trans,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
        };
        const currentTransactions = studealData.transactions ?? [];
        saveStudealMeta({ transactions: [newTransaction, ...currentTransactions] });
    };

    const logout = () => {
        setBaseUser(null);
        setStudealData({});
        router.push('/');
    };

    const loginWithGoogle = () => {
        // No-op until you wire Supabase OAuth
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
