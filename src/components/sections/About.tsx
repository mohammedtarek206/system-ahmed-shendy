"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, Users, Award, Play } from "lucide-react";
import Image from "next/image";

export function About() {
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "+5000", label: "طالب متفوق" },
    { icon: <BookOpen className="w-6 h-6" />, value: "+100", label: "محاضرة مسجلة" },
    { icon: <Award className="w-6 h-6" />, value: "100%", label: "نسبة النجاح" },
    { icon: <Target className="w-6 h-6" />, value: "+15", label: "سنة خبرة" },
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            من هو <span className="text-primary-600">أحمد العميد</span>؟
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            مدرس أول لمادة الرياضيات للمرحلة الثانوية. يمتلك خبرة طويلة في تبسيط المناهج المعقدة، وتقديم المعلومة بطرق مبتكرة تناسب كافة مستويات الطلاب، مما يجعله الخيار الأول لآلاف الطلاب كل عام.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Video Introduction Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">الفيديو التعريفي</h3>
            <p className="text-slate-500 dark:text-slate-400">شاهد الفيديو للتعرف على أسلوب الشرح ومنهج العمل</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800"
          >
            {isPlaying ? (
              <video 
                src="/intro-video.mp4" 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            ) : (
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                {/* Poster Background */}
                <Image 
                  src="/teacher-photo.jpg" 
                  alt="الفيديو التعريفي"
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/95 dark:bg-primary-600/95 text-primary-600 dark:text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>

                <p className="absolute bottom-6 left-6 right-6 text-center text-white font-bold text-lg drop-shadow-md">
                  شاهد الفيديو التعريفي بالمستر أحمد العميد
                </p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
