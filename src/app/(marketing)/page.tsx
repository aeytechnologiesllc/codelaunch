import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Services } from "@/components/Services";
import { Industries } from "@/components/Industries";
import { WhyUs } from "@/components/WhyUs";
import { TechBadges } from "@/components/TechBadges";
import { VideoProof } from "@/components/VideoProof";
import { Process } from "@/components/Process";
import { Guarantee } from "@/components/Guarantee";
import { Testimonials } from "@/components/Testimonials";
import { Scarcity } from "@/components/Scarcity";
import { FAQ } from "@/components/FAQ";
import { LeadMagnet } from "@/components/LeadMagnet";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <ProblemStatement />
      <Services />
      <Industries />
      <WhyUs />
      <TechBadges />
      <VideoProof />
      <Process />
      <Guarantee />
      <Scarcity />
      <Testimonials />
      <FAQ />
      <LeadMagnet />
      <CTA />
    </>
  );
}
