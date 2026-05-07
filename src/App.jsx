import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

/* ═══════════════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════════════ */
const WA    = "201007725744";
const CAL   = "https://calendar.app.google/35V4etCwYoD5poM77";
const DEMO  = "https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/02/11/18/20260211184124-KE13UNZE.json";
const EMAIL = "hello@arkan.ai";

/* ═══════════════════════════════════════════════════════
   MOTION VARIANTS
═══════════════════════════════════════════════════════ */
const E = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.72, delay: d, ease: E } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show:   (d = 0) => ({ opacity: 1, transition: { duration: 0.55, delay: d, ease: E } }),
};
const fadeLeft  = { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0, transition: { duration: 0.78, ease: E } } };
const fadeRight = { hidden: { opacity: 0, x:  36 }, show: { opacity: 1, x: 0, transition: { duration: 0.78, ease: E } } };

/* ═══════════════════════════════════════════════════════
   useInView HOOK
═══════════════════════════════════════════════════════ */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

/* ═══════════════════════════════════════════════════════
   CONTENT DATA
═══════════════════════════════════════════════════════ */
const FLOWS = {
  agents:   [{icon:"💬",n:"User Message"},{icon:"🧠",n:"Intent AI"},{icon:"📚",n:"RAG Lookup"},{icon:"🤖",n:"Response Gen"},{icon:"🔀",n:"HITL Router"},{icon:"📊",n:"CRM Log"},{icon:"📤",n:"Send Reply"},{icon:"🔁",n:"Context Save"}],
  workflow: [{icon:"⏰",n:"Trigger"},{icon:"📥",n:"Fetch Data"},{icon:"🧹",n:"Validate"},{icon:"🤖",n:"AI Process"},{icon:"🔌",n:"Sync Systems"},{icon:"📧",n:"Notify"},{icon:"💾",n:"Persist"},{icon:"📊",n:"Report"}],
  voice:    [{icon:"📞",n:"Call In"},{icon:"⬇️",n:"Download"},{icon:"🔊",n:"Resample"},{icon:"🎙️",n:"Whisper STT"},{icon:"🤖",n:"GPT-4o Score"},{icon:"🔗",n:"Match Opp"},{icon:"📊",n:"Update CRM"},{icon:"📧",n:"Coach Report"}],
  bridge:   [{icon:"📨",n:"Webhook In"},{icon:"🔐",n:"Verify Sig"},{icon:"🔄",n:"Transform"},{icon:"🔌",n:"Route"},{icon:"🛡️",n:"Retry Logic"},{icon:"📤",n:"Webhook Out"},{icon:"📝",n:"Audit Log"},{icon:"✅",n:"ACK"}],
};

const PILLARS = {
  ar:[
    {
      id:"agents", num:"I", tag:"العمود الأول",
      title:"الوكلاء الذكيون", sub:"AI Agents",
      tech:["Botpress","Custom SDK","RAG","HITL","Pinecone"],
      desc:"وكلاء محادثة عربية أصلية للمبيعات والدعم والعمليات الداخلية، متكاملون بعمق مع أنظمتك القائمة على مدار الساعة.",
      outcomes:[
        "خدمة عملاء على مدار 24/7 دون توسيع الفريق",
        "تأهيل العملاء المحتملين تلقائياً وبدقة",
        "محادثات بالعربية الفصحى ولهجات متعددة بطلاقة",
        "تكامل مباشر مع WhatsApp و Chatwoot و CRM",
      ],
      clients:["Engosoft","Trinova","Al-Bumri Overseas","XQ Pharma"],
    },
    {
      id:"workflow", num:"II", tag:"العمود الثاني",
      title:"أتمتة العمليات", sub:"Workflow Automation",
      tech:["n8n","Webhooks","Queues","Docker"],
      desc:"أتمتة عمليات مبنية على n8n مع استضافة ذاتية وتحكُّم بالإصدارات ومعالجة شاملة للحالات الاستثنائية، تضمن استمرارية الأعمال بكفاءة.",
      outcomes:[
        "تقليل الإدخال اليدوي والأخطاء البشرية",
        "تسريع دورات المبيعات والعمليات الداخلية",
        "ربط الأنظمة المتفرقة في منظومة موحدة",
        "تقارير ومراقبة فورية لكل سير عمل",
      ],
      clients:["Cool Quality System","Engosoft","Shopify ↔ Odoo"],
    },
    {
      id:"custom", num:"III", tag:"العمود الثالث",
      title:"حلول AI مخصصة", sub:"Custom AI Solutions",
      tech:["Whisper","Computer Vision","RAG","Ollama","Pinecone"],
      desc:"أنظمة RAG، نماذج لغوية مخصصة بالعربية، رؤية حاسوبية، خطوط معالجة صوتية، ووكلاء متعددو الوسائط مصممون لمجال عملك.",
      outcomes:[
        "حلول مصممة خصيصاً لمتطلبات قطاعك",
        "تحليل صور ومستندات بالذكاء الاصطناعي",
        "نماذج عربية مدرّبة على بيانات شركتك",
        "ميزة تنافسية لا يقدمها المنافسون",
      ],
      clients:["XQ Pharma — صوفيا","تحليل الوجه والبشرة"],
    },
    {
      id:"bridge", num:"IV", tag:"العمود الرابع",
      title:"التكاملات والجسور", sub:"Integrations & Bridges",
      tech:["Node.js","Coolify","OAuth","Webhooks"],
      desc:"النسيج الرابط بين Chatwoot و Odoo و Botpress و Shopify و WhatsApp. خوادم جسر موثوقة تتحمل التحديثات وتسجّل العمليات بدقة.",
      outcomes:[
        "ربط أنظمتك المختلفة في تدفق بيانات واحد",
        "مزامنة فورية بين المتجر و CRM و المحاسبة",
        "موثوقية عالية مع تسجيل كامل للعمليات",
        "ملكية كاملة للكود — لا ارتباط بمزوّد",
      ],
      clients:["Shopify ↔ Odoo","Chatwoot ↔ Botpress","WhatsApp Business"],
    },
  ],
  en:[
    {
      id:"agents", num:"I", tag:"PILLAR I",
      title:"AI Agents", sub:"Conversational intelligence",
      tech:["Botpress","Custom SDK","RAG","HITL","Pinecone"],
      desc:"Arabic-first conversational agents for sales, support, and internal ops — deeply integrated into your existing stack, working around the clock.",
      outcomes:[
        "24/7 customer service without growing the team",
        "Automated, accurate lead qualification",
        "Native Arabic conversations across dialects",
        "Direct integration with WhatsApp, Chatwoot, CRM",
      ],
      clients:["Engosoft","Trinova","Al-Bumri Overseas","XQ Pharma"],
    },
    {
      id:"workflow", num:"II", tag:"PILLAR II",
      title:"Workflow Automation", sub:"Process orchestration",
      tech:["n8n","Webhooks","Queues","Docker"],
      desc:"n8n-based automation: self-hosted, version-controlled, with comprehensive edge case handling — ensuring business continuity with efficiency.",
      outcomes:[
        "Reduce manual input and human errors",
        "Accelerate sales cycles and internal ops",
        "Connect siloed systems into one fabric",
        "Real-time reporting and monitoring",
      ],
      clients:["Cool Quality System","Engosoft","Shopify ↔ Odoo"],
    },
    {
      id:"custom", num:"III", tag:"PILLAR III",
      title:"Custom AI Solutions", sub:"Bespoke intelligence",
      tech:["Whisper","Computer Vision","RAG","Ollama","Pinecone"],
      desc:"RAG systems, fine-tuned Arabic LLMs, computer vision, voice pipelines, and multimodal agents — engineered for your specific domain.",
      outcomes:[
        "Solutions purpose-built for your industry",
        "AI-driven image and document analysis",
        "Arabic models trained on your data",
        "Competitive edge competitors can't match",
      ],
      clients:["XQ Pharma — Sofia","Face & skin analysis"],
    },
    {
      id:"bridge", num:"IV", tag:"PILLAR IV",
      title:"Integrations & Bridges", sub:"Connective tissue",
      tech:["Node.js","Coolify","OAuth","Webhooks"],
      desc:"The connective tissue between Chatwoot, Odoo, Botpress, Shopify, and WhatsApp. Reliable bridge servers that survive updates and log everything.",
      outcomes:[
        "Unify disparate systems into one data flow",
        "Real-time sync between store, CRM, accounting",
        "High reliability with complete audit logs",
        "Full code ownership — no vendor lock-in",
      ],
      clients:["Shopify ↔ Odoo","Chatwoot ↔ Botpress","WhatsApp Business"],
    },
  ],
};

