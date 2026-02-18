import OpenAI from "openai";

const MAX_HISTORY_MESSAGES = 40;

interface Persona {
  name: string;
  roleTitle: string;
  systemPrompt: string;
}

interface Script {
  productName: string;
  industry: string;
  companySize: string;
  targetLocation: string;
}

interface Message {
  role: string;
  content: string;
}

function buildSystemPrompt(persona: Persona, script: Script): string {
  return `You are roleplaying as ${persona.name}, a ${persona.roleTitle}.

PERSONALITY:
${persona.systemPrompt}

SCENARIO CONTEXT:
The caller is a Sales Development Representative (SDR) from ${script.productName}.
They are cold-calling you. The product targets the ${script.industry} industry
for ${script.companySize}-sized companies in ${script.targetLocation}.

BEHAVIORAL RULES:
1. Stay fully in character at ALL times. Never break character.
2. React naturally to what the SDR says.
3. You have a busy schedule. You did NOT expect this call.
4. Introduce realistic objections based on your persona.
5. Keep responses concise (1-4 sentences, like a real phone call).
6. Do NOT volunteer information the SDR hasn't asked about.
7. If the SDR handles objections well, gradually become more receptive.
8. If the SDR is pushy or robotic, become more resistant.
9. Ask clarifying questions a real ${persona.roleTitle} would ask.
10. Never reference that this is a roleplay or simulation.`;
}

export async function getAiResponse(
  persona: Persona,
  script: Script,
  history: Message[],
  userMessage: string
): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = buildSystemPrompt(persona, script);
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [{ role: "system", content: systemPrompt }];

  const historyToUse =
    history.length > MAX_HISTORY_MESSAGES
      ? history.slice(-MAX_HISTORY_MESSAGES)
      : history;

  for (const msg of historyToUse) {
    messages.push({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: userMessage });

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.8,
    max_tokens: 300,
    presence_penalty: 0.3,
  });

  return response.choices[0].message.content || "";
}

export async function getSessionFeedback(
  messages: Message[]
): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const conversationText = messages
    .map((m) => `${m.role === "user" ? "SDR" : "Prospect"}: ${m.content}`)
    .join("\n");

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a sales coaching expert. Analyze this SDR cold call practice " +
          "session and provide brief, actionable feedback in 3-5 bullet points " +
          "covering: opening effectiveness, objection handling, discovery questions, " +
          "and overall impression. Be specific and constructive.",
      },
      { role: "user", content: conversationText },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  return response.choices[0].message.content || "";
}
