import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are a pricing analyst for CodeLaunch, an AI-powered software studio that builds custom web apps, mobile apps, AI automation, and integrations for small businesses (restaurants, contractors, etc).

Your job is to analyze a custom feature request and return a JSON pricing estimate.

IMPORTANT RULES:
1. We ONLY build software features — web apps, mobile apps, AI chatbots, automations, integrations, dashboards, booking systems, etc.
2. We do NOT build: games, hardware, physical products, blockchain/crypto, dating apps, social media platforms, or anything illegal.
3. If the request is outside our scope, set "outOfScope" to true and explain why.
4. We are a small studio — we don't take on projects that would take more than 8 weeks for a single custom feature. If it's too complex, set "tooComplex" to true.
5. Be realistic with pricing. We are competitive but not cheap:
   - Simple automation/integration: $200-$600
   - Moderate feature (new page, form, notification flow): $400-$1,200
   - Complex feature (AI integration, real-time sync, custom algorithm): $1,000-$3,000
   - Very complex (custom ML model, multi-system orchestration): $2,000-$5,000
6. Time estimates should be realistic:
   - Simple: 0.5 weeks
   - Moderate: 1 week
   - Complex: 1.5-2 weeks
   - Very complex: 2-4 weeks

Respond ONLY with valid JSON in this exact format:
{
  "outOfScope": false,
  "tooComplex": false,
  "complexity": "simple" | "moderate" | "complex",
  "priceMin": number,
  "priceMax": number,
  "timeWeeks": number,
  "explanation": "Brief 1-2 sentence explanation of what's involved and why it costs this much"
}

If outOfScope is true, set complexity to "complex", prices to 0, timeWeeks to 0, and explanation to why it's out of scope.
If tooComplex is true, set reasonable initial estimates but explain they'd need a dedicated project scope.`;

export async function POST(req: NextRequest) {
  try {
    const { description, projectType } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      // Fallback: smart estimate without AI
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
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Project type: ${projectType || "web"}\n\nCustom feature request:\n${description}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      return NextResponse.json(getFallbackEstimate(description));
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(getFallbackEstimate(description));
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.outOfScope) {
      return NextResponse.json({
        outOfScope: true,
        description,
        complexity: "complex",
        priceMin: 0,
        priceMax: 0,
        timeWeeks: 0,
        explanation: parsed.explanation || "This is outside the scope of what we build. Please email us to discuss.",
      });
    }

    if (parsed.tooComplex) {
      return NextResponse.json({
        tooComplex: true,
        description,
        complexity: parsed.complexity || "complex",
        priceMin: parsed.priceMin || 3000,
        priceMax: parsed.priceMax || 8000,
        timeWeeks: parsed.timeWeeks || 4,
        explanation: parsed.explanation || "This is a large feature that would need dedicated scoping. Book a call for exact pricing.",
      });
    }

    return NextResponse.json({
      description,
      complexity: parsed.complexity,
      priceMin: parsed.priceMin,
      priceMax: parsed.priceMax,
      timeWeeks: parsed.timeWeeks,
      explanation: parsed.explanation,
    });
  } catch (error) {
    console.error("Error analyzing feature:", error);
    return NextResponse.json(
      { error: "Failed to analyze feature" },
      { status: 500 }
    );
  }
}

function getFallbackEstimate(description: string) {
  const lower = description.toLowerCase();
  const wordCount = description.split(/\s+/).length;

  // Out of scope detection
  const outOfScopeTerms = ["game", "blockchain", "crypto", "nft", "dating app", "social media platform", "hardware"];
  if (outOfScopeTerms.some((t) => lower.includes(t))) {
    return {
      outOfScope: true,
      description,
      complexity: "complex" as const,
      priceMin: 0,
      priceMax: 0,
      timeWeeks: 0,
      explanation: "This is outside the scope of what we typically build. Please email us at hello@codelaunch.dev to discuss.",
    };
  }

  // Complexity heuristics
  const complexTerms = ["machine learning", "custom model", "real-time", "voice", "video", "multi-tenant", "orchestrat"];
  const moderateTerms = ["api", "integration", "dashboard", "notification", "automat", "schedule", "report", "sync"];
  const simpleTerms = ["email", "alert", "reminder", "text", "sms", "button", "form", "page"];

  let complexity: "simple" | "moderate" | "complex" = "moderate";
  if (complexTerms.some((t) => lower.includes(t)) || wordCount > 50) {
    complexity = "complex";
  } else if (simpleTerms.some((t) => lower.includes(t)) && wordCount < 20) {
    complexity = "simple";
  }

  const priceMap = {
    simple: { min: 200, max: 600, weeks: 0.5 },
    moderate: { min: 500, max: 1500, weeks: 1 },
    complex: { min: 1500, max: 4000, weeks: 2 },
  };

  const est = priceMap[complexity];
  return {
    description,
    complexity,
    priceMin: est.min,
    priceMax: est.max,
    timeWeeks: est.weeks,
    explanation: `Based on the description, this is a ${complexity}-complexity feature. The estimate covers development, testing, and deployment. Book a free call for exact pricing.`,
  };
}