const CASES = {
  ar:[
    {
      tag:"Engosoft · العمود I + II + IV",
      title:"منظومة دعم عملاء متكاملة بوكلاء AI",
      desc:"نشر منصة Chatwoot كاملة مع وكلاء ذكاء اصطناعي مخصصين (Maged و Fahd) للرد على استفسارات العملاء، تأهيل العملاء المحتملين، وتسليم ذكي للوكلاء البشريين عند الحاجة.",
      stats:[{v:"2",l:"وكلاء AI"},{v:"24/7",l:"تشغيل مستمر"},{v:"AR+EN",l:"ثنائي اللغة"}],
      featured:true
    },
    {
      tag:"XQ Pharma · العمود III",
      title:"صوفيا — مستشارة العناية بالبشرة",
      desc:"وكيل ذكاء اصطناعي بالرؤية الحاسوبية (Computer Vision): يحلل صور الوجه، يكتشف عيوب البشرة، يرشّح المنتجات المناسبة، ويرسل تذكيرات دورية للعملاء.",
      stats:[{v:"CV",l:"رؤية حاسوبية"},{v:"AI",l:"تحليل الوجه"},{v:"Auto",l:"تذكيرات ذكية"}],
    },
    {
      tag:"Al-Bumri Overseas · العمود I",
      title:"وكيل سياحي ذكي للمبيعات",
      desc:"وكيل ذكاء اصطناعي لشركة سياحة: يتحدث مع العملاء بالعربية، يعرض الباقات والأسعار، ويُتمم حجوزات الرحلات بالكامل عبر WhatsApp ودون تدخل بشري.",
      stats:[{v:"100%",l:"حجز مؤتمت"},{v:"24/7",l:"استجابة فورية"},{v:"AR",l:"محادثة طبيعية"}],
    },
    {
      tag:"Trinova · العمود I",
      title:"مساعد عناية بالعملاء — التجزئة",
      desc:"وكيل دعم عملاء لشركة متخصصة في أدوات الطهي ومستلزمات المطبخ: يعالج الاستفسارات، يقترح المنتجات المناسبة، ويتابع حالة الطلبات.",
      stats:[{v:"AI",l:"دعم تلقائي"},{v:"E-com",l:"تكامل المتجر"},{v:"AR",l:"عربي أصيل"}],
    },
    {
      tag:"Cool Quality System · العمود II",
      title:"مساعد HR شخصي داخل Odoo",
      desc:"مساعد ذكاء اصطناعي مدمج في Odoo للموارد البشرية: استعلامات الموظفين، طلبات الإجازات، إشعارات تلقائية، وأتمتة العمليات اليومية للـ HR.",
      stats:[{v:"Odoo",l:"تكامل أصلي"},{v:"HR",l:"موارد بشرية"},{v:"AI",l:"مساعد ذكي"}],
    },
    {
      tag:"Shopify ↔ Odoo · العمود IV",
      title:"أتمتة طلبات المتجر الإلكتروني",
      desc:"نظام أتمتة كامل: يجمع الطلبات الجديدة من Shopify لحظياً، يرفعها على Odoo بصيغة موحدة، ويزامن المخزون والشحنات في الوقت الفعلي.",
      stats:[{v:"100%",l:"أتمتة"},{v:"Real-time",l:"مزامنة فورية"},{v:"0",l:"إدخال يدوي"}],
    },
  ],
  en:[
    {
      tag:"Engosoft · Pillars I + II + IV",
      title:"End-to-end AI customer support stack",
      desc:"Full Chatwoot platform deployment with custom AI agents (Maged & Fahd) handling customer inquiries, lead qualification, and smart human handoff when needed.",
      stats:[{v:"2",l:"AI Agents"},{v:"24/7",l:"Always On"},{v:"AR+EN",l:"Bilingual"}],
      featured:true
    },
    {
      tag:"XQ Pharma · Pillar III",
      title:"Sofia — AI Skincare Advisor",
      desc:"Computer-vision AI agent: analyzes facial images, detects skin concerns, recommends suitable products, and sends scheduled care reminders to clients.",
      stats:[{v:"CV",l:"Computer Vision"},{v:"AI",l:"Face Analysis"},{v:"Auto",l:"Smart Reminders"}],
    },
    {
      tag:"Al-Bumri Overseas · Pillar I",
      title:"AI Sales Agent for Travel",
      desc:"AI agent for a travel agency: chats with customers in Arabic, presents packages and pricing, and completes full trip bookings through WhatsApp — zero human intervention.",
      stats:[{v:"100%",l:"Auto-booking"},{v:"24/7",l:"Instant Response"},{v:"AR",l:"Native Chat"}],
    },
    {
      tag:"Trinova · Pillar I",
      title:"Retail Customer Care Assistant",
      desc:"Customer support agent for a kitchenware retailer: handles inquiries, recommends relevant products, and tracks order status — fully integrated with the store.",
      stats:[{v:"AI",l:"Auto Support"},{v:"E-com",l:"Store Integrated"},{v:"AR",l:"Native Arabic"}],
    },
    {
      tag:"Cool Quality System · Pillar II",
      title:"Personal HR Assistant inside Odoo",
      desc:"AI assistant embedded in Odoo for HR: employee queries, leave requests, automated notifications, and full automation of daily HR operations.",
      stats:[{v:"Odoo",l:"Native Integration"},{v:"HR",l:"Human Resources"},{v:"AI",l:"Smart Assistant"}],
    },
    {
      tag:"Shopify ↔ Odoo · Pillar IV",
      title:"E-commerce Order Automation",
      desc:"Complete automation system: pulls new orders from Shopify in real time, pushes them to Odoo in a unified format, and syncs inventory and shipments live.",
      stats:[{v:"100%",l:"Automated"},{v:"Real-time",l:"Live Sync"},{v:"0",l:"Manual Entry"}],
    },
  ],
};

const PROCESS = {
  ar:[
    {n:"01",t:"الاكتشاف",         d:"أسبوعان من التدقيق المنظَّم. نرسم خريطة شاملة لمنظومتك، نُحلِّل مواطن الاختناقات، ونحدد فرص التحسين الفعلية بأرقام واضحة وقابلة للقياس."},
    {n:"02",t:"التصميم المعماري",  d:"تصميم النظام، خطة التكامل، نموذج البيانات، واستراتيجية المراقبة — موثّقة بالكامل ومراجَعة معك ومعتمدة قبل البدء بأي تطوير."},
    {n:"03",t:"البناء والإطلاق",   d:"تسليم تكراري كل أسبوعين بشفافية كاملة. بنية تحتية مستضافة ذاتياً، تحكم دقيق بالإصدارات، واختبارات شاملة قبل كل إطلاق إنتاجي."},
    {n:"04",t:"التشغيل والاستدامة", d:"عقد دعم اختياري للمراقبة المستمرة، الاستجابة السريعة للحوادث، والتحسين الدوري — لضمان استدامة الأداء على المدى الطويل."},
  ],
  en:[
    {n:"01",t:"Discovery",       d:"Two-week structured audit. We map your stack comprehensively, analyze bottlenecks, and identify real improvement opportunities with measurable numbers."},
    {n:"02",t:"Architecture",    d:"System design, integration plan, data model, and observability strategy — fully documented, reviewed with you, and signed off before any development."},
    {n:"03",t:"Build & Ship",    d:"Two-week iterative delivery cycles with full transparency. Self-hosted infrastructure, strict version control, end-to-end testing before every production release."},
    {n:"04",t:"Operate & Sustain", d:"Optional retainer for continuous monitoring, fast incident response, and iterative improvements — ensuring sustained performance over the long term."},
  ],
};

const STACK = ["n8n","Botpress","Odoo","Pinecone","Chatwoot","Coolify","OpenAI","Anthropic","Gemini","Groq","Whisper","UiPath","Yeastar","Postgres"];

const FAQS = {
  ar:[
    {q:"كم يستغرق المشروع المتوسط؟",       a:"معظم المشاريع تستغرق 8–16 أسبوعاً من الاكتشاف حتى الإطلاق. المشاريع الأبسط تنتهي في 4–6 أسابيع. نحدد الجدول الزمني بدقة بعد جلسة الاكتشاف."},
    {q:"هل تتكاملون مع أنظمتنا الحالية؟",  a:"نعم. نتكامل مع Odoo وHubSpot وSalesforce وShopify وSalla وZid وWhatsApp Business وYeastar PBX وأي نظام يدعم REST APIs أو Webhooks."},
    {q:"هل نحتاج بنية تحتية خاصة؟",        a:"اختياري. يمكننا النشر على بنيتكم أو بنيتنا الذاتية (Coolify على Hetzner). كل ما نبنيه ملككم الكامل — لا ارتباط بمزوّد."},
    {q:"هل يدعم اللهجات العربية؟",          a:"نعم. الفصحى والمصرية والسعودية والخليجية والإنجليزية — مع كشف لغوي تلقائي، وإمكانية Fine-tune نماذج مخصصة لمجال عملكم."},
    {q:"ماذا يحدث بعد الإطلاق؟",            a:"30 يوماً من الدعم التشغيلي ضمن المشروع. بعدها عقد اختياري شهري للمراقبة والاستجابة للحوادث والتحسينات المستمرة."},
    {q:"كم تكلفة المشروع؟",                 a:"المشاريع تبدأ من $5,000 لنطاق محدد، وتصل إلى $50,000+ لأنظمة المؤسسات الكاملة. نسعّر بسعر ثابت للنطاق المتفق عليه — لا فواتير مفاجئة."},
  ],
  en:[
    {q:"How long does a typical project take?",        a:"Most projects run 8–16 weeks from discovery to launch. Simpler builds wrap in 4–6 weeks. We commit to a specific timeline after the discovery session."},
    {q:"Do you integrate with our existing systems?",  a:"Yes. Odoo, HubSpot, Salesforce, Shopify, Salla, Zid, WhatsApp Business, Yeastar PBX, and any system with REST APIs or webhooks."},
    {q:"Do we need our own infrastructure?",           a:"Optional. We can deploy on yours or our self-hosted setup (Coolify on Hetzner). Everything we build is yours — no vendor lock-in, ever."},
    {q:"Does it handle Arabic dialects?",              a:"Yes. MSA, Egyptian, Saudi, Gulf, and English — automatic language detection plus ability to fine-tune domain-specific models."},
    {q:"What happens after launch?",                   a:"30 days operational support included in project scope. Then optional monthly retainer for monitoring, incident response, and improvements."},
    {q:"What does it cost?",                           a:"Projects range from $5,000 for defined scope to $50,000+ for full enterprise systems. Fixed pricing for agreed scope — no surprise invoices."},
  ],
};

