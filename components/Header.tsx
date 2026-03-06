'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Report Guide', href: '/report-guide' },
    { label: 'Policy', href: '/policy' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          🫡
          <span className="hidden sm:inline">ConfideU</span>
        </Link>
        {/* Right Section */}
        <div className="flex items-center gap-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors text-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        
          {/* Other right items */}
          <button className="p-2 text-foreground/70 hover:text-foreground transition-colors">
            <Globe className="w-5 h-5" />
          </button>
        
          <Link href="/login">
            <Button variant="outline" className="hidden sm:inline-flex bg-transparent text-base">
              Login
            </Button>
          </Link>
        
          <Link href="/contact">
            <Button className="hidden sm:inline-flex text-base">
              Book a Call
            </Button>
          </Link>
        
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted rounded transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Login
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button size="sm" className="w-full">
                  Book a Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      </nav>
    </header>
  );
}