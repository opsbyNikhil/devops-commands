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
  // Theme-aware colors
  const keyColor = isDark ? "#fca5a5" : "#dc2626";
  const valueColor = isDark ? "#c4b5fd" : "#7c3aed";
  const numberColor = isDark ? "#f472b6" : "#db2777";
  const stringColor = isDark ? "#a5f3fc" : "#0891b2";
  const highlightColor = isDark ? "#f87171" : "#dc2626";

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
            <span style={{ color: keyColor }}>- </span>
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
        value === "" ? (
          ""
        ) : /^\d+$/.test(value) ? (
          <span style={{ color: numberColor }}>{value}</span>
        ) : (
          <span style={{ color: stringColor }}>{value}</span>
        );
      return (
        <>
          {spaces}
          <span style={{ color: keyColor }}>- {realKey}</span>:
          {value !== "" && <> {coloredValue}</>}
        </>
      );
    }

    const coloredValue =
      value === "" ? (
        ""
      ) : key === "restartPolicy" ? (
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
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "12px",
        lineHeight: "1.6",
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
  label: string;
};

const scenarios: Scenario[] = [
  { exit: "Exit 0", code: "Success", label: "NO RESTART" },
  { exit: "Exit 1", code: "Failure", label: "NO RESTART" },
  { exit: "Exit 137", code: "OOM Kill", label: "NO RESTART" },
  { exit: "Exit 143", code: "SIGTERM", label: "NO RESTART" },
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

  // Theme-aware colors
  const bgColor = isDark ? "#0d0010" : "#fef2f2";
  const cardBg = isDark ? "#0a0008" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const headerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#ffffff" : "#1f2937";
  const textSecondary = isDark ? "#9a6060" : "#991b1b";
  const textMuted = isDark ? "#6b3a3a" : "#b91c1c";
  const codeBg = isDark ? "#0a0008" : "#fff5f5";
  const codeBorder = isDark ? "#2a0a0a" : "#fecaca";
  const tagBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const tagBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accentRed = isDark ? "#f87171" : "#dc2626";
  const accentRedLight = isDark
    ? "rgba(248,113,113,0.08)"
    : "rgba(220,38,38,0.08)";
  const accentRedBorder = isDark
    ? "rgba(248,113,113,0.2)"
    : "rgba(220,38,38,0.2)";
  const accentPurple = isDark ? "#c4b5fd" : "#7c3aed";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily:
          "'Inter', 'JetBrains Mono', system-ui, -apple-system, sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes forbidden {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-5deg) scale(1.05); }
          75% { transform: rotate(5deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes fadePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes redPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${accentRed}66; }
          50% { box-shadow: 0 0 0 8px ${accentRed}00; }
        }
        .block-icon:hover {
          animation: forbidden 0.4s ease;
        }
        .icon-wrap {
          animation: redPulse 2.8s ease-in-out infinite;
        }
        .flow-arrow {
          animation: fadePulse 2s ease-in-out infinite;
        }
        .copy-btn-nv:hover {
          background: ${accentRedLight} !important;
          border-color: ${accentRed} !important;
        }
        .scenario-row:hover {
          background: ${accentRedLight} !important;
          transform: translateX(3px);
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          background: cardBg,
          borderRadius: "28px",
          border: `1px solid ${cardBorder}`,
          overflow: "hidden",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Header Area */}
        <div
          style={{
            padding: "28px 32px 20px 32px",
            borderBottom: `1px solid ${headerBorder}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  color: accentRed,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                restartPolicy
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: textPrimary,
                  letterSpacing: "-0.5px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Never
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: textSecondary,
                  marginTop: "8px",
                  maxWidth: "480px",
                }}
              >
                Container is{" "}
                <strong style={{ color: accentRed }}>never restarted</strong>{" "}
                under any circumstance. Once it exits — successfully or not — it
                stays stopped.
              </div>
            </div>
            <div
              className="icon-wrap"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                background: accentRedLight,
                padding: "6px 14px",
                borderRadius: "100px",
                border: `1px solid ${accentRedBorder}`,
              }}
            >
              <span
                className="block-icon"
                style={{ fontSize: "14px", color: accentRed }}
              >
                ⊘
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: textSecondary,
                  fontWeight: 500,
                }}
              >
                TERMINATED
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            minHeight: "520px",
          }}
        >
          {/* LEFT COLUMN: Spec + YAML */}
          <div
            style={{
              borderRight: `1px solid ${headerBorder}`,
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Version & Kind Chip */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    background: isDark
                      ? "rgba(196,181,253,0.12)"
                      : "rgba(124,58,237,0.08)",
                    color: accentPurple,
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  v1
                </span>
                <span
                  style={{
                    background: isDark
                      ? "rgba(248,113,113,0.12)"
                      : "rgba(220,38,38,0.08)",
                    color: accentRed,
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  spec/restartPolicy
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: textSecondary,
                  marginBottom: "20px",
                }}
              >
                Disables all container restarts regardless of exit code.
                <strong> Never</strong> ensures pods run exactly once — perfect
                for one-time jobs and debugging.
              </p>

              {/* Property Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {[
                  { label: "No restarts", color: accentRed },
                  { label: "Run once", color: isDark ? "#c4b5fd" : "#7c3aed" },
                  {
                    label: "Debug friendly",
                    color: isDark ? "#a5f3fc" : "#0891b2",
                  },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    style={{
                      background: tagBg,
                      border: `1px solid ${tagBorder}`,
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: tag.color,
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* YAML Card */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: textMuted,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Example — never.yaml
                </span>
                <button
                  className="copy-btn-nv"
                  onClick={handleCopy}
                  style={{
                    background: "transparent",
                    border: `1px solid ${isDark ? "#2a0a0a" : "#fecaca"}`,
                    borderRadius: "8px",
                    color: copied ? accentRed : textMuted,
                    fontSize: "11px",
                    padding: "4px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    fontWeight: 500,
                  }}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div
                style={{
                  background: codeBg,
                  borderRadius: "16px",
                  border: `1px solid ${codeBorder}`,
                  overflow: "auto",
                }}
              >
                <div style={{ padding: "18px 20px" }}>
                  {yaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* kubectl hint */}
            <div
              style={{
                background: accentRedLight,
                border: `1px solid ${accentRedBorder}`,
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "14px" }}>💰</span>
              <code
                style={{
                  fontSize: "12px",
                  color: accentRed,
                  background: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                kubectl apply -f never.yaml
              </code>
            </div>
          </div>

          {/* RIGHT COLUMN: Visual + Behavior Matrix */}
          <div
            style={{
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Visual Flow Diagram */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: textMuted,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Behavior
              </div>
              <div
                style={{
                  background: codeBg,
                  borderRadius: "20px",
                  border: `1px solid ${codeBorder}`,
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    "Container Running",
                    "Container Exits",
                    "Never Restarts",
                  ].map((step, idx) => (
                    <div key={step} style={{ flex: 1, textAlign: "center" }}>
                      <div
                        style={{
                          background: idx === 2 ? accentRedLight : tagBg,
                          border:
                            idx === 2
                              ? `1px solid ${accentRedBorder}`
                              : `1px solid ${tagBorder}`,
                          borderRadius: "14px",
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "24px",
                            marginBottom: "8px",
                            opacity: idx === 2 ? 1 : 0.7,
                          }}
                        >
                          {idx === 0 ? "🟢" : idx === 1 ? "⏹️" : "⊘"}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: idx === 2 ? accentRed : textSecondary,
                          }}
                        >
                          {step}
                        </div>
                      </div>
                      {idx < 2 && (
                        <div
                          className="flow-arrow"
                          style={{
                            fontSize: "18px",
                            color: accentRed,
                            margin: "8px 0",
                          }}
                        >
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: textSecondary,
                    borderTop: `1px solid ${headerBorder}`,
                    paddingTop: "14px",
                  }}
                >
                  <span style={{ color: accentRed }}>⊘</span> No restart on any
                  exit — manual intervention required
                </div>
              </div>
            </div>

            {/* Behavior Matrix Table */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: textMuted,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Exit Code Matrix
              </div>
              <div
                style={{
                  background: codeBg,
                  borderRadius: "16px",
                  border: `1px solid ${codeBorder}`,
                  overflow: "hidden",
                }}
              >
                {scenarios.map((s, i) => (
                  <div
                    key={i}
                    className="scenario-row"
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 18px",
                      borderBottom:
                        i !== scenarios.length - 1
                          ? `1px solid ${headerBorder}`
                          : "none",
                      transition: "all 0.2s",
                      background:
                        hoveredRow === i ? accentRedLight : "transparent",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          color: textPrimary,
                        }}
                      >
                        {s.exit}
                      </span>
                      <span
                        style={{
                          color: textMuted,
                          fontSize: "10px",
                          marginLeft: "8px",
                        }}
                      >
                        ({s.code})
                      </span>
                    </div>
                    <span
                      style={{
                        background: isDark
                          ? "rgba(100,100,100,0.12)"
                          : "rgba(0,0,0,0.05)",
                        color: textMuted,
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: "20px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        textDecoration: "line-through",
                        textDecorationColor: textMuted,
                      }}
                    >
                      ✗ {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases List */}
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: textMuted,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Best For
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {[
                  "One-time Jobs",
                  "Debugging",
                  "Init Scripts",
                  "Test Runners",
                  "Data Migration",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      background: isDark
                        ? "rgba(248,113,113,0.06)"
                        : "rgba(220,38,38,0.06)",
                      border: `1px solid ${isDark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.15)"}`,
                      borderRadius: "20px",
                      padding: "4px 14px",
                      fontSize: "12px",
                      color: accentRed,
                      fontWeight: 500,
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
