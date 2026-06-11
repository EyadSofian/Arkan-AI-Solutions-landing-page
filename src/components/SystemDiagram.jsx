import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { draw, EASE } from "../lib/motion.js";

/**
 * The operational structure: scattered channels → the Arkan layer → your
 * systems. Composed per-direction (positions computed for RTL, not mirrored)
 * so labels and routed flow read naturally in both languages.
 * On small screens a legible semantic HTML variant replaces the SVG.
 */

const W = 640;
const H = 470;
const NODE_W = 152;
const NODE_H = 50;
const CORE_W = 172;
const CORE_H = 128;
const ROW_Y = [86, 184, 282, 380];
const CORE_Y = 233;

export function SystemDiagram() {
  const { t, isRTL } = useI18n();
  const d = t.diagram;

  const fx = (x) => (isRTL ? W - x : x);
  const srcEdge = fx(NODE_W);
  const outEdge = fx(W - NODE_W);
  const coreStart = fx(W / 2 - CORE_W / 2);
  const coreEnd = fx(W / 2 + CORE_W / 2);
  const entryY = [201, 222, 244, 265];

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
    <figure className="dgm" role="img" aria-label={d.aria}>
      {/* ── Desktop / tablet: full SVG ── */}
      <div className="dgm__svg-wrap corners" aria-hidden="true">
        <span className="corner-mark tl" /><span className="corner-mark tr" />
        <span className="corner-mark bl" /><span className="corner-mark br" />
        <m.svg
          className="dgm__svg"
          viewBox={`0 0 ${W} ${H}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px 0px" }}
        >
          <Reveal delay={0.1}>
            <text className="dgm-col" x={fx(NODE_W / 2)} y="34" textAnchor="middle">{d.sourcesLabel}</text>
            <text className="dgm-col" x={fx(W - NODE_W / 2)} y="34" textAnchor="middle">{d.outputsLabel}</text>
          </Reveal>

          {/* Drawn connectors */}
          {d.sources.map((_, i) => (
            <m.path key={`in-${i}`} className="dgm-line" d={pathIn(i)} variants={draw} custom={0.55 + i * 0.1} />
          ))}
          {d.outputs.map((_, i) => (
            <m.path key={`out-${i}`} className="dgm-line" d={pathOut(i)} variants={draw} custom={0.85 + i * 0.1} />
          ))}

          {/* Clay flow pulses (CSS; disabled by reduced-motion) */}
          {d.sources.map((_, i) => (
            <path key={`fin-${i}`} className="dgm-flow" d={pathIn(i)} style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
          {d.outputs.map((_, i) => (
            <path key={`fout-${i}`} className="dgm-flow" d={pathOut(i)} style={{ animationDelay: `${0.45 + i * 0.9}s` }} />
          ))}

          {d.sources.map((s, i) => (
            <Node key={s.label} x={fx(NODE_W / 2)} y={ROW_Y[i]} label={s.label} sub={s.sub} delay={0.15 + i * 0.09} />
          ))}
          {d.outputs.map((s, i) => (
            <Node key={s.label} x={fx(W - NODE_W / 2)} y={ROW_Y[i]} label={s.label} sub={s.sub} delay={0.35 + i * 0.09} />
          ))}

          {/* Core: the Arkan layer */}
          <Reveal delay={0.5}>
            <g>
              <rect className="dgm-core" x={W / 2 - CORE_W / 2} y={CORE_Y - CORE_H / 2} width={CORE_W} height={CORE_H} rx="12" />
              {/* pillars keystone */}
              <g transform={`translate(${W / 2 - 27}, ${CORE_Y - CORE_H / 2 + 18})`}>
                <rect x="0"  y="20" width="4" height="12" rx="1.2" className="dgm-pillar" />
                <rect x="9"  y="14" width="4" height="18" rx="1.2" className="dgm-pillar" />
                <rect x="18" y="8"  width="4" height="24" rx="1.2" className="dgm-pillar" opacity="0.8" />
                <rect x="27" y="2"  width="4" height="30" rx="1.2" className="dgm-pillar--key" />
                <rect x="-2" y="33" width="36" height="2" rx="1" className="dgm-pillar" />
              </g>
              <text className="dgm-core-title" x={W / 2} y={CORE_Y + 26} textAnchor="middle">{d.core.title}</text>
              <text className="dgm-core-sub" x={W / 2} y={CORE_Y + 44} textAnchor="middle">{d.core.sub}</text>
            </g>
          </Reveal>

          {/* Live status */}
          <Reveal delay={1.4}>
            <g>
              <circle className="dgm-live" cx={isRTL ? W / 2 + 60 : W / 2 - 60} cy={H - 22} r="3.2" />
              <text className="dgm-live-label" x={isRTL ? W / 2 + 50 : W / 2 - 50} y={H - 18} textAnchor={isRTL ? "end" : "start"}>
                {d.coreLive}
              </text>
            </g>
          </Reveal>
        </m.svg>
      </div>

      {/* ── Mobile: HTML variant ── */}
      <div className="dgm-m" aria-hidden="true">
        <p className="t-label" style={{ marginBottom: 10 }}>{d.sourcesLabel}</p>
        <div className="dgm-m__row">
          {d.sources.map((s) => <span key={s.label} className="dgm-m__node">{s.label}</span>)}
        </div>
        <span className="dgm-m__link" />
        <div className="dgm-m__core">
          <strong>{d.core.title}</strong>
          <span className="t-label">{d.core.sub}</span>
        </div>
        <span className="dgm-m__link" />
        <div className="dgm-m__row">
          {d.outputs.map((s) => <span key={s.label} className="dgm-m__node">{s.label}</span>)}
        </div>
        <p className="t-label" style={{ marginTop: 10 }}>{d.outputsLabel}</p>
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
        <rect className="dgm-node" x={x - NODE_W / 2} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="9" />
        <text className="dgm-node-label" x={x} y={y + (sub ? -1 : 5)} textAnchor="middle">{label}</text>
        {sub && <text className="dgm-node-sub" x={x} y={y + 15} textAnchor="middle">{sub}</text>}
      </g>
    </Reveal>
  );
}