/* ═══════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════ */
const T = {
  ar:{
    navBook:"ابدأ مشروعاً",navPillars:"الأركان",navProcess:"المنهجية",navWork:"الأعمال",
    eyebrow:"القاهرة · الرياض · دبي · MENA",
    h1a:"أركان",h1b:"الأتمتة الذكية.",
    sub:"نُهندس البنية التحتية للذكاء الاصطناعي للمؤسسات الحديثة — وكلاء، أتمتة، وتكاملات مصممة للاستدامة والنمو على المدى الطويل.",
    cta:"ابدأ مشروعاً",ctaWA:"تواصل عبر WhatsApp",
    m1:"جهة اتصال مهاجَرة",m2:"سير عمل إنتاجي",m3:"تكامل نشط",m4:"ثنائي اللغة",
    demoTag:"تجربة مباشرة",demoTitle:"وكيل ذكاء اصطناعي يتحدث بلهجتكم",
    demoDesc:"جرّب وكيلاً ذكياً يردّ بالعربية والإنجليزية على مدار الساعة — يحجز المواعيد، يؤهّل العملاء، ويتكامل مع أنظمتكم. شاهد الفرق بنفسك قبل أن تلتزم بشيء.",
    tryDemo:"جرّب العرض التجريبي",bookDemo:"احجز عرضاً مخصصاً",
    pillarsTitle:"أربعة أركان. منظومة ذكاء اصطناعي متكاملة.",
    pillarsSub:"كل مشروع مع أركان مبني على أربعة تخصصات أساسية، تمثّل القدرات الجوهرية لتشغيل الذكاء الاصطناعي في بيئة المؤسسات.",
    clickFlow:"اضغط لمشاهدة التدفق",
    processTitle:"كيف نبني.",processSub:"نموذج ارتباط من أربع مراحل مصمم لتحقيق نتائج إنتاجية ملموسة، لا مجرد نماذج تجريبية محدودة الأثر.",
    casesTitle:"أعمال في الإنتاج.",casesSub:"كل نظام معروض هنا يعمل في بيئة إنتاج حقيقية اليوم لدى عملاء فعليين عبر MENA.",
    stackTitle:"تقنيات راسخة في بيئات الإنتاج المؤسسية.",
    faqTitle:"الأسئلة المتكررة.",
    ctaTitle:"ابنِ الأركان. لا الـ Buzzwords.",
    ctaSub:"30 دقيقة لفهم احتياجاتك بدقة، ولتقييم الفرصة بصدق. إن لم يكن الذكاء الاصطناعي هو الحل المناسب لك، سنخبرك بذلك بكل وضوح.",
    ctaBtn:"احجز جلسة اكتشاف",workflow:"سير العمل",
    footerTag:"نهندس البنية التحتية الذكية الحاملة للمؤسسات الحديثة عبر MENA.",
    contact:"تواصل",rights:"جميع الحقوق محفوظة",
  },
  en:{
    navBook:"Start a Project",navPillars:"Pillars",navProcess:"Process",navWork:"Work",
    eyebrow:"Cairo · Riyadh · Dubai · MENA",
    h1a:"The pillars of",h1b:"intelligent automation.",
    sub:"We engineer the AI infrastructure for modern enterprises — agents, automation, and integrations built for long-term sustainability and growth.",
    cta:"Start a project",ctaWA:"Reach via WhatsApp",
    m1:"Contacts migrated",m2:"Production workflows",m3:"Active integrations",m4:"Bilingual by design",
    demoTag:"Live demo",demoTitle:"An AI agent that speaks your language",
    demoDesc:"Try an AI agent responding 24/7 in Arabic & English — books appointments, qualifies leads, and integrates with your systems. See the difference before you commit to anything.",
    tryDemo:"Try live demo",bookDemo:"Book a custom demo",
    pillarsTitle:"Four pillars. One integrated AI ecosystem.",
    pillarsSub:"Every Arkan engagement is built around four core disciplines — the essential capabilities for running AI at enterprise scale.",
    clickFlow:"Click to view workflow",
    processTitle:"How we build.",processSub:"A four-stage engagement model designed to deliver tangible production results — not pilots with limited impact.",
    casesTitle:"Production work.",casesSub:"Every system shown here is in active production today, deployed for real clients across MENA.",
    stackTitle:"Battle-tested in enterprise production environments.",
    faqTitle:"Frequently asked.",
    ctaTitle:"Build the foundations. Not the buzzwords.",
    ctaSub:"30 minutes to understand your real needs and assess the opportunity honestly. If AI isn't the right answer for you, we'll tell you clearly.",
    ctaBtn:"Book a discovery call",workflow:"WORKFLOW",
    footerTag:"Engineering load-bearing AI infrastructure beneath modern enterprises across MENA.",
    contact:"Reach us",rights:"All rights reserved",
  },
};

/* ═══════════════════════════════════════════════════════
   FUNNEL DATA
═══════════════════════════════════════════════════════ */
const FUNNEL = {
  ar:{
    title:"ابدأ مشروعك",sub:"5 أسئلة سريعة لنحضّر لك الاقتراح المناسب — كلها اختيارية.",
    skip:"تخطّى للحجز مباشرةً",back:"السابق",next:"التالي",submit:"احجز الموعد",
    done:"تم بنجاح!",doneSub:"بياناتك وصلتنا. ستحصل على تأكيد خلال دقائق ودعوة جدولة خلال يوم عمل.",close:"إغلاق",
    steps:["شركتك","وضعك مع AI","أنظمتك","نقطة الألم","التوقيت","بياناتك"],
    industries:["تجارة إلكترونية","صيدلانية","تعليم وتدريب","عقارات","رعاية صحية","لوجستيات","B2B · خدمات","تصنيع","أخرى"],
    sizes:["5–20 موظف","20–50 موظف","50–200 موظف","200+ موظف"],
    aiStates:["نبدأ من الصفر","لدينا Chatbots بسيطة","نستخدم n8n / Zapier / Make","لدينا AI مخصص (RAG، Agents)"],
    systems:["Odoo","Shopify / Salla / Zid","HubSpot / Salesforce","WhatsApp Business","Chatwoot","Yeastar / PBX","نظام مخصص","لا يوجد"],
    pains:[{t:"خدمة العملاء تستنزف فريقي",p:"العمود I"},{t:"عمليات يدوية تستهلك الوقت",p:"العمود II"},{t:"أحتاج AI مخصصاً لمجالي",p:"العمود III"},{t:"أنظمتي لا تتحدث مع بعضها",p:"العمود IV"}],
    timelines:["في أقرب وقت","1–3 شهور","3–6 شهور","استكشاف فقط"],
    budgets:["أقل من $5,000","$5,000–$15,000","$15,000–$50,000","$50,000+","ميزانية مؤسسية"],
    lCompany:"اسم الشركة",lIndustry:"المجال",lSize:"حجم الفريق",
    lName:"الاسم",lEmail:"البريد الإلكتروني",lPhone:"الهاتف / WhatsApp",lNotes:"تفاصيل إضافية؟ (اختياري)",
  },
  en:{
    title:"Start your project",sub:"5 quick questions so we can prepare the right proposal — all optional.",
    skip:"Skip and schedule directly",back:"Back",next:"Continue",submit:"Book the call",
    done:"Done!",doneSub:"Your details are with us. You'll get an email confirmation in minutes and a scheduling invite within one business day.",close:"Close",
    steps:["Your company","Your AI state","Existing systems","Primary pain","Timeline","Your details"],
    industries:["E-commerce","Pharma","Education / Training","Real Estate","Healthcare","Logistics","B2B / Services","Manufacturing","Other"],
    sizes:["5–20 employees","20–50 employees","50–200 employees","200+ employees"],
    aiStates:["Starting from scratch","We have basic chatbots","We use n8n / Zapier / Make","We have custom AI (RAG, Agents)"],
    systems:["Odoo","Shopify / Salla / Zid","HubSpot / Salesforce","WhatsApp Business","Chatwoot","Yeastar / IP-PBX","Custom system","None"],
    pains:[{t:"Customer service is overwhelming my team",p:"Pillar I"},{t:"Manual workflows eating team time",p:"Pillar II"},{t:"Need custom AI for my domain",p:"Pillar III"},{t:"My systems don't talk to each other",p:"Pillar IV"}],
    timelines:["ASAP","1–3 months","3–6 months","Just exploring"],
    budgets:["Under $5,000","$5,000–$15,000","$15,000–$50,000","$50,000+","Enterprise"],
    lCompany:"Company name",lIndustry:"Industry",lSize:"Team size",
    lName:"Full name",lEmail:"Email address",lPhone:"Phone / WhatsApp",lNotes:"Anything else we should know? (optional)",
  },
};

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const IC = {
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  arrowR:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  arrowL:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  sun:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  chevD:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6,9 12,15 18,9"/></svg>,
  chevR:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>,
  chevL:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>,
  play:     <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>,
  star:     <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chat:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  zap:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>,
  mail:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  whatsapp: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};
const Ico = ({ n, size = 16, col }) => (
  <span style={{ display:"inline-flex", width:size, height:size, flexShrink:0, color:col||"currentColor" }}>{IC[n]}</span>
);

/* ═══════════════════════════════════════════════════════
   ARKAN LOGO MARK
═══════════════════════════════════════════════════════ */
function Mark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <rect width="96" height="96" rx="13" fill="#060D2E"/>
      <rect x=".5" y=".5" width="95" height="95" rx="12.5" stroke="var(--gold)" strokeWidth=".8" opacity=".5"/>
      <circle cx="48" cy="17" r="5.5" fill="var(--gold)"/>
      <path d="M17 40 Q32.5 17 48 22 Q63.5 17 79 40" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="13" y="40" width="8" height="44" rx="1.5" fill="#C8D8F8"/>
      <rect x="44" y="30" width="8" height="54" rx="1.5" fill="#C8D8F8"/>
      <rect x="75" y="40" width="8" height="44" rx="1.5" fill="#C8D8F8"/>
      <rect x="9" y="85" width="78" height="4" rx="1.5" fill="#C8D8F8"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   SHARED SECTION WRAPPER
