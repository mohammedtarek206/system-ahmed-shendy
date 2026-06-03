"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, PhoneCall } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary-900 to-primary-950 rounded-3xl overflow-hidden shadow-2xl relative">
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary-400 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-accent-400 rounded-full blur-[100px]"></div>
          </div>

          <div className="grid md:grid-cols-2 relative z-10">
            <div className="p-10 md:p-14 text-white flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">هل لديك أي استفسار؟</h2>
              <p className="text-primary-100 text-lg mb-10 leading-relaxed">
                فريق منصة العميد مستعد دائماً للرد على جميع استفساراتكم ومساعدتكم في أي وقت.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <PhoneCall className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm">اتصل بنا</p>
                    <p className="font-bold text-lg" dir="ltr">+20 123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm">واتساب</p>
                    <p className="font-bold text-lg" dir="ltr">+20 123 456 7890</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Mail className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm">البريد الإلكتروني</p>
                    <p className="font-bold text-lg">support@alameed.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 md:p-14 bg-white/5 backdrop-blur-md">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-primary-100 text-sm mb-2 font-medium">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label className="block text-primary-100 text-sm mb-2 font-medium">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <label className="block text-primary-100 text-sm mb-2 font-medium">الرسالة</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>
                <button className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl shadow-lg transition-colors">
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
