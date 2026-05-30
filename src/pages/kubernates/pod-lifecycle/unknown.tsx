import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

const cliOutput = `NAME            READY   STATUS    RESTARTS   AGE
my-pod          0/1     Unknown   0          10m`;

const STYLES = `
  @keyframes blink-opacity {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .unknown-blink {
    animation: blink-opacity 2s ease-in-out infinite;
  }
`;

export default function UnknownState() {
  const { isDark } = useTheme();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success("Copied to clipboard!");
  };

  const titleColor = isDark ? "#f1f5f9" : "#0f172a";
  const descColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(15,23,42,0.95)" : "#ffffff";
  const clusterBg = isDark ? "rgba(15,23,42,0.45)" : "rgba(241,245,249,0.85)";

  // Unknown uses Slate/Gray
  const accent = "#64748b";
  const dim = isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.09)";
  const border = isDark ? "rgba(100,116,139,0.35)" : "rgba(100,116,139,0.25)";

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
        Unknown
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
        The state of the Pod cannot be determined. This usually occurs due to{" "}
        <span style={{ color: accent }}>Node communication issues</span> (the
        API server lost contact with the Kubelet).
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
          className="unknown-blink"
          style={{
            background: cardBg,
            border: `1px dashed ${border}`,
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
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01"
                stroke={accent}
                strokeWidth="2.5"
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
            my-pod
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
            Unreachable
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
    </div>
  );
}
