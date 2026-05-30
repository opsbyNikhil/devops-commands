import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

// ─────────────────────────────────────────────
// Raw YAML strings (for copy button)
// ─────────────────────────────────────────────

const podYamlFull = `apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-1
  labels:
    env: EX-DEV
spec:
  containers:
    - name: ex-cont-1
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-2
  labels:
    env: EX-DEV
spec:
  containers:
    - name: ex-cont-2
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-3
  labels:
    env: EX-DEV
spec:
  containers:
    - name: ex-cont-3
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-ex-4
  labels:
    env: EX-DEV
spec:
  containers:
    - name: ex-cont-4
      image: nginx
      ports:
        - containerPort: 80
          protocol: TCP`;

const svcYamlFull = `apiVersion: v1
kind: Service
metadata:
  name: svc-pay
spec:
  selector:
    env: DEV
  type: ExternalName
  ports:
    - port: 80
      protocol: TCP
  externalName: www.google.com`;

// ─────────────────────────────────────────────
// CSS animations
// ─────────────────────────────────────────────

const STYLES = `
  @keyframes ex-dash-flow {
    from { stroke-dashoffset: 20; }
    to   { stroke-dashoffset: 0;  }
  }
  @keyframes ex-label-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.4); }
    50%       { box-shadow: 0 0 0 4px rgba(168,85,247,0);  }
  }
  .ex-flow-line {
    stroke-dasharray: 6 4;
    animation: ex-dash-flow 0.65s linear infinite;
  }
  .ex-ext-flow-line {
    stroke-dasharray: 8 6;
    animation: ex-dash-flow 0.8s linear infinite;
  }
  .ex-label-badge {
    animation: ex-label-glow 2.8s ease-in-out infinite;
  }
`;

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function ExternalName() {
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
  const clusterBdr = isDark ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.35)";

  // ExternalName uses Purple
  const svcAccent = "#a855f7";
  const svcDim = isDark ? "rgba(168,85,247,0.15)" : "rgba(168,85,247,0.09)";
  const svcBorder = isDark ? "rgba(168,85,247,0.42)" : "rgba(168,85,247,0.32)";

  const cloudAccent = "#0ea5e9"; // Light blue for external domain
  const cloudDim = isDark ? "rgba(14,165,233,0.15)" : "rgba(14,165,233,0.09)";
  const cloudBorder = isDark ? "rgba(14,165,233,0.4)" : "rgba(14,165,233,0.32)";

  const podAccent = "#326CE5";
  const podDim = isDark ? "rgba(50,108,229,0.15)" : "rgba(50,108,229,0.09)";
  const podBorder = isDark ? "rgba(50,108,229,0.42)" : "rgba(50,108,229,0.3)";

  const matchAccent = "#22c55e";

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
    { name: "pod-ex-1", container: "ex-cont-1" },
    { name: "pod-ex-2", container: "ex-cont-2" },
    { name: "pod-ex-3", container: "ex-cont-3" },
    { name: "pod-ex-4", container: "ex-cont-4" },
  ];
  const totalH = pods.length * POD_H + (pods.length - 1) * POD_GAP;
  const svcCY = totalH / 2;
  const podCYs = pods.map((_, i) => i * (POD_H + POD_GAP) + POD_H / 2);
  const SVG_INT_W = 90;
  const SVG_EXT_W = 70;
  const lineAccents = ["#a855f7", "#326CE5", "#0ea5e9", "#22c55e"];

  // Flow goes FROM pods TO service
  const curvePath = (podCY: number) =>
    `M 0,${podCY} C ${SVG_INT_W * 0.48},${podCY} ${SVG_INT_W * 0.52},${svcCY} ${SVG_INT_W},${svcCY}`;

  // ── Inline YAML syntax helpers ────────────────
  const K = (s: string) => <span style={{ color: codeColors.key }}>{s}</span>;
  const V = (s: string) => <span style={{ color: codeColors.value }}>{s}</span>;
  const M = (s: string) => <span style={{ color: matchAccent }}>{s}</span>;
  const C = (s: string) => (
    <span style={{ color: codeColors.comment }}>{s}</span>
  );
  const SVC = (s: string) => <span style={{ color: svcAccent }}>{s}</span>;

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
      {K("env:")} {M("EX-DEV")}
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
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 0 60px" }}>
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
        ExternalName Service
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
        An <span style={{ color: svcAccent }}>ExternalName</span> Service acts
        as a DNS alias. Instead of routing traffic to Pods using a selector, it
        returns a CNAME record so internal pods can securely route out to
        external domains (like{" "}
        <code style={{ color: cloudAccent, fontSize: 10 }}>www.google.com</code>
        ).
      </p>

      {/* ══════════════════════════════════════════
          Architecture Diagram (Flow is Left to Right)
      ══════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 36,
          overflowX: "auto",
          paddingBottom: 20,
        }}
      >
        {/* ── KUBERNETES CLUSTER BOUNDARY ── */}
        <div
          style={{
            background: clusterBg,
            border: `1.5px dashed ${clusterBdr}`,
            borderRadius: 16,
            padding: "30px 24px 24px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Floating node label */}
          <div
            style={{
              position: "absolute",
              top: -10,
              left: 20,
              background: isDark ? "#020617" : "#f8fafc",
              padding: "0 10px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: svcAccent,
              letterSpacing: "0.12em",
              userSelect: "none",
              fontWeight: 700,
            }}
          >
            KUBERNETES CLUSTER
          </div>

          {/* ── Pod cards ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: POD_GAP,
              flex: 1,
            }}
          >
            {pods.map((pod) => (
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

                <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                  <p
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: titleColor,
                      margin: "0 0 5px",
                    }}
                  >
                    {pod.name}
                  </p>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: descColor,
                    }}
                  >
                    Makes HTTP Request
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── SVG Internal animated connection lines (Outbound) ── */}
          <svg
            width={SVG_INT_W}
            height={totalH}
            viewBox={`0 0 ${SVG_INT_W} ${totalH}`}
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
                    className="ex-flow-line"
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

          {/* ── Service card (ExternalName) ── */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${svcBorder}`,
              borderRadius: 14,
              padding: "18px 16px",
              width: 190,
              height: totalH,
              boxSizing: "border-box",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxShadow: isDark
                ? "0 4px 24px rgba(0,0,0,0.5)"
                : "0 4px 16px rgba(168,85,247,0.12)",
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
                background: "linear-gradient(90deg, #a855f7, #d946ef)",
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
              ⬡ CORE DNS
            </div>

            {/* Name */}
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: titleColor,
                margin: "0 0 2px",
              }}
            >
              svc-pay
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: svcAccent,
                margin: "0 0 14px",
              }}
            >
              ExternalName
            </p>

            {/* DNS Resolution */}
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
                RETURNS CNAME
              </div>
              <div
                className="ex-label-badge"
                style={{
                  background: cloudDim,
                  border: `1px solid ${cloudBorder}`,
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: cloudAccent,
                  wordBreak: "break-all",
                }}
              >
                www.google.com
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: descColor,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              *Selectors and ports are typically ignored for ExternalName.
            </p>
          </div>
        </div>

        {/* ── External SVG Connection (Egress Traffic) ── */}
        <svg
          width={SVG_EXT_W}
          height={totalH + 60}
          viewBox={`0 0 ${SVG_EXT_W} ${totalH + 60}`}
          style={{ flexShrink: 0, overflow: "visible" }}
        >
          <g transform={`translate(0, ${(totalH + 60) / 2})`}>
            <path
              d={`M 0,0 L ${SVG_EXT_W},0`}
              stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
              strokeWidth={2.5}
              fill="none"
            />
            <path
              d={`M 0,0 L ${SVG_EXT_W},0`}
              stroke={cloudAccent}
              strokeWidth={1.6}
              fill="none"
              strokeOpacity={0.8}
              className="ex-ext-flow-line"
            />
            <circle r={3.5} fill={cloudAccent} opacity={0.95}>
              <animateMotion
                dur="1s"
                repeatCount="indefinite"
                path={`M 0,0 L ${SVG_EXT_W},0`}
              />
            </circle>
          </g>
        </svg>

        {/* ── EXTERNAL DOMAIN / INTERNET ── */}
        <div
          style={{
            background: isDark
              ? "rgba(14,165,233,0.05)"
              : "rgba(14,165,233,0.03)",
            border: `1px solid ${cloudBorder}`,
            borderRadius: 14,
            padding: "20px 16px",
            width: 160,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 16px rgba(14,165,233,0.12)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
              borderRadius: "14px 14px 0 0",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: cloudDim,
              border: `1px solid ${cloudBorder}`,
              borderRadius: 20,
              padding: "2px 8px",
              marginBottom: 12,
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: cloudAccent,
              letterSpacing: "0.08em",
            }}
          >
            EXTERNAL INTERNET
          </div>

          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
              boxShadow: "0 4px 12px rgba(14,165,233,0.4)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <ellipse
                cx="12"
                cy="12"
                rx="4"
                ry="10"
                stroke="white"
                strokeWidth="1.5"
              />
              <path d="M2 12h20" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: titleColor,
              margin: "0 0 4px",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Google API
          </p>
          <div
            style={{
              background: cloudDim,
              border: `1px solid ${cloudBorder}`,
              borderRadius: 6,
              padding: "4px 8px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: cloudAccent,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            www.google.com
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
            title: "Pod DNS Request",
            desc: "A pod inside the cluster wants to reach the API. It makes a request to the internal service name `svc-pay`.",
            accent: podAccent,
            dim: podDim,
            border: podBorder,
          },
          {
            step: "02",
            title: "CNAME Resolution",
            desc: "The cluster's DNS (CoreDNS) intercepts the request and immediately returns a CNAME pointing to `www.google.com`.",
            accent: svcAccent,
            dim: svcDim,
            border: svcBorder,
          },
          {
            step: "03",
            title: "Direct Egress",
            desc: "The Pod directly connects to the external domain over the internet. No proxying happens through the service.",
            accent: cloudAccent,
            dim: cloudDim,
            border: cloudBorder,
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
                color: titleColor,
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
        <PodBlock name="pod-ex-1" containerName="ex-cont-1" />
        {C("---")}
        {"\n"}
        <PodBlock name="pod-ex-2" containerName="ex-cont-2" />
        {C("---")}
        {"\n"}
        <PodBlock name="pod-ex-3" containerName="ex-cont-3" />
        {C("---")}
        {"\n"}
        <PodBlock name="pod-ex-4" containerName="ex-cont-4" />
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
        {K("name:")} {V("svc-pay")}
        {"\n"}
        {K("spec:")}
        {"\n"}
        {"  "}
        {K("selector:")}
        {"\n"}
        {"    "}
        {K("env:")} {M("DEV")} {C("  # Often ignored for ExternalName")}
        {"\n"}
        {"  "}
        {K("type:")} {SVC("ExternalName")}
        {"\n"}
        {"  "}
        {K("ports:")}
        {"\n"}
        {"    "}- {K("port:")} {V("80")}
        {"\n"}
        {"      "}
        {K("protocol:")} {V("TCP")}
        {"\n"}
        {"  "}
        {K("externalName:")} {V("www.google.com")}
        {"\n"}
      </CodeBlock>
    </div>
  );
}