═══════════════════════════════════════════════════════ */
function Sec({ id, bg, children, style = {} }) {
  return (
    <section id={id} style={{ padding:"clamp(80px,10vw,140px) clamp(20px,4vw,52px)", background:bg||"transparent", borderTop:"1px solid var(--border)", position:"relative", ...style }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>{children}</div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════ */
function SectionHeader({ num, title, sub, ff, center = false }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ textAlign:center?"center":"start", marginBottom:"clamp(52px,7vw,80px)", maxWidth:900, marginLeft:center?"auto":0, marginRight:center?"auto":0 }}>
      {num && (
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate={v?"show":"hidden"}
          style={{ fontFamily:"var(--mono)", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20, display:"inline-flex", alignItems:"center", gap:12 }}>
          <span style={{ width:28, height:1, background:"var(--gold)", display:"inline-block" }}/>
          {num}
        </motion.div>
      )}
      <motion.h2 variants={fadeUp} custom={0.06} initial="hidden" animate={v?"show":"hidden"}
        style={{ fontFamily:"var(--serif)", fontSize:"clamp(36px,5.5vw,64px)", fontWeight:300, lineHeight:1.05, letterSpacing:"-0.03em", color:"var(--text)", marginBottom:sub?18:0 }}>
        {title}
      </motion.h2>
      {sub && (
        <motion.p variants={fadeUp} custom={0.14} initial="hidden" animate={v?"show":"hidden"}
          style={{ fontSize:"clamp(15px,1.7vw,18px)", color:"var(--text2)", lineHeight:1.72, maxWidth:680, fontFamily:ff, marginTop:16 }}>
          {sub}
        </motion.p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════ */
function Navbar({ lang, setLang, mode, setMode, t, ff, onBook }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const iconBtn = { display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid var(--border)", background:"var(--card)", cursor:"pointer", color:"var(--text2)", borderRadius:3, transition:"all .25s", flexShrink:0 };

  return (
    <motion.nav initial={{ y:-72 }} animate={{ y:0 }} transition={{ duration:.5, ease:E }}
      style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, height:64, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(20px,3vw,52px)", fontFamily:ff,
        background:scrolled?"var(--nav)":"transparent",
        backdropFilter:scrolled?"blur(24px) saturate(180%)":"none",
        WebkitBackdropFilter:scrolled?"blur(24px) saturate(180%)":"none",
        borderBottom:scrolled?"1px solid var(--nav-b)":"1px solid transparent",
        transition:"all .3s" }}>

      <a href="#" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
        <Mark size={30}/>
        <div>
          <div style={{ fontFamily:"var(--serif)", fontSize:17, fontWeight:400, color:"var(--text)", lineHeight:1, letterSpacing:"-.01em" }}>Arkan</div>
          <div style={{ fontFamily:"var(--mono)", fontSize:8, letterSpacing:".3em", color:"var(--gold)", marginTop:2 }}>AI · SOLUTIONS</div>
        </div>
      </a>

      <div className="nav-links">
        {[["#pillars",t.navPillars],["#process",t.navProcess],["#work",t.navWork]].map(([href,label]) => (
          <a key={href} href={href} style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"var(--text3)", textDecoration:"none", padding:"4px 0", transition:"color .25s" }}
            onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="var(--text3)"}>
            {label}
          </a>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <motion.button whileTap={{ scale:.88 }} onClick={()=>setMode(mode==="light"?"dark":"light")}
          style={{ ...iconBtn, width:36, height:36 }}>
          <Ico n={mode==="light"?"moon":"sun"} size={14}/>
        </motion.button>
        <motion.button whileTap={{ scale:.88 }} onClick={()=>setLang(lang==="ar"?"en":"ar")}
          style={{ ...iconBtn, height:36, padding:"0 13px", fontFamily:"var(--mono)", fontSize:11, fontWeight:600, letterSpacing:".1em" }}>
          {lang==="ar"?"EN":"ع"}
        </motion.button>
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }} onClick={onBook}
          style={{ height:36, padding:"0 20px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", borderRadius:3, cursor:"pointer", fontFamily:"var(--mono)", fontSize:10, fontWeight:600, letterSpacing:".22em", textTransform:"uppercase", whiteSpace:"nowrap", transition:"background .25s" }}>
          {t.navBook}
        </motion.button>
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════ */
function Hero({ t, ff, onBook, lang }) {
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", paddingTop:140 }}>
      <div className="bg-grid"/>

      {/* Central glow orb */}
      <motion.div
        animate={{ opacity:[.25,.55,.25], scale:[1,1.15,1] }}
        transition={{ duration:9, repeat:Infinity, ease:"easeInOut" }}
        style={{ position:"absolute", top:"45%", left:"50%", transform:"translate(-50%,-50%)", width:900, height:900, background:"radial-gradient(circle,var(--gold-glow) 0%,transparent 55%)", filter:"blur(80px)", pointerEvents:"none" }}
      />

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:1280, margin:"0 auto", padding:"0 clamp(20px,4vw,52px) 100px" }}>

        {/* Eyebrow */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, delay:.15, ease:E }}
          style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"7px 18px", border:"1px solid var(--gold-line)", background:"var(--gold-bg-soft)", borderRadius:100, fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:44 }}>
          <motion.span animate={{ opacity:[1,.3,1] }} transition={{ duration:2.2, repeat:Infinity }}
            style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", boxShadow:"0 0 10px var(--gold)", display:"inline-block" }}/>
          {t.eyebrow}
        </motion.div>

        {/* H1 — architectural scale */}
        <div style={{ overflow:"hidden", marginBottom:6 }}>
          <motion.h1 initial={{ y:"110%", opacity:0 }} animate={{ y:"0%", opacity:1 }} transition={{ duration:.9, delay:.28, ease:E }}
            style={{ fontFamily:"var(--serif)", fontSize: lang==="ar" ? "clamp(56px,9vw,128px)" : "clamp(60px,11vw,160px)", fontWeight:300, lineHeight:.92, letterSpacing:"-.045em", color:"var(--text)" }}>
            {t.h1a}
          </motion.h1>
        </div>
        <div style={{ overflow:"hidden", marginBottom:48 }}>
          <motion.h1 initial={{ y:"110%", opacity:0 }} animate={{ y:"0%", opacity:1 }} transition={{ duration:.9, delay:.38, ease:E }}
            style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize: lang==="ar" ? "clamp(56px,9vw,128px)" : "clamp(60px,11vw,160px)", fontWeight:300, lineHeight:.92, letterSpacing:"-.045em", color:"var(--gold)" }}>
            {t.h1b}
          </motion.h1>
        </div>

        {/* Sub */}
        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.75, delay:.55, ease:E }}
          style={{ fontSize:"clamp(16px,1.9vw,21px)", fontWeight:300, color:"var(--text2)", maxWidth:620, lineHeight:1.6, marginBottom:52, fontFamily:ff }}>
          {t.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, delay:.7, ease:E }}
          style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:88 }}>
          <motion.button whileHover={{ y:-3, boxShadow:"0 16px 40px var(--gold-shadow)" }} whileTap={{ scale:.97 }} onClick={onBook}
            style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"16px 30px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", cursor:"pointer", fontFamily:"var(--mono)", fontSize:11, fontWeight:600, letterSpacing:".2em", textTransform:"uppercase", borderRadius:3, transition:"all .3s" }}>
            {t.cta} <Ico n="arrowR" size={14} col="var(--gold-fg)"/>
          </motion.button>
          <motion.a whileHover={{ y:-3 }} whileTap={{ scale:.97 }}
            href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"16px 26px", border:"1px solid var(--border-strong)", color:"var(--text)", textDecoration:"none", fontFamily:"var(--mono)", fontSize:11, letterSpacing:".2em", textTransform:"uppercase", borderRadius:3, background:"transparent", transition:"all .3s" }}>
            <Ico n="whatsapp" size={14}/> {t.ctaWA}
          </motion.a>
        </motion.div>

        {/* Metrics row */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.7, delay:.92 }}
          style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"28px 40px", paddingTop:44, borderTop:"1px solid var(--border)", maxWidth:860 }}>
          {[["40k+",t.m1],["19",t.m2],["8",t.m3],["AR · EN",t.m4]].map(([num,label],i) => (
            <motion.div key={i} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.05+i*.08, duration:.6, ease:E }}>
              <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:"clamp(32px,4.5vw,48px)", fontWeight:300, lineHeight:1, color:"var(--gold)", marginBottom:8, letterSpacing:"-.02em" }}>{num}</div>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"var(--text3)" }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="scroll-dot">
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
          style={{ color:"var(--text3)", display:"flex" }}>
          <Ico n="chevD" size={22}/>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   DEMO SECTION
