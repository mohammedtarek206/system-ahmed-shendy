import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Schedules } from "@/components/sections/Schedules";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { BookingStatusMsg } from "@/components/ui/BookingStatusMsg";

// Ensure the homepage dynamically queries database at request time
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="pt-20"> {/* Offset for fixed navbar */}
        <BookingStatusMsg />
        <Hero />
        <About />
        <Schedules />
        <FAQ />
        <Contact />
      </div>
      <Footer />
    </>
  );
}
