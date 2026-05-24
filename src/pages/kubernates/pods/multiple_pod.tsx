import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../../Themecontext";

// ── Pod definitions ──
const PODS_SPEC = [
  {
    apiVersion: "v1",
    kind: "Pod",
    metadata: { name: "my-pod-testing-1" },
    spec: {
      containers: [
        {
          image: "httpd:latest",
          name: "my-test-image",
          ports: [{ containerPort: 8080, protocol: "TCP" }],
        },
      ],
    },
  },
  {
    apiVersion: "v1",
    kind: "Pod",
    metadata: { name: "my-pod-testing-2" },
    spec: {
      containers: [
        {
          image: "httpd:latest",
          name: "my-test-image",
          ports: [{ containerPort: 8080, protocol: "TCP" }],
        },
      ],
    },
  },
  {
    apiVersion: "v1",
    kind: "Pod",
    metadata: { name: "my-pod-testing-3" },
    spec: {
      containers: [
        {
          image: "httpd:latest",
          name: "my-test-image",
          ports: [{ containerPort: 8080, protocol: "TCP" }],
        },
      ],
    },
  },
];

const RAW_YAML = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod-testing-1
spec:
  containers:
    - image: "httpd:latest"
      name: my-test-image
      ports:
        - containerPort: 8080
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: my-pod-testing-2
spec:
  containers:
    - image: "httpd:latest"
      name: my-test-image
      ports:
        - containerPort: 8080
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: my-pod-testing-3
spec:
  containers:
    - image: "httpd:latest"
      name: my-test-image
      ports:
        - containerPort: 8080
          protocol: TCP`;

const PHASE_SEQUENCE = ["Pending", "ContainerCreating", "Running"] as const;
type Phase = (typeof PHASE_SEQUENCE)[number];

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
const PHASE_BORDER: Record<Phase, string> = {
  Pending: "rgba(245,158,11,0.35)",
  ContainerCreating: "rgba(6,182,212,0.35)",
  Running: "rgba(34,197,94,0.35)",
};

const POD_ACCENTS = ["#326CE5", "#a855f7", "#06b6d4"] as const;
const POD_ACCENT_DIMS = [
  "rgba(50,108,229,0.08)",
  "rgba(168,85,247,0.08)",
  "rgba(6,182,212,0.08)",
] as const;

// ─────────────────────────────────────────────────────────────────
// Theme tokens
// ─────────────────────────────────────────────────────────────────
function useTokens(isDark: boolean) {
  return {
    // page
    pageBg: isDark
      ? "radial-gradient(ellipse at 30% 20%,rgba(50,108,229,0.07) 0%,transparent 60%),#04080f"
      : "radial-gradient(ellipse at 30% 20%,rgba(50,108,229,0.05) 0%,transparent 60%),#f0f4ff",
    // surfaces
    surfaceBg: isDark ? "rgba(6,10,26,0.88)" : "#ffffff",
    surfaceBg2: isDark ? "rgba(6,10,26,0.6)" : "rgba(255,255,255,0.85)",
    surfaceBg3: isDark ? "rgba(6,10,26,0.85)" : "#f8faff",
    headerBg: isDark ? "rgba(50,108,229,0.06)" : "rgba(50,108,229,0.04)",
    // borders
    borderDefault: isDark ? "rgba(50,108,229,0.15)" : "rgba(50,108,229,0.18)",
    borderSub: isDark ? "rgba(50,108,229,0.1)" : "rgba(50,108,229,0.12)",
    borderRow: isDark ? "rgba(50,108,229,0.18)" : "rgba(50,108,229,0.2)",
    borderInfoRow: isDark ? "rgba(50,108,229,0.07)" : "rgba(50,108,229,0.08)",
    // text
    textPrimary: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#475569",
    textMuted: isDark ? "#475569" : "#64748b",
    textFaint: isDark ? "#334155" : "#94a3b8",
    // kubectl bar
    kubectlBg: isDark ? "rgba(6,10,26,0.9)" : "rgba(241,245,255,0.95)",
    kubectlBorder: isDark ? "rgba(50,108,229,0.2)" : "rgba(50,108,229,0.25)",
    // scanline (dark only)
    scanline: isDark
      ? "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)"
      : "none",
    // yaml separator
    yamlSep: isDark ? "#334155" : "#94a3b8",
    // copy btn
    copyBg: isDark ? "rgba(50,108,229,0.1)" : "rgba(50,108,229,0.08)",
    copyBorder: isDark ? "rgba(50,108,229,0.25)" : "rgba(50,108,229,0.3)",
    copyColor: isDark ? "#93c5fd" : "#2563eb",
    // shadow
    pageShadow: isDark ? "#04080f" : "#f0f4ff",
  };
}

// ─────────────────────────────────────────────────────────────────
// Sub-components (all receive `tk` tokens)
// ─────────────────────────────────────────────────────────────────

type Tokens = ReturnType<typeof useTokens>;

function InfoRow({
  label,
  value,
  valueColor,
  tk,
}: {
  label: string;
  value: React.ReactNode;
  valueColor?: string;
  tk: Tokens;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 0",
        borderBottom: `1px solid ${tk.borderInfoRow}`,
      }}
    >
      <span
        style={{
          fontSize: 9,
          color: tk.textMuted,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 10,
          color: valueColor ?? tk.textSecondary,
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Panel({
  title,
  dotColor = "#326CE5",
  children,
  style,
  tk,
}: {
  title: string;
  dotColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  tk: Tokens;
}) {
  return (
    <div
      style={{
        background: tk.surfaceBg3,
        border: `1px solid ${tk.borderDefault}`,
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          padding: "5px 12px",
          background: tk.headerBg,
          borderBottom: `1px solid ${tk.borderSub}`,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 5px ${dotColor}`,
          }}
        />
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: dotColor,
            textTransform: "uppercase",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "8px 12px", flex: 1 }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// YAML view
