import {
  Hero,
  About,
  Testimonials,
  Contact,
  CTA,
  Programs,
} from "@/components/sections";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Programs />
      <Testimonials />
      <CTA />
      <Contact />
    </div>
  );
}
