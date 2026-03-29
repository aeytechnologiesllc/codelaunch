import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are a senior pricing analyst for CodeLaunch, a software studio. Your job is to analyze custom feature requests and return accurate, realistic pricing.

CRITICAL: You must think carefully about the ACTUAL complexity of what's being asked. Consider:
- How many systems need to connect?
- How much custom logic is needed?
- Does it require AI/ML model training?
- How many platforms/integrations?
- What's the testing burden?
- Does it need ongoing maintenance?

PRICING GUIDE (one-time development cost):
- Trivial (simple form, basic alert, single notification): $200-$800, 0.5 weeks
- Simple (basic chatbot on one platform, simple automation, one API connection): $1,000-$2,500, 1-2 weeks
- Moderate (chatbot with integrations, multi-step workflow, dashboard with data): $2,500-$6,000, 2-4 weeks
- Complex (multi-platform AI, custom trained models, real-time orchestration): $6,000-$15,000, 4-8 weeks
- Very Complex (AI agents across many platforms, enterprise orchestration, custom ML pipeline): $15,000-$50,000+, 8-16+ weeks
- Enterprise / Out of Scope (20+ integrations, custom infrastructure, massive scale): Mark as tooComplex

IMPORTANT:
- "AI agents for multiple platforms" is NOT simple. Each platform needs its own integration, authentication, error handling, and testing.
- Multi-platform anything multiplies complexity. 20 platforms = enterprise-level project.
- If someone asks for something that would realistically cost $50,000+ at a real agency, say so. Don't underprice.
- Always explain what makes it complex or simple in plain English.

Respond ONLY with valid JSON:
{
  "outOfScope": false,
  "tooComplex": false,
  "complexity": "trivial" | "simple" | "moderate" | "complex" | "very_complex",
  "priceMin": number,
  "priceMax": number,
  "timeWeeks": number,
  "explanation": "2-3 sentence explanation of what's involved, what drives the cost, and why"
}

If tooComplex: set reasonable estimates but explain this needs a dedicated discovery session to scope properly.`;

export async function POST(req: NextRequest) {
  try {
    const { description, projectType } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      console.error("No ANTHROPIC_API_KEY set — using fallback");
      return NextResponse.json(getFallbackEstimate(description));
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Project type: ${projectType || "web"}\n\nCustom feature request:\n"${description}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return NextResponse.json(getFallbackEstimate(description));
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON in Claude response:", text);
      return NextResponse.json(getFallbackEstimate(description));
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Map very_complex to complex for the frontend
    const displayComplexity = parsed.complexity === "very_complex" ? "complex" : parsed.complexity === "trivial" ? "simple" : parsed.complexity;

    if (parsed.outOfScope) {
      return NextResponse.json({
        outOfScope: true,
        description,
        complexity: "complex",
        priceMin: 0,
        priceMax: 0,
        timeWeeks: 0,
        explanation: parsed.explanation || "This is outside the scope of what we build.",
      });
    }

    if (parsed.tooComplex) {
      return NextResponse.json({
        tooComplex: true,
        description,
        complexity: displayComplexity,
        priceMin: parsed.priceMin || 15000,
        priceMax: parsed.priceMax || 50000,
        timeWeeks: parsed.timeWeeks || 12,
        explanation: parsed.explanation || "This is an enterprise-level project that needs a dedicated discovery session to scope properly. Book a call for exact pricing.",
      });
    }

    return NextResponse.json({
      description,
      complexity: displayComplexity,
      priceMin: parsed.priceMin,
      priceMax: parsed.priceMax,
      timeWeeks: parsed.timeWeeks,
      explanation: parsed.explanation,
    });
  } catch (error) {
    console.error("Error analyzing feature:", error);
    return NextResponse.json(getFallbackEstimate(description));
  }
}

function getFallbackEstimate(description: string) {
  const lower = description.toLowerCase();
  const wordCount = description.split(/\s+/).length;

  const outOfScopeTerms = ["game", "blockchain", "crypto", "nft", "dating app", "social media platform", "hardware"];
  if (outOfScopeTerms.some((t) => lower.includes(t))) {
    return {
      outOfScope: true,
      description,
      complexity: "complex" as const,
      priceMin: 0, priceMax: 0, timeWeeks: 0,
      explanation: "This is outside the scope of what we typically build. Please book a call to discuss.",
    };
  }

  // Better complexity detection
  const enterpriseTerms = ["20 platform", "50 platform", "100 platform", "enterprise", "all platform", "every platform", "massive scale"];
  const veryComplexTerms = ["ai agent", "multiple platform", "multi-platform", "orchestrat", "custom model", "machine learning", "train a model", "real-time sync across"];
  const complexTerms = ["voice ai", "phone bot", "custom algorithm", "predict", "forecast", "ocr", "document process"];
  const moderateTerms = ["chatbot", "automation", "integration", "dashboard", "api", "connect to", "sync"];
  const simpleTerms = ["email alert", "reminder", "sms notification", "simple form", "basic page"];

  let complexity: "simple" | "moderate" | "complex" = "moderate";
  let prices = { min: 2500, max: 6000, weeks: 3 };

  if (enterpriseTerms.some((t) => lower.includes(t))) {
    complexity = "complex";
    prices = { min: 25000, max: 75000, weeks: 16 };
  } else if (veryComplexTerms.some((t) => lower.includes(t)) || wordCount > 60) {
    complexity = "complex";
    prices = { min: 8000, max: 25000, weeks: 8 };
  } else if (complexTerms.some((t) => lower.includes(t))) {
    complexity = "complex";
    prices = { min: 5000, max: 15000, weeks: 5 };
  } else if (moderateTerms.some((t) => lower.includes(t))) {
    complexity = "moderate";
    prices = { min: 2500, max: 6000, weeks: 3 };
  } else if (simpleTerms.some((t) => lower.includes(t)) && wordCount < 15) {
    complexity = "simple";
    prices = { min: 500, max: 1500, weeks: 1 };
  }

  return {
    description,
    complexity,
    priceMin: prices.min,
    priceMax: prices.max,
    timeWeeks: prices.weeks,
    explanation: `This appears to be a ${complexity}-complexity feature. This estimate covers architecture, development, testing, and deployment. Book a free call for exact pricing based on your specific requirements.`,
  };
}
