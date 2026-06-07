import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../Themecontext";

import { githubCommands } from "../pages/Git";
import { dockerCommands } from "../pages/Docker";
import { terraformCommands } from "../pages/Terraform";
import { allCommands as kubernetesCommands } from "../pages/Kubernetes";
import { Ansible } from "../pages/Ansible";
import { linuxCommands } from "../pages/Linux";
import { JenkinsPipelines } from "../pages/pipelines/jenkins";
import Azure from "../pages/pipelines/azure";
import GithunactionsTopics from "../pages/pipelines/github-actions";

// ── Types ──
export type TabKey =
  | "docker"
  | "terraform"
  | "kubernetes"
  | "ansible"
  | "linux"
  | "github"
  | "jenkins"
  | "azure-devops"
  | "github-actions";

export type K8sSection = "k8s-docs";

export interface Tab {
  key: TabKey;
  label: string;
  emoji: string;
  color: string;
  colorLight: string;
  accent: string;
  accentLight: string;
  glow: string;
  glowLight: string;
  description: string;
  commandCount: number;
}

interface DropdownGroup {
  key: string;
  label: string;
  emoji: string;
  color: string;
  colorLight: string;
  accent: string;
  accentLight: string;
  glow: string;
  glowLight: string;
  children: Tab[];
}

interface K8sDoc {
  key: K8sSection;
  label: string;
  emoji: string;
  description: string;
}

// ── Tab Data ──
export const TABS: Tab[] = [
  {
    key: "linux",
    label: "Linux",
    emoji: "🐧",
    color: "#22c55e",
    colorLight: "#15803d",
    accent: "#86efac",
    accentLight: "#14532d",
    glow: "#22c55e40",
    glowLight: "#22c55e25",
    description:
      "Essential Linux commands, shell scripting & system administration",
    commandCount: linuxCommands.length,
  },
  {
    key: "github",
    label: "GitHub",
    emoji: "🐙",
    color: "#6e8efb",
    colorLight: "#3a5bd9",
    accent: "#a5b4fc",
    accentLight: "#2a45c0",
    glow: "#6e8efb40",
    glowLight: "#6e8efb25",
    description: "GitHub CLI, repos, PRs, issues, releases & workflows",
    commandCount: githubCommands.length,
  },
  {
    key: "docker",
    label: "Docker",
    emoji: "🐋",
    color: "#0db7ed",
    colorLight: "#0882b0",
    accent: "#57cbff",
    accentLight: "#0670a0",
    glow: "#0db7ed40",
    glowLight: "#0db7ed25",
    description:
      "Container lifecycle, images, networks, volumes & docker-compose",
    commandCount: dockerCommands.length,
  },
  {
    key: "terraform",
    label: "Terraform",
    emoji: "🏗️",
    color: "#7b42bc",
    colorLight: "#5c2fa0",
    accent: "#c084fc",
    accentLight: "#4a208c",
    glow: "#7b42bc40",
    glowLight: "#7b42bc25",
    description:
      "Infrastructure as Code — init, plan, apply, state & workspaces",
    commandCount: terraformCommands.length,
  },
  {
    key: "kubernetes",
    label: "Kubernetes",
    emoji: "☸️",
    color: "#326ce5",
    colorLight: "#1a4fc4",
    accent: "#82a8ff",
    accentLight: "#0f3aaa",
    glow: "#326ce540",
    glowLight: "#326ce525",
    description: "Cluster orchestration — pods, deployments, services & config",
    commandCount: kubernetesCommands.length,
  },
  {
    key: "ansible",
    label: "Ansible",
    emoji: "⚙️",
    color: "#e5361a",
    colorLight: "#b82510",
    accent: "#ff7f6b",
    accentLight: "#9e1c0a",
    glow: "#e5361a40",
    glowLight: "#e5361a25",
    description: "Automation — playbooks, inventory, vault, roles & galaxy",
    commandCount: Ansible.length,
  },
  {
    key: "jenkins",
    label: "Jenkins",
    emoji: "🏗️",
    color: "#d24939",
    colorLight: "#a83020",
    accent: "#f0927f",
    accentLight: "#8a1e0f",
    glow: "#d2493940",
    glowLight: "#d2493925",
    description: "Jenkins pipelines, jobs, plugins & CI/CD automation",
    commandCount: JenkinsPipelines.length,
  },
  {
    key: "azure-devops",
    label: "Azure DevOps",
    emoji: "☁️",
    color: "#0078d4",
    colorLight: "#005a9e",
    accent: "#60b0ff",
    accentLight: "#003f7a",
    glow: "#0078d440",
    glowLight: "#0078d425",
    description: "Azure Pipelines, Boards, Repos & Artifacts",
    commandCount: Azure.length,
  },
  {
    key: "github-actions",
    label: "GitHub Actions",
    emoji: "⚡",
    color: "#2da44e",
    colorLight: "#1a7a34",
    accent: "#6fdd8b",
    accentLight: "#0f5a22",
    glow: "#2da44e40",
    glowLight: "#2da44e25",
    description: "Workflow automation, runners, actions & CI/CD pipelines",
    commandCount: GithunactionsTopics.length,
  },
];

