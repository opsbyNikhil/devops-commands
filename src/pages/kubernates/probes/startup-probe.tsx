import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

// ─────────────────────────────────────────────
// Raw YAML string
// ─────────────────────────────────────────────

const yamlFull = `apiVersion: v1
kind: Pod
metadata:
  name: start-up-pod
  labels:
    app: startup-dev-pod
    env: DEV
spec:
  containers:
    - name: startup-cont
      image: busybox
      ports:
        - containerPort: 80
          protocol: TCP
      startupProbe:
        httpGet:
          path: /site
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 5
        successThreshold: 1 
        failureThreshold: 3`;

// ─────────────────────────────────────────────
// CSS animations
// ─────────────────────────────────────────────

const STYLES = `
  @keyframes startup-dash-flow {
    from { stroke-dashoffset: 20; }
    to   { stroke-dashoffset: 0;  }
  }
  .startup-flow-line {
    stroke-dasharray: 6 4;
    animation: startup-dash-flow 0.8s linear infinite;
  }
`;

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function StartupProbe() {
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

  const kubeletAccent = "#64748b"; // Slate
  const kubeletDim = isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.09)";
  const kubeletBorder = isDark ? "rgba(100,116,139,0.42)" : "rgba(100,116,139,0.32)";

  // Startup Probe uses Purple
  const probeAccent = "#a855f7"; 
  const probeDim = isDark ? "rgba(168,85,247,0.15)" : "rgba(168,85,247,0.09)";
  const probeBorder = isDark ? "rgba(168,85,247,0.42)" : "rgba(168,85,247,0.32)";

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

  const SVG_W = 140;
  const SVG_H = 140;

  // ── Inline YAML syntax helpers ────────────────
  const K = (s: string) => <span style={{ color: codeColors.key }}>{s}</span>;
  const V = (s: string) => <span style={{ color: codeColors.value }}>{s}</span>;
  const P = (s: string) => <span style={{ color: probeAccent }}>{s}</span>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 0 60px" }}>
      <style>{STYLES}</style>

      <h2 style={{ color: titleColor, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 28, margin: "0 0 6px" }}>
        Startup Probe
      </h2>
      <p style={{ color: descColor, fontFamily: "'Space Mono', monospace", fontSize: 11, margin: "0 0 32px", lineHeight: 1.75 }}>
        A <span style={{ color: probeAccent }}>Startup Probe</span> verifies if the application within the container is started. If provided, all other probes are disabled until it succeeds, protecting slow-starting containers from being killed by the liveness probe before they finish booting.
      </p>

      {/* ══════════════════════════════════════════
          Architecture Diagram
      ══════════════════════════════════════════ */}
      <div style={{ background: clusterBg, border: `1.5px dashed ${clusterBdr}`, borderRadius: 16, padding: "30px 24px", marginBottom: 36, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: -10, left: 20, background: isDark ? "#020617" : "#f8fafc", padding: "0 10px", fontFamily: "'Space Mono', monospace", fontSize: 9, color: probeAccent, letterSpacing: "0.12em", fontWeight: 700 }}>
          WORKER NODE
        </div>

        {/* ── Kubelet Card ── */}
        <div style={{ background: cardBg, border: `1px solid ${kubeletBorder}`, borderRadius: 14, padding: "16px", width: 170, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 16px rgba(100,116,139,0.12)", position: "relative", zIndex: 2 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: kubeletDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, border: `1px solid ${kubeletBorder}` }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={kubeletAccent} strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={kubeletAccent} strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 18, color: titleColor, margin: "0 0 4px" }}>Kubelet</p>
          <div style={{ background: kubeletDim, border: `1px solid ${kubeletBorder}`, borderRadius: 6, padding: "4px 8px", fontFamily: "'Space Mono', monospace", fontSize: 9, color: kubeletAccent }}>
            Node Agent
          </div>
        </div>

        {/* ── SVG Connection ── */}
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ flexShrink: 0, overflow: "visible" }}>
          <g transform={`translate(0, ${SVG_H / 2})`}>
            <path d={`M 0,0 L ${SVG_W},0`} stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} strokeWidth={2.5} fill="none" />
            <path d={`M 0,0 L ${SVG_W},0`} stroke={probeAccent} strokeWidth={1.6} fill="none" strokeOpacity={0.8} className="startup-flow-line" />
            <circle r={4} fill={probeAccent} opacity={0.95}>
              <animateMotion dur="1.5s" repeatCount="indefinite" path={`M 0,0 L ${SVG_W},0`} />
            </circle>
            <text x={SVG_W / 2} y={-10} fill={descColor} fontSize={10} fontFamily="'Space Mono', monospace" textAnchor="middle" letterSpacing="0.05em">
              HTTP GET /site:80
            </text>
          </g>
        </svg>

        {/* ── Container Card ── */}
        <div style={{ background: cardBg, border: `1px solid ${probeBorder}`, borderRadius: 14, padding: "16px", width: 190, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 16px rgba(168,85,247,0.12)", position: "relative", zIndex: 2 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #a855f7, #c084fc)", borderRadius: "14px 14px 0 0" }} />
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: "0 4px 12px rgba(168,85,247,0.4)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="white" strokeWidth="1.5"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 18, color: titleColor, margin: "0 0 4px" }}>startup-cont</p>
          <div style={{ background: probeDim, border: `1px solid ${probeBorder}`, borderRadius: 6, padding: "4px 8px", fontFamily: "'Space Mono', monospace", fontSize: 9, color: probeAccent }}>
            [State: Booting up...]
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          How It Works
      ══════════════════════════════════════════ */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
        {[
          { step: "01", title: "Delay", desc: "Kubelet waits initialDelaySeconds (10s) before sending the first probe.", accent: kubeletAccent, dim: kubeletDim, border: kubeletBorder },
          { step: "02", title: "Execution", desc: "Kubelet performs an HTTP GET on port 80 path /site every 5 seconds.", accent: probeAccent, dim: probeDim, border: probeBorder },
          { step: "03", title: "Result", desc: "On success (threshold: 1), the probe is disabled and Liveness/Readiness take over. If it fails 3 times, container restarts.", accent: "#3b82f6", dim: isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)", border: isDark ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)" },
        ].map((item) => (
          <div key={item.step} style={{ flex: "1 1 190px", background: cardBg, border: `1px solid ${item.border}`, borderRadius: 10, padding: "16px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: item.accent, letterSpacing: "0.12em", marginBottom: 6 }}>STEP {item.step}</div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: titleColor, margin: "0 0 5px" }}>{item.title}</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: descColor, margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          YAML Block
      ══════════════════════════════════════════ */}
      <h3 style={{ color: titleColor, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 20, margin: "0 0 12px" }}>pod.yaml</h3>
      <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${codeColors.border}`, marginBottom: "28px" }}>
        <div style={{ background: codeColors.bgHeader, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", color: codeColors.headerText, fontSize: "13px", fontWeight: 600 }}>
          <span>pod.yaml</span>
          <button onClick={() => handleCopy(yamlFull)} style={{ background: "transparent", border: `1px solid ${codeColors.border}`, color: codeColors.text, borderRadius: "4px", padding: "2px 10px", cursor: "pointer", fontSize: "12px" }}>Copy</button>
        </div>
        <pre style={{ background: codeColors.bgCode, padding: "20px", margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", lineHeight: "1.7", overflowX: "auto", color: codeColors.text }}>
          <code>
            {K("apiVersion:")} {V("v1")}{"\n"}
            {K("kind:")} {V("Pod")}{"\n"}
            {K("metadata:")}{"\n"}
            {"  "}{K("name:")} {V("start-up-pod")}{"\n"}
            {"  "}{K("labels:")}{"\n"}
            {"    "}{K("app:")} {V("startup-dev-pod")}{"\n"}
            {"    "}{K("env:")} {V("DEV")}{"\n"}
            {K("spec:")}{"\n"}
            {"  "}{K("containers:")}{"\n"}
            {"    "}- {K("name:")} {V("startup-cont")}{"\n"}
            {"      "}{K("image:")} {V("busybox")}{"\n"}
            {"      "}{K("ports:")}{"\n"}
            {"        "}- {K("containerPort:")} {V("80")}{"\n"}
            {"          "}{K("protocol:")} {V("TCP")}{"\n"}
            {"      "}{P("startupProbe:")}{"\n"}
            {"        "}{P("httpGet:")}{"\n"}
            {"          "}{P("path:")} {V("/site")}{"\n"}
            {"          "}{P("port:")} {V("80")}{"\n"}
            {"        "}{P("initialDelaySeconds:")} {V("10")}{"\n"}
            {"        "}{P("periodSeconds:")} {V("5")}{"\n"}
            {"        "}{P("successThreshold:")} {V("1")}{"\n"}
            {"        "}{P("failureThreshold:")} {V("3")}{"\n"}
          </code>
        </pre>
      </div>
    </div>
  );
}