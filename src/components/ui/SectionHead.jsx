import { m } from "motion/react";
import { stagger, child, VIEW } from "../../lib/motion.js";

/**
 * Standard section header: mono label → serif title → lede.
 * `title` accepts a string or JSX (for <em> accents).
 */
export function SectionHead({ label, title, lead, center = false, id }) {
  return (
    <m.div
      className={`sec-head ${center ? "sec-head--center" : ""}`}
      variants={stagger(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
    >
      {label && (
        <m.p className="t-label" variants={child}>
          {label}
        </m.p>
      )}
      <m.h2 className="t-h2" variants={child} id={id}>
        {title}
      </m.h2>
      {lead && (
        <m.p className="t-lead" variants={child}>
          {lead}
        </m.p>
      )}
    </m.div>
  );
}
