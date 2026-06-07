import { useState } from "react";
import { useTheme } from "../../../Themecontext";

const yaml = `apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-1
  labels:
    env: EX-DEV
spec:
  restartPolicy: OnFailure
  containers:
    - name: ex-cont-1
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP`;

function YamlLine({ line, isDark }: { line: string; isDark: boolean }) {
  const keyColor     = isDark ? "#93c5fd" : "#0369a1";
  const valueColor   = isDark ? "#fcd34d" : "#b45309";
  const numberColor  = isDark ? "#fb923c" : "#c2410c";
  const stringColor  = isDark ? "#f0abfc" : "#a21caf";
  const highlightColor = isDark ? "#ff6b35" : "#c2410c";

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent  = text.length - trimmed.length;
    const spaces  = "\u00a0".repeat(indent);

    if (trimmed.startsWith("#")) {
      return <span style={{ color: isDark ? "#6b7280" : "#4b5563" }}>{text}</span>;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) {
      if (trimmed.startsWith("- ")) {
        const rest = trimmed.slice(2);
        return (
          <>
            {spaces}
            <span style={{ color: keyColor }}>{"- "}</span>
            <span style={{ color: valueColor }}>{rest}</span>
          </>
        );
      }
      return <span style={{ color: valueColor }}>{text}</span>;
    }

    const key   = trimmed.slice(0, colonIdx);
    const value = trimmed.slice(colonIdx + 1).trim();

    if (key.startsWith("- ")) {
      const realKey = key.slice(2);
      const coloredValue =
        value === "" ? null : /^\d+$/.test(value) ? (
          <span style={{ color: numberColor }}>{value}</span>
        ) : (
          <span style={{ color: stringColor }}>{value}</span>
        );
      return (
        <>
          {spaces}
          <span style={{ color: keyColor }}>{"- "}{realKey}</span>:
          {value !== "" && <> {coloredValue}</>}
        </>
      );
    }

    const coloredValue =
      value === "" ? null : key === "restartPolicy" ? (
        <span style={{ color: highlightColor, fontWeight: 700 }}>{value}</span>
      ) : /^\d+$/.test(value) ? (
        <span style={{ color: numberColor }}>{value}</span>
      ) : (
        <span style={{ color: stringColor }}>{value}</span>
      );

    return (
      <>
        {spaces}
        <span style={{ color: keyColor }}>{key}</span>:
        {value !== "" && <> {coloredValue}</>}
      </>
    );
  };

  return (
    <div
      style={{
        fontFamily: "'Space Mono','SF Mono','Menlo',monospace",
        fontSize: "11.5px",
        lineHeight: "1.7",
        whiteSpace: "pre",
      }}
    >
      {renderLine(line)}
    </div>
  );
}

type Scenario = {
  exit: string;
  code: string;
  restarts: boolean;
};

const scenarios: Scenario[] = [
  { exit: "Exit 0",   code: "Success",  restarts: false },
  { exit: "Exit 1",   code: "Failure",  restarts: true  },
  { exit: "Exit 2",   code: "Misuse",   restarts: true  },
  { exit: "Exit 137", code: "OOM Kill", restarts: true  },
];

const bestFor = ["Batch Jobs", "Data Pipeline", "ETL", "Migrations", "Cron Jobs"];

