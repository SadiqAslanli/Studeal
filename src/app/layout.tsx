import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StuDeal - Tələbə Endirimləri Platforması",
  description: "Tələbələr üçün ən eksklüziv endirimlər və imkanlar platforması.",
};

import { getServerProfile } from "@/lib/auth-utils";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getServerProfile();
  
  // Minimal conversion to User type for the provider
  const initialUser = profile ? {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    name: profile.full_name || profile.email || 'User',
    role: profile.role || 'Student',
    isCompany: profile.role === 'Company',
    isAdmin: profile.role === 'Admin' || profile.role === 'SuperAdmin',
    points: profile.metadata?.points ?? 0,
    favorites: profile.metadata?.favorites ?? [],
    companyFavorites: profile.metadata?.companyFavorites ?? [],
    notifications: profile.metadata?.notifications ?? [],
    transactions: profile.metadata?.transactions ?? [],
    usedDealsCount: profile.metadata?.usedDealsCount ?? 0,
    viewCount: profile.metadata?.viewCount ?? 0,
    usageCount: profile.metadata?.usageCount ?? 0,
    plan: profile.metadata?.plan ?? 'bronze',
    image: profile.image_url || profile.metadata?.image || '',
  } : null;

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className={inter.className}>
        <Providers initialUser={initialUser as any}>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
