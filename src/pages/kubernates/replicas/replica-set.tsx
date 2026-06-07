import { useState } from "react";
import { useTheme } from "../../../Themecontext";

const yaml = `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: rp-pod
  labels:
    app: greenapp
    env: dev
  namespace: devnamespace
  annotations: 
    myecrimage: 
spec:
  minReadySeconds: 6s
  replicas: 5
  selector:
    matchLabels:
      app: greenapp-pod 
  template:
    metadata: 
      name: rp-pod-level
      labels:
        app: greenapp-pod
    spec:
      containers:
        - name: greenimageapp
          image: nginx:latest
          ports:
            - name: greenapp-port
              containerPort: 80
              protocol: TCP
          startupProbe:
            httpGet:
              path: "/site"
              port: 80
          livenessProbe:
            tcpSocket:
              port: 80
          readinessProbe:
            exec:
              command:
                - touch
                - rp{1..5}.txt
          resources:
            requests:
              cpu: 100M
              memory: 150Mi
            limits:
              cpu: 150M
              memory: 200Mi`;

function YamlLine({ line, isDark }: { line: string; isDark: boolean }) {
  const keyColor = isDark ? "#7dd3fc" : "#0369a1";
  const valueColor = isDark ? "#86efac" : "#15803d";
  const numberColor = isDark ? "#fbbf24" : "#b45309";
  const stringColor = isDark ? "#f9a8d4" : "#be185d";
  const highlightColor = isDark ? "#00ff88" : "#059669";

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
            <span style={{ color: keyColor }}>{"- "}</span>
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
        value === "" ? null : /^\d+$/.test(value) ? (
          <span style={{ color: numberColor }}>{value}</span>
        ) : (
          <span style={{ color: stringColor }}>{value}</span>
        );
      return (
        <>
          {spaces}
          <span style={{ color: keyColor }}>
            {"- "}
            {realKey}
          </span>
          :{value !== "" && <> {coloredValue}</>}
        </>
      );
    }

    const coloredValue =
      value === "" ? null : key === "kind" && value === "ReplicaSet" ? (
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

const features = [
  { check: true, text: "matchLabels (equality-based)" },
  { check: true, text: "matchExpressions (set-based)" },
  { check: true, text: "Maintains desired pod count" },
  { check: true, text: "Used internally by Deployments" },
  { check: true, text: "Works with rolling updates" },
  { check: false, text: "Version rollbacks (v1→v2→v1)" },
];

const selectors = [
  {
    type: "matchLabels",
    desc: "Equality-based — matches pods with specific labels",
    example: "app: greenapp-pod",
  },
  {
    type: "matchExpressions",
    desc: "Set-based — supports In, NotIn, Exists, DoesNotExist",
    example: "In (dev, staging, prod)",
  },
];

const probes = [
  {
    name: "startupProbe",
    color: "blue",
    purpose: "Slow-starting containers",
    timing: "Runs first, disables others until success",
  },
  {
    name: "livenessProbe",
    color: "green",
    purpose: "Container health check",
    timing: "Periodic — restarts on failure",
  },
  {
    name: "readinessProbe",
    color: "amber",
    purpose: "Traffic readiness",
    timing: "Periodic — removes from service on failure",
  },
];

const rolloutCmds = [
  "kubectl rollout status",
  "kubectl rollout history",
  "kubectl rollout undo",
];

export default function ReplicaSet() {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── palette ──────────────────────────────────────────────────────────────
  const bg = isDark ? "#0f0f1a" : "#f0f4ff";
  const cardBg = isDark ? "#0a0a12" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#07070e" : "#f5f7ff";
  const codeBorder = isDark ? "#1a1a2a" : "#dde3f5";

  const txt = isDark ? "#ffffff" : "#0f172a";
  const txtSec = isDark ? "rgba(255,255,255,0.5)" : "#475569";
  const txtMuted = isDark ? "rgba(255,255,255,0.3)" : "#94a3b8";

  const green = isDark ? "#00ff88" : "#059669";
  const greenAlpha = isDark ? "rgba(0,255,136,0.08)" : "rgba(5,150,105,0.06)";
  const greenBorder = isDark ? "rgba(0,255,136,0.25)" : "rgba(5,150,105,0.2)";

  const blue = isDark ? "#7dd3fc" : "#0284c7";
  const blueAlpha = isDark ? "rgba(125,211,252,0.07)" : "rgba(2,132,199,0.05)";
  const blueBorder = isDark ? "rgba(125,211,252,0.2)" : "rgba(2,132,199,0.15)";

  const purple = isDark ? "#c4b5fd" : "#7c3aed";
  const purpleAlpha = isDark
    ? "rgba(196,181,253,0.07)"
    : "rgba(124,58,237,0.05)";
  const purpleBorder = isDark
    ? "rgba(196,181,253,0.2)"
    : "rgba(124,58,237,0.15)";

  const amber = isDark ? "#fbbf24" : "#d97706";
  const amberAlpha = isDark ? "rgba(251,191,36,0.07)" : "rgba(217,119,6,0.05)";
  const amberBorder = isDark ? "rgba(251,191,36,0.2)" : "rgba(217,119,6,0.15)";

  const probeColors: Record<
    string,
    { color: string; alpha: string; border: string }
  > = {
    blue: { color: blue, alpha: blueAlpha, border: blueBorder },
    green: { color: green, alpha: greenAlpha, border: greenBorder },
    amber: { color: amber, alpha: amberAlpha, border: amberBorder },
  };

  const headerGrad = isDark
    ? "linear-gradient(135deg,#0f1e3a 0%,#0a0a12 60%)"
    : "linear-gradient(135deg,#dbeafe 0%,#ffffff 60%)";

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

        @keyframes dot-glow {
          0%,100% { opacity:1; box-shadow:0 0 8px ${green}; }
          50%      { opacity:0.3; box-shadow:0 0 2px ${green}; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }

        .rs-dot          { animation: dot-glow   2s ease-in-out infinite; }
        .rs-flow-arrow   { animation: arrow-fade 2s ease-in-out infinite; }
        .rs-copy:hover   { color:${green} !important; border-color:${greenBorder} !important; }
        .rs-feat:hover   { background:${greenAlpha} !important; transform:translateX(2px); }
        .rs-sel:hover    { background:${greenAlpha} !important; transform:translateX(3px); }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1320px",
          background: cardBg,
          borderRadius: "28px",
          border: `1px solid ${cardBorder}`,
          overflow: "hidden",
          transition: "background 0.3s,border-color 0.3s",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
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
              background: `radial-gradient(circle,${greenAlpha.replace("0.08", "0.18")} 0%,transparent 70%)`,
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
                  Modern Controller
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
                  Recommended
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
                ReplicaSet
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
                The improved version of ReplicationController —{" "}
                <strong style={{ color: green, fontWeight: 500 }}>
                  used by Deployments
                </strong>{" "}
                to manage Pods. Supports both equality and set-based selectors.
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
                className="rs-dot"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: green,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: green,
                }}
              >
                MODERN — USE THIS
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 600,
          }}
        >
          {/* ── Left ───────────────────────────────────────────────────── */}
          <div
            style={{
              borderRight: `1px solid ${divider}`,
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* API version tags */}
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
                    label: "apps/v1",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "ReplicaSet",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                ].map((t) => (
                  <span
                    key={t.label}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 5,
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      color: t.color,
                    }}
                  >
                    {t.label}
                  </span>
                ))}
              </div>

              {/* Key features grid */}
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
                  Key Features
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 12px",
                  }}
                >
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="rs-feat"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "5px 7px",
                        borderRadius: 6,
                        transition: "all 0.15s",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 10,
                          color: f.check ? green : amber,
                          lineHeight: 1.5,
                          flexShrink: 0,
                        }}
                      >
                        {f.check ? "✓" : "↻"}
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: txtSec,
                          lineHeight: 1.5,
                        }}
                      >
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: txtSec,
                  marginBottom: 14,
                }}
              >
                ReplicaSet ensures the specified number of Pod replicas are
                running at all times. It's the modern replacement for
                ReplicationController and the building block for Deployments.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  {
                    label: "Set-based selectors",
                    bg: greenAlpha,
                    border: greenBorder,
                    color: green,
                  },
                  {
                    label: "Rolling updates ready",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Deployment compatible",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                ].map((t) => (
                  <span
                    key={t.label}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      padding: "4px 12px",
                      borderRadius: 4,
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      color: t.color,
                    }}
                  >
                    {t.label}
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
                    textTransform: "uppercase",
                    color: txtMuted,
                  }}
                >
                  replicaset.yaml
                </span>
                <button
                  className="rs-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${isDark ? "#1e1e2e" : "#dde3f5"}`,
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
                  maxHeight: 360,
                }}
              >
                <div style={{ padding: "18px 22px" }}>
                  {yaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* kubectl bar */}
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
                lineHeight: 1.8,
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl get rs</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl scale rs rp-pod --replicas=3</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl describe rs rp-pod</span>
            </div>
          </div>

          {/* ── Right ──────────────────────────────────────────────────── */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {/* How it works flow */}
            <div>
              <SectionLabel
                label="How it works"
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
                      { icon: "🎯", label: "RS\ncreated", accent: false },
                      { icon: "5", label: "5\nreplicas", accent: true },
                      { icon: "📦", label: "Pod\nmanagement", accent: false },
                      { icon: "🔄", label: "Rolling\nupdates", accent: false },
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
                            ? greenAlpha
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${step.accent ? greenBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: step.icon === "5" ? 22 : 20,
                            fontFamily: step.icon === "5" ? mono : "inherit",
                            fontWeight: 700,
                            marginBottom: 7,
                            opacity: step.accent ? 1 : 0.55,
                            color: step.accent ? green : "inherit",
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
                      {idx < 3 && (
                        <div
                          className="rs-flow-arrow"
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
                  <span style={{ color: green }}>✓</span> Supports rolling
                  updates &amp; rollbacks via Deployment
                </div>
              </div>
            </div>

            {/* Selector types */}
            <div>
              <SectionLabel
                label="Selector types"
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
                {selectors.map((s, i) => (
                  <div
                    key={i}
                    className="rs-sel"
                    style={{
                      padding: "13px 18px",
                      borderBottom:
                        i !== selectors.length - 1
                          ? `1px solid ${divider}`
                          : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 11,
                          fontWeight: 700,
                          color: green,
                        }}
                      >
                        {s.type}
                      </span>
                      <span style={{ fontSize: 11.5, color: txtMuted }}>
                        {s.desc}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        color: blue,
                        background: blueAlpha,
                        border: `1px solid ${blueBorder}`,
                        padding: "3px 10px",
                        borderRadius: 4,
                        display: "inline-block",
                      }}
                    >
                      {s.example}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Probes */}
            <div>
              <SectionLabel
                label="Probes & health checks"
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
                {probes.map((p, i) => {
                  const pc = probeColors[p.color];
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "12px 18px",
                        borderBottom:
                          i !== probes.length - 1
                            ? `1px solid ${divider}`
                            : "none",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 9,
                          letterSpacing: "0.5px",
                          color: pc.color,
                          background: pc.alpha,
                          border: `1px solid ${pc.border}`,
                          borderRadius: 4,
                          padding: "3px 8px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {p.name}
                      </span>
                      <div>
                        <div
                          style={{ fontSize: 12, color: txt, marginBottom: 3 }}
                        >
                          {p.purpose}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 9.5,
                            color: txtMuted,
                          }}
                        >
                          {p.timing}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Version management */}
            <div
              style={{
                background: greenAlpha,
                border: `1px solid ${greenBorder}`,
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1.8px",
                    textTransform: "uppercase",
                    color: green,
                  }}
                >
                  Version Management
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: txtSec,
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                When used with Deployments, ReplicaSets enable seamless version
                rollbacks:{" "}
                <strong style={{ color: green, fontWeight: 500 }}>
                  v1 → v2 → v1
                </strong>{" "}
                without downtime.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {rolloutCmds.map((cmd) => (
                  <span
                    key={cmd}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: blue,
                      background: blueAlpha,
                      border: `1px solid ${blueBorder}`,
                      borderRadius: 4,
                      padding: "4px 10px",
                    }}
                  >
                    {cmd}
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

/* ── tiny helper ──────────────────────────────────────────────────────────── */
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
}
