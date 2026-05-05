import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

// ─── Links ────────────────────────────────────────────────────────────────────
const WA    = "201007725744";
const CAL   = "https://calendar.app.google/35V4etCwYoD5poM77";
const EMAIL = "hello@arkan.ai";

// ─── Workflow node data (kept from Engosoft, used in Pillar showcases) ────────
const FLOWS = {
  agents:[
    {icon:"💬",n:"User Message"},{icon:"🧠",n:"Intent Detection"},
    {icon:"📚",n:"RAG Lookup"},{icon:"🤖",n:"Response Gen"},
    {icon:"🔀",n:"HITL Router"},{icon:"📊",n:"Log to CRM"},
    {icon:"📤",n:"Send Reply"},{icon:"🔁",n:"Context Update"},
  ],
  workflow:[
    {icon:"⏰",n:"Trigger"},{icon:"📥",n:"Fetch Data"},
    {icon:"🧹",n:"Clean & Validate"},{icon:"🤖",n:"AI Process"},
    {icon:"🔌",n:"Sync Systems"},{icon:"📧",n:"Notify"},
    {icon:"💾",n:"Persist"},{icon:"📊",n:"Report"},
  ],
  voice:[
    {icon:"📞",n:"Call Recorded"},{icon:"⬇️",n:"Download Audio"},
    {icon:"🔊",n:"Resample 16kHz"},{icon:"🎙️",n:"Whisper STT"},
    {icon:"🤖",n:"GPT-4o Score"},{icon:"🔗",n:"Match Opp"},
    {icon:"📊",n:"Update CRM"},{icon:"📧",n:"Coach Report"},
  ],
  bridge:[
    {icon:"📨",n:"Webhook In"},{icon:"🔐",n:"Verify Sig"},
    {icon:"🔄",n:"Transform"},{icon:"🔌",n:"Route"},
    {icon:"🛡️",n:"Retry Logic"},{icon:"📤",n:"Webhook Out"},
    {icon:"📝",n:"Audit Log"},{icon:"✅",n:"ACK"},
  ],
};

// ─── Pillars (the four core services) ─────────────────────────────────────────
const PILLARS = {
  ar:[
    {id:"agents",num:"I",tag:"العمود الأول",title:"الوكلاء الذكيون",sub:"AI Agents",
      desc:"وكلاء محادثة عربية أصلية للمبيعات والدعم والعمليات الداخلية. مبنيون على Botpress و SDK مخصص مع تكامل عميق مع أنظمتك.",
      flow:"agents",
      tech:["Botpress","Custom SDK","RAG","HITL","Pinecone"]},
    {id:"workflow",num:"II",tag:"العمود الثاني",title:"أتمتة سير العمل",sub:"Workflow Automation",
      desc:"أتمتة العمليات بـ n8n، مستضافة ذاتياً، خاضعة لإدارة الإصدارات، ومبنية للتعامل مع الحالات الاستثنائية التي تكسر أنظمة الإنتاج عند الـ 2 صباحاً.",
      flow:"workflow",
      tech:["n8n","Webhooks","Cron","Queue","Docker"]},
    {id:"custom",num:"III",tag:"العمود الثالث",title:"حلول AI مخصصة",sub:"Custom AI Solutions",
      desc:"أنظمة RAG، نماذج لغوية مخصصة عربياً (LLM fine-tuning)، خطوط معالجة الصوت (تفريغ، TTS، wake-word)، وكلاء متعددو الوسائط.",
      flow:"voice",
      tech:["Whisper","QLoRA","Ollama","Pinecone","GPT-4o"]},
    {id:"bridge",num:"IV",tag:"العمود الرابع",title:"التكاملات والجسور",sub:"Integrations & Bridges",
      desc:"النسيج الرابط بين Chatwoot وOdoo وBotpress وShopify وWhatsApp. خوادم جسر مخصصة تنجو من تحديثات المزودين، وتتعامل مع المصادقة بشكل صحيح.",
      flow:"bridge",
      tech:["Node.js","TypeScript","Coolify","OAuth","Webhooks"]},
  ],
  en:[
    {id:"agents",num:"I",tag:"PILLAR I",title:"AI Agents",sub:"Conversational intelligence",
      desc:"Arabic-first conversational agents for sales, support, and internal ops. Built on Botpress and custom SDKs with deep integration into your stack.",
      flow:"agents",
      tech:["Botpress","Custom SDK","RAG","HITL","Pinecone"]},
    {id:"workflow",num:"II",tag:"PILLAR II",title:"Workflow Automation",sub:"Process orchestration",
      desc:"n8n-based business process automation. Self-hosted, version-controlled, built to handle the edge cases that break production at 2 AM.",
      flow:"workflow",
      tech:["n8n","Webhooks","Cron","Queue","Docker"]},
    {id:"custom",num:"III",tag:"PILLAR III",title:"Custom AI Solutions",sub:"Bespoke intelligence",
      desc:"RAG systems, fine-tuned Arabic LLMs, voice pipelines (Whisper, TTS, wake-word), multimodal agents. When off-the-shelf doesn't fit, we engineer the right answer.",
      flow:"voice",
      tech:["Whisper","QLoRA","Ollama","Pinecone","GPT-4o"]},
    {id:"bridge",num:"IV",tag:"PILLAR IV",title:"Integrations & Bridges",sub:"Connective tissue",
      desc:"Custom bridge servers connecting Chatwoot, Odoo, Botpress, Shopify, WhatsApp. Built to survive vendor updates, handle auth correctly, and log what actually happened.",
      flow:"bridge",
      tech:["Node.js","TypeScript","Coolify","OAuth","Webhooks"]},
  ],
};

// ─── Process Steps ────────────────────────────────────────────────────────────
const PROCESS = {
  ar:[
    {n:"01",t:"الاكتشاف",d:"أسبوعان من التدقيق المنظم. نرسم خريطة لمنظومتك، ومواطن الاختناق، والاقتصاديات الفعلية لسير العمل."},
    {n:"02",t:"التصميم المعماري",d:"تصميم النظام، خطة التكامل، نموذج البيانات، استراتيجية المراقبة — موثّقة ومراجَعة قبل كتابة أي كود."},
    {n:"03",t:"البناء والشحن",d:"تسليم تكراري كل أسبوعين. بنية تحتية مستضافة ذاتياً، تحكم بالإصدارات، اختبارات شاملة قبل كل إطلاق."},
    {n:"04",t:"التشغيل",d:"عقد اختياري للمراقبة والاستجابة للحوادث والتحسين المستمر. الأسبوع الأول يعمل بشكل مثالي، الأسبوع العاشر يحتاج صيانة."},
  ],
  en:[
    {n:"01",t:"Discovery",d:"Two-week structured audit. We map your stack, your bottlenecks, and the actual unit economics of the workflow we'd be replacing."},
    {n:"02",t:"Architecture",d:"System design, integration plan, data model, observability strategy — written down, reviewed, signed off before any code is written."},
    {n:"03",t:"Build & Ship",d:"Iterative delivery in two-week increments. Self-hosted infra, version-controlled workflows, end-to-end testing before each go-live."},
    {n:"04",t:"Operate",d:"Optional retainer for monitoring, incident response, continuous improvement. Week one runs perfectly. Week ten needs maintenance."},
  ],
};

