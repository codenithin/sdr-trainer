import OpenAI from "openai";

const GENERATE_SCRIPT_PROMPT = `You are an expert SDR (Sales Development Representative) cold call script writer for Nvelop, an AI procurement platform.

Given the following prospect details, generate a complete cold call script with 5 sections.

PROSPECT DETAILS:
- Name: {prospect_name}
- Title/Role: {prospect_title}
- Company: {prospect_company}
- Industry: {industry}
- Company Size: {company_size}
- Location: {location}
- LinkedIn Summary: {linkedin_summary}
- Additional Context: {additional_context}

PRODUCT: Nvelop — an AI-powered procurement platform that uses AI agents to automate sourcing, RFP creation, vendor evaluation, and procurement workflows end-to-end.

Generate a JSON object with this exact structure:
{{
  "title": "Short script title (e.g. 'Enterprise CPO - [Company Name]')",
  "description": "One-line description of this script's focus",
  "industry": "{industry}",
  "company_size": "{company_size}",
  "target_location": "{location}",
  "product_name": "Nvelop",
  "target_role": "{prospect_title}",
  "difficulty_level": "intermediate",
  "sections": [
    {{
      "section_type": "intro",
      "title": "Opening & Pattern Interrupt",
      "order_index": 0,
      "content": "The opening lines the SDR should say.",
      "talking_points": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
      "tips": "A pro tip for this section"
    }},
    {{
      "section_type": "discovery",
      "title": "Social Proof & Discovery",
      "order_index": 1,
      "content": "Social proof opener with discovery questions.",
      "talking_points": ["Tip 1", "Tip 2", "Tip 3"],
      "tips": "Pro tip"
    }},
    {{
      "section_type": "pitch",
      "title": "Pain Discovery & Value Proposition",
      "order_index": 2,
      "content": "Discovery question then value prop.",
      "talking_points": ["Tip 1", "Tip 2", "Tip 3"],
      "tips": "Pro tip"
    }},
    {{
      "section_type": "objection_handling",
      "title": "Objection Handling",
      "order_index": 3,
      "content": "Differentiator then 3-4 objections with responses.",
      "talking_points": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
      "tips": "Pro tip"
    }},
    {{
      "section_type": "close",
      "title": "Close & Next Steps",
      "order_index": 4,
      "content": "Closing ask for a meeting.",
      "talking_points": ["Tip 1", "Tip 2", "Tip 3"],
      "tips": "Pro tip"
    }}
  ]
}}

IMPORTANT RULES:
1. Make it highly personalized to this specific prospect
2. Use conversational, natural language
3. Include realistic objections this prospect would raise
4. Talking points should be actionable coaching tips
5. Use line breaks between dialogue sections
6. For objection handling, use OBJECTION: and RESPONSE: format
7. For branching, use IF YES / IF NO prefixes
8. Return ONLY valid JSON, no markdown fences or extra text`;

interface GenerateParams {
  prospectName: string;
  prospectTitle: string;
  prospectCompany: string;
  industry?: string;
  companySize?: string;
  location?: string;
  linkedinSummary?: string;
  additionalContext?: string;
}

export async function generateScriptFromProspect(
  params: GenerateParams
): Promise<Record<string, unknown>> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = GENERATE_SCRIPT_PROMPT.replace("{prospect_name}", params.prospectName || "Unknown")
    .replace("{prospect_title}", params.prospectTitle || "Procurement Leader")
    .replace("{prospect_company}", params.prospectCompany || "Unknown")
    .replaceAll("{industry}", params.industry || "general")
    .replaceAll("{company_size}", params.companySize || "mid_market")
    .replaceAll("{location}", params.location || "US")
    .replace("{linkedin_summary}", params.linkedinSummary || "Not provided")
    .replace("{additional_context}", params.additionalContext || "None");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a JSON generator. Return ONLY valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  let raw = (response.choices[0].message.content || "").trim();
  if (raw.startsWith("```")) {
    raw = raw.split("\n", 2)[1];
    if (raw.endsWith("```")) {
      raw = raw.substring(0, raw.lastIndexOf("```"));
    }
  }

  return JSON.parse(raw);
}
