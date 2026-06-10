import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { draw, EASE } from "../lib/motion.js";

/**
 * Hero visual: scattered channels → Arkan layer → business systems.
 * SVG composed per-direction (positions are computed for RTL, not mirrored,
 * so text and flow read naturally in both languages).
 * On small screens a semantic HTML variant replaces the SVG (legible text).
 */

const W = 640;
const H = 470;
const NODE_W = 150;
const NODE_H = 48;
const CORE_W = 168;
const CORE_H = 124;
const ROW_Y = [86, 184, 282, 380]; // node centers
const CORE_Y = 233;

export function SystemDiagram() {
  const { t, isRTL } = useI18n();
  const d = t.diagram;

  // Column x positions (LTR baseline), flipped numerically for RTL.
  const fx = (x) => (isRTL ? W - x : x);
  const srcEdge = fx(NODE_W);          // sources column inner edge
  const outEdge = fx(W - NODE_W);      // outputs column inner edge
  const coreStart = fx(W / 2 - CORE_W / 2);
  const coreEnd = fx(W / 2 + CORE_W / 2);

  const entryY = [201, 222, 244, 265]; // staggered core entry points

  const pathIn = (i) => {
    const y = ROW_Y[i];
    const ey = entryY[i];
    const midX = (srcEdge + coreStart) / 2;
    return `M ${srcEdge} ${y} C ${midX} ${y}, ${midX} ${ey}, ${coreStart} ${ey}`;
  };
  const pathOut = (i) => {
    const y = ROW_Y[i];
    const ey = entryY[i];
    const midX = (coreEnd + outEdge) / 2;
    return `M ${coreEnd} ${ey} C ${midX} ${ey}, ${midX} ${y}, ${outEdge} ${y}`;
  };

  return (
    <figure className="dgm" role="img" aria-label={d.aria} style={{ margin: 0 }}>
      {/* ── Desktop / tablet: full SVG ── */}
      <div className="dgm__svg-wrap" aria-hidden="true">
        <m.svg
          className="dgm__svg"
          viewBox={`0 0 ${W} ${H}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px 0px" }}
        >
          {/* Column labels */}
          <Reveal delay={0.1}>
            <text className="dgm-col-label" x={fx(NODE_W / 2)} y="34" textAnchor="middle">
              {d.sourcesLabel.toUpperCase()}
            </text>
            <text className="dgm-col-label" x={fx(W - NODE_W / 2)} y="34" textAnchor="middle">
              {d.outputsLabel.toUpperCase()}
            </text>
          </Reveal>

          {/* Connectors (drawn) */}
          {d.sources.map((_, i) => (
            <m.path key={`in-${i}`} className="dgm-path" d={pathIn(i)} variants={draw} custom={0.55 + i * 0.1} />
          ))}
          {d.outputs.map((_, i) => (
            <m.path key={`out-${i}`} className="dgm-path" d={pathOut(i)} variants={draw} custom={0.85 + i * 0.1} />
          ))}

          {/* Slow data-flow pulses (CSS animation; disabled by reduced-motion) */}
          {d.sources.map((_, i) => (
            <path key={`fin-${i}`} className="dgm-path--flow" d={pathIn(i)} style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
          {d.outputs.map((_, i) => (
            <path key={`fout-${i}`} className="dgm-path--flow" d={pathOut(i)} style={{ animationDelay: `${0.45 + i * 0.9}s` }} />
          ))}

          {/* Source nodes */}
          {d.sources.map((s, i) => (
            <Node key={s.label} x={fx(NODE_W / 2)} y={ROW_Y[i]} label={s.label} sub={s.sub} delay={0.15 + i * 0.09} />
          ))}

          {/* Output nodes */}
          {d.outputs.map((s, i) => (
            <Node key={s.label} x={fx(W - NODE_W / 2)} y={ROW_Y[i]} label={s.label} sub={s.sub} delay={0.35 + i * 0.09} />
          ))}

          {/* Core */}
          <Reveal delay={0.5}>
            <g>
              <rect
                className="dgm-core"
                x={W / 2 - CORE_W / 2}
                y={CORE_Y - CORE_H / 2}
                width={CORE_W}
                height={CORE_H}
                rx="14"
                strokeWidth="1.2"
              />
              {/* mini pillars mark */}
              <g transform={`translate(${W / 2 - 19}, ${CORE_Y - CORE_H / 2 + 16}) scale(0.4)`}>
                <circle cx="40" cy="20" r="5.5" fill="#3B82F6" />
                <path d="M12 38 Q26 18,40 23 Q54 18,68 38" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <rect x="10" y="38" width="7.5" height="46" rx="1.5" fill="#C8D8F8" />
                <rect x="36.5" y="29" width="7.5" height="55" rx="1.5" fill="#93C5FD" />
                <rect x="62.5" y="38" width="7.5" height="46" rx="1.5" fill="#C8D8F8" />
                <rect x="6" y="84" width="68" height="4" rx="1.5" fill="#BFDBFE" />
              </g>
              <text className="dgm-core-title" x={W / 2} y={CORE_Y + 22} textAnchor="middle">
                {d.core.title}
              </text>
              <text className="dgm-core-sub" x={W / 2} y={CORE_Y + 40} textAnchor="middle">
                {d.core.sub}
              </text>
            </g>
          </Reveal>

          {/* Live status */}
          <Reveal delay={1.5}>
            <g>
              <circle className="dgm-live" cx={isRTL ? W / 2 + 58 : W / 2 - 58} cy={H - 22} r="3" />
              <text
                className="dgm-live-label"
                x={isRTL ? W / 2 + 48 : W / 2 - 48}
                y={H - 18.5}
                textAnchor={isRTL ? "end" : "start"}
              >
                {d.coreLive}
              </text>
            </g>
          </Reveal>
        </m.svg>
      </div>

      {/* ── Mobile: HTML variant ── */}
      <div className="dgm-m" aria-hidden="true">
        <p className="t-label t-label--dim" style={{ marginBottom: 10 }}>
          {d.sourcesLabel}
        </p>
        <div className="dgm-m__row">
          {d.sources.map((s) => (
            <span key={s.label} className="chip" style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", padding: "7px 14px" }}>
              {s.label}
            </span>
          ))}
        </div>
        <span className="dgm-m__link" style={{ marginBlock: 4 }} />
        <div className="dgm-m__core">
          <span>{d.core.title}</span>
          <span className="t-label">{d.core.sub}</span>
        </div>
        <span className="dgm-m__link" style={{ marginBlock: 4 }} />
        <div className="dgm-m__row">
          {d.outputs.map((s) => (
            <span key={s.label} className="chip" style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", padding: "7px 14px" }}>
              {s.label}
            </span>
          ))}
        </div>
        <p className="t-label t-label--dim" style={{ marginTop: 10 }}>
          {d.outputsLabel}
        </p>
      </div>

      <figcaption className="dgm__caption t-small">{d.caption}</figcaption>
    </figure>
  );
}

function Reveal({ delay = 0, children }) {
  return (
    <m.g
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: EASE } },
      }}
    >
      {children}
    </m.g>
  );
}

function Node({ x, y, label, sub, delay }) {
  return (
    <Reveal delay={delay}>
      <g>
        <rect className="dgm-node" x={x - NODE_W / 2} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="11" strokeWidth="1" />
        <text className="dgm-node-label" x={x} y={y + (sub ? -1 : 5)} textAnchor="middle">
          {label}
        </text>
        {sub && (
          <text className="dgm-node-sub" x={x} y={y + 15} textAnchor="middle">
            {sub}
          </text>
        )}
      </g>
    </Reveal>
  );
}