// ─── Case Studies / Production Work ───────────────────────────────────────────
const CASES = {
  ar:[
    {tag:"دراسة حالة · الأعمدة I + II + IV",
      title:"منظومة خدمة عملاء ذكية ثنائية اللغة",
      desc:"جسر Chatwoot ↔ Botpress متكامل مع AI عربي، تسليم HITL ذكي، مزامنة CRM. هاجرنا 40,000 جهة اتصال بدون انقطاع.",
      stats:[{v:"40k+",l:"جهة اتصال"},{v:"99.7%",l:"وقت التشغيل"},{v:"2.4ث",l:"زمن استجابة"}]},
    {tag:"دراسة حالة · العمود III",
      title:"خط معالجة المكالمات الذكي",
      desc:"Yeastar PBX → Whisper → GPT-4o → Pinecone → Odoo. كل مكالمة مبيعات تُفرّغ، تُقيَّم، تُفهرَس، وتُربط بالفرصة الصحيحة.",
      stats:[{v:"100%",l:"مكالمات مفهرسة"},{v:"12",l:"حقل CRM"},{v:"عربي",l:"لهجة محلية"}]},
    {tag:"دراسة حالة · العمود II",
      title:"HR-in-a-Box للشركات الصغيرة",
      desc:"19 سير عمل فرعي في n8n لمصادر المرشحين والفرز والجدولة. متعدد المستأجرين، Boolean X-Ray search، إثراء LinkedIn.",
      stats:[{v:"19",l:"سير عمل"},{v:"3",l:"مستأجرون"},{v:"SaaS",l:"منتج جاهز"}]},
  ],
  en:[
    {tag:"CASE · PILLARS I + II + IV",
      title:"Bilingual customer-service intelligence stack",
      desc:"End-to-end Chatwoot ↔ Botpress bridge with Arabic AI, HITL handoff, Odoo CRM sync. Migrated 40,000 contacts with zero downtime.",
      stats:[{v:"40k+",l:"Contacts"},{v:"99.7%",l:"Uptime"},{v:"~2.4s",l:"Response"}]},
    {tag:"CASE · PILLAR III",
      title:"Voice-driven CRM intelligence pipeline",
      desc:"Yeastar PBX → Whisper → GPT-4o → Pinecone → Odoo. Every sales call transcribed, scored, indexed, attached to the right opportunity.",
      stats:[{v:"100%",l:"Calls Indexed"},{v:"12",l:"Fields Synced"},{v:"AR",l:"Native"}]},
    {tag:"CASE · PILLAR II",
      title:"HR-in-a-Box for MENA SMEs",
      desc:"19 orchestrated n8n sub-workflows: candidate sourcing, screening, scheduling. Multi-tenant, Boolean X-Ray, LinkedIn enrichment.",
      stats:[{v:"19",l:"Sub-Workflows"},{v:"3",l:"Pilot Tenants"},{v:"SaaS",l:"Productized"}]},
  ],
};

// ─── Tools/Stack ──────────────────────────────────────────────────────────────
const STACK = ["n8n","Botpress","Odoo","Pinecone","Chatwoot","Coolify","OpenAI","Anthropic","Gemini","Groq","Whisper","UiPath"];

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const FAQS = {
  ar:[
    {q:"كم يستغرق المشروع المتوسط؟",a:"معظم المشاريع تستغرق 8–16 أسبوعاً من الاكتشاف إلى الإطلاق. المشاريع الأبسط تنتهي في 4–6 أسابيع. سنتفق على جدول زمني محدد بعد جلسة الاكتشاف."},
    {q:"هل تتكاملون مع أنظمتنا الحالية؟",a:"نعم. نتكامل مع Odoo و HubSpot و Salesforce و Shopify و Salla و Zid و WhatsApp Business و Yeastar PBX و أي نظام يدعم REST APIs أو Webhooks."},
    {q:"هل نحتاج إلى البنية التحتية الخاصة بنا؟",a:"اختياري. يمكننا النشر على بنيتك التحتية أو على بنيتنا الذاتية الاستضافة (Coolify على Hetzner). كل ما نبنيه ملكك بالكامل، بدون قفل المورد."},
    {q:"هل يدعم النظام اللهجات العربية؟",a:"نعم. الفصحى، المصرية، السعودية، الخليجية، والإنجليزية — مع كشف لغوي تلقائي والقدرة على fine-tune نماذج خاصة لمجال عملك."},
    {q:"ماذا يحدث بعد الإطلاق؟",a:"30 يوماً من الدعم التشغيلي ضمن المشروع. بعدها، عقد اختياري شهري للمراقبة والاستجابة للحوادث والتحسينات المستمرة."},
    {q:"كم تكلفة المشروع؟",a:"المشاريع تبدأ من $5,000 لمشروع محدد إلى $50,000+ لأنظمة المؤسسات الكاملة. نقدم تسعيراً ثابتاً للنطاق المتفق عليه — لا توجد فواتير مفاجئة."},
  ],
  en:[
    {q:"How long does a typical project take?",a:"Most projects run 8–16 weeks from discovery to launch. Simpler builds wrap in 4–6 weeks. We commit to a specific timeline after the discovery session."},
    {q:"Do you integrate with our existing systems?",a:"Yes. Odoo, HubSpot, Salesforce, Shopify, Salla, Zid, WhatsApp Business, Yeastar PBX, and any system that exposes REST APIs or webhooks."},
    {q:"Do we need our own infrastructure?",a:"Optional. We can deploy on your infrastructure or our self-hosted setup (Coolify on Hetzner). Everything we build is yours — no vendor lock-in."},
    {q:"Does the system handle Arabic dialects?",a:"Yes. MSA, Egyptian, Saudi, Gulf dialects, and English — with automatic language detection and the ability to fine-tune domain-specific models."},
    {q:"What happens after launch?",a:"30 days of operational support included. After that, an optional monthly retainer for monitoring, incident response, and continuous improvements."},
    {q:"What does it cost?",a:"Projects range from $5,000 for a defined scope to $50,000+ for full enterprise systems. We commit to fixed pricing for agreed scope — no surprise invoices."},
  ],
};

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  ar:{
    navWork:"الأعمال",navPillars:"الأركان",navProcess:"المنهجية",navContact:"تواصل",
    navCta:"احجز استشارة",
    eyebrow:"القاهرة · الرياض · دبي · MENA",
    h1a:"أركان",h1b:"الأتمتة الذكية.",
    sub:"نهندس البنية التحتية الذكية الحاملة للذكاء الاصطناعي في المؤسسات الحديثة — وكلاء، أتمتة، تكاملات تنجو ربعاً كاملاً بعد الإطلاق.",
    cta:"ابدأ مشروعاً",ctaSec:"تواصل عبر WhatsApp",
    metric1:"جهة اتصال مهاجَرة",metric2:"سير عمل إنتاجي",metric3:"تكامل نشط",metric4:"ثنائي اللغة",
    pillarsTitle:"أربعة أعمدة. منظومة واحدة للذكاء الاصطناعي.",
    pillarsSub:"كل ارتباط مع أركان منظَّم حول أربعة تخصصات. ليست باقات — هذه القدرات الفعلية المطلوبة لتشغيل AI في الإنتاج.",
    processTitle:"كيف نبني.",processSub:"نموذج ارتباط من أربع مراحل مصمم للنتائج الإنتاجية — وليس للنماذج التجريبية التي تموت في الأسبوع الثالث.",
    casesTitle:"عمل إنتاجي.",casesSub:"كل نظام يُعرض هنا في الإنتاج النشط اليوم — ليس عرضاً، ليس شريحة.",
    stackTitle:"مبني بأدوات اختبرتها ساعة الـ 3 صباحاً.",
    faqTitle:"الأسئلة المتكررة.",
    ctaTitle:"ابنِ الأركان. لا الـ Buzzwords.",
    ctaSub:"30 دقيقة لفهم اختناقك. ولنخبرك بصراحة هل AI هو الحل الصحيح. لو لم يكن، سنقول ذلك.",
    ctaBtn:"احجز جلسة اكتشاف",
    workflow:"سير العمل",viewFlow:"شاهد التدفق",
    footerTag:"نهندس البنية التحتية الذكية الحاملة للذكاء الاصطناعي في المؤسسات الحديثة عبر MENA.",
    contact:"تواصل",rights:"جميع الحقوق محفوظة","footer-c":"القاهرة · الرياض · دبي",
  },
  en:{
    navWork:"Work",navPillars:"Pillars",navProcess:"Process",navContact:"Contact",
    navCta:"Start a Project",
    eyebrow:"Cairo · Riyadh · Dubai · MENA",
    h1a:"The pillars of",h1b:"intelligent automation.",
    sub:"We engineer the load-bearing AI infrastructure beneath modern enterprises — agents, automation, integrations that survive a quarter past launch.",
    cta:"Start a project",ctaSec:"Reach via WhatsApp",
    metric1:"Contacts migrated",metric2:"Production workflows",metric3:"Active integrations",metric4:"Bilingual by design",
    pillarsTitle:"Four pillars. One operating system for AI.",
    pillarsSub:"Every Arkan engagement is structured around four disciplines. Not packages — actual capabilities required to make AI work in production.",
    processTitle:"How we build.",processSub:"A four-stage engagement model designed for production outcomes — not pilots that die in week three.",
    casesTitle:"Production work.",casesSub:"Every system shown here is in active production today — not a demo, not a deck slide.",
    stackTitle:"Tools that have earned their place at 3 AM.",
    faqTitle:"Frequently asked.",
    ctaTitle:"Build the foundations. Not the buzzwords.",
    ctaSub:"30 minutes to understand your bottleneck and tell you, honestly, whether AI is the right answer. If it isn't, we'll say so.",
    ctaBtn:"Book a discovery call",
    workflow:"WORKFLOW",viewFlow:"View flow",
    footerTag:"Engineering load-bearing AI infrastructure beneath modern enterprises across MENA.",
    contact:"Reach us",rights:"All rights reserved","footer-c":"Cairo · Riyadh · Dubai",
  },
};

