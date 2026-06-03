import React, { useState } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTheme } from "../../Themecontext";

import PodYamlExample from "./pod";

// containers
import MainContainer from "./containers/maincontainer";
import InitContainer from "./containers/initcontainer";
import SidecarContainer from "./containers/sidecarcontainer";

// pod-types
import StaticPod from "./pods/staticpod";
import Singlepod from "./pods/single_pod";
import MultiplePod from "./pods/multiple_pod";

// clusters
import ClusterIP from "./eks_clusters/cluster-ip";
import NodePort from "./eks_clusters/nodeport";
import LoadBalancer from "./eks_clusters/load-balancer";
import ExternalName from "./eks_clusters/external-name";

// probes
import StartupProbe from "./probes/startup-probe";
import LivenessProbe from "./probes/liveness-probe";
import ReadinessProbe from "./probes/readiness-probe";

// pod-lifecycle
import Running from "./pod-lifecycle/running";
import Failed from "./pod-lifecycle/failed";
import Pending from "./pod-lifecycle/pending";
import Success from "./pod-lifecycle/success";
import Unknown from "./pod-lifecycle/unknown";

// resources
import ResourceComponent from "./resources/resources-oom-killed";

// restart-policy
import Always from "./restart-policy/always";
import Never from "./restart-policy/never";
import OnFailure from "./restart-policy/onfailure";

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
      <path
        d="M14 5l8 4.6v9.2L14 23.4l-8-4.6v-9.2L14 5Z"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
        strokeLinejoin="round"
      />
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

function EksClusterIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
      <circle cx="4" cy="6" r="2" fill="white" opacity="0.7" />
      <circle cx="20" cy="6" r="2" fill="white" opacity="0.7" />
      <circle cx="4" cy="18" r="2" fill="white" opacity="0.7" />
      <circle cx="20" cy="18" r="2" fill="white" opacity="0.7" />
      <path
        d="M12 9L6 7M12 9L18 7M12 15L6 17M12 15L18 17"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M4 8v8M20 8v8"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function ProbePulseIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12h4l3 -7 5 14 3 -7h5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProbeHealthIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.15)"/>
      <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function PodLifecycleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="2.5 2"
      />
      <path
        d="M12 21a9 9 0 0 1-9-9"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 12a9 9 0 0 1 9-9"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="2.5 2"
      />
      <path
        d="M19.5 7.5l1.5 3.5 3-1.5"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LifecycleRunningIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
      />
      <path d="M10 8.5l6 3.5-6 3.5V8.5Z" fill="white" opacity="0.9" />
    </svg>
  );
}

function LifecyclePendingIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M12 7v5l3 3"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LifecycleSuccessIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M8 12l3 3 5-5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LifecycleFailedIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LifecycleUnknownIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.1)"
      />
      <path
        d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill="white" />
    </svg>
  );
}

function Resource() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.15)"
      />
      <path
        d="M8 5V3M12 5V3M16 5V3M8 21v-2M12 21v-2M16 21v-2M5 8H3M5 12H3M5 16H3M21 8h-2M21 12h-2M21 16h-2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Restart Policy Icons
// ─────────────────────────────────────────────

function RestartPolicyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.6548 3.03608 17.0673 4.73979 18.8687" 
        stroke="white" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M2 19V14H7" 
        stroke="white" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

function AlwaysIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path 
        d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12ZM17 12L21 8M17 12L21 16" 
        stroke="white" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function OnFailureIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 8V12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="white" />
      <path 
        d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4" 
        stroke="white" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function NeverIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.1)" />
      <path d="M8 8L16 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
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

// ─────────────────────────────────────────────
// Pod Lifecycle meta config
// ─────────────────────────────────────────────