═══════════════════════════════════════════════════════ */
function DemoSection({ t, ff, onBook, lang }) {
  const [ref, v] = useInView(.07);
  const isAr = lang === "ar";

  const msgs = isAr ? [
    { from:"user", text:"مرحبا، أريد معرفة المزيد عن خدماتكم", delay:.0 },
    { from:"bot",  text:"أهلاً وسهلاً! يسعدني مساعدتك 😊 هل تبحث عن وكيل مبيعات، دعم عملاء، أم أتمتة عمليات؟", delay:.9 },
    { from:"user", text:"وكيل مبيعات، عندي متجر إلكتروني على Shopify", delay:1.5 },
    { from:"bot",  text:"ممتاز! لدينا تجارب مماثلة مع متاجر Shopify وSalla. أرتّب لك عرضاً توضيحياً مخصصاً خلال 24 ساعة — متى يناسبك؟", delay:2.4 },
  ] : [
    { from:"user", text:"Hi, I'd like to know more about your services", delay:.0 },
    { from:"bot",  text:"Hello! Happy to help 👋 Are you looking for a sales agent, customer support, or workflow automation?", delay:.9 },
    { from:"user", text:"Sales agent — I have a Shopify store", delay:1.5 },
    { from:"bot",  text:"Great! We have live deployments with Shopify and Salla. I can arrange a custom demo within 24 hours — what time works for you?", delay:2.4 },
  ];

  return (
    <section style={{ padding:"clamp(80px,10vw,140px) clamp(20px,4vw,52px)", borderTop:"1px solid var(--border)", background:"var(--bg2)" }}>
      <div ref={ref} className="demo-grid" style={{ maxWidth:1280, margin:"0 auto" }}>

        {/* Phone mockup */}
        <motion.div variants={fadeLeft} initial="hidden" animate={v?"show":"hidden"}
          style={{ display:"flex", justifyContent:"center" }}>
          <div style={{ width:"min(320px,90vw)", position:"relative" }}>

            <motion.div whileHover={{ y:-6, boxShadow:"0 32px 80px var(--gold-shadow)" }}
              transition={{ type:"spring", stiffness:260 }}
              className="phone-chrome">

              {/* Status bar */}
              <div style={{ height:28, background:"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid var(--border)" }}>
                <div style={{ width:60, height:6, borderRadius:3, background:"var(--border)" }}/>
              </div>

              {/* Chat header */}
              <div style={{ height:54, background:"var(--gold)", display:"flex", alignItems:"center", padding:"0 14px", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"#060D2E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Mark size={28}/>
                </div>
                <div>
                  <div style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:400, color:"#0A0D14", lineHeight:1 }}>Arkan AI</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"#0A0D14", opacity:.7, letterSpacing:".1em", marginTop:2, display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:"#16a34a", display:"inline-block" }}/>
                    {isAr?"متصل · 24/7":"Live · 24/7"}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ minHeight:290, background:"var(--bg)", padding:"14px 12px", display:"flex", flexDirection:"column", gap:10 }}>
                {msgs.map((msg, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, y:10, scale:.94 }}
                    animate={v ? { opacity:1, y:0, scale:1 } : {}}
                    transition={{ delay:1.4 + msg.delay, duration:.4, ease:E }}
                    style={{ display:"flex", justifyContent:msg.from==="user"?"flex-end":"flex-start" }}>
                    <div style={{
                      maxWidth:"78%", padding:"10px 13px",
                      borderRadius:msg.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                      background:msg.from==="user"?"var(--gold)":"var(--card)",
                      color:msg.from==="user"?"var(--gold-fg)":"var(--text)",
                      border:msg.from==="bot"?"1px solid var(--border)":"none",
                      fontSize:12.5, lineHeight:1.55, fontFamily:ff,
                      boxShadow:"var(--shadow)",
                    }}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing dots */}
                <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:3.4, duration:.4 }}
                  style={{ display:"flex", justifyContent:"flex-start" }}>
                  <div style={{ padding:"10px 14px", borderRadius:"18px 18px 18px 4px", background:"var(--card)", border:"1px solid var(--border)", display:"flex", gap:4, alignItems:"center" }}>
                    {[0,.18,.36].map((d,i) => (
                      <motion.div key={i} animate={{ y:[0,-4,0] }} transition={{ duration:.7, delay:d, repeat:Infinity, ease:"easeInOut" }}
                        style={{ width:7, height:7, borderRadius:"50%", background:"var(--gold)" }}/>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Input bar */}
              <div style={{ padding:"10px 12px", background:"var(--card)", borderTop:"1px solid var(--border)", display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ flex:1, background:"var(--bg2)", borderRadius:20, padding:"8px 14px", fontSize:12, color:"var(--text3)", fontFamily:ff, border:"1px solid var(--border)" }}>
                  {isAr?"اكتب رسالتك...":"Type a message..."}
                </div>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                  <Ico n={isAr?"arrowL":"arrowR"} size={12} col="var(--gold-fg)"/>
                </div>
              </div>
            </motion.div>

            {/* Live badge */}
            <motion.div initial={{ opacity:0, scale:.8, x:20 }} animate={v?{opacity:1,scale:1,x:0}:{}} transition={{ delay:2, duration:.5, ease:E }}
              className="live-badge" style={{ position:"absolute", top:44, [isAr?"left":"right"]:-44 }}>
              <motion.span animate={{ opacity:[1,.3,1] }} transition={{ duration:1.8, repeat:Infinity }}
                style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 10px #22c55e", display:"inline-block" }}/>
              {isAr?"نشط · 24/7":"Active · 24/7"}
            </motion.div>

            {/* Response time badge */}
            <motion.div initial={{ opacity:0, scale:.8, x:-20 }} animate={v?{opacity:1,scale:1,x:0}:{}} transition={{ delay:2.4, duration:.5, ease:E }}
              className="live-badge" style={{ position:"absolute", bottom:54, [isAr?"right":"left"]:-48, color:"var(--text2)" }}>
              ⚡ {isAr?"متوسط 2.4 ثانية":"Avg. 2.4s"}
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeRight} initial="hidden" animate={v?"show":"hidden"}>
          <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20, display:"inline-flex", alignItems:"center", gap:9, padding:"6px 14px", border:"1px solid var(--gold-line)", background:"var(--gold-bg-soft)", borderRadius:100 }}>
            <motion.span animate={{ opacity:[1,.3,1] }} transition={{ duration:2, repeat:Infinity }}
              style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)", display:"inline-block" }}/>
            {t.demoTag}
          </div>

          <h2 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:"clamp(30px,4.2vw,52px)", lineHeight:1.05, letterSpacing:"-.03em", marginBottom:22, color:"var(--text)" }}>
            {t.demoTitle}
          </h2>
          <p style={{ fontSize:"clamp(15px,1.65vw,18px)", color:"var(--text2)", lineHeight:1.72, marginBottom:44, fontFamily:ff }}>
            {t.demoDesc}
          </p>

          {/* Stats row */}
          <div style={{ display:"flex", gap:32, marginBottom:44, paddingBottom:36, borderBottom:"1px solid var(--border)", flexWrap:"wrap" }}>
            {(isAr?[["24/7","متاح دائماً"],["AR+EN","ثنائي اللغة"],["<3s","وقت الاستجابة"]]:[["24/7","Always on"],["AR+EN","Bilingual"],["<3s","Response time"]]).map(([v2,l],i) => (
              <div key={i}>
                <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:30, fontWeight:300, color:"var(--gold)", lineHeight:1 }}>{v2}</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".18em", textTransform:"uppercase", color:"var(--text3)", marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <motion.a whileHover={{ y:-2, boxShadow:"0 10px 28px var(--gold-shadow)" }} whileTap={{ scale:.97 }}
              href={DEMO} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"15px 28px", background:"var(--gold)", color:"var(--gold-fg)", textDecoration:"none", fontFamily:"var(--mono)", fontSize:11, letterSpacing:".2em", textTransform:"uppercase", borderRadius:3, border:"none", cursor:"pointer", transition:"all .3s" }}>
              <Ico n="chat" size={14} col="var(--gold-fg)"/>{t.tryDemo}
            </motion.a>
            <motion.button whileHover={{ y:-2 }} whileTap={{ scale:.97 }} onClick={onBook}
              style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"15px 24px", border:"1px solid var(--border-strong)", color:"var(--text)", background:"transparent", fontFamily:"var(--mono)", fontSize:11, letterSpacing:".2em", textTransform:"uppercase", borderRadius:3, cursor:"pointer", transition:"all .3s" }}>
              <Ico n="calendar" size={14}/>{t.bookDemo}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PILLAR DETAIL MODAL — business-focused (outcomes + clients)
