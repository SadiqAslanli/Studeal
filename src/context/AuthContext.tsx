"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseBrowserConfig } from '@/lib/supabase/env';

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
    email: string | null;
    fullName: string | null;
    username?: string;
    roles?: string[];
    role: string | null;
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
    image?: string;
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
    image_url?: string | null | undefined;
    metadata?: any;
};

function profileToUser(profile: ProfileRow, meta: Partial<User>): User {
    const role = profile.role || 'Student';
    const isAdmin = role === 'Admin' || role === 'SuperAdmin';
    const isCompany = role === 'Company';
    return {
        id: profile.id,
        email: profile.email ?? null,
        fullName: profile.full_name ?? null,
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
        deals: meta.deals ?? profile.metadata?.deals ?? [],
        image: meta.image || profile.image_url || profile.metadata?.image || '',
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [baseUser, setBaseUser] = useState<ProfileRow | null>(null);
    const [studealData, setStudealData] = useState<Partial<User>>({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();
    const { url: supabaseUrl } = getSupabaseBrowserConfig();
    const authUrl = supabaseUrl;
    const apiUrl = supabaseUrl;

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
        return profileToUser(baseUser, studealData);
    }, [baseUser, studealData]);

    const saveStudealMeta = async (updated: Partial<User>) => {
        if (!baseUser) return;
        const newData = { ...studealData, ...updated };
        setStudealData(newData);
        localStorage.setItem(`studeal_meta_${baseUser.id}`, JSON.stringify(newData));

        // Update local baseUser state for immediate UI feedback
        setBaseUser(prev => {
           if (!prev) return null;
           const next = { ...prev };
           if (updated.fullName) next.full_name = updated.fullName;
           if (updated.image) next.image_url = updated.image;
           return next;
        });

        // Sync to Supabase - non-blocking try/catch
        try {
            const updatePayload: any = { metadata: newData };
            if (updated.fullName) updatePayload.full_name = updated.fullName;
            if (updated.image) updatePayload.image_url = updated.image;
            
            await supabase
                .from('profiles')
                .update(updatePayload)
                .eq('id', baseUser.id);
        } catch (e) {
            console.warn("DEBUG: Metadata sync failed:", e);
        }
    };

    const fetchProfile = async (userId: string, retryCount = 0): Promise<ProfileRow | null> => {
        try {
            const { data, error } = await supabase
              .from('profiles')
              .select('id, email, full_name, role, metadata, image_url')
              .eq('id', userId)
              .maybeSingle();
            
            if (error) {
                if ((error.message.includes('AbortError') || error.message.includes('lock broken')) && retryCount < 2) {
                    await new Promise(r => setTimeout(r, 200));
                    return fetchProfile(userId, retryCount + 1);
                }
                
                // Fallback attempt without metadata/image_url columns if they fail
                const { data: fbData, error: fbError } = await supabase
                  .from('profiles')
                  .select('id, email, full_name, role')
                  .eq('id', userId)
                  .maybeSingle();
                
                return fbError ? null : (fbData as ProfileRow);
            }
            
            return data as ProfileRow | null;
        } catch (e: any) {
            if ((e?.name === 'AbortError' || e?.message?.includes('Lock broken')) && retryCount < 2) {
                await new Promise(r => setTimeout(r, 200));
                return fetchProfile(userId, retryCount + 1);
            }
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            // Handle sign out
            if (event === 'SIGNED_OUT' || !session?.user) {
                setBaseUser(null);
                setStudealData({});
                setIsLoading(false);
                return;
            }

            // INITIAL_SESSION = existing session on page load
            // SIGNED_IN = fresh login
            // TOKEN_REFRESHED = token renewed
            if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                try {
                    const profile = await fetchProfile(session.user.id);
                    if (mounted && profile) {
                        setBaseUser(profile);
                    }
                } catch (err) {
                    console.error("DEBUG: Profile fetch failed:", err);
                } finally {
                    if (mounted) setIsLoading(false);
                }
                return;
            }

            // Any other event: just stop loading
            if (mounted) setIsLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const { error } = await supabase.auth.signInWithPassword({ 
            email: email.trim().toLowerCase(), 
            password 
        });
        if (error) throw new Error(error.message);
        return true;
    };

    const loginWithUser = (user: Partial<User> & { id: string }) => {
        setBaseUser({
            id: user.id,
            email: user.email ?? null,
            full_name: user.name || user.fullName || user.email || '',
            role: user.role || 'Company',
        });
    };

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
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
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
