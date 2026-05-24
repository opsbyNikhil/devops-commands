import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

const sidecarYaml = `apiVersion: v1
kind: Pod
metadata:
  name: sidecar-cont
spec:
  containers:
    - name: main-cont
      image: nginx
      volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/nginx
    - name: sidecar-container
      image: busybox
      command: ["/bin/sh", "-c", "tail -f /var/log/nginx/error.log"]
      volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/nginx
  volumes:
    - name: nginx-logs
      emptyDir: {}`;

export default function SidecarContainer() {
  const { isDark } = useTheme();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success("Copied to clipboard!");
  };

  const colors = {
    key: "#7dd3fc", // Cyan/Blue
    value: "#fb923c", // Orange/Amber
    bgHeader: "#1e293b",
    bgCode: "#0f172a",
    border: "#334155",
    text: "#e2e8f0",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: "8px" }}>
        Sidecar Container
      </h2>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
        The sidecar pattern extends the functionality of your main container
        (like logging or monitoring) without modifying the main application
        code.
      </p>

      {/* ── Code Block ── */}
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: colors.bgHeader,
            padding: "8px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#94a3b8",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <span>pod.yaml</span>
          <button
            onClick={() => handleCopy(sidecarYaml)}
            style={{
              background: "transparent",
              border: `1px solid ${colors.border}`,
              color: colors.text,
              borderRadius: "4px",
              padding: "2px 10px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#334155")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Copy
          </button>
        </div>
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
            <span style={{ color: colors.value }}>v1</span>
            {"\n"}
            <span style={{ color: colors.key }}>kind:</span>{" "}
            <span style={{ color: colors.value }}>Pod</span>
            {"\n"}
            <span style={{ color: colors.key }}>metadata:</span>
            {"\n"}
            {"  "}
            <span style={{ color: colors.key }}>name:</span>{" "}
            <span style={{ color: colors.value }}>sidecar-cont</span>
            {"\n"}
            <span style={{ color: colors.key }}>spec:</span>
            {"\n"}
            {"  "}
            <span style={{ color: colors.key }}>containers:</span>
            {"\n"}
            {"    "}- <span style={{ color: colors.key }}>name:</span>{" "}
            <span style={{ color: colors.value }}>main-cont</span>
            {"\n"}
            {"      "}
            <span style={{ color: colors.key }}>image:</span>{" "}
            <span style={{ color: colors.value }}>nginx</span>
            {"\n"}
            {"      "}
            <span style={{ color: colors.key }}>volumeMounts:</span>
            {"\n"}
            {"        "}- <span style={{ color: colors.key }}>name:</span>{" "}
            <span style={{ color: colors.value }}>nginx-logs</span>
            {"\n"}
            {"          "}
            <span style={{ color: colors.key }}>mountPath:</span>{" "}
            <span style={{ color: colors.value }}>/var/log/nginx</span>
            {"\n"}
            {"    "}- <span style={{ color: colors.key }}>name:</span>{" "}
            <span style={{ color: colors.value }}>sidecar-container</span>
            {"\n"}
            {"      "}
            <span style={{ color: colors.key }}>image:</span>{" "}
            <span style={{ color: colors.value }}>busybox</span>
            {"\n"}
            {"      "}
            <span style={{ color: colors.key }}>command:</span>{" "}
            <span style={{ color: colors.value }}>
              ["/bin/sh", "-c", "tail -f /var/log/nginx/error.log"]
            </span>
            {"\n"}
            {"      "}
            <span style={{ color: colors.key }}>volumeMounts:</span>
            {"\n"}
            {"        "}- <span style={{ color: colors.key }}>name:</span>{" "}
            <span style={{ color: colors.value }}>nginx-logs</span>
            {"\n"}
            {"          "}
            <span style={{ color: colors.key }}>mountPath:</span>{" "}
            <span style={{ color: colors.value }}>/var/log/nginx</span>
            {"\n"}
            <span style={{ color: colors.key }}>volumes:</span>
            {"\n"}
            {"  "}- <span style={{ color: colors.key }}>name:</span>{" "}
            <span style={{ color: colors.value }}>nginx-logs</span>
            {"\n"}
            {"    "}
            <span style={{ color: colors.key }}>emptyDir:</span> {"{}"}
          </code>
        </pre>
      </div>
    </div>
  );
}
