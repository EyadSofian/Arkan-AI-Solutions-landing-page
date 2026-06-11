// ── English content ─────────────────────────────────────────────────────
// Voice: direct, business-first, technically grounded, zero hype.
// Outcomes lead; technologies appear only as supporting evidence.

export const en = {
  meta: {
    title: "Arkan AI Solutions — the structure your operations run on",
    description:
      "Arkan builds the AI systems your operations run on: Arabic-first agents, dependable automation and integrations that connect WhatsApp, Odoo, Shopify and your CRM into one operation that works in production. Start with a systems assessment.",
    ogTitle: "Arkan AI Solutions — the structure your operations run on",
    ogDescription:
      "Arabic-first AI systems, automation and integration — designed, built and operated in production across Egypt, Saudi Arabia and the UAE.",
  },

  nav: {
    links: [
      { id: "solutions", label: "Solutions" },
      { id: "how", label: "How it works" },
      { id: "results", label: "Results" },
      { id: "process", label: "Process" },
      { id: "faq", label: "FAQ" },
    ],
    cta: "Request an assessment",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    themeToggle: "Toggle color theme",
    langToggle: "التبديل إلى العربية",
    langShort: "ع",
    skip: "Skip to main content",
  },

  hero: {
    eyebrow: "Arabic-first AI systems · Egypt · Saudi Arabia · UAE",
    h1Pre: "The structure your operations",
    h1Em: "run on.",
    sub: "Arkan designs, builds and operates Arabic-first AI agents, dependable automation and the integrations that connect your tools — WhatsApp, Odoo, Shopify, your CRM — into one operation that holds together in production.",
    ctaPrimary: "Request a systems assessment",
    ctaSecondary: "See how a system works",
    proofTitle: "Running in production today",
    proof: [
      { num: "40,000+", label: "customer contacts migrated with zero downtime" },
      { num: "19", label: "automated workflows in daily operation" },
      { num: "8", label: "platforms integrated and in active use" },
      { num: "AR · EN", label: "bilingual by design, dialects included" },
    ],
  },

  trust: {
    line: "We build inside the systems you already run",
    items: ["Odoo", "Shopify", "WhatsApp Business", "n8n", "Chatwoot", "Botpress", "Salla · Zid", "HubSpot"],
  },

  diagram: {
    aria: "Diagram: customer channels — WhatsApp, web chat, phone and email — flow into the Arkan layer of AI agents and automation, which connects to Odoo ERP, CRM, the online store and reporting.",
    sourcesLabel: "Your channels",
    outputsLabel: "Your systems",
    sources: [
      { label: "WhatsApp", sub: "BUSINESS" },
      { label: "Web chat", sub: "WEBSITE" },
      { label: "Phone", sub: "PBX / CALLS" },
      { label: "Email", sub: "INBOX" },
    ],
    core: { title: "Arkan layer", sub: "AGENTS · AUTOMATION" },
    coreLive: "LIVE · IN PRODUCTION",
    outputs: [
      { label: "Odoo / ERP", sub: "OPERATIONS" },
      { label: "CRM", sub: "SALES" },
      { label: "Store", sub: "SHOPIFY · SALLA" },
      { label: "Reports", sub: "MANAGEMENT" },
    ],
    caption: "From scattered channels to one connected operation.",
  },

  problems: {
    label: "01 — The problems we solve",
    title: "Sound familiar?",
    lead: "Most companies that call us aren't looking for “AI”. They're losing hours and customers to one of these four situations.",
    items: [
      {
        pain: "“Our support team is drowning in repeated messages.”",
        detail:
          "Hundreds of WhatsApp and Instagram messages a day — most of them the same questions — while customers wait hours for a reply.",
        fix: "An Arabic-first agent answers routine questions in seconds, around the clock, and hands the complex cases to your team with full context.",
        pillar: "Pillar I — AI agents",
      },
      {
        pain: "“Staff re-type the same data into three systems.”",
        detail:
          "An order arrives in the store, gets copied to a spreadsheet, then into accounting. Every copy is a chance for an error — and a salary spent on copying.",
        fix: "Automation moves data between your systems instantly and accurately, with alerts the moment anything fails.",
        pillar: "Pillar II — Automation",
      },
      {
        pain: "“Leads come in from everywhere and quietly die.”",
        detail:
          "Inquiries arrive from ads, WhatsApp and the website. Without fast follow-up and qualification, they end up with whoever answered first — usually a competitor.",
        fix: "Every inquiry is captured, qualified and delivered to your sales team with context — within minutes, not days.",
        pillar: "Pillars I + IV — Agents + integration",
      },
      {
        pain: "“Our systems don't talk to each other.”",
        detail:
          "The store is in one place, accounting in another, customer service in a third. Nobody sees the full picture, and reconciliation eats entire days.",
        fix: "Integrations connect the tools you already use into one operation with a single source of truth.",
        pillar: "Pillar IV — Systems integration",
      },
    ],
  },

  solutions: {
    label: "02 — What we build",
    title: "Four pillars. One connected operation.",
    lead: "In Arabic, “arkan” are the pillars a structure stands on. We build four of them inside your business — separately or as one system.",
    items: [
      {
        num: "I",
        name: "AI Agents",
        outcome: "Answer every customer in seconds — in their Arabic",
        desc: "Conversational agents for support, sales and internal operations. They understand dialects, answer from your company's real knowledge, and hand sensitive cases to a human at exactly the right moment.",
        typical: [
          "Automatic replies to WhatsApp and Instagram inquiries",
          "Lead qualification before a salesperson ever joins",
          "An internal assistant that answers staff from company files",
        ],
        tech: ["Botpress", "Chatwoot", "WhatsApp Business", "OpenAI · Claude"],
      },
      {
        num: "II",
        name: "Workflow Automation",
        outcome: "Stop doing repetitive work by hand",
        desc: "Dependable process automation — from order entry to recurring reports — built on self-hosted n8n with error handling and retries, so it keeps working through the messy edge cases.",
        typical: [
          "Orders synced between store, accounting and inventory",
          "Daily reports that land in management inboxes on their own",
          "Instant alerts the moment any step fails",
        ],
        tech: ["n8n", "Webhooks", "APIs", "Self-hosted infrastructure"],
      },
      {
        num: "III",
        name: "Custom AI Solutions",
        outcome: "AI built around your domain, not a generic demo",
        desc: "When off-the-shelf doesn't fit: assistants that answer from your documents and contracts, voice pipelines that process calls, computer vision and document intelligence — designed around your data.",
        typical: [
          "An assistant that answers from your contracts and manuals",
          "Sales calls transcribed, scored and indexed automatically",
          "Data extracted from documents into your systems",
        ],
        tech: ["RAG (answers from your documents)", "Whisper (speech-to-text)", "Computer vision"],
      },
      {
        num: "IV",
        name: "Systems Integration",
        outcome: "Make your systems finally talk to each other",
        desc: "We connect what you actually use — Odoo, Shopify, WhatsApp Business, Chatwoot, phone systems and custom software — with bridges built to survive vendor updates and to log what really happened.",
        typical: [
          "Store connected to accounting and inventory in real time",
          "All conversation channels unified in one inbox",
          "Phone PBX linked to customer records and call history",
        ],
        tech: ["Odoo", "Shopify", "Salla · Zid", "PBX", "REST APIs"],
      },
    ],
    discuss: "Discuss this pillar",
  },

  anatomy: {
    label: "03 — How it works",
    title: "Inside one Arkan system.",
    lead: "A customer messages you on WhatsApp. Here is what happens in the seconds that follow — step by step.",
    steps: [
      {
        title: "The customer asks",
        short: "A WhatsApp message arrives, in dialect, at any hour",
        body: "“Where is my order?” — sent at 11pm, in Egyptian Arabic. No forms, no apps; the channel your customer already uses.",
        msg: "“لو سمحت، فين طلبي؟ 🙏”",
        tech: "WhatsApp Business API · unified inbox",
      },
      {
        title: "The agent understands",
        short: "Language, intent and customer identity are resolved",
        body: "The agent detects the language and what is being asked, then recognizes the customer from your records — order history included. No “please repeat your order number”.",
        msg: "Identified: returning customer · open order #4571",
        tech: "Intent detection · customer record lookup",
      },
      {
        title: "The system checks the facts",
        short: "Live data is pulled from your store or shipping system",
        body: "Instead of a generic reply, the agent queries your actual systems — store, shipping, ERP — for this customer's real order status.",
        msg: "Order #4571 → out for delivery, expected today",
        tech: "Live API queries · no canned answers",
      },
      {
        title: "The reply lands in seconds",
        short: "Accurate answer in the customer's language — or a human takes over",
        body: "The customer gets a precise answer in their own dialect. If the case is complex or sensitive, the conversation is handed to your team with the full history attached — the customer never repeats themselves.",
        msg: "“طلبك خرج للتوصيل وهيوصلك النهارده إن شاء الله ✅”",
        tech: "Human handoff with full context when needed",
      },
      {
        title: "Everything is recorded",
        short: "CRM updated, reports written — by nobody",
        body: "The conversation, the outcome and the response time are logged to your CRM automatically. Management sees the numbers without anyone writing a report.",
        msg: "CRM updated · ticket closed · CSAT requested",
        tech: "Automatic CRM sync · management dashboards",
      },
    ],
    note: "This is one example. We design the system around your operation — support, sales, back office or all three.",
    cta: "Discuss your use case",
  },

  results: {
    label: "04 — Production work",
    title: "Systems running in production. Today.",
    lead: "Not demos, not slideware. Three systems we built and operate — names available on request in your assessment session.",
    cases: [
      {
        tag: "Retail & customer service",
        client: "Client name on request",
        title: "Bilingual customer service without the queue",
        problem:
          "A support team buried in Arabic and English messages across disconnected channels, with customer history scattered between systems.",
        built:
          "One unified operation: an Arabic-first agent answers instantly, hands over to staff seamlessly when needed, and syncs everything with the customer record — including migrating 40,000 contacts with zero downtime.",
        systems: ["Chatwoot", "Botpress", "Odoo", "WhatsApp"],
        metrics: [
          { num: "40k+", label: "contacts migrated, zero downtime" },
          { num: "99.7%", label: "system availability" },
          { num: "~2.4s", label: "average automated response" },
        ],
        context: "In production, operated by Arkan",
      },
      {
        tag: "B2B sales operations",
        client: "Client name on request",
        title: "Every sales call becomes usable data",
        problem:
          "Dozens of sales calls a day vanishing without a trace — no structured records, no follow-up, no management view of call quality.",
        built:
          "A pipeline that transcribes every call, scores it, attaches it to the right opportunity in the CRM, and sends the supervisor a coaching summary.",
        systems: ["Yeastar PBX", "Whisper", "Odoo CRM"],
        metrics: [
          { num: "100%", label: "of calls transcribed & indexed" },
          { num: "12", label: "CRM fields updated automatically" },
          { num: "AR", label: "native dialect handling" },
        ],
        context: "In production, operated by Arkan",
      },
      {
        tag: "Recruitment · SaaS product",
        client: "Productized system",
        title: "A hiring department that runs itself",
        problem:
          "Small companies without recruiters spending weeks on sourcing, screening and interview scheduling — all by hand.",
        built:
          "Nineteen orchestrated workflows that source candidates from multiple channels, screen them and book interviews — multi-tenant, sold as a product.",
        systems: ["n8n", "LinkedIn enrichment", "Google Workspace"],
        metrics: [
          { num: "19", label: "orchestrated workflows" },
          { num: "3", label: "companies using it today" },
          { num: "SaaS", label: "productized & multi-tenant" },
        ],
        context: "Live product with paying tenants",
      },
    ],
    discuss: "Discuss a similar system",
    note: "Results are shown with their context. Deeper detail — architecture, costs, timelines — is shared in the assessment session.",
  },

  process: {
    label: "05 — How we engage",
    title: "From first call to a running system.",
    lead: "A four-stage engagement built for production outcomes — with a written, fixed-scope proposal before any build begins.",
    stages: [
      {
        num: "01",
        name: "Assess",
        desc: "A 30-minute call, then a structured audit: where time is lost, what systems exist, and what each automation opportunity is actually worth.",
        deliverable: "Opportunity map + a frank recommendation — even if it's “you don't need AI yet”.",
        time: "1–2 weeks",
      },
      {
        num: "02",
        name: "Architect",
        desc: "The system designed on paper before any code: integrations, data flow, where humans stay in the loop, and how it will be operated.",
        deliverable: "Architecture blueprint + fixed-scope, fixed-price proposal.",
        time: "1 week",
      },
      {
        num: "03",
        name: "Build",
        desc: "Iterative delivery every two weeks on a real environment, with end-to-end testing and training for your team before go-live.",
        deliverable: "A working system on your infrastructure or ours — code and access are yours.",
        time: "Scope-dependent",
      },
      {
        num: "04",
        name: "Operate",
        desc: "After launch: monitoring, incident response and continuous improvement. Real systems need someone running them — that's the part most agencies skip.",
        deliverable: "30 days of support included, then an optional monthly operations retainer.",
        time: "Ongoing",
      },
    ],
  },

  why: {
    label: "06 — Why Arkan",
    title: "Built for this market. Built to last.",
    items: [
      {
        title: "Arabic by design, not by translation",
        desc: "Agents that genuinely handle Egyptian, Gulf and Modern Standard Arabic, and interfaces composed for RTL from the start — because the Arab market is our home market.",
      },
      {
        title: "We build inside your stack, not beside it",
        desc: "No new tool for your team to babysit. We wire intelligence into Odoo, Shopify, WhatsApp and whatever you already run.",
      },
      {
        title: "Everything we build is yours",
        desc: "Self-hosted on your infrastructure or ours, documented code, no vendor lock-in. You could walk away — we bet you won't want to.",
      },
      {
        title: "We operate after we deliver",
        desc: "The project doesn't end at launch. Monitoring, incident response, continuous tuning — systems that still work in month ten are our benchmark.",
      },
    ],
    quote: "“If AI isn't the right answer to your problem — we'll tell you, plainly.”",
    quoteAttr: "A founding principle, not a slogan",
  },

  faq: {
    label: "07 — Frequently asked",
    title: "Direct questions, direct answers.",
    items: [
      {
        q: "How long does a typical project take?",
        a: "Most projects run 8–16 weeks from assessment to launch; simpler builds finish in 4–6. You get a specific timeline in the written proposal, before anything is built.",
      },
      {
        q: "Do you integrate with our existing systems?",
        a: "Yes — Odoo, Shopify, Salla, Zid, HubSpot, Salesforce, WhatsApp Business, Chatwoot, phone PBX systems, and anything that exposes a REST API or webhooks. If your system is custom, we build the bridge ourselves.",
      },
      {
        q: "Where is the system hosted, and who owns it?",
        a: "On your infrastructure, or on self-hosted infrastructure we manage for you. Either way: the code, the data and the access are fully yours. No vendor lock-in.",
      },
      {
        q: "Does it really handle Arabic dialects?",
        a: "Yes — Modern Standard, Egyptian, Saudi and Gulf dialects, plus English, with automatic language detection. We can also tune models on the terminology of your specific industry.",
      },
      {
        q: "Our data is sensitive. How is it handled?",
        a: "Fully self-hosted options keep data inside your own infrastructure, with least-privilege access. Your data is never used to train public models.",
      },
      {
        q: "What happens after launch?",
        a: "Every project includes 30 days of operational support. After that, an optional monthly retainer covers monitoring, incident response and continuous improvement.",
      },
      {
        q: "How is pricing determined?",
        a: "After the assessment you receive a written proposal with a fixed scope and a fixed price — before we start. No open-ended billing, no surprise invoices.",
      },
    ],
  },

  finalCta: {
    label: "08 — Next step",
    title: "Start with a systems assessment.",
    sub: "Thirty minutes with a solutions architect: we map your operation, identify the fastest automation win with a real return, and tell you honestly if AI isn't the sensible option yet.",
    cta: "Request a systems assessment",
    reassure: "No commitment — and no budget questions.",
    altWhatsApp: "Message us on WhatsApp",
    altEmail: "Email us",
    altCalendar: "Or book a slot directly in the calendar",
  },

  form: {
    title: "Request your systems assessment",
    sub: "Three short steps — under two minutes.",
    stepLabel: (n, total) => `Step ${n} of ${total}`,
    back: "Back",
    next: "Continue",
    submit: "Request the assessment",
    submitting: "Sending…",
    close: "Close",
    steps: [
      {
        title: "About you and your company",
        why: "So we know who we're talking to and can prepare properly for the session.",
      },
      {
        title: "What do you want to improve?",
        why: "Choose everything that applies — it decides which specialist joins your session.",
      },
      {
        title: "A little context",
        why: "All optional — but it makes the session sharper and faster.",
      },
    ],
    fields: {
      name: "Your name",
      company: "Company name",
      email: "Work email",
      phone: "Phone / WhatsApp",
      phoneHint: "Optional — fastest way to coordinate",
      industry: "Industry",
      industryHint: "Optional",
      industryPlaceholder: "Select your industry…",
      systems: "Systems you currently use",
      systemsHint: "Optional — select any",
      bottleneck: "What takes too much time today?",
      bottleneckHint: "Optional — one or two sentences are plenty",
      bottleneckPlaceholder: "e.g. We answer the same WhatsApp questions all day, and orders are re-entered into accounting by hand…",
      contactPref: "Preferred contact method",
      timing: "Preferred timing for the session",
      timingHint: "Optional",
    },
    industries: ["E-commerce & retail", "Real estate", "Healthcare", "Education & training", "Logistics", "Manufacturing", "B2B services", "Other"],
    goals: [
      "Customer support & service",
      "Sales & lead qualification",
      "Repetitive internal operations",
      "Disconnected systems",
      "Documents & knowledge",
      "Voice & call processing",
      "A custom AI use case",
      "Not sure yet",
    ],
    systems: ["Odoo", "Shopify", "Salla / Zid", "WhatsApp Business", "Chatwoot", "HubSpot / CRM", "Phone PBX", "Custom system", "None yet"],
    contactPrefs: ["WhatsApp", "Email", "Phone call"],
    timings: ["This week", "Next two weeks", "Flexible"],
    errors: {
      name: "Please enter your name.",
      company: "Please enter your company name.",
      email: "Please enter a valid work email.",
      phone: "Please enter a valid phone number (or leave it empty).",
      goals: "Choose at least one — “Not sure yet” counts.",
    },
    submitError: {
      title: "We couldn't send your request",
      bodyNetwork: "It looks like a connection problem. Your answers are saved right here in the browser — try again, or send them in one tap via WhatsApp.",
      bodyConfig: "Online submission isn't available right now. Your answers are saved — send them in one tap via WhatsApp or email, and we'll take it from there.",
      retry: "Try again",
      viaWhatsApp: "Send via WhatsApp",
      viaEmail: "Send via email",
    },
    success: {
      title: "Request received.",
      sub: "Here's what happens next:",
      nextSteps: [
        "We review your answers and prepare a session for your specific case",
        "We contact you within one business day to confirm the time",
        "A 30-minute session with a solutions architect — no commitment",
      ],
      bookNow: "Pick your slot now",
      orWhatsApp: "Or message us on WhatsApp",
    },
    waLabels: {
      intro: "Assessment request from the website:",
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      industry: "Industry",
      goals: "Wants to improve",
      systems: "Current systems",
      bottleneck: "Biggest time sink",
      contactPref: "Preferred contact",
      timing: "Preferred timing",
    },
  },

  footer: {
    tagline: "Arkan AI Solutions — turning fragmented operations into reliable, AI-enabled business systems.",
    colPillars: "Solutions",
    pillars: ["AI Agents", "Workflow Automation", "Custom AI", "Systems Integration"],
    colCompany: "Company",
    company: [
      { id: "how", label: "How it works" },
      { id: "results", label: "Results" },
      { id: "process", label: "Process" },
      { id: "faq", label: "FAQ" },
    ],
    colContact: "Contact",
    whatsapp: "WhatsApp",
    email: "Email",
    calendar: "Book a session",
    locations: "Cairo · Riyadh · Dubai",
    rights: "All rights reserved.",
    made: "Built in Cairo. Engineered for MENA.",
  },

  fab: { aria: "Chat with Arkan on WhatsApp" },
};