export const KUBERNETES_DOCS: K8sDoc[] = [
  {
    key: "k8s-docs",
    emoji: "📦",
    label: "Kubernetes Info",
    description: "Pods, Deployments, ReplicaSets, StatefulSets & DaemonSets",
  },
];

export const PIPELINE_GROUP: DropdownGroup = {
  key: "pipelines",
  label: "Pipelines",
  emoji: "🔁",
  color: "#d24939",
  colorLight: "#a83020",
  accent: "#f0927f",
  accentLight: "#8a1e0f",
  glow: "#d2493940",
  glowLight: "#d2493925",
  children: TABS.filter((t) =>
    ["jenkins", "azure-devops", "github-actions"].includes(t.key),
  ),
};

const DIRECT_TABS = ["docker", "terraform", "ansible", "linux", "github"];

interface HeaderProps {
  activeTab: TabKey | null;
  setActiveTab: (tab: TabKey) => void;
  onHomeClick: () => void;
  activeK8sSection?: K8sSection | null;
  setActiveK8sSection?: (section: K8sSection | null) => void;
  /** Called whenever the desktop sidebar expands or collapses. Use to adjust your content margin. */
  onSidebarToggle?: (expanded: boolean) => void;
}

// ── Sidebar width constants (use these in your layout for margin-left) ──
export const SIDEBAR_EXPANDED_W = 240;
export const SIDEBAR_COLLAPSED_W = 64;

