// app/layout.js
import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata = {
  title: 'Mock Analyzer',
  description: 'A DBMS Mini Project',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
