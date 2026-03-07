"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as usePackageAuth, User as PackageUser } from "@zhmdff/auth-react";

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

// Merged User type
export type User = PackageUser & {
    name: string; // Map from fullName or username
    isCompany: boolean;
    isAdmin: boolean;
    points: number;
    university?: string;
    course?: string;
    phone?: string;
    favorites: number[];
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
    loginWithUser: (user: any) => void;
    register: (userData: any) => Promise<boolean>;
    updateUser: (updatedUser: Partial<User>) => void;
    logout: () => void;
    toggleFavorite: (dealId: number) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    loginWithGoogle: () => void;
    authUrl: string;
    apiUrl: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { 
        user: packageUser, 
        isLoading: packageLoading, 
        logout: packageLogout, 
        loginWithGoogle: packageGoogleLogin,
        setAccessToken,
        setUser: setPackageUser
    } = usePackageAuth();
    
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://127.0.0.1:5129/auth";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5129/api";
    const [studealData, setStudealData] = useState<Partial<User>>({});
    const router = useRouter();

    // Load extra data from localStorage when package user changes
    useEffect(() => {
        if (packageUser) {
            const savedData = localStorage.getItem(`studeal_meta_${packageUser.id}`);
            if (savedData) {
                setStudealData(JSON.parse(savedData));
            } else {
                // Initialize default meta for new backend user
                const defaultMeta = {
                    points: 0,
                    favorites: [],
                    notifications: [],
                    transactions: [],
                    usedDealsCount: 0,
                    viewCount: 0,
                    usageCount: 0,
                    plan: 'bronze',
                    deals: []
                };
                setStudealData(defaultMeta);
                localStorage.setItem(`studeal_meta_${packageUser.id}`, JSON.stringify(defaultMeta));
            }
        } else {
            setStudealData({});
        }
    }, [packageUser]);

    // Computed user object
    const mergedUser = useMemo(() => {
        if (!packageUser) return null;

        return {
            ...packageUser,
            ...studealData,
            name: packageUser.fullName || packageUser.username || packageUser.email || "User",
            isAdmin: (packageUser.roles || []).some(r => r === 'Admin' || r === 'SuperAdmin') || packageUser.role === 'Admin' || packageUser.role === 'SuperAdmin',
            isCompany: (packageUser.roles || []).includes('Company') || packageUser.role === 'Company' || !!packageUser.username?.includes('rest'),
            // Ensure defaults
            points: studealData.points ?? 0,
            favorites: studealData.favorites ?? [],
            notifications: studealData.notifications ?? [],
            transactions: studealData.transactions ?? [],
            usedDealsCount: studealData.usedDealsCount ?? 0,
            viewCount: studealData.viewCount ?? 0,
            usageCount: studealData.usageCount ?? 0,
            plan: studealData.plan ?? 'bronze',
        } as User;
    }, [packageUser, studealData]);

    const saveStudealMeta = (updated: Partial<User>) => {
        if (!packageUser) return;
        const newData = { ...studealData, ...updated };
        setStudealData(newData);
        localStorage.setItem(`studeal_meta_${packageUser.id}`, JSON.stringify(newData));
    };

    const login = async (identifier: string, password: string) => {
        try {
            const res = await fetch(`${authUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ 
                    identifier: identifier, 
                    password: password 
                }),
            });

            const json = await res.json().catch(() => ({}));
            
            if (!res.ok) {
                console.error("Backend Error Response:", json);
                const errorMessage = json.errorMessage || json.message || (json.errors ? Object.values(json.errors).flat().join(", ") : "Login failed");
                throw new Error(errorMessage);
            }

            if (json.success && json.accessToken && json.user) {
                setAccessToken(json.accessToken);
                // Ensure roles are present in the user object even if they came from the top level
                const userWithRoles = {
                    ...json.user,
                    roles: (json.user.roles && json.user.roles.length > 0) ? json.user.roles : (json.roles || [])
                };
                setPackageUser(userWithRoles);
                return true;
            }
            throw new Error(json.errorMessage || "Login failed");
        } catch (err: any) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    const register = async (formData: any) => {
        try {
            const res = await fetch(`${authUrl}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    identifier: formData.email,
                    password: formData.password,
                    fullName: formData.name,
                    role: formData.isCompany ? "Company" : "Student"
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                // Check for validation errors array
                const validationErrors = errorData.errors ? Object.values(errorData.errors).flat().join(", ") : null;
                throw new Error(validationErrors || errorData.errorMessage || errorData.message || "Registration failed");
            }

            const json = await res.json();
            if (!json.success) {
                throw new Error(json.errorMessage || "Registration failed");
            }
            return true;
        } catch (err: any) {
            console.error("Registration failed:", err);
            throw err;
        }
    };

    const updateUser = (updatedFields: Partial<User>) => {
        saveStudealMeta(updatedFields);
    };

    const toggleFavorite = (dealId: number) => {
        const currentFavs = studealData.favorites || [];
        const isFav = currentFavs.includes(dealId);
        const newFavs = isFav
            ? currentFavs.filter(id => id !== dealId)
            : [...currentFavs, dealId];
        
        saveStudealMeta({ favorites: newFavs });
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notif,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
            isRead: false
        };
        const currentNotifs = studealData.notifications || [];
        saveStudealMeta({ notifications: [newNotification, ...currentNotifs] });
    };

    const addTransaction = (trans: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...trans,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
        };
        const currentTransactions = studealData.transactions || [];
        saveStudealMeta({ transactions: [newTransaction, ...currentTransactions] });
    };

    const loginWithUser = (userToLogin: any) => {
        setPackageUser(userToLogin);
    };

    const logout = () => {
        packageLogout();
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user: mergedUser,
            isLoading: packageLoading,
            login,
            loginWithUser,
            register,
            updateUser,
            logout,
            toggleFavorite,
            addNotification,
            addTransaction,
            loginWithGoogle: () => packageGoogleLogin(window.location.origin),
            authUrl,
            apiUrl
        }}>
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
