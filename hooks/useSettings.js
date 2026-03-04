import { useState, useCallback } from 'react';
import { getSettings, saveSettings } from '@/lib/state';

export function useSettings() {
  const [settings, setSettings] = useState(() => getSettings());

  const updateSettings = useCallback((partial) => {
    saveSettings(partial);
    setSettings(getSettings());
  }, []);

  return [settings, updateSettings];
}
