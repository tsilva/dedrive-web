import { useEffect } from 'react';

export function useKeyboardShortcuts(active, handlers) {
  useEffect(() => {
    if (!active) return;

    function onKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' || e.key === 'h') {
        handlers.onPrev?.();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        handlers.onNext?.();
      } else if (e.key === '1') {
        handlers.onKeep?.(0);
      } else if (e.key === '2') {
        handlers.onKeep?.(1);
      } else if (e.key === 's') {
        handlers.onSkip?.();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, handlers]);
}
