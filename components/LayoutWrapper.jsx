'use client';

import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
