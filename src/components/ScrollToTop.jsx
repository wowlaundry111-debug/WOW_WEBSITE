import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that whenever the URL route changes,
 * the window scroll position is reset to the top without forcing a layout reflow on initial mount.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
