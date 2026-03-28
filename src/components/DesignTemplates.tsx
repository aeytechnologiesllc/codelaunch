"use client";

/* ════════════════════════════════════════════════
   WEB TEMPLATES
   ════════════════════════════════════════════════ */

export function WebRestaurantWarm() {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden text-[10px] h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[9px] font-semibold text-orange-300">Bella Cucina</span>
        <div className="flex gap-3 text-[8px] text-white/40"><span>Menu</span><span>Order</span><span>Book</span></div>
      </div>
      <div className="bg-gradient-to-r from-orange-900/40 to-red-900/30 p-4 text-center">
        <div className="text-[11px] font-bold text-white/90">Order Fresh, Order Direct</div>
        <div className="text-[8px] text-white/50 mt-1">Zero commission. 100% flavor.</div>
        <div className="mt-2 px-3 py-1 bg-orange-500 rounded text-[8px] text-white inline-block font-semibold">Order Now</div>
      </div>
      <div className="p-3 space-y-2">
        {[{ name: "Margherita Pizza", price: "$14.99", color: "bg-red-400/20" }, { name: "Pasta Carbonara", price: "$16.99", color: "bg-yellow-400/20" }, { name: "Caesar Salad", price: "$11.99", color: "bg-green-400/20" }].map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2">
            <div className={`w-8 h-8 rounded-lg ${item.color} flex-shrink-0`} />
            <div className="flex-1"><div className="text-[9px] font-medium text-white/80">{item.name}</div><div className="text-[8px] text-white/40">{item.price}</div></div>
            <div className="px-2 py-0.5 bg-orange-500/20 rounded text-[7px] text-orange-400">Add</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebRestaurantLight() {
  return (
    <div className="bg-[#faf9f6] rounded-lg overflow-hidden text-[10px] h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5">
        <span className="text-[10px] font-bold text-gray-800 tracking-wide">THE KITCHEN</span>
        <div className="flex gap-3 text-[8px] text-gray-400"><span>Menu</span><span>Book</span><span>Order</span></div>
      </div>
      <div className="p-4 text-center bg-gradient-to-b from-amber-50 to-transparent">
        <div className="text-[12px] font-bold text-gray-800">Farm to Table</div>
        <div className="text-[8px] text-gray-500 mt-1">Fresh ingredients, delivered to your door</div>
        <div className="mt-2 px-4 py-1 bg-gray-800 rounded-full text-[8px] text-white inline-block">View Menu</div>
      </div>
      <div className="px-3 pb-3 grid grid-cols-2 gap-2">
        {["Brunch Special", "Dinner Prix Fixe", "Wine Pairing", "Dessert Bar"].map((item) => (
          <div key={item} className="bg-white rounded-lg p-2 border border-gray-100 shadow-sm">
            <div className="w-full h-6 bg-amber-100 rounded mb-1.5" />
            <div className="text-[8px] font-medium text-gray-700">{item}</div>
            <div className="text-[7px] text-gray-400">From $24</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebContractorPro() {
  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden text-[10px] h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[9px] font-bold text-blue-400">ProDispatch</span>
        <div className="flex gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-[7px] text-blue-400">+</div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-blue-500/10 rounded p-2 text-center"><div className="text-[11px] font-bold text-blue-400">12</div><div className="text-[7px] text-white/40">Jobs Today</div></div>
          <div className="bg-green-500/10 rounded p-2 text-center"><div className="text-[11px] font-bold text-green-400">8</div><div className="text-[7px] text-white/40">Completed</div></div>
          <div className="bg-amber-500/10 rounded p-2 text-center"><div className="text-[11px] font-bold text-amber-400">4</div><div className="text-[7px] text-white/40">In Route</div></div>
        </div>
        {[{ time: "9:00 AM", job: "AC Repair — Johnson", status: "Done", color: "text-green-400" }, { time: "11:30", job: "Furnace Install — Smith", status: "Active", color: "text-blue-400" }, { time: "2:00 PM", job: "Duct Cleaning — Park", status: "Next", color: "text-amber-400" }].map((j) => (
          <div key={j.time} className="flex items-center gap-2 bg-white/[0.03] rounded p-2">
            <div className="text-[8px] text-white/30 w-10">{j.time}</div>
            <div className="flex-1"><div className="text-[8px] font-medium text-white/80">{j.job}</div></div>
            <span className={`text-[7px] font-semibold ${j.color}`}>{j.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebDashboardDark() {
  return (
    <div className="bg-[#0a0a0f] rounded-lg overflow-hidden text-[10px] h-full border border-white/5">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[9px] font-bold text-purple-400">Analytics Pro</span>
        <div className="flex gap-1">
          {["1D", "1W", "1M"].map((p) => (
            <span key={p} className={`px-1.5 py-0.5 rounded text-[7px] ${p === "1W" ? "bg-purple-500/15 text-purple-400" : "text-white/30"}`}>{p}</span>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-baseline gap-2"><span className="text-[14px] font-bold text-white">$127,842</span><span className="text-[8px] text-green-400">+18.4%</span></div>
        <div className="h-16 flex items-end gap-0.5">
          {[40, 55, 45, 70, 60, 85, 75, 90, 70, 95, 80, 100].map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "linear-gradient(to top, rgba(167,139,250,0.5), rgba(167,139,250,0.15))" }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-white/[0.03] rounded p-2"><div className="text-[7px] text-white/30">Customers</div><div className="text-[9px] font-bold text-white">4,291</div></div>
          <div className="bg-white/[0.03] rounded p-2"><div className="text-[7px] text-white/30">Conversion</div><div className="text-[9px] font-bold text-white">12.8%</div></div>
        </div>
      </div>
    </div>
  );
}

export function WebDashboardLight() {
  return (
    <div className="bg-white rounded-lg overflow-hidden text-[10px] h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="text-[9px] font-bold text-gray-800">Dashboard</span>
        <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[7px] text-violet-600 font-bold">S</div>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-gray-50 rounded-lg p-2"><div className="text-[7px] text-gray-400">Revenue</div><div className="text-[10px] font-bold text-gray-800">$48.2K</div></div>
          <div className="bg-gray-50 rounded-lg p-2"><div className="text-[7px] text-gray-400">Users</div><div className="text-[10px] font-bold text-gray-800">2,841</div></div>
          <div className="bg-gray-50 rounded-lg p-2"><div className="text-[7px] text-gray-400">Growth</div><div className="text-[10px] font-bold text-emerald-600">+24%</div></div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5 h-14 flex items-end gap-0.5">
          {[30, 45, 35, 55, 40, 65, 50, 70, 60, 80, 65, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-violet-300/40" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MOBILE APP TEMPLATES (phone-shaped)
   ════════════════════════════════════════════════ */

function PhoneFrame({ children, notch = true }: { children: React.ReactNode; notch?: boolean }) {
  return (
    <div className="mx-auto w-[160px] bg-[#111] rounded-[20px] p-[3px] border border-white/10 shadow-xl">
      <div className="bg-[#0a0a0f] rounded-[17px] overflow-hidden">
        {notch && (
          <div className="flex justify-center pt-1.5 pb-1">
            <div className="w-16 h-1.5 bg-white/10 rounded-full" />
          </div>
        )}
        <div className="text-[9px]">{children}</div>
        {/* Home indicator */}
        <div className="flex justify-center pb-1.5 pt-2">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MobileOrderingApp() {
  return (
    <PhoneFrame>
      <div className="px-3 pt-1 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div><div className="text-[8px] text-white/40">Good evening</div><div className="text-[10px] font-bold">What&apos;s for dinner?</div></div>
          <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[7px] text-orange-400">🛒</div>
        </div>
        {/* Search */}
        <div className="bg-white/5 rounded-lg px-2 py-1.5 text-[8px] text-white/30 mb-2">Search menu...</div>
        {/* Categories */}
        <div className="flex gap-1.5 mb-2 overflow-hidden">
          {["🍕 Pizza", "🍝 Pasta", "🥗 Salad"].map((c) => (
            <div key={c} className="px-2 py-1 bg-white/5 rounded-full text-[7px] text-white/60 whitespace-nowrap">{c}</div>
          ))}
        </div>
        {/* Items */}
        {[{ name: "Margherita", price: "$14", img: "bg-red-500/20" }, { name: "Carbonara", price: "$16", img: "bg-yellow-500/20" }].map((item) => (
          <div key={item.name} className="flex gap-2 mb-1.5 bg-white/[0.03] rounded-lg p-1.5">
            <div className={`w-10 h-10 rounded-lg ${item.img} flex-shrink-0`} />
            <div className="flex-1 py-0.5">
              <div className="text-[8px] font-semibold">{item.name}</div>
              <div className="text-[7px] text-white/40">{item.price}</div>
            </div>
            <div className="self-center px-1.5 py-0.5 bg-orange-500 rounded text-[6px] text-white font-bold">+</div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

export function MobileFieldService() {
  return (
    <PhoneFrame>
      <div className="px-3 pt-1 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div><div className="text-[8px] text-white/40">Today</div><div className="text-[10px] font-bold">3 Jobs</div></div>
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[7px]">📍</div>
        </div>
        {/* Job cards */}
        {[{ time: "9:00 AM", client: "Johnson", job: "AC Repair", status: "Done", color: "bg-green-500/15 border-green-500/20", textColor: "text-green-400" },
          { time: "11:30", client: "Smith", job: "Install", status: "Now", color: "bg-blue-500/15 border-blue-500/20", textColor: "text-blue-400" },
          { time: "2:00 PM", client: "Park", job: "Cleaning", status: "Next", color: "bg-white/5 border-white/5", textColor: "text-white/40" }
        ].map((j) => (
          <div key={j.time} className={`mb-1.5 rounded-lg p-2 border ${j.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[8px] font-semibold">{j.client} — {j.job}</div>
                <div className="text-[7px] text-white/30">{j.time}</div>
              </div>
              <span className={`text-[6px] font-bold ${j.textColor}`}>{j.status}</span>
            </div>
          </div>
        ))}
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          <div className="bg-blue-500/10 rounded-lg p-2 text-center"><div className="text-[7px] text-blue-400 font-medium">Navigate</div></div>
          <div className="bg-green-500/10 rounded-lg p-2 text-center"><div className="text-[7px] text-green-400 font-medium">Invoice</div></div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MobileBookingApp() {
  return (
    <PhoneFrame>
      <div className="px-3 pt-1 pb-2">
        <div className="text-center mb-2">
          <div className="text-[10px] font-bold">Book Appointment</div>
          <div className="text-[7px] text-white/40">Select date & time</div>
        </div>
        {/* Calendar mini */}
        <div className="bg-white/5 rounded-lg p-2 mb-2">
          <div className="flex justify-between text-[7px] text-white/40 mb-1.5 px-0.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="w-4 text-center">{d}</span>)}
          </div>
          <div className="flex justify-between text-[7px] px-0.5">
            {[14, 15, 16, 17, 18, 19, 20].map((d) => (
              <span key={d} className={`w-4 h-4 flex items-center justify-center rounded-full ${d === 17 ? "bg-purple-500 text-white" : "text-white/60"}`}>{d}</span>
            ))}
          </div>
        </div>
        {/* Time slots */}
        <div className="text-[7px] text-white/40 mb-1">Available times</div>
        <div className="grid grid-cols-3 gap-1 mb-2">
          {["9:00", "10:00", "11:00", "1:00", "2:00", "3:00"].map((t) => (
            <div key={t} className={`text-center py-1.5 rounded text-[7px] ${t === "10:00" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-white/50"}`}>{t}</div>
          ))}
        </div>
        <div className="bg-purple-500 rounded-lg py-2 text-center text-[8px] text-white font-semibold">Confirm Booking</div>
      </div>
    </PhoneFrame>
  );
}

export function MobileTrackingApp() {
  return (
    <PhoneFrame>
      <div className="px-3 pt-1 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[10px] font-bold">Order #1284</div>
          <span className="px-1.5 py-0.5 bg-green-500/15 rounded text-[6px] text-green-400 font-bold">On the way</span>
        </div>
        {/* Map placeholder */}
        <div className="bg-gradient-to-b from-blue-900/20 to-transparent rounded-lg h-20 mb-2 relative flex items-center justify-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          <div className="absolute bottom-1 left-1 text-[6px] text-white/30">Live tracking</div>
        </div>
        {/* Timeline */}
        <div className="space-y-1.5">
          {[{ step: "Order placed", time: "2:30 PM", done: true }, { step: "Preparing", time: "2:35 PM", done: true }, { step: "Out for delivery", time: "2:50 PM", done: true }, { step: "Delivered", time: "~3:10 PM", done: false }].map((s) => (
            <div key={s.step} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${s.done ? "bg-green-500" : "bg-white/10"}`}>
                {s.done && <span className="text-[5px] text-white">✓</span>}
              </div>
              <div className="flex-1 text-[7px]"><span className={s.done ? "text-white/80" : "text-white/30"}>{s.step}</span></div>
              <span className="text-[6px] text-white/30">{s.time}</span>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function MobileDashboardApp() {
  return (
    <PhoneFrame>
      <div className="px-3 pt-1 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div><div className="text-[8px] text-white/40">Welcome back</div><div className="text-[10px] font-bold">Dashboard</div></div>
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[7px] text-purple-400 font-bold">D</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <div className="bg-white/5 rounded-lg p-2"><div className="text-[7px] text-white/40">Revenue</div><div className="text-[10px] font-bold">$12.4K</div><div className="text-[6px] text-green-400">+14%</div></div>
          <div className="bg-white/5 rounded-lg p-2"><div className="text-[7px] text-white/40">Orders</div><div className="text-[10px] font-bold">284</div><div className="text-[6px] text-green-400">+8%</div></div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 mb-2">
          <div className="h-10 flex items-end gap-0.5">
            {[40, 60, 45, 75, 55, 85, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "linear-gradient(to top, rgba(167,139,250,0.5), rgba(167,139,250,0.15))" }} />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {["New order received", "Payment processed"].map((a) => (
            <div key={a} className="flex items-center gap-1.5 bg-white/[0.03] rounded p-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-[7px] text-white/60">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ════════════════════════════════════════════════
   TEMPLATE REGISTRY
   ════════════════════════════════════════════════ */

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  Component: React.ComponentType;
  matchesIndustry: string[];
  matchesProject: string[];
}

export const allTemplates: DesignTemplate[] = [
  // Web — Restaurant
  { id: "web-rest-warm", name: "Warm Bistro", description: "Dark, warm tones. Bold CTAs. Ordering-focused.", style: "Dark & Warm", Component: WebRestaurantWarm, matchesIndustry: ["restaurant"], matchesProject: ["web"] },
  { id: "web-rest-light", name: "Clean Elegance", description: "Light, minimal. Premium feel for upscale dining.", style: "Light & Minimal", Component: WebRestaurantLight, matchesIndustry: ["restaurant"], matchesProject: ["web"] },
  // Web — Contractor
  { id: "web-contr-pro", name: "Dispatch Pro", description: "Navy dashboard. Scheduling-focused. Professional.", style: "Dark & Professional", Component: WebContractorPro, matchesIndustry: ["contractor"], matchesProject: ["web"] },
  // Web — General
  { id: "web-dash-dark", name: "Dark Analytics", description: "Premium dark UI. Data-forward. SaaS feel.", style: "Dark & Modern", Component: WebDashboardDark, matchesIndustry: ["general", "saas"], matchesProject: ["web"] },
  { id: "web-dash-light", name: "Clean Dashboard", description: "Light, spacious. Universal business dashboard.", style: "Light & Clean", Component: WebDashboardLight, matchesIndustry: ["general", "saas"], matchesProject: ["web"] },

  // Mobile — Restaurant/Food
  { id: "mob-ordering", name: "Food Ordering", description: "Menu browsing, cart, quick ordering. Restaurant-ready.", style: "Dark & Appetizing", Component: MobileOrderingApp, matchesIndustry: ["restaurant"], matchesProject: ["mobile"] },
  { id: "mob-tracking", name: "Order Tracking", description: "Live GPS tracking, delivery status, ETA.", style: "Dark & Functional", Component: MobileTrackingApp, matchesIndustry: ["restaurant", "general"], matchesProject: ["mobile"] },
  // Mobile — Contractor
  { id: "mob-field", name: "Field Service", description: "Job list, navigate, invoice. Built for crews.", style: "Dark & Efficient", Component: MobileFieldService, matchesIndustry: ["contractor"], matchesProject: ["mobile"] },
  // Mobile — General
  { id: "mob-booking", name: "Booking App", description: "Calendar, time slots, confirmations. Appointment-ready.", style: "Dark & Elegant", Component: MobileBookingApp, matchesIndustry: ["general", "saas"], matchesProject: ["mobile"] },
  { id: "mob-dashboard", name: "Business App", description: "Stats, charts, notifications. Your business in your pocket.", style: "Dark & Premium", Component: MobileDashboardApp, matchesIndustry: ["general", "saas"], matchesProject: ["mobile"] },

  // AI & Integration — reuse web dashboards
  { id: "ai-dark", name: "AI Dashboard", description: "Dark analytics with AI insights and automation stats.", style: "Dark & Intelligent", Component: WebDashboardDark, matchesIndustry: ["general", "saas"], matchesProject: ["ai", "integration"] },
  { id: "ai-light", name: "Clean AI Panel", description: "Light, minimal interface for AI management.", style: "Light & Clean", Component: WebDashboardLight, matchesIndustry: ["general", "saas"], matchesProject: ["ai", "integration"] },
];

export function getTemplatesForContext(projectType: string, selectedFeatures: string[]): DesignTemplate[] {
  const featureStr = selectedFeatures.join(" ").toLowerCase();
  let industry = "general";
  if (featureStr.includes("booking") || featureStr.includes("ecommerce") || featureStr.includes("reviews")) {
    industry = "restaurant";
  }
  if (featureStr.includes("gps") || featureStr.includes("portal") || featureStr.includes("invoice")) {
    industry = "contractor";
  }

  // Filter by project type FIRST, then by industry
  const byProject = allTemplates.filter((t) => t.matchesProject.includes(projectType));
  const industrySpecific = byProject.filter((t) => t.matchesIndustry.includes(industry));
  const general = byProject.filter((t) => t.matchesIndustry.includes("general"));

  // Prefer industry-specific, fill with general, max 4
  const result = [...industrySpecific];
  for (const t of general) {
    if (!result.find((r) => r.id === t.id) && result.length < 4) {
      result.push(t);
    }
  }
  return result.slice(0, 4);
}
