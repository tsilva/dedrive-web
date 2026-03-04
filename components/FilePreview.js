'use client';

import { useState, useEffect } from 'react';
import { getPreview, getMimeIcon } from '@/lib/preview';
import PdfPreview from './PdfPreview';

export default function FilePreview({ file }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (preview.type === 'image') {
    return <img src={preview.url} alt={file.name} className="preview-image" />;
  }

  if (preview.type === 'pdf') {
    return <PdfPreview blob={preview.blob} />;
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
}
