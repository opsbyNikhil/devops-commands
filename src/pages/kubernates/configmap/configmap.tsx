import React, { useState } from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme } from "../../../Themecontext";

// ----------------------------------------------
// Syntax-highlighting component (enhanced)
// ----------------------------------------------
const YamlLine = ({ line, isDark }: { line: string; isDark: boolean }) => {
  const colors = {
    key: isDark ? "#7dd3fc" : "#0369a1",
    value: isDark ? "#86efac" : "#15803d",
    number: isDark ? "#fbbf24" : "#b45309",
    string: isDark ? "#f9a8d4" : "#be185d",
    comment: isDark ? "#6b7280" : "#4b5563",
    highlight: isDark ? "#2dd4bf" : "#0d9488", // teal for ConfigMap specific keys
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

    // Highlight ConfigMap specific keys
    const isConfigMapKey = key === "configMapKeyRef" || key === "ConfigMap";
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
            color: isConfigMapKey ? colors.highlight : colors.key,
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
// Main component – ConfigMap
// ----------------------------------------------
const ConfigMapComponent = () => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const configMapYaml = `apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
data:
  APP_ENV: dev
  APP_PORT: '8080'
  DOCKER_BUILDID: "1"`;

  const podYaml = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-config-cont
      image: nginx
      env:
        - name: APP_ENV
          valueFrom:
            configMapKeyRef:
              name: my-config
              key: APP_ENV
        - name: APP_PORT
          valueFrom:
            configMapKeyRef:
              name: my-config
              key: APP_PORT
        - name: DOCKER_BUILDID
          valueFrom:
            configMapKeyRef:
              name: my-config
              key: DOCKER_BUILDID`;

  const handleCopyConfigMap = () => {
    navigator.clipboard.writeText(configMapYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPod = () => {
    navigator.clipboard.writeText(podYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme‑aware colour palette (teal/cyan for ConfigMap)
  const bg = isDark ? "#0f0a12" : "#f0fdfa";
  const cardBg = isDark ? "#150f18" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#0a0710" : "#f8fafc";
  const codeBorder = isDark ? "#33213a" : "#e2e8f0";

  const txt = isDark ? "#ffffff" : "#0f172a";
  const txtSec = isDark ? "rgba(220,180,200,0.7)" : "#475569";
  const txtMuted = isDark ? "rgba(249,168,212,0.4)" : "#64748b";

  // Primary accent = teal (ConfigMap)
  const teal = isDark ? "#2dd4bf" : "#0d9488";
  const tealAlpha = isDark ? "rgba(45,212,191,0.08)" : "rgba(13,148,136,0.06)";
  const tealBorder = isDark ? "rgba(45,212,191,0.28)" : "rgba(13,148,136,0.2)";

  const blue = isDark ? "#7dd3fc" : "#0284c7";
  const blueAlpha = isDark ? "rgba(125,211,252,0.07)" : "rgba(2,132,199,0.05)";
  const blueBorder = isDark ? "rgba(125,211,252,0.22)" : "rgba(2,132,199,0.15)";

  const green = isDark ? "#34d399" : "#059669";
  const greenAlpha = isDark ? "rgba(52,211,153,0.07)" : "rgba(5,150,105,0.05)";

  const orange = isDark ? "#fbbf24" : "#d97706";
  const orangeAlpha = isDark ? "rgba(251,191,36,0.07)" : "rgba(217,119,6,0.05)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1a0f1f 0%,#150f18 60%)"
    : "linear-gradient(135deg,#ccfbf1 0%,#ffffff 60%)";

  const mono = "'Space Mono','SF Mono','Menlo',monospace";
  const sans = "'Outfit','Inter',-apple-system,BlinkMacSystemFont,sans-serif";

  // Steps for using ConfigMap
  const steps = [
    {
      id: 1,
      title: "Create ConfigMap",
      description: "Define a ConfigMap with key-value configuration data.",
      cmd: "kubectl apply -f configmap.yaml",
      accentColor: teal,
      accentBg: tealAlpha,
      accentBorder: tealBorder,
    },
    {
      id: 2,
      title: "Create Pod referencing ConfigMap",
      description:
        "Inject ConfigMap values as environment variables into the Pod.",
      cmd: "kubectl apply -f pod.yaml",
      accentColor: blue,
      accentBg: blueAlpha,
      accentBorder: blueBorder,
    },
    {
      id: 3,
      title: "Verify resources",
      description: "Check that ConfigMap and Pod are created successfully.",
      cmd: "kubectl get configmap && kubectl get pod",
      accentColor: green,
      accentBg: greenAlpha,
      accentBorder: "rgba(52,211,153,0.22)",
    },
    {
      id: 4,
      title: "Check environment variables",
      description: "Exec into the Pod and inspect the injected variables.",
      cmd: "kubectl exec -it my-pod -- bash",
      accentColor: orange,
      accentBg: orangeAlpha,
      accentBorder: "rgba(251,191,36,0.22)",
    },
  ];

  // Comparison: ConfigMap vs Secret
  const comparisons = [
    {
      feature: "Data encoding",
      configMap: "Plain text",
      secret: "Base64 encoded (optional)",
    },
    {
      feature: "Sensitive data",
      configMap: "Not suitable",
      secret: "Designed for sensitive data",
    },
    {
      feature: "Size limit",
      configMap: "1 MiB (total for all entries)",
      secret: "1 MiB (total for all entries)",
    },
    {
      feature: "Use case",
      configMap: "Non‑sensitive config (ports, env, etc.)",
      secret: "Passwords, tokens, keys",
    },
  ];

  // Best for tags
  const bestFor = [
    "Environment variables (non‑sensitive)",
    "Application config files",
    "Separation of config from image",
    "Multi‑environment setups (dev/staging/prod)",
  ];

  // Ways to use ConfigMap
  const usagePoints = [
    "As environment variables (as shown)",
    "As files in a volume (configMap volume mount)",
    "As command line arguments",
    "From Pod spec (envFrom to load all keys at once)",
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

        .cm-pulse       { animation: pulse-glow 2s ease-in-out infinite; }
        .cm-arrow       { animation: arrow-fade 2s ease-in-out infinite; }
        .cm-copy:hover  { color:${teal} !important; border-color:${tealBorder} !important; }
        .cm-step:hover  { background:${tealAlpha} !important; transform:translateX(2px); }
        .cm-row:hover   { background:${tealAlpha} !important; transform:translateX(3px); }
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
              background: `radial-gradient(circle,${tealAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                    color: teal,
                    textTransform: "uppercase",
                  }}
                >
                  Kubernetes · Configuration
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
                  v1 · ConfigMap
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
                <span style={{ color: teal }}>ConfigMap</span> – Externalize
                Config
              </div>

              <div
                style={{
                  fontSize: 13.5,
                  color: txtSec,
                  marginTop: 12,
                  maxWidth: 520,
                  lineHeight: 1.6,
                }}
              >
                Store non‑sensitive configuration data as key‑value pairs.
                Decouple configuration from container images for easier updates
                and portability.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: tealAlpha,
                border: `1px solid ${tealBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="cm-pulse"
                style={{ fontFamily: mono, fontSize: 12, color: teal }}
              >
                ●
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: teal,
                }}
              >
                CONFIGMAP DEMO
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
                    label: "configMapKeyRef",
                    bg: tealAlpha,
                    border: tealBorder,
                    color: teal,
                  },
                  {
                    label: "Environment variables",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Decouple config",
                    bg: greenAlpha,
                    border: t("rgba(52,211,153,0.22)", "rgba(5,150,105,0.15)"),
                    color: green,
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
                  background: tealAlpha,
                  border: `1px solid ${tealBorder}`,
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
                    color: teal,
                    marginBottom: 12,
                  }}
                >
                  Setup Steps
                </div>

                {steps.map((step, idx) => (
                  <div key={step.id}>
                    <div
                      className="cm-step"
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
                            {step.cmd.split(" ")[0]}
                          </span>
                          <span style={{ color: txtSec }}>
                            {" " + step.cmd.slice(step.cmd.indexOf(" ") + 1)}
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
                          className="cm-arrow"
                          style={{ color: teal, fontSize: 14 }}
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
                    label: "Key‑value store",
                    bg: tealAlpha,
                    border: tealBorder,
                    color: teal,
                  },
                  {
                    label: "Env injection",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Volume mount support",
                    bg: greenAlpha,
                    border: t("rgba(52,211,153,0.22)", "rgba(5,150,105,0.15)"),
                    color: green,
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

            {/* YAML block: ConfigMap */}
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
                  configmap.yaml
                </span>
                <button
                  className="cm-copy"
                  onClick={handleCopyConfigMap}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
                    background: "transparent",
                    color: copied ? teal : txtMuted,
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
                  {configMapYaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* YAML block: Pod using ConfigMap */}
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
                  pod.yaml
                </span>
                <button
                  className="cm-copy"
                  onClick={handleCopyPod}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
                    background: "transparent",
                    color: copied ? teal : txtMuted,
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
                  {podYaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Important note - ConfigMap usage */}
            <div
              style={{
                background: greenAlpha,
                border: `1px solid ${t("rgba(52,211,153,0.22)", "rgba(5,150,105,0.15)")}`,
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
                Ways to use ConfigMap
              </div>
              {usagePoints.map((point, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: 12.5,
                    color: txtSec,
                    lineHeight: 1.6,
                    marginBottom: idx === usagePoints.length - 1 ? 0 : 8,
                  }}
                >
                  • {point}
                </p>
              ))}
            </div>

            {/* Quick kubectl bar */}
            <div
              style={{
                fontFamily: mono,
                fontSize: 10.5,
                padding: "10px 16px",
                borderRadius: 8,
                background: tealAlpha,
                border: `1px solid ${tealBorder}`,
                color: teal,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl get configmap my-config -o yaml</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl describe pod my-pod</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Flow, verification, comparison, best for */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {/* Flow diagram: ConfigMap to Pod */}
            <div>
              <SectionLabel
                label="Configuration flow"
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
                      { icon: "📝", label: "ConfigMap\nYAML", accent: true },
                      { icon: "➡️", label: "kubectl\napply", accent: false },
                      { icon: "📦", label: "Pod\nenvFrom", accent: false },
                      {
                        icon: "⚙️",
                        label: "Env vars\nin container",
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
                            ? tealAlpha
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${step.accent ? tealBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            marginBottom: 7,
                            color: step.accent ? teal : "inherit",
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
                            color: step.accent ? teal : txtSec,
                            whiteSpace: "pre",
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className="cm-arrow"
                          style={{
                            fontSize: 16,
                            color: teal,
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
                  <span style={{ color: teal }}>✓</span> ConfigMap data becomes
                  environment variables inside the Pod.
                </div>
              </div>
            </div>

            {/* Verification section: Inspect environment variables */}
            <div>
              <SectionLabel
                label="Verify injected variables"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />
              <div
                style={{
                  background: codeBg,
                  border: `1px solid ${codeBorder}`,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: teal,
                    marginBottom: 12,
                  }}
                >
                  # Exec into the Pod
                </div>
                <div
                  style={{
                    background: isDark ? "#0a0710" : "#f1f5f9",
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontFamily: mono,
                    fontSize: 10.5,
                    marginBottom: 16,
                  }}
                >
                  <span style={{ color: txtMuted }}>$ </span>
                  <span style={{ color: orange }}>
                    kubectl exec -it my-pod -- bash
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: teal,
                    marginBottom: 12,
                  }}
                >
                  # Inside the container, check environment variables
                </div>
                <div
                  style={{
                    background: isDark ? "#0a0710" : "#f1f5f9",
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontFamily: mono,
                    fontSize: 10.5,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: txtMuted }}>root@my-pod:/# </span>
                  <span style={{ color: green }}>env | grep APP_ENV</span>
                  <br />
                  <span style={{ color: txt }}>APP_ENV=dev</span>
                  <br />
                  <br />

                  <span style={{ color: txtMuted }}>root@my-pod:/# </span>
                  <span style={{ color: green }}>env | grep APP_PORT</span>
                  <br />
                  <span style={{ color: txt }}>APP_PORT=8080</span>
                  <br />
                  <br />

                  <span style={{ color: txtMuted }}>root@my-pod:/# </span>
                  <span style={{ color: green }}>
                    env | grep DOCKER_BUILDID
                  </span>
                  <br />
                  <span style={{ color: txt }}>DOCKER_BUILDID=1</span>
                  <br />
                  <br />

                  <span style={{ color: txtMuted }}>root@my-pod:/# </span>
                  <span style={{ color: green }}>printenv</span>
                  <br />
                  <span style={{ color: txtMuted }}>
                    # (Lists all environment variables, including the injected
                    ones)
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison: ConfigMap vs Secret */}
            <div>
              <SectionLabel
                label="ConfigMap vs Secret"
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
                      color: teal,
                    }}
                  >
                    ConfigMap
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: blue,
                    }}
                  >
                    Secret
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="cm-row"
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
                    <span style={{ fontSize: 11.5, color: teal }}>
                      {item.configMap}
                    </span>
                    <span style={{ fontSize: 11.5, color: blue }}>
                      {item.secret}
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
                  background: tealAlpha,
                  border: `1px solid ${tealBorder}`,
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
                    color: teal,
                    marginBottom: 8,
                  }}
                >
                  Keep config separate from code
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  Use ConfigMaps to externalize environment‑specific
                  configuration. For sensitive data (passwords, tokens), use
                  Secrets instead. Prefer `envFrom` when you have many keys, and
                  volume mounts for configuration files.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigMapComponent;
