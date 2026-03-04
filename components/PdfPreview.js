'use client';

import { useRef, useEffect } from 'react';

export default function PdfPreview({ blob }) {
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
      const scale = Math.min(400 / viewport.width, 300 / viewport.height);
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
  }, [blob]);

  return <canvas ref={canvasRef} className="preview-pdf" />;
}
