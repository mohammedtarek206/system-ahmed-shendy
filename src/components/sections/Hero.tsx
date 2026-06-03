"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export function Hero() {
  const features = [
    "شرح مبسط واحترافي",
    "متابعة دورية للطلاب",
    "امتحانات وتقييم مستمر",
  ];

  return (
    <section id="hero" className="relative pt-20 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50 to-transparent dark:from-primary-950/30 -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/50 dark:bg-primary-900/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
              </span>
              المنصة الأولى لتعلم الرياضيات
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
              أتقن الرياضيات مع <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                منصة العميد
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              نقدم لك أفضل تجربة تعليمية حديثة مع شرح مبسط، اختبارات دورية، ومتابعة مستمرة لضمان تفوقك في مادة الرياضيات.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-600/30 transition-all transform hover:-translate-y-1 text-lg"
              >
                احجز مقعدك الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <a 
                href="#schedules"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-lg"
              >
                مواعيد المجموعات
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 mt-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            <div className="relative w-full max-w-lg mx-auto aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800">
              <Image 
                src="/teacher-photo.jpg" 
                alt="مستر الرياضيات" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-1">أ. أحمد العميد</h3>
                <p className="text-white/80 font-medium">خبير تدريس الرياضيات</p>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 md:top-10 md:-right-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100 dark:border-slate-700"
            >
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold text-xl">
                +15
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">خبرة أكثر من</p>
                <p className="font-bold text-slate-900 dark:text-white">15 عاماً</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
