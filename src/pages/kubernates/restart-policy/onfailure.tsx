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
  const keyColor = isDark ? "#93c5fd" : "#0369a1";
  const valueColor = isDark ? "#fcd34d" : "#b45309";
  const numberColor = isDark ? "#fb923c" : "#c2410c";
  const stringColor = isDark ? "#f0abfc" : "#a21caf";
  const highlightColor = isDark ? "#fb923c" : "#c2410c";

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent = text.length - trimmed.length;
    const spaces = "\u00a0".repeat(indent);

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
        <span style={{ color: highlightColor, fontWeight: 600 }}>{value}</span>
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
        fontFamily: "'SF Mono', 'Menlo', 'JetBrains Mono', monospace",
        fontSize: "12px",
        lineHeight: "1.65",
        whiteSpace: "pre",
        fontFeatureSettings: "'calt' off",
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
  label: string;
};

const scenarios: Scenario[] = [
  { exit: "Exit 0", code: "Success", restarts: false, label: "NO RESTART" },
  { exit: "Exit 1", code: "Failure", restarts: true, label: "RESTART" },
  { exit: "Exit 2", code: "Misuse", restarts: true, label: "RESTART" },
  { exit: "Exit 137", code: "OOM Kill", restarts: true, label: "RESTART" },
];