const podLifecycleMeta = {
  running: {
    label: "Running",
    subtitle: "v1 · Pod/Phase",
    accent: "#22c55e",
    accentDim: "rgba(34,197,94,0.15)",
    accentBorder: "rgba(34,197,94,0.3)",
    accentShadow: "rgba(34,197,94,0.35)",
    glow: "rgba(34,197,94,0.18)",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    stripeGradient: "linear-gradient(90deg, #22c55e, #86efac)",
    tags: ["Active", "Containers Up", "Live"],
    desc: "At least one container is running, or is in the process of starting or restarting.",
    icon: <LifecycleRunningIcon />,
  },
  pending: {
    label: "Pending",
    subtitle: "v1 · Pod/Phase",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.15)",
    accentBorder: "rgba(245,158,11,0.3)",
    accentShadow: "rgba(245,158,11,0.35)",
    glow: "rgba(245,158,11,0.18)",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    stripeGradient: "linear-gradient(90deg, #f59e0b, #fcd34d)",
    tags: ["Scheduling", "Pulling Images", "Init"],
    desc: "The Pod has been accepted but containers are not yet running. Waiting on scheduling or image pulls.",
    icon: <LifecyclePendingIcon />,
  },
  success: {
    label: "Succeeded",
    subtitle: "v1 · Pod/Phase",
    accent: "#326CE5",
    accentDim: "rgba(50,108,229,0.15)",
    accentBorder: "rgba(50,108,229,0.3)",
    accentShadow: "rgba(50,108,229,0.35)",
    glow: "rgba(50,108,229,0.2)",
    gradient: "linear-gradient(135deg, #326CE5 0%, #1a4db0 100%)",
    stripeGradient: "linear-gradient(90deg, #326CE5, #5B8FF9)",
    tags: ["Completed", "Exit 0", "Terminal"],
    desc: "All containers in the Pod have terminated successfully and will not be restarted.",
    icon: <LifecycleSuccessIcon />,
  },
  failed: {
    label: "Failed",
    subtitle: "v1 · Pod/Phase",
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.15)",
    accentBorder: "rgba(239,68,68,0.3)",
    accentShadow: "rgba(239,68,68,0.35)",
    glow: "rgba(239,68,68,0.18)",
    gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    stripeGradient: "linear-gradient(90deg, #ef4444, #fca5a5)",
    tags: ["Exit Code > 0", "Terminal", "Error"],
    desc: "All containers have terminated and at least one terminated with a failure exit code.",
    icon: <LifecycleFailedIcon />,
  },
  unknown: {
    label: "Unknown",
    subtitle: "v1 · Pod/Phase",
    accent: "#64748b",
    accentDim: "rgba(100,116,139,0.15)",
    accentBorder: "rgba(100,116,139,0.3)",
    accentShadow: "rgba(100,116,139,0.35)",
    glow: "rgba(100,116,139,0.18)",
    gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    stripeGradient: "linear-gradient(90deg, #64748b, #94a3b8)",
    tags: ["Node Lost", "No Status", "Unreachable"],
    desc: "The state of the Pod could not be obtained, typically due to a node communication error.",
    icon: <LifecycleUnknownIcon />,
  },
} as const;

type PodLifecycleKey = keyof typeof podLifecycleMeta;

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
// EKS meta config
// ─────────────────────────────────────────────

const eksMeta = {
  "cluster-ip": {
    label: "ClusterIP",
    subtitle: "v1 · Service",
    accent: "#6366f1",
    accentDim: "rgba(99,102,241,0.15)",
    accentBorder: "rgba(99,102,241,0.3)",
    accentShadow: "rgba(99,102,241,0.35)",
    glow: "rgba(99,102,241,0.18)",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    stripeGradient: "linear-gradient(90deg, #6366f1, #818cf8)",
    tags: ["Internal", "Default", "LoadBalanced"],
    desc: "Exposes the Service on a cluster-internal IP. Choosing this value makes the Service only reachable from within the cluster.",
    icon: <EksClusterIcon />,
  },
  "node-port": {
    label: "NodePort",
    subtitle: "v1 · Service",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.15)",
    accentBorder: "rgba(245,158,11,0.3)",
    accentShadow: "rgba(245,158,11,0.35)",
    glow: "rgba(245,158,11,0.18)",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    stripeGradient: "linear-gradient(90deg, #f59e0b, #fcd34d)",
    tags: ["External", "Static Port", "NAT"],
    desc: "Exposes the Service on each Node's IP at a static port. A ClusterIP Service, to which the NodePort routes, is automatically created.",
    icon: <EksClusterIcon />,
  },
  "load-balancer": {
    label: "LoadBalancer",
    subtitle: "v1 · Service",
    accent: "#ec4899",
    accentDim: "rgba(236,72,153,0.15)",
    accentBorder: "rgba(236,72,153,0.3)",
    accentShadow: "rgba(236,72,153,0.35)",
    glow: "rgba(236,72,153,0.18)",
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    stripeGradient: "linear-gradient(90deg, #ec4899, #f472b6)",
    tags: ["Cloud Provider", "Public IP", "Ingress"],
    desc: "Exposes the Service externally using a cloud provider's load balancer. NodePort and ClusterIP Services are automatically created.",
    icon: <EksClusterIcon />,
  },
  "external-name": {
    label: "ExternalName",
    subtitle: "v1 · Service",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.15)",
    accentBorder: "rgba(168,85,247,0.3)",
    accentShadow: "rgba(168,85,247,0.35)",
    glow: "rgba(168,85,247,0.18)",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    stripeGradient: "linear-gradient(90deg, #a855f7, #c084fc)",
    tags: ["CNAME", "DNS", "Egress"],
    desc: "Maps a Service to a DNS name. Useful for giving internal pods a stable endpoint to access external databases or APIs outside the cluster.",
    icon: <EksClusterIcon />,
  },
} as const;

