'use client';

import { formatSize } from '@/lib/utils';

export default function ScanScreen({ scanning, progress, stats, onReview }) {
  return (
    <div className="screen">
      <div className="setup-title" style={{ marginBottom: 24 }}>Scan</div>
      <div className="progress-container">
        <div
          className={`progress-bar${scanning ? ' indeterminate' : ''}`}
          style={{ width: scanning || stats ? '100%' : '0%' }}
        />
      </div>
      <div className="progress-label">
        {scanning
          ? `Scanning... Page ${progress.page} \u2022 ${progress.fileCount.toLocaleString()} files`
          : stats
            ? 'Scan complete'
            : 'Ready to scan'}
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">{stats.totalGroups.toLocaleString()}</div>
            <div className="stat-label">Duplicate groups</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.totalFiles.toLocaleString()}</div>
            <div className="stat-label">Duplicate files</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatSize(stats.totalWasted)}</div>
            <div className="stat-label">Potential savings</div>
          </div>
          {stats.uncertainCount > 0 && (
            <div className="stat stat-warning">
              <div className="stat-value">{stats.uncertainCount}</div>
              <div className="stat-label">Uncertain (size mismatch)</div>
            </div>
          )}
        </div>
      )}

      {stats && (
        <div className="section-gap">
          <button className="btn btn-primary" onClick={onReview}>
            Review Duplicates
          </button>
        </div>
      )}
    </div>
  );
}
