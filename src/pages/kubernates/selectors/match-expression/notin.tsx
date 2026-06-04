// NotInSelector.tsx
import React, { useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../Themecontext";

// ----------------------------------------------
// Syntax-highlighting component (reused)
// ----------------------------------------------
const YamlLine = ({ line, isDark }: { line: string; isDark: boolean }) => {
  const colors = {
    key: isDark ? "#7dd3fc" : "#0369a1",
    value: isDark ? "#86efac" : "#15803d",
    number: isDark ? "#fbbf24" : "#b45309",
    string: isDark ? "#f9a8d4" : "#be185d",
    comment: isDark ? "#6b7280" : "#4b5563",
    highlight: isDark ? "#34d399" : "#059669",
  };

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent = text.length - trimmed.length;
    const spaces = "\u00a0".repeat(indent);

    if (trimmed.startsWith("#"))
      return <span style={{ color: colors.comment }}>{text}</span>;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) {
      if (trimmed.startsWith("- ")) {
        const rest = trimmed.slice(2);
        return (
          <>
            {spaces}
            <span style={{ color: colors.key }}>- </span>
            <span style={{ color: colors.value }}>{rest}</span>
          </>
        );
      }
      return <span style={{ color: colors.value }}>{text}</span>;
    }

    const key = trimmed.slice(0, colonIdx);
    const value = trimmed.slice(colonIdx + 1).trim();

    if (key.startsWith("- ")) {
      const realKey = key.slice(2);
      const coloredValue =
        value === "" ? (
          ""
        ) : /^\d+$/.test(value) ? (
          <span style={{ color: colors.number }}>{value}</span>
        ) : (
          <span style={{ color: colors.string }}>{value}</span>
        );
      return (
        <>
          {spaces}
          <span style={{ color: colors.key }}>- {realKey}</span>:
          {value !== "" && <> {coloredValue}</>}
        </>
      );
    }

    const isOperator = key === "operator";
    const coloredValue =
      value === "" ? (
        ""
      ) : isOperator ? (
        <span style={{ color: colors.highlight, fontWeight: 600 }}>
          {value}
        </span>
      ) : /^\d+$/.test(value) ? (
        <span style={{ color: colors.number }}>{value}</span>
      ) : (
        <span style={{ color: colors.string }}>{value}</span>
      );

    return (
      <>
        {spaces}
        <span style={{ color: colors.key }}>{key}</span>:
        {value !== "" && <> {coloredValue}</>}
      </>
    );
  };

  return (
    <div
      style={{
        fontFamily: "'SF Mono', 'Menlo', 'JetBrains Mono', monospace",
        fontSize: "12px",
        lineHeight: 1.65,
        whiteSpace: "pre",
      }}
    >
      {renderLine(line)}
    </div>
  );
};

