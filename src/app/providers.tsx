"use client";

import { AuthProvider as PackageAuthProvider } from "@zhmdff/auth-react";
import { AuthProvider as StudealAuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PackageAuthProvider
      authUrl={process.env.NEXT_PUBLIC_AUTH_URL || "http://127.0.0.1:5129/auth"}
      apiUrl={process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5129/api"}
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
