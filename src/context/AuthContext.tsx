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
    plan?: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => boolean;
    register: (user: User) => void;
    updateUser: (updatedUser: Partial<User>) => void;
    logout: () => void;
    toggleFavorite: (dealId: number) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('loggedUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string, password: string) => {
        // Hardcoded System Admin
        if (email === 'admin@gmail.com' && password === 'admin123') {
            const adminUser: User = {
                name: 'System Admin',
                email: 'admin@gmail.com',
                isCompany: false,
                isAdmin: true
            };
            setUser(adminUser);
            localStorage.setItem('loggedUser', JSON.stringify(adminUser));
            return true;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && (!u.password || u.password === password));

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('loggedUser', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const register = (newUser: User) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userToSave = { ...newUser, points: 0 };
        users.push(userToSave);
        localStorage.setItem('users', JSON.stringify(users));
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

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loggedUser');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateUser, logout, toggleFavorite, addNotification, addTransaction }}>
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
