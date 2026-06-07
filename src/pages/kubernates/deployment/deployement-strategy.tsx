import React, { useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme } from "../../../Themecontext";

// ----------------------------------------------
// Syntax-highlighting component (enhanced for deployment keys)
// ----------------------------------------------
const YamlLine = ({ line, isDark }: { line: string; isDark: boolean }) => {
  const colors = {
    key: isDark ? "#7dd3fc" : "#0369a1",
    value: isDark ? "#86efac" : "#15803d",
    number: isDark ? "#fbbf24" : "#b45309",
    string: isDark ? "#f9a8d4" : "#be185d",
    comment: isDark ? "#6b7280" : "#4b5563",
    highlight: isDark ? "#38bdf8" : "#0284c7", // blue for strategy keys
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

    // Highlight deployment strategy related keys
    const isStrategyKey =
      key === "strategy" ||
      key === "rollingUpdate" ||
      key === "maxSurge" ||
      key === "maxUnavailable" ||
      key === "minReadySeconds";
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
        <span
          style={{
            color: isStrategyKey ? colors.highlight : colors.key,
          }}
        >
          {key}
        </span>
        :{value !== "" && <> {coloredValue}</>}
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
// Helper: Section label with divider
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
// Main component – Deployment Strategy (RollingUpdate)
// ----------------------------------------------
const DeploymentStrategy = () => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  // YAML snippet focusing on strategy and relevant parts
  const yamlSnippet = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-dep
spec:
  minReadySeconds: 5
  replicas: 5
  selector:
    matchLabels:
      app: red-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: red-app
    spec:
      containers:
      - name: red-con
        image: opsbynikhil/redpage:REDPAGE`;

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme‑aware colour palette (blue/cyan for RollingUpdate)
  const bg = isDark ? "#0f0a12" : "#f0f9ff";
  const cardBg = isDark ? "#150f18" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#0a0710" : "#f8fafc";
  const codeBorder = isDark ? "#33213a" : "#e2e8f0";

  const txt = isDark ? "#ffffff" : "#0f172a";
  const txtSec = isDark ? "rgba(220,180,200,0.7)" : "#475569";
  const txtMuted = isDark ? "rgba(249,168,212,0.4)" : "#64748b";

  // Primary accent = blue (RollingUpdate), secondary = green
  const blue = isDark ? "#38bdf8" : "#0284c7";
  const blueAlpha = isDark ? "rgba(56,189,248,0.08)" : "rgba(2,132,199,0.06)";
  const blueBorder = isDark ? "rgba(56,189,248,0.28)" : "rgba(2,132,199,0.2)";

  const green = isDark ? "#34d399" : "#059669";
  const greenAlpha = isDark ? "rgba(52,211,153,0.07)" : "rgba(5,150,105,0.05)";
  const greenBorder = isDark ? "rgba(52,211,153,0.22)" : "rgba(5,150,105,0.15)";

  const orange = isDark ? "#fbbf24" : "#d97706";
  const orangeAlpha = isDark ? "rgba(251,191,36,0.07)" : "rgba(217,119,6,0.05)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1a0f1f 0%,#150f18 60%)"
    : "linear-gradient(135deg,#e0f2fe 0%,#ffffff 60%)";

  const mono = "'Space Mono','SF Mono','Menlo',monospace";
  const sans = "'Outfit','Inter',-apple-system,BlinkMacSystemFont,sans-serif";

  // Steps for using RollingUpdate strategy
  const steps = [
    {
      id: 1,
      title: "Define strategy in Deployment",
      description:
        "Specify `strategy.type: RollingUpdate` and tune `maxSurge`/`maxUnavailable`.",
      cmd: "strategy:\n  type: RollingUpdate\n  rollingUpdate:\n    maxSurge: 1\n    maxUnavailable: 1",
      accentColor: blue,
      accentBg: blueAlpha,
      accentBorder: blueBorder,
    },
    {
      id: 2,
      title: "Apply the Deployment",
      description:
        "Kubernetes will create the Deployment with 5 replicas (all red-app).",
      cmd: "kubectl apply -f deployment.yaml",
      accentColor: green,
      accentBg: greenAlpha,
      accentBorder: greenBorder,
    },
    {
      id: 3,
      title: "Trigger a rolling update",
      description:
        "Change the container image (e.g., REDPAGE → NEWPAGE) and re-apply.",
      cmd: "kubectl set image deployment/pod-dep red-con=opsbynikhil/redpage:NEWPAGE",
      accentColor: blue,
      accentBg: blueAlpha,
      accentBorder: blueBorder,
    },
    {
      id: 4,
      title: "Watch the rollout",
      description:
        "Pods are replaced gradually – old pods terminate as new ones become ready.",
      cmd: "kubectl rollout status deployment/pod-dep",
      accentColor: orange,
      accentBg: orangeAlpha,
      accentBorder: "rgba(251,191,36,0.22)",
    },
  ];

  // Rolling update behavior scenarios (matrix)
  const scenarios = [
    {
      label: "maxSurge=1, maxUnavailable=1",
      behavior:
        "At most 1 extra pod above desired count, at most 1 unavailable during update",
    },
    {
      label: "maxSurge=25%, maxUnavailable=25% (5 replicas)",
      behavior: "1 extra pod, 1 unavailable (rounded up)",
    },
    {
      label: "maxSurge=0, maxUnavailable=1",
      behavior: "No extra capacity, 1 pod at a time (slower, minimal resource)",
    },
    {
      label: "maxSurge=1, maxUnavailable=0",
      behavior: "New pod created first, old pod terminated after new ready",
    },
  ];

  // Comparison: RollingUpdate vs Recreate
  const comparisons = [
    {
      feature: "Zero downtime",
      rollingUpdate: "Yes (gradual replacement)",
      recreate: "No (all pods terminated first)",
    },
    {
      feature: "Resource usage",
      rollingUpdate: "Extra capacity (maxSurge)",
      recreate: "No extra pods, but complete outage",
    },
    {
      feature: "Rollback speed",
      rollingUpdate: "Fast (gradual)",
      recreate: "Full rebuild (slower)",
    },
    {
      feature: "Best for",
      rollingUpdate: "Web apps, APIs",
      recreate: "Batch jobs, stateful with breaking changes",
    },
  ];

  // Best for tags
  const bestFor = [
    "Zero‑downtime deployments",
    "Web applications",
    "Microservices",
    "High‑availability systems",
  ];

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

        .strat-pulse       { animation: pulse-glow 2s ease-in-out infinite; }
        .strat-arrow       { animation: arrow-fade 2s ease-in-out infinite; }
        .strat-copy:hover  { color:${blue} !important; border-color:${blueBorder} !important; }
        .strat-step:hover  { background:${blueAlpha} !important; transform:translateX(2px); }
        .strat-row:hover   { background:${blueAlpha} !important; transform:translateX(3px); }
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
        {/* Header with gradient */}
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
              background: `radial-gradient(circle,${blueAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                    color: blue,
                    textTransform: "uppercase",
                  }}
                >
                  Kubernetes · Deployment Strategy
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1px",
                    color: green,
                    background: greenAlpha,
                    border: `1px solid ${greenBorder}`,
                    borderRadius: 20,
                    padding: "2px 10px",
                  }}
                >
                  RollingUpdate
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
                <span style={{ color: blue }}>RollingUpdate</span> Strategy
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
                Updates Pods gradually with zero downtime. Configure{" "}
                <strong style={{ color: blue }}>maxSurge</strong> and{" "}
                <strong style={{ color: blue }}>maxUnavailable</strong> to
                control the speed and resource usage.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: blueAlpha,
                border: `1px solid ${blueBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="strat-pulse"
                style={{ fontFamily: mono, fontSize: 12, color: blue }}
              >
                ●
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: blue,
                }}
              >
                ROLLING UPDATE DEMO
              </span>
            </div>
          </div>
        </div>

        {/* Two‑column body */}
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
                    label: "strategy: RollingUpdate",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "maxSurge: 1",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                  {
                    label: "maxUnavailable: 1",
                    bg: orangeAlpha,
                    border: t("rgba(251,191,36,0.22)", "rgba(217,119,6,0.15)"),
                    color: orange,
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
                  background: blueAlpha,
                  border: `1px solid ${blueBorder}`,
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
                    color: blue,
                    marginBottom: 12,
                  }}
                >
                  How to use
                </div>

                {steps.map((step, idx) => (
                  <div key={step.id}>
                    <div
                      className="strat-step"
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
                          className="strat-arrow"
                          style={{ color: blue, fontSize: 14 }}
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
                    label: "Zero downtime",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Gradual replacement",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                  {
                    label: "Configurable surge",
                    bg: orangeAlpha,
                    border: t("rgba(251,191,36,0.22)", "rgba(217,119,6,0.15)"),
                    color: orange,
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
                  deployment.yaml (excerpt)
                </span>
                <button
                  className="strat-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
                    background: "transparent",
                    color: copied ? blue : txtMuted,
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

            {/* Important note */}
            <div
              style={{
                background: greenAlpha,
                border: `1px solid ${greenBorder}`,
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
                  color: green,
                  marginBottom: 8,
                }}
              >
                Important Note
              </div>
              <p style={{ fontSize: 12.5, color: txtSec, lineHeight: 1.6 }}>
                <code>minReadySeconds</code> delays the readiness of new pods,
                giving them time to stabilize. <code>maxSurge</code> and{" "}
                <code>maxUnavailable</code> can be absolute numbers or
                percentages. The Deployment controller ensures the number of
                available pods never drops below desired replicas minus{" "}
                <code>maxUnavailable</code>.
              </p>
            </div>

            {/* Quick kubectl bar */}
            <div
              style={{
                fontFamily: mono,
                fontSize: 10.5,
                padding: "10px 16px",
                borderRadius: 8,
                background: blueAlpha,
                border: `1px solid ${blueBorder}`,
                color: blue,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl rollout status deploy/pod-dep</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl rollout history deploy/pod-dep</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Flow, matrix, comparison, best for */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {/* Rolling update flow diagram */}
            <div>
              <SectionLabel
                label="Update flow (maxSurge=1, maxUnavailable=1)"
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
                      { icon: "🔄", label: "New\nimage", accent: true },
                      { icon: "➕", label: "Start 1\nnew pod", accent: false },
                      { icon: "❌", label: "Terminate\n1 old", accent: false },
                      {
                        icon: "✅",
                        label: "Repeat\nuntil done",
                        accent: false,
                      },
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
                            ? blueAlpha
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${step.accent ? blueBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            marginBottom: 7,
                            color: step.accent ? blue : "inherit",
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
                            color: step.accent ? blue : txtSec,
                            whiteSpace: "pre",
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className="strat-arrow"
                          style={{
                            fontSize: 16,
                            color: blue,
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
                  <span style={{ color: blue }}>✓</span> At most 1 extra pod
                  created, at most 1 unavailable – gradual, safe rollout.
                </div>
              </div>
            </div>

            {/* Configuration matrix */}
            <div>
              <SectionLabel
                label="RollingUpdate configuration effects"
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
                    className="strat-row"
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
                        fontSize: 11,
                        color: txt,
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: txtSec,
                        maxWidth: "55%",
                        textAlign: "right",
                      }}
                    >
                      {s.behavior}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison: RollingUpdate vs Recreate */}
            <div>
              <SectionLabel
                label="RollingUpdate vs Recreate"
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
                      color: blue,
                    }}
                  >
                    RollingUpdate
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: orange,
                    }}
                  >
                    Recreate
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="strat-row"
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
                    <span style={{ fontSize: 11.5, color: blue }}>
                      {item.rollingUpdate}
                    </span>
                    <span style={{ fontSize: 11.5, color: orange }}>
                      {item.recreate}
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
                      background: greenAlpha,
                      border: `1px solid ${greenBorder}`,
                      color: green,
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
                  background: blueAlpha,
                  border: `1px solid ${blueBorder}`,
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
                    color: blue,
                    marginBottom: 8,
                  }}
                >
                  Tune maxSurge and maxUnavailable carefully
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  For production, start with <code>maxSurge: 25%</code> and{" "}
                  <code>maxUnavailable: 0</code> to ensure no downtime. Use
                  readiness probes and <code>minReadySeconds</code> to guarantee
                  new pods are fully functional before terminating old ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStrategy;
