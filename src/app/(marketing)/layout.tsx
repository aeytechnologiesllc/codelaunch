import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { AmbientBackground } from "@/components/AmbientBackground";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChat />
    </>
  );
}
