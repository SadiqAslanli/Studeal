"use client";

import { AuthProvider as PackageAuthProvider } from "@zhmdff/auth-react";
import { AuthProvider as StudealAuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PackageAuthProvider
      authUrl={process.env.NEXT_PUBLIC_AUTH_URL || "https://localhost:7187/auth"}
      apiUrl={process.env.NEXT_PUBLIC_API_URL || "https://localhost:7187/api"}
      loginPath="/login"
    >
      <StudealAuthProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </StudealAuthProvider>
    </PackageAuthProvider>
  );
}
