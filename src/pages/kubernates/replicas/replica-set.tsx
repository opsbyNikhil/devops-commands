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
      ) : key === "kind" && value === "ReplicaSet" ? (
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

const features = [
  { icon: "✅", text: "Supports matchLabels (equality-based selectors)" },
  { icon: "✅", text: "Supports matchExpressions (set-based selectors)" },
  { icon: "✅", text: "Ensures desired number of Pods are running" },
  { icon: "✅", text: "Used internally by Deployments" },
  { icon: "✅", text: "Works with rolling updates (via Deployment)" },
  { icon: "🔄", text: "Supports version rollbacks (v1 → v2 → v1)" },
];

const selectors = [
  {
    type: "matchLabels",
    description: "Equality-based - matches pods with specific labels",
    example: "app: greenapp-pod",
  },
  {
    type: "matchExpressions",
    description: "Set-based - supports In, NotIn, Exists, DoesNotExist",
    example: "In (dev, staging, prod)",
  },
];

const probes = [
  {
    name: "startupProbe",
    purpose: "Slow-starting containers",
    timing: "Runs first, disables other probes until success",
  },
  {
    name: "livenessProbe",
    purpose: "Container health check",
    timing: "Runs periodically, restarts on failure",
  },
  {
    name: "readinessProbe",
    purpose: "Traffic readiness",
    timing: "Runs periodically, removes from service on failure",
  },
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
  const accentGreen = isDark ? "#34d399" : "#059669";
  const accentGreenLight = isDark
    ? "rgba(52,211,153,0.08)"
    : "rgba(5,150,105,0.06)";
  const accentGreenBorder = isDark
    ? "rgba(52,211,153,0.2)"
    : "rgba(5,150,105,0.15)";
  const accentBlue = isDark ? "#7dd3fc" : "#0284c7";
  const accentPurple = isDark ? "#c4b5fd" : "#7c3aed";
  const accentYellow = isDark ? "#fbbf24" : "#d97706";

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
        @keyframes successPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${accentGreen}66; }
          50% { box-shadow: 0 0 0 8px ${accentGreen}00; }
        }
        .flow-arrow { animation: fadePulse 2s ease-in-out infinite; }
        .copy-btn-rs:hover {
          background: ${accentGreenLight} !important;
          border-color: ${accentGreen} !important;
        }
        .feature-item:hover {
          background: ${accentGreenLight} !important;
          transform: translateX(3px);
        }
        .selector-item:hover {
          background: ${isDark ? "rgba(52,211,153,0.05)" : "rgba(5,150,105,0.03)"};
          transform: translateX(3px);
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
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
                    color: accentGreen,
                    textTransform: "uppercase",
                  }}
                >
                  Modern Controller
                </span>
                <span
                  style={{
                    background: accentGreenLight,
                    border: `1px solid ${accentGreenBorder}`,
                    borderRadius: "20px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: accentGreen,
                  }}
                >
                  Recommended
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
                ReplicaSet
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: textSecondary,
                  marginTop: "10px",
                  maxWidth: "560px",
                  lineHeight: 1.5,
                }}
              >
                The improved version of ReplicationController —{" "}
                <strong style={{ color: accentGreen, fontWeight: 500 }}>
                  used by Deployments
                </strong>{" "}
                to manage Pods. Supports both equality and set-based selectors.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                background: accentGreenLight,
                padding: "6px 16px",
                borderRadius: "40px",
                border: `1px solid ${accentGreenBorder}`,
              }}
            >
              <span style={{ fontSize: "14px", color: accentGreen }}>✓</span>
              <span
                style={{
                  fontSize: "12px",
                  color: textSecondary,
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                }}
              >
                MODERN — USE THIS
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            minHeight: "580px",
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
                  apps/v1
                </span>
                <span
                  style={{
                    background: isDark
                      ? "rgba(52,211,153,0.12)"
                      : "rgba(5,150,105,0.06)",
                    color: accentGreen,
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontFamily: "'SF Mono', monospace",
                  }}
                >
                  ReplicaSet
                </span>
              </div>

              {/* Features Section */}
              <div
                style={{
                  background: accentGreenLight,
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "20px",
                  border: `1px solid ${accentGreenBorder}`,
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: accentGreen,
                    marginBottom: "12px",
                    letterSpacing: "0.3px",
                  }}
                >
                  ✨ Key Features
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  {features.map((feat, i) => (
                    <div
                      key={i}
                      className="feature-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 8px",
                        transition: "all 0.2s",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>{feat.icon}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: textSecondary,
                          lineHeight: 1.4,
                        }}
                      >
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: textSecondary,
                  marginBottom: "16px",
                }}
              >
                ReplicaSet ensures that the specified number of Pod replicas are
                running at all times. It's the modern replacement for
                ReplicationController and is the building block for Deployments.
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
                  { label: "Set-based selectors", color: accentGreen },
                  { label: "Rolling updates ready", color: accentBlue },
                  { label: "Deployment compatible", color: accentPurple },
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
                  Example — replicaset.yaml
                </span>
                <button
                  className="copy-btn-rs"
                  onClick={handleCopy}
                  style={{
                    background: "transparent",
                    border: `1px solid ${isDark ? "#2a2a35" : "#e2e8f0"}`,
                    borderRadius: "8px",
                    color: copied ? accentGreen : textMuted,
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
                  maxHeight: "400px",
                }}
              >
                <div style={{ padding: "20px 24px" }}>
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
                  color: accentGreen,
                  background: "transparent",
                  fontFamily: "'SF Mono', monospace",
                  fontWeight: 450,
                }}
              >
                kubectl get rs &nbsp;&nbsp; kubectl scale rs rp-pod --replicas=3
                &nbsp;&nbsp; kubectl describe rs rp-pod
              </code>
            </div>
          </div>

          {/* RIGHT COLUMN: Visual + Selector Info */}
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
                    "ReplicaSet Created",
                    "5 Replicas",
                    "Pod Management",
                    "Rolling Updates",
                  ].map((step, idx) => (
                    <div key={step} style={{ flex: 1, textAlign: "center" }}>
                      <div
                        style={{
                          background: idx === 1 ? accentGreenLight : tagBg,
                          border:
                            idx === 1
                              ? `1px solid ${accentGreenBorder}`
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
                                : "🔄"}
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
                            color: accentGreen,
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
                  <span style={{ color: accentGreen }}>✓</span> Supports rolling
                  updates & rollbacks via Deployment
                </div>
              </div>
            </div>

            {/* Selector Types */}
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
                Selector Types
              </div>
              <div
                style={{
                  background: codeBg,
                  borderRadius: "16px",
                  border: `1px solid ${codeBorder}`,
                  overflow: "hidden",
                }}
              >
                {selectors.map((selector, i) => (
                  <div
                    key={i}
                    className="selector-item"
                    style={{
                      padding: "14px 16px",
                      borderBottom:
                        i !== selectors.length - 1
                          ? `1px solid ${headerBorder}`
                          : "none",
                      transition: "all 0.2s",
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
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: accentGreen,
                        }}
                      >
                        {selector.type}
                      </span>
                      <span style={{ fontSize: "11px", color: textMuted }}>
                        {selector.description}
                      </span>
                    </div>
                    <code
                      style={{
                        fontSize: "11px",
                        color: accentBlue,
                        background: isDark
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(0,0,0,0.04)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        display: "inline-block",
                        fontFamily: "'SF Mono', monospace",
                      }}
                    >
                      {selector.example}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Probes Explanation */}
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
                Probes & Health Checks
              </div>
              <div
                style={{
                  background: codeBg,
                  borderRadius: "16px",
                  border: `1px solid ${codeBorder}`,
                  overflow: "hidden",
                }}
              >
                {probes.map((probe, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px",
                      borderBottom:
                        i !== probes.length - 1
                          ? `1px solid ${headerBorder}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: accentYellow,
                        }}
                      >
                        {probe.name}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: textSecondary,
                        marginBottom: "4px",
                      }}
                    >
                      {probe.purpose}
                    </div>
                    <div style={{ fontSize: "10px", color: textMuted }}>
                      {probe.timing}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Rollback Note */}
            <div
              style={{
                background: isDark
                  ? "rgba(52,211,153,0.06)"
                  : "rgba(5,150,105,0.04)",
                border: `1px solid ${accentGreenBorder}`,
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
                  Version Management
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: textSecondary,
                  lineHeight: 1.5,
                }}
              >
                When used with Deployments, ReplicaSets enable seamless version
                rollbacks:
                <strong style={{ color: accentGreen }}> v1 → v2 → v1 </strong>
                without downtime.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {[
                  "kubectl rollout status",
                  "kubectl rollout history",
                  "kubectl rollout undo",
                ].map((cmd) => (
                  <code
                    key={cmd}
                    style={{
                      fontSize: "10px",
                      color: accentBlue,
                      background: isDark
                        ? "rgba(0,0,0,0.3)"
                        : "rgba(0,0,0,0.04)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
