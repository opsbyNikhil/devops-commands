import { useState, useContext } from "react";
import ThemeContext, { useTheme } from "../../../Themecontext";

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
  // Theme-aware colors
  const keyColor = isDark ? "#7dd3fc" : "#0369a1";
  const valueColor = isDark ? "#86efac" : "#15803d";
  const numberColor = isDark ? "#fbbf24" : "#b45309";
  const stringColor = isDark ? "#f9a8d4" : "#be185d";
  const commentColor = isDark ? "#6b7280" : "#4b5563";
  const highlightColor = isDark ? "#34d399" : "#059669";

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent = text.length - trimmed.length;
    const spaces = "\u00a0".repeat(indent);

    if (trimmed.startsWith("#")) {
      return <span style={{ color: commentColor }}>{text}</span>;
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

const scenarios = [
  { exit: "Exit 0 (Success)", restarts: true },
  { exit: "Exit 1 (Failure)", restarts: true },
  { exit: "Exit 137 (OOM Kill)", restarts: true },
  { exit: "Exit 143 (SIGTERM)", restarts: true },
];

export default function Always() {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Theme-aware colors
  const bgColor = isDark ? "#0f0f13" : "#f8fafc";
  const cardBg = isDark ? "#0a0a0f" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const headerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#8b8b9e" : "#475569";
  const textMuted = isDark ? "#6b7280" : "#64748b";
  const codeBg = isDark ? "#0d0d12" : "#f1f5f9";
  const codeBorder = isDark ? "#1e1e28" : "#e2e8f0";
  const tagBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const tagBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accentGreen = isDark ? "#34d399" : "#059669";
  const accentGreenLight = isDark
    ? "rgba(52,211,153,0.08)"
    : "rgba(5,150,105,0.08)";
  const accentGreenBorder = isDark
    ? "rgba(52,211,153,0.2)"
    : "rgba(5,150,105,0.2)";
  const accentBlue = isDark ? "#7dd3fc" : "#0284c7";

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
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${accentGreen}66; }
          50% { box-shadow: 0 0 0 6px ${accentGreen}00; }
        }
        @keyframes fadePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .badge-pulse { animation: pulse 2s ease-in-out infinite; }
        .flow-arrow { animation: fadePulse 2s ease-in-out infinite; }
        .copy-btn:hover {
          background: ${accentGreenLight} !important;
          border-color: ${accentGreen} !important;
        }
        .scenario-row:hover {
          background: ${accentGreenLight} !important;
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
                  color: accentGreen,
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
                Always
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: textSecondary,
                  marginTop: "8px",
                  maxWidth: "480px",
                }}
              >
                Container restarts{" "}
                <strong style={{ color: accentGreen }}>unconditionally</strong>{" "}
                whenever it stops — regardless of exit status.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                background: accentGreenLight,
                padding: "6px 14px",
                borderRadius: "100px",
                border: `1px solid ${accentGreenBorder}`,
              }}
            >
              <span style={{ fontSize: "12px", color: accentGreen }}>●</span>
              <span
                style={{
                  fontSize: "12px",
                  color: textSecondary,
                  fontWeight: 500,
                }}
              >
                ALWAYS ON
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
                      ? "rgba(125,211,252,0.12)"
                      : "rgba(2,132,199,0.08)",
                    color: accentBlue,
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
                      ? "rgba(134,239,172,0.12)"
                      : "rgba(5,150,105,0.08)",
                    color: accentGreen,
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
                Defines pod restart behavior across all containers.{" "}
                <strong>Always</strong> ensures containers are re-created after
                any termination.
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
                  { label: "Unconditional", color: accentGreen },
                  {
                    label: "Long-running",
                    color: isDark ? "#fbbf24" : "#d97706",
                  },
                  { label: "Daemon friendly", color: accentBlue },
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
                  Example — always.yaml
                </span>
                <button
                  className="copy-btn"
                  onClick={handleCopy}
                  style={{
                    background: "transparent",
                    border: `1px solid ${isDark ? "#2a2a35" : "#cbd5e1"}`,
                    borderRadius: "8px",
                    color: copied ? accentGreen : textMuted,
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
                background: accentGreenLight,
                border: `1px solid ${accentGreenBorder}`,
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
                  color: accentGreen,
                  background: "transparent",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                kubectl apply -f always.yaml
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
                    "Container Stops",
                    "Restart Always",
                  ].map((step, idx) => (
                    <div key={step} style={{ flex: 1, textAlign: "center" }}>
                      <div
                        style={{
                          background: idx === 2 ? accentGreenLight : tagBg,
                          border:
                            idx === 2
                              ? `1px solid ${accentGreenBorder}`
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
                          {idx === 0 ? "🟢" : idx === 1 ? "⏹️" : "🔄"}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: idx === 2 ? accentGreen : textSecondary,
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
                            color: accentGreen,
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
                  <span style={{ color: accentGreen }}>✓</span> Restart
                  triggered on Exit 0, Exit 1, OOM Kill, SIGTERM
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 18px",
                      borderBottom:
                        i !== scenarios.length - 1
                          ? `1px solid ${headerBorder}`
                          : "none",
                      transition: "background 0.2s",
                    }}
                  >
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
                        background: accentGreenLight,
                        color: accentGreen,
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "4px 12px",
                        borderRadius: "20px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>↻</span> RESTART
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
                  "nginx",
                  "API Gateway",
                  "Redis",
                  "Background Worker",
                  "Web Server",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      background: isDark
                        ? "rgba(125,211,252,0.06)"
                        : "rgba(2,132,199,0.06)",
                      border: `1px solid ${isDark ? "rgba(125,211,252,0.15)" : "rgba(2,132,199,0.15)"}`,
                      borderRadius: "20px",
                      padding: "4px 14px",
                      fontSize: "12px",
                      color: accentBlue,
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
