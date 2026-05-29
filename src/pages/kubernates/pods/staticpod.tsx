// import React, { useEffect, useState, useRef } from "react";
// import { useTheme } from "../../../Themecontext";

// // ── Static Pod Data ──
// const STATIC_POD_SPEC = {
//   apiVersion: "v1",
//   kind: "Pod",
//   metadata: { name: "static-pod-controlplane" },
//   spec: {
//     containers: [
//       {
//         image: "nginx:1.29",
//         name: "nginx-static",
//         ports: [{ containerPort: 80, protocol: "TCP" }],
//       },
//     ],
//   },
// };

// const STATIC_YAML = `apiVersion: v1
// kind: Pod
// metadata:
//   name: static-pod-controlplane
// spec:
//   containers:
//     - image: "nginx:1.29"
//       name: "nginx-static"
//       ports:
//         - containerPort: 80
//           protocol: TCP`;

// // ── Shared Tokens (copied from your structure) ──
// function useTokens(isDark: boolean) {
//   return {
//     pageBg: isDark
//       ? "radial-gradient(ellipse at 30% 20%,rgba(100,116,139,0.07) 0%,transparent 60%),#04080f"
//       : "radial-gradient(ellipse at 30% 20%,rgba(100,116,139,0.05) 0%,transparent 60%),#f8fafc",
//     surfaceBg: isDark ? "rgba(6,10,26,0.88)" : "#ffffff",
//     surfaceBg2: isDark ? "rgba(6,10,26,0.6)" : "rgba(255,255,255,0.85)",
//     surfaceBg3: isDark ? "rgba(6,10,26,0.85)" : "#f1f5f9",
//     headerBg: isDark ? "rgba(100,116,139,0.06)" : "rgba(100,116,139,0.04)",
//     borderDefault: isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.18)",
//     borderSub: isDark ? "rgba(100,116,139,0.1)" : "rgba(100,116,139,0.12)",
//     textPrimary: isDark ? "#f1f5f9" : "#0f172a",
//     textFaint: isDark ? "#475569" : "#94a3b8",
//     kubectlBg: isDark ? "rgba(6,10,26,0.9)" : "rgba(241,245,255,0.95)",
//     kubectlBorder: isDark ? "rgba(100,116,139,0.2)" : "rgba(100,116,139,0.25)",
//     copyBg: isDark ? "rgba(100,116,139,0.1)" : "rgba(100,116,139,0.08)",
//   };
// }

// // ── Static Pod Icon ──
// function StaticPodIcon() {
//   return (
//     <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
//       <path
//         d="M14 5l8 4.6v9.2L14 23.4l-8-4.6v-9.2L14 5Z"
//         stroke="#64748b"
//         strokeWidth="2"
//         fill="rgba(100,116,139,0.1)"
//         strokeLinejoin="round"
//       />
//       <circle
//         cx="14"
//         cy="13"
//         r="2.5"
//         stroke="#64748b"
//         strokeWidth="2"
//         fill="rgba(255,255,255,0.2)"
//       />
//       <path
//         d="M14 15.5v4"
//         stroke="#64748b"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// export default function StaticPodView() {
//   const { isDark } = useTheme();
//   const tk = useTokens(isDark);
//   const [deleted, setDeleted] = useState(false);
//   const [age, setAge] = useState(1240);

//   // Auto-age increment
//   useEffect(() => {
//     const t = setInterval(() => setAge((a) => a + 1), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const handleDelete = () => {
//     setDeleted(true);
//     setTimeout(() => {
//       setDeleted(false);
//     }, 2000);
//   };

//   return (
//     <div style={{ padding: "24px", fontFamily: "'JetBrains Mono', monospace" }}>
//       <div style={{ maxWidth: 800, margin: "0 auto" }}>
//         {/* Header Section */}
//         <div style={{ marginBottom: 30 }}>
//           <h2 style={{ color: tk.textPrimary }}>Static Pod Lifecycle</h2>
//           <p style={{ color: tk.textFaint, fontSize: 12 }}>
//             Managed by: <code>kubelet</code> | Source:{" "}
//             <code>/etc/kubernetes/manifests/</code>
//           </p>
//         </div>

