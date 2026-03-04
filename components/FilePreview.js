'use client';

import { useState, useEffect } from 'react';
import { getPreview, getMimeIcon } from '@/lib/preview';
import PdfPreview from './PdfPreview';

export default function FilePreview({ file }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getPreview(file)
      .then((result) => {
        if (!cancelled) {
          setPreview(result);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [file.id]);

  // Close fullscreen on escape key and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  if (loading) {
    return <div className="preview-loading">Loading preview...</div>;
  }

  if (error) {
    return <div className="preview-error">Preview failed: {error}</div>;
  }

  if (!preview || preview.type === 'none') {
    return (
      <div className="preview-none">
        <div className="preview-icon">{getMimeIcon(file.mimeType)}</div>
        <div className="preview-label">No preview available</div>
        <a
          href={`https://drive.google.com/file/d/${file.id}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="preview-open"
        >
          Open in Drive
        </a>
      </div>
    );
  }

  const renderPreviewContent = (fullscreen = false) => {
    if (preview.type === 'image') {
      return <img src={preview.url} alt={file.name} className="preview-image" />;
    }

    if (preview.type === 'pdf') {
      return <PdfPreview blob={preview.blob} fullscreen={fullscreen} />;
    }

    if (preview.type === 'text') {
      return (
        <pre className="preview-text">
          <code>
            {preview.content}
            {preview.truncated && '\n\n... (truncated)'}
          </code>
        </pre>
      );
    }

    return null;
  };

  return (
    <>
      <div className="file-preview-container" style={{ width: '100%', height: '100%' }}>
        {renderPreviewContent(false)}
        <button
          className="preview-fullscreen-btn"
          onClick={() => setIsFullscreen(true)}
          title="View fullscreen"
        >
          ⛶ Fullscreen
        </button>
      </div>

      {isFullscreen && (
        <div className="fullscreen-modal-overlay" onClick={() => setIsFullscreen(false)}>
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-modal-header">
              <div className="fullscreen-modal-title">{file.path || file.name}</div>
              <button
                className="fullscreen-modal-close"
                onClick={() => setIsFullscreen(false)}
                title="Close (Esc)"
              >
                ×
              </button>
            </div>
            <div className="fullscreen-modal-body">
              {renderPreviewContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
