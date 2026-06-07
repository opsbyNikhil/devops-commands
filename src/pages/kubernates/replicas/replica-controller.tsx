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
  const highlightColor = isDark ? "#ff4444" : "#dc2626";

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
      value === "" ? null : key === "kind" &&
        value === "ReplicationController" ? (
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

const limitations = [
  { text: "Equality-based selectors only (matchLabels)" },
  { text: "No matchExpressions (set-based) support" },
  { text: "Not used with modern Deployments" },
  { text: "No rolling updates or rollback support" },
];

const comparisons = [
  {
    feature: "Selector support",
    rc: "Equality-based only",
    rs: "Equality + Set-based",
  },
  { feature: "Rolling updates", rc: "Not supported", rs: "Supported" },
  { feature: "Rollbacks", rc: "Not supported", rs: "Supported" },
  { feature: "Deployments", rc: "Not compatible", rs: "Fully compatible" },
];

const legacyTags = [
  "kubectl rolling-update",
  "Equality selectors",
  "Deprecated API",
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

  // ── palette ──────────────────────────────────────────────────────────────
  const bg = isDark ? "#0d0005" : "#fff5f5";
  const cardBg = isDark ? "#09000a" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#070005" : "#fff5f5";
  const codeBorder = isDark ? "#280010" : "#fecaca";

  const txt = isDark ? "#ffffff" : "#0f172a";
  const txtSec = isDark ? "rgba(255,120,120,0.7)" : "#475569";
  const txtMuted = isDark ? "rgba(255,80,80,0.4)" : "#94a3b8";

  const red = isDark ? "#ff4444" : "#dc2626";
  const redAlpha = isDark ? "rgba(255,68,68,0.08)" : "rgba(220,38,38,0.06)";
  const redBorder = isDark ? "rgba(255,68,68,0.28)" : "rgba(220,38,38,0.2)";

  const green = isDark ? "#00ff88" : "#059669";
  const greenAlpha = isDark ? "rgba(0,255,136,0.08)" : "rgba(5,150,105,0.06)";
  const greenBorder = isDark ? "rgba(0,255,136,0.25)" : "rgba(5,150,105,0.2)";

  const blue = isDark ? "#7dd3fc" : "#0284c7";
  const blueAlpha = isDark ? "rgba(125,211,252,0.07)" : "rgba(2,132,199,0.05)";
  const blueBorder = isDark ? "rgba(125,211,252,0.2)" : "rgba(2,132,199,0.15)";

  const amber = isDark ? "#fbbf24" : "#d97706";
  const amberAlpha = isDark ? "rgba(251,191,36,0.08)" : "rgba(217,119,6,0.05)";
  const amberBorder = isDark ? "rgba(251,191,36,0.2)" : "rgba(217,119,6,0.15)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1e0010 0%,#09000a 60%)"
    : "linear-gradient(135deg,#fee2e2 0%,#ffffff 60%)";

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

        @keyframes warn-flash {
          0%,100% { opacity:1; }
          50%      { opacity:0.35; }
        }
        @keyframes arrow-fade {
          0%,100% { opacity:0.25; }
          50%      { opacity:1; }
        }

        .rc-warn           { animation: warn-flash  2s ease-in-out infinite; }
        .rc-flow-arrow     { animation: arrow-fade  2s ease-in-out infinite; }
        .rc-copy:hover     { color:${red} !important; border-color:${redBorder} !important; }
        .rc-lim:hover      { background:${redAlpha} !important; transform:translateX(2px); }
        .rc-compare:hover  { background:${redAlpha} !important; transform:translateX(3px); }
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
              background: `radial-gradient(circle,${redAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                    color: red,
                    textTransform: "uppercase",
                  }}
                >
                  Legacy Controller
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 9,
                    letterSpacing: "1px",
                    color: red,
                    background: redAlpha,
                    border: `1px solid ${redBorder}`,
                    borderRadius: 20,
                    padding: "2px 10px",
                  }}
                >
                  Deprecated
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
                ReplicationController
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
                The older way of managing Pods —{" "}
                <strong style={{ color: red, fontWeight: 500 }}>
                  mostly deprecated
                </strong>{" "}
                and replaced by ReplicaSets. Lacks rolling updates and set-based
                selectors.
              </div>
            </div>

            {/* badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: redAlpha,
                border: `1px solid ${redBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="rc-warn"
                style={{ fontFamily: mono, fontSize: 12, color: red }}
              >
                ⚠
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: red,
                }}
              >
                LEGACY — AVOID
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: 560,
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
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "ReplicationController",
                    bg: redAlpha,
                    border: redBorder,
                    color: red,
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

              {/* Key limitations */}
              <div
                style={{
                  background: redAlpha,
                  border: `1px solid ${redBorder}`,
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
                    color: red,
                    marginBottom: 12,
                  }}
                >
                  Key Limitations
                </div>
                {limitations.map((lim, i) => (
                  <div
                    key={i}
                    className="rc-lim"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "5px 7px",
                      borderRadius: 6,
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 10,
                        color: red,
                        lineHeight: 1.6,
                        flexShrink: 0,
                      }}
                    >
                      ✗
                    </span>
                    <span
                      style={{ fontSize: 11.5, color: txtSec, lineHeight: 1.5 }}
                    >
                      {lim.text}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: txtSec,
                  marginBottom: 14,
                }}
              >
                ReplicationController ensures the specified number of Pod
                replicas are running at all times. However, it lacks many
                features available in modern ReplicaSets and Deployments.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  {
                    label: "Equality selectors only",
                    bg: redAlpha,
                    border: redBorder,
                    color: red,
                  },
                  {
                    label: "No rolling updates",
                    bg: amberAlpha,
                    border: amberBorder,
                    color: amber,
                  },
                  {
                    label: "Legacy controller",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
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
                  replicationcontroller.yaml
                </span>
                <button
                  className="rc-copy"
                  onClick={handleCopy}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${isDark ? "#280010" : "#fecaca"}`,
                    background: "transparent",
                    color: copied ? red : txtMuted,
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
                  {yaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Important note */}
            <div
              style={{
                background: amberAlpha,
                border: `1px solid ${amberBorder}`,
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
                  color: amber,
                  marginBottom: 8,
                }}
              >
                Important Note
              </div>
              <p style={{ fontSize: 12.5, color: txtSec, lineHeight: 1.6 }}>
                Kubernetes does{" "}
                <strong style={{ color: amber, fontWeight: 500 }}>
                  not guarantee
                </strong>{" "}
                the order of Pod creation or deletion. When scaling to 6
                replicas, Pod names and deletion order are non-deterministic.
              </p>
            </div>

            {/* kubectl bar */}
            <div
              style={{
                fontFamily: mono,
                fontSize: 10.5,
                padding: "10px 16px",
                borderRadius: 8,
                background: redAlpha,
                border: `1px solid ${redBorder}`,
                color: red,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl get rc</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>kubectl scale rc pod-rpc --replicas=3</span>
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
                      { icon: "🎯", label: "RC\ncreated", accent: false },
                      { icon: "5", label: "5\nreplicas", accent: true },
                      { icon: "📦", label: "Pod\nmanagement", accent: false },
                      {
                        icon: "✗",
                        label: "No rolling\nupdates",
                        accent: false,
                        danger: true,
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
                            ? greenAlpha
                            : ("danger" in step && step.danger)
                                            ? redAlpha
                                            : "rgba(255,255,255,0.03)",
                                          border: `1px solid ${step.accent ? greenBorder : ("danger" in step && step.danger) ? redBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              step.icon === "5"
                                ? 22
                                : step.icon === "✗"
                                  ? 18
                                  : 20,
                            fontFamily:
                              step.icon === "5" || step.icon === "✗"
                                ? mono
                                : "inherit",
                            fontWeight: 700,
                            marginBottom: 7,
                            opacity: step.accent ? 1 : ("danger" in step && step.danger) ? 1 : 0.55,
                            color: step.accent
                              ? green
                              : ("danger" in step && step.danger)
                                ? red
                                : "inherit",
                          }}
                        >
                          {step.icon}
                        </div>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: 9.5,
                            lineHeight: 1.5,
                            color: step.accent
                              ? green
                              : ("danger" in step && step.danger)
                                ? red
                                : txtSec,
                            whiteSpace: "pre",
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                      {idx < 3 && (
                        <div
                          className="rc-flow-arrow"
                          style={{ fontSize: 16, color: red, padding: "0 6px" }}
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
                  <span style={{ color: red }}>⚠</span> Maintains replica count
                  but lacks update strategies
                </div>
              </div>
            </div>

            {/* RC vs ReplicaSet comparison table */}
            <div>
              <SectionLabel
                label="RC vs ReplicaSet"
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
                {/* table header */}
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
                      color: red,
                    }}
                  >
                    ReplicationController
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: green,
                    }}
                  >
                    ReplicaSet
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="rc-compare"
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
                    <span style={{ fontSize: 11.5, color: red }}>
                      {item.rc}
                    </span>
                    <span style={{ fontSize: 11.5, color: green }}>
                      {item.rs}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Migration path */}
            <div>
              <SectionLabel
                label="Migration path"
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
                  Recommended: use Deployment
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  Modern workloads should use{" "}
                  <strong style={{ color: green, fontWeight: 500 }}>
                    Deployments
                  </strong>{" "}
                  which manage ReplicaSets and provide rolling updates,
                  rollbacks, and better selector support.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {legacyTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      color: red,
                      background: redAlpha,
                      border: `1px solid ${redBorder}`,
                      borderRadius: 4,
                      padding: "4px 12px",
                      textDecoration: "line-through",
                      textDecorationColor: red,
                    }}
                  >
                    {tag}
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
