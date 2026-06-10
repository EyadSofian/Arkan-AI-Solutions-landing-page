import { useCallback, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import { LangProvider, useI18n } from "./lib/i18n.jsx";
import { ThemeProvider } from "./lib/theme.jsx";
import { track } from "./lib/analytics.js";

import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { WhatsAppFab } from "./components/WhatsAppFab.jsx";
import { LeadModal } from "./components/LeadModal.jsx";

import { Hero } from "./sections/Hero.jsx";
import { Problems } from "./sections/Problems.jsx";
import { Solutions } from "./sections/Solutions.jsx";
import { Anatomy } from "./sections/Anatomy.jsx";
import { Results } from "./sections/Results.jsx";
import { Process } from "./sections/Process.jsx";
import { WhyArkan } from "./sections/WhyArkan.jsx";
import { Faq } from "./sections/Faq.jsx";
import { FinalCta } from "./sections/FinalCta.jsx";

function Page() {
  const { t } = useI18n();
  const [lead, setLead] = useState(null); // null | { source }

  const openLead = useCallback((source = "unknown") => {
    track("lead_open", { source });
    setLead({ source });
  }, []);
  const closeLead = useCallback(() => setLead(null), []);

  return (
    <>
      <a href="#main" className="skip-link">{t.nav.skip}</a>
      <Navbar onBook={openLead} />
      <main id="main">
        <Hero onBook={openLead} />
        <Problems />
        <Solutions onBook={openLead} />
        <Anatomy onBook={openLead} />
        <Results onBook={openLead} />
        <Process />
        <WhyArkan />
        <Faq />
        <FinalCta onBook={openLead} />
      </main>
      <Footer />
      <WhatsAppFab />
      <AnimatePresence>
        {lead && <LeadModal source={lead.source} onClose={closeLead} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <ThemeProvider>
        <LangProvider>
          <Page />
        </LangProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}
