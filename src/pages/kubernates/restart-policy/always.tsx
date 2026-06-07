import { useState } from "react";
import { useTheme } from "../../../Themecontext";

const yaml = `apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-1
  labels:
    env: EX-DEV
spec:
  restartPolicy: Always
  containers:
    - name: ex-cont-1
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP`;

function YamlLine({ line, isDark }: { line: string; isDark: boolean }) {
  const keyColor = isDark ? "#7dd3fc" : "#0369a1";
  const valueColor = isDark ? "#86efac" : "#15803d";
  const numberColor = isDark ? "#fbbf24" : "#b45309";
  const stringColor = isDark ? "#f9a8d4" : "#be185d";
  const highlightColor = isDark ? "#00ff88" : "#059669";

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent = text.length - trimmed.length;
    const spaces = "\u00a0".repeat(indent);

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

    const key = trimmed.slice(0, colonIdx);
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
        fontFamily: "'Space Mono', 'SF Mono', 'Menlo', monospace",
        fontSize: "11.5px",
        lineHeight: "1.7",
        whiteSpace: "pre",
      }}
    >
      {renderLine(line)}
    </div>
  );
}

const scenarios = [
  { exit: "Exit 0 (Success)" },
  { exit: "Exit 1 (Failure)" },
  { exit: "Exit 137 (OOM Kill)" },
  { exit: "Exit 143 (SIGTERM)" },
];

const bestFor = ["nginx", "API Gateway", "Redis", "Background Worker", "Web Server"];

export default function Always() {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── palette ──────────────────────────────────────────────────────────────
  const bg          = isDark ? "#0f0f1a" : "#f0f4ff";
  const cardBg      = isDark ? "#0a0a12" : "#ffffff";
  const cardBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider     = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg      = isDark ? "#07070e" : "#f5f7ff";
  const codeBorder  = isDark ? "#1a1a2a" : "#dde3f5";

  const txt         = isDark ? "#ffffff" : "#0f172a";
  const txtSec      = isDark ? "rgba(255,255,255,0.5)" : "#475569";
  const txtMuted    = isDark ? "rgba(255,255,255,0.3)" : "#94a3b8";

  const green       = isDark ? "#00ff88" : "#059669";
  const greenAlpha  = isDark ? "rgba(0,255,136,0.08)" : "rgba(5,150,105,0.06)";
  const greenBorder = isDark ? "rgba(0,255,136,0.25)" : "rgba(5,150,105,0.2)";

  const blue        = isDark ? "#7dd3fc" : "#0284c7";
  const blueAlpha   = isDark ? "rgba(125,211,252,0.07)" : "rgba(2,132,199,0.05)";
  const blueBorder  = isDark ? "rgba(125,211,252,0.2)" : "rgba(2,132,199,0.15)";

  const amber       = isDark ? "#fbbf24" : "#d97706";
  const amberAlpha  = isDark ? "rgba(251,191,36,0.08)" : "rgba(217,119,6,0.06)";
  const amberBorder = isDark ? "rgba(251,191,36,0.25)" : "rgba(217,119,6,0.2)";

  const headerGrad  = isDark
    ? "linear-gradient(135deg,#0f1e3a 0%,#0a0a12 60%)"
    : "linear-gradient(135deg,#dbeafe 0%,#ffffff 60%)";

  // ── mono font shorthand ───────────────────────────────────────────────────
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

        @keyframes dot-glow {
          0%,100% { opacity:1; box-shadow:0 0 8px ${green}; }
          50%      { opacity:0.3; box-shadow:0 0 2px ${green}; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }

        .always-copy:hover  { color:${green} !important; border-color:${greenBorder} !important; }
        .always-row:hover   { background:${greenAlpha} !important; }
        .always-flow-arrow  { animation: arrow-fade 2s ease-in-out infinite; }
        .always-dot         { animation: dot-glow   2s ease-in-out infinite; }
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
              background: `radial-gradient(circle, ${greenAlpha.replace("0.08","0.18")} 0%, transparent 70%)`,
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
                  color: green,
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
                Always
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
                <strong style={{ color: green, fontWeight: 500 }}>unconditionally</strong>{" "}
                whenever it stops — regardless of exit status.
              </div>
            </div>

            {/* badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: greenAlpha,
                border: `1px solid ${greenBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="always-dot"
                style={{
                  width: 7, height: 7,
                  borderRadius: "50%",
                  background: green,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: green,
                }}
              >
                ALWAYS ON
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
                  { label: "v1",                 bg: blueAlpha,  border: blueBorder,  color: blue  },
                  { label: "spec/restartPolicy",  bg: greenAlpha, border: greenBorder, color: green },
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
                Defines pod restart behavior across all containers.{" "}
                <strong style={{ color: txt, fontWeight: 500 }}>Always</strong>{" "}
                ensures containers are re-created after any termination.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {[
                  { label: "Unconditional",  bg: greenAlpha,  border: greenBorder,  color: green },
                  { label: "Long-running",    bg: amberAlpha,  border: amberBorder,  color: amber },
                  { label: "Daemon friendly", bg: blueAlpha,   border: blueBorder,   color: blue  },
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
                  always.yaml
                </span>
                <button
                  className="always-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${isDark ? "#1e1e2e" : "#dde3f5"}`,
                    background: "transparent",
                    color: copied ? green : txtMuted,
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
                background: greenAlpha,
                border: `1px solid ${greenBorder}`,
                color: green,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: txtMuted }}>$</span>
              kubectl apply -f always.yaml
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
                  {(["Container\nrunning", "Container\nstops", "Restart\nalways"] as const).map(
                    (label, idx) => (
                      <div
                        key={label}
                        style={{ display: "flex", alignItems: "center", flex: idx === 1 ? "0 0 auto" : 1 }}
                      >
                        <div
                          style={{
                            flex: 1,
                            textAlign: "center",
                            background: idx === 2 ? greenAlpha : "rgba(255,255,255,0.03)",
                            border: `1px solid ${idx === 2 ? greenBorder : divider}`,
                            borderRadius: 10,
                            padding: "14px 8px",
                          }}
                        >
                          <div style={{ fontSize: 24, marginBottom: 8, opacity: idx === 2 ? 1 : 0.55 }}>
                            {idx === 0 ? "🟢" : idx === 1 ? "⏹" : "🔄"}
                          </div>
                          <div
                            style={{
                              fontFamily: mono,
                              fontSize: 10,
                              lineHeight: 1.5,
                              color: idx === 2 ? green : txtSec,
                              whiteSpace: "pre",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                        {idx < 2 && (
                          <div
                            className="always-flow-arrow"
                            style={{ fontSize: 18, color: green, padding: "0 8px" }}
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
                    textAlign: "center",
                    fontFamily: mono,
                    fontSize: 10,
                    color: txtSec,
                    letterSpacing: "0.2px",
                  }}
                >
                  <span style={{ color: green }}>✓</span>{" "}
                  Restart on Exit 0, Exit 1, OOM Kill, SIGTERM
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
                    className="always-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "11px 18px",
                      borderBottom: i !== scenarios.length - 1 ? `1px solid ${divider}` : "none",
                      transition: "background 0.15s",
                    }}
                  >
                    <span style={{ fontFamily: mono, fontSize: 11, color: txt }}>
                      {s.exit}
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: "1px",
                        color: green,
                        background: greenAlpha,
                        border: `1px solid ${greenBorder}`,
                        borderRadius: 4,
                        padding: "3px 10px",
                      }}
                    >
                      ↻ RESTART
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
                      color: blue,
                      background: blueAlpha,
                      border: `1px solid ${blueBorder}`,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
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