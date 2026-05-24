import React, { useEffect, useState } from "react";

// ── Pod data derived from the YAML ──
const POD_SPEC = {
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "my-pod-testing",
  },
  spec: {
    containers: [
      {
        image: "httpd:latest",
        name: "my-test-image",
        ports: [{ containerPort: 8080, protocol: "TCP" }],
      },
    ],
  },
};

// ── Status cycle for demo purposes ──
const STATUS_PHASES = [
  "Pending",
  "Pending",
  "ContainerCreating",
  "Running",
] as const;
type Phase = (typeof STATUS_PHASES)[number];

const PHASE_COLOR: Record<Phase, string> = {
  Pending: "#f59e0b",
  ContainerCreating: "#06b6d4",
  Running: "#22c55e",
};

const PHASE_BG: Record<Phase, string> = {
  Pending: "rgba(245,158,11,0.1)",
  ContainerCreating: "rgba(6,182,212,0.1)",
  Running: "rgba(34,197,94,0.1)",
};

// ── Small reusable label/value row ──
function InfoRow({
  label,
  value,
  valueColor = "#94a3b8",
  mono = true,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 0",
        borderBottom: "1px solid rgba(50,108,229,0.07)",
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "#475569",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: valueColor,
          fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Panel wrapper ──
function Panel({
  title,
  dotColor = "#326CE5",
  children,
  style,
}: {
  title: string;
  dotColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(6,10,26,0.85)",
        border: "1px solid rgba(50,108,229,0.18)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          background: "rgba(50,108,229,0.08)",
          borderBottom: "1px solid rgba(50,108,229,0.15)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}`,
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: dotColor,
            textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "10px 14px", flex: 1 }}>{children}</div>
    </div>
  );
}

