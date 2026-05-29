import React, { useState } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTheme } from "../../Themecontext";

import PodYamlExample from "./pod";
import MainContainer from "./containers/maincontainer";
import InitContainer from "./containers/initcontainer";
import SidecarContainer from "./containers/sidecarcontainer"
import StaticPod from "./pods/staticpod"
import Singlepod from "./pods/single_pod";
import MultiplePod from "./pods/multiple_pod";

// const SidecarContainer: React.FC = () => {
//   return <div />;
// };
export const k8sCommandCount = 4;

// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────

function K8sLogo({
  size = 20,
  color = "#326CE5",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M15.9 1a1.1 1.1 0 0 0-.43.09L5.73 5.34a1.1 1.1 0 0 0-.66.83L3.53 16.5a1.1 1.1 0 0 0 .28.92l7.45 8.06a1.1 1.1 0 0 0 .81.36h7.86a1.1 1.1 0 0 0 .81-.36l7.45-8.06a1.1 1.1 0 0 0 .28-.92l-1.54-10.33a1.1 1.1 0 0 0-.66-.83L16.43 1.09A1.1 1.1 0 0 0 15.9 1z"
        fill={color}
        opacity="0.15"
      />
      <path
        d="M16 3.5l8.5 3.8.2 1.2M16 3.5l-8.5 3.8-.2 1.2M16 28.5l-7-7.6.3-1.2M16 28.5l7-7.6-.3-1.2M5.5 8.5l-1.3 8.7 1 1M26.5 8.5l1.3 8.7-1 1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="16" r="3.5" fill={color} />
      <circle cx="16" cy="5" r="2" fill={color} />
      <circle cx="16" cy="27" r="2" fill={color} />
      <circle cx="6" cy="10.5" r="2" fill={color} />
      <circle cx="26" cy="10.5" r="2" fill={color} />
      <circle cx="6" cy="21.5" r="2" fill={color} />
      <circle cx="26" cy="21.5" r="2" fill={color} />
    </svg>
  );
}

function PodIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.15)"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
      <path
        d="M12 5v2M12 17v2M5.5 8.5l1.7 1M16.8 14.5l1.7 1M5.5 15.5l1.7-1M16.8 9.5l1.7-1"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContainerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.15)"
      />
      <path
        d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M3 11h18"
        stroke="white"
        strokeWidth="1.3"
        strokeDasharray="3 2"
      />
      <circle cx="9" cy="15" r="1.5" fill="white" opacity="0.85" />
      <circle cx="15" cy="15" r="1.5" fill="white" opacity="0.85" />
    </svg>
  );
}

function MainContainerIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.12)"
      />
      <path
        d="M8 12h8M12 8v8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9" />
    </svg>
  );
}

function InitContainerIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.12)"
      />
      <path
        d="M10 12l1.5 1.5L14 10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidecarContainerIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="5"
        width="12"
        height="14"
        rx="2.5"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.12)"
      />
      <rect
        x="16"
        y="8"
        width="6"
        height="8"
        rx="1.5"
        stroke="white"
        strokeWidth="1.3"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M14 12h2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="12" r="2" fill="white" opacity="0.85" />
    </svg>
  );
}

// Single pod icon — a pod shape with one inner dot
function SinglePodIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.15)"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.5" fill="white" opacity="0.9" />
      <circle cx="12" cy="12" r="1.5" fill="rgba(50,108,229,0.8)" />
    </svg>
  );
}

// Pod YAML icon — pod shape with lines
function PodYamlIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.12)"
        strokeLinejoin="round"
      />
      <path
        d="M8 10h8M8 13h5M8 16h6"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Multiple pods icon — three stacked pod hexagons
function MultiplePodIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
      <path
        d="M20 4l5 2.8v5.4L20 15l-5-2.8V6.8L20 4Z"
        stroke="white"
        strokeWidth="1.1"
        fill="rgba(255,255,255,0.07)"
        strokeLinejoin="round"
      />
      <path
        d="M14 9l5 2.8v5.4L14 20l-5-2.8v-5.4L14 9Z"
        stroke="white"
        strokeWidth="1.1"
        fill="rgba(255,255,255,0.1)"
        strokeLinejoin="round"
      />
      <path
        d="M8 13l5 2.8v5.4L8 24l-5-2.8v-5.4L8 13Z"
        stroke="white"
        strokeWidth="1.4"
        fill="rgba(255,255,255,0.18)"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="18.5" r="1.8" fill="white" opacity="0.9" />
    </svg>
  );
}

function StaticPodIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
      {/* Main Hexagon Pod */}
      <path
        d="M14 5l8 4.6v9.2L14 23.4l-8-4.6v-9.2L14 5Z"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
        strokeLinejoin="round"
      />
      {/* Pin/Anchor Symbol representing 'Static' */}
      <circle
        cx="14"
        cy="13"
        r="2.5"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.2)"
      />
      <path
        d="M14 15.5v4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Pod type meta config
// ─────────────────────────────────────────────

const podMeta = {
  "single-pod": {
    label: "Single Pod",
    subtitle: "v1 · core/Pod",
    accent: "#326CE5",
    accentDim: "rgba(50,108,229,0.15)",
    accentBorder: "rgba(50,108,229,0.3)",
    accentShadow: "rgba(50,108,229,0.35)",
    glow: "rgba(50,108,229,0.2)",
    gradient: "linear-gradient(135deg, #326CE5 0%, #1a4db0 100%)",
    stripeGradient: "linear-gradient(90deg, #326CE5, #5B8FF9)",
    tags: ["httpd:latest", "Port 8080", "TCP"],
    desc: "A single standalone Pod running one container. The simplest deployable unit — no ReplicaSet or Deployment wrapping it.",
    icon: <SinglePodIcon />,
  },
  "multiple-pod": {
    label: "Multiple Pods",
    subtitle: "v1 · core/Pod[]",
    accent: "#22c55e",
    accentDim: "rgba(34,197,94,0.15)",
    accentBorder: "rgba(34,197,94,0.3)",
    accentShadow: "rgba(34,197,94,0.35)",
    glow: "rgba(34,197,94,0.18)",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    stripeGradient: "linear-gradient(90deg, #22c55e, #86efac)",
    tags: ["3 Pods", "Staggered Boot", "Live Status"],
    desc: "A list of Pods sharing the same spec, each booting independently. Explore per-pod status, expand for details and live metrics.",
    icon: <MultiplePodIcon />,
  },

  "static-pod": {
    label: "Static Pod",
    subtitle: "v1 · Node/Manifest",
    accent: "#64748b",
    accentDim: "rgba(100,116,139,0.15)",
    accentBorder: "rgba(100,116,139,0.3)",
    accentShadow: "rgba(100,116,139,0.35)",
    glow: "rgba(100,116,139,0.18)",
    gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    stripeGradient: "linear-gradient(90deg, #64748b, #94a3b8)",
    tags: ["Node-Local", "Kubelet-Managed", "No-API"],
    desc: "Pods defined by local manifest files on a specific node. Managed directly by the Kubelet, bypassing the Kubernetes API server control loop.",
    icon: <StaticPodIcon />,
  },

  "pod-yaml": {
    label: "Pod YAML",
    subtitle: "v1 · spec reference",
    accent: "#06b6d4",
    accentDim: "rgba(6,182,212,0.15)",
    accentBorder: "rgba(6,182,212,0.3)",
    accentShadow: "rgba(6,182,212,0.35)",
    glow: "rgba(6,182,212,0.18)",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)",
    stripeGradient: "linear-gradient(90deg, #06b6d4, #38bdf8)",
    tags: ["YAML Spec", "Lifecycle", "Networking"],
    desc: "Full YAML spec reference for a Kubernetes Pod. Explore all configurable fields, lifecycle hooks, and networking options.",
    icon: <PodYamlIcon />,
  },
} as const;

type PodKey = keyof typeof podMeta;

// ─────────────────────────────────────────────
// Container meta config
// ─────────────────────────────────────────────

