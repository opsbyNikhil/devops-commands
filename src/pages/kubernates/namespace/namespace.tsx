import { useState } from "react";
import { useTheme } from "../../../Themecontext";

// ── Types ────────────────────────────────────────────────────────────────────
type LineToken = { text: string; color: string };

// ── YAML ─────────────────────────────────────────────────────────────────────
const podYaml = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: dev
spec:
  containers:
    - image: "httpd:latest"
      name: "my-test-image"
  ports:
    - containerPort: 8080
      protocol: "TCP"`;

// ── YAML line renderer (same style as ReplicaController) ─────────────────────
function YamlLine({ line, isDark }: { line: string; isDark: boolean }) {
  const keyColor    = isDark ? "#6ee7b7" : "#059669";
  const valueColor  = isDark ? "#a5b4fc" : "#4f46e5";
  const numberColor = isDark ? "#fcd34d" : "#d97706";
  const stringColor = isDark ? "#67e8f9" : "#0891b2";
  const highlightColor = isDark ? "#34d399" : "#059669";

  const renderLine = (text: string) => {
    const trimmed = text.trimStart();
    const indent  = text.length - trimmed.length;
    const spaces  = "\u00a0".repeat(indent);

    if (trimmed.startsWith("#")) {
      return <span style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>{text}</span>;
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

    const key   = trimmed.slice(0, colonIdx);
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
          <span style={{ color: keyColor }}>{"- "}{realKey}</span>
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

// ── Data ──────────────────────────────────────────────────────────────────────
const steps = [
  {
    id: 1,
    title: "Create namespace",
    description: "Create the dev namespace in your Kubernetes cluster.",
    cmd: "kubectl create namespace dev",
    accentColor: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.28)",
  },
  {
    id: 2,
    title: "Switch to namespace",
    description: "Set the current context to use the dev namespace.",
    cmd: "kubectl config set-context --current --namespace=dev",
    accentColor: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.28)",
  },
  {
    id: 3,
    title: "Apply pod manifest",
    description: "Deploy the pod into the dev namespace using the YAML below.",
    cmd: "kubectl apply -f pod.yaml",
    accentColor: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.28)",
  },
];

const podMeta = [
  { label: "apiVersion", value: "v1",          valueDark: "#a5b4fc", valueLight: "#4f46e5" },
  { label: "kind",       value: "Pod",          valueDark: "#34d399", valueLight: "#059669" },
  { label: "name",       value: "my-pod",       valueDark: "#fcd34d", valueLight: "#d97706" },
  { label: "namespace",  value: "dev",          valueDark: "#67e8f9", valueLight: "#0891b2" },
  { label: "image",      value: "httpd:latest", valueDark: "#67e8f9", valueLight: "#0891b2" },
  { label: "port",       value: "8080 / TCP",   valueDark: "#fcd34d", valueLight: "#d97706" },
];

const comparisons = [
  { feature: "Restart policy",   rc: "Always",           ns: "Configurable" },
  { feature: "Scope",            rc: "Cluster-wide",     ns: "Logical group" },
  { feature: "Rolling updates",  rc: "Not supported",    ns: "Via Deployment" },
  { feature: "Access control",   rc: "Flat",             ns: "RBAC per NS" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function t(isDark: boolean, dark: string, light: string): string {
  return isDark ? dark : light;
}

function SectionLabel({
  label, mono, color, divider,
}: {
  label: string; mono: string; color: string; divider: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{
        fontFamily: mono, fontSize: 9, letterSpacing: "1.8px",
        textTransform: "uppercase" as const, color, whiteSpace: "nowrap" as const,
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: divider }} />
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function NamespaceSetup() {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(podYaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Palette (teal/cyan/green — distinct from RC's red) ───────────────────
  const bg         = t(isDark, "#000d0a", "#f0fdf4");
  const cardBg     = t(isDark, "#000f0c", "#ffffff");
  const cardBorder = t(isDark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const divider    = t(isDark, "rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)");
  const codeBg     = t(isDark, "#000c09", "#f0fdf4");
  const codeBorder = t(isDark, "#003322", "#a7f3d0");

  const txt     = t(isDark, "#ffffff",              "#0f172a");
  const txtSec  = t(isDark, "rgba(100,220,180,0.7)", "#475569");
  const txtMuted= t(isDark, "rgba(52,211,153,0.4)",  "#94a3b8");

  const green       = t(isDark, "#34d399", "#059669");
  const greenAlpha  = t(isDark, "rgba(52,211,153,0.08)",  "rgba(5,150,105,0.06)");
  const greenBorder = t(isDark, "rgba(52,211,153,0.28)",  "rgba(5,150,105,0.2)");

  const cyan        = t(isDark, "#67e8f9", "#0891b2");
  const cyanAlpha   = t(isDark, "rgba(103,232,249,0.07)", "rgba(8,145,178,0.05)");
  const cyanBorder  = t(isDark, "rgba(103,232,249,0.22)", "rgba(8,145,178,0.15)");

  const indigo      = t(isDark, "#a5b4fc", "#4f46e5");
  const indigoAlpha = t(isDark, "rgba(165,180,252,0.07)", "rgba(79,70,229,0.05)");
  const indigoBorder= t(isDark, "rgba(165,180,252,0.22)", "rgba(79,70,229,0.15)");

  const amber      = t(isDark, "#fcd34d", "#d97706");
  const amberAlpha = t(isDark, "rgba(252,211,77,0.08)",  "rgba(217,119,6,0.05)");
  const amberBorder= t(isDark, "rgba(252,211,77,0.22)",  "rgba(217,119,6,0.15)");

  const headerGrad = t(
    isDark,
    "linear-gradient(135deg,#001a12 0%,#000f0c 60%)",
    "linear-gradient(135deg,#d1fae5 0%,#ffffff 60%)",
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

        .ns-pulse       { animation: pulse-glow 2s ease-in-out infinite; }
        .ns-arrow       { animation: arrow-fade 2s ease-in-out infinite; }
        .ns-copy:hover  { color:${green} !important; border-color:${greenBorder} !important; }
        .ns-step:hover  { background:${greenAlpha} !important; transform:translateX(2px); }
        .ns-row:hover   { background:${greenAlpha} !important; transform:translateX(3px); }
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
          <div style={{
            position: "absolute", top: -80, right: -80,
            width: 260, height: 260,
            background: `radial-gradient(circle,${greenAlpha.replace("0.08","0.22")} 0%,transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "2px", color: green, textTransform: "uppercase" as const }}>
                  Kubernetes
                </span>
                <span style={{
                  fontFamily: mono, fontSize: 9, letterSpacing: "1px",
                  color: cyan, background: cyanAlpha,
                  border: `1px solid ${cyanBorder}`,
                  borderRadius: 20, padding: "2px 10px",
                }}>
                  Active
                </span>
              </div>

              <div style={{
                fontSize: 40, fontWeight: 600, color: txt,
                letterSpacing: "-0.025em", lineHeight: 1, fontFamily: sans,
              }}>
                Namespace Setup —{" "}
                <span style={{ color: green }}>dev</span>
              </div>

              <div style={{ fontSize: 13.5, color: txtSec, marginTop: 12, maxWidth: 500, lineHeight: 1.6 }}>
                Three steps to create the namespace, switch context, and{" "}
                <strong style={{ color: green, fontWeight: 500 }}>deploy the pod</strong>.
                Namespaces provide{" "}
                <strong style={{ color: cyan, fontWeight: 500 }}>logical isolation</strong>{" "}
                for workloads within a cluster.
              </div>
            </div>

            {/* badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: greenAlpha, border: `1px solid ${greenBorder}`,
              borderRadius: 40, padding: "6px 18px", alignSelf: "flex-start",
            }}>
              <span className="ns-pulse" style={{ fontFamily: mono, fontSize: 12, color: green }}>●</span>
              <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: "1.5px", color: green }}>
                READY TO DEPLOY
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 560 }}>

          {/* ── Left ─────────────────────────────────────────────────────── */}
          <div style={{
            borderRight: `1px solid ${divider}`,
            padding: "26px 30px",
            display: "flex", flexDirection: "column" as const, gap: 24,
          }}>

            {/* API tags */}
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {[
                  { label: "v1",  bg: indigoAlpha, border: indigoBorder, color: indigo },
                  { label: "Pod", bg: greenAlpha,  border: greenBorder,  color: green  },
                  { label: "dev", bg: cyanAlpha,   border: cyanBorder,   color: cyan   },
                ].map((tag) => (
                  <span key={tag.label} style={{
                    fontFamily: mono, fontSize: 10, padding: "4px 12px",
                    borderRadius: 5, background: tag.bg,
                    border: `1px solid ${tag.border}`, color: tag.color,
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Steps */}
              <div style={{
                background: greenAlpha, border: `1px solid ${greenBorder}`,
                borderRadius: 12, padding: "14px 16px", marginBottom: 18,
              }}>
                <div style={{
                  fontFamily: mono, fontSize: 9, letterSpacing: "1.8px",
                  textTransform: "uppercase" as const, color: green, marginBottom: 12,
                }}>
                  Setup Steps
                </div>

                {steps.map((step, idx) => (
                  <div key={step.id}>
                    <div
                      className="ns-step"
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "10px 8px", borderRadius: 8, transition: "all 0.15s",
                      }}
                    >
                      {/* number bubble */}
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: step.accentBg, border: `1.5px solid ${step.accentBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontFamily: mono, fontWeight: 700, fontSize: 12,
                        color: step.accentColor,
                      }}>
                        {step.id}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: mono, fontSize: 11, color: green, marginBottom: 3, fontWeight: 700 }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: txtSec, lineHeight: 1.5, marginBottom: 6 }}>
                          {step.description}
                        </div>
                        {/* inline command */}
                        <div style={{
                          fontFamily: mono, fontSize: 10.5,
                          background: codeBg, border: `1px solid ${codeBorder}`,
                          borderRadius: 6, padding: "5px 10px",
                          color: green, display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <span style={{ color: txtMuted }}>$</span>
                          <span style={{ color: cyan }}>{step.cmd.split(" ")[0]}</span>
                          <span style={{ color: txtSec }}>
                            {" " + step.cmd.slice(step.cmd.indexOf(" ") + 1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {idx < steps.length - 1 && (
                      <div style={{ display: "flex", justifyContent: "flex-start", padding: "2px 0 2px 22px" }}>
                        <span className="ns-arrow" style={{ color: green, fontSize: 14 }}>↓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* descriptive tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { label: "Logical isolation",  bg: greenAlpha,  border: greenBorder,  color: green  },
                  { label: "RBAC ready",          bg: cyanAlpha,   border: cyanBorder,   color: cyan   },
                  { label: "Multi-tenant",        bg: indigoAlpha, border: indigoBorder, color: indigo },
                ].map((tag) => (
                  <span key={tag.label} style={{
                    fontFamily: mono, fontSize: 10, padding: "4px 12px",
                    borderRadius: 4, background: tag.bg,
                    border: `1px solid ${tag.border}`, color: tag.color,
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* YAML block */}
            <div>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 10,
              }}>
                <span style={{
                  fontFamily: mono, fontSize: 9, letterSpacing: "1.8px",
                  textTransform: "uppercase" as const, color: txtMuted,
                }}>
                  pod.yaml
                </span>
                <button
                  className="ns-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono, fontSize: 10, padding: "4px 12px",
                    borderRadius: 5, border: `1px solid ${codeBorder}`,
                    background: "transparent", color: copied ? green : txtMuted,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ copied" : "copy"}
                </button>
              </div>
              <div style={{
                background: codeBg, border: `1px solid ${codeBorder}`,
                borderRadius: 14, overflow: "auto",
              }}>
                <div style={{ padding: "18px 22px" }}>
                  {podYaml.split("\n").map((line: string, i: number) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Important note */}
            <div style={{
              background: amberAlpha, border: `1px solid ${amberBorder}`,
              borderRadius: 10, padding: "12px 16px",
            }}>
              <div style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "1.8px",
                textTransform: "uppercase" as const, color: amber, marginBottom: 8,
              }}>
                Important Note
              </div>
              <p style={{ fontSize: 12.5, color: txtSec, lineHeight: 1.6 }}>
                Namespaces do{" "}
                <strong style={{ color: amber, fontWeight: 500 }}>not</strong>{" "}
                provide network isolation by default. Use{" "}
                <strong style={{ color: cyan, fontWeight: 500 }}>NetworkPolicies</strong>{" "}
                to restrict cross-namespace traffic.
              </p>
            </div>

            {/* kubectl bar */}
            <div style={{
              fontFamily: mono, fontSize: 10.5, padding: "10px 16px",
              borderRadius: 8, background: greenAlpha,
              border: `1px solid ${greenBorder}`, color: green,
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl get pods -n dev</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl get ns</span>
            </div>
          </div>

          {/* ── Right ────────────────────────────────────────────────────── */}
          <div style={{
            padding: "26px 30px",
            display: "flex", flexDirection: "column" as const, gap: 26,
          }}>

            {/* Flow diagram */}
            <div>
              <SectionLabel label="How it works" mono={mono} color={txtMuted} divider={divider} />
              <div style={{
                background: codeBg, border: `1px solid ${codeBorder}`,
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {([
                    { icon: "🏗",  label: "NS\ncreated",      accent: false, ok: false },
                    { icon: "3",   label: "3\nsteps",         accent: true,  ok: false },
                    { icon: "📦",  label: "Pod\ndeployed",    accent: false, ok: true  },
                    { icon: "✓",   label: "Pod\nrunning",     accent: false, ok: true  },
                  ] as const).map((step, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", flex: idx === 1 ? "0 0 auto" : 1 }}>
                      <div style={{
                        flex: 1, textAlign: "center",
                        background: step.accent ? greenAlpha : step.ok ? cyanAlpha : "rgba(255,255,255,0.03)",
                        border: `1px solid ${step.accent ? greenBorder : step.ok ? cyanBorder : divider}`,
                        borderRadius: 10, padding: "12px 6px",
                      }}>
                        <div style={{
                          fontSize: step.icon === "3" ? 22 : step.icon === "✓" ? 18 : 20,
                          fontFamily: step.icon === "3" || step.icon === "✓" ? mono : "inherit",
                          fontWeight: 700, marginBottom: 7,
                          color: step.accent ? green : step.ok ? cyan : "inherit",
                          opacity: step.accent || step.ok ? 1 : 0.55,
                        }}>
                          {step.icon}
                        </div>
                        <div style={{
                          fontFamily: mono, fontSize: 9.5, lineHeight: 1.5,
                          color: step.accent ? green : step.ok ? cyan : txtSec,
                          whiteSpace: "pre" as const,
                        }}>
                          {step.label}
                        </div>
                      </div>
                      {idx < 3 && (
                        <div className="ns-arrow" style={{ fontSize: 16, color: green, padding: "0 6px" }}>→</div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 14, paddingTop: 12, borderTop: `1px solid ${divider}`,
                  fontFamily: mono, fontSize: 10, color: txtSec, textAlign: "center" as const,
                }}>
                  <span style={{ color: green }}>●</span>{" "}
                  Namespace scopes resources and enables RBAC isolation
                </div>
              </div>
            </div>

            {/* Pod spec summary */}
            <div>
              <SectionLabel label="Pod spec summary" mono={mono} color={txtMuted} divider={divider} />
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
              }}>
                {podMeta.map((m) => (
                  <div key={m.label} style={{
                    background: codeBg, border: `1px solid ${codeBorder}`,
                    borderRadius: 8, padding: "8px 12px",
                    display: "flex", flexDirection: "column" as const, gap: 3,
                  }}>
                    <span style={{
                      fontFamily: mono, fontSize: 9, color: txtMuted,
                      fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em",
                    }}>
                      {m.label}
                    </span>
                    <span style={{
                      fontFamily: mono, fontSize: 12,
                      color: t(isDark, m.valueDark, m.valueLight), fontWeight: 500,
                    }}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NS vs default comparison */}
            <div>
              <SectionLabel label="dev ns vs default ns" mono={mono} color={txtMuted} divider={divider} />
              <div style={{
                background: codeBg, border: `1px solid ${codeBorder}`,
                borderRadius: 12, overflow: "hidden",
              }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1.1fr 1.1fr",
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  borderBottom: `1px solid ${divider}`, padding: "10px 18px",
                }}>
                  <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "1px", color: txtMuted }}>Feature</span>
                  <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "1px", color: green }}>dev namespace</span>
                  <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: "1px", color: cyan }}>default ns</span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="ns-row"
                    style={{
                      display: "grid", gridTemplateColumns: "1fr 1.1fr 1.1fr",
                      padding: "10px 18px",
                      borderBottom: i !== comparisons.length - 1 ? `1px solid ${divider}` : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontFamily: mono, fontSize: 10, color: txt }}>{item.feature}</span>
                    <span style={{ fontSize: 11.5, color: green }}>{item.rc}</span>
                    <span style={{ fontSize: 11.5, color: cyan }}>{item.ns}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best practice */}
            <div>
              <SectionLabel label="Best practice" mono={mono} color={txtMuted} divider={divider} />
              <div style={{
                background: indigoAlpha, border: `1px solid ${indigoBorder}`,
                borderRadius: 12, padding: "14px 18px", marginBottom: 12,
              }}>
                <div style={{
                  fontFamily: mono, fontSize: 9, letterSpacing: "1.5px",
                  textTransform: "uppercase" as const, color: indigo, marginBottom: 8,
                }}>
                  Recommended: separate namespaces per env
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  Use{" "}
                  <strong style={{ color: green, fontWeight: 500 }}>dev</strong>,{" "}
                  <strong style={{ color: cyan, fontWeight: 500 }}>staging</strong>, and{" "}
                  <strong style={{ color: indigo, fontWeight: 500 }}>prod</strong>{" "}
                  namespaces to isolate workloads, apply separate RBAC policies, and
                  manage resource quotas independently.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { label: "kubectl create ns dev",     bg: greenAlpha,  border: greenBorder,  color: green  },
                  { label: "ResourceQuota",              bg: cyanAlpha,   border: cyanBorder,   color: cyan   },
                  { label: "NetworkPolicy",              bg: indigoAlpha, border: indigoBorder, color: indigo },
                ].map((tag) => (
                  <span key={tag.label} style={{
                    fontFamily: mono, fontSize: 10, color: tag.color,
                    background: tag.bg, border: `1px solid ${tag.border}`,
                    borderRadius: 4, padding: "4px 12px",
                  }}>
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
