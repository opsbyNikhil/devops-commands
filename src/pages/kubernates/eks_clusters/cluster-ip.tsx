import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

// ─────────────────────────────────────────────
// Raw YAML strings (for copy button)
// ─────────────────────────────────────────────

const podYamlFull = `apiVersion: v1
kind: Pod
metadata:
  name: eks-pod
  labels:
    app: payment-app
spec:
  containers:
    - name: app-image-1
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: eks-pod-2
  labels:
    app: payment-app
spec:
  containers:
    - name: app-image-2
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: eks-pod-3
  labels:
    app: payment-app
spec:
  containers:
    - name: app-image-3
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: eks-pod-4
  labels:
    app: payment-app
spec:
  containers:
    - name: app-image-4
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP`;

const svcYamlFull = `apiVersion: v1
kind: Service
metadata:
  name: service
spec:
  selector:
    app: payment-app
  type: ClusterIP
  ports:
    - port: 80
      protocol: TCP`;

// ─────────────────────────────────────────────
// CSS animations (scoped class names to avoid collisions)
// ─────────────────────────────────────────────

const STYLES = `
  @keyframes cip-dash-flow {
    from { stroke-dashoffset: 20; }
    to   { stroke-dashoffset: 0;  }
  }
  @keyframes cip-label-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 4px rgba(34,197,94,0);  }
  }
  .cip-flow-line {
    stroke-dasharray: 6 4;
    animation: cip-dash-flow 0.65s linear infinite;
  }
  .cip-label-badge {
    animation: cip-label-glow 2.8s ease-in-out infinite;
  }
`;

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function ClusterIP() {
  const { isDark } = useTheme();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success("Copied to clipboard!");
  };

  // ── Palette ──────────────────────────────────
  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const descColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(15,23,42,0.95)" : "#ffffff";
  const clusterBg = isDark ? "rgba(15,23,42,0.45)" : "rgba(241,245,249,0.85)";
  const clusterBdr = isDark ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.22)";

  const svcAccent = "#6366f1";
  const svcDim = isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.09)";
  const svcBorder = isDark ? "rgba(99,102,241,0.42)" : "rgba(99,102,241,0.32)";

  const podAccent = "#326CE5";
  const podDim = isDark ? "rgba(50,108,229,0.15)" : "rgba(50,108,229,0.09)";
  const podBorder = isDark ? "rgba(50,108,229,0.42)" : "rgba(50,108,229,0.3)";

  const matchAccent = "#22c55e";
  const matchDim = isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.09)";
  const matchBorder = isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.32)";

  // Code-block palette
  const codeColors = {
    key: isDark ? "#7dd3fc" : "#2563eb",
    value: isDark ? "#fb923c" : "#d97706",
    comment: isDark ? "#475569" : "#94a3b8",
    bgHeader: isDark ? "#1e293b" : "#e2e8f0",
    bgCode: isDark ? "#0f172a" : "#f8fafc",
    border: isDark ? "#334155" : "#cbd5e1",
    text: isDark ? "#e2e8f0" : "#1e293b",
    headerText: isDark ? "#94a3b8" : "#475569",
    copyHover: isDark ? "#334155" : "#94a3b8",
  };

  // ── SVG layout constants ──────────────────────
  const POD_H = 84;
  const POD_GAP = 12;
  const pods = [
    { name: "eks-pod", container: "app-image-1" },
    { name: "eks-pod-2", container: "app-image-2" },
    { name: "eks-pod-3", container: "app-image-3" },
    { name: "eks-pod-4", container: "app-image-4" },
  ];
  const totalH = pods.length * POD_H + (pods.length - 1) * POD_GAP;
  const svcCY = totalH / 2;
  const podCYs = pods.map((_, i) => i * (POD_H + POD_GAP) + POD_H / 2);
  const SVG_W = 116;
  const lineAccents = ["#6366f1", "#326CE5", "#06b6d4", "#22c55e"];

  const curvePath = (podCY: number) =>
    `M 0,${svcCY} C ${SVG_W * 0.52},${svcCY} ${SVG_W * 0.48},${podCY} ${SVG_W},${podCY}`;

  // ── Inline YAML syntax helpers ────────────────
  const K = (s: string) => <span style={{ color: codeColors.key }}>{s}</span>;
  const V = (s: string) => <span style={{ color: codeColors.value }}>{s}</span>;
  const M = (s: string) => <span style={{ color: matchAccent }}>{s}</span>;
  const C = (s: string) => (
    <span style={{ color: codeColors.comment }}>{s}</span>
  );
  const SVC = (s: string) => <span style={{ color: svcAccent }}>{s}</span>;

  // One pod's worth of syntax-highlighted YAML
  const PodBlock = ({
    name,
    containerName,
  }: {
    name: string;
    containerName: string;
  }) => (
    <>
      {K("apiVersion:")} {V("v1")}
      {"\n"}
      {K("kind:")} {V("Pod")}
      {"\n"}
      {K("metadata:")}
      {"\n"}
      {"  "}
      {K("name:")} {V(name)}
      {"\n"}
      {"  "}
      {K("labels:")}
      {"\n"}
      {"    "}
      {K("app:")} {M("payment-app")}
      {"\n"}
      {K("spec:")}
      {"\n"}
      {"  "}
      {K("containers:")}
      {"\n"}
      {"    "}- {K("name:")} {V(containerName)}
      {"\n"}
      {"      "}
      {K("image:")} {V("nginx")}
      {"\n"}
      {"      "}
      {K("ports:")}
      {"\n"}
      {"        "}- {K("containerPort:")} {V("80")}
      {"\n"}
      {"          "}
      {K("protocol:")} {V("TCP")}
      {"\n"}
    </>
  );

  // ── Reusable code-block wrapper ───────────────
  const CodeBlock = ({
    title,
    content,
    children,
  }: {
    title: string;
    content: string;
    children: React.ReactNode;
  }) => (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: `1px solid ${codeColors.border}`,
        marginBottom: "28px",
      }}
    >
      <div
        style={{
          background: codeColors.bgHeader,
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: codeColors.headerText,
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <span>{title}</span>
        <button
          onClick={() => handleCopy(content)}
          style={{
            background: "transparent",
            border: `1px solid ${codeColors.border}`,
            color: codeColors.text,
            borderRadius: "4px",
            padding: "2px 10px",
            cursor: "pointer",
            fontSize: "12px",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = codeColors.copyHover)
          }
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Copy
        </button>
      </div>
      <pre
        style={{
          background: codeColors.bgCode,
          padding: "20px",
          margin: 0,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "13px",
          lineHeight: "1.7",
          overflowX: "auto",
          color: codeColors.text,
        }}
      >
        <code>{children}</code>
      </pre>
    </div>
  );

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 0 60px" }}>
      <style>{STYLES}</style>

      {/* ── Page title ── */}
      <h2
        style={{
          color: titleColor,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 28,
          margin: "0 0 6px",
        }}
      >
        ClusterIP Service
      </h2>
      <p
        style={{
          color: descColor,
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          margin: "0 0 32px",
          lineHeight: 1.75,
        }}
      >
        A <span style={{ color: svcAccent }}>ClusterIP</span> Service uses a{" "}
        <code style={{ color: svcAccent, fontSize: 10 }}>selector</code> to
        match pod{" "}
        <code style={{ color: matchAccent, fontSize: 10 }}>labels</code> and
        distributes internal cluster traffic across all matched pods.
      </p>

      {/* ══════════════════════════════════════════
          Architecture Diagram
      ══════════════════════════════════════════ */}
      <div
        style={{
          background: clusterBg,
          border: `1.5px dashed ${clusterBdr}`,
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 36,
          position: "relative",
          overflowX: "auto",
        }}
      >
        {/* Floating cluster label */}
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 20,
            background: isDark ? "#020617" : "#f8fafc",
            padding: "0 10px",
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: descColor,
            letterSpacing: "0.12em",
            userSelect: "none",
          }}
        >
          CLUSTER INTERNAL NETWORK
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0,
            minWidth: 580,
          }}
        >
          {/* ── Service card ── */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${svcBorder}`,
              borderRadius: 14,
              padding: "18px 16px",
              width: 192,
              height: totalH,
              boxSizing: "border-box",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxShadow: isDark
                ? "0 4px 24px rgba(0,0,0,0.5)"
                : "0 4px 16px rgba(99,102,241,0.12)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                borderRadius: "14px 14px 0 0",
              }}
            />

            {/* SERVICE badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: svcDim,
                border: `1px solid ${svcBorder}`,
                borderRadius: 20,
                padding: "2px 8px",
                marginBottom: 10,
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: svcAccent,
                letterSpacing: "0.08em",
                alignSelf: "flex-start",
              }}
            >
              ⬡ SERVICE
            </div>

            {/* Name */}
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: isDark ? "#e2e8f0" : "#0f172a",
                margin: "0 0 2px",
              }}
            >
              service
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: svcAccent,
                margin: "0 0 14px",
              }}
            >
              ClusterIP
            </p>

            {/* Selector */}
            <div style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: descColor,
                  marginBottom: 4,
                  letterSpacing: "0.06em",
                }}
              >
                SELECTOR
              </div>
              <div
                style={{
                  background: matchDim,
                  border: `1px solid ${matchBorder}`,
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: matchAccent,
                }}
              >
                app: payment-app
              </div>
            </div>

            {/* Port */}
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: descColor,
                  marginBottom: 4,
                  letterSpacing: "0.06em",
                }}
              >
                PORT
              </div>
              <div
                style={{
                  background: svcDim,
                  border: `1px solid ${svcBorder}`,
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: svcAccent,
                }}
              >
                80 / TCP
              </div>
            </div>
          </div>

          {/* ── SVG animated connection lines ── */}
          <svg
            width={SVG_W}
            height={totalH}
            viewBox={`0 0 ${SVG_W} ${totalH}`}
            style={{ flexShrink: 0, overflow: "visible" }}
          >
            {pods.map((pod, i) => {
              const pathD = curvePath(podCYs[i]);
              const accent = lineAccents[i % lineAccents.length];
              return (
                <g key={pod.name}>
                  {/* Ghost track */}
                  <path
                    d={pathD}
                    stroke={
                      isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"
                    }
                    strokeWidth={2.5}
                    fill="none"
                  />
                  {/* Animated dashed flow */}
                  <path
                    d={pathD}
                    stroke={accent}
                    strokeWidth={1.6}
                    fill="none"
                    strokeOpacity={0.7}
                    className="cip-flow-line"
                    style={{ animationDelay: `${i * 0.17}s` }}
                  />
                  {/* Traveling packet dot */}
                  <circle r={3.5} fill={accent} opacity={0.95}>
                    <animateMotion
                      dur={`${1.35 + i * 0.12}s`}
                      repeatCount="indefinite"
                      begin={`${i * 0.33}s`}
                      path={pathD}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* ── Pod cards ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: POD_GAP,
              flex: 1,
            }}
          >
            {pods.map((pod, i) => (
              <div
                key={pod.name}
                style={{
                  background: cardBg,
                  border: `1px solid ${podBorder}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  height: POD_H,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "0 2px 12px rgba(0,0,0,0.35)"
                    : "0 2px 8px rgba(50,108,229,0.08)",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 3,
                    background: "linear-gradient(180deg, #326CE5, #1a4db0)",
                    borderRadius: "10px 0 0 10px",
                  }}
                />

                {/* Pod hex icon */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background:
                      "linear-gradient(135deg, #326CE5 0%, #1a4db0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginLeft: 6,
                    boxShadow: "0 2px 10px rgba(50,108,229,0.4)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="rgba(255,255,255,0.15)"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
                  </svg>
                </div>

                {/* Pod name + label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: isDark ? "#e2e8f0" : "#0f172a",
                      margin: "0 0 5px",
                    }}
                  >
                    {pod.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 8,
                        color: descColor,
                        letterSpacing: "0.06em",
                      }}
                    >
                      LABEL
                    </span>
                    <span
                      className="cip-label-badge"
                      style={{
                        background: matchDim,
                        border: `1px solid ${matchBorder}`,
                        borderRadius: 4,
                        padding: "1px 7px",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: matchAccent,
                        animationDelay: `${i * 0.7}s`,
                      }}
                    >
                      app: payment-app
                    </span>
                  </div>
                </div>

                {/* Container chip */}
                <div
                  style={{
                    background: podDim,
                    border: `1px solid ${podBorder}`,
                    borderRadius: 6,
                    padding: "5px 9px",
                    flexShrink: 0,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    color: podAccent,
                    lineHeight: 1.65,
                    textAlign: "right",
                  }}
                >
                  {pod.container}
                  <br />
                  <span style={{ color: descColor }}>nginx · :80</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          How It Works — 3-step cards
      ══════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 40,
          flexWrap: "wrap",
        }}
      >
        {[
          {
            step: "01",
            title: "Pod Labels",
            desc: "Each pod declares a label app: payment-app in its metadata section.",
            accent: matchAccent,
            dim: matchDim,
            border: matchBorder,
          },
          {
            step: "02",
            title: "Service Selector",
            desc: "The Service's selector: app: payment-app discovers all pods with that label.",
            accent: svcAccent,
            dim: svcDim,
            border: svcBorder,
          },
          {
            step: "03",
            title: "ClusterIP Routing",
            desc: "Internal traffic to ClusterIP is load-balanced across all 4 matched pods.",
            accent: podAccent,
            dim: podDim,
            border: isDark ? "rgba(50,108,229,0.38)" : "rgba(50,108,229,0.27)",
          },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              flex: "1 1 190px",
              background: cardBg,
              border: `1px solid ${item.border}`,
              borderRadius: 10,
              padding: "16px",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: item.accent,
                letterSpacing: "0.12em",
                marginBottom: 6,
              }}
            >
              STEP {item.step}
            </div>
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: isDark ? "#e2e8f0" : "#0f172a",
                margin: "0 0 5px",
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: descColor,
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          YAML: pod.yaml
      ══════════════════════════════════════════ */}
      <h3
        style={{
          color: titleColor,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          margin: "0 0 12px",
        }}
      >
        pod.yaml
      </h3>

      <CodeBlock title="pod.yaml" content={podYamlFull}>
        <PodBlock name="eks-pod" containerName="app-image-1" />
        {C("---")}
        {"\n"}
        <PodBlock name="eks-pod-2" containerName="app-image-2" />
        {C("---")}
        {"\n"}
        <PodBlock name="eks-pod-3" containerName="app-image-3" />
        {C("---")}
        {"\n"}
        <PodBlock name="eks-pod-4" containerName="app-image-4" />
      </CodeBlock>

      {/* ══════════════════════════════════════════
          YAML: svc.yaml
      ══════════════════════════════════════════ */}
      <h3
        style={{
          color: titleColor,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          margin: "0 0 12px",
        }}
      >
        svc.yaml
      </h3>

      <CodeBlock title="svc.yaml" content={svcYamlFull}>
        {K("apiVersion:")} {V("v1")}
        {"\n"}
        {K("kind:")} {V("Service")}
        {"\n"}
        {K("metadata:")}
        {"\n"}
        {"  "}
        {K("name:")} {V("service")}
        {"\n"}
        {K("spec:")}
        {"\n"}
        {"  "}
        {K("selector:")}
        {"\n"}
        {"    "}
        {K("app:")} {M("payment-app")}
        {"\n"}
        {"  "}
        {K("type:")} {SVC("ClusterIP")}
        {"\n"}
        {"  "}
        {K("ports:")}
        {"\n"}
        {"    "}- {K("port:")} {V("80")}
        {"\n"}
        {"      "}
        {K("protocol:")} {V("TCP")}
        {"\n"}
      </CodeBlock>
    </div>
  );
}
