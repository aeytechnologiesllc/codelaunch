import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { AmbientBackground } from "@/components/AmbientBackground";
import { BackgroundParticles } from "@/components/BackgroundParticles";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AmbientBackground />
      <BackgroundParticles />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChat />
    </>
  );
}