//         {/* The Pod State Panel */}
//         <div
//           style={{
//             background: tk.surfaceBg,
//             border: `1px solid ${tk.borderDefault}`,
//             borderRadius: 12,
//             padding: 20,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 15,
//               marginBottom: 20,
//             }}
//           >
//             <StaticPodIcon />
//             <div>
//               <h3 style={{ margin: 0 }}>{STATIC_POD_SPEC.metadata.name}</h3>
//               <span
//                 style={{ fontSize: 10, color: deleted ? "#ef4444" : "#22c55e" }}
//               >
//                 {deleted ? "DELETED - RECREATING..." : "RUNNING (Mirror Pod)"}
//               </span>
//             </div>
//             <button
//               onClick={handleDelete}
//               style={{
//                 marginLeft: "auto",
//                 padding: "6px 12px",
//                 background: "#ef4444",
//                 color: "white",
//                 border: "none",
//                 borderRadius: 4,
//                 cursor: "pointer",
//               }}
//             >
//               kubectl delete pod
//             </button>
//           </div>

//           <div
//             style={{
//               background: tk.kubectlBg,
//               padding: 15,
//               borderRadius: 8,
//               border: `1px solid ${tk.kubectlBorder}`,
//             }}
//           >
//             <p style={{ fontSize: 11, color: tk.textFaint }}>
//               {deleted
//                 ? "kubelet: Manifest detected. Recreating pod..."
//                 : "kubelet: Manifest is healthy. Pod is running."}
//             </p>
//             <pre style={{ fontSize: 11, color: tk.textPrimary }}>
//               {STATIC_YAML}
//             </pre>
//           </div>
//         </div>

