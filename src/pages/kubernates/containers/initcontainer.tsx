import React from "react";
import { useTheme } from "../../../Themecontext";
import { message } from "antd";

const podYaml = `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: nginx
spec:
  containers:
    - name: my-cont
      image: nginx
      ports:
        - containerPort: 80
      volumeMounts:
        - name: init-vol
          mountPath: /usr/share/nginx/html
  initContainers:
    - name: my-init-cont
      image: busybox
      command:
        - sh
        - -c
        - echo "<h1>Welcome to my page<h1> > /usr/share/nginx/html/index.html"
      volumeMounts:
        - name: init-vol
          mountPath: /usr/share/nginx/html
  volumes:
    - name: init-vol
      emptyDir: {}`;

const serviceYaml = `apiVersion: v1
kind: Service
metadata:
  name: my-svc
spec:
  selector:
    app: nginx
  type: NodePort
  ports:
    - port: 80
      protocol: TCP
      nodePort: 31234`;

export default function InitContainer() {
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

  // Helper to format the yaml with colors
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
        <span>{title}</span>
        <button
          onClick={() => handleCopy(content)}
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
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
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
        <code>{children}</code>
      </pre>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: "8px" }}>
        Init Containers & Service
      </h2>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
        An Init Container runs to completion before the main application starts.
      </p>

      <CodeBlock title="pod.yaml" content={podYaml}>
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
        <span style={{ color: colors.value }}>my-pod</span>
        {"\n"}
        {"  "}
        <span style={{ color: colors.key }}>labels:</span>
        {"\n"}
        {"    "}
        <span style={{ color: colors.key }}>app:</span>{" "}
        <span style={{ color: colors.value }}>nginx</span>
        {"\n"}
        <span style={{ color: colors.key }}>spec:</span>
        {"\n"}
        {"  "}
        <span style={{ color: colors.key }}>containers:</span>
        {"\n"}
        {"    "}- <span style={{ color: colors.key }}>name:</span>{" "}
        <span style={{ color: colors.value }}>my-cont</span>
        {"\n"}
        {"      "}
        <span style={{ color: colors.key }}>image:</span>{" "}
        <span style={{ color: colors.value }}>nginx</span>
        {"\n"}
        {"      "}
        <span style={{ color: colors.key }}>ports:</span>
        {"\n"}
        {"        "}- <span style={{ color: colors.key }}>containerPort:</span>{" "}
        <span style={{ color: colors.value }}>80</span>
        {"\n"}
        {"      "}
        <span style={{ color: colors.key }}>volumeMounts:</span>
        {"\n"}
        {"        "}- <span style={{ color: colors.key }}>name:</span>{" "}
        <span style={{ color: colors.value }}>init-vol</span>
        {"\n"}
        {"          "}
        <span style={{ color: colors.key }}>mountPath:</span>{" "}
        <span style={{ color: colors.value }}>/usr/share/nginx/html</span>
        {"\n"}
        <span style={{ color: colors.key }}>initContainers:</span>
        {"\n"}
        {"  "}- <span style={{ color: colors.key }}>name:</span>{" "}
        <span style={{ color: colors.value }}>my-init-cont</span>
        {"\n"}
        {"    "}
        <span style={{ color: colors.key }}>image:</span>{" "}
        <span style={{ color: colors.value }}>busybox</span>
        {"\n"}
        {"    "}
        <span style={{ color: colors.key }}>command:</span>
        {"\n"}
        {"      "}- <span style={{ color: colors.value }}>sh</span>
        {"\n"}
        {"      "}- <span style={{ color: colors.value }}>-c</span>
        {"\n"}
        {"      "}-{" "}
        <span style={{ color: colors.value }}>
          echo &quot;Welcome to my page&quot; &gt;
          /usr/share/nginx/html/index.html
        </span>
        {"\n"} {"    "}
        <span style={{ color: colors.key }}>volumeMounts:</span>
        {"\n"}
        {"      "}- <span style={{ color: colors.key }}>name:</span>{" "}
        <span style={{ color: colors.value }}>init-vol</span>
        {"\n"}
        {"        "}
        <span style={{ color: colors.key }}>mountPath:</span>{" "}
        <span style={{ color: colors.value }}>/usr/share/nginx/html</span>
        {"\n"}
        <span style={{ color: colors.key }}>volumes:</span>
        {"\n"}
        {"  "}- <span style={{ color: colors.key }}>name:</span>{" "}
        <span style={{ color: colors.value }}>init-vol</span>
        {"\n"}
        {"    "}
        <span style={{ color: colors.key }}>emptyDir:</span> {"{}"}
      </CodeBlock>

      <CodeBlock title="service.yaml" content={serviceYaml}>
        <span style={{ color: colors.key }}>apiVersion:</span>{" "}
        <span style={{ color: colors.value }}>v1</span>
        {"\n"}
        <span style={{ color: colors.key }}>kind:</span>{" "}
        <span style={{ color: colors.value }}>Service</span>
        {"\n"}
        <span style={{ color: colors.key }}>metadata:</span>
        {"\n"}
        {"  "}
        <span style={{ color: colors.key }}>name:</span>{" "}
        <span style={{ color: colors.value }}>my-svc</span>
        {"\n"}
        <span style={{ color: colors.key }}>spec:</span>
        {"\n"}
        {"  "}
        <span style={{ color: colors.key }}>selector:</span>
        {"\n"}
        {"    "}
        <span style={{ color: colors.key }}>app:</span>{" "}
        <span style={{ color: colors.value }}>nginx</span>
        {"\n"}
        {"  "}
        <span style={{ color: colors.key }}>type:</span>{" "}
        <span style={{ color: colors.value }}>NodePort</span>
        {"\n"}
        {"  "}
        <span style={{ color: colors.key }}>ports:</span>
        {"\n"}
        {"    "}- <span style={{ color: colors.key }}>port:</span>{" "}
        <span style={{ color: colors.value }}>80</span>
        {"\n"}
        {"      "}
        <span style={{ color: colors.key }}>protocol:</span>{" "}
        <span style={{ color: colors.value }}>TCP</span>
        {"\n"}
        {"      "}
        <span style={{ color: colors.key }}>nodePort:</span>{" "}
        <span style={{ color: colors.value }}>31234</span>
      </CodeBlock>
    </div>
  );
}