// ─────────────────────────────────────────────────────────────────

function YamlView({ phases, tk }: { phases: Phase[]; tk: Tokens }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_YAML).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const key = (t: string) => <span style={{ color: "#2563eb" }}>{t}</span>;
  const str = (t: string) => <span style={{ color: "#16a34a" }}>"{t}"</span>;
  const num = (t: number) => <span style={{ color: "#d97706" }}>{t}</span>;
  const kw = (t: string) => <span style={{ color: "#7c3aed" }}>{t}</span>;

  return (
    <div
      style={{
        background: tk.surfaceBg2,
        border: `1px solid ${tk.borderDefault}`,
        borderRadius: 12,
        overflow: "hidden",
        animation: "mpFadeDown 0.2s ease both",
      }}
    >
      {/* header bar */}
      <div
        style={{
          padding: "8px 16px",
          background: tk.headerBg,
          borderBottom: `1px solid ${tk.borderSub}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#326CE5",
              boxShadow: "0 0 5px #326CE5",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#326CE5",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            pods.yaml
          </span>
          <span
            style={{
              fontSize: 9,
              color: tk.textFaint,
              marginLeft: 4,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            · 3 documents
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? "rgba(34,197,94,0.1)" : tk.copyBg,
            border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : tk.copyBorder}`,
            borderRadius: 5,
            padding: "3px 10px",
            fontSize: 9,
            fontWeight: 700,
            color: copied ? "#22c55e" : tk.copyColor,
            letterSpacing: "0.08em",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono',monospace",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "✓ COPIED" : "⎘ COPY"}
        </button>
      </div>

      {/* body */}
      <div
        style={{
          padding: "16px 20px",
          fontSize: 12,
          lineHeight: "1.9",
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        {PODS_SPEC.map((pod, i) => {
          const phase = phases[i];
          const phaseColor = PHASE_COLOR[phase];
          const phaseLabel =
            phase === "ContainerCreating" ? "CREATING" : phase.toUpperCase();
          const container = pod.spec.containers[0];
          return (
            <React.Fragment key={pod.metadata.name}>
              {i > 0 && (
                <div
                  style={{
                    color: tk.yamlSep,
                    margin: "8px 0",
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 12,
                  }}
                >
                  ---
                </div>
              )}
              <div>
                {key("apiVersion")}: {kw("v1")}
              </div>
              <div>
                {key("kind")}: {kw("Pod")}
              </div>
              <div>{key("metadata")}:</div>
              <div style={{ paddingLeft: 16 }}>
                {key("name")}: {str(pod.metadata.name)}
                <span
                  style={{
                    marginLeft: 12,
                    fontSize: 9,
                    fontWeight: 700,
                    color: phaseColor,
                    background: PHASE_BG[phase],
                    border: `1px solid ${PHASE_BORDER[phase]}`,
                    borderRadius: 4,
                    padding: "1px 7px",
                    letterSpacing: "0.08em",
                    verticalAlign: "middle",
                  }}
                >
                  {phaseLabel}
                </span>
              </div>
              <div>{key("spec")}:</div>
              <div style={{ paddingLeft: 16 }}>{key("containers")}:</div>
              <div style={{ paddingLeft: 32 }}>
                - {key("image")}: {str(container.image)}
              </div>
              <div style={{ paddingLeft: 48 }}>
                {key("name")}: {str(container.name)}
              </div>
              <div style={{ paddingLeft: 48 }}>{key("ports")}:</div>
              <div style={{ paddingLeft: 64 }}>
                - {key("containerPort")}:{" "}
                {num(container.ports[0].containerPort)}
              </div>
              <div style={{ paddingLeft: 80 }}>
                {key("protocol")}: {str(container.ports[0].protocol)}
              </div>
              {i < PODS_SPEC.length - 1 && <div style={{ height: 4 }} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Summary bar
// ─────────────────────────────────────────────────────────────────

function SummaryBar({
  pods,
  phases,
}: {
  pods: typeof PODS_SPEC;
  phases: Phase[];
}) {
  const running = phases.filter((p) => p === "Running").length;
  const creating = phases.filter((p) => p === "ContainerCreating").length;
  const pending = phases.filter((p) => p === "Pending").length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {[
        {
          label: "TOTAL PODS",
          value: pods.length,
          color: "#326CE5",
          bg: "rgba(50,108,229,0.1)",
          border: "rgba(50,108,229,0.25)",
        },
        {
          label: "RUNNING",
          value: running,
          color: "#22c55e",
          bg: "rgba(34,197,94,0.1)",
          border: "rgba(34,197,94,0.25)",
        },
        {
          label: "CREATING",
          value: creating,
          color: "#06b6d4",
          bg: "rgba(6,182,212,0.1)",
          border: "rgba(6,182,212,0.25)",
        },
        {
          label: "PENDING",
          value: pending,
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.1)",
          border: "rgba(245,158,11,0.25)",
        },
        {
          label: "NAMESPACE",
          value: "default",
          color: "#a855f7",
          bg: "rgba(168,85,247,0.1)",
          border: "rgba(168,85,247,0.25)",
        },
      ].map(({ label, value, color, bg, border }) => (
        <div
          key={label}
          style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#64748b",
              letterSpacing: "0.12em",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color,
              fontFamily: "'JetBrains Mono',monospace",
              lineHeight: 1,
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// List column header
// ─────────────────────────────────────────────────────────────────

function ListHeader({ tk }: { tk: Tokens }) {
  const col = (label: string, flex?: number, width?: number) => (
    <span
      style={{
        fontSize: 9,
        color: tk.textFaint,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "'JetBrains Mono',monospace",
        fontWeight: 700,
        flex: flex ?? undefined,
        width: width ?? undefined,
      }}
    >
      {label}
    </span>
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "6px 16px",
        marginBottom: 6,
        borderBottom: `1px solid ${tk.borderSub}`,
      }}
    >
      <div style={{ width: 26, flexShrink: 0 }} />
      <div style={{ width: 20, flexShrink: 0 }} />
      {col("Name", 1)}
      {col("Namespace", undefined, 52)}
      {col("Image", undefined, 92)}
      {col("Port", undefined, 52)}
      {col("Age", undefined, 38)}
      {col("Status", undefined, 90)}
      <div style={{ width: 22 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────

type ViewMode = "list" | "yaml";

export default function MultiplePod() {
  const { isDark } = useTheme(); 
  const tk = useTokens(isDark);

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>("list");
  const [phases, setPhases] = useState<Phase[]>(PODS_SPEC.map(() => "Pending"));

  const handlePhaseChange = (idx: number, phase: Phase) => {
    setPhases((prev) => {
      const next = [...prev];
      next[idx] = phase;
      return next;
    });
  };

  const kubectlHint =
    view === "yaml" ? (
      <>
        <span style={{ color: tk.textMuted }}>$ </span>
        <span style={{ color: "#326CE5" }}>kubectl apply -f</span>
        <span style={{ color: "#16a34a" }}> pods.yaml</span>
      </>
    ) : (
      <>
        <span style={{ color: tk.textMuted }}>$ </span>
        <span style={{ color: "#326CE5" }}>kubectl get pods</span>
        <span style={{ color: tk.textMuted }}> -n default</span>
      </>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        @keyframes mpBlink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes mpPulse    { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }
        @keyframes mpFadeDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: tk.pageBg,
          fontFamily: "'JetBrains Mono',monospace",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Scanlines (dark only) */}
        {isDark && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              background: tk.scanline,
            }}
          />
        )}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1060,
            margin: "0 auto",
          }}
        >
          {/* ── Page header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              {/* Breadcrumb */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 10,
                  color: tk.textFaint,
                  marginBottom: 8,
                }}
              >
                <span>cluster</span>
                <span style={{ color: tk.textFaint }}>›</span>
                <span>default</span>
                <span style={{ color: tk.textFaint }}>›</span>
                <span style={{ color: "#326CE5" }}>pods</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* K8s wheel */}
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 64 64"
                  fill="none"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(50,108,229,0.5))",
                  }}
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke="#326CE5"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  {Array.from({ length: 7 }).map((_, i) => {
                    const a = (((i * 360) / 7) * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1={32 + 10 * Math.cos(a)}
                        y1={32 + 10 * Math.sin(a)}
                        x2={32 + 27 * Math.cos(a)}
                        y2={32 + 27 * Math.sin(a)}
                        stroke="#326CE5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  <circle cx="32" cy="32" r="9" fill="#326CE5" opacity="0.9" />
                  <circle
                    cx="32"
                    cy="32"
                    r="5"
                    fill={isDark ? "#04080f" : "#f0f4ff"}
                  />
                  {Array.from({ length: 7 }).map((_, i) => {
                    const a = (((i * 360) / 7) * Math.PI) / 180;
                    return (
                      <circle
                        key={i}
                        cx={32 + 27 * Math.cos(a)}
                        cy={32 + 27 * Math.sin(a)}
                        r="4"
                        fill="#326CE5"
                      />
                    );
                  })}
                </svg>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#326CE5",
                      letterSpacing: "0.18em",
                      fontWeight: 700,
                    }}
                  >
                    KUBERNETES · POD LIST
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: tk.textPrimary,
                      letterSpacing: "0.04em",
                    }}
                  >
                    my-pod-testing
                    <span
                      style={{
                        fontSize: 12,
                        color: tk.textFaint,
                        marginLeft: 10,
                        fontWeight: 400,
                      }}
                    >
                      × {PODS_SPEC.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: view toggle + kubectl hint */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              {/* View toggle */}
              <div
                style={{
                  display: "flex",
                  background: tk.kubectlBg,
                  border: `1px solid ${tk.kubectlBorder}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {(["list", "yaml"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      padding: "6px 14px",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                      border: "none",
                      transition: "all 0.2s ease",
                      background:
                        view === v ? "rgba(50,108,229,0.15)" : "transparent",
                      color: view === v ? "#326CE5" : tk.textFaint,
                    }}
                  >
                    {v === "list" ? "◼ POD LIST" : "⟨/⟩ YAML"}
                  </button>
                ))}
              </div>

              {/* kubectl hint */}
              <div
                style={{
                  background: tk.kubectlBg,
                  border: `1px solid ${tk.kubectlBorder}`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {kubectlHint}
              </div>
            </div>
          </div>

          {/* ── Summary bar ── */}
          <SummaryBar pods={PODS_SPEC} phases={phases} />

          {/* ── Pod list view ── */}
          {view === "list" && (
            <div
              style={{
                background: tk.surfaceBg2,
                border: `1px solid ${tk.borderDefault}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 0 4px",
                  borderBottom: `1px solid ${tk.borderSub}`,
                }}
              >
                <ListHeader tk={tk} />
              </div>
              <div style={{ padding: "10px 0" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "0 10px",
                  }}
                >
                  {PODS_SPEC.map((pod, i) => (
                    <PodRowStateful
                      key={pod.metadata.name}
                      pod={pod}
                      index={i}
                      accent={POD_ACCENTS[i % POD_ACCENTS.length]}
                      accentDim={POD_ACCENT_DIMS[i % POD_ACCENT_DIMS.length]}
                      expanded={expandedIdx === i}
                      onToggle={() =>
                        setExpandedIdx(expandedIdx === i ? null : i)
                      }
                      onPhaseChange={(p) => handlePhaseChange(i, p)}
                      tk={tk}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── YAML view ── */}
          {view === "yaml" && <YamlView phases={phases} tk={tk} />}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// PodRowStateful
// ─────────────────────────────────────────────────────────────────

function PodRowStateful({
  pod,
  index,
  accent,
  accentDim,
  expanded,
  onToggle,
  onPhaseChange,
  tk,
}: {
  pod: (typeof PODS_SPEC)[0];
  index: number;
  accent: string;
  accentDim: string;
  expanded: boolean;
  onToggle: () => void;
  onPhaseChange: (p: Phase) => void;
  tk: Tokens;
}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [age, setAge] = useState(0);
  const reportedRef = useRef(-1);

  const phase = PHASE_SEQUENCE[phaseIdx];
  const phaseColor = PHASE_COLOR[phase];
  const isRunning = phase === "Running";

  useEffect(() => {
    const delay = index * 900;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHASE_SEQUENCE.forEach((_, i) => {
      if (i === 0) return;
      timers.push(setTimeout(() => setPhaseIdx(i), delay + i * 1200));
    });
    return () => timers.forEach(clearTimeout);
  }, [index]);

  useEffect(() => {
    if (reportedRef.current !== phaseIdx) {
      reportedRef.current = phaseIdx;
      onPhaseChange(PHASE_SEQUENCE[phaseIdx]);
    }
  }, [phaseIdx, onPhaseChange]);

  useEffect(() => {
    const t = setInterval(() => setAge((a) => a + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const container = pod.spec.containers[0];

  return (
    <div
      style={{
        background: tk.surfaceBg,
        border: `1px solid ${expanded ? accent + "55" : tk.borderRow}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.25s ease",
        boxShadow: expanded ? `0 0 18px ${accent}18` : "none",
      }}
    >
      {/* Row header */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 16px",
          cursor: "pointer",
          userSelect: "none",
          background: expanded ? accentDim : "transparent",
          transition: "background 0.2s ease",
        }}
      >
        {/* Index badge */}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            flexShrink: 0,
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: accent,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {index + 1}
        </div>

        {/* Pod hex icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z"
            stroke={accent}
            strokeWidth="1.5"
            fill={`${accent}15`}
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="3" fill={accent} opacity="0.9" />
        </svg>

        {/* Name */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: tk.textPrimary,
            fontFamily: "'JetBrains Mono',monospace",
            flex: 1,
          }}
        >
          {pod.metadata.name}
        </span>

        {/* Namespace */}
        <span
          style={{
            fontSize: 10,
            color: tk.textFaint,
            fontFamily: "'JetBrains Mono',monospace",
            width: 52,
            textAlign: "center",
          }}
        >
          default
        </span>

        {/* Image */}
        <span
          style={{
            fontSize: 9,
            color: "#0891b2",
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 4,
            padding: "2px 8px",
            fontFamily: "'JetBrains Mono',monospace",
            width: 92,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {container.image}
        </span>

        {/* Port */}
        <span
          style={{
            fontSize: 9,
            color: "#2563eb",
            background: "rgba(50,108,229,0.1)",
            border: "1px solid rgba(50,108,229,0.25)",
            borderRadius: 4,
            padding: "2px 8px",
            fontFamily: "'JetBrains Mono',monospace",
            width: 52,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          :{container.ports[0].containerPort}
        </span>

        {/* Age */}
        <span
          style={{
            fontSize: 10,
            color: tk.textMuted,
            fontFamily: "'JetBrains Mono',monospace",
            width: 38,
            textAlign: "right",
            marginRight: 10,
            flexShrink: 0,
          }}
        >
          {age}s
        </span>

        {/* Phase badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: PHASE_BG[phase],
            border: `1px solid ${PHASE_BORDER[phase]}`,
            borderRadius: 5,
            padding: "3px 9px",
            flexShrink: 0,
            minWidth: 90,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: phaseColor,
              animation: isRunning
                ? "mpPulse 2s ease-in-out infinite"
                : "mpBlink 1s step-end infinite",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: phaseColor,
              letterSpacing: "0.08em",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {phase === "ContainerCreating" ? "CREATING" : phase.toUpperCase()}
          </span>
        </div>

        {/* Chevron */}
        <span
          style={{
            fontSize: 10,
            color: tk.textFaint,
            marginLeft: 6,
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "inline-block",
          }}
        >
          ▶
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: "0 16px 14px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            borderTop: `1px solid ${accent}20`,
            animation: "mpFadeDown 0.2s ease both",
          }}
        >
          <Panel
            title="Metadata"
            dotColor={accent}
            style={{ marginTop: 12 }}
            tk={tk}
          >
            <InfoRow
              label="Name"
              value={pod.metadata.name}
              valueColor="#2563eb"
              tk={tk}
            />
            <InfoRow label="Namespace" value="default" tk={tk} />
            <InfoRow label="API Version" value={pod.apiVersion} tk={tk} />
            <InfoRow
              label="Kind"
              value={pod.kind}
              valueColor="#7c3aed"
              tk={tk}
            />
            <InfoRow label="Restarts" value="0" tk={tk} />
          </Panel>

          <Panel
            title="Container"
            dotColor="#22c55e"
            style={{ marginTop: 12 }}
            tk={tk}
          >
            <InfoRow
              label="Name"
              value={container.name}
              valueColor="#15803d"
              tk={tk}
            />
            <InfoRow
              label="Image"
              value={container.image}
              valueColor="#0891b2"
              tk={tk}
            />
            <InfoRow
              label="State"
              value={isRunning ? "Running" : "Waiting"}
              valueColor={phaseColor}
              tk={tk}
            />
            <InfoRow
              label="Port"
              value={`${container.ports[0].containerPort}/${container.ports[0].protocol}`}
              valueColor="#2563eb"
              tk={tk}
            />
            <InfoRow
              label="Ready"
              value={isRunning ? "true" : "false"}
              valueColor={isRunning ? "#22c55e" : "#f59e0b"}
              tk={tk}
            />
          </Panel>

          <Panel
            title="Spec"
            dotColor="#a855f7"
            style={{ marginTop: 12 }}
            tk={tk}
          >
            <InfoRow
              label="Containers"
              value="1/1"
              valueColor="#22c55e"
              tk={tk}
            />
            <InfoRow label="Restart Policy" value="Always" tk={tk} />
            <InfoRow label="DNS Policy" value="ClusterFirst" tk={tk} />
            <InfoRow label="Svc Account" value="default" tk={tk} />
            <InfoRow label="Age" value={`${age}s`} tk={tk} />
          </Panel>
        </div>
      )}
    </div>
  );
}
