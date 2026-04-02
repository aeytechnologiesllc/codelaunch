"use client";

import Image from "next/image";

function TemplatePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-bg-elevated">
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 640px) 50vw, 250px" />
    </div>
  );
}

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  image: string;
  matchesIndustry: string[];
  matchesProject: string[];
}

export const allTemplates: DesignTemplate[] = [
  {
    id: "tmpl-analytics",
    name: "Analytics Dashboard",
    description: "Revenue charts, metrics, order tracking. Clean sidebar with stats.",
    style: "Dark & Premium",
    image: "/images/template-analytics.png",
    matchesIndustry: ["general", "saas"],
    matchesProject: ["web", "ai"],
  },
  {
    id: "tmpl-restaurant",
    name: "Restaurant Hub",
    description: "Live orders, kitchen display, menu management. Built for food businesses.",
    style: "Dark & Vibrant",
    image: "/images/template-restaurant.png",
    matchesIndustry: ["restaurant"],
    matchesProject: ["web", "mobile"],
  },
  {
    id: "tmpl-service",
    name: "Service Pro",
    description: "GPS dispatch map, job scheduling, crew tracking. For service teams.",
    style: "Dark & Efficient",
    image: "/images/template-service.png",
    matchesIndustry: ["contractor"],
    matchesProject: ["web", "mobile"],
  },
  {
    id: "tmpl-ecommerce",
    name: "Commerce Suite",
    description: "Product catalog, cart, orders, inventory. Full e-commerce management.",
    style: "Dark & Modern",
    image: "/images/template-ecommerce.png",
    matchesIndustry: ["general", "saas"],
    matchesProject: ["web", "mobile"],
  },
  {
    id: "tmpl-ai",
    name: "AI Command Center",
    description: "Chatbot analytics, live conversations, resolution metrics. AI-first.",
    style: "Dark & Intelligent",
    image: "/images/template-ai.png",
    matchesIndustry: ["general", "saas"],
    matchesProject: ["ai", "integration"],
  },
];

export function TemplateCard({ template }: { template: DesignTemplate }) {
  return <TemplatePreview src={template.image} alt={template.name} />;
}

export function getTemplatesForContext(projectType: string, selectedFeatures: string[]): DesignTemplate[] {
  const featureStr = selectedFeatures.join(" ").toLowerCase();
  let industry = "general";
  if (featureStr.includes("booking") || featureStr.includes("ecommerce") || featureStr.includes("reviews") || featureStr.includes("menu")) {
    industry = "restaurant";
  }
  if (featureStr.includes("gps") || featureStr.includes("portal") || featureStr.includes("invoice") || featureStr.includes("dispatch")) {
    industry = "contractor";
  }

  // Return all 5 templates but sort by relevance
  const scored = allTemplates.map((t) => {
    let score = 0;
    if (t.matchesProject.includes(projectType)) score += 2;
    if (t.matchesIndustry.includes(industry)) score += 3;
    if (t.matchesIndustry.includes("general")) score += 1;
    return { template: t, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.template);
}

export function getRecommendedTemplate(projectType: string, selectedFeatures: string[]): string {
  const templates = getTemplatesForContext(projectType, selectedFeatures);
  return templates[0]?.id || allTemplates[0].id;
}