type EksKey = keyof typeof eksMeta;

// ─────────────────────────────────────────────
// Probes meta config
// ─────────────────────────────────────────────

const probeMeta = {
  "startup-probe": {
    label: "Startup Probe",
    subtitle: "v1 · core/Probe",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.15)",
    accentBorder: "rgba(168,85,247,0.3)",
    accentShadow: "rgba(168,85,247,0.35)",
    glow: "rgba(168,85,247,0.18)",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
    stripeGradient: "linear-gradient(90deg, #a855f7, #c084fc)",
    tags: ["Booting", "Delay", "One-Time"],
    desc: "Verifies if the application within the container is started. Disables other probes until it succeeds.",
    icon: <ProbePulseIcon />,
  },
  "liveness-probe": {
    label: "Liveness Probe",
    subtitle: "v1 · core/Probe",
    accent: "#f43f5e",
    accentDim: "rgba(244,63,94,0.15)",
    accentBorder: "rgba(244,63,94,0.3)",
    accentShadow: "rgba(244,63,94,0.35)",
    glow: "rgba(244,63,94,0.18)",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    stripeGradient: "linear-gradient(90deg, #f43f5e, #fda4af)",
    tags: ["Health", "Restart", "Ongoing"],
    desc: "Checks if the container is running and healthy. Kills and restarts the container if it becomes unresponsive.",
    icon: <ProbePulseIcon />,
  },
  "readiness-probe": {
    label: "Readiness Probe",
    subtitle: "v1 · core/Probe",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.15)",
    accentBorder: "rgba(16,185,129,0.3)",
    accentShadow: "rgba(16,185,129,0.35)",
    glow: "rgba(16,185,129,0.18)",
    gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    stripeGradient: "linear-gradient(90deg, #10b981, #6ee7b7)",
    tags: ["Traffic", "Endpoints", "Routing"],
    desc: "Determines if a container is ready to respond to user traffic. Removes Pod IP from Service endpoints if it fails.",
    icon: <ProbePulseIcon />,
  },
} as const;

type ProbeKey = keyof typeof probeMeta;

// ─────────────────────────────────────────────
// Resource meta config
// ─────────────────────────────────────────────

const oomKilledSubMeta = {
  "oom-killed": {
    label: "OOMKilled",
    subtitle: "v1 · core/Container · Exit 137",
    accent: "#e11d48",
    accentDim: "rgba(225,29,72,0.15)",
    accentBorder: "rgba(225,29,72,0.3)",
    accentShadow: "rgba(225,29,72,0.35)",
    glow: "rgba(225,29,72,0.18)",
    gradient: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)",
    stripeGradient: "linear-gradient(90deg, #be123c, #e11d48)",
    tags: ["Exit 137", "SIGKILL", "Memory Limit"],
    desc: "Container terminated by the Linux OOM killer when it exceeds its memory limit. No graceful shutdown — SIGKILL is immediate.",
    icon: <Resource />,
  },
} as const;

// ─────────────────────────────────────────────
// Restart Policy meta config
// ─────────────────────────────────────────────

