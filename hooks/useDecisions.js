import { useState, useCallback } from 'react';
import { getDecisions, setDecision as persistDecision } from '@/lib/state';

export function useDecisions() {
  const [decisions, setDecisions] = useState(() => getDecisions());

  const setDecision = useCallback((md5, decision) => {
    persistDecision(md5, decision);
    setDecisions(getDecisions());
  }, []);

  const reload = useCallback(() => {
    setDecisions(getDecisions());
  }, []);

  return [decisions, setDecision, reload];
}
