import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Services } from "@/components/Services";
import { Industries } from "@/components/Industries";
import { CaseStudies } from "@/components/CaseStudies";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { LeadMagnet } from "@/components/LeadMagnet";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <Services />
      <Industries />
      <CaseStudies />
      <Process />
      <Testimonials />
      <LeadMagnet />
      <CTA />
    </>
  );
}
