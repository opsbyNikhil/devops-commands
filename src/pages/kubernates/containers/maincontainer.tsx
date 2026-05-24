import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

const yamlContent = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: mynginximage
      image: nginx:1.29.8
      ports:
        - containerPort: 8080
          protocol: TCP`;

export default function MainContainer() {
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    message.success("Copied to clipboard!");
  };

  // ── Theme Styling ──
  const colors = {
    key: "#7dd3fc", // Cyan/Blue for keys
    string: "#fb923c", // Orange for strings
    bgHeader: isDark ? "#1e293b" : "#f1f5f9",
    bgCode: isDark ? "#0f172a" : "#1e293b",
    border: isDark ? "#334155" : "#d1d5db",
    text: isDark ? "#e2e8f0" : "#f8fafc",
  };

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
        margin: "20px 0",
      }}
    >
      {/* ── Header Bar ── */}
      <div
        style={{
          background: colors.bgHeader,
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: isDark ? "#94a3b8" : "#475569",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <span>pod.yaml</span>
        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: `1px solid ${colors.border}`,
            color: isDark ? "#e2e8f0" : "#1e293b",
            borderRadius: "6px",
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "12px",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = isDark ? "#334155" : "#e2e8f0")
          }
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Copy
        </button>
      </div>

      {/* ── Code Content ── */}
      <pre
        style={{
          background: colors.bgCode,
          padding: "20px",
          margin: 0,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "14px",
          lineHeight: "1.7",
          overflowX: "auto",
          color: colors.text,
        }}
      >
        <code>
          <span style={{ color: colors.key }}>apiVersion:</span>{" "}
          <span style={{ color: colors.string }}>v1</span>
          {"\n"}
          <span style={{ color: colors.key }}>kind:</span>{" "}
          <span style={{ color: colors.string }}>Pod</span>
          {"\n"}
          <span style={{ color: colors.key }}>metadata:</span>
          {"\n"}
          {"  "}
          <span style={{ color: colors.key }}>name:</span>{" "}
          <span style={{ color: colors.string }}>my-pod</span>
          {"\n"}
          <span style={{ color: colors.key }}>spec:</span>
          {"\n"}
          {"  "}
          <span style={{ color: colors.key }}>containers:</span>
          {"\n"}
          {"    "}- <span style={{ color: colors.key }}>name:</span>{" "}
          <span style={{ color: colors.string }}>mynginximage</span>
          {"\n"}
          {"      "}
          <span style={{ color: colors.key }}>image:</span>{" "}
          <span style={{ color: colors.string }}>nginx:1.29.8</span>
          {"\n"}
          {"      "}
          <span style={{ color: colors.key }}>ports:</span>
          {"\n"}
          {"        "}-{" "}
          <span style={{ color: colors.key }}>containerPort:</span>{" "}
          <span style={{ color: colors.string }}>8080</span>
          {"\n"}
          {"          "}
          <span style={{ color: colors.key }}>protocol:</span>{" "}
          <span style={{ color: colors.string }}>TCP</span>
        </code>
      </pre>
    </div>
  );
}
