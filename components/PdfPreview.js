'use client';

import { useRef, useEffect } from 'react';

export default function PdfPreview({ blob, fullscreen = false, zoom = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const arrayBuffer = await blob.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      
      // Use larger dimensions for fullscreen, apply zoom
      const baseMaxWidth = fullscreen ? 1200 : 600;
      const baseMaxHeight = fullscreen ? 800 : 400;
      const maxWidth = baseMaxWidth * zoom;
      const maxHeight = baseMaxHeight * zoom;
      const scale = Math.min(maxWidth / viewport.width, maxHeight / viewport.height);
      const scaledViewport = page.getViewport({ scale });

      if (cancelled || !canvasRef.current) return;

      const canvas = canvasRef.current;
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: scaledViewport,
      }).promise;
    }

    render().catch(console.error);
    return () => { cancelled = true; };
  }, [blob, fullscreen, zoom]);

  return <canvas ref={canvasRef} className="preview-pdf" />;
}