// ─── Sales Funnel translations ────────────────────────────────────────────────
const FUNNEL = {
  ar:{
    title:"احجز جلسة اكتشاف",sub:"ساعدنا نفهم وضعك في 60 ثانية. كل سؤال خياري — تخطَّ ما لا ينطبق.",
    skip:"تخطّى وحدّد موعداً مباشرة",
    back:"السابق",next:"التالي",submit:"احجز الموعد",
    step:"خطوة",of:"من",
    s1:{t:"حدّثنا عن شركتك",sub:"معلومات أساسية تساعدنا نجهّز للاجتماع."},
    s2:{t:"وضعك الحالي مع الـ AI",sub:"ما الذي تستخدمه اليوم — لو وُجد؟"},
    s3:{t:"أنظمتك الحالية",sub:"اختر كل ما ينطبق. هذا يساعدنا نقيّم تعقيد التكامل."},
    s4:{t:"ما هي نقطة الألم الأساسية؟",sub:"هذا يحدّد العمود الذي سنبدأ منه."},
    s5:{t:"الجدول الزمني والميزانية",sub:"تقريبي تماماً — يمكن التعديل لاحقاً."},
    s6:{t:"كيف نتواصل؟",sub:"بياناتك تذهب مباشرة إلينا — لا CRM، لا أدوات تتبع."},
    f_company:"اسم الشركة",f_industry:"المجال / القطاع",f_size:"حجم الفريق",
    f_aiState:"وضعك مع الـ AI حالياً",f_systems:"الأنظمة المستخدمة",f_pain:"نقطة الألم الأساسية",
    f_timeline:"الجدول الزمني",f_budget:"الميزانية التقديرية",
    f_name:"الاسم",f_email:"البريد الإلكتروني",f_phone:"الهاتف / WhatsApp",
    f_notes:"شيء إضافي تريدنا نعرفه؟ (اختياري)",
    industries:["تجارة إلكترونية","صيدلانية","تعليم وتدريب","عقارات","رعاية صحية","لوجستيات","B2B / خدمات","تصنيع","أخرى"],
    sizes:["5–20 موظف","20–50 موظف","50–200 موظف","200+ موظف"],
    aiStates:["نبدأ من الصفر","نستخدم Chatbots بسيطة","نستخدم n8n / Zapier / Make","لدينا AI مخصص (RAG, Agents)"],
    systems:["Odoo","Shopify","HubSpot","Salesforce","WhatsApp Business","Chatwoot","Yeastar / IP-PBX","سلة / Zid","نظام مخصص","لا يوجد"],
    pains:[
      {t:"خدمة العملاء مرهقة لفريقي",p:"العمود I — الوكلاء"},
      {t:"عمليات يدوية تستهلك وقت الفريق",p:"العمود II — الأتمتة"},
      {t:"أحتاج AI مخصصاً لمجال عملي",p:"العمود III — الحلول المخصصة"},
      {t:"أنظمتي لا تتحدث مع بعضها",p:"العمود IV — التكاملات"},
    ],
    timelines:["في أقرب وقت","1–3 شهور","3–6 شهور","استكشاف فقط"],
    budgets:["أقل من $5,000","$5,000 – $15,000","$15,000 – $50,000","$50,000+","ميزانية مؤسسية"],
    successT:"تم. سنتواصل خلال 24 ساعة.",
    successS:"بياناتك وصلتنا. ستحصل على تأكيد عبر البريد الإلكتروني خلال دقائق، ودعوة جدولة خلال يوم عمل واحد.",
    close:"إغلاق",
  },
  en:{
    title:"Book a discovery call",sub:"Help us understand your situation in 60 seconds. Every question is optional — skip what doesn't apply.",
    skip:"Skip and just schedule directly",
    back:"Back",next:"Continue",submit:"Book the call",
    step:"Step",of:"of",
    s1:{t:"Tell us about your company",sub:"Basics so we can prep for the call."},
    s2:{t:"Your current AI state",sub:"What's running today — if anything?"},
    s3:{t:"Existing systems",sub:"Select all that apply. Helps us scope integration complexity."},
    s4:{t:"What's the primary pain point?",sub:"This determines which pillar we start from."},
    s5:{t:"Timeline & budget",sub:"Rough is fine — can be adjusted later."},
    s6:{t:"How do we reach you?",sub:"Goes straight to us. No CRM, no tracking pixels."},
    f_company:"Company name",f_industry:"Industry / Sector",f_size:"Team size",
    f_aiState:"Your current AI state",f_systems:"Systems in use",f_pain:"Primary pain point",
    f_timeline:"Timeline",f_budget:"Budget range",
    f_name:"Name",f_email:"Email",f_phone:"Phone / WhatsApp",
    f_notes:"Anything else we should know? (Optional)",
    industries:["E-commerce","Pharma","Education / Training","Real Estate","Healthcare","Logistics","B2B / Services","Manufacturing","Other"],
    sizes:["5–20 employees","20–50 employees","50–200 employees","200+ employees"],
    aiStates:["We're starting from scratch","We use basic chatbots","We use n8n / Zapier / Make","We have custom AI (RAG, Agents)"],
    systems:["Odoo","Shopify","HubSpot","Salesforce","WhatsApp Business","Chatwoot","Yeastar / IP-PBX","Salla / Zid","Custom system","None"],
    pains:[
      {t:"Customer service is overwhelming",p:"Pillar I — Agents"},
      {t:"Manual workflows eating my team's time",p:"Pillar II — Automation"},
      {t:"I need custom AI for my domain",p:"Pillar III — Custom"},
      {t:"My systems don't talk to each other",p:"Pillar IV — Bridges"},
    ],
    timelines:["ASAP","1–3 months","3–6 months","Just exploring"],
    budgets:["Under $5,000","$5,000 – $15,000","$15,000 – $50,000","$50,000+","Enterprise"],
    successT:"Got it. We'll be in touch within 24 hours.",
    successS:"Your details are with us. You'll get an email confirmation in minutes and a scheduling invite within one business day.",
    close:"Close",
  },
};

// ─── Framer Motion variants ───────────────────────────────────────────────────
const fadeUp    = {hidden:{opacity:0,y:28},show:(d=0)=>({opacity:1,y:0,transition:{duration:0.7,delay:d,ease:[0.16,1,0.3,1]}})};
const fadeLeft  = {hidden:{opacity:0,x:-32},show:{opacity:1,x:0,transition:{duration:0.7,ease:[0.16,1,0.3,1]}}};
const fadeRight = {hidden:{opacity:0,x:32}, show:{opacity:1,x:0,transition:{duration:0.7,ease:[0.16,1,0.3,1]}}};
const scaleIn   = {hidden:{opacity:0,scale:0.95},show:{opacity:1,scale:1,transition:{duration:0.6,ease:[0.16,1,0.3,1]}}};

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(thresh=0.1){
  const ref=useRef();
  const [v,setV]=useState(false);
  useEffect(()=>{
    const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:thresh});
    if(ref.current)ob.observe(ref.current);
    return()=>ob.disconnect();
  },[thresh]);
  return [ref,v];
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const ICONS = {
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
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  mail:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  whatsapp: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};
const Ico = ({n,size=16,col})=>(
  <span style={{display:"inline-flex",width:size,height:size,flexShrink:0,color:col||"currentColor"}}>{ICONS[n]}</span>
);

