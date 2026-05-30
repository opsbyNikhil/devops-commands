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
      command: ["sh", "-c", "exit 0"]`;

const cliOutput = `NAME            READY   STATUS             RESTARTS      AGE
pod-lifecycle   0/1     Completed          1 (2s ago)    3s
pod-lifecycle   0/1     CrashLoopBackOff   1 (2s ago)    4s
pod-lifecycle   0/1     Completed          2 (13s ago)   15s
pod-lifecycle   0/1     CrashLoopBackOff   2 (24s ago)   38s
pod-lifecycle   0/1     Completed          3 (26s ago)   40s`;

export default function SucceededState() {
  const { isDark } = useTheme();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success("Copied to clipboard!");
  };

  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const descColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(15,23,42,0.95)" : "#ffffff";
  const clusterBg = isDark ? "rgba(15,23,42,0.45)" : "rgba(241,245,249,0.85)";

  // Succeeded uses Blue
  const accent = "#3b82f6";
  const dim = isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.09)";
  const border = isDark ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.25)";

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
      <h2
        style={{
          color: titleColor,
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 32,
          margin: "0 0 6px",
        }}
      >
        Succeeded
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
        All containers in the Pod have terminated{" "}
        <span style={{ color: accent }}>successfully with exit code 0</span>.
        (Note: Without setting{" "}
        <code style={{ color: accent, fontSize: 11 }}>
          restartPolicy: Never
        </code>
        , successful exits may still trigger a CrashLoop).
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
                d="M20 6L9 17L4 12"
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
            Completed (Exit 0)
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
