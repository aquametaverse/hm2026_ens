import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NAV_LINKS } from '../constants';
import { Menu, X, Waves } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ocean-gradient text-slate-100 font-sans selection:bg-aqua-500 selection:text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-lg bg-aqua-500/10 group-hover:bg-aqua-500/20 transition-colors">
                  <Waves className="h-6 w-6 text-aqua-400" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Aqua<span className="text-aqua-400">Metaverse</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white/10 text-aqua-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
              <div className="pl-4 border-l border-white/10">
                <ConnectButton 
                  accountStatus="address" 
                  chainStatus="icon"
                  showBalance={false}
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-950">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-aqua-500/10 text-aqua-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[25rem] h-[25rem] bg-teal-600/10 rounded-full blur-[80px]" />
      </div>
    </div>
  );
};
