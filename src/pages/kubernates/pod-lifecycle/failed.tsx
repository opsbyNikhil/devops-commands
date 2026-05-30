import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

const podYaml = `apiVersion: v1
kind: Pod
metadata:
  name: pod-lifecycle
spec:
  containers:
    - name: pod-lifecycle-cont
      image: nginx
      command: ["sh", "-c", "exit 1"]`;

const cliOutput = `NAME            READY   STATUS             RESTARTS      AGE
pod-lifecycle   0/1     Error              1 (2s ago)    3s
pod-lifecycle   0/1     CrashLoopBackOff   1 (2s ago)    4s
pod-lifecycle   0/1     Error              2 (13s ago)   15s`;

const STYLES = `
  @keyframes shake-error {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .failed-shake {
    animation: shake-error 0.4s ease-in-out;
    animation-iteration-count: 3;
    animation-delay: 1s;
  }
`;

export default function FailedState() {
  const { isDark } = useTheme();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success("Copied to clipboard!");
  };

  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const descColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(15,23,42,0.95)" : "#ffffff";
  const clusterBg = isDark ? "rgba(15,23,42,0.45)" : "rgba(241,245,249,0.85)";

  // Failed uses Red/Rose
  const accent = "#f43f5e";
  const dim = isDark ? "rgba(244,63,94,0.15)" : "rgba(244,63,94,0.09)";
  const border = isDark ? "rgba(244,63,94,0.35)" : "rgba(244,63,94,0.25)";

  const CodeBlock = ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
        marginBottom: "28px",
      }}
    >
      <div
        style={{
          background: isDark ? "#1e293b" : "#e2e8f0",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: isDark ? "#94a3b8" : "#475569",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <span>{title}</span>
        <button
          onClick={() => handleCopy(content)}
          style={{
            background: "transparent",
            border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
            color: isDark ? "#e2e8f0" : "#1e293b",
            borderRadius: "4px",
            padding: "2px 10px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Copy
        </button>
      </div>
      <pre
        style={{
          background: isDark ? "#0f172a" : "#f8fafc",
          padding: "20px",
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
          lineHeight: "1.7",
          overflowX: "auto",
          color: isDark ? "#e2e8f0" : "#1e293b",
        }}
      >
        <code>{content}</code>
      </pre>
    </div>
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 0 60px" }}>
      <style>{STYLES}</style>
      <h2
        style={{
          color: titleColor,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 32,
          margin: "0 0 6px",
        }}
      >
        Failed
      </h2>
      <p
        style={{
          color: descColor,
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          margin: "0 0 32px",
          lineHeight: 1.6,
        }}
      >
        At least one container terminated with a{" "}
        <span style={{ color: accent }}>non-zero exit code</span> (Error).
      </p>

      {/* Visual State */}
      <div
        style={{
          background: clusterBg,
          border: `1px dashed ${border}`,
          borderRadius: 16,
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <div
          className="failed-shake"
          style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 16,
            padding: "24px",
            width: 240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `0 8px 32px ${dim}`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: dim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${accent}`,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: titleColor,
              margin: "16px 0 4px",
            }}
          >
            pod-lifecycle
          </p>
          <div
            style={{
              background: dim,
              color: accent,
              padding: "4px 10px",
              borderRadius: 20,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
            }}
          >
            Error (Exit 1)
          </div>
        </div>
      </div>

      <h3
        style={{
          color: titleColor,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          margin: "0 0 12px",
        }}
      >
        Cluster Output
      </h3>
      <CodeBlock title="kubectl get pods" content={cliOutput} />

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
      <CodeBlock title="pod.yaml" content={podYaml} />
    </div>
  );
}