// ─── Arkan Logo Component ─────────────────────────────────────────────────────
function ArkanMark({size=36}){
  return(
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <rect width="96" height="96" rx="14" fill="var(--logo-bg)"/>
      <rect x="0.5" y="0.5" width="95" height="95" rx="13.5" stroke="var(--gold)" strokeWidth="0.6" opacity="0.4"/>
      <g transform="translate(8, 4)">
        <circle cx="40" cy="20" r="5" fill="var(--gold)"/>
        <path d="M 14 38 Q 27 20, 40 24 Q 53 20, 66 38" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <rect x="11" y="38" width="7" height="46" rx="1.2" fill="var(--logo-fg)"/>
        <rect x="36.5" y="30" width="7" height="54" rx="1.2" fill="var(--logo-fg)"/>
        <rect x="62" y="38" width="7" height="46" rx="1.2" fill="var(--logo-fg)"/>
        <rect x="7" y="84" width="66" height="3.5" rx="1.2" fill="var(--logo-fg)"/>
      </g>
    </svg>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({num,title,sub,ff,center=false}){
  const [ref,v]=useInView();
  return(
    <div ref={ref} style={{textAlign:center?"center":"start",marginBottom:"clamp(48px,6vw,72px)",maxWidth:880,marginLeft:center?"auto":0,marginRight:center?"auto":0}}>
      {num&&(
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate={v?"show":"hidden"}
          style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:20,display:"inline-flex",alignItems:"center",gap:12}}>
          <span style={{width:32,height:1,background:"var(--gold)"}}/>
          {num}
        </motion.div>
      )}
      <motion.h2 variants={fadeUp} custom={0.05} initial="hidden" animate={v?"show":"hidden"}
        style={{fontSize:"clamp(36px,5.5vw,68px)",fontFamily:"var(--serif)",fontWeight:300,lineHeight:1,letterSpacing:"-0.03em",color:"var(--text)",marginBottom:sub?20:0}}>
        {title}
      </motion.h2>
      {sub&&<motion.p variants={fadeUp} custom={0.15} initial="hidden" animate={v?"show":"hidden"}
        style={{fontSize:"clamp(15px,1.7vw,18px)",color:"var(--text2)",lineHeight:1.7,maxWidth:680,fontFamily:ff,marginTop:16}}>
        {sub}
      </motion.p>}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({lang,setLang,mode,setMode,t,ff,onBook}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>30);
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);

  const linkStyle={
    fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",
    color:"var(--text2)",textDecoration:"none",position:"relative",transition:"color 0.3s",
  };
  const btnBase={display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
    border:"1px solid var(--border)",background:"var(--card)",transition:"all 0.2s",borderRadius:8,flexShrink:0};

  return(
    <motion.nav initial={{y:-72}} animate={{y:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
      style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        height:scrolled?60:72,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 clamp(20px,3vw,48px)",fontFamily:ff,
        background:scrolled?"var(--nav)":"transparent",
        backdropFilter:scrolled?"blur(20px) saturate(180%)":"none",
        WebkitBackdropFilter:scrolled?"blur(20px) saturate(180%)":"none",
        borderBottom:scrolled?"1px solid var(--nav-b)":"1px solid transparent",
        transition:"all 0.3s",
      }}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <ArkanMark size={32}/>
        <div>
          <div style={{fontFamily:"var(--serif)",fontSize:18,fontWeight:500,color:"var(--text)",letterSpacing:"-0.01em",lineHeight:1}}>Arkan</div>
          <div style={{fontFamily:"var(--mono)",fontSize:8,letterSpacing:"0.3em",color:"var(--gold)",marginTop:2}}>AI · SOLUTIONS</div>
        </div>
      </div>

      {/* Nav links (desktop) */}
      <div className="nav-links" style={{display:"flex",gap:36,alignItems:"center"}}>
        <a href="#pillars" style={linkStyle}>{t.navPillars}</a>
        <a href="#process" style={linkStyle}>{t.navProcess}</a>
        <a href="#work" style={linkStyle}>{t.navWork}</a>
        <a href="#contact" style={linkStyle}>{t.navContact}</a>
      </div>

      {/* Actions */}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <motion.button whileTap={{scale:0.9}} onClick={()=>setMode(mode==="light"?"dark":"light")}
          style={{...btnBase,width:36,height:36,color:"var(--text2)"}} aria-label="Toggle theme">
          <Ico n={mode==="light"?"moon":"sun"} size={14}/>
        </motion.button>
        <motion.button whileTap={{scale:0.9}} onClick={()=>setLang(lang==="ar"?"en":"ar")}
          style={{...btnBase,height:36,padding:"0 13px",color:"var(--text2)",fontSize:11,fontWeight:600,fontFamily:"var(--mono)",letterSpacing:"0.1em"}}>
          {lang==="ar"?"EN":"ع"}
        </motion.button>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
          onClick={onBook}
          style={{height:36,padding:"0 18px",borderRadius:8,background:"var(--gold)",color:"var(--gold-fg)",border:"none",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"var(--mono)",letterSpacing:"0.18em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:7,whiteSpace:"nowrap"}}>
          {t.navCta}
        </motion.button>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({t,ff,onBook}){
  return(
    <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden",paddingTop:140}}>
      {/* Architectural grid background */}
      <div className="bg-grid"/>

      {/* Gold ambient glow */}
      <motion.div animate={{scale:[1,1.1,1],opacity:[0.6,1,0.6]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}
        style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:800,height:800,background:"radial-gradient(circle, var(--gold-glow) 0%, transparent 50%)",filter:"blur(80px)",pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:1320,margin:"0 auto",padding:"40px clamp(20px,4vw,48px) 80px"}}>

        {/* Eyebrow */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1}}
          style={{display:"inline-flex",alignItems:"center",gap:12,padding:"8px 18px",borderRadius:100,border:"1px solid var(--gold-line)",background:"var(--gold-bg-soft)",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:36}}>
          <motion.span animate={{opacity:[1,0.3,1]}} transition={{duration:2,repeat:Infinity}}
            style={{width:6,height:6,borderRadius:"50%",background:"var(--gold)",boxShadow:"0 0 12px var(--gold)",display:"inline-block"}}/>
          {t.eyebrow}
        </motion.div>

        {/* Main headline */}
        <motion.h1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.25,ease:[0.16,1,0.3,1]}}
          style={{fontFamily:"var(--serif)",fontSize:"clamp(56px,10vw,156px)",fontWeight:300,lineHeight:0.92,letterSpacing:"-0.045em",color:"var(--text)",marginBottom:40}}>
          {t.h1a}<br/>
          <em style={{fontStyle:"italic",color:"var(--gold)",fontWeight:300,position:"relative"}}>
            {t.h1b}
          </em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.45}}
          style={{fontSize:"clamp(17px,2vw,22px)",fontWeight:300,color:"var(--text2)",maxWidth:680,lineHeight:1.55,marginBottom:48,fontFamily:ff}}>
          {t.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.6}}
          style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:80}}>
          <motion.button whileHover={{y:-2,boxShadow:"0 12px 32px var(--gold-glow-strong)"}} whileTap={{scale:0.98}}
            onClick={onBook}
            style={{display:"inline-flex",alignItems:"center",gap:12,padding:"18px 32px",background:"var(--gold)",color:"var(--gold-fg)",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase"}}>
            {t.cta}
            <Ico n="arrowR" size={14}/>
          </motion.button>
          <motion.a whileHover={{y:-2}} whileTap={{scale:0.98}}
            href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:12,padding:"18px 32px",border:"1px solid var(--border-strong)",color:"var(--text)",textDecoration:"none",fontFamily:"var(--mono)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase",transition:"all 0.3s"}}>
            <Ico n="whatsapp" size={14}/>
            {t.ctaSec}
          </motion.a>
        </motion.div>

        {/* Metrics */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7,delay:0.85}}
          style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:32,paddingTop:48,borderTop:"1px solid var(--border)",maxWidth:900}}>
          {[
            {n:"40k+",l:t.metric1},{n:"19",l:t.metric2},
            {n:"8",l:t.metric3},{n:"AR · EN",l:t.metric4},
          ].map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.9+i*0.08,duration:0.6}}>
              <div style={{fontFamily:"var(--serif)",fontSize:"clamp(36px,4vw,48px)",fontWeight:300,lineHeight:1,letterSpacing:"-0.02em",color:"var(--text)",marginBottom:8}}>
                <em style={{fontStyle:"italic",color:"var(--gold)"}}>{m.n}</em>
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--text3)"}}>{m.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pillar Diagram Section (signature element) ───────────────────────────────
function PillarDiagram({lang,t,ff,onBook}){
  const [ref,v]=useInView();
  return(
    <section style={{padding:"clamp(80px,10vw,140px) clamp(20px,4vw,48px)",position:"relative"}}>
      <div ref={ref} style={{maxWidth:1320,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:96,alignItems:"center"}} className="signature-grid">
        {/* SVG */}
        <motion.div variants={fadeLeft} initial="hidden" animate={v?"show":"hidden"}>
          <svg viewBox="0 0 480 380" width="100%" style={{maxWidth:480,height:"auto"}}>
            <defs>
              <radialGradient id="apexG" cx="50%" cy="50%">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="pillarG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--text)" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="var(--text)" stopOpacity="0.7"/>
              </linearGradient>
            </defs>
            <circle cx="240" cy="60" r="80" fill="url(#apexG)"/>
            <g opacity="0.08" stroke="var(--gold)" strokeWidth="0.5">
              {[100,180,260,340].map(y=><line key={y} x1="0" y1={y} x2="480" y2={y}/>)}
            </g>
            <motion.circle cx="240" cy="60" r="14" fill="var(--gold)"
              animate={{r:[14,17,14]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}/>
            <circle cx="240" cy="60" r="22" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.4"/>
            <circle cx="240" cy="60" r="32" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.2"/>
            <path d="M 80 130 Q 160 60, 240 80 Q 320 60, 400 130" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85"/>
            {/* Pillars */}
            {[
              {x:68,y:130,h:200,w:24,n:"I"},
              {x:226,y:100,h:230,w:28,n:"II · III"},
              {x:388,y:130,h:200,w:24,n:"IV"},
            ].map((p,i)=>(
              <motion.g key={i} initial={{opacity:0,y:20}} animate={v?{opacity:1,y:0}:{}} transition={{delay:0.2+i*0.15,duration:0.7,ease:[0.16,1,0.3,1]}}>
                <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="2" fill="url(#pillarG)"/>
                <rect x={p.x-4} y={p.y-4} width={p.w+8} height="8" rx="1" fill="var(--text)"/>
                <text x={p.x+p.w/2} y="370" fontFamily="var(--mono)" fontSize="9" letterSpacing="2" fill={i===1?"var(--gold)":"var(--text3)"} textAnchor="middle">{p.n}</text>
              </motion.g>
            ))}
            <rect x="50" y="332" width="380" height="6" rx="1" fill="var(--text)"/>
            <rect x="40" y="340" width="400" height="3" rx="1" fill="var(--text)" opacity="0.5"/>
            <text x="240" y="35" fontFamily="var(--arabic)" fontSize="14" fontWeight="500" fill="var(--gold)" textAnchor="middle" letterSpacing="2">أركان</text>
          </svg>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeRight} initial="hidden" animate={v?"show":"hidden"}>
          <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:24,display:"inline-flex",alignItems:"center",gap:12}}>
            <span style={{width:32,height:1,background:"var(--gold)"}}/>
            {lang==="ar"?"الاسم · المعنى":"01 · The Name"}
          </div>
          <h2 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:"clamp(36px,5vw,64px)",lineHeight:1,letterSpacing:"-0.03em",marginBottom:32,color:"var(--text)"}}>
            {lang==="ar"?<>اسم له <em style={{fontStyle:"italic",color:"var(--gold)"}}>وزن</em>.</>:<>A name that <em style={{fontStyle:"italic",color:"var(--gold)"}}>holds weight</em>.</>}
          </h2>
          <p style={{fontSize:18,color:"var(--text2)",lineHeight:1.7,marginBottom:24,fontFamily:ff}}>
            {lang==="ar"?
              <>في العربية، <strong style={{color:"var(--text)"}}>أركان</strong> تعني الأعمدة التي تقوم عليها البنية — الدعامات الحاملة التي بدونها ينهار النظام كله.</>:
              <>In Arabic, <strong style={{color:"var(--text)"}}>أركان (Arkan)</strong> means the pillars upon which a structure stands — the load-bearing supports without which the system collapses.</>}
          </p>
          <p style={{fontSize:18,color:"var(--text2)",lineHeight:1.7,marginBottom:24,fontFamily:ff}}>
            {lang==="ar"?
              "اخترنا الاسم بدقة. سوق خدمات الـ AI مليء بالموضة. موقفنا هيكلي — نبني الأساسات تحت الذكاء الاصطناعي، لا الـ slide deck فوقه.":
              "We chose it deliberately. The AI services market is full of fashion. Our position is structural — we build the foundations beneath AI, not the slide deck on top of it."}
          </p>
          <div style={{marginTop:32,paddingTop:32,borderTop:"1px solid var(--border)",fontFamily:"var(--arabic)",fontSize:24,fontWeight:300,direction:"rtl",textAlign:"right",color:"var(--text)"}}>
            نبني <em style={{color:"var(--gold)",fontStyle:"normal",fontWeight:500}}>الأركان</em> الحقيقية للذكاء الاصطناعي.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pillar Card ──────────────────────────────────────────────────────────────