// ── Container card ──
function ContainerCard({
  container,
  podPhase,
}: {
  container: (typeof POD_SPEC.spec.containers)[0];
  podPhase: Phase;
}) {
  const isRunning = podPhase === "Running";
  const stateColor = isRunning ? "#22c55e" : "#f59e0b";

  return (
    <div
      style={{
        background: "rgba(50,108,229,0.04)",
        border: "1px solid rgba(50,108,229,0.15)",
        borderRadius: 8,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {/* Container header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        {/* Docker icon */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect
            width="22"
            height="22"
            rx="5"
            fill="rgba(6,182,212,0.1)"
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="0.8"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect
              key={i}
              x={3 + (i % 3) * 5.5}
              y={6 + Math.floor(i / 3) * 4}
              width="4"
              height="3"
              rx="0.5"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="0.7"
            />
          ))}
        </svg>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f1f5f9",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {container.name}
          </div>
          <div
            style={{ fontSize: 9, color: "#475569", letterSpacing: "0.08em" }}
          >
            CONTAINER
          </div>
        </div>
        {/* State badge */}
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: stateColor,
              background: `${stateColor}15`,
              border: `1px solid ${stateColor}30`,
              padding: "2px 8px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {isRunning ? "RUNNING" : "WAITING"}
          </span>
        </div>
      </div>

      <InfoRow label="Image" value={container.image} valueColor="#06b6d4" />

      {/* Ports */}
      <div style={{ marginTop: 4 }}>
        <div
          style={{
            fontSize: 9,
            color: "#475569",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Ports
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {container.ports.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(50,108,229,0.08)",
                border: "1px solid rgba(50,108,229,0.2)",
                borderRadius: 6,
                padding: "4px 10px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#326CE5" strokeWidth="1" />
                <circle
                  cx="5"
                  cy="5"
                  r="2"
                  fill="#326CE5"
                  opacity={isRunning ? 1 : 0.3}
                />
              </svg>
              <span
                style={{
                  fontSize: 11,
                  color: "#93c5fd",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                }}
              >
                {p.containerPort}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "#334155",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {p.protocol}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── YAML viewer ──
function YamlViewer() {
  const yaml = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod-testing
spec:
  containers:
    - image: "httpd:latest"
      name: my-test-image
      ports:
        - containerPort: 8080
          protocol: TCP`;

  const tokenize = (line: string) => {
    if (line.trimStart().startsWith("#"))
      return <span style={{ color: "#475569" }}>{line}</span>;
    const keyMatch = line.match(/^(\s*)([\w-]+)(:)(.*)/);
    if (keyMatch) {
      const [, indent, key, colon, rest] = keyMatch;
      const valueColor = rest.trim().startsWith('"')
        ? "#a3e635"
        : rest.trim().startsWith("-")
          ? "#94a3b8"
          : "#f1f5f9";
      return (
        <>
          <span>{indent}</span>
          <span style={{ color: "#93c5fd" }}>{key}</span>
          <span style={{ color: "#475569" }}>{colon}</span>
          <span style={{ color: valueColor }}>{rest}</span>
        </>
      );
    }
    if (line.trimStart().startsWith("- ")) {
      return (
        <>
          <span>{line.match(/^(\s*)/)?.[1]}</span>
          <span style={{ color: "#f59e0b" }}>- </span>
          <span style={{ color: "#f1f5f9" }}>{line.trimStart().slice(2)}</span>
        </>
      );
    }
    return <span style={{ color: "#94a3b8" }}>{line}</span>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {yaml.split("\n").map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 12 }}>
          <span
            style={{
              fontSize: 9,
              color: "#1e293b",
              userSelect: "none",
              minWidth: 16,
              textAlign: "right",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {i + 1}
          </span>
          <span
            style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: "pre",
            }}
          >
            {tokenize(line)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ──
export default function SinglePod() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [age, setAge] = useState(0);
  const [restarts] = useState(0);

  const phase = STATUS_PHASES[phaseIdx];
  const phaseColor = PHASE_COLOR[phase];
  const phaseBg = PHASE_BG[phase];

  // Simulate pod coming up
  useEffect(() => {
    if (phaseIdx < STATUS_PHASES.length - 1) {
      const t = setTimeout(() => setPhaseIdx((p) => p + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [phaseIdx]);

  // Age counter
  useEffect(() => {
    const t = setInterval(() => setAge((a) => a + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
        .pod-card { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(50,108,229,0.08) 0%, transparent 60%), #04080f",
          fontFamily: "'JetBrains Mono', monospace",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Scanlines */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 860,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* ── Breadcrumb ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              color: "#334155",
            }}
          >
            <span>cluster</span>
            <span style={{ color: "#1e293b" }}>›</span>
            <span>default</span>
            <span style={{ color: "#1e293b" }}>›</span>
            <span>pods</span>
            <span style={{ color: "#1e293b" }}>›</span>
            <span style={{ color: "#326CE5" }}>{POD_SPEC.metadata.name}</span>
          </div>

          {/* ── Pod Header ── */}
          <div
            className="pod-card"
            style={{
              background: "rgba(6,10,26,0.9)",
              border: "1px solid rgba(50,108,229,0.22)",
              borderRadius: 12,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* K8s pod icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: "rgba(50,108,229,0.1)",
                border: "1px solid rgba(50,108,229,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle
                  cx="15"
                  cy="15"
                  r="13"
                  stroke="#326CE5"
                  strokeWidth="1.2"
                  opacity="0.4"
                />
                {Array.from({ length: 7 }).map((_, i) => {
                  const a = (((i * 360) / 7) * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={15 + 5 * Math.cos(a)}
                      y1={15 + 5 * Math.sin(a)}
                      x2={15 + 12 * Math.cos(a)}
                      y2={15 + 12 * Math.sin(a)}
                      stroke="#326CE5"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle cx="15" cy="15" r="4.5" fill="#326CE5" opacity="0.9" />
                <circle cx="15" cy="15" r="2.5" fill="#04080f" />
                {Array.from({ length: 7 }).map((_, i) => {
                  const a = (((i * 360) / 7) * Math.PI) / 180;
                  return (
                    <circle
                      key={i}
                      cx={15 + 12 * Math.cos(a)}
                      cy={15 + 12 * Math.sin(a)}
                      r="2"
                      fill="#326CE5"
                    />
                  );
                })}
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#f1f5f9",
                    letterSpacing: "0.03em",
                  }}
                >
                  {POD_SPEC.metadata.name}
                </h1>
                {/* Phase badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: phaseBg,
                    border: `1px solid ${phaseColor}35`,
                    borderRadius: 6,
                    padding: "3px 10px",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: phaseColor,
                      animation:
                        phase === "Running"
                          ? "pulseRing 2s ease-in-out infinite"
                          : "blink 1s step-end infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: phaseColor,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {phase.toUpperCase()}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#334155",
                  marginTop: 4,
                  letterSpacing: "0.06em",
                }}
              >
                {POD_SPEC.apiVersion} · {POD_SPEC.kind} · namespace: default
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
              {[
                {
                  label: "CONTAINERS",
                  value: `${POD_SPEC.spec.containers.length}/${POD_SPEC.spec.containers.length}`,
                  color: "#22c55e",
                },
                {
                  label: "RESTARTS",
                  value: String(restarts),
                  color: restarts > 0 ? "#f59e0b" : "#94a3b8",
                },
                { label: "AGE", value: `${age}s`, color: "#94a3b8" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color }}>
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      color: "#334155",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {/* Metadata */}
            <Panel title="Metadata" dotColor="#326CE5">
              <InfoRow
                label="Name"
                value={POD_SPEC.metadata.name}
                valueColor="#93c5fd"
              />
              <InfoRow label="Namespace" value="default" />
              <InfoRow label="API Version" value={POD_SPEC.apiVersion} />
              <InfoRow
                label="Kind"
                value={POD_SPEC.kind}
                valueColor="#a855f7"
              />
              <InfoRow label="UID" value="—" valueColor="#1e293b" />
              <InfoRow label="Node" value="—" valueColor="#1e293b" />
            </Panel>

            {/* Spec summary */}
            <Panel title="Spec" dotColor="#a855f7">
              <InfoRow
                label="Containers"
                value={POD_SPEC.spec.containers.length}
                valueColor="#22c55e"
              />
              <InfoRow label="Init Containers" value="0" />
              <InfoRow label="Restart Policy" value="Always" />
              <InfoRow label="DNS Policy" value="ClusterFirst" />
              <InfoRow label="Service Account" value="default" />
              <InfoRow label="Termination Grace" value="30s" />
            </Panel>
          </div>

          {/* ── Container ── */}
          <Panel title="Containers" dotColor="#22c55e">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {POD_SPEC.spec.containers.map((c) => (
                <ContainerCard key={c.name} container={c} podPhase={phase} />
              ))}
            </div>
          </Panel>

          {/* ── YAML Source ── */}
          <Panel title="yaml · pod manifest" dotColor="#06b6d4">
            <YamlViewer />
          </Panel>
        </div>
      </div>
    </>
  );
}
