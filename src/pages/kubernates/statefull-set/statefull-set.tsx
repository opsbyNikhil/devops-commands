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
    highlight: isDark ? "#c084fc" : "#9333ea", // purple for StatefulSet specific fields
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

    // Highlight StatefulSet specific keys
    const isStatefulKey =
      key === "serviceName" ||
      key === "volumeClaimTemplates" ||
      key === "accessModes" ||
      key === "storage" ||
      key === "StatefulSet";
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
            color: isStatefulKey ? colors.highlight : colors.key,
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
// Main component – StatefulSet
// ----------------------------------------------
const StatefulSetComponent = () => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const statefulSetYaml = `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: my-db
  namespace: dev
spec:
  minReadySeconds: 5
  replicas: 5
  selector:
    matchLabels:
      app: my-app-db
  serviceName: my-db-svc
  template:
    metadata:
      labels:
        app: my-app-db
    spec:
      containers:
      - name: my-db-cont
        image: mysql
        ports:
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: root
        - name: MYSQL_DATABASE
          value: Devops_course
        - name: MYSQL_USER
          value: Devops
        - name: MYSQL_PASSWORD
          value: Devops@12345
        volumeMounts:
        - name: mysql-db
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: mysql-db
    spec:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 2Gi`;

  const serviceYaml = `apiVersion: v1
kind: Service
metadata:
  name: my-db-svc
  namespace: dev
spec:
  type: ClusterIP
  clusterIP: None
  selector:
    app: my-app-db
  ports:
  - port: 3306`;

  const handleCopyStatefulSet = () => {
    navigator.clipboard.writeText(statefulSetYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyService = () => {
    navigator.clipboard.writeText(serviceYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme‑aware colour palette (purple/indigo for StatefulSet)
  const bg = isDark ? "#0f0a12" : "#faf5ff";
  const cardBg = isDark ? "#150f18" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const codeBg = isDark ? "#0a0710" : "#f8fafc";
  const codeBorder = isDark ? "#33213a" : "#e2e8f0";

  const txt = isDark ? "#ffffff" : "#0f172a";
  const txtSec = isDark ? "rgba(220,180,200,0.7)" : "#475569";
  const txtMuted = isDark ? "rgba(249,168,212,0.4)" : "#64748b";

  // Primary accent = purple (StatefulSet)
  const purple = isDark ? "#c084fc" : "#8b5cf6";
  const purpleAlpha = isDark
    ? "rgba(192,132,252,0.08)"
    : "rgba(139,92,246,0.06)";
  const purpleBorder = isDark
    ? "rgba(192,132,252,0.28)"
    : "rgba(139,92,246,0.2)";

  const blue = isDark ? "#7dd3fc" : "#0284c7";
  const blueAlpha = isDark ? "rgba(125,211,252,0.07)" : "rgba(2,132,199,0.05)";
  const blueBorder = isDark ? "rgba(125,211,252,0.22)" : "rgba(2,132,199,0.15)";

  const green = isDark ? "#34d399" : "#059669";
  const greenAlpha = isDark ? "rgba(52,211,153,0.07)" : "rgba(5,150,105,0.05)";

  const orange = isDark ? "#fbbf24" : "#d97706";
  const orangeAlpha = isDark ? "rgba(251,191,36,0.07)" : "rgba(217,119,6,0.05)";

  const headerGrad = isDark
    ? "linear-gradient(135deg,#1a0f1f 0%,#150f18 60%)"
    : "linear-gradient(135deg,#f3e8ff 0%,#ffffff 60%)";

  const mono = "'Space Mono','SF Mono','Menlo',monospace";
  const sans = "'Outfit','Inter',-apple-system,BlinkMacSystemFont,sans-serif";

  // Steps for using StatefulSet
  const steps = [
    {
      id: 1,
      title: "Create namespace",
      description: "StatefulSet is created in its own namespace for isolation.",
      cmd: "kubectl create namespace dev",
      accentColor: blue,
      accentBg: blueAlpha,
      accentBorder: blueBorder,
    },
    {
      id: 2,
      title: "Apply Service & StatefulSet",
      description: "Apply the headless service and the StatefulSet manifest.",
      cmd: "kubectl apply -f .",
      accentColor: purple,
      accentBg: purpleAlpha,
      accentBorder: purpleBorder,
    },
    {
      id: 3,
      title: "Set namespace context",
      description: "Switch to the dev namespace for easier access.",
      cmd: "kubectl config set-context --current --namespace=dev",
      accentColor: green,
      accentBg: greenAlpha,
      accentBorder: "rgba(52,211,153,0.22)",
    },
    {
      id: 4,
      title: "Verify pods",
      description:
        "StatefulSet creates pods in order (0,1,2,3,4) with stable names.",
      cmd: "kubectl get all",
      accentColor: purple,
      accentBg: purpleAlpha,
      accentBorder: purpleBorder,
    },
    {
      id: 5,
      title: "Connect to database",
      description: "Exec into a pod and access the MySQL database.",
      cmd: "kubectl exec -it my-db-0 -n dev -- mysql -u Devops -p",
      accentColor: orange,
      accentBg: orangeAlpha,
      accentBorder: "rgba(251,191,36,0.22)",
    },
  ];

  // Behavior matrix: ordered pod management
  const behaviors = [
    {
      pod: "my-db-0",
      behavior: "Created first, deleted last. Stable network identity.",
    },
    {
      pod: "my-db-1",
      behavior: "Created after pod-0 is ready, deleted after pod-0.",
    },
    {
      pod: "my-db-2",
      behavior: "Sequential creation and deletion.",
    },
    {
      pod: "my-db-3",
      behavior: "Ordered pod naming ensures deterministic identity.",
    },
    {
      pod: "my-db-4",
      behavior: "Last to be created, first to be deleted (on scale down).",
    },
  ];

  // Comparison: StatefulSet vs Deployment
  const comparisons = [
    {
      feature: "Pod naming",
      statefulSet: "Stable, predictable (e.g., my-db-0, my-db-1)",
      deployment: "Random suffix (e.g., my-db-xyz-abc)",
    },
    {
      feature: "Storage",
      statefulSet: "Persistent storage per pod (PVC template)",
      deployment: "Ephemeral (shared or no persistent storage)",
    },
    {
      feature: "Scaling",
      statefulSet: "Ordered (one at a time)",
      deployment: "Parallel (all at once)",
    },
    {
      feature: "Network identity",
      statefulSet: "Stable DNS name (pod-name.service-name)",
      deployment: "Unstable (replaced on update)",
    },
    {
      feature: "Use case",
      statefulSet: "Databases, message queues, stateful apps",
      deployment: "Stateless apps (web servers, APIs)",
    },
  ];

  // Best for tags
  const bestFor = [
    "Databases (MySQL, PostgreSQL, MongoDB)",
    "Message queues (Kafka, RabbitMQ)",
    "Distributed systems",
    "Any workload requiring stable identity",
  ];

  // Persistent storage explanation points
  const storagePoints = [
    "Each pod gets its own PersistentVolumeClaim from the volumeClaimTemplates.",
    "PVCs are named: <claim-name>-<pod-name> (e.g., mysql-db-my-db-0)",
    "Pods retain their storage even after rescheduling.",
    "Access mode: ReadWriteOnce (single node) is common for databases.",
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

        .ss-pulse       { animation: pulse-glow 2s ease-in-out infinite; }
        .ss-arrow       { animation: arrow-fade 2s ease-in-out infinite; }
        .ss-copy:hover  { color:${purple} !important; border-color:${purpleBorder} !important; }
        .ss-step:hover  { background:${purpleAlpha} !important; transform:translateX(2px); }
        .ss-row:hover   { background:${purpleAlpha} !important; transform:translateX(3px); }
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
              background: `radial-gradient(circle,${purpleAlpha.replace("0.08", "0.22")} 0%,transparent 70%)`,
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
                    color: purple,
                    textTransform: "uppercase",
                  }}
                >
                  Kubernetes · Stateful Workload
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
                  apps/v1 · StatefulSet
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
                <span style={{ color: purple }}>StatefulSet</span> – Persistent
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
                Manages stateful applications with stable network identities and
                persistent storage. Each pod gets a dedicated Persistent Volume
                and a predictable hostname (e.g., <code>my-db-0</code>).
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: purpleAlpha,
                border: `1px solid ${purpleBorder}`,
                borderRadius: 40,
                padding: "6px 18px",
                alignSelf: "flex-start",
              }}
            >
              <span
                className="ss-pulse"
                style={{ fontFamily: mono, fontSize: 12, color: purple }}
              >
                ●
              </span>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 10,
                  letterSpacing: "1.5px",
                  color: purple,
                }}
              >
                STATEFULSET DEMO
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
                    label: "serviceName",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                  {
                    label: "volumeClaimTemplates",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Persistent Storage",
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
                  background: purpleAlpha,
                  border: `1px solid ${purpleBorder}`,
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
                    color: purple,
                    marginBottom: 12,
                  }}
                >
                  Setup Steps
                </div>

                {steps.map((step, idx) => (
                  <div key={step.id}>
                    <div
                      className="ss-step"
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
                          className="ss-arrow"
                          style={{ color: purple, fontSize: 14 }}
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
                    label: "Stable network ID",
                    bg: purpleAlpha,
                    border: purpleBorder,
                    color: purple,
                  },
                  {
                    label: "Ordered deployment",
                    bg: blueAlpha,
                    border: blueBorder,
                    color: blue,
                  },
                  {
                    label: "Persistent volumes",
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

            {/* YAML block: StatefulSet */}
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
                  statefulset.yaml
                </span>
                <button
                  className="ss-copy"
                  onClick={handleCopyStatefulSet}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
                    background: "transparent",
                    color: copied ? purple : txtMuted,
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
                  {statefulSetYaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* YAML block: Headless Service */}
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
                  headless-service.yaml
                </span>
                <button
                  className="ss-copy"
                  onClick={handleCopyService}
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    padding: "4px 12px",
                    borderRadius: 5,
                    border: `1px solid ${codeBorder}`,
                    background: "transparent",
                    color: copied ? purple : txtMuted,
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
                  {serviceYaml.split("\n").map((line, i) => (
                    <YamlLine key={i} line={line} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>

            {/* Important note - Storage */}
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
                Persistent Storage
              </div>
              {storagePoints.map((point, idx) => (
                <p
                  key={idx}
                  style={{
                    fontSize: 12.5,
                    color: txtSec,
                    lineHeight: 1.6,
                    marginBottom: idx === storagePoints.length - 1 ? 0 : 8,
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
                background: purpleAlpha,
                border: `1px solid ${purpleBorder}`,
                color: purple,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: txtMuted, flexShrink: 0 }}>$</span>
              <span>kubectl exec -it my-db-0 -n dev -- mysql -u Devops -p</span>
              <span style={{ color: txtMuted }}>·</span>
              <span>show databases; use Devops_course;</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Flow, matrix, comparison, database ops, best for */}
          <div
            style={{
              padding: "26px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            {/* Ordered pod flow diagram */}
            <div>
              <SectionLabel
                label="Ordered pod creation"
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
                      { icon: "0️⃣", label: "my-db-0\nCreated", accent: true },
                      { icon: "⏱️", label: "Wait\nReady", accent: false },
                      { icon: "1️⃣", label: "my-db-1\nCreated", accent: false },
                      { icon: "...", label: "Up to\nN-1", accent: false },
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
                            ? purpleAlpha
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${step.accent ? purpleBorder : divider}`,
                          borderRadius: 10,
                          padding: "12px 6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 22,
                            marginBottom: 7,
                            color: step.accent ? purple : "inherit",
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
                            color: step.accent ? purple : txtSec,
                            whiteSpace: "pre",
                          }}
                        >
                          {step.label}
                        </div>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className="ss-arrow"
                          style={{
                            fontSize: 16,
                            color: purple,
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
                  <span style={{ color: purple }}>✓</span> Pods created in
                  strict order (0 → N-1). Deletion is reverse order (N-1 → 0).
                </div>
              </div>
            </div>

            {/* Behavior matrix */}
            <div>
              <SectionLabel
                label="Pod identity & ordering"
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
                {behaviors.map((item, i) => (
                  <div
                    key={i}
                    className="ss-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 18px",
                      borderBottom:
                        i !== behaviors.length - 1
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
                      {item.pod}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: txtSec,
                        textAlign: "right",
                        maxWidth: "60%",
                      }}
                    >
                      {item.behavior}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison: StatefulSet vs Deployment */}
            <div>
              <SectionLabel
                label="StatefulSet vs Deployment"
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
                      color: purple,
                    }}
                  >
                    StatefulSet
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: "1px",
                      color: blue,
                    }}
                  >
                    Deployment
                  </span>
                </div>
                {comparisons.map((item, i) => (
                  <div
                    key={i}
                    className="ss-row"
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
                    <span style={{ fontSize: 11.5, color: purple }}>
                      {item.statefulSet}
                    </span>
                    <span style={{ fontSize: 11.5, color: blue }}>
                      {item.deployment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Database Operations (MySQL) ── */}
            <div>
              <SectionLabel
                label="Database operations (MySQL)"
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
                    color: purple,
                    marginBottom: 12,
                  }}
                >
                  # Connect to the database pod
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
                    kubectl exec -it my-db-0 -n dev -- bash
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: purple,
                    marginBottom: 12,
                  }}
                >
                  # Inside the container, navigate to MySQL data dir and login
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
                  <span style={{ color: green }}>cd /var/lib/mysql</span>
                  <br />
                  <span style={{ color: txtMuted }}>$ </span>
                  <span style={{ color: green }}>mysql -u Devops -p</span>
                  <span style={{ color: txtMuted }}>
                    {" "}
                    # password: Devops@12345
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: purple,
                    marginBottom: 12,
                  }}
                >
                  # MySQL commands
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
                  <span style={{ color: blue }}>mysql&gt; </span>
                  <span style={{ color: txt }}>show databases;</span>
                  <br />
                  <span style={{ color: txtMuted }}>
                    # Expected: Devops_course, information_schema,
                    performance_schema
                  </span>
                  <br />
                  <br />
                  <span style={{ color: blue }}>mysql&gt; </span>
                  <span style={{ color: txt }}>use Devops_course;</span>
                  <br />
                  <span style={{ color: txtMuted }}># Database changed</span>
                  <br />
                  <br />
                  <span style={{ color: blue }}>mysql&gt; </span>
                  <span style={{ color: txt }}>
                    create table my_devops(name varchar(50));
                  </span>
                  <br />
                  <span style={{ color: txtMuted }}>
                    # Query OK, 0 rows affected
                  </span>
                  <br />
                  <br />
                  <span style={{ color: blue }}>mysql&gt; </span>
                  <span style={{ color: txt }}>
                    insert into my_devops values("Terraform");
                  </span>
                  <br />
                  <span style={{ color: txtMuted }}>
                    # Query OK, 1 row affected
                  </span>
                  <br />
                  <br />
                  <span style={{ color: blue }}>mysql&gt; </span>
                  <span style={{ color: txt }}>
                    insert into my_devops
                    values("Docker"),("Linux"),("GitHub"),("Kubernates");
                  </span>
                  <br />
                  <span style={{ color: txtMuted }}>
                    # Query OK, 4 rows affected
                  </span>
                  <br />
                  <br />
                  <span style={{ color: blue }}>mysql&gt; </span>
                  <span style={{ color: txt }}>select * from my_devops;</span>
                  <br />
                  <span style={{ color: txtMuted }}># Expected output:</span>
                  <br />
                  <span style={{ color: txtMuted }}># +------------+</span>
                  <br />
                  <span style={{ color: txtMuted }}># | name |</span>
                  <br />
                  <span style={{ color: txtMuted }}># +------------+</span>
                  <br />
                  <span style={{ color: txtMuted }}># | Terraform |</span>
                  <br />
                  <span style={{ color: txtMuted }}># | Docker |</span>
                  <br />
                  <span style={{ color: txtMuted }}># | Linux |</span>
                  <br />
                  <span style={{ color: txtMuted }}># | GitHub |</span>
                  <br />
                  <span style={{ color: txtMuted }}># | Kubernates |</span>
                  <br />
                  <span style={{ color: txtMuted }}># +------------+</span>
                </div>
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
                  background: purpleAlpha,
                  border: `1px solid ${purpleBorder}`,
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
                    color: purple,
                    marginBottom: 8,
                  }}
                >
                  Use a headless service for stable DNS
                </div>
                <p style={{ fontSize: 13, color: txtSec, lineHeight: 1.6 }}>
                  Always define a headless service (<code>clusterIP: None</code>
                  ) to provide stable network identities. Pods become reachable
                  at{" "}
                  <code>
                    &lt;pod-name&gt;.&lt;service-name&gt;.&lt;namespace&gt;.svc.cluster.local
                  </code>
                  . Use <code>volumeClaimTemplates</code> for per‑pod persistent
                  storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatefulSetComponent;
