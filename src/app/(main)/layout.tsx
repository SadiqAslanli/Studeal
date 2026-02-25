import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/app/page.module.css";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main style={{ minHeight: '60vh' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
