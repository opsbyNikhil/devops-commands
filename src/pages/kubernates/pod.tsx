import React, { useState } from "react";
import { useTheme } from "../../Themecontext";

export default function PodYamlExample() {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  // Cleaned up standard YAML formatting
  const yamlContent = `apiVersion: v1
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

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme Variables
  const bg = isDark ? "#09090b" : "#f1f5f9";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textTitle = isDark ? "#f8fafc" : "#0f172a";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px 0",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* File Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: isDark ? "rgba(30, 41, 59, 0.8)" : "#e2e8f0",
          border: `1px solid ${border}`,
          borderBottom: "none",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>📄</span>
          <span style={{ fontSize: "14px", fontWeight: 600, color: textTitle }}>
            pod.yaml
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: copied
              ? "rgba(34, 197, 94, 0.2)"
              : "rgba(59, 130, 246, 0.15)",
            color: copied ? "#4ade80" : isDark ? "#60a5fa" : "#2563eb",
            border: `1px solid ${copied ? "rgba(34, 197, 94, 0.4)" : "rgba(59, 130, 246, 0.3)"}`,
            padding: "4px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code Block */}
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          padding: "16px",
          overflowX: "auto",
        }}
      >
        <pre style={{ margin: 0 }}>
          <code
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "14px",
              lineHeight: "1.5",
              color: isDark ? "#38bdf8" : "#0369a1",
            }}
          >
            {yamlContent}
          </code>
        </pre>
      </div>
    </div>
  );
}