═══════════════════════════════════════════════════════ */
function PillarDetailModal({ pillar, t, ff, isRTL, lang, onBook, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!pillar) return null;

  const labelOutcomes = lang === "ar" ? "ماذا يعني هذا لعملك" : "What this means for your business";
  const labelClients  = lang === "ar" ? "عملاء يستخدمون هذه القدرة"     : "Clients using this capability";
  const labelTech     = lang === "ar" ? "التقنيات الأساسية"     : "Core technologies";

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.2 }}
      onClick={onClose}
      style={{ position:"fixed", inset:0, zIndex:300, background:"var(--modal-o)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)" }}>
      <motion.div initial={{ opacity:0, scale:.93, y:28 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.93, y:28 }}
        transition={{ duration:.4, ease:E }} onClick={e=>e.stopPropagation()}
        style={{ background:"var(--modal-bg)", border:"1px solid var(--border)", maxWidth:640, width:"100%", maxHeight:"92vh", overflow:"auto", boxShadow:"var(--shadow-x)", direction:isRTL?"rtl":"ltr" }}>

        <div style={{ padding:"clamp(28px,4vw,40px)" }}>
          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>
                {pillar.tag}
              </div>
              <h3 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:"clamp(24px,3.5vw,32px)", lineHeight:1.15, color:"var(--text)", letterSpacing:"-.02em", marginBottom:6 }}>
                {pillar.title}
              </h3>
              <div style={{ fontFamily:"var(--mono)", fontSize:11, letterSpacing:".18em", textTransform:"uppercase", color:"var(--text3)" }}>
                {pillar.sub}
              </div>
            </div>
            <motion.button whileHover={{ scale:1.1 }} onClick={onClose}
              style={{ width:36, height:36, border:"1px solid var(--border)", background:"var(--bg2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text2)", borderRadius:3, flexShrink:0 }}>
              <Ico n="close" size={14}/>
            </motion.button>
          </div>

          {/* Description */}
          <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.78, fontFamily:ff, marginBottom:32, paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
            {pillar.desc}
          </p>

          {/* Business Outcomes */}
          <div style={{ marginBottom:32 }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:18 }}>
              {labelOutcomes}
            </div>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:14 }}>
              {pillar.outcomes.map((o,i) => (
                <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <span style={{ width:20, height:20, borderRadius:"50%", background:"var(--gold-bg-soft)", border:"1px solid var(--gold-line)", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, color:"var(--gold)" }}>
                    <Ico n="check" size={11}/>
                  </span>
                  <span style={{ color:"var(--text)", fontSize:15, lineHeight:1.6, fontFamily:ff }}>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clients */}
          {pillar.clients && pillar.clients.length > 0 && (
            <div style={{ marginBottom:32, paddingTop:24, borderTop:"1px solid var(--border)" }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:14 }}>
                {labelClients}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {pillar.clients.map((c,i) => (
                  <span key={i} style={{ fontFamily:ff, fontSize:13, padding:"6px 12px", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:3, color:"var(--text)" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tech */}
          <div style={{ marginBottom:32, paddingTop:24, borderTop:"1px solid var(--border)" }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--text3)", marginBottom:12 }}>
              {labelTech}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {pillar.tech.map((tech,i) => (
                <span key={i} style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:"var(--text3)", padding:"4px 9px", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:2 }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.button whileHover={{ y:-2, boxShadow:"0 8px 24px var(--gold-shadow)" }} whileTap={{ scale:.97 }}
            onClick={onBook}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"15px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", fontFamily:"var(--mono)", fontSize:11, fontWeight:600, letterSpacing:".2em", textTransform:"uppercase", cursor:"pointer", borderRadius:3, transition:"all .3s" }}>
            <Ico n="calendar" size={14} col="var(--gold-fg)"/>
            {t.ctaBtn || "Book a consultation"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PILLAR CARD  (own component to avoid hooks-in-loops)
═══════════════════════════════════════════════════════ */
function PillarCard({ p, idx, ff, lang, onView }) {
  const [ref, v] = useInView(.05);
  return (
    <motion.div ref={ref} variants={fadeUp} custom={idx*.1} initial="hidden" animate={v?"show":"hidden"}
      onClick={() => onView(p)}
      className="pillar-card"
      style={{ background:"var(--card)", border:"1px solid var(--border)", padding:"clamp(28px,3.5vw,44px)", cursor:"pointer", minHeight:340, display:"flex", flexDirection:"column", position:"relative" }}>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)" }}>{p.tag}</div>
        <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".15em", textTransform:"uppercase", color:"var(--text3)", display:"flex", alignItems:"center", gap:5 }}>
          {lang==="ar"?"اعرف المزيد":"Learn more"}<Ico n={lang==="ar"?"arrowL":"arrowR"} size={10} col="var(--gold)"/>
        </div>
      </div>

      <div style={{ fontFamily:"var(--serif)", fontSize:"clamp(80px,9vw,108px)", fontWeight:300, fontStyle:"italic", lineHeight:.88, color:"var(--border-strong)", marginBottom:22, userSelect:"none", transition:"color .4s" }}
        onMouseEnter={e=>e.currentTarget.style.color="var(--gold-line)"}
        onMouseLeave={e=>e.currentTarget.style.color="var(--border-strong)"}>
        {p.num}
      </div>

      <h3 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:"clamp(22px,2.4vw,30px)", letterSpacing:"-.02em", lineHeight:1.1, marginBottom:8, color:"var(--text)" }}>{p.title}</h3>
      <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:16 }}>{p.sub}</div>
      <p style={{ color:"var(--text2)", fontSize:14, lineHeight:1.72, marginBottom:24, flex:1, fontFamily:ff }}>{p.desc}</p>

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, paddingTop:18, borderTop:"1px solid var(--border)" }}>
        {p.tech.map((tech,i) => (
          <span key={i} style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".1em", textTransform:"uppercase", color:"var(--text3)", padding:"4px 9px", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:2 }}>{tech}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROCESS ITEM  (own component)
═══════════════════════════════════════════════════════ */
function ProcessItem({ p, idx, ff, lang }) {
  const [ref, v] = useInView(.1);
  return (
    <motion.div ref={ref} variants={fadeUp} custom={idx*.1} initial="hidden" animate={v?"show":"hidden"}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <motion.span animate={{ boxShadow:v?"0 0 0 6px var(--gold-glow)":"0 0 0 0px var(--gold-glow)" }} transition={{ duration:.8, delay:.3+idx*.1 }}
          style={{ width:10, height:10, borderRadius:"50%", background:"var(--gold)", display:"inline-block", flexShrink:0 }}/>
        <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)" }}>
          {lang==="ar"?`خطوة ${p.n}`:`STAGE ${p.n}`}
        </div>
      </div>
      <h4 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:"clamp(22px,2.2vw,28px)", marginBottom:14, color:"var(--text)", letterSpacing:"-.015em" }}>{p.t}</h4>
      <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72, fontFamily:ff }}>{p.d}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CASE CARD  (own component)
═══════════════════════════════════════════════════════ */
function CaseCard({ c, idx }) {
  const [ref, v] = useInView(.08);
  return (
    <motion.div ref={ref} variants={fadeUp} custom={idx*.1} initial="hidden" animate={v?"show":"hidden"}
      className="case-card"
      style={{ gridColumn:c.featured?"1/-1":"auto", background:c.featured?"linear-gradient(135deg,var(--card) 0%,var(--bg2) 100%)":"var(--card)", border:"1px solid var(--border)", padding:"clamp(28px,4vw,48px)", position:"relative", overflow:"hidden" }}>
      {c.featured && (
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }}/>
      )}
      <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:18 }}>{c.tag}</div>
      <h3 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:c.featured?28:20, letterSpacing:"-.02em", marginBottom:16, lineHeight:1.15, color:"var(--text)" }}>{c.title}</h3>
      <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72, marginBottom:36, fontFamily:"inherit" }}>{c.desc}</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, paddingTop:24, borderTop:"1px solid var(--border)" }}>
        {c.stats.map((s,j) => (
          <div key={j}>
            <div style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:28, fontWeight:300, color:"var(--gold)", lineHeight:1 }}>{s.v}</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:"var(--text3)", marginTop:8 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   FAQ ITEM
═══════════════════════════════════════════════════════ */
function FaqItem({ f, isRTL, ff }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid var(--border)" }}>
      <button onClick={()=>setOpen(!open)}
        style={{ width:"100%", padding:"22px 0", background:"none", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:isRTL?"right":"left", gap:16, color:"var(--text)" }}>
        <span style={{ fontFamily:"var(--serif)", fontSize:"clamp(16px,1.8vw,20px)", fontWeight:400, lineHeight:1.4 }}>{f.q}</span>
        <motion.div animate={{ rotate:open?180:0 }} transition={{ duration:.3 }} style={{ color:"var(--gold)", flexShrink:0 }}>
          <Ico n="chevD" size={18}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:.32, ease:"easeInOut" }} style={{ overflow:"hidden" }}>
            <div style={{ paddingBottom:24, fontSize:16, color:"var(--text2)", lineHeight:1.78, fontFamily:ff, maxWidth:660 }}>{f.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STACK MARQUEE
═══════════════════════════════════════════════════════ */
function StackMarquee({ t, lang }) {
  const tripled = [...STACK,...STACK,...STACK];
  return (
    <section style={{ padding:"clamp(60px,8vw,100px) 0", borderTop:"1px solid var(--border)", background:"var(--bg2)", overflow:"hidden" }}>
      <div style={{ textAlign:"center", marginBottom:44, padding:"0 20px" }}>
        <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12 }}>
          {lang==="ar"?"05 · مكدس التقنيات":"05 · TECH STACK"}
        </div>
        <h3 style={{ fontFamily:"var(--serif)", fontWeight:300, fontStyle:"italic", fontSize:"clamp(24px,3vw,38px)", letterSpacing:"-.02em", color:"var(--text)" }}>{t.stackTitle}</h3>
      </div>
      <div className="marquee-wrap">
        <div className="marquee-track" style={{ gap:72, padding:"16px 0" }}>
          {tripled.map((s,i) => (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:72, flexShrink:0 }}>
              <span style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontWeight:300, fontSize:28, color:"var(--text)", letterSpacing:"-.01em", opacity:.7 }}>{s}</span>
              <span style={{ color:"var(--gold)", fontSize:11, fontStyle:"normal" }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA BANNER
═══════════════════════════════════════════════════════ */
function CtaBanner({ t, ff, onBook, lang }) {
  const [ref, v] = useInView(.1);
  const isAr = lang === "ar";
  // Split title into clean sentences, accent the last one
  const titleParts = t.ctaTitle.split(".").map(s => s.trim()).filter(Boolean);
  return (
    <section style={{ padding:"clamp(100px,14vw,180px) clamp(20px,4vw,52px)", textAlign:"center", position:"relative", overflow:"hidden", borderTop:"1px solid var(--border)" }}>
      <motion.div animate={{ opacity:[.2,.5,.2], scale:[1,1.18,1] }} transition={{ duration:9, repeat:Infinity, ease:"easeInOut" }}
        style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, background:"radial-gradient(circle,var(--gold-glow) 0%,transparent 55%)", filter:"blur(70px)", pointerEvents:"none" }}/>
      <div ref={ref} style={{ maxWidth:900, margin:"0 auto", position:"relative" }}>
        <motion.div variants={fadeIn} custom={0} initial="hidden" animate={v?"show":"hidden"}
          style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".25em", textTransform:"uppercase", color:"var(--gold)", marginBottom:28, display:"inline-flex", alignItems:"center", gap:10 }}>
          <span style={{ width:28, height:1, background:"var(--gold)", display:"inline-block" }}/>
          {isAr?"07 · البدء":"07 · GET STARTED"}
          <span style={{ width:28, height:1, background:"var(--gold)", display:"inline-block" }}/>
        </motion.div>
        <motion.h2 variants={fadeUp} custom={0.08} initial="hidden" animate={v?"show":"hidden"}
          dir={isAr?"rtl":"ltr"}
          style={{ fontFamily: isAr ? ff : "var(--serif)", fontWeight:300, fontSize: isAr ? "clamp(38px,6.5vw,80px)" : "clamp(44px,8vw,100px)", lineHeight: isAr ? 1.15 : .93, letterSpacing: isAr ? "0" : "-.04em", color:"var(--text)", marginBottom:32 }}>
          {titleParts.map((seg, i) =>
            i === titleParts.length - 1
              ? <em key={i} style={{ fontStyle:"italic", color:"var(--gold)" }}>{seg}.</em>
              : <span key={i}>{seg}.<br/></span>
          )}
        </motion.h2>
        <motion.p variants={fadeUp} custom={.18} initial="hidden" animate={v?"show":"hidden"}
          dir={isAr?"rtl":"ltr"}
          style={{ fontSize:"clamp(15px,1.8vw,19px)", color:"var(--text2)", maxWidth:560, margin:"0 auto 52px", lineHeight:1.78, fontFamily:ff }}>
          {t.ctaSub}
        </motion.p>
        <motion.div variants={fadeUp} custom={.28} initial="hidden" animate={v?"show":"hidden"}
          style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <motion.button whileHover={{ y:-3, boxShadow:"0 16px 44px var(--gold-shadow)" }} whileTap={{ scale:.97 }} onClick={onBook}
            style={{ display:"inline-flex", alignItems:"center", gap:12, padding:"18px 34px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", cursor:"pointer", fontFamily:"var(--mono)", fontSize:11, letterSpacing:".22em", textTransform:"uppercase", borderRadius:3, transition:"all .3s" }}>
            {t.ctaBtn} <Ico n={isAr?"arrowL":"arrowR"} size={14} col="var(--gold-fg)"/>
          </motion.button>
          <motion.a whileHover={{ y:-3 }} whileTap={{ scale:.97 }}
            href={`mailto:${EMAIL}`}
            style={{ display:"inline-flex", alignItems:"center", gap:12, padding:"18px 26px", border:"1px solid var(--border-strong)", color:"var(--text)", textDecoration:"none", fontFamily:"var(--mono)", fontSize:11, letterSpacing:".2em", textTransform:"uppercase", borderRadius:3, background:"transparent", transition:"all .3s" }}>
            <Ico n="mail" size={14}/>{EMAIL}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════ */
