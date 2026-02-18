export const SCRIPTS = [
  {
    title: "AI Procurement Platform - Sourcing Leaders",
    description:
      "Cold call script for pitching Nvelop AI procurement platform to sourcing and procurement leaders across industries.",
    industry: "saas",
    companySize: "mid_market",
    targetLocation: "US - National",
    productName: "Nvelop",
    targetRole: "Procurement / Sourcing Leader",
    difficultyLevel: "intermediate",
    sections: [
      {
        sectionType: "intro",
        title: "Opening & Pattern Interrupt",
        orderIndex: 0,
        content:
          "Hi [Prospect Name], this is Anuj from Nvelop — we make an AI procurement platform. I noticed you are [Title] at [Company] for about [Tenure]. Do you have 30 seconds?",
        talkingPoints:
          '["Use their name, title, and company to show you did research", "Mentioning their tenure shows personalization", "30 seconds is a micro-commitment that is easy to agree to", "Keep your tone conversational, not scripted"]',
        tips: "Do your homework before the call. Check LinkedIn for their title, tenure, and company. Personalization in the first 10 seconds determines whether they stay on the line.",
      },
      {
        sectionType: "discovery",
        title: "Social Proof & First Question",
        orderIndex: 1,
        content:
          "I have been speaking to [Same Title as Prospect] from [Same Industry] and they tell me that they are now involved in improving sourcing efficiency with the help of AI.\n\nFirst question: Are you also involved in improving sourcing efficiency?\n\nIF YES → Move to the second question.\n\nIF NO → \"Understood. Just out of curiosity — is that because you already have a solution handling this, or because procurement tooling isn't a priority right now?\"",
        talkingPoints:
          '["Lead with social proof from their peer group (same title, same industry)", "The first question is a simple yes/no that qualifies them instantly", "If they say no, the follow-up uncovers whether it is a timing issue or a priority issue", "Listen carefully — their reason for saying no tells you how to re-engage later"]',
        tips: "The social proof opener works because people trust peers in their role and industry. Have a real example ready if they ask who you spoke with.",
      },
      {
        sectionType: "pitch",
        title: "Pain Discovery & Value Proposition",
        orderIndex: 2,
        content:
          "Second question: What's the most time-consuming part of your procurement process right now — is it gathering stakeholder inputs, defining requirements, or evaluating vendors?\n\nIF THEY ANSWER:\n\"That's exactly what we hear from other [Industry] teams. Our platform automates [Issue Mentioned by Prospect]. A customer improved their sourcing cycle by 40% and saved money on the front end of sourcing. Worth 20 minutes on [Day] at [Time] to see how that could work at [Company]?\"\n\nIF THEY DON'T ANSWER / ARE VAGUE:\n\"What tool do you use today?\"",
        talkingPoints:
          '["Give them three options to choose from — easier than open-ended", "Mirror their answer back before pitching", "40% improvement is specific and credible", "If they are vague, pivot to asking about their current tool"]',
        tips: "The multiple-choice question technique works because it shows you understand their world and makes it easy to respond. Whatever they pick, connect it directly to what Nvelop solves.",
      },
      {
        sectionType: "objection_handling",
        title: "Differentiation & Objection Handling",
        orderIndex: 3,
        content:
          "The difference with Nvelop is that we're not a tool that generates reports for you to review — our AI is an agent that actually runs the sourcing, drafts the RFP, and evaluates proposals end-to-end. But I'd rather show you than tell you.\n\nOBJECTION: \"We already have a procurement tool.\"\nRESPONSE: \"Most teams do — the difference is those tools still need you to do the work. Nvelop's AI agent does the sourcing, writes the RFP, and evaluates vendors autonomously. It is not another dashboard — it is a team member. Worth 20 minutes to see the difference?\"\n\nOBJECTION: \"We are not looking at new tools right now.\"\nRESPONSE: \"Totally fair. Most of our customers were not actively looking either — they just saw a demo and realized how much manual work they could eliminate. No commitment, just a look. Would [Day] work?\"\n\nOBJECTION: \"Send me an email.\"\nRESPONSE: \"Happy to. So I can send something relevant — what is the biggest bottleneck in your sourcing process right now? That way I can tailor it to what actually matters to you.\"",
        talkingPoints:
          '["Lead with the key differentiator: AI agent vs. reporting tool", "Show don\'t tell — always push toward a demo", "For existing tool objection, reframe Nvelop as a team member not another tool", "For the email brush-off, use it to ask one more qualifying question"]',
        tips: "The agent vs. tool distinction is your strongest differentiator. Most competitors are dashboards and report generators. Nvelop actually does the work. Make this crystal clear.",
      },
      {
        sectionType: "close",
        title: "Call to Action",
        orderIndex: 4,
        content:
          "Would [Day] at [Time] work for a quick 20 minutes? I'll show you exactly how it handles [Their Specific Pain Point] — no commitment, just a look.",
        talkingPoints:
          '["Always offer a specific day and time — not open-ended", "20 minutes is low-commitment", "Reference their specific pain point from earlier in the call", "No commitment, just a look removes the pressure", "Send the calendar invite while still on the call"]',
        tips: "Always personalize the close with whatever pain point they mentioned earlier. Generic closes get generic responses. Send the calendar invite before hanging up.",
      },
    ],
  },
  {
    title: "Enterprise - CPO / Head of Procurement",
    description:
      "Enterprise cold call script targeting CPOs and Heads of Procurement at large companies. Focuses on process-level AI integration, compliance, and agent-based sourcing with MCP integrations.",
    industry: "enterprise",
    companySize: "enterprise",
    targetLocation: "Global",
    productName: "Nvelop",
    targetRole: "CPO / Head of Procurement",
    difficultyLevel: "advanced",
    sections: [
      {
        sectionType: "intro",
        title: "Enterprise Opening",
        orderIndex: 0,
        content:
          "Hi [Prospect Name], this is [Your Name] from Nvelop. I noticed you lead procurement at [Company]. Do you have 30 seconds?\n\nMost large companies already have procurement systems and are experimenting with AI.\n\nWhat we see, however, is that AI is often used at an individual level — not embedded into the sourcing workflow itself.\n\nWe've built a structured sourcing platform where AI is integrated directly into planning, requirements, RFP creation, and evaluation — so the impact is at process level, not just productivity level.\n\nThe result is faster sourcing cycles, stronger compliance, and self-service for business users.\n\nWould you be open to a short 20-minute discussion to see how this could complement your current setup?",
        talkingPoints:
          '[\"Acknowledge they already have systems — don\'t pitch as if they have nothing\", \"Distinguish individual AI usage vs. process-level AI integration\", \"Hit three outcomes: speed, compliance, self-service\", \"Position as complement, not replacement — reduces resistance\"]',
        tips: "Enterprise buyers are sophisticated. They know AI exists. Your edge is showing that Nvelop embeds AI into the workflow, not just as a co-pilot for individuals. Never sound like you are teaching them about AI.",
      },
      {
        sectionType: "discovery",
        title: "Agent-Based Sourcing Hook",
        orderIndex: 1,
        content:
          "IF THEY SHOW INTEREST:\n\nIn addition, we're currently building an agent-based sourcing solution for a major European enterprise.\n\nHere our agents are working as autonomous skills that are integrated into the client's other procurement systems.\n\nWould you be interested to hear about this too?\n\nIF YES → Move to the integration pitch.\n\nIF NOT YET CONVINCED:\n\"I understand. Quick question — where does your team spend the most time today: scoping requirements with stakeholders, managing the RFP process, or evaluating vendor responses?\"",
        talkingPoints:
          '[\"The European enterprise reference adds credibility without naming names\", \"Agent-based sourcing is a forward-looking concept that intrigues innovation-minded CPOs\", \"Autonomous skills integrated into existing systems — this is the key phrase\", \"If they are not convinced, pivot to a pain-discovery question\"]',
        tips: "The phrase 'autonomous skills integrated into existing systems' is powerful because it addresses the #1 enterprise concern: will this work with what we already have? Always land this point.",
      },
      {
        sectionType: "pitch",
        title: "Integration & MCP Approach",
        orderIndex: 2,
        content:
          "IF INTEGRATION IS RELEVANT:\n\nIf integration is relevant for you, we can also explain how we're using a standardized MCP approach to securely connect to existing procurement systems.\n\nThis means our AI agents can read from and write to your existing tools — SAP Ariba, Coupa, Jaggaer, whatever you use — without requiring a rip-and-replace.\n\nWe've designed it so your team gets AI-powered sourcing capabilities on top of your current stack.\n\nIF THEY ASK ABOUT MCP:\n\"MCP stands for Model Context Protocol. Think of it as a secure, standardized way for AI agents to interact with enterprise systems — similar to how APIs work, but designed specifically for AI-to-system communication. It means faster integration, better security, and no custom middleware.\"",
        talkingPoints:
          '[\"MCP is a differentiator — most competitors require custom integrations\", \"No rip-and-replace is the magic phrase for enterprise buyers\", \"Name their likely existing tools (Ariba, Coupa, Jaggaer) to show you know the space\", \"Position as an AI layer on top of their current stack\"]',
        tips: "Enterprise procurement leaders are terrified of rip-and-replace. The MCP integration story removes that fear. If they use SAP Ariba, mention it specifically. If you don't know their stack, ask.",
      },
      {
        sectionType: "objection_handling",
        title: "Enterprise Objection Handling",
        orderIndex: 3,
        content:
          "OBJECTION: \"We already use SAP Ariba / Coupa / Jaggaer.\"\nRESPONSE: \"Exactly — and we integrate with those. Nvelop's AI agents work on top of your existing system. We don't replace Ariba — we make it smarter. Our agents handle the sourcing workflow autonomously while your team stays in the tools they know.\"\n\nOBJECTION: \"We have an internal AI/digital team working on this.\"\nRESPONSE: \"That's great. What we've seen with other enterprises is that internal teams build great general-purpose AI tools, but sourcing-specific workflows — like RFP generation, weighted scoring, and multi-round evaluation — require domain expertise. We can complement what your team is building. Worth a conversation?\"\n\nOBJECTION: \"Security and compliance are concerns for us.\"\nRESPONSE: \"Absolutely — they should be. Our MCP-based integration approach is designed for enterprise security requirements. We can discuss SOC 2 compliance, data residency, and how we handle sensitive procurement data in the demo.\"\n\nOBJECTION: \"I need to involve my team / This isn't just my decision.\"\nRESPONSE: \"Of course. Would it make sense to set up a 20-minute overview for you and your key stakeholders? I can tailor it to your specific environment.\"",
        talkingPoints:
          '[\"For existing tools: position as an AI layer, not a replacement\", \"For internal AI teams: acknowledge their work, position Nvelop as domain-specific complement\", \"For security: show you take it seriously with specific compliance references\", \"For committee decisions: offer a group demo — don\'t push for solo decision\"]',
        tips: "Enterprise deals are always multi-stakeholder. When they say 'I need to involve my team,' that's actually a buying signal — they're thinking about how to move forward. Offer to make their life easier with a tailored group session.",
      },
      {
        sectionType: "close",
        title: "Enterprise Close",
        orderIndex: 4,
        content:
          "How about a 20-minute call on [Day] at [Time]? I'll walk you through the platform, show the agent-based workflow, and explain how the integration would work with [Their Current Tool / Stack].\n\nIf it makes sense, we can then set up a deeper session with your broader team.\n\nNo commitment — just a look at what process-level AI looks like in sourcing.",
        talkingPoints:
          '[\"Two-stage approach: 20-min intro for them, then broader team session\", \"Reference their specific tool/stack from earlier in the call\", \"Process-level AI is the key differentiator phrase — repeat it\", \"No commitment, just a look — low pressure close\"]',
        tips: "Enterprise closes should always suggest a two-step process: an initial overview for the decision-maker, then a deeper session for the team. This respects their process and shows you understand enterprise buying.",
      },
    ],
  },
  {
    title: "Enterprise - VP Strategic Sourcing (Compliance Focus)",
    description:
      "Enterprise script targeting VPs of Strategic Sourcing at large regulated companies. Emphasizes compliance, audit trails, governance, and structured AI within sourcing workflows.",
    industry: "enterprise",
    companySize: "enterprise",
    targetLocation: "Europe",
    productName: "Nvelop",
    targetRole: "VP Strategic Sourcing",
    difficultyLevel: "advanced",
    sections: [
      {
        sectionType: "intro",
        title: "Compliance-Led Opening",
        orderIndex: 0,
        content:
          "Hi [Prospect Name], this is [Your Name] from Nvelop. I see you lead strategic sourcing at [Company]. Do you have 30 seconds?\n\nWe work with large enterprises where sourcing compliance and governance are non-negotiable — regulated industries, multi-country operations, audit requirements.\n\nWhat we've built is a sourcing platform where AI is embedded into the process with full audit trails, structured workflows, and governance controls — so teams get the speed of AI without losing compliance.\n\nWould a short discussion be worthwhile to explore if this fits your environment?",
        talkingPoints:
          '[\"Lead with compliance — it is the #1 concern for regulated enterprises\", \"Mention multi-country operations to show you understand global complexity\", \"Full audit trails is a must-have phrase for this audience\", \"Speed of AI without losing compliance — this is the value proposition in one line\"]',
        tips: "In regulated industries (pharma, financial services, energy, defense), compliance is not a feature — it's a prerequisite. Lead with it. If you lead with AI speed and mention compliance as an afterthought, you lose credibility.",
      },
      {
        sectionType: "discovery",
        title: "Governance Pain Discovery",
        orderIndex: 1,
        content:
          "Quick question — when your team runs a sourcing event today, how much time goes into ensuring the process is compliant versus actually doing the sourcing work?\n\nIF THEY SAY A LOT / SIGNIFICANT:\n\"That's exactly what we hear. The documentation, the approvals, making sure everything is auditable — it often takes longer than the sourcing itself. Our platform automates the compliance layer so it happens by default.\"\n\nIF THEY SAY IT'S MANAGED:\n\"That's good. Is that because you've built strong processes internally, or because your current tooling enforces it? We've seen even well-managed teams save significant time when compliance is automated rather than manual.\"",
        talkingPoints:
          '[\"This question forces them to quantify the compliance burden\", \"Most teams underestimate how much time goes into compliance documentation\", \"Compliance by default is the key differentiator — it happens automatically\", \"If they say it is managed, dig deeper — manual processes are fragile\"]',
        tips: "The compliance time question is powerful because nobody tracks it explicitly. When they start thinking about it, they realize the burden is larger than expected. Let them arrive at that conclusion themselves.",
      },
      {
        sectionType: "pitch",
        title: "Structured AI with Governance",
        orderIndex: 2,
        content:
          "What makes Nvelop different is that every AI action in the sourcing process is logged, auditable, and governed by rules your team defines.\n\nThe AI doesn't freelance — it follows your sourcing policies, your approval workflows, your evaluation criteria. But it does the heavy lifting: drafting RFPs, scoring vendors, generating comparison reports.\n\nOne of our enterprise clients reduced their sourcing cycle from 12 weeks to 4 weeks while improving their audit scores.\n\nIF THEY ASK HOW:\n\"The platform creates a complete digital paper trail automatically. Every decision, every evaluation, every stakeholder input is captured and traceable. When audit comes, the documentation is already there.\"",
        talkingPoints:
          '[\"AI doesn\'t freelance — this reassures compliance-focused buyers\", \"Your rules, your workflows — Nvelop enforces them, not replaces them\", \"12 weeks to 4 weeks is a concrete proof point\", \"Digital paper trail automatically — this is what auditors love\"]',
        tips: "The phrase 'AI doesn't freelance' is intentionally provocative. It addresses the biggest fear compliance leaders have about AI: that it will do unpredictable things. Use this exact phrase.",
      },
      {
        sectionType: "objection_handling",
        title: "Compliance & Governance Objections",
        orderIndex: 3,
        content:
          "OBJECTION: \"Our compliance requirements are very specific to our industry.\"\nRESPONSE: \"They should be. Our platform is configurable — your compliance team defines the rules, approval gates, and documentation requirements. The AI follows them. We're not a one-size-fits-all solution — we're a framework that adapts to your governance model.\"\n\nOBJECTION: \"We can't have AI making procurement decisions.\"\nRESPONSE: \"Agreed — and that's not what we do. The AI handles the process work: drafting, scoring, comparing. Your team makes the decisions. Think of it as having a brilliant analyst who prepares everything perfectly but never signs off.\"\n\nOBJECTION: \"Where is the data stored? We have data residency requirements.\"\nRESPONSE: \"Good question. We support EU and regional data residency. We can walk through our data architecture in the demo — including how we handle sensitive procurement data, encryption, and access controls.\"",
        talkingPoints:
          '[\"For specific compliance: emphasize configurability, not generic compliance\", \"For AI decisions: reframe AI as analyst, not decision-maker\", \"For data residency: show you take it seriously with specific answers\", \"Never dismiss compliance concerns — validate them first\"]',
        tips: "The 'brilliant analyst who never signs off' analogy is perfect for compliance-concerned buyers. It makes AI feel safe and controlled. Use it every time someone worries about AI making decisions.",
      },
      {
        sectionType: "close",
        title: "Compliance-Aware Close",
        orderIndex: 4,
        content:
          "Would [Day] work for a 20-minute walkthrough? I can show you the audit trail, the governance controls, and how the AI works within your compliance framework.\n\nIf it looks relevant, we can then bring in your compliance and IT teams for a deeper technical review.\n\nNo commitment — I just want to show you what governed AI looks like in sourcing.",
        talkingPoints:
          '[\"Mention audit trail and governance controls in the close — it is what they care about\", \"Offer to include compliance and IT teams next — shows you understand the process\", \"Governed AI is the closing phrase — it captures the entire value prop\", \"Two-step process: overview first, then technical review\"]',
        tips: "Always offer to bring in their compliance and IT stakeholders as a second step. This shows you understand enterprise buying and aren't trying to bypass governance.",
      },
    ],
  },
  {
    title: "Enterprise - Director Procurement Technology",
    description:
      "Enterprise script for Directors of Procurement Technology / Digital Procurement. Focuses on technology integration, agent architecture, and digital transformation of sourcing.",
    industry: "enterprise",
    companySize: "enterprise",
    targetLocation: "Global",
    productName: "Nvelop",
    targetRole: "Director of Procurement Technology",
    difficultyLevel: "advanced",
    sections: [
      {
        sectionType: "intro",
        title: "Technology-Led Opening",
        orderIndex: 0,
        content:
          "Hi [Prospect Name], this is [Your Name] from Nvelop. I see you're leading procurement technology at [Company]. Do you have 30 seconds?\n\nI'm reaching out because we've built something that's architecturally different from the procurement AI tools on the market.\n\nMost solutions add AI as a feature on top of existing platforms. We've built AI agents that can autonomously execute sourcing workflows — from scope definition through RFP to vendor evaluation — while integrating into your existing tech stack through a standardized MCP protocol.\n\nWould a short technical discussion be interesting for you?",
        talkingPoints:
          '[\"Lead with architecture — this audience cares about how it is built\", \"Architecturally different immediately signals this is not another bolt-on\", \"Autonomous sourcing workflows is the key capability to land\", \"MCP protocol shows technical depth and standards-based thinking\"]',
        tips: "Procurement technology leaders are the most technically sophisticated audience you'll call. They want to know HOW it works, not just WHAT it does. Lead with architecture, not benefits.",
      },
      {
        sectionType: "discovery",
        title: "Tech Stack Discovery",
        orderIndex: 1,
        content:
          "Quick question — what does your current procurement technology landscape look like? Are you primarily on Ariba, Coupa, or something else?\n\nIF THEY ANSWER:\n\"Got it. And when it comes to AI — are you building internally, using vendor features, or evaluating specialized solutions?\"\n\nIF THEY'RE EVALUATING:\n\"Interesting. What we find is that most procurement AI falls into two categories: co-pilot features embedded in existing platforms, or standalone point solutions. We're in a third category — agent-based AI that works across systems. That's what I'd love to show you.\"",
        talkingPoints:
          '[\"Ask about their tech stack first — shows you care about integration\", \"The AI maturity question tells you where they are in their journey\", \"Three categories framing positions Nvelop as uniquely different\", \"Agent-based AI that works across systems — this is the differentiator for tech leaders\"]',
        tips: "This audience judges you on technical credibility in the first 60 seconds. Asking about their stack before pitching shows respect and competence. Never assume they use a specific tool.",
      },
      {
        sectionType: "pitch",
        title: "Agent Architecture & MCP",
        orderIndex: 2,
        content:
          "Here's what makes our approach different technically:\n\nOur AI agents are built as autonomous skills — each one handles a specific part of the sourcing process. Scope definition, requirements gathering, RFP generation, vendor evaluation — each is a discrete agent.\n\nThese agents connect to your existing systems through MCP — Model Context Protocol. It's a standardized interface for AI-to-system communication. Think of it as a secure API layer purpose-built for AI agents.\n\nThis means we can read from and write to your [Their Current Tool] without custom middleware or extensive integration projects.\n\nWe're currently deploying this architecture for a major European enterprise — their agents autonomously handle sourcing events while staying connected to their existing procurement suite.",
        talkingPoints:
          '[\"Autonomous skills is the technical framing — each agent does one thing well\", \"MCP as a standardized interface — appeals to enterprise architecture thinking\", \"No custom middleware is the key integration benefit\", \"The European enterprise reference adds production credibility\"]',
        tips: "Procurement tech leaders love architectural clarity. The discrete agent model resonates because it maps to how they think about systems: modular, composable, standards-based. Don't oversimplify — they want the detail.",
      },
      {
        sectionType: "objection_handling",
        title: "Technical Objections",
        orderIndex: 3,
        content:
          "OBJECTION: \"Our platform vendor (Ariba/Coupa) already has AI features.\"\nRESPONSE: \"They do — and they're useful for in-platform tasks. But those are co-pilot features within a single system. Our agents work across systems and can autonomously execute multi-step workflows. It's the difference between AI that helps you click buttons faster and AI that does the work.\"\n\nOBJECTION: \"We're building AI capabilities internally.\"\nRESPONSE: \"Smart. What we've found is that internal teams are great at building general-purpose AI tooling, but sourcing-specific agents need domain knowledge — RFP structures, evaluation frameworks, category strategies. We bring that domain layer so your team can focus on infrastructure.\"\n\nOBJECTION: \"MCP is new — how mature is this?\"\nRESPONSE: \"Fair question. MCP was developed by Anthropic and is gaining adoption across the enterprise AI space. We're early adopters specifically because it solves the integration problem procurement has always had. I can walk you through our implementation in the demo.\"\n\nOBJECTION: \"What about data security and access control?\"\nRESPONSE: \"The MCP approach includes built-in authentication and scoped access. Our agents only access what they're explicitly permitted to — defined by your team. We can go deep on the security model in a technical session.\"",
        talkingPoints:
          '[\"For vendor AI: co-pilot vs. autonomous agent is the key distinction\", \"For internal builds: position as domain layer, not competing infrastructure\", \"For MCP maturity: acknowledge it is new, but frame as strategic advantage\", \"For security: built-in auth and scoped access — shows enterprise thinking\"]',
        tips: "The co-pilot vs. autonomous agent distinction is your strongest technical argument. Every major procurement platform is adding 'AI features' — but they're all in-platform co-pilots. Nvelop agents work across systems and execute workflows. Make this distinction razor sharp.",
      },
      {
        sectionType: "close",
        title: "Technical Close",
        orderIndex: 4,
        content:
          "Would [Day] work for a 25-minute technical walkthrough? I can show you the agent architecture, the MCP integration model, and a live demo of an autonomous sourcing event.\n\nIf your solution architect or enterprise architect would benefit from joining, happy to make it a joint session.\n\nNo commitment — just a look at what agent-based sourcing looks like in practice.",
        talkingPoints:
          '[\"25 minutes signals slightly more depth for a technical audience\", \"Offer to include their architect — shows enterprise awareness\", \"Live demo of autonomous sourcing event is the hook\", \"Agent-based sourcing in practice — concrete, not theoretical\"]',
        tips: "Technical buyers want to see it work, not hear about it. Always push toward a live demo. And inviting their architect signals you're ready for technical scrutiny — which builds confidence.",
      },
    ],
  },
  {
    title: "Mid-Market - Procurement Manager (Team Efficiency)",
    description:
      "Mid-market script for Procurement Managers at companies with 500-5000 employees. Focuses on helping smaller teams do more with AI-guided sourcing across categories.",
    industry: "manufacturing",
    companySize: "mid_market",
    targetLocation: "US - National",
    productName: "Nvelop",
    targetRole: "Procurement Manager",
    difficultyLevel: "intermediate",
    sections: [
      {
        sectionType: "intro",
        title: "Mid-Market Opening",
        orderIndex: 0,
        content:
          "Hi [Prospect Name], this is [Your Name] from Nvelop. I see you manage procurement at [Company]. Do you have 30 seconds?\n\nWe see many mid-sized companies are starting to use AI, but sourcing is still largely manual — difficult to engage business stakeholders, Excel comparisons, lots of emails.\n\nWe've built an end-to-end sourcing platform where AI supports the entire process — from scope definition to vendor evaluation — giving smaller teams structured guidance across different categories.\n\nWould it be worth a short discussion to see whether our AI platform could support your team?",
        talkingPoints:
          '[\"Name the specific pains: manual sourcing, Excel, emails — they will nod along\", \"Smaller teams is empathetic framing — mid-market teams are always resource-constrained\", \"Structured guidance across categories — shows the platform scales with them\", \"Support not replace — mid-market buyers want help, not disruption\"]',
        tips: "Mid-market procurement teams are usually 3-10 people doing the work of 30. They don't need to hear about transformation — they need to hear about getting more done with less. Lead with empathy for their resource constraints.",
      },
      {
        sectionType: "discovery",
        title: "Pain Discovery — Team Capacity",
        orderIndex: 1,
        content:
          "Quick question — how many sourcing events does your team typically run per quarter? And how much of that is still done through spreadsheets and email?\n\nIF THEY SHARE NUMBERS:\n\"That's what we hear a lot. Teams running [X] events with [Y] people — and most of the time goes into the process, not the strategy. Our platform handles the process work so your team can focus on what actually matters.\"\n\nIF THEY'RE VAGUE:\n\"No worries. The reason I ask is that most mid-sized teams tell us 60-70% of their time goes into process work — gathering inputs, formatting documents, chasing stakeholders. Sound familiar?\"",
        talkingPoints:
          '[\"Quantify their workload — events per quarter, team size\", \"60-70% on process work is a stat that resonates with every mid-market team\", \"Process vs. strategy framing — they want to do more strategy\", \"Gathering inputs, formatting documents, chasing stakeholders — these are their daily frustrations\"]',
        tips: "Mid-market procurement people are doers, not strategists — because they don't have time to be strategic. When you say 'so your team can focus on what actually matters,' you're speaking to their deepest frustration.",
      },
      {
        sectionType: "pitch",
        title: "End-to-End AI Support",
        orderIndex: 2,
        content:
          "Here's how Nvelop helps mid-sized teams specifically:\n\nThe platform guides you through the entire sourcing process — define the scope with stakeholders, generate requirements automatically, create the RFP, send it out, and evaluate vendor responses with AI-powered scoring.\n\nYour business users can self-service the early stages — like defining what they need — without your team having to chase them. The AI structures their input so it's usable for sourcing.\n\nOne mid-market customer went from 8-week sourcing cycles to 3 weeks and was able to handle 40% more events with the same team.\n\nIF THEY ASK ABOUT CATEGORIES:\n\"The platform works across categories — IT, professional services, facilities, marketing. The AI adapts the templates and evaluation criteria based on the category.\"",
        talkingPoints:
          '[\"Self-service for business users is a game-changer for mid-market — removes the bottleneck\", \"8 weeks to 3 weeks is a concrete, believable improvement\", \"40% more events with same team — this is the capacity argument\", \"Cross-category support shows it is not a niche tool\"]',
        tips: "The self-service angle is your strongest pitch for mid-market. Their biggest pain is chasing stakeholders for inputs. When you say 'business users can self-service,' their eyes light up. Make sure to land this point.",
      },
      {
        sectionType: "objection_handling",
        title: "Mid-Market Objections",
        orderIndex: 3,
        content:
          "OBJECTION: \"We don't have the budget for a procurement platform.\"\nRESPONSE: \"I get it — budget is always tight. What our mid-market customers find is that the platform pays for itself within the first two sourcing events through time savings alone. We're not enterprise pricing — we've designed our model for teams your size. Worth a look?\"\n\nOBJECTION: \"We're too small for a procurement platform.\"\nRESPONSE: \"Actually, that's exactly who we built this for. The platform gives a 5-person team the capability of a 20-person team. It's not about being big enough — it's about not needing to be big. Quick demo?\"\n\nOBJECTION: \"We use spreadsheets and they work fine.\"\nRESPONSE: \"Spreadsheets are great for analysis. But for running a structured sourcing process — stakeholder inputs, vendor communication, evaluation scoring — they create a lot of manual work. Our platform keeps the flexibility you like but adds structure where it matters. Let me show you the difference?\"\n\nOBJECTION: \"I don't have time for a demo right now.\"\nRESPONSE: \"Totally understand — that's exactly the problem we solve. Can we book 20 minutes next week? I'll make it worth your time.\"",
        talkingPoints:
          '[\"For budget: pays for itself in two events is concrete ROI\", \"For too small: 5-person team = 20-person capability — this is the power argument\", \"For spreadsheets: don\'t attack spreadsheets — acknowledge and build on them\", \"For no time: validate their busyness, it is the problem you solve\"]',
        tips: "Mid-market objections are usually about budget and size. Never make them feel small. Reframe: the platform is DESIGNED for teams like theirs. The 5-person = 20-person line is your strongest response.",
      },
      {
        sectionType: "close",
        title: "Mid-Market Close",
        orderIndex: 4,
        content:
          "How about a quick 20 minutes on [Day]? I'll show you how the platform works for a team like yours — the self-service stakeholder intake, the AI-generated RFPs, and the vendor evaluation.\n\nYou'll see in 20 minutes whether it could save your team time.\n\nNo commitment, no pressure — just a look.",
        talkingPoints:
          '[\"20 minutes is the sweet spot for mid-market — they are busy\", \"Name three specific things they will see — makes it concrete\", \"You\'ll see in 20 minutes whether it could save time — outcome-focused\", \"No commitment, no pressure — essential for mid-market where trust is earned\"]',
        tips: "Mid-market closes should be casual and low-pressure. These are people doing real work every day — they'll take a meeting if you earned their trust in the call. Don't oversell.",
      },
    ],
  },
  {
    title: "Mid-Market - Head of Procurement (Category Growth)",
    description:
      "Mid-market script for Heads of Procurement at growing companies looking to bring structure to sourcing across new categories as they scale.",
    industry: "technology",
    companySize: "mid_market",
    targetLocation: "Europe",
    productName: "Nvelop",
    targetRole: "Head of Procurement",
    difficultyLevel: "intermediate",
    sections: [
      {
        sectionType: "intro",
        title: "Growth-Stage Opening",
        orderIndex: 0,
        content:
          "Hi [Prospect Name], this is [Your Name] from Nvelop. I noticed you lead procurement at [Company] — looks like you've been growing. Do you have 30 seconds?\n\nWe work with mid-sized companies that are scaling their procurement function — where the team is handling more categories, more spend, more stakeholders, but headcount hasn't kept pace.\n\nWe've built an AI sourcing platform that helps teams scale without scaling headcount — structured workflows, AI-generated RFPs, and self-service for business users.\n\nWould a short conversation be useful?",
        talkingPoints:
          '[\"Reference their growth — shows you did research\", \"More categories, more spend, more stakeholders but same team — this is their reality\", \"Scale without scaling headcount — this is the value prop in one line\", \"Self-service for business users addresses their bottleneck\"]',
        tips: "Growing mid-market companies have a specific pain: procurement scope is expanding faster than the team. Reference their growth trajectory from LinkedIn or news articles to personalize the opening.",
      },
      {
        sectionType: "discovery",
        title: "Scaling Pain Discovery",
        orderIndex: 1,
        content:
          "Quick question — as [Company] has grown, which new categories have been the hardest to bring structure to? Is it IT, professional services, or something else?\n\nIF THEY ANSWER:\n\"Interesting. And when you run sourcing for [Category], do you have a standard process, or does it vary depending on who's running it?\"\n\nIF IT VARIES:\n\"That's exactly the challenge. When there's no standard process, every sourcing event is reinvented from scratch. Our platform creates that structure automatically — category-appropriate templates, evaluation criteria, stakeholder workflows — so quality is consistent regardless of who runs it.\"",
        talkingPoints:
          '[\"Category-specific question shows domain knowledge\", \"Standardization vs. ad-hoc is the core pain for growing teams\", \"Every event reinvented from scratch — this phrase resonates\", \"Consistent quality regardless of who runs it — this is the promise\"]',
        tips: "Growing companies often have one senior person who runs good processes and everyone else who wings it. The standardization angle helps them scale the knowledge of their best person across the whole team.",
      },
      {
        sectionType: "pitch",
        title: "Scaling Procurement with AI",
        orderIndex: 2,
        content:
          "Here's how Nvelop helps growing procurement teams:\n\nWhen a new sourcing event starts, the AI automatically suggests the right template, evaluation criteria, and workflow based on the category and spend level. Your team doesn't need to start from scratch.\n\nBusiness users submit their requirements through a guided intake — the AI structures their input into something your team can actually work with. No more chasing people for incomplete briefs.\n\nAnd as you add new categories, the platform scales with you — same process, same quality, more coverage.\n\nOne growing tech company went from covering 30% of their spend through structured sourcing to 70% within six months of using the platform.",
        talkingPoints:
          '[\"Auto-suggested templates and criteria — removes the cold-start problem\", \"Guided intake for business users — eliminates the incomplete brief problem\", \"Same process, same quality, more coverage — the scaling promise\", \"30% to 70% spend coverage is a concrete growth metric\"]',
        tips: "The 30% to 70% spend coverage stat is powerful because most mid-market procurement teams know they only cover a fraction of company spend through proper sourcing. It speaks directly to their mandate to bring more spend under management.",
      },
      {
        sectionType: "objection_handling",
        title: "Growth-Stage Objections",
        orderIndex: 3,
        content:
          "OBJECTION: \"We're still building our procurement function — it might be too early.\"\nRESPONSE: \"That's actually the best time. Building on a structured platform from the start means you don't create bad habits that are hard to change later. We can grow with you — start with one category and expand as you're ready.\"\n\nOBJECTION: \"We need to hire more people first.\"\nRESPONSE: \"I hear that a lot. But what if you could handle the next 2-3 categories with your current team? Our platform is designed to give a small team big-team capability. That might actually change when and who you need to hire.\"\n\nOBJECTION: \"Our stakeholders won't use a new tool.\"\nRESPONSE: \"Great concern. The intake experience for business users is designed to be simpler than email — they answer guided questions, the AI does the rest. We see adoption rates above 80% because it's actually easier than the current process.\"",
        talkingPoints:
          '[\"For too early: building right from the start prevents technical debt\", \"For hiring: reframe — platform changes the hiring equation\", \"For stakeholder adoption: 80% adoption rate and simpler than email\", \"Start with one category — low-risk entry point\"]',
        tips: "Growing companies are cautious about adding tools too early. The 'start with one category' approach reduces risk and lets them prove value before committing broadly.",
      },
      {
        sectionType: "close",
        title: "Growth-Focused Close",
        orderIndex: 4,
        content:
          "Would [Day] work for 20 minutes? I can show you how the platform works for a team at your stage — starting lean and scaling up as your procurement scope grows.\n\nI'll tailor it to [Category They Mentioned] so you can see exactly how it would work for your next sourcing event.\n\nNo commitment — just a look at what structured sourcing could look like at [Company].",
        talkingPoints:
          '[\"At your stage shows empathy for where they are in their journey\", \"Tailor to their specific category — personalization in the close\", \"Next sourcing event — makes it immediate and practical\", \"Structured sourcing at [Company] — paints a picture of the future state\"]',
        tips: "Always tailor the close to the specific category or pain they mentioned earlier. A generic close feels disconnected. A personalized close shows you were listening.",
      },
    ],
  },
];
