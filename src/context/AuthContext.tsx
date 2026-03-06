"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export type User = {
    name: string;
    email: string;
    isCompany: boolean;
    isAdmin?: boolean;
    points?: number;
    university?: string;
    course?: string;
    phone?: string;
    favorites?: number[]; // Array of deal IDs
    notifications?: Notification[];
    transactions?: Transaction[];
    usedDealsCount?: number;
    viewCount?: number;
    usageCount?: number;
    plan?: string;
    isActive?: boolean;
    password?: string;
    deals?: any[];
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => boolean;
    loginWithUser: (user: User) => void;
    register: (user: User) => void;
    updateUser: (updatedUser: Partial<User>) => void;
    logout: () => void;
    toggleFavorite: (dealId: number) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    loginWithGoogle: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // <-- NEW: starts as loading
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('loggedUser');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            console.error('Failed to restore session', e);
        } finally {
            setIsLoading(false); // <-- session restore is done
        }
    }, []);

    const loginWithUser = (userToLogin: User) => {
        const sessionUser = { ...userToLogin };
        delete sessionUser.password;
        setUser(sessionUser);
        localStorage.setItem('loggedUser', JSON.stringify(sessionUser));
    };

    const login = (email: string, password: string) => {
        const inputEmail = String(email || "").trim().toLowerCase();
        const inputPass = String(password || "").trim();

        if (!inputEmail) return false;

        // Hardcoded System Admin
        if (inputEmail === 'admin@gmail.com' && inputPass === 'admin123') {
            const adminUser: User = {
                name: 'System Admin',
                email: 'admin@gmail.com',
                isCompany: false,
                isAdmin: true
            };
            loginWithUser(adminUser);
            return true;
        }

        try {
            const usersData = localStorage.getItem('users');
            let usersArr = JSON.parse(usersData || '[]');
            if (!Array.isArray(usersArr)) usersArr = [];

            const uniqueUsers = new Map();
            usersArr.forEach((u: any) => {
                if (u && u.email) uniqueUsers.set(String(u.email).trim().toLowerCase(), u);
            });
            const validUsers = Array.from(uniqueUsers.values());

            const foundUser = validUsers.find((u: any) => {
                const uEmail = String(u.email).trim().toLowerCase();
                const uPass = String(u.password || "").trim();
                return uEmail === inputEmail && uPass === inputPass;
            });

            if (foundUser) {
                if (foundUser.isActive === false) {
                    alert("Sizin hesabınız admin tərəfindən dondurulub!");
                    return false;
                }
                loginWithUser(foundUser);
                return true;
            }
        } catch (err) {
            console.error("Login process error:", err);
        }
        
        return false;
    };

    const register = (newUser: User) => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const normalizedEmail = String(newUser.email || "").trim().toLowerCase();
            const trimmedPass = String(newUser.password || "").trim();
            
            if (users.some((u: any) => u && u.email && String(u.email).trim().toLowerCase() === normalizedEmail)) {
                return;
            }

            const userToSave = {
                ...newUser,
                email: normalizedEmail,
                password: trimmedPass,
                points: newUser.points || 1240,
                usedDealsCount: newUser.usedDealsCount || 0,
                viewCount: newUser.viewCount || 0,
                usageCount: newUser.usageCount || 0,
                deals: newUser.deals || [],
                isActive: newUser.isActive !== undefined ? newUser.isActive : true,
                notifications: newUser.notifications || [],
                transactions: newUser.transactions || [],
                favorites: newUser.favorites || []
            };

            const updatedUsers = [...users, userToSave];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        } catch (err) {
            console.error("Register error:", err);
        }
    };

    const updateUser = (updatedFields: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updatedUser = { ...prev, ...updatedFields };
            localStorage.setItem('loggedUser', JSON.stringify(updatedUser));

            // Also update in the global users list
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex((u: any) => u.email === prev.email);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
            return updatedUser;
        });
    };

    const toggleFavorite = (dealId: number) => {
        setUser(prev => {
            if (!prev) return null;
            const currentFavs = prev.favorites || [];
            const isFav = currentFavs.includes(dealId);
            const newFavs = isFav
                ? currentFavs.filter(id => id !== dealId)
                : [...currentFavs, dealId];

            const updatedUser = { ...prev, favorites: newFavs };
            localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notif,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
            isRead: false
        };

        setUser(prev => {
            if (!prev) return null;
            const currentNotifs = prev.notifications || [];
            const updatedUser = { ...prev, notifications: [newNotification, ...currentNotifs] };
            localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const addTransaction = (trans: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...trans,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('az-AZ'),
        };

        setUser(prev => {
            if (!prev) return null;
            const currentTransactions = prev.transactions || [];
            const updatedUser = { ...prev, transactions: [newTransaction, ...currentTransactions] };
            localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const loginWithGoogle = async () => {
        // Simulating Google Auth process
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const googleUser: User = {
                    name: 'Google User',
                    email: 'user@google.com',
                    isCompany: false,
                    isAdmin: false,
                    points: 1240,
                    favorites: [],
                    notifications: [],
                    transactions: [],
                    usedDealsCount: 0,
                    viewCount: 0,
                    usageCount: 0
                };
                
                // Add to users list if not exists
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                if (!users.some((u: any) => u.email === googleUser.email)) {
                    users.push({ ...googleUser, password: 'google_oauth_dummy' });
                    localStorage.setItem('users', JSON.stringify(users));
                }
                
                loginWithUser(googleUser);
                resolve(true);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loggedUser');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            loginWithUser,
            register,
            updateUser,
            logout,
            toggleFavorite,
            addNotification,
            addTransaction,
            loginWithGoogle
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