function Footer({ t, ff, lang }) {
  const year = new Date().getFullYear();
  const isAr = lang === "ar";
  return (
    <footer style={{ padding:"80px clamp(20px,4vw,52px) 40px", borderTop:"1px solid var(--border)", background:"var(--bg2)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div className="footer-grid" style={{ marginBottom:64 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <Mark size={48}/><div>
                <div style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:400, color:"var(--text)", lineHeight:1 }}>Arkan</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:8, letterSpacing:".3em", color:"var(--gold)", marginTop:3 }}>AI · SOLUTIONS</div>
              </div>
            </div>
            <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.72, fontFamily:ff, maxWidth:340, marginBottom:28 }}>{t.footerTag}</p>
            <div style={{ display:"flex", gap:8 }}>
              {[{href:`https://wa.me/${WA}`,icon:"whatsapp"},{href:`mailto:${EMAIL}`,icon:"mail"}].map((s,i) => (
                <motion.a key={i} whileHover={{ scale:1.08, borderColor:"var(--gold)" }} whileTap={{ scale:.92 }}
                  href={s.href} target={s.icon==="whatsapp"?"_blank":undefined} rel="noopener noreferrer"
                  style={{ width:38, height:38, border:"1px solid var(--border)", background:"var(--card)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text2)", textDecoration:"none", borderRadius:3, transition:"all .25s" }}>
                  <Ico n={s.icon} size={15}/>
                </motion.a>
              ))}
            </div>
          </div>

          {[
            { h:t.navPillars, links:[["AI Agents","#pillars"],["Automation","#pillars"],["Custom AI","#pillars"],["Bridges","#pillars"]] },
            { h:t.navProcess, links:[["Discovery","#process"],["Architecture","#process"],["Build","#process"],["Operate","#process"]] },
            { h:t.contact,    links:[[EMAIL,`mailto:${EMAIL}`],["+20 100 772 5744",`https://wa.me/${WA}`],[isAr?"القاهرة · الرياض · دبي":"Cairo · Riyadh · Dubai","#"]] },
          ].map((col,i) => (
            <div key={i}>
              <h5 style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20 }}>{col.h}</h5>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:12 }}>
                {col.links.map(([txt,href],j) => (
                  <li key={j}>
                    <a href={href} style={{ color:"var(--text3)", textDecoration:"none", fontSize:14, fontFamily:ff, transition:"color .25s" }}
                      onMouseEnter={e=>e.target.style.color="var(--text)"}
                      onMouseLeave={e=>e.target.style.color="var(--text3)"}>
                      {txt}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ paddingTop:28, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <span style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--text3)" }}>© {year} Arkan AI Solutions · {t.rights}</span>
          <span style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--text3)" }}>Built in Cairo · Engineered for MENA</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   QUALIFYING FUNNEL MODAL
═══════════════════════════════════════════════════════ */
function FunnelModal({ lang, isRTL, ff, onClose }) {
  const F = FUNNEL[lang];
  const TOTAL = 6;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({ company:"", industry:"", size:"", aiState:"", systems:[], pain:null, timeline:"", budget:"", name:"", email:"", phone:"", notes:"" });

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const upd    = (k, v) => setData(d => ({ ...d, [k]:v }));
  const toggle = s      => setData(d => ({ ...d, systems: d.systems.includes(s) ? d.systems.filter(x=>x!==s) : [...d.systems,s] }));

  const submit = async () => {
    console.log("ARKAN_DISCOVERY:", JSON.stringify({ ...data, lang, source:"arkan-landing", ts: new Date().toISOString() }, null, 2));
    // TODO: await fetch("https://n8n.engosoft.com/webhook/arkan-discovery", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...data,lang,source:"arkan-landing",ts:new Date().toISOString()}) });
    setDone(true);
  };

  const L = ({ label }) => (
    <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:10 }}>{label}</div>
  );

  const CB = ({ val, sel, onClick, sub }) => (
    <motion.button whileTap={{ scale:.97 }} onClick={onClick}
      className={`choice-btn${sel?" selected":""}`}
      style={{ fontFamily:ff }}>
      {val}
      {sub && <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".1em", color:sel?"var(--gold)":"var(--text3)", marginTop:4 }}>{sub}</div>}
    </motion.button>
  );

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.2 }}
      onClick={onClose}
      style={{ position:"fixed", inset:0, zIndex:300, background:"var(--modal-o)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" }}>
      <motion.div initial={{ opacity:0, scale:.93, y:32 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:.93, y:32 }}
        transition={{ duration:.42, ease:E }} onClick={e=>e.stopPropagation()}
        style={{ background:"var(--modal-bg)", border:"1px solid var(--border)", maxWidth:600, width:"100%", maxHeight:"94vh", overflow:"auto", boxShadow:"var(--shadow-x)", position:"relative" }}>

        {/* Close */}
        <motion.button whileHover={{ scale:1.1 }} onClick={onClose}
          style={{ position:"absolute", top:20, [isRTL?"left":"right"]:20, width:34, height:34, border:"1px solid var(--border)", background:"var(--bg2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text2)", zIndex:5, borderRadius:3 }}>
          <Ico n="close" size={13}/>
        </motion.button>

        {done ? (
          /* ── Success state ── */
          <div style={{ padding:"60px 40px 52px", textAlign:"center" }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:260, delay:.1 }}
              style={{ width:68, height:68, borderRadius:"50%", background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px" }}>
              <Ico n="check" size={30} col="var(--gold-fg)"/>
            </motion.div>
            <h3 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:36, letterSpacing:"-.02em", marginBottom:16, color:"var(--text)" }}>{F.done}</h3>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72, fontFamily:ff, marginBottom:36, maxWidth:400, margin:"0 auto 36px" }}>{F.doneSub}</p>
            <motion.button whileHover={{ y:-2 }} onClick={onClose}
              style={{ padding:"14px 36px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", cursor:"pointer", fontFamily:"var(--mono)", fontSize:11, letterSpacing:".22em", textTransform:"uppercase", borderRadius:3 }}>
              {F.close}
            </motion.button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding:"36px 40px 0" }}>
              {/* Progress bars */}
              <div style={{ display:"flex", gap:5, marginBottom:16 }}>
                {Array.from({length:TOTAL},(_,i) => (
                  <div key={i} className={`prog-bar${i<step?" on":""}`} style={{ flex:1 }}/>
                ))}
              </div>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>
                {F.steps[step-1]} · {step}/{TOTAL}
              </div>
              <h2 style={{ fontFamily:"var(--serif)", fontWeight:300, fontSize:"clamp(24px,3vw,30px)", letterSpacing:"-.02em", color:"var(--text)", marginBottom:6 }}>{F.title}</h2>
              <p style={{ color:"var(--text3)", fontSize:13, fontFamily:ff, marginBottom:28 }}>{F.sub}</p>
            </div>

            {/* Step content */}
            <div style={{ padding:"0 40px" }}>
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity:0, x:isRTL?-18:18 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:isRTL?18:-18 }}
                  transition={{ duration:.26, ease:E }}>

                  {step===1 && (<>
                    <L label={F.lCompany}/>
                    <input type="text" value={data.company} onChange={e=>upd("company",e.target.value)} placeholder="Acme Corp."
                      className="arkan-input" style={{ marginBottom:22, fontFamily:ff }}/>
                    <L label={F.lIndustry}/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:22 }}>
                      {F.industries.map((ind,i)=><CB key={i} val={ind} sel={data.industry===ind} onClick={()=>upd("industry",ind)}/>)}
                    </div>
                    <L label={F.lSize}/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                      {F.sizes.map((sz,i)=><CB key={i} val={sz} sel={data.size===sz} onClick={()=>upd("size",sz)}/>)}
                    </div>
                  </>)}

                  {step===2 && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:8, marginBottom:8 }}>
                      {F.aiStates.map((st,i)=><CB key={i} val={st} sel={data.aiState===st} onClick={()=>upd("aiState",st)}/>)}
                    </div>
                  )}

                  {step===3 && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                      {F.systems.map((sys,i) => (
                        <motion.button key={i} whileTap={{ scale:.97 }} onClick={()=>toggle(sys)}
                          className={`choice-btn${data.systems.includes(sys)?" selected":""}`}
                          style={{ fontFamily:ff, display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ width:14, height:14, border:`1.5px solid ${data.systems.includes(sys)?"var(--gold)":"var(--border)"}`, borderRadius:2, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"border-color .2s" }}>
                            {data.systems.includes(sys) && <Ico n="check" size={9} col="var(--gold)"/>}
                          </span>
                          {sys}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {step===4 && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:8, marginBottom:8 }}>
                      {F.pains.map((pain,i)=><CB key={i} val={pain.t} sel={data.pain?.t===pain.t} onClick={()=>upd("pain",pain)} sub={pain.p}/>)}
                    </div>
                  )}

                  {step===5 && (<>
                    <L label={lang==="ar"?"التوقيت":"Timeline"}/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:22 }}>
                      {F.timelines.map((tl,i)=><CB key={i} val={tl} sel={data.timeline===tl} onClick={()=>upd("timeline",tl)}/>)}
                    </div>
                    <L label={lang==="ar"?"الميزانية التقريبية":"Approximate budget"}/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:8, marginBottom:8 }}>
                      {F.budgets.map((b,i)=><CB key={i} val={b} sel={data.budget===b} onClick={()=>upd("budget",b)}/>)}
                    </div>
                  </>)}

                  {step===6 && (<>
                    <L label={F.lName}/><input type="text" value={data.name} onChange={e=>upd("name",e.target.value)} placeholder={lang==="ar"?"أحمد محمد":"Ahmed Mohamed"} className="arkan-input" style={{ marginBottom:18, fontFamily:ff }}/>
                    <L label={F.lEmail}/><input type="email" value={data.email} onChange={e=>upd("email",e.target.value)} placeholder="hello@company.com" className="arkan-input" style={{ marginBottom:18, fontFamily:ff }}/>
                    <L label={F.lPhone}/><input type="tel" value={data.phone} onChange={e=>upd("phone",e.target.value)} placeholder="+20 100 000 0000" className="arkan-input" style={{ marginBottom:18, fontFamily:ff }}/>
                    <L label={F.lNotes}/><textarea value={data.notes} onChange={e=>upd("notes",e.target.value)} className="arkan-textarea" style={{ marginBottom:8, fontFamily:ff }}/>
                  </>)}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="funnel-footer" style={{ padding:"20px 40px 32px", borderTop:"1px solid var(--border)", marginTop:18, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <motion.a whileHover={{ opacity:.7 }} href={CAL} target="_blank" rel="noopener noreferrer"
                style={{ color:"var(--text3)", fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", textDecoration:"underline", textUnderlineOffset:3, cursor:"pointer" }}>
                {F.skip}
              </motion.a>

              <div className="funnel-actions" style={{ display:"flex", gap:10 }}>
                {step>1 && (
                  <motion.button whileTap={{ scale:.97 }} onClick={()=>setStep(s=>s-1)}
                    style={{ padding:"12px 22px", background:"var(--bg2)", border:"1px solid var(--border)", color:"var(--text)", cursor:"pointer", fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", borderRadius:3, transition:"all .2s" }}>
                    {F.back}
                  </motion.button>
                )}
                {step<TOTAL ? (
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }} onClick={()=>setStep(s=>s+1)}
                    style={{ padding:"12px 26px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", cursor:"pointer", fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:10, borderRadius:3, transition:"all .25s" }}>
                    {F.next} <Ico n={isRTL?"arrowL":"arrowR"} size={12} col="var(--gold-fg)"/>
                  </motion.button>
                ) : (
                  <motion.button whileHover={{ scale:1.02, boxShadow:"0 8px 24px var(--gold-shadow)" }} whileTap={{ scale:.97 }} onClick={submit}
                    style={{ padding:"12px 26px", background:"var(--gold)", color:"var(--gold-fg)", border:"none", cursor:"pointer", fontFamily:"var(--mono)", fontSize:10, letterSpacing:".2em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:10, borderRadius:3, transition:"all .25s" }}>
                    {F.submit} <Ico n="check" size={12} col="var(--gold-fg)"/>
                  </motion.button>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [lang,    setLang]    = useState("ar");
  const [mode,    setMode]    = useState("light"); // ← LIGHT DEFAULT
  const [funnel,  setFunnel]  = useState(false);
  const [activePillar, setActivePillar] = useState(null);  // pillar object

  const isRTL = lang === "ar";
  const ff    = isRTL
    ? "'IBM Plex Sans Arabic','Tajawal',sans-serif"
    : "'Geist',-apple-system,sans-serif";
  const t = T[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("dir",  isRTL?"rtl":"ltr");
    document.documentElement.setAttribute("lang", lang);
    document.body.style.fontFamily = ff;
  }, [isRTL, lang, ff]);

  const openFunnel = useCallback(() => setFunnel(true),  []);
  const openPillar = useCallback((pillar) => setActivePillar(pillar), []);

  return (
    <div style={{ fontFamily:ff, color:"var(--text)", background:"var(--bg)", minHeight:"100vh", overflowX:"hidden", transition:"background .4s,color .4s" }}>

      <Navbar lang={lang} setLang={setLang} mode={mode} setMode={setMode} t={t} ff={ff} onBook={openFunnel}/>

      {/* ── Hero ── */}
      <Hero t={t} ff={ff} onBook={openFunnel} lang={lang}/>

      {/* ── Demo (client can try!) ── */}
      <DemoSection t={t} ff={ff} onBook={openFunnel} lang={lang}/>

      {/* ── Four Pillars ── */}
      <Sec id="pillars" bg="var(--bg2)">
        <SectionHeader num={lang==="ar"?"02 — الأركان الأربعة":"02 — THE FOUR PILLARS"} title={t.pillarsTitle} sub={t.pillarsSub} ff={ff}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
          {PILLARS[lang].map((p,i) => (
            <PillarCard key={p.id} p={p} idx={i} ff={ff} lang={lang} onView={openPillar}/>
          ))}
        </div>
      </Sec>

      {/* ── Process ── */}
      <Sec id="process">
        <SectionHeader num={lang==="ar"?"03 — المنهجية":"03 — ENGAGEMENT MODEL"} title={t.processTitle} sub={t.processSub} ff={ff}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:"clamp(40px,5vw,60px)" }} className="process-grid">
          {PROCESS[lang].map((p,i) => <ProcessItem key={i} p={p} idx={i} ff={ff} lang={lang}/>)}
        </div>
      </Sec>

      {/* ── Cases ── */}
      <Sec id="work" bg="var(--bg2)">
        <SectionHeader num={lang==="ar"?"04 — الأعمال":"04 — PRODUCTION WORK"} title={t.casesTitle} sub={t.casesSub} ff={ff}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:28 }} className="cases-grid">
          {CASES[lang].map((c,i) => <CaseCard key={i} c={c} idx={i}/>)}
        </div>
      </Sec>

      {/* ── Stack marquee ── */}
      <StackMarquee t={t} lang={lang}/>

      {/* ── FAQ ── */}
      <Sec>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <SectionHeader num={lang==="ar"?"06 — الأسئلة المتكررة":"06 — FREQUENTLY ASKED"} title={t.faqTitle} ff={ff}/>
          {FAQS[lang].map((f,i) => <FaqItem key={i} f={f} isRTL={isRTL} ff={ff}/>)}
        </div>
      </Sec>

      {/* ── CTA Banner ── */}
      <CtaBanner t={t} ff={ff} onBook={openFunnel} lang={lang}/>

      {/* ── Footer ── */}
      <Footer t={t} ff={ff} lang={lang}/>

      {/* ── WhatsApp FAB ── */}
      <motion.a
        initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay:1.6, type:"spring", stiffness:280 }}
        whileHover={{ scale:1.12 }} whileTap={{ scale:.88 }}
        href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", bottom:26, [isRTL?"left":"right"]:26, zIndex:99, width:54, height:54, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,211,102,.42)", textDecoration:"none" }}>
        <Ico n="whatsapp" size={26} col="#fff"/>
        <span style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid #25D366", animation:"pulseRing 2.6s ease-out infinite" }}/>
      </motion.a>

      {/* ── Modals ── */}
      <AnimatePresence>
        {funnel   && <FunnelModal  key="funnel" lang={lang} isRTL={isRTL} ff={ff} onClose={()=>setFunnel(false)}/>}
        {activePillar && <PillarDetailModal key="pillar" pillar={activePillar} t={t} ff={ff} isRTL={isRTL} lang={lang} onBook={openFunnel} onClose={()=>setActivePillar(null)}/>}
      </AnimatePresence>
    </div>
  );
}
