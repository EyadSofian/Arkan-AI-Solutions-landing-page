import { m } from "motion/react";
import { stagger, child, VIEW } from "../../lib/motion.js";

/**
 * Standard section header: clay tick + mono index label → display title → lede.
 * `title` accepts a string or JSX (for <em className="em"> clay accents).
 */
export function SectionHead({ label, title, lead, id }) {
  return (
    <m.div
      className="sect-head"
      variants={stagger(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
    >
      {label && (
        <m.div className="sect-head__label" variants={child}>
          <span className="t-label">{label}</span>
        </m.div>
      )}
      <m.h2 className="t-h2 sect-head__title" variants={child} id={id}>
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
