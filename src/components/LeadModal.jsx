import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SITE, waLink } from "../config.js";
import { submitLead, leadToWhatsAppText } from "../lib/leads.js";
import { track } from "../lib/analytics.js";
import { Modal } from "./ui/Modal.jsx";
import { Icon } from "./ui/Icon.jsx";
import { EASE } from "../lib/motion.js";

/* ── Field primitives (module scope — stable identity, no focus loss) ──── */

function TextField({ id, label, hint, error, value, onChange, type = "text", placeholder, autoComplete, inputMode, ltr = false, multiline = false }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {hint && <span className="field__opt">{hint}</span>}
      </label>
      <Tag
        id={id}
        className="field__input"
        type={multiline ? undefined : type}
        rows={multiline ? 3 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        dir={ltr ? "ltr" : undefined}
        style={ltr ? { textAlign: "start" } : undefined}
      />
      {error && (
        <p className="field__err" id={`${id}-err`}>
          <Icon name="alert" size={13} />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ id, label, hint, value, onChange, options, placeholder }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        <span>{label}</span>
        {hint && <span className="field__opt">{hint}</span>}
      </label>
      <select id={id} className="field__input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function CheckGroup({ name, legend, hint, options, values, onToggle, error, columns = 2 }) {
  return (
    <fieldset className="field" style={{ border: "none" }}>
      <legend className="field__label" style={{ display: "flex", width: "100%" }}>
        <span>{legend}</span>
        {hint && <span className="field__opt">{hint}</span>}
      </legend>
      <div className={`opt-grid ${columns === 1 ? "opt-grid--1" : ""}`} role="group">
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <label key={o} className="opt" data-on={on}>
              <input type="checkbox" name={name} value={o} checked={on} onChange={() => onToggle(o)} />
              <span className="opt__box" aria-hidden="true">
                <Icon name="check" size={11} strokeWidth={3} />
              </span>
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p className="field__err">
          <Icon name="alert" size={13} />
          {error}
        </p>
      )}
    </fieldset>
  );
}

