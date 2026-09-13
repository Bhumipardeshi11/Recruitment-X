import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jankoti ATS Checker',
  description: 'AI-Powered Resume Analyzer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="jankoti-light">
      <body>{children}</body>
    </html>
  );
}