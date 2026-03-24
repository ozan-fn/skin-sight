import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Utility component that resets the window scroll position to the top
 * whenever the route (pathname) changes.
 */
export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
