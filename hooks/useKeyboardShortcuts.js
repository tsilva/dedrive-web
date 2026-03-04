import { useEffect } from 'react';

export function useKeyboardShortcuts(active, handlers) {
  useEffect(() => {
    if (!active) return;

    function onKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        handlers.onLeft?.();
      } else if (e.key === 'ArrowRight') {
        handlers.onRight?.();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, handlers]);
}
