"use client";

import { AuthProvider, User } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode, 
  initialUser?: User | null 
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
}
