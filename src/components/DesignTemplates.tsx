"use client";

import Image from "next/image";

/* ════════════════════════════════════════════════
   TEMPLATE REGISTRY — Using real MidJourney images
   ════════════════════════════════════════════════ */

function TemplateImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-lg bg-bg-elevated">
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 300px" />
    </div>
  );
}

function TemplateLandscape({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-bg-elevated">
      <Image src={src} alt={alt} fill className="object-cover object-center" sizes="(max-width: 640px) 100vw, 400px" />
    </div>
  );
}

/* Components that render the images */
function WebAnalytics() { return <TemplateLandscape src="/images/web-analytics.png" alt="Analytics dashboard" />; }
function WebContractor() { return <TemplateLandscape src="/images/web-contractor.png" alt="Contractor dispatch dashboard" />; }
function MobileRestaurant() { return <TemplateImage src="/images/mobile-restaurant.png" alt="Restaurant ordering app" />; }
function MobileContractor() { return <TemplateImage src="/images/mobile-contractor.png" alt="Field service app" />; }
function MobileBooking() { return <TemplateImage src="/images/mobile-booking.png" alt="Booking app" />; }

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
  // Web templates
  { id: "web-analytics", name: "Analytics Dashboard", description: "Dark theme with purple accents. Charts, metrics, sidebar nav.", style: "Dark & Premium", Component: WebAnalytics, matchesIndustry: ["general", "saas"], matchesProject: ["web", "ai"] },
  { id: "web-contractor", name: "Dispatch Dashboard", description: "Dark navy with GPS map. Job management, crew tracking.", style: "Dark & Professional", Component: WebContractor, matchesIndustry: ["contractor", "general"], matchesProject: ["web"] },

  // Mobile templates
  { id: "mob-restaurant", name: "Food Ordering", description: "Dark theme, food grid layout. Menu browsing, cart, ordering.", style: "Dark & Appetizing", Component: MobileRestaurant, matchesIndustry: ["restaurant"], matchesProject: ["mobile"] },
  { id: "mob-contractor", name: "Field Service", description: "Dark navy with GPS map. Job details, navigation, dispatch.", style: "Dark & Efficient", Component: MobileContractor, matchesIndustry: ["contractor"], matchesProject: ["mobile"] },
  { id: "mob-booking", name: "Booking App", description: "Purple gradient. Calendar, scheduling, analytics dashboard.", style: "Dark & Elegant", Component: MobileBooking, matchesIndustry: ["general", "saas"], matchesProject: ["mobile"] },

  // AI & Integration — reuse web dashboards
  { id: "ai-analytics", name: "AI Dashboard", description: "Dark analytics with purple accents. AI insights and metrics.", style: "Dark & Intelligent", Component: WebAnalytics, matchesIndustry: ["general", "saas"], matchesProject: ["ai", "integration"] },
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

  const byProject = allTemplates.filter((t) => t.matchesProject.includes(projectType));
  const industrySpecific = byProject.filter((t) => t.matchesIndustry.includes(industry));
  const general = byProject.filter((t) => t.matchesIndustry.includes("general"));

  const result = [...industrySpecific];
  for (const t of general) {
    if (!result.find((r) => r.id === t.id) && result.length < 4) {
      result.push(t);
    }
  }
  return result.slice(0, 4);
}
