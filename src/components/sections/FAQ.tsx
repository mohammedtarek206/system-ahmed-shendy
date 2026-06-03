"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      q: "كيف يمكنني حجز درس؟",
      a: "يمكنك الحجز بسهولة من خلال الضغط على زر 'احجز الآن' وتعبئة بياناتك. سيتم إصدار رقم حجز خاص بك تلقائياً.",
    },
    {
      q: "أين يقع مكان الدروس؟",
      a: "سنتر الأباصيري، بجوار الرقابة الإدارية وبجوار ماركت الصعيدي.",
    },
    {
      q: "ما هو موعد تأكيد الحجز؟",
      a: "يكون تأكيد الحجز يوم 27 / 06 / 2026 من الساعة 3:00 مساءً حتى 6:00 مساءً في السنتر.",
    },
    {
      q: "هل الفيديوهات متوفرة على يوتيوب؟",
      a: "لا، جميع الفيديوهات الحصرية والشروحات يتم رفعها مباشرة على منصة العميد لضمان جودة المشاهدة وبدون إعلانات.",
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            الأسئلة الشائعة
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            كل ما تحتاج معرفته عن منصة العميد
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
              >
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  openIdx === idx ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIdx === idx ? "rotate-180" : ""}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
