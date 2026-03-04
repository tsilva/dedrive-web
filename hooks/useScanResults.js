import { useState, useEffect, useCallback } from 'react';
import { saveScanResults, loadScanResults } from '@/lib/state';

export function useScanResults() {
  const [allFiles, setAllFiles] = useState([]);
  const [dupGroups, setDupGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadScanResults().then((saved) => {
      if (saved) {
        setAllFiles(saved.files || []);
        setDupGroups(saved.groups || []);
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback(async (files, groups) => {
    setAllFiles(files);
    setDupGroups(groups);
    await saveScanResults({ files, groups });
  }, []);

  return { allFiles, dupGroups, loaded, save };
}
