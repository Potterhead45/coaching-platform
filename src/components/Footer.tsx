import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Apex Institute <span className="text-amber-400 text-sm font-semibold uppercase">Edu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering students to achieve AIR top ranks in competitive examinations through scientific test series, chapter diagnostics, performance analytics, and expert faculty solutions.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Award className="w-4 h-4 text-amber-400" /> ISO 9001 Certified
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Institute
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Exams & Tests</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tests" className="hover:text-white transition-colors">All Mock Tests</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">JEE Advanced Prep</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">NEET-UG Test Series</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">Class 12 Boards Sprint</Link>
              </li>
            </ul>
          </div>

          {/* Student Portal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Student Portal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">My Progress & Stats</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Student Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Create Free Account</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin Management</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Head Office</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>42 Knowledge Park, Sector 62, Noida, NCR, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:contact@apexcoaching.com" className="hover:text-white">contact@apexcoaching.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Apex Academy. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/#terms" className="hover:underline">Terms of Service</Link>
            <Link href="/#privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/#refund" className="hover:underline">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
