import { useState } from "react";
import { useTheme } from "../../../Themecontext";

// ── Types ────────────────────────────────────────────────────────────────────
type LineToken = { text: string; color: string };

// ── YAML ─────────────────────────────────────────────────────────────────────
const podYaml = `apiVersion: v1
kind: Pod
metadata:
  name: annotation-pod
  labels:
    env: anno-prod
  annotations:
    kubernetes.io/change-cause: "deploy"
spec:
  containers:
    - name: anna-con
      image: jenkins/jenkins`;

// ── Annotation YAML line renderer (matches pattern but with annotation colors) ──
function AnnotationYamlLine({
  line,
  isDark,
}: {
  line: string;
  isDark: boolean;
}) {
  // Annotation-specific color palette
  const keyColor = isDark ? "#f9a8d4" : "#db2777"; // pink
  const specialKeyColor = isDark ? "#c084fc" : "#9333ea"; // purple for annotation key
  const valueColor = isDark ? "#a5b4fc" : "#4f46e5"; // indigo
  const numberColor = isDark ? "#fcd34d" : "#d97706"; // amber
  const stringColor = isDark ? "#67e8f9" : "#0891b2"; // cyan
  const highlightColor = isDark ? "#34d399" : "#059669"; // green for Pod kind

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent = text.length - trimmed.length;
    const spaces = "\u00a0".repeat(indent);

    if (trimmed.startsWith("#")) {
      return (
        <span style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>{text}</span>
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

    // Special handling for annotation key kubernetes.io/change-cause
    const isAnnotationKey = key === "kubernetes.io/change-cause";
    const actualKeyColor = isAnnotationKey ? specialKeyColor : keyColor;

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
          <span style={{ color: actualKeyColor }}>
            {"- "}
            {realKey}
          </span>
          :{value !== "" && <> {coloredValue}</>}
        </>
      );
    }

    const coloredValue =
      value === "" ? null : key === "kind" && value === "Pod" ? (
        <span style={{ color: highlightColor, fontWeight: 700 }}>{value}</span>
      ) : /^\d+$/.test(value) ? (
        <span style={{ color: numberColor }}>{value}</span>
      ) : (
        <span style={{ color: stringColor }}>{value}</span>
      );

    return (
      <>
        {spaces}
        <span style={{ color: actualKeyColor }}>{key}</span>:
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

// ── Data ──────────────────────────────────────────────────────────────────────
const steps = [
  {
    id: 1,
    title: "Create the annotated pod",
    description: "Apply the pod manifest with labels and annotations defined.",
    cmd: "kubectl apply -f annotation-pod.yaml",
    accentColor: "#38bdf8",
    accentBg: "rgba(56,189,248,0.08)",
    accentBorder: "rgba(56,189,248,0.28)",
  },
  {
    id: 2,
    title: "View annotations",
    description: "Describe the pod to inspect all metadata annotations.",
    cmd: "kubectl describe pod annotation-pod",
    accentColor: "#f9a8d4",
    accentBg: "rgba(249,168,212,0.08)",
    accentBorder: "rgba(249,168,212,0.28)",
  },
  {
    id: 3,
    title: "Get annotation value",
    description: "Extract the change-cause annotation value directly.",
    cmd: `kubectl get pod annotation-pod -o jsonpath='{.metadata.annotations}'`,
    accentColor: "#4ade80",
    accentBg: "rgba(74,222,128,0.08)",
    accentBorder: "rgba(74,222,128,0.28)",
  },
  {
    id: 4,
    title: "Update annotation",
    description: "Patch the change-cause annotation with a new value.",
    cmd: `kubectl annotate pod annotation-pod kubernetes.io/change-cause="v2-release" --overwrite`,
    accentColor: "#a78bfa",
    accentBg: "rgba(167,139,250,0.08)",
    accentBorder: "rgba(167,139,250,0.28)",
  },
];

const annotationMeta = [
  { label: "apiVersion", value: "v1", dark: "#a5b4fc", light: "#4f46e5" },
  { label: "kind", value: "Pod", dark: "#34d399", light: "#059669" },
  { label: "name", value: "annotation-pod", dark: "#fcd34d", light: "#d97706" },
  {
    label: "label",
    value: "env: anno-prod",
    dark: "#67e8f9",
    light: "#0891b2",
  },
  {
    label: "annotation",
    value: "kubernetes.io/change-cause",
    dark: "#f9a8d4",
    light: "#db2777",
  },
  { label: "value", value: '"deploy"', dark: "#4ade80", light: "#15803d" },
  { label: "container", value: "anna-con", dark: "#fcd34d", light: "#d97706" },
  {
    label: "image",
    value: "jenkins/jenkins",
    dark: "#67e8f9",
    light: "#0891b2",
  },
];

const annotationFacts = [
  {
    icon: "📌",
    title: "Non-identifying metadata",
    desc: "Unlike labels, annotations are not used for selection — they carry extra info.",
  },
  {
    icon: "📝",
    title: "Arbitrary key/value pairs",
    desc: "Values can be large strings, JSON blobs, build hashes, or tool configs.",
  },
  {
    icon: "🔁",
    title: "Change-cause tracking",
    desc: "kubernetes.io/change-cause records why a rollout happened.",
  },
  {
    icon: "🔍",
    title: "Tool integration",
    desc: "CI/CD tools, monitoring, and Ingress controllers read annotations.",
  },
];

const comparisons = [
  { feature: "Used for selection", labels: "Yes", annotations: "No" },
  {
    feature: "Arbitrary values",
    labels: "Limited",
    annotations: "Yes (large blobs)",
  },
  { feature: "Queryable via labelSelector", labels: "Yes", annotations: "No" },
  {
    feature: "Change-cause tracking",
    labels: "No",
    annotations: "Yes (kubernetes.io/change-cause)",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function t(isDark: boolean, dark: string, light: string): string {
  return isDark ? dark : light;
}

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
          textTransform: "uppercase" as const,
          color,
          whiteSpace: "nowrap" as const,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: divider }} />
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function AnnotationSetup() {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(podYaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Palette (pink/cyan/purple/green — annotation theme) ───────────────────
  const bg = t(isDark, "#0f0a12", "#fdf2f8");
  const cardBg = t(isDark, "#150f18", "#ffffff");
  const cardBorder = t(isDark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const divider = t(isDark, "rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)");
  const codeBg = t(isDark, "#0a0710", "#fdf2f8");
  const codeBorder = t(isDark, "#33213a", "#fbcfe8");

  const txt = t(isDark, "#ffffff", "#0f172a");
  const txtSec = t(isDark, "rgba(220,180,200,0.7)", "#475569");
  const txtMuted = t(isDark, "rgba(249,168,212,0.4)", "#94a3b8");

  const pink = t(isDark, "#f9a8d4", "#db2777");
  const pinkAlpha = t(
    isDark,
    "rgba(249,168,212,0.08)",
    "rgba(219,39,119,0.06)",
  );
  const pinkBorder = t(
    isDark,
    "rgba(249,168,212,0.28)",
    "rgba(219,39,119,0.2)",
  );

  const cyan = t(isDark, "#67e8f9", "#0891b2");
  const cyanAlpha = t(isDark, "rgba(103,232,249,0.07)", "rgba(8,145,178,0.05)");
  const cyanBorder = t(
    isDark,
    "rgba(103,232,249,0.22)",
    "rgba(8,145,178,0.15)",
  );

  const purple = t(isDark, "#c084fc", "#9333ea");
  const purpleAlpha = t(
    isDark,
    "rgba(192,132,252,0.07)",
    "rgba(147,51,234,0.05)",
  );
  const purpleBorder = t(
    isDark,
    "rgba(192,132,252,0.22)",
    "rgba(147,51,234,0.15)",
  );

  const green = t(isDark, "#34d399", "#059669");
  const greenAlpha = t(isDark, "rgba(52,211,153,0.08)", "rgba(5,150,105,0.06)");
  const greenBorder = t(isDark, "rgba(52,211,153,0.28)", "rgba(5,150,105,0.2)");

  const headerGrad = t(
    isDark,
    "linear-gradient(135deg,#1a0f1f 0%,#150f18 60%)",
    "linear-gradient(135deg,#fce7f3 0%,#ffffff 60%)",
  );

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

        @keyframes pulse-glow {
          0%,100% { opacity:1; }
          50%      { opacity:0.35; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }

        .ann-pulse       { animation: pulse-glow 2s ease-in-out infinite; }
        .ann-arrow       { animation: arrow-fade 2s ease-in-out infinite; }
        .ann-copy:hover  { color:${pink} !important; border-color:${pinkBorder} !important; }
        .ann-step:hover  { background:${pinkAlpha} !important; transform:translateX(2px); }
        .ann-row:hover   { background:${pinkAlpha} !important; transform:translateX(3px); }
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
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div
          style={{
            background: headerGrad,
            padding: "30px 36px 26px",
            borderBottom: `1px solid ${divider}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow orb */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              background: `radial-gradient(circle,${pinkAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                    color: pink,
                    textTransform: "uppercase" as const,
                  }}
                >
                  Kubernetes · Metadata
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1px",
                    color: cyan,
                    background: cyanAlpha,
                    border: `1px solid ${cyanBorder}`,
                    borderRadius: 20,
                    padding: "2px 10px",
                  }}
                >
                  Non-identifying
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
                Annotations —{" "}
                <span style={{ color: pink }}>annotation-pod</span>
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
                Non-identifying metadata attached to a pod. Used by tools,{" "}
                <strong style={{ color: pink, fontWeight: 500 }}>
                  not selectors
                </strong>
                . Annotations carry extra info like build hashes, rollback
                reasons, or tool configs.
              </div>
            </div>

            {/* badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: pinkAlpha,
                border: `1px solid ${pinkBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="ann-pulse"
                style={{ fontFamily: mono, fontSize: 12, color: pink }}
              >
                ●
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: pink,
                }}
              >
                ANNOTATION DEMO
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 560,
          }}
        >
          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div
            style={{
              borderRight: `1px solid ${divider}`,
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column" as const,
              gap: 24,
            }}
          >
            {/* API tags */}
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
                    label: "v1",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                  {
                    label: "Pod",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                  {
                    label: "change-cause",
                    bg: pinkAlpha,
                    border: pinkBorder,
                    color: pink,
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

              {/* Steps */}
              <div
                style={{
                  background: pinkAlpha,
                  border: `1px solid ${pinkBorder}`,
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
                    textTransform: "uppercase" as const,
                    color: pink,
                    marginBottom: 12,
                  }}
                >
                  Setup Steps
                </div>

                {steps.map((step, idx) => (
                  <div key={step.id}>
                    <div
                      className="ann-step"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "10px 8px",
                        borderRadius: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      {/* number bubble */}
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
                        {/* inline command */}
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
                          className="ann-arrow"
                          style={{ color: pink, fontSize: 14 }}
                        >
                          ↓
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* descriptive tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  {
                    label: "Arbitrary key/value",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                  {
                    label: "Not selectable",
                    bg: cyanAlpha,
                    border: cyanBorder,
                    color: cyan,
                  },
                  {
                    label: "Tool integration",
                    bg: greenAlpha,
                    border: greenBorder,
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
                    textTransform: "uppercase" as const,
                    color: txtMuted,
                  }}
                >
                  annotation-pod.yaml
                </span>
                <button
                  className="ann-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
                    background: "transparent",
                    color: copied ? pink : txtMuted,
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
                  {podYaml.split("\n").map((line: string, i: number) => (
                    <AnnotationYamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Important note */}
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
                  textTransform: "uppercase" as const,
                  color: purple,
                  marginBottom: 8,
                }}
              >
                Important Note
              </div>
              <p style={{ fontSize: 12.5, color: txtSec, lineHeight: 1.6 }}>
                Annotations use the key format{" "}
                <strong style={{ color: pink, fontWeight: 500 }}>
                  prefix/name
                </strong>
                . The{" "}
                <strong style={{ color: cyan, fontWeight: 500 }}>
                  kubernetes.io/
                </strong>{" "}
                prefix is reserved for core Kubernetes use.
              </p>
            </div>

            {/* kubectl bar */}
            <div
              style={{
                fontFamily: mono,
                fontSize: 10.5,
                padding: "10px 16px",
                borderRadius: 8,
                background: pinkAlpha,
                border: `1px solid ${pinkBorder}`,
                color: pink,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl get pods --show-labels</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl describe pod annotation-pod</span>
            </div>
          </div>

          {/* ── Right column ────────────────────────────────────────────────── */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column" as const,
              gap: 26,
            }}
          >
            {/* Flow diagram / Annotation lifecycle */}
            <div>
              <SectionLabel
                label="Annotation lifecycle"
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
                      {
                        icon: "📝",
                        label: "Define\nannotations",
                        accent: false,
                        ok: false,
                      },
                      {
                        icon: "⚙️",
                        label: "Apply\npod",
                        accent: true,
                        ok: false,
                      },
                      {
                        icon: "🔍",
                        label: "Read\nvia kubectl",
                        accent: false,
                        ok: true,
                      },
                      {
                        icon: "🔄",
                        label: "Update\npatch",
                        accent: false,
                        ok: true,
                      },
                    ] as const
                  ).map((step, idx) => (
                    <div
                      key={idx}
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
                          background: step.accent
                            ? pinkAlpha
                            : step.ok
                              ? cyanAlpha
                              : "rgba(255,255,255,0.03)",
                          border: `1px solid ${step.accent ? pinkBorder : step.ok ? cyanBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: step.icon === "⚙️" ? 22 : 20,
                            fontFamily:
                              step.icon === "⚙️" || step.icon === "🔄"
                                ? mono
                                : "inherit",
                            fontWeight: 700,
                            marginBottom: 7,
                            color: step.accent
                              ? pink
                              : step.ok
                                ? cyan
                                : "inherit",
                            opacity: step.accent || step.ok ? 1 : 0.55,
                          }}
                        >
                          {step.icon}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 9.5,
                            lineHeight: 1.5,
                            color: step.accent ? pink : step.ok ? cyan : txtSec,
                            whiteSpace: "pre" as const,
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                      {idx < 3 && (
                        <div
                          className="ann-arrow"
                          style={{
                            fontSize: 16,
                            color: pink,
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
                    textAlign: "center" as const,
                  }}
                >
                  <span style={{ color: pink }}>●</span> Annotations are
                  mutable, not used for selection, and ideal for tooling.
                </div>
              </div>
            </div>

            {/* Manifest summary grid */}
            <div>
              <SectionLabel
                label="Manifest summary"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {annotationMeta.map((m) => (
                  <div
                    key={m.label}
                    style={{
                      background: codeBg,
                      border: `1px solid ${codeBorder}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column" as const,
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        color: txtMuted,
                        fontWeight: 600,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {m.label}
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 12,
                        color: t(isDark, m.dark, m.light),
                        fontWeight: 500,
                      }}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotation facts grid */}
            <div>
              <SectionLabel
                label="What annotations do"
                mono={mono}
                color={txtMuted}
                divider={divider}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {annotationFacts.map((fact) => (
                  <div
                    key={fact.title}
                    style={{
                      background: codeBg,
                      border: `1px solid ${codeBorder}`,
                      borderRadius: 10,
                      padding: "12px",
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 6 }}>
                      {fact.icon}
                    </div>
                    <div
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        fontWeight: 700,
                        color: pink,
                        marginBottom: 4,
                      }}
                    >
                      {fact.title}
                    </div>
                    <div
                      style={{ fontSize: 10.5, color: txtSec, lineHeight: 1.5 }}
                    >
                      {fact.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Labels vs Annotations comparison */}
            <div>
              <SectionLabel
                label="Labels vs Annotations"
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
                    gridTemplateColumns: "1fr 1.1fr 1.1fr",
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
                      color: cyan,
                    }}
                  >
                    Labels
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: pink,
                    }}
                  >
                    Annotations
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="ann-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1.1fr 1.1fr",
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
                    <span style={{ fontSize: 11.5, color: cyan }}>
                      {item.labels}
                    </span>
                    <span style={{ fontSize: 11.5, color: pink }}>
                      {item.annotations}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best practice */}
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
                    textTransform: "uppercase" as const,
                    color: green,
                    marginBottom: 8,
                  }}
                >
                  Use annotations for tool integration
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  Store{" "}
                  <strong style={{ color: pink, fontWeight: 500 }}>
                    change-cause
                  </strong>
                  ,{" "}
                  <strong style={{ color: cyan, fontWeight: 500 }}>
                    build hashes
                  </strong>
                  , and{" "}
                  <strong style={{ color: purple, fontWeight: 500 }}>
                    rollback reasons
                  </strong>{" "}
                  in annotations. Avoid large, frequently changing values. Keep
                  keys unique to prevent collisions.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  {
                    label: "kubectl annotate",
                    bg: pinkAlpha,
                    border: pinkBorder,
                    color: pink,
                  },
                  {
                    label: "jsonpath extraction",
                    bg: cyanAlpha,
                    border: cyanBorder,
                    color: cyan,
                  },
                  {
                    label: "kubernetes.io/change-cause",
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
                      color: tag.color,
                      background: tag.bg,
                      border: `1px solid ${tag.border}`,
                      borderRadius: 4,
                      padding: "4px 12px",
                    }}
                  >
                    {tag.label}
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