//         {/* Educational Note */}
//         <div
//           style={{
//             marginTop: 20,
//             padding: 15,
//             background: tk.headerBg,
//             borderRadius: 8,
//           }}
//         >
//           <h4 style={{ margin: "0 0 10px" }}>Why it reappears:</h4>
//           <p style={{ fontSize: 12, color: tk.textFaint, lineHeight: 1.6 }}>
//             Static pods are not controlled by the API Server. The{" "}
//             <strong>kubelet</strong> watches the directory{" "}
//             <code>/etc/kubernetes/manifests/</code>. If the YAML file exists,
//             the kubelet will ensure the pod is always running. Deleting the
//             mirror pod via <code>kubectl</code>
//             has no effect because the source of truth is the local file on the
//             node.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useTheme } from "../../../Themecontext";
import {
  Card,
  Button,
  Typography,
  Tag,
  Space,
  Alert,
  Divider,
  Descriptions,
  Badge,
  ConfigProvider,
  theme,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// ── Static Pod Data ──
const STATIC_POD_SPEC = {
  apiVersion: "v1",
  kind: "Pod",
  metadata: { name: "static-pod-controlplane" },
  spec: {
    containers: [
      {
        image: "nginx:1.29",
        name: "nginx-static",
        ports: [{ containerPort: 80, protocol: "TCP" }],
      },
    ],
  },
};

const STATIC_YAML = `apiVersion: v1
kind: Pod
metadata:
  name: static-pod-controlplane
spec:
  containers:
    - image: "nginx:1.29"
      name: "nginx-static"
      ports:
        - containerPort: 80
          protocol: TCP`;

// ── Static Pod Icon ──
function StaticPodIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 5l8 4.6v9.2L14 23.4l-8-4.6v-9.2L14 5Z"
        stroke="#64748b"
        strokeWidth="2"
        fill="rgba(100,116,139,0.1)"
        strokeLinejoin="round"
      />
      <circle
        cx="14"
        cy="13"
        r="2.5"
        stroke="#64748b"
        strokeWidth="2"
        fill="rgba(255,255,255,0.2)"
      />
      <path
        d="M14 15.5v4"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function StaticPodView() {
  const { isDark } = useTheme();
  const [deleted, setDeleted] = useState(false);
  const [age, setAge] = useState(1240);

  // Auto-age increment
  useEffect(() => {
    const t = setInterval(() => setAge((a) => a + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handleDelete = () => {
    setDeleted(true);
    setTimeout(() => {
      setDeleted(false);
    }, 2000);
  };

  // Format age into hours:minutes:seconds
  const formatAge = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Ant Design theme override based on dark mode
  const antTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? "#60a5fa" : "#2563eb",
      borderRadius: 8,
    },
  };

  return (
    <ConfigProvider theme={antTheme}>
      <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ marginBottom: 24 }}>
          <Space
            align="start"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Static Pod Lifecycle
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Managed by: <code>kubelet</code> | Source:{" "}
                <code>/etc/kubernetes/manifests/</code>
              </Text>
            </div>
            <Badge
              status={deleted ? "error" : "success"}
              text={deleted ? "RECREATING..." : "ACTIVE"}
            />
          </Space>
        </div>

        {/* Main Pod Card */}
        <Card
          bordered={false}
          style={{
            background: isDark ? "rgba(6,10,26,0.88)" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.18)"}`,
            borderRadius: 12,
            marginBottom: 24,
          }}
          bodyStyle={{ padding: "24px" }}
        >
          {/* Card Header */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
          >
            <Space size="middle" align="center" style={{ flex: 1 }}>
              <StaticPodIcon />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {STATIC_POD_SPEC.metadata.name}
                </Title>
                <Space>
                  <Tag color={deleted ? "error" : "success"}>
                    {deleted ? "DELETED" : "RUNNING"}
                  </Tag>
                  {deleted ? (
                    <Tag color="warning" icon={<ReloadOutlined spin />}>
                      RECREATING
                    </Tag>
                  ) : (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Mirror Pod
                    </Tag>
                  )}
                </Space>
              </div>
            </Space>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleted}
            >
              kubectl delete pod
            </Button>
          </div>

          {/* Pod Details */}
          <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="API Version">
              <code>{STATIC_POD_SPEC.apiVersion}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Kind">
              <code>{STATIC_POD_SPEC.kind}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              <code>{STATIC_POD_SPEC.spec.containers[0].image}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Container Name">
              <code>{STATIC_POD_SPEC.spec.containers[0].name}</code>
            </Descriptions.Item>
            <Descriptions.Item label="Port">
              <code>
                {STATIC_POD_SPEC.spec.containers[0].ports[0].containerPort}/
                {STATIC_POD_SPEC.spec.containers[0].ports[0].protocol}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label="Age">
              <Space>
                <ClockCircleOutlined />
                <Text>{formatAge(age)}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "12px 0" }} />

          {/* Kubectl Status Section */}
          <div
            style={{
              background: isDark
                ? "rgba(6,10,26,0.9)"
                : "rgba(241,245,255,0.95)",
              padding: "16px",
              borderRadius: 8,
              border: `1px solid ${isDark ? "rgba(100,116,139,0.2)" : "rgba(100,116,139,0.25)"}`,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <FileTextOutlined
                style={{
                  marginRight: 8,
                  color: isDark ? "#60a5fa" : "#2563eb",
                }}
              />
              <Text strong>kubelet Status</Text>
            </div>
            <Alert
              message={
                deleted
                  ? "kubelet: Manifest detected. Recreating pod..."
                  : "kubelet: Manifest is healthy. Pod is running."
              }
              type={deleted ? "warning" : "success"}
              showIcon
              style={{ marginBottom: 12 }}
            />
            <div
              style={{
                background: isDark ? "#04080f" : "#f8fafc",
                padding: "12px",
                borderRadius: 6,
                overflow: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: isDark ? "#f1f5f9" : "#0f172a",
                }}
              >
                {STATIC_YAML}
              </pre>
            </div>
          </div>
        </Card>

        {/* Educational Note */}
        <Alert
          message="Why it reappears:"
          description={
            <Paragraph style={{ margin: 0 }}>
              Static pods are not controlled by the API Server. The{" "}
              <strong>kubelet</strong> watches the directory{" "}
              <code>/etc/kubernetes/manifests/</code>. If the YAML file exists,
              the kubelet will ensure the pod is always running. Deleting the
              mirror pod via <code>kubectl</code> has no effect because the
              source of truth is the local file on the node.
            </Paragraph>
          }
          type="info"
          showIcon
          style={{
            background: isDark
              ? "rgba(100,116,139,0.06)"
              : "rgba(100,116,139,0.04)",
            border: `1px solid ${isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.18)"}`,
            borderRadius: 8,
          }}
        />
      </div>
    </ConfigProvider>
  );
}