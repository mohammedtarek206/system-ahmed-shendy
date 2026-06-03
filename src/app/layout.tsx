import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "منصة العميد التعليمية - الرياضيات",
  description: "منصة العميد التعليمية المتخصصة في حجز دروس مادة الرياضيات، منصة تعليمية احترافية لتنظيم المواعيد ومتابعة الطلاب.",
  keywords: ["رياضيات", "حجز دروس", "منصة تعليمية", "منصة العميد", "العميد", "تعليم", "ثانوية عامة", "إحصاء"],
  authors: [{ name: "منصة العميد" }],
  openGraph: {
    title: "منصة العميد التعليمية",
    description: "أفضل منصة لحجز ومتابعة دروس الرياضيات",
    url: "https://alameed-platform.com",
    siteName: "منصة العميد التعليمية",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} scroll-smooth antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-cairo flex flex-col transition-colors duration-300" suppressHydrationWarning>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