export default function OnFailure() {
  const [copied,      setCopied]      = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── palette ──────────────────────────────────────────────────────────────
  const bg          = isDark ? "#110a00" : "#fff8f0";
  const cardBg      = isDark ? "#0a0700" : "#ffffff";
  const cardBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider     = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg      = isDark ? "#080500" : "#fff8f0";
  const codeBorder  = isDark ? "#221500" : "#fde68a";

  const txt         = isDark ? "#ffffff"              : "#1c1917";
  const txtSec      = isDark ? "rgba(255,180,80,0.7)" : "#78350f";
  const txtMuted    = isDark ? "rgba(255,150,50,0.45)": "#b45309";

  const orange       = isDark ? "#ff6b35"               : "#c2410c";
  const orangeAlpha  = isDark ? "rgba(255,107,53,0.08)" : "rgba(194,65,12,0.06)";
  const orangeBorder = isDark ? "rgba(255,107,53,0.28)" : "rgba(194,65,12,0.2)";

  const blue        = isDark ? "#93c5fd"                 : "#0369a1";
  const blueAlpha   = isDark ? "rgba(147,197,253,0.07)"  : "rgba(3,105,161,0.05)";
  const blueBorder  = isDark ? "rgba(147,197,253,0.2)"   : "rgba(3,105,161,0.15)";

  const amber       = isDark ? "#fcd34d"                 : "#b45309";
  const amberAlpha  = isDark ? "rgba(252,211,77,0.07)"   : "rgba(180,83,9,0.05)";
  const amberBorder = isDark ? "rgba(252,211,77,0.22)"   : "rgba(180,83,9,0.18)";

  const noRestartColor  = isDark ? "rgba(100,100,100,0.45)" : "#9ca3af";
  const noRestartAlpha  = isDark ? "rgba(100,100,100,0.08)" : "rgba(0,0,0,0.04)";
  const noRestartBorder = isDark ? "rgba(100,100,100,0.2)"  : "rgba(0,0,0,0.08)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1f0d00 0%,#0a0700 60%)"
    : "linear-gradient(135deg,#ffedd5 0%,#ffffff 60%)";

  const mono = "'Space Mono','SF Mono','Menlo',monospace";
  const sans = "'Outfit','Inter',-apple-system,BlinkMacSystemFont,sans-serif";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: sans,
        transition: "background 0.3s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes warn-flash {
          0%,100% { opacity:1; }
          50%      { opacity:0.35; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }

        .of-warn         { animation: warn-flash  2.5s ease-in-out infinite; }
        .of-flow-arrow   { animation: arrow-fade  2s   ease-in-out infinite; }
        .of-copy:hover   { color:${orange} !important; border-color:${orangeBorder} !important; }
        .of-row:hover    { background:${orangeAlpha} !important; transform:translateX(3px); }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          background: cardBg,
          borderRadius: "28px",
          border: `1px solid ${cardBorder}`,
          overflow: "hidden",
          transition: "background 0.3s,border-color 0.3s",
        }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: headerGrad,
            padding: "30px 36px 26px",
            borderBottom: `1px solid ${divider}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow blob */}
          <div
            style={{
              position: "absolute",
              top: -80, right: -80,
              width: 260, height: 260,
              background: `radial-gradient(circle,${orangeAlpha.replace("0.08","0.2")} 0%,transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "2px",
                  color: orange,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                restartPolicy
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: txt,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                  fontFamily: sans,
                }}
              >
                OnFailure
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: txtSec,
                  marginTop: 12,
                  maxWidth: 460,
                  lineHeight: 1.6,
                }}
              >
                Container restarts{" "}
                <strong style={{ color: orange, fontWeight: 500 }}>only on non-zero exit codes</strong>.
                Successful completions (exit 0) are not restarted.
              </div>
            </div>

            {/* badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: orangeAlpha,
                border: `1px solid ${orangeBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="of-warn"
                style={{ fontFamily: mono, fontSize: 12, color: orange }}
              >
                ⚠
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: orange,
                }}
              >
                FAIL ONLY
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 500,
          }}
        >

          {/* ── Left column ────────────────────────────────────────────── */}
          <div
            style={{
              borderRight: `1px solid ${divider}`,
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* API tags + desc */}
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "v1",                bg: blueAlpha,   border: blueBorder,   color: blue   },
                  { label: "spec/restartPolicy", bg: orangeAlpha, border: orangeBorder, color: orange },
                ].map((t) => (
                  <span
                    key={t.label}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 5,
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      color: t.color,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: txtSec }}>
                Defines pod restart behavior based on exit codes.{" "}
                <strong style={{ color: txt, fontWeight: 500 }}>OnFailure</strong>{" "}
                ensures containers restart only when they exit with a non-zero code.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {[
                  { label: "Conditional",   bg: orangeAlpha, border: orangeBorder, color: orange },
                  { label: "Batch ready",    bg: amberAlpha,  border: amberBorder,  color: amber  },
                  { label: "Job friendly",   bg: blueAlpha,   border: blueBorder,   color: blue   },
                ].map((t) => (
                  <span
                    key={t.label}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      letterSpacing: "0.3px",
                      padding: "4px 12px",
                      borderRadius: 4,
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      color: t.color,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* YAML block */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1.8px",
                    textTransform: "uppercase",
                    color: txtMuted,
                  }}
                >
                  onfailure.yaml
                </span>
                <button
                  className="of-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${isDark ? "#221500" : "#fde68a"}`,
                    background: "transparent",
                    color: copied ? orange : txtMuted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ copied" : "copy"}
                </button>
              </div>

              <div
                style={{
                  background: codeBg,
                  border: `1px solid ${codeBorder}`,
                  borderRadius: 14,
                  overflow: "auto",
                }}
              >
                <div style={{ padding: "18px 22px" }}>
                  {yaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* kubectl */}
            <div
              style={{
                fontFamily: mono,
                fontSize: 11,
                padding: "10px 16px",
                borderRadius: 8,
                background: orangeAlpha,
                border: `1px solid ${orangeBorder}`,
                color: orange,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: txtMuted }}>$</span>
              kubectl apply -f onfailure.yaml
            </div>
          </div>

          {/* ── Right column ───────────────────────────────────────────── */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >

            {/* Behavior flow */}
            <div>
              <SectionLabel label="Behavior" mono={mono} color={txtMuted} divider={divider} />

              <div
                style={{
                  background: codeBg,
                  border: `1px solid ${codeBorder}`,
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  {(["Container\nrunning", "Exit\ncode 0", "Exit\ncode ≠ 0"] as const).map(
                    (label, idx) => (
                      <div
                        key={label}
                        style={{ display: "flex", alignItems: "center", flex: idx === 1 ? "0 0 auto" : 1 }}
                      >
                        <div
                          style={{
                            flex: 1,
                            textAlign: "center",
                            background:
                              idx === 2 ? orangeAlpha : "rgba(255,255,255,0.03)",
                            border: `1px solid ${idx === 2 ? orangeBorder : divider}`,
                            borderRadius: 10,
                            padding: "14px 8px",
                          }}
                        >
                          <div style={{ fontSize: 24, marginBottom: 8, opacity: idx === 2 ? 1 : 0.55 }}>
                            {idx === 0 ? "🟢" : idx === 1 ? "✅" : "⚠️"}
                          </div>
                          <div
                            style={{
                              fontFamily: mono,
                              fontSize: 10,
                              lineHeight: 1.5,
                              color: idx === 2 ? orange : txtSec,
                              whiteSpace: "pre",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                        {idx < 2 && (
                          <div
                            className="of-flow-arrow"
                            style={{ fontSize: 18, color: orange, padding: "0 8px" }}
                          >
                            →
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: `1px solid ${divider}`,
                    fontFamily: mono,
                    fontSize: 10,
                    color: txtSec,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  <span><span style={{ color: orange }}>⚠</span> Restart on Exit 1, Exit 2, Exit 137</span>
                  <span><span style={{ color: noRestartColor }}>✗</span> No restart on Exit 0 (Success)</span>
                </div>
              </div>
            </div>

            {/* Exit code matrix */}
            <div>
              <SectionLabel label="Exit code matrix" mono={mono} color={txtMuted} divider={divider} />

              <div
                style={{
                  background: codeBg,
                  border: `1px solid ${codeBorder}`,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {scenarios.map((s, i) => (
                  <div
                    key={i}
                    className="of-row"
                    onMouseEnter={() => setHighlighted(i)}
                    onMouseLeave={() => setHighlighted(null)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "11px 18px",
                      borderBottom: i !== scenarios.length - 1 ? `1px solid ${divider}` : "none",
                      background: highlighted === i ? orangeAlpha : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontFamily: mono, fontSize: 11, color: txt }}>
                        {s.exit}
                      </span>
                      <span style={{ fontFamily: mono, fontSize: 9, color: txtMuted }}>
                        ({s.code})
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: "1px",
                        color:      s.restarts ? orange          : noRestartColor,
                        background: s.restarts ? orangeAlpha     : noRestartAlpha,
                        border:     `1px solid ${s.restarts ? orangeBorder : noRestartBorder}`,
                        borderRadius: 4,
                        padding: "3px 10px",
                      }}
                    >
                      {s.restarts ? "↻ RESTART" : "✓ NO RESTART"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best for */}
            <div>
              <SectionLabel label="Best for" mono={mono} color={txtMuted} divider={divider} />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {bestFor.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      fontWeight: 400,
                      color: orange,
                      background: orangeAlpha,
                      border: `1px solid ${orangeBorder}`,
                      borderRadius: 6,
                      padding: "5px 14px",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── tiny helper ──────────────────────────────────────────────────────────── */
function SectionLabel({
  label,
  mono,
  color,
  divider,
}: {
  label: string;
  mono: string;
  color: string;
  divider: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span
        style={{
          fontFamily: mono,
          fontSize: 9,
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: divider }} />
    </div>
  );
}