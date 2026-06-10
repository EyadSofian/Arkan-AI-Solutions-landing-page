// ── Arkan motion language ────────────────────────────────────────────────
// One ease, few durations, transform/opacity only, entrances run once.
// Components must use these helpers instead of ad-hoc values.

export const EASE = [0.16, 1, 0.3, 1];

/** Standard viewport config — reveal once, slightly before fully in view. */
export const VIEW = { once: true, margin: "-80px 0px" };

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: EASE },
  }),
};

export const fade = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

export const stagger = (gap = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
});

export const child = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** SVG line drawing (system diagram connectors). */
export const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, delay, ease: "easeInOut" },
      opacity: { duration: 0.25, delay },
    },
  }),
};