// ----------------------------------------------
// Main component – NotIn operator
// ----------------------------------------------
const NotInSelector = () => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  // Exact YAML as you provided
  const yamlSnippet = `apiVersion: v1
kind: Deployment
metadata:
  name: myapp
spec:
  minReadySeconds: 5
  replicas: 5
  selector:
    matchExpressions:
      - key: app
        operator: NotIn
        values:
          - zomato
          - uber`;

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme colours – using red/pink for "NotIn" to differentiate from "In"
  const bgColor = isDark ? "#0f0f13" : "#f8fafc";
  const cardBg = isDark ? "#0a0a0f" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#ffffff" : "#0f172a";
  const textSecondary = isDark ? "#8b8b9e" : "#475569";
  const textMuted = isDark ? "#6b7280" : "#64748b";
  const codeBg = isDark ? "#0d0d12" : "#f8fafc";
  const codeBorder = isDark ? "#1e1e28" : "#e2e8f0";
  const tagBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const tagBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const accentRed = isDark ? "#f87171" : "#dc2626"; // red for negation
  const accentRedLight = isDark
    ? "rgba(248,113,113,0.08)"
    : "rgba(220,38,38,0.06)";
  const accentRedBorder = isDark
    ? "rgba(248,113,113,0.2)"
    : "rgba(220,38,38,0.15)";
  const accentBlue = isDark ? "#7dd3fc" : "#0284c7";

  // Matrix: which label values are selected (opposite of In)
  const scenarios = [
    {
      label: "app: zomato",
      selected: false,
      note: "In excluded set → rejected",
    },
    { label: "app: uber", selected: false, note: "In excluded set → rejected" },
    { label: "app: zomato-dev", selected: true, note: "Not in set → selected" },
    { label: "app: lyft", selected: true, note: "Not in set → selected" },
    {
      label: "No app label",
      selected: true,
      note: "Missing label → selected (not in set)",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: "all 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .flow-arrow { animation: fadePulse 2s ease-in-out infinite; }
        .copy-btn:hover {
          background: ${accentRedLight} !important;
          border-color: ${accentRed} !important;
        }
        .scenario-row:hover {
          background: ${accentRedLight} !important;
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
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 36px 24px 36px",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.6px",
              color: accentRed,
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Set‑based Selector (Negation)
          </div>
          <div
            style={{
              fontSize: "38px",
              fontWeight: 600,
              color: textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            NotIn Operator
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
            Selects resources where the label value is{" "}
            <strong style={{ color: accentRed }}>
              not any of the listed values
            </strong>
            . This is the set‑based opposite of <code>In</code>.
          </div>
        </div>

        {/* Two‑column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            minHeight: "520px",
          }}
        >
          {/* LEFT: description + YAML */}
          <div
            style={{
              borderRight: `1px solid ${borderColor}`,
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            <div>
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "18px" }}
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
                    fontFamily: "monospace",
                  }}
                >
                  matchExpressions
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
                    fontFamily: "monospace",
                  }}
                >
                  operator: NotIn
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: textSecondary,
                }}
              >
                The <code>NotIn</code> operator matches if the label value is{" "}
                <strong>not equal</strong> to any of the specified values. This
                includes labels with different values, as well as missing
                labels.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                {["Negative set", "Exclusion", "Flexible negation"].map(
                  (tag) => (
                    <span
                      key={tag}
                      style={{
                        background: tagBg,
                        border: `1px solid ${tagBorder}`,
                        borderRadius: "24px",
                        padding: "4px 14px",
                        fontSize: "11px",
                        color: accentBlue,
                      }}
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* YAML block */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: textMuted,
                    textTransform: "uppercase",
                  }}
                >
                  Example — notin-selector.yaml
                </span>
                <button
                  className="copy-btn"
                  onClick={handleCopy}
                  style={{
                    background: "transparent",
                    border: `1px solid ${isDark ? "#2a2a35" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    color: copied ? accentRed : textMuted,
                    fontSize: "11px",
                    padding: "5px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? <CheckOutlined /> : <CopyOutlined />}
                  {copied ? "Copied" : "Copy"}
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
                  {yamlSnippet.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick kubectl command */}
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
              <span>⚡</span>
              <code
                style={{
                  fontSize: "12px",
                  color: accentRed,
                  fontFamily: "monospace",
                }}
              >
                kubectl get pods -l 'app notin (zomato, uber)'
              </code>
            </div>
          </div>

          {/* RIGHT: flow diagram + matrix + best for */}
          <div
            style={{
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Selection flow */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: textMuted,
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Exclusion flow
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
                    { title: "Pod Labels", icon: "🏷️" },
                    { title: "Check NotIn", icon: "🔍" },
                    { title: "Not in set?", icon: "🚫" },
                  ].map((step, idx) => (
                    <div
                      key={step.title}
                      style={{ flex: 1, textAlign: "center" }}
                    >
                      <div
                        style={{
                          background: idx === 2 ? accentRedLight : tagBg,
                          border:
                            idx === 2
                              ? `1px solid ${accentRedBorder}`
                              : `1px solid ${tagBorder}`,
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
                          {step.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 450,
                            color: idx === 2 ? accentRed : textSecondary,
                          }}
                        >
                          {step.title}
                        </div>
                      </div>
                      {idx < 2 && (
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
                    borderTop: `1px solid ${borderColor}`,
                    paddingTop: "16px",
                  }}
                >
                  <span style={{ color: accentRed }}>✓</span> Pods where{" "}
                  <code>app</code> is <strong>neither</strong>{" "}
                  <code>zomato</code> nor <code>uber</code> are selected
                </div>
              </div>
            </div>

            {/* Selection matrix */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: textMuted,
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Selection matrix
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
                      padding: "12px 20px",
                      borderBottom:
                        i !== scenarios.length - 1
                          ? `1px solid ${borderColor}`
                          : "none",
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: textPrimary,
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        background: s.selected ? accentRedLight : "transparent",
                        color: s.selected ? accentRed : textMuted,
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "4px 14px",
                        borderRadius: "24px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {s.selected ? "✓ SELECTED" : "✗ REJECTED"}
                      {s.note && (
                        <span style={{ opacity: 0.6, fontWeight: 400 }}>
                          ({s.note})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best for */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: textMuted,
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Best for
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "Excluding blacklisted apps",
                  "Ignore temporary versions",
                  "Security exclusions",
                  "Canary avoidance",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      background: isDark
                        ? "rgba(125,211,252,0.06)"
                        : "rgba(2,132,199,0.04)",
                      border: `1px solid ${isDark ? "rgba(125,211,252,0.12)" : "rgba(2,132,199,0.1)"}`,
                      borderRadius: "24px",
                      padding: "5px 16px",
                      fontSize: "12px",
                      color: accentBlue,
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
};

export default NotInSelector;
