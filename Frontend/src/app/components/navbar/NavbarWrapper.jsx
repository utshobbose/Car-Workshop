'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper({ textColor = 'text-white' }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) return null; // Don't render navbar on homepage

  return <Navbar textColor={textColor} />;
}