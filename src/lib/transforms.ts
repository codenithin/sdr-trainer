/* eslint-disable @typescript-eslint/no-explicit-any */

function parseJson(val: any, fallback: any = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

export function toSnakeSection(s: any) {
  return {
    id: s.id,
    script_id: s.scriptId,
    section_type: s.sectionType,
    title: s.title,
    content: s.content,
    talking_points: parseJson(s.talkingPoints, []),
    tips: s.tips,
    order_index: s.orderIndex,
  };
}

export function toSnakeScript(s: any) {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    industry: s.industry,
    company_size: s.companySize,
    target_location: s.targetLocation,
    product_name: s.productName,
    target_role: s.targetRole,
    difficulty_level: s.difficultyLevel,
    created_at: s.createdAt?.toISOString?.() ?? s.createdAt,
    sections: s.sections?.map(toSnakeSection) ?? [],
  };
}

export function toSnakePersona(p: any) {
  return {
    id: p.id,
    name: p.name,
    role_title: p.roleTitle,
    personality_summary: p.personalitySummary,
    system_prompt: p.systemPrompt,
    difficulty: p.difficulty,
    avatar_emoji: p.avatarEmoji,
    traits: parseJson(p.traits, []),
  };
}

export function toSnakeSession(s: any) {
  return {
    id: s.id,
    user_id: s.userId,
    script_id: s.scriptId,
    persona_id: s.personaId,
    started_at: s.startedAt?.toISOString?.() ?? s.startedAt,
    ended_at: s.endedAt?.toISOString?.() ?? s.endedAt,
    is_active: s.isActive,
    feedback_summary: s.feedbackSummary,
    persona: s.persona ? toSnakePersona(s.persona) : undefined,
    script: s.script ? { id: s.script.id, title: s.script.title } : undefined,
    messages: s.messages?.map(toSnakeMessage) ?? undefined,
  };
}

export function toSnakeMessage(m: any) {
  return {
    id: m.id,
    session_id: m.sessionId,
    role: m.role,
    content: m.content,
    created_at: m.createdAt?.toISOString?.() ?? m.createdAt,
  };
}
