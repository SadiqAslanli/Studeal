import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ContactFloat from "@/components/ContactFloat";

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