export default function OnFailure() {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bgColor = isDark ? "#0f0a00" : "#fef9e8";
  const cardBg = isDark ? "#0a0800" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const headerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#ffffff" : "#1c1917";
  const textSecondary = isDark ? "#a37a50" : "#78350f";
  const textMuted = isDark ? "#6b5a3e" : "#b45309";
  const codeBg = isDark ? "#0a0800" : "#fef9e8";
  const codeBorder = isDark ? "#2a1f0a" : "#fde68a";
  const tagBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const tagBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accentOrange = isDark ? "#fb923c" : "#c2410c";
  const accentOrangeLight = isDark ? "rgba(251,146,60,0.08)" : "rgba(194,65,12,0.06)";
  const accentOrangeBorder = isDark ? "rgba(251,146,60,0.2)" : "rgba(194,65,12,0.15)";
  const accentBlue = isDark ? "#93c5fd" : "#0369a1";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <style>{`
        @keyframes warningFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .warn-icon { animation: warningFlash 2.5s ease-in-out infinite; }
        .flow-arrow { animation: fadePulse 2s ease-in-out infinite; }
        .copy-btn-of:hover {
          background: ${accentOrangeLight} !important;
          border-color: ${accentOrange} !important;
        }
        .scenario-row:hover {
          background: ${accentOrangeLight} !important;
          transform: translateX(3px);
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          background: cardBg,
          borderRadius: "32px",
          border: `1px solid ${cardBorder}`,
          overflow: "hidden",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "32px 36px 24px 36px",
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
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.6px",
                  color: accentOrange,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                restartPolicy
              </div>
              <div
                style={{
                  fontSize: "38px",
                  fontWeight: 600,
                  color: textPrimary,
                  letterSpacing: "-0.02em",
                  fontFamily: "'Inter', -apple-system, sans-serif",
                }}
              >
                OnFailure
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: textSecondary,
                  marginTop: "10px",
                  maxWidth: "480px",
                  lineHeight: 1.5,
                }}
>
                  Container restarts <strong style={{ color: accentOrange, fontWeight: 500 }}>only on non-zero exit codes</strong>.
                  Successful completions (exit 0) are not restarted.
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  background: accentOrangeLight,
                  padding: "6px 16px",
                  borderRadius: "40px",
                  border: `1px solid ${accentOrangeBorder}`,
                }}
              >
                <span className="warn-icon" style={{ fontSize: "12px", color: accentOrange }}>⚠</span>
                <span style={{ fontSize: "12px", color: textSecondary, fontWeight: 500, letterSpacing: "0.3px" }}>FAIL ONLY</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0",
              minHeight: "520px",
            }}
          >
            <div
              style={{
                borderRight: `1px solid ${headerBorder}`,
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "28px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      background: isDark ? "rgba(147,197,253,0.12)" : "rgba(3,105,161,0.06)",
                      color: accentBlue,
                      fontSize: "11px",
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    v1
                  </span>
                  <span
                    style={{
                      background: isDark ? "rgba(251,146,60,0.12)" : "rgba(194,65,12,0.06)",
                      color: accentOrange,
                      fontSize: "11px",
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    spec/restartPolicy
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: textSecondary,
                    marginBottom: "20px",
                  }}
                >
                  Defines pod restart behavior based on exit codes. <strong style={{ fontWeight: 500 }}>OnFailure</strong> ensures
                  containers restart only when they exit with a non-zero code.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "8px",
                  }}
                >
                  {[
                    { label: "Conditional", color: accentOrange },
                    { label: "Batch ready", color: isDark ? "#fcd34d" : "#b45309" },
                    { label: "Job friendly", color: accentBlue },
                  ].map((tag) => (
                    <span
                      key={tag.label}
                      style={{
                        background: tagBg,
                        border: `1px solid ${tagBorder}`,
                        borderRadius: "24px",
                        padding: "4px 14px",
                        fontSize: "11px",
                        fontWeight: 450,
                        color: tag.color,
                      }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: textMuted,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Example — onfailure.yaml
                  </span>
                  <button
                    className="copy-btn-of"
                    onClick={handleCopy}
                    style={{
                      background: "transparent",
                      border: `1px solid ${isDark ? "#2a1f0a" : "#fde68a"}`,
                      borderRadius: "8px",
                      color: copied ? accentOrange : textMuted,
                      fontSize: "11px",
                      padding: "5px 14px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 450,
                    }}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div
                  style={{
                    background: codeBg,
                    borderRadius: "20px",
                    border: `1px solid ${codeBorder}`,
                    overflow: "auto",
                  }}
                >
                  <div style={{ padding: "20px 24px" }}>
                    {yaml.split("\n").map((line, i) => (
                      <YamlLine key={i} line={line} isDark={isDark} />
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: accentOrangeLight,
                  border: `1px solid ${accentOrangeBorder}`,
                  borderRadius: "14px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "15px" }}>💰</span>
                <code
                  style={{
                    fontSize: "12px",
                    color: accentOrange,
                    background: "transparent",
                    fontFamily: "'SF Mono', monospace",
                    fontWeight: 450,
                  }}
                >
                  kubectl apply -f onfailure.yaml
                </code>
              </div>
            </div>

            <div
              style={{
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: textMuted,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "18px",
                  }}
                >
                  Behavior
                </div>
                <div
                  style={{
                    background: codeBg,
                    borderRadius: "20px",
                    border: `1px solid ${codeBorder}`,
                    padding: "24px",
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
                    {["Container Running", "Exit Code 0", "Exit Code ≠ 0"].map((step, idx) => (
                      <div key={step} style={{ flex: 1, textAlign: "center" }}>
                        <div
                          style={{
                            background: idx === 2 ? accentOrangeLight : tagBg,
                            border: idx === 2 ? `1px solid ${accentOrangeBorder}` : `1px solid ${tagBorder}`,
                            borderRadius: "16px",
                            padding: "14px 8px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "26px",
                              marginBottom: "8px",
                              opacity: idx === 2 ? 1 : 0.6,
                            }}
                          >
                            {idx === 0 ? "🟢" : idx === 1 ? "✅" : "⚠️"}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 450,
                              color: idx === 2 ? accentOrange : textSecondary,
                            }}
                          >
                            {step}
                          </div>
                        </div>
                        {idx < 2 && (
                          <div
                            className="flow-arrow"
                            style={{
                              fontSize: "20px",
                              color: accentOrange,
                              margin: "10px 0",
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
                      marginTop: "22px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: textSecondary,
                      borderTop: `1px solid ${headerBorder}`,
                      paddingTop: "16px",
                    }}
                  >
                    <span style={{ color: accentOrange }}>⚠</span> Restart triggered on Exit 1, 2, 137<br />
                    <span style={{ color: "#6b7280" }}>✗</span> No restart on Exit 0 (Success)
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
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
                      onMouseEnter={() => setHighlighted(i)}
                      onMouseLeave={() => setHighlighted(null)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 20px",
                        borderBottom: i !== scenarios.length - 1 ? `1px solid ${headerBorder}` : "none",
                        transition: "all 0.2s",
                        background: highlighted === i ? accentOrangeLight : "transparent",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: "'SF Mono', monospace",
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
                          background: s.restarts ? accentOrangeLight : isDark ? "rgba(100,100,100,0.1)" : "rgba(0,0,0,0.04)",
                          color: s.restarts ? accentOrange : textMuted,
                          fontSize: "11px",
                          fontWeight: 500,
                          padding: "4px 14px",
                          borderRadius: "24px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {s.restarts ? "↻ RESTART" : "✓ NO RESTART"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: textMuted,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "14px",
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
                  {["Batch Jobs", "Data Pipeline", "ETL", "Migrations", "Cron Jobs"].map(
                    (item) => (
                      <span
                        key={item}
                        style={{
                          background: isDark ? "rgba(251,146,60,0.06)" : "rgba(194,65,12,0.04)",
                          border: `1px solid ${isDark ? "rgba(251,146,60,0.12)" : "rgba(194,65,12,0.1)"}`,
                          borderRadius: "24px",
                          padding: "5px 16px",
                          fontSize: "12px",
                          color: accentOrange,
                          fontWeight: 450,
                        }}
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}