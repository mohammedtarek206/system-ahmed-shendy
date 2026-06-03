"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, BookOpen, User, Calendar, HelpCircle, Phone } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#hero", icon: <BookOpen className="w-5 h-5" /> },
    { name: "عن المستر", href: "#about", icon: <User className="w-5 h-5" /> },
    { name: "المواعيد", href: "#schedules", icon: <Calendar className="w-5 h-5" /> },
    { name: "الأسئلة الشائعة", href: "#faq", icon: <HelpCircle className="w-5 h-5" /> },
    { name: "تواصل معنا", href: "#contact", icon: <Phone className="w-5 h-5" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-500 shadow-md transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="منصة العميد" fill className="object-cover" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-500">
              منصة العميد
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <Link
              href="/booking"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              احجز الآن
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-slate-800 dark:text-slate-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-2xl border-t dark:border-slate-800 lg:hidden"
        >
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-bold rounded-xl shadow-lg text-center text-lg"
            >
              احجز الآن
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