const restartPolicyMeta = {
  "always": {
    label: "Always",
    subtitle: "v1 · spec.restartPolicy",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.15)",
    accentBorder: "rgba(59,130,246,0.3)",
    accentShadow: "rgba(59,130,246,0.35)",
    glow: "rgba(59,130,246,0.18)",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    stripeGradient: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    tags: ["Default", "Always Restart", "Services"],
    desc: "The container will always be restarted regardless of why it exited. Ideal for long-running services like web servers and databases.",
    icon: <AlwaysIcon />,
  },
  "on-failure": {
    label: "OnFailure",
    subtitle: "v1 · spec.restartPolicy",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.15)",
    accentBorder: "rgba(245,158,11,0.3)",
    accentShadow: "rgba(245,158,11,0.35)",
    glow: "rgba(245,158,11,0.18)",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    stripeGradient: "linear-gradient(90deg, #f59e0b, #fcd34d)",
    tags: ["Non-Zero Exit", "Jobs", "Retry"],
    desc: "The container will only be restarted if it exits with a non-zero status. Commonly used for Kubernetes Jobs that need to complete successfully.",
    icon: <OnFailureIcon />,
  },
  "never": {
    label: "Never",
    subtitle: "v1 · spec.restartPolicy",
    accent: "#64748b",
    accentDim: "rgba(100,116,139,0.15)",
    accentBorder: "rgba(100,116,139,0.3)",
    accentShadow: "rgba(100,116,139,0.35)",
    glow: "rgba(100,116,139,0.18)",
    gradient: "linear-gradient(135deg, #64748b 0%, #334155 100%)",
    stripeGradient: "linear-gradient(90deg, #64748b, #94a3b8)",
    tags: ["One-Shot", "No Retry", "Inspection"],
    desc: "The container will not be restarted regardless of the exit status. Useful for one-off tasks where failures should be preserved for inspection.",
    icon: <NeverIcon />,
  },
} as const;


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
// Reusable selection grid
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

  // ── VIEW: EKS Services selection grid ─────────────────────────────────────
  if (activeView === "eks-clusters") {
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
          EKS Services
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a service networking pattern to explore
        </p>
        <TypeSelectionGrid
          items={eksMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="SERVICE TYPE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  // ── VIEW: Individual EKS Deep Dives ──────────────────────────────
  if (activeView === "cluster-ip") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to EKS Services", () =>
            setActiveView("eks-clusters"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <ClusterIP />
        </div>
      </div>
    );
  }

  if (activeView === "node-port") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to EKS Services", () =>
            setActiveView("eks-clusters"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <NodePort />
        </div>
      </div>
    );
  }

  if (activeView === "load-balancer") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to EKS Services", () =>
            setActiveView("eks-clusters"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <LoadBalancer />
        </div>
      </div>
    );
  }

  if (activeView === "external-name") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to EKS Services", () =>
            setActiveView("eks-clusters"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <ExternalName />
        </div>
      </div>
    );
  }

  // ── VIEW: Probes selection grid ───────────────────────────────────────────
  if (activeView === "probes") {
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
          Container Probes
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a health-check probe pattern to explore
        </p>
        <TypeSelectionGrid
          items={probeMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="PROBE TYPE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  // ── VIEW: Individual Probe Deep Dives ──────────────────────────────
  if (activeView === "startup-probe") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Container Probes", () =>
            setActiveView("probes"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <StartupProbe />
        </div>
      </div>
    );
  }

  if (activeView === "liveness-probe") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Container Probes", () =>
            setActiveView("probes"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <LivenessProbe />
        </div>
      </div>
    );
  }

  if (activeView === "readiness-probe") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Container Probes", () =>
            setActiveView("probes"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <ReadinessProbe />
        </div>
      </div>
    );
  }

  // ── VIEW: Pod Lifecycle selection grid ────────────────────────────────────
  if (activeView === "pod-lifecycle") {
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
          Pod Lifecycle
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a pod phase to explore
        </p>
        <TypeSelectionGrid
          items={podLifecycleMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="POD PHASE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  // ── VIEW: Individual Pod Lifecycle Deep Dives ─────────────────────────────
  if (activeView === "running") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pod Lifecycle", () =>
            setActiveView("pod-lifecycle"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Running />
        </div>
      </div>
    );
  }

  if (activeView === "pending") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pod Lifecycle", () =>
            setActiveView("pod-lifecycle"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Pending />
        </div>
      </div>
    );
  }

  if (activeView === "success") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pod Lifecycle", () =>
            setActiveView("pod-lifecycle"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Success />
        </div>
      </div>
    );
  }

  if (activeView === "failed") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pod Lifecycle", () =>
            setActiveView("pod-lifecycle"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Failed />
        </div>
      </div>
    );
  }

  if (activeView === "unknown") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Pod Lifecycle", () =>
            setActiveView("pod-lifecycle"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Unknown />
        </div>
      </div>
    );
  }

  // ── VIEW: Resources ────────────────────────────────────────────────────────
  if (activeView === "resources") {
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
          Resources
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a resource scenario to explore
        </p>
        <TypeSelectionGrid
          items={oomKilledSubMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="RESOURCE TYPE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  if (activeView === "oom-killed") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Resources", () =>
            setActiveView("resources"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <ResourceComponent />
        </div>
      </div>
    );
  }

  // ── VIEW: Restart Policy selection grid ────────────────────────────────────
  if (activeView === "restart-policy") {
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
          Restart Policies
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: textDesc,
            margin: "0 0 32px",
          }}
        >
          Select a restart policy pattern to explore
        </p>
        <TypeSelectionGrid
          items={restartPolicyMeta}
          isDark={isDark}
          textTitle={textTitle}
          textDesc={textDesc}
          badgeLabel="POLICY TYPE"
          onSelect={(key) => setActiveView(key)}
        />
      </>,
    );
  }

  // ── VIEW: Individual Restart Policy Deep Dives ─────────────────────────────
  if (activeView === "always") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Restart Policies", () =>
            setActiveView("restart-policy"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Always />
        </div>
      </div>
    );
  }

  if (activeView === "on-failure") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Restart Policies", () =>
            setActiveView("restart-policy"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <OnFailure />
        </div>
      </div>
    );
  }

  if (activeView === "never") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg }}>
        <style>{GLOBAL_STYLES}</style>
        <div
          style={{ padding: "120px 40px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {renderBackButton("Back to Restart Policies", () =>
            setActiveView("restart-policy"),
          )}
        </div>
        <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto" }}>
          <Never />
        </div>
      </div>
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
      {/* ── POD CARD ── */}
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

      {/* ── EKS CLUSTER CARD ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("eks-clusters")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.28)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(249,115,22,0.1)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #ea580c, #f97316)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#f97316"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#f97316"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(249,115,22,0.13)"
                : "rgba(249,115,22,0.08)",
              color: "#ea580c",
              border: "1px solid rgba(249,115,22,0.3)",
            }}
          >
            <K8sLogo size={13} color="#ea580c" />
            EKS RESOURCE
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
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
              }}
            >
              <EksClusterIcon />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                EKS Clusters
              </p>
              <p className="k8s-card-desc" style={{ color: "#ea580c" }}>
                AWS · EKS Services
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            AWS-managed Kubernetes clusters. Explore service types and how pods
            communicate inside EKS.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"].map(
              (tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    padding: "3px 9px",
                    borderRadius: 12,
                    background: isDark
                      ? "rgba(249,115,22,0.11)"
                      : "rgba(249,115,22,0.07)",
                    color: isDark ? "#fdba74" : "#ea580c",
                    border: "1px solid rgba(249,115,22,0.22)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className="k8s-card-arrow"
          style={{
            background: isDark
              ? "rgba(249,115,22,0.18)"
              : "rgba(249,115,22,0.1)",
            color: "#ea580c",
          }}
        >
          →
        </div>
      </div>

      {/* ── PROBES CARD ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("probes")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(6,182,212,0.35)" : "rgba(6,182,212,0.28)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(6,182,212,0.1)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #0891b2, #06b6d4)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#06b6d4"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#06b6d4"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(6,182,212,0.13)"
                : "rgba(6,182,212,0.08)",
              color: "#0891b2",
              border: "1px solid rgba(6,182,212,0.3)",
            }}
          >
            <K8sLogo size={13} color="#0891b2" />
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
                background: "linear-gradient(135deg, #0891b2 0%, #0369a1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(6,182,212,0.4)",
              }}
            >
              <ProbeHealthIcon />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                Probes
              </p>
              <p className="k8s-card-desc" style={{ color: "#0891b2" }}>
                v1 · core/Probe
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            Container health checks. Explore Startup, Liveness, and Readiness
            probes and how Kubelet manages them.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["Startup", "Liveness", "Readiness"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  padding: "3px 9px",
                  borderRadius: 12,
                  background: isDark
                    ? "rgba(6,182,212,0.11)"
                    : "rgba(6,182,212,0.07)",
                  color: isDark ? "#67e8f9" : "#0891b2",
                  border: "1px solid rgba(6,182,212,0.22)",
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
            background: isDark ? "rgba(6,182,212,0.18)" : "rgba(6,182,212,0.1)",
            color: "#0891b2",
          }}
        >
          →
        </div>
      </div>
      {/* ── POD LIFECYCLE CARD ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("pod-lifecycle")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(168,85,247,0.35)" : "rgba(168,85,247,0.28)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(168,85,247,0.1)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#a855f7"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#a855f7"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(168,85,247,0.13)"
                : "rgba(168,85,247,0.08)",
              color: "#7c3aed",
              border: "1px solid rgba(168,85,247,0.3)",
            }}
          >
            <K8sLogo size={13} color="#7c3aed" />
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
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(168,85,247,0.4)",
              }}
            >
              <PodLifecycleIcon />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                Pod Lifecycle
              </p>
              <p className="k8s-card-desc" style={{ color: "#7c3aed" }}>
                v1 · Pod/Phase
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            Pod phase states and transitions. Explore Running, Pending,
            Succeeded, Failed, and Unknown lifecycle phases.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["Running", "Pending", "Succeeded", "Failed", "Unknown"].map(
              (tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    padding: "3px 9px",
                    borderRadius: 12,
                    background: isDark
                      ? "rgba(168,85,247,0.11)"
                      : "rgba(168,85,247,0.07)",
                    color: isDark ? "#d8b4fe" : "#7c3aed",
                    border: "1px solid rgba(168,85,247,0.22)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className="k8s-card-arrow"
          style={{
            background: isDark
              ? "rgba(168,85,247,0.18)"
              : "rgba(168,85,247,0.1)",
            color: "#7c3aed",
          }}
        >
          →
        </div>
      </div>
      {/* ── RESOURCES CARD ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("resources")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(225,29,72,0.35)" : "rgba(225,29,72,0.28)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(225,29,72,0.1)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #be123c, #e11d48)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(225,29,72,0.22) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#e11d48"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#e11d48"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(225,29,72,0.13)"
                : "rgba(225,29,72,0.08)",
              color: "#e11d48",
              border: "1px solid rgba(225,29,72,0.3)",
            }}
          >
            <K8sLogo size={13} color="#e11d48" />
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
                background: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
              }}
            >
              <Resource />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                Resources
              </p>
              <p className="k8s-card-desc" style={{ color: "#e11d48" }}>
                v1 · core/Resource
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            CPU and Memory limits/requests. Explore constraints and OOMKilled
            scenarios.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["Requests", "Limits", "OOMKilled"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  padding: "3px 9px",
                  borderRadius: 12,
                  background: isDark
                    ? "rgba(225,29,72,0.11)"
                    : "rgba(225,29,72,0.07)",
                  color: isDark ? "#fda4af" : "#e11d48",
                  border: "1px solid rgba(225,29,72,0.22)",
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
            background: isDark ? "rgba(225,29,72,0.18)" : "rgba(225,29,72,0.1)",
            color: "#e11d48",
          }}
        >
          →
        </div>
      </div>
      
      {/* ── RESTART POLICY CARD ── */}
      <div
        className="k8s-card"
        onClick={() => setActiveView("restart-policy")}
        style={{
          backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.28)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(99,102,241,0.1)",
        }}
      >
        <div
          className="k8s-stripe"
          style={{ background: "linear-gradient(90deg, #4f46e5, #6366f1)" }}
        />
        <div
          className="k8s-card-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
          }}
        />
        <svg className="k8s-card-bg-hex" viewBox="0 0 100 115" fill="none">
          <polygon
            points="50,5 93,28 93,87 50,110 7,87 7,28"
            stroke="#6366f1"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="50,18 83,35 83,80 50,97 17,80 17,35"
            stroke="#6366f1"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="k8s-card-inner">
          <div
            className="k8s-badge"
            style={{
              background: isDark
                ? "rgba(99,102,241,0.13)"
                : "rgba(99,102,241,0.08)",
              color: "#6366f1",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <K8sLogo size={13} color="#6366f1" />
            KUBERNETES CONFIG
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
                background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
              }}
            >
              <RestartPolicyIcon />
            </div>
            <div>
              <p className="k8s-card-title" style={{ color: textTitle }}>
                Restart Policy
              </p>
              <p className="k8s-card-desc" style={{ color: "#6366f1" }}>
                v1 · spec.restartPolicy
              </p>
            </div>
          </div>

          <p className="k8s-card-desc" style={{ color: textDesc }}>
            Determine when a container should be restarted by the Kubelet. Explore Always, OnFailure, and Never patterns.
          </p>

          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {["Always", "OnFailure", "Never"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  padding: "3px 9px",
                  borderRadius: 12,
                  background: isDark
                    ? "rgba(99,102,241,0.11)"
                    : "rgba(99,102,241,0.07)",
                  color: isDark ? "#818cf8" : "#6366f1",
                  border: "1px solid rgba(99,102,241,0.22)",
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
            background: isDark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)",
            color: "#6366f1",
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
