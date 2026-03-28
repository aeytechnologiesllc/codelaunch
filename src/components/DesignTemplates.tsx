"use client";

/* ─── Restaurant Templates ─── */

export function RestaurantModern() {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden text-[10px] h-full">
      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-orange-500/30" />
          <span className="text-[9px] font-semibold text-white/80">Bella Cucina</span>
        </div>
        <div className="flex gap-3 text-[8px] text-white/40">
          <span>Menu</span><span>Order</span><span>Reserve</span>
        </div>
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-900/40 to-red-900/30 p-4 text-center">
        <div className="text-[11px] font-bold text-white/90">Order Fresh, Order Direct</div>
        <div className="text-[8px] text-white/50 mt-1">Zero commission. 100% flavor.</div>
        <div className="mt-2 px-3 py-1 bg-orange-500 rounded text-[8px] text-white inline-block font-semibold">Order Now</div>
      </div>
      {/* Menu items */}
      <div className="p-3 space-y-2">
        {[
          { name: "Margherita Pizza", price: "$14.99", color: "bg-red-400/20" },
          { name: "Pasta Carbonara", price: "$16.99", color: "bg-yellow-400/20" },
          { name: "Caesar Salad", price: "$11.99", color: "bg-green-400/20" },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-white/[0.03] rounded-lg p-2">
            <div className={`w-8 h-8 rounded-lg ${item.color} flex-shrink-0`} />
            <div className="flex-1">
              <div className="text-[9px] font-medium text-white/80">{item.name}</div>
              <div className="text-[8px] text-white/40">{item.price}</div>
            </div>
            <div className="px-2 py-0.5 bg-orange-500/20 rounded text-[7px] text-orange-400">Add</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RestaurantClean() {
  return (
    <div className="bg-[#faf9f6] rounded-lg overflow-hidden text-[10px] h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5">
        <span className="text-[10px] font-bold text-gray-800 tracking-wide">THE KITCHEN</span>
        <div className="flex gap-3 text-[8px] text-gray-400">
          <span>Menu</span><span>Book</span><span>Order</span>
        </div>
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

export function RestaurantBold() {
  return (
    <div className="bg-black rounded-lg overflow-hidden text-[10px] h-full">
      <div className="p-4 text-center bg-gradient-to-b from-red-900/60 to-black">
        <div className="text-[13px] font-black text-white uppercase tracking-wider">FUEGO</div>
        <div className="text-[8px] text-red-300 mt-0.5">Authentic Mexican Kitchen</div>
      </div>
      <div className="px-3 py-2 flex justify-center gap-4 border-b border-white/5">
        {["Tacos", "Burritos", "Bowls", "Drinks"].map((cat) => (
          <span key={cat} className="text-[8px] text-white/50 hover:text-white">{cat}</span>
        ))}
      </div>
      <div className="p-3 space-y-2">
        {[
          { name: "Street Tacos (3)", price: "$12", tag: "Popular" },
          { name: "Burrito Supreme", price: "$15", tag: "Spicy" },
          { name: "Açaí Bowl", price: "$11", tag: "Healthy" },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between bg-white/[0.04] rounded-lg p-2.5">
            <div>
              <div className="text-[9px] font-semibold text-white/90">{item.name}</div>
              <span className="text-[7px] text-red-400 bg-red-400/10 px-1 rounded">{item.tag}</span>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-bold text-white">{item.price}</div>
              <div className="px-2 py-0.5 bg-red-500 rounded text-[7px] text-white mt-0.5">Add</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Contractor Templates ─── */

export function ContractorPro() {
  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden text-[10px] h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[9px] font-bold text-blue-400">ProDispatch</span>
        <div className="flex gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-[7px] text-blue-400">+</div>
          <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[7px] text-white/40">⚡</div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-blue-500/10 rounded p-2 text-center"><div className="text-[11px] font-bold text-blue-400">12</div><div className="text-[7px] text-white/40">Jobs Today</div></div>
          <div className="bg-green-500/10 rounded p-2 text-center"><div className="text-[11px] font-bold text-green-400">8</div><div className="text-[7px] text-white/40">Completed</div></div>
          <div className="bg-amber-500/10 rounded p-2 text-center"><div className="text-[11px] font-bold text-amber-400">4</div><div className="text-[7px] text-white/40">In Route</div></div>
        </div>
        {/* Schedule */}
        {[
          { time: "9:00 AM", job: "AC Repair — Johnson", tech: "Mike D.", status: "Done", color: "text-green-400" },
          { time: "11:30 AM", job: "Furnace Install — Smith", tech: "Jake R.", status: "Active", color: "text-blue-400" },
          { time: "2:00 PM", job: "Duct Cleaning — Park", tech: "Mike D.", status: "Next", color: "text-amber-400" },
        ].map((job) => (
          <div key={job.time} className="flex items-center gap-2 bg-white/[0.03] rounded p-2">
            <div className="text-[8px] text-white/30 w-10">{job.time}</div>
            <div className="flex-1">
              <div className="text-[8px] font-medium text-white/80">{job.job}</div>
              <div className="text-[7px] text-white/30">{job.tech}</div>
            </div>
            <span className={`text-[7px] font-semibold ${job.color}`}>{job.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContractorField() {
  return (
    <div className="bg-[#18181b] rounded-lg overflow-hidden text-[10px] h-full">
      <div className="bg-emerald-600 px-3 py-2 flex items-center justify-between">
        <span className="text-[9px] font-bold text-white">FieldForce</span>
        <span className="text-[7px] text-emerald-200">3 Active Crews</span>
      </div>
      {/* Map placeholder */}
      <div className="h-20 bg-gradient-to-b from-emerald-900/30 to-[#18181b] relative p-2">
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-emerald-500/40 border border-emerald-400/50 flex items-center justify-center text-[6px] text-white font-bold">{i}</div>
          ))}
        </div>
        <div className="absolute bottom-2 right-2 text-[7px] text-white/30">Live GPS Tracking</div>
      </div>
      <div className="p-3 space-y-1.5">
        {[
          { crew: "Crew Alpha", job: "Pipe Repair", eta: "On site" },
          { crew: "Crew Beta", job: "Water Heater", eta: "15 min" },
          { crew: "Crew Charlie", job: "Drain Clean", eta: "45 min" },
        ].map((c) => (
          <div key={c.crew} className="flex items-center justify-between bg-white/[0.03] rounded p-2">
            <div>
              <div className="text-[8px] font-medium text-white/80">{c.crew}</div>
              <div className="text-[7px] text-white/30">{c.job}</div>
            </div>
            <span className="text-[7px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">{c.eta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SaaS / Dashboard Templates ─── */

export function DashboardMinimal() {
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
        <div className="bg-gray-50 rounded-lg p-2.5 h-16 flex items-end gap-0.5">
          {[30, 45, 35, 55, 40, 65, 50, 70, 60, 80, 65, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, rgba(139,92,246,0.3), rgba(16,185,129,0.2))` }} />
          ))}
        </div>
        <div className="space-y-1.5">
          {["New signup: Alex M.", "Payment received: $299", "Report generated"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[8px] text-gray-500 bg-gray-50 rounded p-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardDark() {
  return (
    <div className="bg-[#0a0a0f] rounded-lg overflow-hidden text-[10px] h-full border border-white/5">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[9px] font-bold text-emerald-400">Analytics Pro</span>
        <div className="flex gap-1">
          {["1D", "1W", "1M"].map((p) => (
            <span key={p} className={`px-1.5 py-0.5 rounded text-[7px] ${p === "1W" ? "bg-emerald-500/15 text-emerald-400" : "text-white/30"}`}>{p}</span>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-bold text-white">$127,842</span>
          <span className="text-[8px] text-emerald-400">+18.4%</span>
        </div>
        <div className="h-20 flex items-end gap-0.5">
          {[40, 55, 45, 70, 60, 85, 75, 90, 70, 95, 80, 100, 85, 92].map((h, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, rgba(16,185,129,0.5), rgba(139,92,246,0.3))` }} />
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

/* ─── Template Registry ─── */

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
  // Restaurant
  { id: "rest-modern", name: "Modern Bistro", description: "Dark, warm tones. Bold CTAs. Mobile-first ordering.", style: "Dark & Warm", Component: RestaurantModern, matchesIndustry: ["restaurant"], matchesProject: ["web", "mobile"] },
  { id: "rest-clean", name: "Clean & Elegant", description: "Light, minimal. Premium feel. Perfect for upscale dining.", style: "Light & Minimal", Component: RestaurantClean, matchesIndustry: ["restaurant"], matchesProject: ["web", "mobile"] },
  { id: "rest-bold", name: "Bold Street Food", description: "High contrast. Energetic. Great for fast casual.", style: "Dark & Bold", Component: RestaurantBold, matchesIndustry: ["restaurant"], matchesProject: ["web", "mobile"] },
  // Contractor
  { id: "contr-pro", name: "Dispatch Pro", description: "Navy dashboard. Clean scheduling. Professional feel.", style: "Dark & Professional", Component: ContractorPro, matchesIndustry: ["contractor"], matchesProject: ["web", "mobile"] },
  { id: "contr-field", name: "FieldForce", description: "GPS-focused. Emerald accents. Crew management first.", style: "Dark & Techy", Component: ContractorField, matchesIndustry: ["contractor"], matchesProject: ["web", "mobile"] },
  // Generic / SaaS
  { id: "dash-minimal", name: "Clean Dashboard", description: "Light, minimal, spacious. Universal business dashboard.", style: "Light & Clean", Component: DashboardMinimal, matchesIndustry: ["saas", "general"], matchesProject: ["web", "ai"] },
  { id: "dash-dark", name: "Dark Analytics", description: "Premium dark UI. Data-forward. Modern SaaS feel.", style: "Dark & Modern", Component: DashboardDark, matchesIndustry: ["saas", "general"], matchesProject: ["web", "ai", "integration"] },
];

export function getTemplatesForContext(projectType: string, selectedFeatures: string[]): DesignTemplate[] {
  // Detect industry from selected features
  const featureStr = selectedFeatures.join(" ").toLowerCase();
  let industry = "general";
  if (featureStr.includes("booking") || featureStr.includes("ecommerce")) {
    industry = "restaurant";
  }
  if (featureStr.includes("gps") || featureStr.includes("portal") || featureStr.includes("invoice")) {
    industry = "contractor";
  }

  // Also check quick-start type
  const relevant = allTemplates.filter((t) => {
    const matchesProject = t.matchesProject.includes(projectType);
    const matchesInd = t.matchesIndustry.includes(industry) || t.matchesIndustry.includes("general");
    return matchesProject && matchesInd;
  });

  // Return max 4 templates — prefer industry-specific, then fill with general
  const industrySpecific = relevant.filter((t) => !t.matchesIndustry.includes("general"));
  const general = relevant.filter((t) => t.matchesIndustry.includes("general"));
  return [...industrySpecific, ...general].slice(0, 4);
}