function PillarCard({p,idx,ff,onView}){
  const [ref,v]=useInView(0.05);
  return(
    <motion.div ref={ref} variants={fadeUp} custom={idx*0.08} initial="hidden" animate={v?"show":"hidden"}
      whileHover={{y:-4}}
      style={{background:"var(--card)",border:"1px solid var(--border)",padding:"clamp(32px,4vw,48px)",position:"relative",cursor:"pointer",overflow:"hidden",minHeight:380,display:"flex",flexDirection:"column",transition:"background 0.4s,border-color 0.4s"}}
      className="pillar-card"
      onClick={()=>onView(p.flow,p.title)}>
      <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:24}}>
        {p.tag}
      </div>
      <div style={{fontFamily:"var(--serif)",fontSize:"clamp(80px,8vw,120px)",fontWeight:300,fontStyle:"italic",lineHeight:0.9,color:"var(--gold)",marginBottom:24,opacity:0.25}}>
        {p.num}
      </div>
      <h3 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:"clamp(28px,3vw,36px)",letterSpacing:"-0.02em",lineHeight:1.1,marginBottom:8,color:"var(--text)"}}>
        {p.title}
      </h3>
      <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:20}}>
        {p.sub}
      </div>
      <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,marginBottom:24,flex:1,fontFamily:ff}}>{p.desc}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,paddingTop:20,borderTop:"1px solid var(--border)"}}>
        {p.tech.map((t,i)=>(
          <span key={i} style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--text2)",padding:"4px 10px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:2}}>{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Workflow Modal (kept from Engosoft pattern) ──────────────────────────────
function WorkflowModal({flow,title,t,ff,isRTL,onClose}){
  const nodes=FLOWS[flow]||[];
  const [active,setActive]=useState(-1);

  useEffect(()=>{
    document.body.style.overflow="hidden";
    let timer;
    const delay=setTimeout(()=>{
      let i=0;
      timer=setInterval(()=>{setActive(i);i++;if(i>nodes.length)clearInterval(timer);},280);
    },300);
    return()=>{clearTimeout(delay);clearInterval(timer);document.body.style.overflow="";};
  },[nodes.length]);

  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
      onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:300,background:"var(--modal-o)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(12px)"}}>
      <motion.div initial={{opacity:0,scale:0.92,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.92,y:20}}
        transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
        onClick={e=>e.stopPropagation()}
        style={{background:"var(--card)",border:"1px solid var(--border)",maxWidth:640,width:"100%",maxHeight:"90vh",overflow:"auto",boxShadow:"var(--shadow-x)"}}>

        <div style={{padding:"32px 36px 36px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
            <div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:10}}>
                {t.workflow}
              </div>
              <h3 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:24,lineHeight:1.2,color:"var(--text)",letterSpacing:"-0.02em"}}>
                {title}
              </h3>
            </div>
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={onClose}
              style={{width:36,height:36,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)",flexShrink:0}}>
              <Ico n="close" size={14}/>
            </motion.button>
          </div>

          <div style={{background:"var(--bg2)",border:"1px solid var(--border)",padding:"20px 16px",display:"flex",flexWrap:"wrap",alignItems:"center",gap:8}}>
            {nodes.map((nd,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                <motion.div
                  animate={i<=active?{opacity:1,scale:1,background:"var(--gold-bg-soft)",borderColor:"var(--gold)"}:{opacity:0.3,scale:0.92,background:"transparent",borderColor:"var(--border)"}}
                  transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:"1.5px solid var(--border)",fontSize:11,fontWeight:500,color:"var(--text)",fontFamily:"var(--mono)",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
                  <span style={{fontSize:14}}>{nd.icon}</span>{nd.n}
                </motion.div>
                {i<nodes.length-1&&(
                  <motion.span animate={{color:i<active?"var(--gold)":"var(--border)"}} transition={{duration:0.3}} style={{display:"flex",flexShrink:0}}>
                    <Ico n={isRTL?"chevL":"chevR"} size={13}/>
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────────
function ProcessSection({t,ff,lang}){
  return(
    <section id="process" style={{padding:"clamp(80px,10vw,140px) clamp(20px,4vw,48px)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <SectionHeader num={lang==="ar"?"المنهجية":"03 — How We Engage"} title={t.processTitle} sub={t.processSub} ff={ff}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:32,position:"relative"}}>
          {PROCESS[lang].map((p,i)=>{
            const [ref,v]=useInView(0.1);
            return(
              <motion.div key={i} ref={ref} variants={fadeUp} custom={i*0.1} initial="hidden" animate={v?"show":"hidden"}
                style={{position:"relative"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.22em",color:"var(--gold)",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:"var(--gold)",boxShadow:"0 0 0 4px var(--gold-glow)"}}/>
                  {lang==="ar"?`خطوة ${p.n}`:`STAGE ${p.n}`}
                </div>
                <h4 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:24,marginBottom:12,color:"var(--text)",letterSpacing:"-0.01em"}}>{p.t}</h4>
                <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.65,fontFamily:ff}}>{p.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Cases Section ────────────────────────────────────────────────────────────
function CasesSection({t,ff,lang,onBook}){
  return(
    <section id="work" style={{padding:"clamp(80px,10vw,140px) clamp(20px,4vw,48px)",borderTop:"1px solid var(--border)"}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <SectionHeader num={lang==="ar"?"04 — أعمالنا":"04 — Production Work"} title={t.casesTitle} sub={t.casesSub} ff={ff}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:32}}>
          {CASES[lang].map((c,i)=>{
            const [ref,v]=useInView(0.1);
            const featured=i===0;
            return(
              <motion.div key={i} ref={ref} variants={fadeUp} custom={i*0.1} initial="hidden" animate={v?"show":"hidden"}
                whileHover={{y:-4,borderColor:"var(--gold-line)"}}
                style={{gridColumn:featured?"1 / -1":"auto",background:featured?"linear-gradient(135deg, var(--bg2), var(--card))":"var(--card)",border:"1px solid var(--border)",padding:"clamp(32px,4vw,48px)",transition:"all 0.4s"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:20}}>{c.tag}</div>
                <h3 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:featured?32:24,letterSpacing:"-0.02em",marginBottom:16,lineHeight:1.15,color:"var(--text)"}}>{c.title}</h3>
                <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,marginBottom:32,fontFamily:ff}}>{c.desc}</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:20,paddingTop:24,borderTop:"1px solid var(--border)"}}>
                  {c.stats.map((s,j)=>(
                    <div key={j}>
                      <div style={{fontFamily:"var(--serif)",fontSize:32,fontWeight:300,color:"var(--gold)",lineHeight:1,letterSpacing:"-0.02em"}}>{s.v}</div>
                      <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--text3)",marginTop:8}}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stack Marquee ────────────────────────────────────────────────────────────
function StackMarquee({t,lang}){
  const tripled=[...STACK,...STACK,...STACK];
  return(
    <section style={{padding:"clamp(60px,7vw,100px) 0",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",background:"var(--bg2)",overflow:"hidden",position:"relative"}}>
      <div style={{textAlign:"center",marginBottom:40,padding:"0 20px"}}>
        <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>
          {lang==="ar"?"05 · مكدس التقنيات":"05 · BUILT WITH"}
        </div>
        <h3 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:"clamp(24px,3vw,36px)",letterSpacing:"-0.02em",color:"var(--text)"}}>{t.stackTitle}</h3>
      </div>
      <div className="marquee-track" style={{display:"flex",gap:80,whiteSpace:"nowrap",padding:"24px 0"}}>
        {tripled.map((s,i)=>(
          <span key={i} style={{fontFamily:"var(--serif)",fontSize:32,fontStyle:"italic",fontWeight:300,color:"var(--text)",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:80,flexShrink:0}}>
            {s}<span style={{color:"var(--gold)",fontSize:14,fontStyle:"normal"}}>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqItem({f,isRTL,ff}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:"1px solid var(--border)"}}>
      <button onClick={()=>setOpen(!open)}
        style={{width:"100%",padding:"24px 0",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",fontFamily:ff,textAlign:isRTL?"right":"left",gap:16,color:"var(--text)"}}>
        <span style={{fontFamily:"var(--serif)",fontSize:"clamp(16px,1.8vw,20px)",fontWeight:400,lineHeight:1.4}}>{f.q}</span>
        <motion.div animate={{rotate:open?180:0}} transition={{duration:0.3}} style={{color:"var(--gold)",flexShrink:0}}>
          <Ico n="chevD" size={18}/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.32,ease:"easeInOut"}} style={{overflow:"hidden"}}>
            <div style={{paddingBottom:24,fontSize:16,color:"var(--text2)",lineHeight:1.75,fontFamily:ff,maxWidth:680}}>{f.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sales Funnel Modal (NEW — multi-step qualifier) ──────────────────────────
function FunnelModal({lang,isRTL,ff,onClose}){
  const f=FUNNEL[lang];
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [data,setData]=useState({
    company:"",industry:"",size:"",
    aiState:"",systems:[],pain:"",
    timeline:"",budget:"",
    name:"",email:"",phone:"",notes:"",
  });

  const TOTAL_STEPS=6;
  const update=(k,val)=>setData(d=>({...d,[k]:val}));
  const toggleSystem=(s)=>setData(d=>({...d,systems:d.systems.includes(s)?d.systems.filter(x=>x!==s):[...d.systems,s]}));

  useEffect(()=>{
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow="";};
  },[]);

  const submit=()=>{
    // In production: POST to your endpoint / n8n webhook here.
    // Example: fetch("https://n8n.engosoft.com/webhook/arkan-discovery", { method:"POST", body: JSON.stringify(data) });
    console.log("ARKAN_DISCOVERY_SUBMISSION",data);
    setDone(true);
  };

  const goCalendar=()=>window.open(CAL,"_blank");

  // Field helpers
  const TextField=({k,label,type="text",placeholder=""})=>(
    <label style={{display:"block",marginBottom:20}}>
      <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>{label}</div>
      <input type={type} value={data[k]} onChange={e=>update(k,e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"14px 16px",background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text)",fontFamily:ff,fontSize:15,outline:"none",transition:"border-color 0.3s"}}
        onFocus={e=>e.target.style.borderColor="var(--gold)"}
        onBlur={e=>e.target.style.borderColor="var(--border)"}/>
    </label>
  );

  const ChoiceGrid=({k,opts,cols=2})=>(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${cols}, 1fr)`,gap:8,marginBottom:20}}>
      {opts.map((o,i)=>{
        const sel=data[k]===o||data[k]?.t===o.t;
        const label=typeof o==="string"?o:o.t;
        const sub=typeof o==="object"?o.p:null;
        return(
          <button key={i} onClick={()=>update(k,typeof o==="string"?o:o)}
            style={{padding:"14px 16px",textAlign:isRTL?"right":"left",background:sel?"var(--gold-bg-soft)":"var(--bg2)",border:`1px solid ${sel?"var(--gold)":"var(--border)"}`,color:sel?"var(--gold)":"var(--text)",fontFamily:ff,fontSize:14,cursor:"pointer",transition:"all 0.25s",fontWeight:sel?500:400}}>
            <div>{label}</div>
            {sub&&<div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.15em",color:"var(--gold)",marginTop:6,opacity:sel?1:0.6}}>{sub}</div>}
          </button>
        );
      })}
    </div>
  );

  const MultiGrid=({opts})=>(
    <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:8,marginBottom:20}}>
      {opts.map((o,i)=>{
        const sel=data.systems.includes(o);
        return(
          <button key={i} onClick={()=>toggleSystem(o)}
            style={{padding:"12px 14px",textAlign:isRTL?"right":"left",background:sel?"var(--gold-bg-soft)":"var(--bg2)",border:`1px solid ${sel?"var(--gold)":"var(--border)"}`,color:sel?"var(--gold)":"var(--text)",fontFamily:ff,fontSize:13,cursor:"pointer",transition:"all 0.25s",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:14,height:14,border:`1.5px solid ${sel?"var(--gold)":"var(--border)"}`,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {sel&&<Ico n="check" size={9}/>}
            </span>
            {o}
          </button>
        );
      })}
    </div>
  );

  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
      onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:300,background:"var(--modal-o)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(12px)"}}>
      <motion.div initial={{opacity:0,scale:0.94,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94,y:24}}
        transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
        onClick={e=>e.stopPropagation()}
        style={{background:"var(--card)",border:"1px solid var(--border)",maxWidth:600,width:"100%",maxHeight:"92vh",overflow:"auto",boxShadow:"var(--shadow-x)",position:"relative"}}>

        {/* Close button */}
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={onClose}
          style={{position:"absolute",top:20,[isRTL?"left":"right"]:20,width:34,height:34,border:"1px solid var(--border)",background:"var(--bg2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)",zIndex:5}}>
          <Ico n="close" size={13}/>
        </motion.button>

        {done?(
          <div style={{padding:"56px 36px 48px",textAlign:"center"}}>
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:240,delay:0.1}}
              style={{width:64,height:64,borderRadius:"50%",background:"var(--gold)",color:"var(--gold-fg)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 32px"}}>
              <Ico n="check" size={28}/>
            </motion.div>
            <h3 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:32,letterSpacing:"-0.02em",marginBottom:16,color:"var(--text)"}}>{f.successT}</h3>
            <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,fontFamily:ff,marginBottom:32}}>{f.successS}</p>
            <button onClick={onClose}
              style={{padding:"14px 32px",background:"var(--gold)",color:"var(--gold-fg)",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase"}}>
              {f.close}
            </button>
          </div>
        ):(
          <>
            {/* Header */}
            <div style={{padding:"36px 36px 0"}}>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>
                {f.step} {step} {f.of} {TOTAL_STEPS}
              </div>
              <h2 style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:"clamp(26px,3vw,32px)",letterSpacing:"-0.02em",lineHeight:1.1,color:"var(--text)",marginBottom:8}}>
                {f[`s${step}`].t}
              </h2>
              <p style={{color:"var(--text3)",fontSize:13,fontFamily:ff,marginBottom:28}}>{f[`s${step}`].sub}</p>

              {/* Progress bar */}
              <div style={{height:2,background:"var(--border)",marginBottom:32,overflow:"hidden"}}>
                <motion.div animate={{width:`${(step/TOTAL_STEPS)*100}%`}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
                  style={{height:"100%",background:"var(--gold)"}}/>
              </div>
            </div>

            {/* Step content */}
            <div style={{padding:"0 36px"}}>
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                  transition={{duration:0.3,ease:[0.16,1,0.3,1]}}>

                  {step===1&&(<>
                    <TextField k="company" label={f.f_company} placeholder="Acme Co."/>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>{f.f_industry}</div>
                    <ChoiceGrid k="industry" opts={f.industries} cols={3}/>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>{f.f_size}</div>
                    <ChoiceGrid k="size" opts={f.sizes} cols={2}/>
                  </>)}

                  {step===2&&(<>
                    <ChoiceGrid k="aiState" opts={f.aiStates} cols={1}/>
                  </>)}

                  {step===3&&(<>
                    <MultiGrid opts={f.systems}/>
                  </>)}

                  {step===4&&(<>
                    <ChoiceGrid k="pain" opts={f.pains} cols={1}/>
                  </>)}

                  {step===5&&(<>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>{f.f_timeline}</div>
                    <ChoiceGrid k="timeline" opts={f.timelines} cols={2}/>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>{f.f_budget}</div>
                    <ChoiceGrid k="budget" opts={f.budgets} cols={1}/>
                  </>)}

                  {step===6&&(<>
                    <TextField k="name" label={f.f_name} placeholder="Eyad Sofian"/>
                    <TextField k="email" type="email" label={f.f_email} placeholder="you@company.com"/>
                    <TextField k="phone" type="tel" label={f.f_phone} placeholder="+20 100 000 0000"/>
                    <label style={{display:"block",marginBottom:20}}>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>{f.f_notes}</div>
                      <textarea value={data.notes} onChange={e=>update("notes",e.target.value)} rows={3}
                        style={{width:"100%",padding:"14px 16px",background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text)",fontFamily:ff,fontSize:15,outline:"none",resize:"vertical",minHeight:80}}/>
                    </label>
                  </>)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / nav */}
            <div style={{padding:"20px 36px 28px",borderTop:"1px solid var(--border)",marginTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <button onClick={goCalendar}
                style={{background:"none",border:"none",color:"var(--text3)",fontFamily:ff,fontSize:12,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
                {f.skip}
              </button>
              <div style={{display:"flex",gap:10}}>
                {step>1&&(
                  <button onClick={()=>setStep(s=>s-1)}
                    style={{padding:"12px 22px",background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text)",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase"}}>
                    {f.back}
                  </button>
                )}
                {step<TOTAL_STEPS?(
                  <motion.button whileHover={{x:isRTL?-2:2}} whileTap={{scale:0.98}} onClick={()=>setStep(s=>s+1)}
                    style={{padding:"12px 22px",background:"var(--gold)",color:"var(--gold-fg)",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10}}>
                    {f.next}<Ico n={isRTL?"arrowL":"arrowR"} size={12}/>
                  </motion.button>
                ):(
                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={submit}
                    style={{padding:"12px 24px",background:"var(--gold)",color:"var(--gold-fg)",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10}}>
                    {f.submit}<Ico n="check" size={12}/>
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

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CtaBanner({t,ff,onBook}){
  const [ref,v]=useInView(0.1);
  return(
    <section id="contact" ref={ref} style={{padding:"clamp(100px,14vw,180px) clamp(20px,4vw,48px)",textAlign:"center",position:"relative",overflow:"hidden",borderTop:"1px solid var(--border)"}}>
      <motion.div animate={{scale:[1,1.15,1],opacity:[0.4,0.7,0.4]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}
        style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:600,height:600,background:"radial-gradient(circle, var(--gold-glow) 0%, transparent 60%)",filter:"blur(70px)",pointerEvents:"none"}}/>
      <div style={{maxWidth:880,margin:"0 auto",position:"relative"}}>
        <motion.h2 variants={fadeUp} custom={0} initial="hidden" animate={v?"show":"hidden"}
          style={{fontFamily:"var(--serif)",fontWeight:300,fontSize:"clamp(48px,8vw,112px)",lineHeight:0.95,letterSpacing:"-0.04em",color:"var(--text)",marginBottom:32}}>
          {t.ctaTitle.split(" ").map((w,i)=>i===t.ctaTitle.split(" ").length-1?<em key={i} style={{fontStyle:"italic",color:"var(--gold)"}}>{w}</em>:<span key={i}>{w} </span>)}
        </motion.h2>
        <motion.p variants={fadeUp} custom={0.15} initial="hidden" animate={v?"show":"hidden"}
          style={{fontSize:"clamp(16px,2vw,20px)",color:"var(--text2)",maxWidth:560,margin:"0 auto 48px",lineHeight:1.6,fontFamily:ff}}>
          {t.ctaSub}
        </motion.p>
        <motion.div variants={fadeUp} custom={0.3} initial="hidden" animate={v?"show":"hidden"}
          style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <motion.button whileHover={{y:-2,boxShadow:"0 12px 32px var(--gold-glow-strong)"}} whileTap={{scale:0.98}}
            onClick={onBook}
            style={{display:"inline-flex",alignItems:"center",gap:12,padding:"18px 32px",background:"var(--gold)",color:"var(--gold-fg)",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase"}}>
            {t.ctaBtn}<Ico n="arrowR" size={14}/>
          </motion.button>
          <motion.a whileHover={{y:-2}} whileTap={{scale:0.98}}
            href={`mailto:${EMAIL}`}
            style={{display:"inline-flex",alignItems:"center",gap:12,padding:"18px 32px",border:"1px solid var(--border-strong)",color:"var(--text)",textDecoration:"none",fontFamily:"var(--mono)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase"}}>
            <Ico n="mail" size={14}/>{EMAIL}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({t,ff,lang}){
  const year=new Date().getFullYear();
  return(
    <footer style={{padding:"80px clamp(20px,4vw,48px) 40px",borderTop:"1px solid var(--border)",background:"var(--bg2)"}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:64}} className="footer-grid">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
              <ArkanMark size={48}/>
              <div>
                <div style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:500,color:"var(--text)",letterSpacing:"-0.01em",lineHeight:1}}>Arkan</div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.3em",color:"var(--gold)",marginTop:3}}>AI · SOLUTIONS</div>
              </div>
            </div>
            <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.7,fontFamily:ff,maxWidth:340,marginBottom:24}}>{t.footerTag}</p>
            <div style={{display:"flex",gap:8}}>
              {[{href:`https://wa.me/${WA}`,icon:"whatsapp"},{href:`mailto:${EMAIL}`,icon:"mail"}].map((s,i)=>(
                <a key={i} href={s.href} target={s.icon==="whatsapp"?"_blank":undefined} rel="noopener noreferrer"
                  style={{width:38,height:38,border:"1px solid var(--border)",background:"var(--card)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)",textDecoration:"none",transition:"all 0.3s"}}>
                  <Ico n={s.icon} size={15}/>
                </a>
              ))}
            </div>
          </div>

          {[
            {h:lang==="ar"?"الأركان":"Pillars",links:[lang==="ar"?["الوكلاء","#pillars"]:["AI Agents","#pillars"],lang==="ar"?["الأتمتة","#pillars"]:["Automation","#pillars"],lang==="ar"?["الحلول المخصصة","#pillars"]:["Custom AI","#pillars"],lang==="ar"?["التكاملات","#pillars"]:["Integrations","#pillars"]]},
            {h:lang==="ar"?"الشركة":"Company",links:[[t.navProcess,"#process"],[t.navWork,"#work"],[t.navContact,"#contact"]]},
            {h:t.contact,links:[[EMAIL,`mailto:${EMAIL}`],[lang==="ar"?"WhatsApp":"WhatsApp",`https://wa.me/${WA}`],[t["footer-c"],"#"]]},
          ].map((col,i)=>(
            <div key={i}>
              <h5 style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:"var(--gold)",marginBottom:20}}>{col.h}</h5>
              <ul style={{listStyle:"none",padding:0,margin:0}}>
                {col.links.map(([txt,href],j)=>(
                  <li key={j} style={{marginBottom:12}}>
                    <a href={href} style={{color:"var(--text2)",textDecoration:"none",fontSize:14,fontFamily:ff,transition:"color 0.3s"}}>{txt}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{paddingTop:32,borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--text3)",flexWrap:"wrap",gap:12}}>
          <span>© {year} Arkan AI Solutions · {t.rights}</span>
          <span>{lang==="ar"?"صنع في القاهرة · لخدمة MENA":"Built in Cairo · Engineered for MENA"}</span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("ar");
  const [mode,setMode]=useState("dark");
  const [funnelOpen,setFunnelOpen]=useState(false);
  const [activeFlow,setActiveFlow]=useState(null);

  const isRTL=lang==="ar";
  const ff=isRTL?"'IBM Plex Sans Arabic', 'Tajawal', sans-serif":"'Geist', -apple-system, sans-serif";
  const t=T[lang];

  useEffect(()=>{
    document.documentElement.setAttribute("data-theme",mode);
    document.documentElement.style.colorScheme=mode;
  },[mode]);

  useEffect(()=>{
    document.documentElement.setAttribute("dir",isRTL?"rtl":"ltr");
    document.documentElement.setAttribute("lang",lang);
    document.body.style.fontFamily=ff;
  },[isRTL,lang,ff]);

  const openFunnel=()=>setFunnelOpen(true);

  return(
    <div style={{fontFamily:ff,color:"var(--text)",background:"var(--bg)",minHeight:"100vh",overflowX:"hidden",transition:"background 0.4s, color 0.4s"}}>

      <Navbar lang={lang} setLang={setLang} mode={mode} setMode={setMode} t={t} ff={ff} onBook={openFunnel}/>

      <Hero t={t} ff={ff} onBook={openFunnel}/>

      <PillarDiagram lang={lang} t={t} ff={ff} onBook={openFunnel}/>

      {/* Pillars grid */}
      <section id="pillars" style={{padding:"clamp(80px,10vw,140px) clamp(20px,4vw,48px)",borderTop:"1px solid var(--border)",background:"var(--bg2)"}}>
        <div style={{maxWidth:1320,margin:"0 auto"}}>
          <SectionHeader num={lang==="ar"?"02 — الأركان الأربعة":"02 — The Four Pillars"} title={t.pillarsTitle} sub={t.pillarsSub} ff={ff}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:24}}>
            {PILLARS[lang].map((p,i)=>(
              <PillarCard key={p.id} p={p} idx={i} ff={ff} onView={(flow,title)=>setActiveFlow({flow,title})}/>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection t={t} ff={ff} lang={lang}/>

      <CasesSection t={t} ff={ff} lang={lang} onBook={openFunnel}/>

      <StackMarquee t={t} lang={lang}/>

      {/* FAQ */}
      <section style={{padding:"clamp(80px,10vw,140px) clamp(20px,4vw,48px)",borderTop:"1px solid var(--border)"}}>
        <div style={{maxWidth:880,margin:"0 auto"}}>
          <SectionHeader num={lang==="ar"?"06 — الأسئلة المتكررة":"06 — Frequently Asked"} title={t.faqTitle} ff={ff}/>
          <div>
            {FAQS[lang].map((f,i)=><FaqItem key={i} f={f} isRTL={isRTL} ff={ff}/>)}
          </div>
        </div>
      </section>

      <CtaBanner t={t} ff={ff} onBook={openFunnel}/>

      <Footer t={t} ff={ff} lang={lang}/>

      {/* WhatsApp FAB */}
      <motion.a initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:1.2,type:"spring",stiffness:280}}
        whileHover={{scale:1.12}} whileTap={{scale:0.88}}
        href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
        style={{position:"fixed",bottom:24,[isRTL?"left":"right"]:24,zIndex:99,width:54,height:54,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,211,102,0.4)",textDecoration:"none"}}>
        <Ico n="whatsapp" size={26} col="#fff"/>
        <span style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid #25D366",animation:"pulseRing 2.5s ease-out infinite"}}/>
      </motion.a>

      {/* Modals */}
      <AnimatePresence>
        {funnelOpen&&<FunnelModal lang={lang} isRTL={isRTL} ff={ff} onClose={()=>setFunnelOpen(false)}/>}
        {activeFlow&&<WorkflowModal flow={activeFlow.flow} title={activeFlow.title} t={t} ff={ff} isRTL={isRTL} onClose={()=>setActiveFlow(null)}/>}
      </AnimatePresence>
    </div>
  );
}
