'use client';

import { useState, useCallback, useEffect } from 'react';
import Script from 'next/script';
import Header from './Header';
import SetupScreen from './screens/SetupScreen';
import AccountScreen from './screens/AccountScreen';
import ScanScreen from './screens/ScanScreen';
import ReviewScreen from './screens/ReviewScreen';
import ExecuteScreen from './screens/ExecuteScreen';
import { useSettings } from '@/hooks/useSettings';
import { useDecisions } from '@/hooks/useDecisions';
import { useScanResults } from '@/hooks/useScanResults';
import { initAuth, signIn, signOut, setAuthCallback } from '@/lib/auth';
import { getUserInfo, fetchAllFiles } from '@/lib/drive';
import { findDuplicates, resolvePaths, computeStats } from '@/lib/dedup';
import { clearPreviewCache } from '@/lib/preview';

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ page: 0, fileCount: 0 });
  const [scanError, setScanError] = useState(null);
  const [settings, updateSettings] = useSettings();
  const [decisions, setDecision, reloadDecisions] = useDecisions();
  const { dupGroups, loaded, save } = useScanResults();

  const stats = dupGroups.length > 0 ? computeStats(dupGroups) : null;

  // Auth callback
  useEffect(() => {
    setAuthCallback(async (signedIn) => {
      if (signedIn) {
        try {
          const u = await getUserInfo();
          setUser(u);
          setScreen('account');
        } catch (e) {
          console.error('Failed to get user info:', e);
        }
      } else {
        setUser(null);
        setScreen('setup');
      }
    });
  }, []);

  // Auto-init auth when GSI loads and client ID exists
  useEffect(() => {
    if (gsiLoaded && settings.clientId) {
      try {
        initAuth(settings.clientId);
        setScreen('account');
      } catch (e) {
        console.error('Auth init failed:', e);
      }
    }
  }, [gsiLoaded, settings.clientId]);

  const handleGsiLoad = useCallback(() => {
    setGsiLoaded(true);
  }, []);

  const handleSaveClientId = useCallback((clientId) => {
    updateSettings({ clientId });
    if (gsiLoaded) {
      try {
        initAuth(clientId);
        setScreen('account');
      } catch (e) {
        console.error('Auth init failed:', e);
      }
    }
  }, [gsiLoaded, updateSettings]);

  const handleSignIn = useCallback(() => {
    signIn();
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
    clearPreviewCache();
    setUser(null);
    setScreen('setup');
  }, []);

  const handleStartScan = useCallback(async () => {
    setScreen('scan');
    setScanning(true);
    setScanError(null);
    setScanProgress({ page: 0, fileCount: 0 });

    try {
      const allFiles = await fetchAllFiles(({ page, fileCount }) => {
        setScanProgress({ page, fileCount });
      });

      resolvePaths(allFiles);
      const groups = findDuplicates(allFiles);
      await save(allFiles, groups);
      setScanning(false);
    } catch (e) {
      setScanError(e.message);
      setScanning(false);
      console.error('Scan failed:', e);
    }
  }, [save]);

  const handleReview = useCallback(() => {
    if (dupGroups.length > 0) setScreen('review');
  }, [dupGroups]);

  const handleExecute = useCallback(() => {
    setScreen('execute');
  }, []);

  return (
    <div className="app">
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={handleGsiLoad}
        strategy="afterInteractive"
      />
      <Header screen={screen} onNavigate={setScreen} />
      <div className="main">
        {screen === 'setup' && (
          <SetupScreen clientId={settings.clientId} onSave={handleSaveClientId} />
        )}
        {screen === 'account' && (
          <AccountScreen
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onStartScan={handleStartScan}
          />
        )}
        {screen === 'scan' && (
          <ScanScreen
            scanning={scanning}
            progress={scanProgress}
            stats={stats}
            error={scanError}
            onReview={handleReview}
          />
        )}
        {screen === 'review' && (
          <ReviewScreen
            dupGroups={dupGroups}
            decisions={decisions}
            onDecision={setDecision}
            onExecute={handleExecute}
            onDecisionsImported={reloadDecisions}
          />
        )}
        {screen === 'execute' && (
          <ExecuteScreen dupGroups={dupGroups} decisions={decisions} />
        )}
      </div>
    </div>
  );
}
