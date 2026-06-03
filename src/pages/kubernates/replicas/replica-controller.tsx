import { useState } from "react";
import { useTheme } from "../../../Themecontext";

const yaml = `apiVersion: v1
kind: ReplicationController
metadata:
  name: pod-rpc
spec:
  minReadySeconds: 5
  replicas: 5
  selector:
    app: dev
  template:
    metadata: 
      name: my-rpc
      labels:
        app: dev
    spec:
      containers:
        - name: my-cont-rpc
          image: nginx
          ports:
            - containerPort: 80`;

function YamlLine({ line, isDark }: { line: string; isDark: boolean }) {
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
      ) : key === "kind" && value === "ReplicationController" ? (
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

const limitations = [
  { icon: "❌", text: "Only supports equality-based selectors (matchLabels)" },
  {
    icon: "❌",
    text: "Does NOT support set-based selectors (matchExpressions)",
  },
  { icon: "❌", text: "Not used with modern Deployments" },
  { icon: "❌", text: "No built-in support for rolling updates or rollbacks" },
];

const comparisons = [
  {
    feature: "Selector Support",
    rc: "Equality-based only",
    rs: "Equality + Set-based",
  },
  { feature: "Rolling Updates", rc: "Not supported", rs: "Supported" },
  { feature: "Rollbacks", rc: "Not supported", rs: "Supported" },
  {
    feature: "Modern Deployments",
    rc: "Not compatible",
    rs: "Fully compatible",
  },
];

export default function ReplicaController() {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bgColor = isDark ? "#0f0f13" : "#f8fafc";
  const cardBg = isDark ? "#0a0a0f" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const headerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#8b8b9e" : "#475569";
  const textMuted = isDark ? "#6b7280" : "#64748b";
  const codeBg = isDark ? "#0d0d12" : "#f8fafc";
  const codeBorder = isDark ? "#1e1e28" : "#e2e8f0";
  const tagBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const tagBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accentRed = isDark ? "#f87171" : "#dc2626";
  const accentRedLight = isDark
    ? "rgba(248,113,113,0.08)"
    : "rgba(220,38,38,0.06)";
  const accentRedBorder = isDark
    ? "rgba(248,113,113,0.2)"
    : "rgba(220,38,38,0.15)";
  const accentBlue = isDark ? "#7dd3fc" : "#0284c7";
  const accentYellow = isDark ? "#fbbf24" : "#d97706";
  const accentGreen = isDark ? "#34d399" : "#059669";
  const accentGreenLight = isDark
    ? "rgba(52,211,153,0.08)"
    : "rgba(5,150,105,0.06)";


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
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes warningPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .flow-arrow { animation: fadePulse 2s ease-in-out infinite; }
        .warning-icon { animation: warningPulse 2s ease-in-out infinite; }
        .copy-btn-rc:hover {
          background: ${accentRedLight} !important;
          border-color: ${accentRed} !important;
        }
        .comparison-row:hover {
          background: ${accentRedLight} !important;
          transform: translateX(3px);
        }
        .limitation-item:hover {
          background: ${isDark ? "rgba(248,113,113,0.05)" : "rgba(220,38,38,0.03)"};
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: accentRed,
                    textTransform: "uppercase",
                  }}
                >
                  Legacy Controller
                </span>
                <span
                  style={{
                    background: accentRedLight,
                    border: `1px solid ${accentRedBorder}`,
                    borderRadius: "20px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: accentRed,
                  }}
                >
                  Deprecated
                </span>
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
                ReplicationController
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: textSecondary,
                  marginTop: "10px",
                  maxWidth: "520px",
                  lineHeight: 1.5,
                }}
              >
                The older way of managing Pods —{" "}
                <strong style={{ color: accentRed, fontWeight: 500 }}>
                  mostly deprecated
                </strong>{" "}
                and replaced by ReplicaSets. Does not support rolling updates or
                set-based selectors.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                background: accentRedLight,
                padding: "6px 16px",
                borderRadius: "40px",
                border: `1px solid ${accentRedBorder}`,
              }}
            >
              <span
                className="warning-icon"
                style={{ fontSize: "14px", color: accentRed }}
              >
                ⚠️
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: textSecondary,
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                }}
              >
                LEGACY — AVOID
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            minHeight: "540px",
          }}
        >
          {/* LEFT COLUMN: Spec + YAML */}
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
                    background: isDark
                      ? "rgba(125,211,252,0.12)"
                      : "rgba(2,132,199,0.06)",
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
                    background: isDark
                      ? "rgba(248,113,113,0.12)"
                      : "rgba(220,38,38,0.06)",
                    color: accentRed,
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontFamily: "'SF Mono', monospace",
                  }}
                >
                  ReplicationController
                </span>
              </div>

              {/* Key Points */}
              <div
                style={{
                  background: isDark
                    ? "rgba(248,113,113,0.05)"
                    : "rgba(220,38,38,0.03)",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "20px",
                  border: `1px solid ${accentRedBorder}`,
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: accentRed,
                    marginBottom: "12px",
                    letterSpacing: "0.3px",
                  }}
                >
                  🔴 Key Limitations
                </div>
                {limitations.map((lim, i) => (
                  <div
                    key={i}
                    className="limitation-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6px 0",
                      transition: "all 0.2s",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>{lim.icon}</span>
                    <span style={{ fontSize: "12px", color: textSecondary }}>
                      {lim.text}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: textSecondary,
                  marginBottom: "20px",
                }}
              >
                ReplicationController ensures that the specified number of Pod
                replicas are running at all times. However, it lacks many
                features available in modern ReplicaSets and Deployments.
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
                  { label: "Equality selectors only", color: accentRed },
                  { label: "No rolling updates", color: accentYellow },
                  { label: "Legacy controller", color: accentBlue },
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

            {/* YAML Card */}
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
                  Example — replicationcontroller.yaml
                </span>
                <button
                  className="copy-btn-rc"
                  onClick={handleCopy}
                  style={{
                    background: "transparent",
                    border: `1px solid ${isDark ? "#2a2a35" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    color: copied ? accentRed : textMuted,
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

            {/* Note about Pod order */}
            <div
              style={{
                background: isDark
                  ? "rgba(251,191,36,0.08)"
                  : "rgba(217,119,6,0.04)",
                border: `1px solid ${isDark ? "rgba(251,191,36,0.2)" : "rgba(217,119,6,0.15)"}`,
                borderRadius: "14px",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "14px" }}>📌</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: accentYellow,
                  }}
                >
                  Important Note
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: textSecondary,
                  lineHeight: 1.5,
                }}
              >
                Kubernetes does <strong>not guarantee</strong> the order of Pod
                creation or deletion. When scaling to 6 replicas, Pod names and
                deletion order are non-deterministic.
              </p>
            </div>

            {/* kubectl hint */}
            <div
              style={{
                background: accentRedLight,
                border: `1px solid ${accentRedBorder}`,
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
                  color: accentRed,
                  background: "transparent",
                  fontFamily: "'SF Mono', monospace",
                  fontWeight: 450,
                }}
              >
                kubectl get rc &nbsp;&nbsp; kubectl scale rc pod-rpc
                --replicas=3
              </code>
            </div>
          </div>

          {/* RIGHT COLUMN: Visual + Comparison */}
          <div
            style={{
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Visual Flow Diagram */}
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
                How It Works
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
                  {[
                    "RC Created",
                    "5 Replicas",
                    "Pod Management",
                    "No Rolling Updates",
                  ].map((step, idx) => (
                    <div key={step} style={{ flex: 1, textAlign: "center" }}>
                      <div
                        style={{
                          background: idx === 1 ? accentGreenLight : tagBg,
                          border:
                            idx === 1
                              ? `1px solid rgba(52,211,153,0.2)`
                              : `1px solid ${tagBorder}`,
                          borderRadius: "16px",
                          padding: "14px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "26px",
                            marginBottom: "8px",
                            opacity: idx === 1 ? 1 : 0.6,
                          }}
                        >
                          {idx === 0
                            ? "🎯"
                            : idx === 1
                              ? "5"
                              : idx === 2
                                ? "📦"
                                : "❌"}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 450,
                            color: idx === 1 ? accentGreen : textSecondary,
                          }}
                        >
                          {step}
                        </div>
                      </div>
                      {idx < 3 && (
                        <div
                          className="flow-arrow"
                          style={{
                            fontSize: "20px",
                            color: accentRed,
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
                  <span style={{ color: accentRed }}>⚠️</span> Maintains replica
                  count but lacks update strategies
                </div>
              </div>
            </div>

            {/* RC vs ReplicaSet Comparison */}
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
                RC vs ReplicaSet
              </div>
              <div
                style={{
                  background: codeBg,
                  borderRadius: "16px",
                  border: `1px solid ${codeBorder}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    background: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                    borderBottom: `1px solid ${headerBorder}`,
                    padding: "12px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: textPrimary,
                    }}
                  >
                    Feature
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: accentRed,
                    }}
                  >
                    ReplicationController
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: accentGreen,
                    }}
                  >
                    ReplicaSet
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="comparison-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      padding: "10px 16px",
                      borderBottom:
                        i !== comparisons.length - 1
                          ? `1px solid ${headerBorder}`
                          : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: textPrimary }}>
                      {item.feature}
                    </span>
                    <span style={{ fontSize: "12px", color: accentRed }}>
                      {item.rc}
                    </span>
                    <span style={{ fontSize: "12px", color: accentGreen }}>
                      {item.rs}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Practices / Migration Note */}
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
                Migration Path
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background: isDark
                      ? "rgba(52,211,153,0.06)"
                      : "rgba(5,150,105,0.04)",
                    border: `1px solid ${isDark ? "rgba(52,211,153,0.15)" : "rgba(5,150,105,0.1)"}`,
                    borderRadius: "14px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>🔄</span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: accentGreen,
                      }}
                    >
                      Recommended: Use ReplicaSet or Deployment
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: textSecondary,
                      lineHeight: 1.5,
                    }}
                  >
                    Modern workloads should use <strong>Deployments</strong>{" "}
                    which manage ReplicaSets and provide rolling updates,
                    rollbacks, and better selector support.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  {[
                    "kubectl rolling-update",
                    "Equality Selectors",
                    "Deprecated API",
                  ].map((item) => (
                    <span
                      key={item}
                      style={{
                        background: isDark
                          ? "rgba(248,113,113,0.06)"
                          : "rgba(220,38,38,0.04)",
                        border: `1px solid ${isDark ? "rgba(248,113,113,0.12)" : "rgba(220,38,38,0.1)"}`,
                        borderRadius: "24px",
                        padding: "4px 14px",
                        fontSize: "11px",
                        color: accentRed,
                        fontWeight: 450,
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
    </div>
  );
}
