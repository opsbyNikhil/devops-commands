import React, { useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../Themecontext";

// ----------------------------------------------
// 1. Syntax‑highlighting component for YAML lines (enhanced)
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

    const coloredValue =
      value === "" ? (
        ""
      ) : key === "matchLabels" ? (
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
        fontFamily: "'Space Mono','SF Mono','Menlo',monospace",
        fontSize: "11.5px",
        lineHeight: 1.7,
        whiteSpace: "pre",
      }}
    >
      {renderLine(line)}
    </div>
  );
};

// ----------------------------------------------
// 2. Helper: Section label with divider
// ----------------------------------------------
const SectionLabel = ({
  label,
  mono,
  color,
  divider,
}: {
  label: string;
  mono: string;
  color: string;
  divider: string;
}) => (
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

// ----------------------------------------------
// 3. Main component – Equality‑based Label Selector (refactored UI)
// ----------------------------------------------
const EqualityBasedSelector = () => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const yamlSnippet = `apiVersion: v1
kind: Deployment
metadata:
  name: myapp
spec:
  minReadySeconds: 5
  replicas: 5
  selector:
    matchLabels:
      app: zomato-dev`;

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme-aware colour palette (green/blue accent, matching label selector concept)
  const bg = isDark ? "#0f0a12" : "#f0fdf4";
  const cardBg = isDark ? "#150f18" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#0a0710" : "#f8fafc";
  const codeBorder = isDark ? "#33213a" : "#e2e8f0";

  const txt = isDark ? "#ffffff" : "#0f172a";
  const txtSec = isDark ? "rgba(220,180,200,0.7)" : "#475569";
  const txtMuted = isDark ? "rgba(249,168,212,0.4)" : "#64748b";

  // Primary accent = green (matchLabels), secondary = blue
  const green = isDark ? "#34d399" : "#059669";
  const greenAlpha = isDark ? "rgba(52,211,153,0.08)" : "rgba(5,150,105,0.06)";
  const greenBorder = isDark ? "rgba(52,211,153,0.28)" : "rgba(5,150,105,0.2)";

  const blue = isDark ? "#7dd3fc" : "#0284c7";
  const blueAlpha = isDark ? "rgba(125,211,252,0.07)" : "rgba(2,132,199,0.05)";
  const blueBorder = isDark ? "rgba(125,211,252,0.22)" : "rgba(2,132,199,0.15)";

  const purple = isDark ? "#c084fc" : "#9333ea";
  const purpleAlpha = isDark
    ? "rgba(192,132,252,0.07)"
    : "rgba(147,51,234,0.05)";
  const purpleBorder = isDark
    ? "rgba(192,132,252,0.22)"
    : "rgba(147,51,234,0.15)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1a0f1f 0%,#150f18 60%)"
    : "linear-gradient(135deg,#e0f2e9 0%,#ffffff 60%)";

  const mono = "'Space Mono','SF Mono','Menlo',monospace";
  const sans = "'Outfit','Inter',-apple-system,BlinkMacSystemFont,sans-serif";

  // Steps for equality‑based selector usage
  const steps = [
    {
      id: 1,
      title: "Define matchLabels",
      description:
        "In the Deployment spec, specify exact key:value pairs under selector.matchLabels.",
      cmd: "selector:\n  matchLabels:\n    app: zomato-dev",
      accentColor: green,
      accentBg: greenAlpha,
      accentBorder: greenBorder,
    },
    {
      id: 2,
      title: "Apply Deployment",
      description: "Create or update the Deployment with the label selector.",
      cmd: "kubectl apply -f deployment.yaml",
      accentColor: blue,
      accentBg: blueAlpha,
      accentBorder: blueBorder,
    },
    {
      id: 3,
      title: "Verify selected Pods",
      description:
        "The Deployment’s controller will match Pods with the exact label.",
      cmd: "kubectl get pods -l app=zomato-dev",
      accentColor: green,
      accentBg: greenAlpha,
      accentBorder: greenBorder,
    },
  ];

  // Data for selection matrix
  const scenarios = [
    { label: "app: zomato-dev", selected: true, note: "Exact match" },
    { label: "app: myapp", selected: false, note: "Different value" },
    {
      label: "app: zomato-dev, env: prod",
      selected: true,
      note: "Extra labels ignored",
    },
    { label: "No app label", selected: false, note: "Missing required label" },
  ];

  // Additional comparison: equality‑based vs set‑based
  const comparisons = [
    { feature: "Operator", equality: "= / == / !=", setBased: "in / notin" },
    {
      feature: "Multiple values",
      equality: "Single value per key",
      setBased: "Multiple values allowed",
    },
    {
      feature: "Negation",
      equality: "key != value",
      setBased: "key notin (values)",
    },
    { feature: "Complex logic", equality: "AND only", setBased: "AND / OR" },
  ];

  // Best for tags
  const bestFor = [
    "API routing",
    "Environment separation",
    "Stable release tracking",
    "Team ownership",
  ];

  // Helper
  const t = (darkVal: string, lightVal: string) =>
    isDark ? darkVal : lightVal;

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

        @keyframes pulse-glow {
          0%,100% { opacity:1; }
          50%      { opacity:0.35; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }

        .eq-pulse       { animation: pulse-glow 2s ease-in-out infinite; }
        .eq-arrow       { animation: arrow-fade 2s ease-in-out infinite; }
        .eq-copy:hover  { color:${green} !important; border-color:${greenBorder} !important; }
        .eq-step:hover  { background:${greenAlpha} !important; transform:translateX(2px); }
        .eq-row:hover   { background:${greenAlpha} !important; transform:translateX(3px); }
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
        {/* ── Header with gradient (matching annotation pattern) ── */}
        <div
          style={{
            background: headerGrad,
            padding: "30px 36px 26px",
            borderBottom: `1px solid ${divider}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              background: `radial-gradient(circle,${greenAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: "2px",
                    color: green,
                    textTransform: "uppercase",
                  }}
                >
                  Kubernetes · Label Selector
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1px",
                    color: blue,
                    background: blueAlpha,
                    border: `1px solid ${blueBorder}`,
                    borderRadius: 20,
                    padding: "2px 10px",
                  }}
                >
                  Equality‑based
                </span>
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
                Equality‑based{" "}
                <span style={{ color: green }}>Label Selector</span>
              </div>

              <div
                style={{
                  fontSize: 13.5,
                  color: txtSec,
                  marginTop: 12,
                  maxWidth: 500,
                  lineHeight: 1.6,
                }}
              >
                Matches resources where the label key equals the specified value{" "}
                <strong style={{ color: green, fontWeight: 500 }}>
                  exactly
                </strong>
                . Extra labels are ignored — simple, fast, and ideal for most
                use cases.
              </div>
            </div>

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
                className="eq-pulse"
                style={{ fontFamily: mono, fontSize: 12, color: green }}
              >
                ●
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: green,
                }}
              >
                MATCHLABELS DEMO
              </span>
            </div>
          </div>
        </div>

        {/* ── Two‑column body ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 560,
          }}
        >
          {/* LEFT COLUMN: YAML + Steps + Tags */}
          <div
            style={{
              borderRight: `1px solid ${divider}`,
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Tag group */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                {[
                  {
                    label: "matchLabels",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                  {
                    label: "exact matching",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "high performance",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 5,
                      background: tag.bg,
                      border: `1px solid ${tag.border}`,
                      color: tag.color,
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Steps timeline */}
              <div
                style={{
                  background: greenAlpha,
                  border: `1px solid ${greenBorder}`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1.8px",
                    textTransform: "uppercase",
                    color: green,
                    marginBottom: 12,
                  }}
                >
                  Setup Steps
                </div>

                {steps.map((step, idx) => (
                  <div key={step.id}>
                    <div
                      className="eq-step"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 8px",
                        borderRadius: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: step.accentBg,
                          border: `1.5px solid ${step.accentBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontFamily: mono,
                          fontWeight: 700,
                          fontSize: 12,
                          color: step.accentColor,
                        }}
                      >
                        {step.id}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 11,
                            color: step.accentColor,
                            marginBottom: 3,
                            fontWeight: 700,
                          }}
                        >
                          {step.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: txtSec,
                            lineHeight: 1.5,
                            marginBottom: 6,
                          }}
                        >
                          {step.description}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 10.5,
                            background: codeBg,
                            border: `1px solid ${codeBorder}`,
                            borderRadius: 6,
                            padding: "5px 10px",
                            color: step.accentColor,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ color: txtMuted }}>$</span>
                          <span style={{ color: step.accentColor }}>
                            {step.cmd.split("\n")[0].split(" ")[0] ||
                              step.cmd.split(" ")[0]}
                          </span>
                          <span style={{ color: txtSec }}>
                            {" " +
                              (step.cmd.includes("\n")
                                ? step.cmd
                                : step.cmd.slice(step.cmd.indexOf(" ") + 1))}
                          </span>
                        </div>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          padding: "2px 0 2px 22px",
                        }}
                      >
                        <span
                          className="eq-arrow"
                          style={{ color: green, fontSize: 14 }}
                        >
                          ↓
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Descriptive tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  {
                    label: "Exact key:value",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                  {
                    label: "No set operations",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Selector requirement",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 4,
                      background: tag.bg,
                      border: `1px solid ${tag.border}`,
                      color: tag.color,
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* YAML block with copy */}
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
                  deployment.yaml
                </span>
                <button
                  className="eq-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
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
                  {yamlSnippet.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Important note box */}
            <div
              style={{
                background: purpleAlpha,
                border: `1px solid ${purpleBorder}`,
                borderRadius: 10,
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 9,
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  color: purple,
                  marginBottom: 8,
                }}
              >
                Important Note
              </div>
              <p style={{ fontSize: 12.5, color: txtSec, lineHeight: 1.6 }}>
                Equality‑based selectors require the Pod to have{" "}
                <strong style={{ color: green, fontWeight: 500 }}>
                  all specified labels
                </strong>
                with exactly the same values. Labels not listed in the selector
                are ignored.
              </p>
            </div>

            {/* Quick kubectl bar */}
            <div
              style={{
                fontFamily: mono,
                fontSize: 10.5,
                padding: "10px 16px",
                borderRadius: 8,
                background: greenAlpha,
                border: `1px solid ${greenBorder}`,
                color: green,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl get pods -l app=zomato-dev</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl describe deployment myapp</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Flow diagram, Selection matrix, Comparison, Best for */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {/* Flow diagram */}
            <div>
              <SectionLabel
                label="Selection flow"
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
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {(
                    [
                      { icon: "📦", label: "Pod", accent: false },
                      { icon: "🏷️", label: "Check\nlabels", accent: true },
                      { icon: "🎯", label: "Exact\nmatch?", accent: false },
                    ] as const
                  ).map((step, idx, arr) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background: step.accent
                            ? greenAlpha
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${step.accent ? greenBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            marginBottom: 7,
                            color: step.accent ? green : "inherit",
                            opacity: step.accent ? 1 : 0.55,
                          }}
                        >
                          {step.icon}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 9.5,
                            lineHeight: 1.5,
                            color: step.accent ? green : txtSec,
                            whiteSpace: "pre",
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className="eq-arrow"
                          style={{
                            fontSize: 16,
                            color: green,
                            padding: "0 6px",
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
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: `1px solid ${divider}`,
                    fontFamily: mono,
                    fontSize: 10,
                    color: txtSec,
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: green }}>✓</span> Only Pods with{" "}
                  <strong style={{ color: green }}>app: zomato-dev</strong> are
                  selected.
                </div>
              </div>
            </div>

            {/* Selection matrix */}
            <div>
              <SectionLabel
                label="Selection matrix"
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
                    className="eq-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 20px",
                      borderBottom:
                        i !== scenarios.length - 1
                          ? `1px solid ${divider}`
                          : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 12,
                        color: txt,
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        background: s.selected ? greenAlpha : "transparent",
                        color: s.selected ? green : txtMuted,
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "4px 14px",
                        borderRadius: 24,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
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

            {/* Comparison: Equality vs Set-based */}
            <div>
              <SectionLabel
                label="Equality vs Set‑based"
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    background: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                    borderBottom: `1px solid ${divider}`,
                    padding: "10px 18px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: txtMuted,
                    }}
                  >
                    Feature
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: green,
                    }}
                  >
                    Equality‑based
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: blue,
                    }}
                  >
                    Set‑based
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="eq-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      padding: "10px 18px",
                      borderBottom:
                        i !== comparisons.length - 1
                          ? `1px solid ${divider}`
                          : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{ fontFamily: mono, fontSize: 10, color: txt }}
                    >
                      {item.feature}
                    </span>
                    <span style={{ fontSize: 11.5, color: green }}>
                      {item.equality}
                    </span>
                    <span style={{ fontSize: 11.5, color: blue }}>
                      {item.setBased}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best for tags */}
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
                      fontFamily: mono,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 4,
                      background: blueAlpha,
                      border: `1px solid ${blueBorder}`,
                      color: blue,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Best practice tip */}
            <div>
              <SectionLabel
                label="Best practice"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />
              <div
                style={{
                  background: greenAlpha,
                  border: `1px solid ${greenBorder}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: green,
                    marginBottom: 8,
                  }}
                >
                  Keep selectors simple
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  Prefer equality‑based selectors for most scenarios. They are
                  fast, easy to understand, and sufficient for environment
                  separation, routing, and team ownership. Use set‑based only
                  when you need complex logic (e.g.,{" "}
                  <strong style={{ color: blue }}>in</strong> or{" "}
                  <strong style={{ color: blue }}>notin</strong>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EqualityBasedSelector;
