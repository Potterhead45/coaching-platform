'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  Sparkles,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.refresh();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses & Chapters', href: '/courses' },
    { name: 'Mock Tests', href: '/tests' },
    { name: 'Results & Ranks', href: '/#results' },
    { name: 'Admissions', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#AFDDE5]/40 bg-white/95 backdrop-blur-md transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#003135] px-3 py-1.5 text-center text-xs font-medium text-[#AFDDE5] flex items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap border-b border-[#024950]">
        <span className="inline-flex items-center rounded-full bg-[#0FA4AF]/20 px-2 py-0.5 text-[#AFDDE5] font-semibold border border-[#0FA4AF]/40 text-[10px] sm:text-xs shrink-0">
          ✨ Academic Session 2026-27
        </span>
        <span className="hidden sm:inline text-[#AFDDE5]">All-India CBT Mock Test Series with Automated Error Explanations</span>
        <a href="tel:+919876543210" className="hidden md:inline-flex items-center gap-1 text-[#0FA4AF] hover:text-[#AFDDE5] ml-3 font-semibold shrink-0 transition-colors">
          <PhoneCall className="w-3 h-3 text-[#0FA4AF]" /> Helpline: +91 98765 43210
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#003135] to-[#024950] border border-[#0FA4AF]/30 flex items-center justify-center text-[#AFDDE5] shadow-md shadow-[#003135]/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-[#0FA4AF]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#003135] flex items-center gap-1.5">
                Apex Institute
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#AFDDE5]/40 text-[#024950] border border-[#0FA4AF]/20 uppercase tracking-wider">CBT</span>
              </span>
              <span className="block text-[11px] font-medium text-[#024950]/70 -mt-1">
                Examination & Academic Prep Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-[#003135] bg-[#AFDDE5]/30 font-bold border border-[#AFDDE5]'
                      : 'text-[#024950] hover:text-[#003135] hover:bg-[#AFDDE5]/15'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#964734]/10 text-[#964734] border border-[#964734]/30 hover:bg-[#964734]/20 transition-all hover:scale-[1.02]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#964734]" />
                    Admin Panel
                  </Link>
                ) : null}

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-[#024950] hover:bg-[#003135] text-white shadow-sm transition-all hover:scale-[1.02]"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#0FA4AF]" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#003135] leading-tight">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-[#024950]/70 uppercase tracking-wider">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-400 hover:text-[#964734] hover:bg-[#964734]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#024950] hover:text-[#003135] hover:bg-[#AFDDE5]/20 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-[#964734] hover:bg-[#833B2B] text-white shadow-md shadow-[#964734]/25 transition-all hover:scale-[1.03]"
                >
                  <span>Enroll Free</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#AFDDE5]" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#024950] hover:text-[#003135] hover:bg-[#AFDDE5]/20 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#024950]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer with Smooth Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-[#AFDDE5]/50 bg-white px-4 pt-2 pb-6 space-y-3 overflow-hidden shadow-lg"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-base font-medium text-[#024950] hover:bg-[#AFDDE5]/20 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              {user ? (
                <>
                  <div className="px-3.5 py-2.5 bg-[#AFDDE5]/20 rounded-xl">
                    <p className="text-sm font-bold text-[#003135]">{user.name}</p>
                    <p className="text-xs text-[#024950]/80">{user.email}</p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[#964734]/15 text-[#964734]"
                    >
                      Admin Control Center
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[#024950] text-white shadow-sm"
                  >
                    Student Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-[#964734] hover:bg-[#964734]/10 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#AFDDE5] text-[#024950] hover:bg-[#AFDDE5]/20 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[#964734] text-white hover:bg-[#833B2B] transition-colors shadow-sm"
                  >
                    Enroll Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
