"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Share2, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-0 border-t-4 border-primary-600 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-900 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-600 rounded-full blur-3xl opacity-10 -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">منصة العميد</h3>
            <p className="text-slate-400 leading-relaxed">
              المنصة التعليمية الأولى المتخصصة في حجز دروس مادة الرياضيات للمرحلة الثانوية. نسعى لتقديم تجربة تعليمية فريدة ومبتكرة.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              <li><Link href="#hero" className="hover:text-primary-400 transition-colors">الرئيسية</Link></li>
              <li><Link href="#about" className="hover:text-primary-400 transition-colors">عن المستر</Link></li>
              <li><Link href="#schedules" className="hover:text-primary-400 transition-colors">مواعيد المجموعات</Link></li>
              <li><Link href="#faq" className="hover:text-primary-400 transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 shrink-0" />
                <span>سنتر الأباصيري، بجوار الرقابة الإدارية وماركت الصعيدي.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="tel:01228056212" dir="ltr" className="hover:text-primary-400 transition-colors">01228056212</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <span>support@alameed.com</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">احجز الآن</h4>
            <p className="text-slate-400 mb-4">
              لا تفوت فرصتك في الانضمام لأفضل مجموعات الرياضيات.
            </p>
            <Link href="/booking" className="inline-flex w-full items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors">
              الانتقال لصفحة الحجز
            </Link>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-slate-800 pt-6 pb-0 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 منصة العميد التعليمية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>

      {/* ═══ Developer Credit Strip ═══ */}
      <div className="mt-4 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-slate-950 to-primary-900/80"></div>
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>

        <div className="relative z-10 py-4 px-4">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">

            {/* Icon */}
            <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-primary-400" />
            </div>

            {/* Text group */}
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Powered & Developed By
              </span>
              <span className="hidden sm:block text-slate-600">·</span>
              <span className="text-base font-black text-white tracking-wide whitespace-nowrap">
                Mohammed Tarek Mohammed
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-5 w-px bg-slate-700"></div>

            {/* Phone */}
            <a
              href="tel:01284621015"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 hover:bg-primary-500/20 hover:border-primary-400/60 transition-all duration-200 group"
            >
              <span className="text-base">📞</span>
              <span dir="ltr" className="text-sm font-bold text-primary-300 group-hover:text-primary-200 transition-colors tracking-wide">
                01284621015
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