const containerMeta = {
  "main-container": {
    label: "Main Container",
    subtitle: "v1 · spec/containers",
    accent: "#326CE5",
    accentDim: "rgba(50,108,229,0.15)",
    accentBorder: "rgba(50,108,229,0.3)",
    accentShadow: "rgba(50,108,229,0.35)",
    glow: "rgba(50,108,229,0.2)",
    gradient: "linear-gradient(135deg, #326CE5 0%, #1a4db0 100%)",
    stripeGradient: "linear-gradient(90deg, #326CE5, #5B8FF9)",
    tags: ["Primary Process", "Lifecycle", "Resources"],
    desc: "The primary workload container. Runs your app process, handles requests, and defines the Pod's main purpose.",
    icon: <MainContainerIcon />,
  },
  "init-container": {
    label: "Init Container",
    subtitle: "v1 · spec/initContainers",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.15)",
    accentBorder: "rgba(245,158,11,0.3)",
    accentShadow: "rgba(245,158,11,0.35)",
    glow: "rgba(245,158,11,0.18)",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    stripeGradient: "linear-gradient(90deg, #f59e0b, #fcd34d)",
    tags: ["Sequential", "Pre-flight", "Blocking"],
    desc: "Runs to completion before app containers start. Used for setup tasks, config injection, and dependency checks.",
    icon: <InitContainerIcon />,
  },
  "sidecar-container": {
    label: "Sidecar Container",
    subtitle: "v1 · spec/containers[]",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.15)",
    accentBorder: "rgba(168,85,247,0.3)",
    accentShadow: "rgba(168,85,247,0.35)",
    glow: "rgba(168,85,247,0.18)",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    stripeGradient: "linear-gradient(90deg, #a855f7, #c084fc)",
    tags: ["Proxy", "Logging", "Mesh"],
    desc: "Co-located helper container sharing the Pod's network & storage. Handles cross-cutting concerns like logging and service mesh.",
    icon: <SidecarContainerIcon />,
  },
} as const;

type ContainerKey = keyof typeof containerMeta;

// ─────────────────────────────────────────────
// Global styles
// ─────────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@500;600;700&display=swap');

  .k8s-card {
    position: relative; overflow: hidden;
    border-radius: 20px !important; cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    padding: 0 !important;
  }
  .k8s-card:hover { transform: translateY(-6px) scale(1.02); }
  .k8s-card-inner { padding: 28px 28px 24px; position: relative; z-index: 2; }
  .k8s-card-bg-hex {
    position: absolute; right: -30px; bottom: -30px;
    width: 160px; height: 160px; opacity: 0.07;
    z-index: 1; pointer-events: none;
  }
  .k8s-card-glow {
    position: absolute; top: -40px; left: -40px;
    width: 180px; height: 180px; border-radius: 50%;
    pointer-events: none; z-index: 1;
  }
  .k8s-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: 0.1em; padding: 3px 10px;
    border-radius: 20px; margin-bottom: 16px;
  }
  .k8s-card-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 26px; margin: 0 0 8px 0; line-height: 1.1;
  }
  .k8s-card-desc {
    font-family: 'Space Mono', monospace;
    font-size: 11px; line-height: 1.6; margin: 0;
  }
  .k8s-card-arrow {
    position: absolute; bottom: 20px; right: 20px; z-index: 2;
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; transition: transform 0.25s ease;
  }
  .k8s-card:hover .k8s-card-arrow { transform: translate(3px, -3px); }
  .k8s-stripe {
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px; z-index: 3; border-radius: 20px 20px 0 0;
  }
  .ct-card {
    position: relative; overflow: hidden;
    border-radius: 18px; cursor: pointer; padding: 0;
    transition: transform 0.28s ease, box-shadow 0.28s ease;
  }
  .ct-card:hover { transform: translateY(-5px) scale(1.02); }
  .ct-card:hover .ct-card-arrow { transform: translate(3px, -3px); }
  .ct-card-inner { padding: 24px 24px 20px; position: relative; z-index: 2; }
  .ct-card-arrow {
    position: absolute; bottom: 16px; right: 16px; z-index: 2;
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: transform 0.25s ease;
  }
  .ct-card-hex {
    position: absolute; right: -20px; bottom: -20px;
    width: 130px; height: 130px; opacity: 0.06;
    z-index: 1; pointer-events: none;
  }
  .cv-header-card {
    position: relative; overflow: hidden;
    border-radius: 20px; padding: 28px 32px 24px; margin-bottom: 32px;
  }
  .cv-header-glow {
    position: absolute; top: -60px; left: -60px;
    width: 220px; height: 220px; border-radius: 50%; pointer-events: none;
  }
  .cv-header-hex {
    position: absolute; right: -20px; bottom: -20px;
    width: 200px; height: 200px; opacity: 0.06; pointer-events: none;
  }
  .cv-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 32px; margin: 0 0 4px; line-height: 1.1;
  }
  .cv-subtitle {
    font-family: 'Space Mono', monospace; font-size: 11px; margin: 0 0 14px;
  }
  .cv-desc {
    font-family: 'Space Mono', monospace; font-size: 11px;
    line-height: 1.7; margin: 0 0 16px; max-width: 560px;
  }
  .cv-tag {
    font-family: 'Space Mono', monospace; font-size: 9px;
    padding: 3px 10px; border-radius: 12px; letter-spacing: 0.06em;
  }
