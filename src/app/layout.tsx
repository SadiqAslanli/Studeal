import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ContactFloat from "@/components/ContactFloat";

const materialSymbols = (
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
);

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StuDeal - Tələbə Endirimləri Platforması",
  description: "Tələbələr üçün ən eksklüziv endirimlər və imkanlar platforması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <ContactFloat />
            <Header />
            <main style={{ minHeight: '60vh' }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
