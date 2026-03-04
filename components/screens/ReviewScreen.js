'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { formatSize, formatDate } from '@/lib/utils';
import { exportDecisions, importDecisions } from '@/lib/state';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import FilePreview from '@/components/FilePreview';

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'decided', label: 'Decided' },
  { id: 'skipped', label: 'Skipped' },
  { id: 'all', label: 'All' },
];

export default function ReviewScreen({ dupGroups, decisions, onDecision, onExecute, onDecisionsImported }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('pending');
  const importRef = useRef(null);

  const counts = useMemo(() => {
    let pending = 0, decided = 0, skipped = 0;
    for (const g of dupGroups) {
      const d = decisions[g.md5];
      if (!d) pending++;
      else if (d.action === 'keep') decided++;
      else if (d.action === 'skip') skipped++;
    }
    return { pending, decided, skipped, all: dupGroups.length };
  }, [dupGroups, decisions]);

  const filtered = useMemo(() => {
    if (filter === 'all') return dupGroups;
    return dupGroups.filter((g) => {
      const d = decisions[g.md5];
      if (filter === 'pending') return !d;
      if (filter === 'decided') return d && d.action === 'keep';
      if (filter === 'skipped') return d && d.action === 'skip';
      return true;
    });
  }, [dupGroups, decisions, filter]);

  const safeIndex = Math.max(0, Math.min(currentIndex, filtered.length - 1));
  const group = filtered[safeIndex];
  const decision = group ? decisions[group.md5] : null;

  const handleKeepByIndex = useCallback((fileIndex) => {
    if (!group || fileIndex >= group.files.length) return;
    const file = group.files[fileIndex];
    onDecision(group.md5, { keep: file.id, action: 'keep' });
  }, [group, onDecision]);

  const handleSkip = useCallback(() => {
    if (!group) return;
    onDecision(group.md5, { action: 'skip' });
  }, [group, onDecision]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(filtered.length - 1, i + 1));
  }, [filtered.length]);

  useKeyboardShortcuts(true, {
    onPrev: handlePrev,
    onNext: handleNext,
    onKeep: handleKeepByIndex,
    onSkip: handleSkip,
  });

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setCurrentIndex(0);
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    await importDecisions(file);
    onDecisionsImported?.();
    e.target.value = '';
  }

  return (
    <div className="screen">
      <div className="review-toolbar">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`filter-btn${filter === f.id ? ' active' : ''}`}
              onClick={() => handleFilterChange(f.id)}
            >
              {f.label} <span>{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div className="review-nav">
          <button className="btn" onClick={handlePrev}>&larr;</button>
          <span className="review-nav-label">
            {filtered.length > 0 ? `${safeIndex + 1} / ${filtered.length}` : '0 / 0'}
          </span>
          <button className="btn" onClick={handleNext}>&rarr;</button>
        </div>
      </div>

      <div>
        {!group ? (
          <div className="empty-state">
            {dupGroups.length === 0
              ? 'Run a scan first to review duplicates'
              : 'No groups in this filter'}
          </div>
        ) : (
          <>
            <div className="group-header">
              <div className="group-md5">MD5: {group.md5.slice(0, 12)}...</div>
              <div className="group-info">
                {group.files.length} files &bull; {formatSize(group.wastedSize)} wasted
              </div>
              {group.uncertain && (
                <div className="group-warning">Size mismatch - review carefully</div>
              )}
            </div>
            <div className="files-grid">
              {group.files.map((f, i) => (
                <div
                  key={f.id}
                  className={`file-card${decision?.keep === f.id ? ' file-keep' : ''}`}
                  data-index={i}
                >
                  <div className="file-preview">
                    <FilePreview file={f} />
                  </div>
                  <div className="file-meta">
                    <div className="file-name" title={f.path || f.name}>{f.name}</div>
                    <div className="file-path">{f.path || '/'}</div>
                    <div className="file-details">
                      <span>{formatSize(parseInt(f.size) || 0)}</span>
                      <span>{formatDate(f.modifiedTime)}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button
                      className={`btn btn-keep${decision?.keep === f.id ? ' active' : ''}`}
                      onClick={() => onDecision(group.md5, { keep: f.id, action: 'keep' })}
                    >
                      Keep
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="group-actions">
              <button
                className={`btn btn-skip${decision?.action === 'skip' ? ' active' : ''}`}
                onClick={handleSkip}
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>

      <div className="shortcuts">
        <span><kbd>&larr;</kbd> <kbd>&rarr;</kbd> navigate</span>
        <span><kbd>1</kbd> <kbd>2</kbd> keep file</span>
        <span><kbd>S</kbd> skip</span>
      </div>
      <div className="section-gap" style={{ textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={onExecute}>Execute Moves</button>
        {' '}
        <button className="btn" onClick={exportDecisions}>Export Decisions</button>
        {' '}
        <button className="btn" onClick={() => importRef.current?.click()}>Import Decisions</button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
    </div>
  );
}
