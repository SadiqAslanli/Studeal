"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
    useEffect(() => {
        // Force scroll to top on refresh
        window.scrollTo(0, 0);

        // Disable browser scroll restoration if possible
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    return null;
}