// ── Mobile breakpoint hook ──
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function Header({
  activeTab,
  setActiveTab,
  onHomeClick,
  activeK8sSection,
  setActiveK8sSection,
  onSidebarToggle,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  const [dropOpen, setDropOpen] = useState(false);
  const [k8sDropOpen, setK8sDropOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobilePipelinesOpen, setMobilePipelinesOpen] = useState(false);
  const [mobileK8sOpen, setMobileK8sOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [desktopPipelinesOpen, setDesktopPipelinesOpen] = useState(false);
  const [desktopK8sOpen, setDesktopK8sOpen] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);
  const k8sDropRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false);
      if (k8sDropRef.current && !k8sDropRef.current.contains(e.target as Node))
        setK8sDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // ── Theme tokens ──
  const bg = isDark ? "rgba(9, 9, 11, 0.85)" : "rgba(255, 255, 255, 0.85)";
  const drawerBg = isDark ? "#0c0c0e" : "#ffffff";
  const border = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const text = isDark ? "#a1a1aa" : "#52525b";
  const textActive = isDark ? "#fafafa" : "#09090b";
  const hoverBg = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.04)";
  const dropdownShadow = isDark
    ? "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)"
    : "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.08)";

  const activeTabData = TABS.find((t) => t.key === activeTab);
  const activeGlow = activeTabData
    ? isDark
      ? activeTabData.color
      : activeTabData.colorLight
    : "transparent";

  const visibleTabs = TABS.filter((t) => DIRECT_TABS.includes(t.key));
  const pipelineKeys = PIPELINE_GROUP.children.map((t) => t.key);
  const pipelineActive = activeTab && pipelineKeys.includes(activeTab);
  const pipelineColor = isDark
    ? PIPELINE_GROUP.color
    : PIPELINE_GROUP.colorLight;

  const k8sTab = TABS.find((t) => t.key === "kubernetes")!;
  const isK8sActive = activeTab === "kubernetes";
  const k8sColor = isDark ? k8sTab.color : k8sTab.colorLight;

  // ── Helper: close drawer and navigate ──
  const drawerNavigate = (fn: () => void) => {
    fn();
    setDrawerOpen(false);
    setMobilePipelinesOpen(false);
    setMobileK8sOpen(false);
  };

  // ──────────────────────────────────────────
  // MOBILE LAYOUT
  // ──────────────────────────────────────────
  if (isMobile) {
    const activeLabel =
      activeTabData?.label ?? (activeTab ? activeTab : "Home");
    const activeEmoji = activeTabData?.emoji ?? "🏠";
    const activeColor = activeTabData
      ? isDark
        ? activeTabData.color
        : activeTabData.colorLight
      : "#3b82f6";

    return (
      <>
        {/* ── Mobile Top Bar ── */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            background: bg,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: `1px solid ${border}`,
            zIndex: 9999,
            boxShadow: `0 4px 20px rgba(0,0,0,${isDark ? "0.3" : "0.08"})`,
          }}
        >
          {/* Logo */}
          <button onClick={onHomeClick} style={s.iconBtn}>
            <div style={{ ...s.cmdLogo, color: textActive }}>
              <span style={{ color: "#3b82f6" }}>_</span>CMD
            </div>
          </button>

          {/* Active tab pill */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px 5px 8px",
              borderRadius: "20px",
              border: `1px solid ${activeColor}40`,
              background: `${activeColor}15`,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              color: activeColor,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "15px" }}>{activeEmoji}</span>
            <span>{activeLabel}</span>
            <span
              style={{
                fontSize: "9px",
                opacity: 0.7,
                marginLeft: "2px",
              }}
            >
              ▼
            </span>
          </button>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={toggleTheme}
              style={{ ...s.iconBtn, background: hoverBg, color: text }}
            >
              {isDark ? "🌙" : "☀️"}
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                ...s.iconBtn,
                background: hoverBg,
                color: textActive,
                flexDirection: "column",
                gap: "4px",
              }}
              aria-label="Open menu"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: i === 1 ? "12px" : "16px",
                    height: "2px",
                    borderRadius: "2px",
                    background: textActive,
                    marginLeft: i === 1 ? "auto" : 0,
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* ── Drawer Backdrop ── */}
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
            opacity: drawerOpen ? 1 : 0,
            pointerEvents: drawerOpen ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        />

        {/* ── Drawer Panel ── */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "min(320px, 88vw)",
            background: drawerBg,
            zIndex: 10001,
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            boxShadow: isDark
              ? "-20px 0 60px rgba(0,0,0,0.6)"
              : "-20px 0 60px rgba(0,0,0,0.15)",
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 16px 14px",
              borderBottom: `1px solid ${border}`,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => drawerNavigate(onHomeClick)}
              style={{ ...s.iconBtn, color: textActive }}
            >
              <div style={s.cmdLogo}>
                <span style={{ color: "#3b82f6" }}>_</span>CMD
              </div>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={toggleTheme}
                style={{ ...s.iconBtn, background: hoverBg, color: text }}
              >
                {isDark ? "🌙" : "☀️"}
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  ...s.iconBtn,
                  background: hoverBg,
                  color: text,
                  fontSize: "18px",
                }}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
            {/* Section label */}
            <div style={{ ...s.drawerSectionLabel, color: text }}>Tools</div>

            {/* Direct tabs */}
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const tabColor = isDark ? tab.color : tab.colorLight;
              return (
                <button
                  key={tab.key}
                  onClick={() => drawerNavigate(() => setActiveTab(tab.key))}
                  style={{
                    ...s.drawerItem,
                    background: isActive ? `${tabColor}18` : "transparent",
                    color: isActive ? tabColor : textActive,
                  }}
                >
                  <div
                    style={{
                      ...s.drawerIcon,
                      background: `${tabColor}20`,
                      border: `1px solid ${tabColor}40`,
                    }}
                  >
                    {tab.emoji}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: isActive ? 700 : 600,
                      }}
                    >
                      {tab.label}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: text,
                        marginTop: "2px",
                        lineHeight: 1.3,
                      }}
                    >
                      {tab.description}
                    </div>
                  </div>
                  {isActive && (
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: tabColor,
                        boxShadow: `0 0 6px ${tabColor}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}

            {/* Kubernetes accordion */}
            <div
              style={{ ...s.drawerSectionLabel, color: text, marginTop: "8px" }}
            >
              Orchestration
            </div>

            <button
              onClick={() => setMobileK8sOpen((p) => !p)}
              style={{
                ...s.drawerItem,
                background: isK8sActive ? `${k8sColor}18` : "transparent",
                color: isK8sActive ? k8sColor : textActive,
              }}
            >
              <div
                style={{
                  ...s.drawerIcon,
                  background: `${k8sColor}20`,
                  border: `1px solid ${k8sColor}40`,
                }}
              >
                {k8sTab.emoji}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: isK8sActive ? 700 : 600,
                  }}
                >
                  Kubernetes
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: text,
                    marginTop: "2px",
                    lineHeight: 1.3,
                  }}
                >
                  {k8sTab.description}
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: text,
                  display: "inline-block",
                  transform: mobileK8sOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  flexShrink: 0,
                }}
              >
                ▼
              </span>
            </button>

            {/* K8s sub-items */}
            {mobileK8sOpen && (
              <div style={{ paddingLeft: "12px", marginTop: "2px" }}>
                <button
                  onClick={() =>
                    drawerNavigate(() => {
                      setActiveTab("kubernetes");
                      setActiveK8sSection?.(null);
                    })
                  }
                  style={{
                    ...s.drawerItem,
                    background:
                      isK8sActive && !activeK8sSection
                        ? `${k8sColor}18`
                        : "transparent",
                    color:
                      isK8sActive && !activeK8sSection ? k8sColor : textActive,
                  }}
                >
                  <div
                    style={{
                      ...s.drawerIcon,
                      width: "30px",
                      height: "30px",
                      fontSize: "14px",
                      background: `${k8sColor}15`,
                      border: `1px solid ${k8sColor}30`,
                    }}
                  >
                    ☸️
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    All Commands
                  </span>
                </button>
                {KUBERNETES_DOCS.map((doc) => {
                  const isDocActive =
                    isK8sActive && activeK8sSection === doc.key;
                  return (
                    <button
                      key={doc.key}
                      onClick={() =>
                        drawerNavigate(() => {
                          setActiveTab("kubernetes");
                          setActiveK8sSection?.(doc.key);
                        })
                      }
                      style={{
                        ...s.drawerItem,
                        background: isDocActive
                          ? `${k8sColor}18`
                          : "transparent",
                        color: isDocActive ? k8sColor : textActive,
                      }}
                    >
                      <div
                        style={{
                          ...s.drawerIcon,
                          width: "30px",
                          height: "30px",
                          fontSize: "14px",
                          background: `${k8sColor}15`,
                          border: `1px solid ${k8sColor}30`,
                        }}
                      >
                        {doc.emoji}
                      </div>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: isDocActive ? 700 : 600,
                          }}
                        >
                          {doc.label}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: text,
                            marginTop: "1px",
                          }}
                        >
                          {doc.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Pipelines accordion */}
            <div
              style={{ ...s.drawerSectionLabel, color: text, marginTop: "8px" }}
            >
              CI / CD
            </div>

            <button
              onClick={() => setMobilePipelinesOpen((p) => !p)}
              style={{
                ...s.drawerItem,
                background: pipelineActive
                  ? `${pipelineColor}18`
                  : "transparent",
                color: pipelineActive ? pipelineColor : textActive,
              }}
            >
              <div
                style={{
                  ...s.drawerIcon,
                  background: `${pipelineColor}20`,
                  border: `1px solid ${pipelineColor}40`,
                }}
              >
                {PIPELINE_GROUP.emoji}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: pipelineActive ? 700 : 600,
                  }}
                >
                  Pipelines
                </div>
                <div
                  style={{ fontSize: "11px", color: text, marginTop: "2px" }}
                >
                  Jenkins · Azure DevOps · GitHub Actions
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: text,
                  display: "inline-block",
                  transform: mobilePipelinesOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  flexShrink: 0,
                }}
              >
                ▼
              </span>
            </button>

            {/* Pipeline sub-items */}
            {mobilePipelinesOpen && (
              <div style={{ paddingLeft: "12px", marginTop: "2px" }}>
                {PIPELINE_GROUP.children.map((item) => {
                  const isItemActive = activeTab === item.key;
                  const itemColor = isDark ? item.color : item.colorLight;
                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        drawerNavigate(() => setActiveTab(item.key))
                      }
                      style={{
                        ...s.drawerItem,
                        background: isItemActive
                          ? `${itemColor}18`
                          : "transparent",
                        color: isItemActive ? itemColor : textActive,
                      }}
                    >
                      <div
                        style={{
                          ...s.drawerIcon,
                          width: "30px",
                          height: "30px",
                          fontSize: "14px",
                          background: `${itemColor}15`,
                          border: `1px solid ${itemColor}30`,
                        }}
                      >
                        {item.emoji}
                      </div>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: isItemActive ? 700 : 600,
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: text,
                            marginTop: "1px",
                          }}
                        >
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${border}`,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => drawerNavigate(onHomeClick)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: `1px solid ${border}`,
                background: hoverBg,
                color: text,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // ──────────────────────────────────────────
  // DESKTOP LAYOUT — Collapsible Sidebar
  // ──────────────────────────────────────────

  const SIDEBAR_W = sidebarExpanded
    ? `${SIDEBAR_EXPANDED_W}px`
    : `${SIDEBAR_COLLAPSED_W}px`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_W,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: isDark ? "rgba(9,9,11,0.92)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderRight: `1px solid ${border}`,
        boxShadow: isDark
          ? "4px 0 24px rgba(0,0,0,0.4)"
          : "4px 0 24px rgba(0,0,0,0.08)",
        transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Sidebar Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarExpanded ? "space-between" : "center",
          padding: sidebarExpanded ? "14px 10px 14px 14px" : "18px 0 14px",
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
          minHeight: "60px",
          gap: "6px",
        }}
      >
        {sidebarExpanded && (
          <button
            onClick={onHomeClick}
            style={{
              ...s.iconBtn,
              color: textActive,
              width: "auto",
              padding: "0 4px",
              flexShrink: 0,
            }}
            title="Home"
          >
            <div style={s.cmdLogo}>
              <span style={{ color: "#3b82f6" }}>_</span>CMD
            </div>
          </button>
        )}

        {/* Expanded: theme toggle + collapse button sit side by side */}
        {sidebarExpanded && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginLeft: "auto",
            }}
          >
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                ...s.iconBtn,
                background: hoverBg,
                color: text,
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              {isDark ? "🌙" : "☀️"}
            </button>
            <button
              onClick={() => {
                const next = !sidebarExpanded;
                setSidebarExpanded(next);
                onSidebarToggle?.(next);
              }}
              title="Collapse sidebar"
              style={{
                ...s.iconBtn,
                background: hoverBg,
                color: text,
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              ◀
            </button>
          </div>
        )}

        {/* Collapsed: just the expand button */}
        {!sidebarExpanded && (
          <button
            onClick={() => {
              const next = !sidebarExpanded;
              setSidebarExpanded(next);
              onSidebarToggle?.(next);
            }}
            title="Expand sidebar"
            style={{
              ...s.iconBtn,
              background: hoverBg,
              color: text,
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            ▶
          </button>
        )}
      </div>

      {/* ── Collapsed: Logo + theme toggle stacked ── */}
      {!sidebarExpanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={onHomeClick}
            title="Home"
            style={{
              ...s.iconBtn,
              color: textActive,
              fontSize: "11px",
              fontWeight: 800,
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: hoverBg,
            }}
          >
            _C
          </button>
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              ...s.iconBtn,
              background: hoverBg,
              color: text,
              width: "36px",
              height: "36px",
              fontSize: "15px",
              borderRadius: "10px",
            }}
          >
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>
      )}

      {/* ── Nav Items ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: sidebarExpanded ? "10px 8px" : "10px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: sidebarExpanded ? "stretch" : "center",
          gap: "2px",
        }}
      >
        {/* Section label */}
        {sidebarExpanded && (
          <div style={{ ...s.drawerSectionLabel, color: text }}>Tools</div>
        )}

        {/* Direct tabs */}
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const tabColor = isDark ? tab.color : tab.colorLight;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              title={!sidebarExpanded ? tab.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: sidebarExpanded ? "10px" : "0",
                padding: sidebarExpanded ? "8px 10px" : "0",
                width: sidebarExpanded ? "100%" : "40px",
                height: sidebarExpanded ? "auto" : "40px",
                justifyContent: sidebarExpanded ? "flex-start" : "center",
                borderRadius: "11px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: isActive ? `${tabColor}18` : "transparent",
                position: "relative",
                flexShrink: 0,
                marginBottom: sidebarExpanded ? "1px" : "4px",
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = hoverBg;
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Active left bar */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    height: "60%",
                    width: "3px",
                    borderRadius: "0 3px 3px 0",
                    background: tabColor,
                    boxShadow: `0 0 8px ${tabColor}`,
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  flexShrink: 0,
                  fontSize: "16px",
                  background: isActive ? `${tabColor}25` : "transparent",
                  transition: "background 0.2s",
                }}
              >
                {tab.emoji}
              </div>
              {sidebarExpanded && (
                <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? tabColor : textActive,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* ── Kubernetes accordion ── */}
        {sidebarExpanded && (
          <div
            style={{ ...s.drawerSectionLabel, color: text, marginTop: "10px" }}
          >
            Orchestration
          </div>
        )}

        {/* K8s parent button */}
        <button
          onClick={() => {
            if (sidebarExpanded) {
              setDesktopK8sOpen((p) => !p);
            } else {
              setActiveTab("kubernetes");
              setActiveK8sSection?.(null);
            }
          }}
          title={!sidebarExpanded ? "Kubernetes" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: sidebarExpanded ? "10px" : "0",
            padding: sidebarExpanded ? "8px 10px" : "0",
            width: sidebarExpanded ? "100%" : "40px",
            height: sidebarExpanded ? "auto" : "40px",
            justifyContent: sidebarExpanded ? "flex-start" : "center",
            borderRadius: "11px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: isK8sActive ? `${k8sColor}18` : "transparent",
            position: "relative",
            flexShrink: 0,
            marginBottom: sidebarExpanded ? "1px" : "4px",
          }}
          onMouseOver={(e) => {
            if (!isK8sActive) e.currentTarget.style.background = hoverBg;
          }}
          onMouseOut={(e) => {
            if (!isK8sActive) e.currentTarget.style.background = "transparent";
          }}
        >
          {isK8sActive && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "20%",
                height: "60%",
                width: "3px",
                borderRadius: "0 3px 3px 0",
                background: k8sColor,
                boxShadow: `0 0 8px ${k8sColor}`,
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              flexShrink: 0,
              fontSize: "16px",
              background: isK8sActive ? `${k8sColor}25` : "transparent",
            }}
          >
            {k8sTab.emoji}
          </div>
          {sidebarExpanded && (
            <>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: isK8sActive ? 700 : 500,
                    color: isK8sActive ? k8sColor : textActive,
                    whiteSpace: "nowrap",
                  }}
                >
                  Kubernetes
                </div>
              </div>
              <span
                style={{
                  fontSize: "9px",
                  color: text,
                  flexShrink: 0,
                  display: "inline-block",
                  transform: desktopK8sOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                ▼
              </span>
            </>
          )}
        </button>

        {/* K8s sub-items */}
        {sidebarExpanded && desktopK8sOpen && (
          <div style={{ paddingLeft: "10px" }}>
            {KUBERNETES_DOCS.map((doc) => {
              const isDocActive = isK8sActive && activeK8sSection === doc.key;
              return (
                <button
                  key={doc.key}
                  onClick={() => {
                    setActiveTab("kubernetes");
                    setActiveK8sSection?.(doc.key);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    width: "100%",
                    borderRadius: "9px",
                    border: "none",
                    cursor: "pointer",
                    background: isDocActive ? `${k8sColor}18` : "transparent",
                    marginBottom: "1px",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!isDocActive)
                      e.currentTarget.style.background = hoverBg;
                  }}
                  onMouseOut={(e) => {
                    if (!isDocActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      width: "22px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {doc.emoji}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: isDocActive ? 700 : 500,
                        color: isDocActive ? k8sColor : textActive,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {doc.label}
                    </div>
                  </div>
                  {isDocActive && (
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: k8sColor,
                        boxShadow: `0 0 5px ${k8sColor}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Pipelines accordion ── */}
        {sidebarExpanded && (
          <div
            style={{ ...s.drawerSectionLabel, color: text, marginTop: "10px" }}
          >
            CI / CD
          </div>
        )}

        {/* Pipelines parent button */}
        <button
          onClick={() => {
            if (sidebarExpanded) {
              setDesktopPipelinesOpen((p) => !p);
            }
          }}
          title={!sidebarExpanded ? "Pipelines" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: sidebarExpanded ? "10px" : "0",
            padding: sidebarExpanded ? "8px 10px" : "0",
            width: sidebarExpanded ? "100%" : "40px",
            height: sidebarExpanded ? "auto" : "40px",
            justifyContent: sidebarExpanded ? "flex-start" : "center",
            borderRadius: "11px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: pipelineActive ? `${pipelineColor}18` : "transparent",
            position: "relative",
            flexShrink: 0,
            marginBottom: sidebarExpanded ? "1px" : "4px",
          }}
          onMouseOver={(e) => {
            if (!pipelineActive) e.currentTarget.style.background = hoverBg;
          }}
          onMouseOut={(e) => {
            if (!pipelineActive)
              e.currentTarget.style.background = "transparent";
          }}
        >
          {pipelineActive && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "20%",
                height: "60%",
                width: "3px",
                borderRadius: "0 3px 3px 0",
                background: pipelineColor,
                boxShadow: `0 0 8px ${pipelineColor}`,
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              flexShrink: 0,
              fontSize: "16px",
              background: pipelineActive ? `${pipelineColor}25` : "transparent",
            }}
          >
            {PIPELINE_GROUP.emoji}
          </div>
          {sidebarExpanded && (
            <>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: pipelineActive ? 700 : 500,
                    color: pipelineActive ? pipelineColor : textActive,
                    whiteSpace: "nowrap",
                  }}
                >
                  Pipelines
                </div>
              </div>
              <span
                style={{
                  fontSize: "9px",
                  color: text,
                  flexShrink: 0,
                  display: "inline-block",
                  transform: desktopPipelinesOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                ▼
              </span>
            </>
          )}
        </button>

        {/* Pipeline sub-items — expanded sidebar */}
        {sidebarExpanded && desktopPipelinesOpen && (
          <div style={{ paddingLeft: "10px" }}>
            {PIPELINE_GROUP.children.map((item) => {
              const isItemActive = activeTab === item.key;
              const itemColor = isDark ? item.color : item.colorLight;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 10px",
                    width: "100%",
                    borderRadius: "9px",
                    border: "none",
                    cursor: "pointer",
                    background: isItemActive ? `${itemColor}18` : "transparent",
                    marginBottom: "1px",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!isItemActive)
                      e.currentTarget.style.background = hoverBg;
                  }}
                  onMouseOut={(e) => {
                    if (!isItemActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      width: "22px",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: isItemActive ? 700 : 500,
                        color: isItemActive ? itemColor : textActive,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                  {isItemActive && (
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: itemColor,
                        boxShadow: `0 0 5px ${itemColor}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Pipeline sub-items — collapsed sidebar (tooltip-style icons) */}
        {!sidebarExpanded &&
          PIPELINE_GROUP.children.map((item) => {
            const isItemActive = activeTab === item.key;
            const itemColor = isDark ? item.color : item.colorLight;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                title={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  border: "none",
                  cursor: "pointer",
                  background: isItemActive ? `${itemColor}25` : "transparent",
                  fontSize: "16px",
                  position: "relative",
                  flexShrink: 0,
                  marginBottom: "4px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!isItemActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseOut={(e) => {
                  if (!isItemActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {isItemActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      height: "60%",
                      width: "3px",
                      borderRadius: "0 3px 3px 0",
                      background: itemColor,
                      boxShadow: `0 0 6px ${itemColor}`,
                    }}
                  />
                )}
                {item.emoji}
              </button>
            );
          })}
      </div>

      {/* ── Sidebar Footer ── */}
      <div
        style={{
          borderTop: `1px solid ${border}`,
          padding: sidebarExpanded ? "12px 8px" : "12px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: sidebarExpanded ? "stretch" : "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        {sidebarExpanded && (
          <button
            onClick={onHomeClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              width: "100%",
              borderRadius: "11px",
              border: `1px solid ${border}`,
              background: "transparent",
              color: text,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = hoverBg)}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span style={{ fontSize: "16px" }}>🏠</span>
            <span>Home</span>
          </button>
        )}
      </div>
    </div>
  );
}
// ── Styles ──
const s: Record<string, React.CSSProperties> = {
  navContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    paddingTop: "24px",
    zIndex: 9999,
    pointerEvents: "none",
  },
  island: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 8px",
    borderRadius: "20px",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    borderStyle: "solid",
    borderWidth: "1px",
    pointerEvents: "auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  cmdLogo: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 800,
    fontSize: "14px",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
  },
  divider: {
    width: "1px",
    height: "20px",
  },
  tabsWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  tab: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  activeIndicator: {
    position: "absolute",
    bottom: "-6px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "16px",
    height: "2px",
    borderRadius: "2px",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    borderRadius: "16px",
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    backdropFilter: "blur(24px) saturate(200%)",
    WebkitBackdropFilter: "blur(24px) saturate(200%)",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    transformOrigin: "top right",
  },
  dropHeader: {
    padding: "8px 12px 6px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#71717a",
    marginBottom: "4px",
  },
  dropItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease",
    width: "100%",
  },
  dropIconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    flexShrink: 0,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingLeft: "4px",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  // ── Mobile drawer styles ──
  drawerSectionLabel: {
    padding: "6px 10px 4px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
  },
  drawerItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "9px 10px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease",
    width: "100%",
    marginBottom: "2px",
  },
  drawerIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    flexShrink: 0,
    fontSize: "18px",
  },
};