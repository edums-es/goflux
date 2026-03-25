import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'n8nDash v2 — All Widgets Configurable (v3.1)',
  description: 'Next.js App Router Setup for GoFlux',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme-ocean`}>
        <div className="app" id="appRoot">
          <Sidebar />
          <Header />
          <main className="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
