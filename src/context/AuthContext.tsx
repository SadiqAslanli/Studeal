"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseBrowserConfig } from '@/lib/supabase/env';
import { updateCompanyProfile } from "@/app/admin/actions";

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

export function AuthProvider({ 
    children, 
    initialUser = null 
}: { 
    children: React.ReactNode, 
    initialUser?: User | null 
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(!initialUser);
    const router = useRouter();
    const supabase = createClient();
    
    // Track if we've initialized the session to avoid redundant fetches
    const [hasInitialized, setHasInitialized] = useState(!!initialUser);


    const saveStudealMeta = async (updated: Partial<User> & Record<string, any>) => {
        if (!user) return;
        
        const newUser = { ...user, ...updated };
        setUser(newUser);
        
        // Save to localStorage
        const metaToSave = {
            points: newUser.points,
            favorites: newUser.favorites,
            companyFavorites: newUser.companyFavorites,
            notifications: newUser.notifications,
            transactions: newUser.transactions,
            usedDealsCount: newUser.usedDealsCount,
            viewCount: newUser.viewCount,
            usageCount: newUser.usageCount,
            plan: newUser.plan,
            deals: newUser.deals,
            image: newUser.image,
        };
        localStorage.setItem(`studeal_meta_${user.id}`, JSON.stringify(metaToSave));

        // Sync to Supabase via Server Action
        try {
            const updatePayload: any = { metadata: metaToSave };
            if (updated.fullName) updatePayload.full_name = updated.fullName;
            if (updated.image) updatePayload.image_url = updated.image;
            if (updated.categoryId) updatePayload.category_id = updated.categoryId;
            
            await updateCompanyProfile(user.id, updatePayload);
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

            if (event === 'SIGNED_OUT' || !session?.user) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            // Only fetch if we don't have a user or if this is a fresh sign in
            if (event === 'SIGNED_IN' || (!user && (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED'))) {
                try {
                    const profile = await fetchProfile(session.user.id);
                    if (mounted && profile) {
                        const meta = localStorage.getItem(`studeal_meta_${profile.id}`);
                        const parsedMeta = meta ? JSON.parse(meta) : defaultStudealMeta;
                        setUser(profileToUser(profile, parsedMeta));
                    }
                } catch (err) {
                    console.error("DEBUG: Profile fetch failed:", err);
                } finally {
                    if (mounted) setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [user === null]); // Only re-run if user becomes null

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ 
            email: email.trim().toLowerCase(), 
            password 
        });
        
        if (error) {
            setIsLoading(false);
            throw new Error(error.message);
        }

        if (data.user) {
            const profile = await fetchProfile(data.user.id);
            if (profile) {
                const meta = localStorage.getItem(`studeal_meta_${profile.id}`);
                const parsedMeta = meta ? JSON.parse(meta) : defaultStudealMeta;
                setUser(profileToUser(profile, parsedMeta));
            }
        }
        
        setIsLoading(false);
        return true;
    };

    const loginWithUser = (user: Partial<User> & { id: string }) => {
        const profile: ProfileRow = {
            id: user.id,
            email: user.email ?? null,
            full_name: user.name || user.fullName || user.email || '',
            role: user.role || 'Company',
        };
        setUser(profileToUser(profile, defaultStudealMeta));
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
        if (!user) return;
        const currentFavs = user.favorites ?? [];
        const newFavs = currentFavs.includes(dealId) ? currentFavs.filter((id) => id !== dealId) : [...currentFavs, dealId];
        saveStudealMeta({ favorites: newFavs });
    };

    const toggleCompanyFavorite = (companyId: number) => {
        if (!user) return;
        const currentFavs = user.companyFavorites ?? [];
        const newFavs = currentFavs.includes(companyId) ? currentFavs.filter((id) => id !== companyId) : [...currentFavs, companyId];
        saveStudealMeta({ companyFavorites: newFavs });
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
        if (!user) return;
        const newNotification: Notification = {
            ...notif,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
            isRead: false,
        };
        saveStudealMeta({ notifications: [newNotification, ...(user.notifications ?? [])] });
    };

    const addTransaction = (trans: Omit<Transaction, 'id' | 'date'>) => {
        if (!user) return;
        const newTransaction: Transaction = {
            ...trans,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
        };
        saveStudealMeta({ transactions: [newTransaction, ...(user.transactions ?? [])] });
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            // 1. Client-side sign out
            await supabase.auth.signOut();
            
            // 2. Server-side sign out (clears cookies)
            const { logoutAction } = await import('@/app/auth-actions');
            await logoutAction();
        } catch (e) {
            console.warn("Logout process warning:", e);
        } finally {
            // 3. Clear storage but PRESERVE language preference
            const lang = localStorage.getItem('studeal_lang');
            localStorage.clear();
            sessionStorage.clear();
            if (lang) localStorage.setItem('studeal_lang', lang);
            
            setUser(null);
            setIsLoading(false);
            
            // 4. Force hard redirect to clear all internal state
            window.location.href = "/";
        }
    };

    const loginWithGoogle = () => {
        supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
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
                authUrl: getSupabaseBrowserConfig().url,
                apiUrl: getSupabaseBrowserConfig().url,
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
