import { Rocket, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight">Code<span className="text-accent">Launch</span></span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              AI-powered software for growing businesses. Custom apps that make you money, not drain it.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Services</h4>
            <ul className="space-y-3">
              {["Web Applications", "Mobile Apps", "AI & Automation", "Integrations & Bots"].map((s) => (
                <li key={s}><Link href="/services" className="text-text-muted hover:text-text-primary transition-colors text-sm">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Our Work", href: "/work" },
                { label: "About Us", href: "/about" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.label}><Link href={l.href} className="text-text-muted hover:text-text-primary transition-colors text-sm">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-text-muted text-sm"><Mail className="w-4 h-4 text-accent" />hello@codelaunch.dev</li>
              <li className="flex items-center gap-2 text-text-muted text-sm"><Phone className="w-4 h-4 text-accent" />+1 (555) 123-4567</li>
              <li className="flex items-center gap-2 text-text-muted text-sm"><MapPin className="w-4 h-4 text-accent" />Remote-first, worldwide</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">&copy; {new Date().getFullYear()} CodeLaunch. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-text-muted hover:text-text-primary text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-text-muted hover:text-text-primary text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