function RadioGroup({ name, legend, hint, options, value, onChange }) {
  return (
    <fieldset className="field" style={{ border: "none" }}>
      <legend className="field__label" style={{ display: "flex", width: "100%" }}>
        <span>{legend}</span>
        {hint && <span className="field__opt">{hint}</span>}
      </legend>
      <div className="opt-grid" role="radiogroup" aria-label={legend}>
        {options.map((o) => {
          const on = value === o;
          return (
            <label key={o} className="opt" data-on={on}>
              <input type="radio" name={name} value={o} checked={on} onChange={() => onChange(o)} />
              <span className="opt__box opt__box--round" aria-hidden="true">
                <Icon name="check" size={11} strokeWidth={3} />
              </span>
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ── Draft persistence (survives accidental close; cleared on success) ─── */

const DRAFT_KEY = "arkan-lead-draft";
const EMPTY = {
  name: "", company: "", email: "", phone: "", industry: "",
  goals: [], systems: [], bottleneck: "", contactPref: "", timing: "",
  website: "", // honeypot — humans never see it
};

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch { /* corrupt draft → start clean */ }
  return EMPTY;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{6,18}$/;

/* ── The modal ─────────────────────────────────────────────────────────── */

const TOTAL = 3;

export function LeadModal({ source, onClose }) {
  const { t } = useI18n();
  const f = t.form;
  const [step, setStep] = useState(0);
  const [data, setData] = useState(loadDraft);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | error | success
  const [errType, setErrType] = useState(null);
  const headRef = useRef(null);
  const bodyRef = useRef(null);

  // persist draft
  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch { /* no-op */ }
  }, [data]);

  // step entrance: focus heading, scroll body up, report analytics
  useEffect(() => {
    track("lead_step_view", { step: step + 1, source });
    headRef.current?.focus({ preventScroll: true });
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step, source]);

  const set = (key) => (val) => {
    setData((d) => ({ ...d, [key]: val }));
    setErrors((e) => (e[key] ? { ...e, [key]: null } : e));
  };
  const toggleIn = (key) => (val) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(val) ? d[key].filter((x) => x !== val) : [...d[key], val],
    }));

  const getErrors = (i) => {
    const e = {};
    if (i === 0) {
      if (!data.name.trim()) e.name = f.errors.name;
      if (!data.company.trim()) e.company = f.errors.company;
      if (!EMAIL_RE.test(data.email.trim())) e.email = f.errors.email;
      if (data.phone.trim() && !PHONE_RE.test(data.phone.trim())) e.phone = f.errors.phone;
    }
    if (i === 1 && data.goals.length === 0) e.goals = f.errors.goals;
    return e;
  };

  const next = () => {
    const e = getErrors(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const doSubmit = async () => {
    // Re-check every step; jump back to the earliest invalid one.
    for (const i of [0, 1, 2]) {
      const e = getErrors(i);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(i);
        return;
      }
    }
    setErrors({});
    // Honeypot tripped → drop silently (bots only; humans never see this field)
    if (data.website) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    setErrType(null);
    track("lead_submit_attempt", { source });
    try {
      const { website, ...payload } = data;
      await submitLead({ ...payload, leadSource: source });
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* no-op */ }
      setStatus("success");
      track("lead_submit_success", { source });
    } catch (err) {
      setStatus("error");
      setErrType(err.type || "network");
      track("lead_submit_error", { source, type: err.type || "network" });
    }
  };

  const waText = leadToWhatsAppText(data, f.waLabels);
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `${f.waLabels.intro} ${data.company || ""}`
  )}&body=${encodeURIComponent(waText)}`;

  const stepMeta = f.steps[step];

  return (
    <Modal onClose={onClose} labelledBy="lead-title" closeLabel={f.close}>
      {status === "success" ? (
        <div className="done">
          <m.div
            className="done__badge"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Icon name="check" size={28} />
          </m.div>
          <h2 className="t-h3" id="lead-title" style={{ fontSize: "1.7rem", marginBottom: 10 }}>
            {f.success.title}
          </h2>
          <p className="t-body">{f.success.sub}</p>
          <ol className="done__next" style={{ listStyle: "none" }}>
            {f.success.nextSteps.map((s, i) => (
              <li key={s}>
                <span className="n" aria-hidden="true">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              className="btn btn--primary"
              href={SITE.calendar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { id: "success-calendar" })}
            >
              <Icon name="calendar" size={15} />
              {f.success.bookNow}
            </a>
            <a
              className="btn btn--ghost"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { id: "success-whatsapp" })}
            >
              <Icon name="whatsapp" size={15} />
              {f.success.orWhatsApp}
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="modal__head">
            <p className="t-label" style={{ marginBottom: 10 }}>{f.stepLabel(step + 1, TOTAL)}</p>
            <h2 className="t-h3" id="lead-title" style={{ fontSize: "1.5rem" }}>{f.title}</h2>
            <p className="t-small" style={{ marginTop: 6 }}>{f.sub}</p>
            <div
              className="progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL}
              aria-valuenow={step + 1}
              aria-label={f.stepLabel(step + 1, TOTAL)}
            >
              <div className="progress__fill" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
            </div>
          </div>

          <div className="modal__body" ref={bodyRef}>
            <h3
              ref={headRef}
              tabIndex={-1}
              className="t-h3"
              style={{ fontSize: "1.1rem", marginBottom: 4, outline: "none" }}
            >
              {stepMeta.title}
            </h3>
            <p className="t-small" style={{ marginBottom: 20 }}>{stepMeta.why}</p>

            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {step === 0 && (
                  <>
                    <TextField id="lf-name" label={f.fields.name} value={data.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                    <TextField id="lf-company" label={f.fields.company} value={data.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
                    <TextField id="lf-email" label={f.fields.email} value={data.email} onChange={set("email")} error={errors.email} type="email" autoComplete="email" inputMode="email" ltr placeholder="name@company.com" />
                    <TextField id="lf-phone" label={f.fields.phone} hint={f.fields.phoneHint} value={data.phone} onChange={set("phone")} error={errors.phone} type="tel" autoComplete="tel" inputMode="tel" ltr placeholder="+20 100 000 0000" />
                    <SelectField id="lf-industry" label={f.fields.industry} hint={f.fields.industryHint} value={data.industry} onChange={set("industry")} options={f.industries} placeholder={f.fields.industryPlaceholder} />
                    {/* Honeypot — visually hidden from humans, irresistible to bots */}
                    <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }} aria-hidden="true">
                      <label htmlFor="lf-website">Website</label>
                      <input id="lf-website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website")(e.target.value)} />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <CheckGroup
                    name="goals"
                    legend={f.steps[1].title}
                    options={f.goals}
                    values={data.goals}
                    onToggle={toggleIn("goals")}
                    error={errors.goals}
                  />
                )}

                {step === 2 && (
                  <>
                    <CheckGroup
                      name="systems"
                      legend={f.fields.systems}
                      hint={f.fields.systemsHint}
                      options={f.systems}
                      values={data.systems}
                      onToggle={toggleIn("systems")}
                    />
                    <TextField
                      id="lf-bottleneck"
                      label={f.fields.bottleneck}
                      hint={f.fields.bottleneckHint}
                      value={data.bottleneck}
                      onChange={set("bottleneck")}
                      multiline
                      placeholder={f.fields.bottleneckPlaceholder}
                    />
                    <RadioGroup
                      name="contactPref"
                      legend={f.fields.contactPref}
                      options={f.contactPrefs}
                      value={data.contactPref}
                      onChange={set("contactPref")}
                    />
                    <RadioGroup
                      name="timing"
                      legend={f.fields.timing}
                      hint={f.fields.timingHint}
                      options={f.timings}
                      value={data.timing}
                      onChange={set("timing")}
                    />
                  </>
                )}
              </m.div>
            </AnimatePresence>

            {status === "error" && (
              <div className="banner banner--err" role="alert" style={{ marginBottom: 16 }}>
                <Icon name="alert" size={17} />
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>{f.submitError.title}</strong>
                  {errType === "config" ? f.submitError.bodyConfig : f.submitError.bodyNetwork}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                    {errType !== "config" && (
                      <button type="button" className="btn btn--soft btn--sm" onClick={doSubmit}>
                        {f.submitError.retry}
                      </button>
                    )}
                    <a
                      className="btn btn--soft btn--sm"
                      href={waLink(waText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("lead_whatsapp_fallback", { source })}
                    >
                      <Icon name="whatsapp" size={13} />
                      {f.submitError.viaWhatsApp}
                    </a>
                    <a className="btn btn--soft btn--sm" href={mailHref} onClick={() => track("lead_email_fallback", { source })}>
                      <Icon name="mail" size={13} />
                      {f.submitError.viaEmail}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal__foot">
            <div>
              {step > 0 && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={back} disabled={status === "submitting"}>
                  {f.back}
                </button>
              )}
            </div>
            {step < TOTAL - 1 ? (
              <button type="button" className="btn btn--primary" onClick={next}>
                {f.next}
                <Icon name="arrowFwd" size={14} flip className="ic--fwd" />
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={doSubmit} disabled={status === "submitting"} aria-busy={status === "submitting"}>
                {status === "submitting" ? f.submitting : f.submit}
                {status !== "submitting" && <Icon name="check" size={14} />}
              </button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