`;

// ─────────────────────────────────────────────
// Reusable selection grid (used by both Pods and Containers)
// ─────────────────────────────────────────────

function TypeSelectionGrid<T extends string>({
  items,
  isDark,
  textTitle,
  textDesc,
  badgeLabel,
  onSelect,
}: {
  items: Record<
    T,
    {
      label: string;
      subtitle: string;
      accent: string;
      accentDim: string;
      accentBorder: string;
      accentShadow: string;
      gradient: string;
      stripeGradient: string;
      tags: readonly string[];
      desc: string;
      icon: React.ReactNode;
    }
  >;
  isDark: boolean;
  textTitle: string;
  textDesc: string;
  badgeLabel: string;
  onSelect: (key: T) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
      }}
    >
      {(Object.keys(items) as T[]).map((key) => {
        const m = items[key];
        return (
          <div
            key={key}
            className="ct-card"
            onClick={() => onSelect(key)}
            style={{
              backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
              border: `1px solid ${m.accentBorder}`,
              boxShadow: isDark
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : `0 4px 20px ${m.accentShadow}22`,
            }}
          >
            <div
              className="k8s-stripe"
              style={{ background: m.stripeGradient }}
            />

            <svg className="ct-card-hex" viewBox="0 0 100 115" fill="none">
              <polygon
                points="50,5 93,28 93,87 50,110 7,87 7,28"
                stroke={m.accent}
                strokeWidth="4"
                fill="none"
              />
              <polygon
                points="50,18 83,35 83,80 50,97 17,80 17,35"
                stroke={m.accent}
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <div className="ct-card-inner">
              <div
                className="k8s-badge"
                style={{
                  background: m.accentDim,
                  color: m.accent,
                  border: `1px solid ${m.accentBorder}`,
                }}
              >
                <K8sLogo size={11} color={m.accent} />
                {badgeLabel}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    flexShrink: 0,
                    background: m.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px ${m.accentShadow}`,
                  }}
                >
                  {m.icon}
                </div>
                <div>
                  <p
                    className="k8s-card-title"
                    style={{ color: textTitle, fontSize: 22 }}
                  >
                    {m.label}
                  </p>
                  <p className="k8s-card-desc" style={{ color: m.accent }}>
                    {m.subtitle}
                  </p>
                </div>
              </div>

              <p
                className="k8s-card-desc"
                style={{ color: textDesc, marginBottom: 14 }}
              >
                {m.desc}
              </p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className="cv-tag"
                    style={{
                      background: m.accentDim,
                      color: m.accent,
                      border: `1px solid ${m.accentBorder}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="ct-card-arrow"
              style={{ background: m.accentDim, color: m.accent }}
            >
              →
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export default function FullViewK8s() {
  const { isDark } = useTheme();
  const [activeView, setActiveView] = useState<string | null>(null);

  const bg = isDark ? "#020617" : "#f8fafc";
  const textTitle = isDark ? "#f1f5f9" : "#0f172a";
  const textDesc = isDark ? "#94a3b8" : "#475569";
  const backBtnBg = isDark ? "rgba(30,41,59,0.8)" : "#ffffff";
  const backBtnText = isDark ? "#e2e8f0" : "#0f172a";
  const backBtnBorder = isDark
    ? "rgba(59,130,246,0.2)"
    : "rgba(59,130,246,0.3)";

  const renderBackButton = (label: string, onClick: () => void) => (
    <Button
      icon={<ArrowLeftOutlined />}
      onClick={onClick}
      style={{
        marginBottom: 24,
        backgroundColor: backBtnBg,
        color: backBtnText,
        borderColor: backBtnBorder,
      }}
    >
      {label}
    </Button>
  );

  const pageWrap = (children: React.ReactNode) => (
    <div
      style={{
        minHeight: "100vh",
        padding: "120px 40px 60px",
        backgroundColor: bg,
      }}
    >
      <style>{GLOBAL_STYLES}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
    </div>
  );

  // ── VIEW: Pods selection grid ──────────────────────────────────────────────
  if (activeView === "pods") {
    return pageWrap(
      <>
        {renderBackButton("Back to Kubernetes Menu", () => setActiveView(null))}
        <p
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: textTitle,
            margin: "0 0 8px",
          }}
        >
          Pod Types
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a pod pattern to explore
        </p>
        <TypeSelectionGrid
          items={podMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="POD TYPE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  if (activeView === "static-pod") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pods", () => setActiveView("pods"))}
        </div>
        <StaticPod />
      </div>
    );
  }

  // ── VIEW: Single Pod ───────────────────────────────────────────────────────
  if (activeView === "single-pod") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pods", () => setActiveView("pods"))}
        </div>
        <Singlepod />
      </div>
    );
  }

  // ── VIEW: Multiple Pods ───────────────────────────────────────────────────
  if (activeView === "multiple-pod") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pods", () => setActiveView("pods"))}
        </div>
        <MultiplePod />
      </div>
    );
  }

  // ── VIEW: Pod YAML (legacy) ────────────────────────────────────────────────
  if (activeView === "pod-yaml") {
    return pageWrap(
      <>
        {renderBackButton("Back to Pods", () => setActiveView("pods"))}
        <PodYamlExample />
      </>,
    );
  }

  // ── VIEW: Container type selection grid ───────────────────────────────────
  if (activeView === "containers") {
    return pageWrap(
      <>
        {renderBackButton("Back to Kubernetes Menu", () => setActiveView(null))}
        <p
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            color: textTitle,
            margin: "0 0 8px",
          }}
        >
          Container Types
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a container pattern to explore
        </p>
        <TypeSelectionGrid
          items={containerMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="CONTAINER TYPE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  // ── VIEW: Individual container deep-dives ─────────────────────────────────
  const containerViewKeys: ContainerKey[] = [
    "main-container",
    "init-container",
    "sidecar-container",
  ];

  if (containerViewKeys.includes(activeView as ContainerKey)) {
    const key = activeView as ContainerKey;
    const meta = containerMeta[key];
    const childMap: Record<ContainerKey, React.ReactNode> = {
      "main-container": <MainContainer />,
      "init-container": <InitContainer />,
      "sidecar-container": <SidecarContainer />,
    };

    return pageWrap(
      <>
        {renderBackButton("Back to Containers", () =>
          setActiveView("containers"),
        )}

        <div
          className="cv-header-card"
          style={{
            backgroundColor: isDark ? "rgba(15,23,42,0.92)" : "#ffffff",
            border: `1px solid ${meta.accentBorder}`,
            boxShadow: isDark
              ? `0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px ${meta.accentBorder}`
              : `0 4px 32px ${meta.accentShadow}22`,
          }}
        >
          <div
            className="k8s-stripe"
            style={{ background: meta.stripeGradient }}
          />
          <div
            className="cv-header-glow"
            style={{
              background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
            }}
          />
          <svg className="cv-header-hex" viewBox="0 0 100 115" fill="none">
            <polygon
              points="50,5 93,28 93,87 50,110 7,87 7,28"
              stroke={meta.accent}
              strokeWidth="4"
              fill="none"
            />
            <polygon
              points="50,18 83,35 83,80 50,97 17,80 17,35"
              stroke={meta.accent}
              strokeWidth="2"
              fill="none"
            />
            <polygon
              points="50,31 73,42 73,73 50,84 27,73 27,42"
              stroke={meta.accent}
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                flexShrink: 0,
                background: meta.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 6px 24px ${meta.accentShadow}`,
                marginTop: 4,
              }}
            >
              {meta.icon}
            </div>
            <div>
              <div
                className="k8s-badge"
                style={{
                  background: meta.accentDim,
                  color: meta.accent,
                  border: `1px solid ${meta.accentBorder}`,
                }}
              >
                <K8sLogo size={12} color={meta.accent} />
                KUBERNETES · CONTAINER TYPE
              </div>
              <p className="cv-title" style={{ color: textTitle }}>
                {meta.label}
              </p>
              <p className="cv-subtitle" style={{ color: meta.accent }}>
                {meta.subtitle}
              </p>
              <p className="cv-desc" style={{ color: textDesc }}>
                {meta.desc}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="cv-tag"
                    style={{
                      background: meta.accentDim,
                      color: meta.accent,
                      border: `1px solid ${meta.accentBorder}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {childMap[key]}
      </>,
    );
  }

  // ── VIEW: Main menu ────────────────────────────────────────────────────────
  return pageWrap(
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
      }}
    >
      {/* ── POD CARD — now routes to pods grid ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("pods")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(50,108,229,0.35)" : "rgba(50,108,229,0.25)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(50,108,229,0.1)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #326CE5, #5B8FF9)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(50,108,229,0.25) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#326CE5"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#326CE5"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(50,108,229,0.15)"
                : "rgba(50,108,229,0.08)",
              color: "#326CE5",
              border: "1px solid rgba(50,108,229,0.3)",
            }}
          >
            <K8sLogo size={13} />
            KUBERNETES RESOURCE
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                flexShrink: 0,
                background: "linear-gradient(135deg, #326CE5 0%, #1a4db0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(50,108,229,0.4)",
              }}
            >
              <PodIcon />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                Pod
              </p>
              <p className="k8s-card-desc" style={{ color: "#326CE5" }}>
                v1 · core/Pod
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            Smallest deployable unit in Kubernetes. View YAML spec, lifecycle,
            and networking.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["Single Pod", "Multiple Pods", "YAML Spec"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  padding: "3px 9px",
                  borderRadius: 12,
                  background: isDark
                    ? "rgba(50,108,229,0.12)"
                    : "rgba(50,108,229,0.07)",
                  color: isDark ? "#93bbfd" : "#326CE5",
                  border: "1px solid rgba(50,108,229,0.2)",
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="k8s-card-arrow"
          style={{
            background: isDark
              ? "rgba(50,108,229,0.2)"
              : "rgba(50,108,229,0.1)",
            color: "#326CE5",
          }}
        >
          →
        </div>
      </div>

      {/* ── CONTAINERS CARD ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("containers")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.3)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(34,197,94,0.08)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #16a34a, #22c55e)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#22c55e"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(34,197,94,0.12)"
                : "rgba(34,197,94,0.08)",
              color: "#16a34a",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <K8sLogo size={13} color="#16a34a" />
            KUBERNETES RESOURCE
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                flexShrink: 0,
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
              }}
            >
              <ContainerIcon />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                Containers
              </p>
              <p className="k8s-card-desc" style={{ color: "#16a34a" }}>
                v1 · core/Container
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            Main, Init & Sidecar container patterns. Explore runtime specs and
            use cases.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["Main", "Init", "Sidecar"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  padding: "3px 9px",
                  borderRadius: 12,
                  background: isDark
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(34,197,94,0.07)",
                  color: isDark ? "#86efac" : "#16a34a",
                  border: "1px solid rgba(34,197,94,0.2)",
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="k8s-card-arrow"
          style={{
            background: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)",
            color: "#16a34a",
          }}
        >
          →
        </div>
      </div>
    </div>,
  );
}