import { useState } from "react";
import { useTheme } from "../../../Themecontext";

const yaml = `apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-1
  labels:
    env: EX-DEV
spec:
  restartPolicy: Never
  containers:
    - name: ex-cont-1
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP`;

function YamlLine({ line, isDark }: { line: string; isDark: boolean }) {
  const keyColor = isDark ? "#fca5a5" : "#dc2626";
  const valueColor = isDark ? "#c4b5fd" : "#7c3aed";
  const numberColor = isDark ? "#f472b6" : "#db2777";
  const stringColor = isDark ? "#a5f3fc" : "#0891b2";
  const highlightColor = isDark ? "#ff4444" : "#dc2626";

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent = text.length - trimmed.length;
    const spaces = "\u00a0".repeat(indent);

    if (trimmed.startsWith("#")) {
      return (
        <span style={{ color: isDark ? "#6b7280" : "#4b5563" }}>{text}</span>
      );
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
          <span style={{ color: keyColor }}>
            {"- "}
            {realKey}
          </span>
          :{value !== "" && <> {coloredValue}</>}
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
};

const scenarios: Scenario[] = [
  { exit: "Exit 0", code: "Success" },
  { exit: "Exit 1", code: "Failure" },
  { exit: "Exit 137", code: "OOM Kill" },
  { exit: "Exit 143", code: "SIGTERM" },
];

const bestFor = [
  "One-time Jobs",
  "Debugging",
  "Init Scripts",
  "Test Runners",
  "Data Migration",
];

export default function Never() {
  const [copied, setCopied] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── palette ──────────────────────────────────────────────────────────────
  const bg = isDark ? "#0d0005" : "#fff5f5";
  const cardBg = isDark ? "#09000a" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#070005" : "#fff5f5";
  const codeBorder = isDark ? "#280010" : "#fecaca";

  const txt = isDark ? "#ffffff" : "#1f2937";
  const txtSec = isDark ? "rgba(255,120,120,0.7)" : "#991b1b";
  const txtMuted = isDark ? "rgba(255,80,80,0.4)" : "#b91c1c";

  const red = isDark ? "#ff4444" : "#dc2626";
  const redAlpha = isDark ? "rgba(255,68,68,0.08)" : "rgba(220,38,38,0.06)";
  const redBorder = isDark ? "rgba(255,68,68,0.28)" : "rgba(220,38,38,0.2)";

  const purple = isDark ? "#c4b5fd" : "#7c3aed";
  const purpleAlpha = isDark
    ? "rgba(196,181,253,0.07)"
    : "rgba(124,58,237,0.05)";
  const purpleBorder = isDark
    ? "rgba(196,181,253,0.2)"
    : "rgba(124,58,237,0.15)";

  const cyan = isDark ? "#a5f3fc" : "#0891b2";
  const cyanAlpha = isDark ? "rgba(165,243,252,0.07)" : "rgba(8,145,178,0.05)";
  const cyanBorder = isDark ? "rgba(165,243,252,0.2)" : "rgba(8,145,178,0.15)";

  const noColor = isDark ? "rgba(130,80,80,0.7)" : "#9ca3af";
  const noAlpha = isDark ? "rgba(100,50,50,0.15)" : "rgba(0,0,0,0.04)";
  const noBorder = isDark ? "rgba(130,80,80,0.25)" : "rgba(0,0,0,0.08)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1e0010 0%,#09000a 60%)"
    : "linear-gradient(135deg,#fee2e2 0%,#ffffff 60%)";

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

        @keyframes red-pulse {
          0%,100% { opacity:1; box-shadow:0 0 8px ${red}; }
          50%      { opacity:0.3; box-shadow:0 0 2px ${red}; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }
        @keyframes forbidden-shake {
          0%,100% { transform: rotate(0deg) scale(1); }
          25%      { transform: rotate(-8deg) scale(1.08); }
          75%      { transform: rotate(8deg)  scale(1.08); }
        }

        .nv-block         { animation: red-pulse      2.8s ease-in-out infinite; }
        .nv-block:hover   { animation: forbidden-shake 0.4s ease; }
        .nv-flow-arrow    { animation: arrow-fade      2s   ease-in-out infinite; }
        .nv-copy:hover    { color:${red} !important; border-color:${redBorder} !important; }
        .nv-row:hover     { background:${redAlpha} !important; transform:translateX(3px); }
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
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              background: `radial-gradient(circle,${redAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                  color: red,
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
                Never
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
                Container is{" "}
                <strong style={{ color: red, fontWeight: 500 }}>
                  never restarted
                </strong>{" "}
                under any circumstance. Once it exits — successfully or not — it
                stays stopped.
              </div>
            </div>

            {/* badge */}
            <div
              className="nv-block"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: redAlpha,
                border: `1px solid ${redBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
                cursor: "default",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 14,
                  color: red,
                  lineHeight: 1,
                }}
              >
                ⊘
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: red,
                }}
              >
                TERMINATED
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
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {[
                  {
                    label: "v1",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                  {
                    label: "spec/restartPolicy",
                    bg: redAlpha,
                    border: redBorder,
                    color: red,
                  },
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
                Disables all container restarts regardless of exit code.{" "}
                <strong style={{ color: txt, fontWeight: 500 }}>Never</strong>{" "}
                ensures pods run exactly once — perfect for one-time jobs and
                debugging.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                {[
                  {
                    label: "No restarts",
                    bg: redAlpha,
                    border: redBorder,
                    color: red,
                  },
                  {
                    label: "Run once",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                  {
                    label: "Debug friendly",
                    bg: cyanAlpha,
                    border: cyanBorder,
                    color: cyan,
                  },
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
                  never.yaml
                </span>
                <button
                  className="nv-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${isDark ? "#280010" : "#fecaca"}`,
                    background: "transparent",
                    color: copied ? red : txtMuted,
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
                background: redAlpha,
                border: `1px solid ${redBorder}`,
                color: red,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: txtMuted }}>$</span>
              kubectl apply -f never.yaml
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
              <SectionLabel
                label="Behavior"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />

              <div
                style={{
                  background: codeBg,
                  border: `1px solid ${codeBorder}`,
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  {(
                    [
                      "Container\nrunning",
                      "Container\nexits",
                      "Never\nrestarts",
                    ] as const
                  ).map((label, idx) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: idx === 1 ? "0 0 auto" : 1,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background:
                            idx === 2 ? redAlpha : "rgba(255,255,255,0.03)",
                          border: `1px solid ${idx === 2 ? redBorder : divider}`,
                          borderRadius: 10,
                          padding: "14px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: idx === 2 ? 20 : 24,
                            marginBottom: 8,
                            opacity: idx === 2 ? 1 : 0.55,
                            color: idx === 2 ? red : "inherit",
                          }}
                        >
                          {idx === 0 ? "🟢" : idx === 1 ? "⏹" : "⊘"}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 10,
                            lineHeight: 1.5,
                            color: idx === 2 ? red : txtSec,
                            whiteSpace: "pre",
                          }}
                        >
                          {label}
                        </div>
                      </div>
                      {idx < 2 && (
                        <div
                          className="nv-flow-arrow"
                          style={{ fontSize: 18, color: red, padding: "0 8px" }}
                        >
                          →
                        </div>
                      )}
                    </div>
                  ))}
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
                  }}
                >
                  <span style={{ color: red }}>⊘</span> No restart on any exit —
                  manual intervention required
                </div>
              </div>
            </div>

            {/* Exit code matrix */}
            <div>
              <SectionLabel
                label="Exit code matrix"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />

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
                    className="nv-row"
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "11px 18px",
                      borderBottom:
                        i !== scenarios.length - 1
                          ? `1px solid ${divider}`
                          : "none",
                      background: hoveredRow === i ? redAlpha : "transparent",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{ fontFamily: mono, fontSize: 11, color: txt }}
                      >
                        {s.exit}
                      </span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 9,
                          color: txtMuted,
                        }}
                      >
                        ({s.code})
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: "1px",
                        color: noColor,
                        background: noAlpha,
                        border: `1px solid ${noBorder}`,
                        borderRadius: 4,
                        padding: "3px 10px",
                        textDecoration: "line-through",
                        textDecorationColor: noColor,
                      }}
                    >
                      ✗ NO RESTART
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best for */}
            <div>
              <SectionLabel
                label="Best for"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {bestFor.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: sans,
                      fontSize: 12,
                      fontWeight: 400,
                      color: red,
                      background: redAlpha,
                      border: `1px solid ${redBorder}`,
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
