import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#003135] text-[#AFDDE5] border-t border-[#024950]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#024950] border border-[#0FA4AF]/30 flex items-center justify-center text-[#AFDDE5] shadow-lg">
                <GraduationCap className="w-6 h-6 text-[#0FA4AF]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Apex Institute <span className="text-[#0FA4AF] text-sm font-semibold uppercase">CBT</span>
              </span>
            </div>
            <p className="text-sm text-[#AFDDE5]/80 leading-relaxed max-w-sm">
              Empowering students to achieve All-India top ranks through scientific mock testing, chapter diagnostics, performance analytics, and step-by-step conceptual solutions.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#AFDDE5] pt-2">
              <span className="flex items-center gap-1.5 bg-[#024950] px-3 py-1.5 rounded-lg border border-[#0FA4AF]/20">
                <Award className="w-4 h-4 text-[#0FA4AF]" /> ISO 9001 Certified
              </span>
              <span className="flex items-center gap-1.5 bg-[#024950] px-3 py-1.5 rounded-lg border border-[#0FA4AF]/20">
                <ShieldCheck className="w-4 h-4 text-[#AFDDE5]" /> Verified Institute
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Exams & Tests</h3>
            <ul className="space-y-2 text-sm text-[#AFDDE5]/80">
              <li>
                <Link href="/tests" className="hover:text-white hover:text-[#0FA4AF] transition-colors">All Mock Tests</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#0FA4AF] transition-colors">JEE Advanced Prep</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#0FA4AF] transition-colors">NEET-UG Test Series</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#0FA4AF] transition-colors">Class 12 Boards Sprint</Link>
              </li>
            </ul>
          </div>

          {/* Student Portal */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Student Portal</h3>
            <ul className="space-y-2 text-sm text-[#AFDDE5]/80">
              <li>
                <Link href="/dashboard" className="hover:text-[#0FA4AF] transition-colors">My Progress & Stats</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#0FA4AF] transition-colors">Student Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#0FA4AF] transition-colors">Create Free Account</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#0FA4AF] transition-colors">Admin Faculty Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Head Office</h3>
            <ul className="space-y-2.5 text-xs text-[#AFDDE5]/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0FA4AF] shrink-0 mt-0.5" />
                <span>Sector 62, Institutional Area, Knowledge Park, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0FA4AF] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0FA4AF] shrink-0" />
                <span>admissions@apexcoaching.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#024950] flex flex-col sm:flex-row items-center justify-between text-xs text-[#AFDDE5]/60 gap-4">
          <p>© {new Date().getFullYear()} Apex Institute of Academic Excellence. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#0FA4AF]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#0FA4AF]">Terms of Examination</Link>
            <Link href="#" className="hover:text-[#0FA4AF]">Student Code of Conduct</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
