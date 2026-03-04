import './globals.css';

export const metadata = {
  title: 'Dedrive — Google Drive Duplicate Manager',
  description: 'Find and manage duplicate files in your Google Drive. Runs entirely in your browser.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
