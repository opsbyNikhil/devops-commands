// import React, { useState, useEffect, useRef } from "react";
// import { githubCommands } from "../pages/Git";
// import { dockerCommands } from "../pages/Docker";
// import { terraformCommands } from "../pages/Terraform";
// import { allCommands as kubernetesCommands } from "../pages/Kubernetes";
// import { Ansible } from "../pages/Ansible";
// import { linuxCommands } from "../pages/Linux";
// import { JenkinsPipelines } from "../pages/pipelines/jenkins";
// import { useTheme } from "../Themecontext";

// export type TabKey =
//   | "docker"
//   | "terraform"
//   | "kubernetes"
//   | "ansible"
//   | "linux"
//   | "github"
//   | "jenkins"
//   | "azure-devops"
//   | "github-actions";

// export interface Tab {
//   key: TabKey;
//   label: string;
//   emoji: string;
//   color: string;
//   colorLight: string;
//   accent: string;
//   accentLight: string;
//   glow: string;
//   glowLight: string;
//   description: string;
//   commandCount: number;
// }

// interface DropdownGroup {
//   key: string;
//   label: string;
//   emoji: string;
//   color: string;
//   colorLight: string;
//   accent: string;
//   accentLight: string;
//   glow: string;
//   glowLight: string;
//   children: Tab[];
// }

// export const TABS: Tab[] = [
//   {
//     key: "linux",
//     label: "Linux",
//     emoji: "🐧",
//     color: "#22c55e", // ← was #f5a623 (orange)
//     colorLight: "#15803d", // ← was #c47d0e
//     accent: "#86efac", // ← was #ffd080
//     accentLight: "#14532d", // ← was #a05e00
//     glow: "#22c55e40", // ← was #f5a62340
//     glowLight: "#22c55e25", // ← was #f5a62325
//     description:
//       "Essential Linux commands, shell scripting & system administration",
//     commandCount: linuxCommands.length,
//   },
//   {
//     key: "github",
//     label: "GitHub",
//     emoji: "🐙",
//     color: "#6e8efb",
//     colorLight: "#3a5bd9",
//     accent: "#a5b4fc",
//     accentLight: "#2a45c0",
//     glow: "#6e8efb40",
//     glowLight: "#6e8efb25",
//     description: "GitHub CLI, repos, PRs, issues, releases & workflows",
//     commandCount: githubCommands.length,
//   },
//   {
//     key: "docker",
//     label: "Docker",
//     emoji: "🐋",
//     color: "#0db7ed",
//     colorLight: "#0882b0",
//     accent: "#57cbff",
//     accentLight: "#0670a0",
//     glow: "#0db7ed40",
//     glowLight: "#0db7ed25",
//     description:
//       "Container lifecycle, images, networks, volumes & docker-compose",
//     commandCount: dockerCommands.length,
//   },
//   {
//     key: "terraform",
//     label: "Terraform",
//     emoji: "🏗️",
//     color: "#7b42bc",
//     colorLight: "#5c2fa0",
//     accent: "#c084fc",
//     accentLight: "#4a208c",
//     glow: "#7b42bc40",
//     glowLight: "#7b42bc25",
//     description:
//       "Infrastructure as Code — init, plan, apply, state & workspaces",
//     commandCount: terraformCommands.length,
//   },
//   {
//     key: "kubernetes",
//     label: "Kubernetes",
//     emoji: "☸️",
//     color: "#326ce5",
//     colorLight: "#1a4fc4",
//     accent: "#82a8ff",
//     accentLight: "#0f3aaa",
//     glow: "#326ce540",
//     glowLight: "#326ce525",
//     description: "Cluster orchestration — pods, deployments, services & config",
//     commandCount: kubernetesCommands.length,
//   },
//   {
//     key: "ansible",
//     label: "Ansible",
//     emoji: "⚙️",
//     color: "#e5361a",
//     colorLight: "#b82510",
//     accent: "#ff7f6b",
//     accentLight: "#9e1c0a",
//     glow: "#e5361a40",
//     glowLight: "#e5361a25",
//     description: "Automation — playbooks, inventory, vault, roles & galaxy",
//     commandCount: Ansible.length,
//   },
//   {
//     key: "jenkins",
//     label: "Jenkins",
//     emoji: "🏗️",
//     color: "#d24939",
//     colorLight: "#a83020",
//     accent: "#f0927f",
//     accentLight: "#8a1e0f",
//     glow: "#d2493940",
//     glowLight: "#d2493925",
//     description: "Jenkins pipelines, jobs, plugins & CI/CD automation",
//     commandCount: JenkinsPipelines.length,
//   },
//   {
//     key: "azure-devops",
//     label: "Azure DevOps",
//     emoji: "☁️",
//     color: "#0078d4",
//     colorLight: "#005a9e",
//     accent: "#60b0ff",
//     accentLight: "#003f7a",
//     glow: "#0078d440",
//     glowLight: "#0078d425",
//     description: "Azure Pipelines, Boards, Repos & Artifacts",
//     commandCount: 0,
//   },
//   {
//     key: "github-actions",
//     label: "GitHub Actions",
//     emoji: "⚡",
//     color: "#2da44e",
//     colorLight: "#1a7a34",
//     accent: "#6fdd8b",
//     accentLight: "#0f5a22",
//     glow: "#2da44e40",
//     glowLight: "#2da44e25",
//     description: "Workflow automation, runners, actions & CI/CD pipelines",
//     commandCount: 0,
//   },
// ];

// const DIRECT_TABS: TabKey[] = [
//   "docker",
//   "terraform",
//   "kubernetes",
//   "ansible",
//   "linux",
//   "github",
// ];

// const PIPELINE_GROUP: DropdownGroup = {
//   key: "pipelines",
//   label: "Pipelines",
//   emoji: "🔁",
//   color: "#d24939",
//   colorLight: "#a83020",
//   accent: "#f0927f",
//   accentLight: "#8a1e0f",
//   glow: "#d2493940",
//   glowLight: "#d2493925",
//   children: TABS.filter((t) =>
//     ["jenkins", "azure-devops", "github-actions"].includes(t.key),
//   ),
// };

// interface HeaderProps {
//   activeTab: TabKey | null;
//   setActiveTab: (tab: TabKey) => void;
//   onHomeClick: () => void;
// }

// const Header: React.FC<HeaderProps> = ({
//   activeTab,
//   setActiveTab,
//   onHomeClick,
// }) => {
//   const { isDark, toggleTheme } = useTheme();

//   const [scrolled, setScrolled] = useState(false);
//   const [hovered, setHovered] = useState<string | null>(null);
//   const [logoHovered, setLogoHovered] = useState(false);
//   const [dropOpen, setDropOpen] = useState(false);
//   const dropRef = useRef<HTMLDivElement>(null);

//   const active = activeTab ? TABS.find((t) => t.key === activeTab)! : TABS[0];
//   const c = (dark: string, light: string) => (isDark ? dark : light);

//   const activeColor = c(active.color, active.colorLight);
//   const activeAccent = c(active.accent, active.accentLight);
//   const activeGlow = c(active.glow, active.glowLight);

//   const pipelineKeys = PIPELINE_GROUP.children.map((t) => t.key);
//   const pipelineActive = activeTab && pipelineKeys.includes(activeTab);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
//         setDropOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const theme = {
//     bg: c("#070d14", "#f0f5f9"),
//     barBorder: c("#0e1e2c", "#cddbe8"),
//     divider: c("#0e1e2c", "#cddbe8"),
//     tabIdle: c("#2a4050", "#7a96a8"),
//     scanLine: c("rgba(255,255,255,0.008)", "rgba(0,0,0,0.005)"),
//     logoSub: c("#1e3545", "#9ab0c0"),
//     verBg: c("#0a1820", "#e2eef6"),
//     verColor: c("#1a3040", "#6a90a8"),
//     verBorder: c("#0e1e2c", "#c0d4e0"),
//     countIdleBg: c("#0a1820", "#e2eef6"),
//     countIdleColor: c("#1e3040", "#7a96a8"),
//     countIdleBorder: c("#0e1e2c", "#c0d4e0"),
//     toggleTrack: c("#1a3045", "#c0d8e8"),
//     toggleThumb: c("#0db7ed", "#1a6fa8"),
//     homeChipBg: c("#0db7ed08", "#e6f4fb"),
//     homeChipBorder: c("#0db7ed20", "#a8d0e8"),
//     homeChipColor: c("#0db7ed80", "#1a6fa8"),
//     dropBg: c("#070d14", "#ffffff"),
//     dropBorder: c("#0e1e2c", "#cddbe8"),
//     dropShadow: c(
//       "0 16px 48px rgba(0,0,0,0.6)",
//       "0 16px 48px rgba(0,0,0,0.12)",
//     ),
//     dropItemHoverBg: c("rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)"),
//     dropItemDesc: c("#2a4050", "#7a96a8"),
//     dropItemBorder: c("rgba(255,255,255,0.05)", "rgba(0,0,0,0.06)"),
//   };

//   const css = `
//     @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

//     .hdr {
//       position: sticky; top: 0; z-index: 999;
//       font-family: 'JetBrains Mono', monospace;
//       transition: box-shadow 0.4s ease;
//     }

//     .hdr-bar {
//       background: ${theme.bg};
//       border-bottom: 1px solid ${theme.barBorder};
//       padding: 0 16px;
//       height: 48px;
//       display: flex; align-items: center; gap: 12px;
//       position: relative;
//       overflow: visible;
//       transition: background 0.3s ease, border-color 0.3s ease;
//     }

//     .hdr-bar::before {
//       content: ''; position: absolute; inset: 0;
//       background: repeating-linear-gradient(
//         0deg, transparent, transparent 3px,
//         ${theme.scanLine} 3px, ${theme.scanLine} 4px
//       );
//       pointer-events: none;
//     }

//     /* ── Logo ── */
//     .hdr-logo {
//       display: flex; align-items: center; gap: 8px; flex-shrink: 0;
//       cursor: pointer; padding: 3px 6px; border-radius: 6px; margin: -3px -6px;
//       transition: background 0.2s ease;
//     }
//     .hdr-logo:hover { background: rgba(13,183,237,0.06); }

//     .hdr-logo-box {
//       width: 26px; height: 26px; border-radius: 6px;
//       display: flex; align-items: center; justify-content: center;
//       font-size: 13px; transition: all 0.3s ease; flex-shrink: 0;
//     }

//     .hdr-logo-title {
//       font-family: 'Rajdhani', sans-serif; font-size: 17px; font-weight: 700;
//       color: ${c("#fff", "#1a2a38")}; letter-spacing: 1px; line-height: 1;
//       white-space: nowrap; transition: color 0.3s ease;
//     }

//     .hdr-logo-sub {
//       font-family: 'JetBrains Mono', monospace; font-size: 7px;
//       color: ${theme.logoSub}; letter-spacing: 2.5px; margin-top: 2px;
//       white-space: nowrap; transition: color 0.3s ease;
//     }
//     .hdr-logo:hover .hdr-logo-sub { color: #0db7ed60; }

//     .hdr-divider {
//       width: 1px; height: 18px;
//       background: ${theme.divider}; flex-shrink: 0;
//       transition: background 0.3s ease;
//     }

//     /* ── Tabs ── */
//     .hdr-tabs {
//       display: flex; align-items: stretch; gap: 0;
//       flex-shrink: 1; min-width: 0;
//       height: 48px; overflow: visible;
//     }

//     .hdr-tab {
//       position: relative; display: flex; align-items: center; gap: 5px;
//       padding: 0 8px; border: none; background: transparent; cursor: pointer;
//       font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
//       letter-spacing: 0.5px; transition: all 0.2s ease; white-space: nowrap;
//       border-bottom: 2px solid transparent; margin-bottom: -1px;
//       flex-shrink: 1;
//     }

//     .hdr-tab-emoji {
//       font-size: 12px; transition: transform 0.2s ease; line-height: 1;
//     }
//     .hdr-tab:hover .hdr-tab-emoji { transform: scale(1.2) rotate(-6deg); }

//     .hdr-tab-count {
//       font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700;
//       padding: 1px 4px; border-radius: 6px;
//       transition: all 0.2s ease; border: 1px solid transparent;
//     }

//     .hdr-tab-line {
//       position: absolute; bottom: -1px; left: 6px; right: 6px;
//       height: 2px; border-radius: 2px; transition: opacity 0.25s ease;
//     }

//     /* ── Dropdown trigger ── */
//     .hdr-drop-wrap {
//       position: relative; display: flex; align-items: stretch;
//       overflow: visible;
//     }

//     .hdr-drop-trigger {
//       display: flex; align-items: center; gap: 5px;
//       padding: 0 8px; border: none; background: transparent; cursor: pointer;
//       font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
//       letter-spacing: 0.5px; transition: all 0.2s ease; white-space: nowrap;
//       border-bottom: 2px solid transparent; margin-bottom: -1px;
//       height: 48px;
//     }
//     .hdr-drop-trigger:hover .hdr-tab-emoji { transform: scale(1.2) rotate(-6deg); }

//     .hdr-drop-chevron {
//       font-size: 8px; opacity: 0.6; margin-left: 1px;
//       transition: transform 0.25s ease, opacity 0.2s;
//       display: inline-block;
//     }
//     .hdr-drop-chevron.open { transform: rotate(180deg); opacity: 1; }

//     /* ── Dropdown panel ── */
//     .hdr-dropdown {
//       position: absolute; top: calc(100% + 8px); left: 0;
//       min-width: 210px;
//       background: ${theme.dropBg};
//       border: 1px solid ${theme.dropBorder};
//       border-radius: 12px;
//       box-shadow: ${theme.dropShadow};
//       overflow: hidden;
//       opacity: 0; transform: translateY(-6px) scale(0.97);
//       pointer-events: none;
//       transition: opacity 0.2s ease, transform 0.2s ease;
//       z-index: 9999;
//     }
//     .hdr-dropdown.open {
//       opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
//     }

//     .hdr-drop-header {
//       padding: 8px 12px 6px;
//       font-family: 'JetBrains Mono', monospace;
//       font-size: 8px; letter-spacing: 3px;
//       color: ${theme.tabIdle}; text-transform: uppercase;
//       border-bottom: 1px solid ${theme.dropItemBorder};
//     }

//     .hdr-drop-item {
//       display: flex; align-items: center; gap: 10px;
//       padding: 10px 12px; cursor: pointer;
//       transition: background 0.15s ease;
//       border-bottom: 1px solid ${theme.dropItemBorder};
//     }
//     .hdr-drop-item:last-child { border-bottom: none; }
//     .hdr-drop-item:hover { background: ${theme.dropItemHoverBg}; }

//     .hdr-drop-icon {
//       width: 28px; height: 28px; border-radius: 7px;
//       display: flex; align-items: center; justify-content: center;
//       font-size: 14px; flex-shrink: 0; transition: all 0.2s ease;
//     }

//     .hdr-drop-item-label {
//       font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700;
//       letter-spacing: 0.5px; transition: color 0.15s ease;
//     }
//     .hdr-drop-item-desc {
//       font-family: 'JetBrains Mono', monospace;
//       font-size: 9px; color: ${theme.dropItemDesc};
//       margin-top: 1px; letter-spacing: 0.3px; line-height: 1.4;
//     }

//     /* ── Right side ── */
//     .hdr-right {
//       display: flex; align-items: center; gap: 6px;
//       flex-shrink: 0; margin-left: auto;
//     }

//     /* ── Toggle ── */
//     .toggle-wrap {
//       display: flex; align-items: center; gap: 4px;
//       cursor: pointer; user-select: none;
//     }
//     .toggle-icon { font-size: 11px; line-height: 1; }
//     .toggle-track {
//       width: 34px; height: 18px; border-radius: 9px; cursor: pointer;
//       position: relative; border: 1px solid ${c("#1a3045", "#a8cce0")};
//       background: ${theme.toggleTrack}; transition: all 0.3s ease; flex-shrink: 0;
//     }
//     .toggle-thumb {
//       position: absolute; top: 2px;
//       left: ${isDark ? "2px" : "16px"};
//       width: 12px; height: 12px; border-radius: 50%;
//       background: ${theme.toggleThumb};
//       transition: left 0.3s ease, background 0.3s ease;
//     }

//     .hdr-home-chip {
//       display: flex; align-items: center; gap: 5px; padding: 3px 8px;
//       border-radius: 5px; border: 1px solid ${theme.homeChipBorder};
//       background: ${theme.homeChipBg};
//       font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
//       letter-spacing: 1.5px; color: ${theme.homeChipColor};
//       transition: all 0.3s ease;
//     }

//     .hdr-active-chip {
//       display: flex; align-items: center; gap: 5px; padding: 3px 8px;
//       border-radius: 5px; border: 1px solid transparent;
//       transition: all 0.3s ease;
//     }

//     .hdr-active-chip-label {
//       font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
//       letter-spacing: 1.5px; transition: color 0.3s ease;
//     }

//     .hdr-glow {
//       height: 1px; opacity: ${isDark ? 0.7 : 0.5};
//       transition: background 0.4s ease;
//     }
//   `;

//   const directTabs = TABS.filter((t) => DIRECT_TABS.includes(t.key));

//   return (
//     <>
//       <style>{css}</style>

//       <header
//         className="hdr"
//         style={{ boxShadow: scrolled ? `0 2px 32px ${activeGlow}` : "none" }}
//       >
//         <div className="hdr-bar">
//           {/* ── Logo ── */}
//           <div
//             className="hdr-logo"
//             onClick={onHomeClick}
//             onMouseEnter={() => setLogoHovered(true)}
//             onMouseLeave={() => setLogoHovered(false)}
//             title="Back to Home"
//           >
//             <div
//               className="hdr-logo-box"
//               style={{
//                 background: logoHovered ? "#0db7ed25" : `${activeColor}20`,
//                 border: `1px solid ${logoHovered ? "#0db7ed60" : activeColor + "40"}`,
//                 boxShadow: `0 0 10px ${logoHovered ? "#0db7ed40" : activeGlow}`,
//               }}
//             >
//               {activeTab ? active.emoji : "🖥️"}
//             </div>
//             <div>
//               <div className="hdr-logo-title">
//                 Dev
//                 <span
//                   style={{
//                     color: logoHovered ? "#0db7ed" : activeColor,
//                     transition: "color 0.2s",
//                   }}
//                 >
//                   Ops
//                 </span>{" "}
//                 <span style={{ color: c("#ffffff60", "#1a2a3860") }}>CMD</span>
//               </div>
//               <div className="hdr-logo-sub">
//                 {logoHovered ? "← HOME" : "COMMAND REFERENCE"}
//               </div>
//             </div>
//           </div>

//           <div className="hdr-divider" />

//           {/* ── Nav tabs ── */}
//           <nav className="hdr-tabs">
//             {directTabs.map((tab) => {
//               const isActive = tab.key === activeTab;
//               const isHov = hovered === tab.key;
//               const tabColor = c(tab.color, tab.colorLight);
//               const tabAccent = c(tab.accent, tab.accentLight);
//               return (
//                 <button
//                   key={tab.key}
//                   className="hdr-tab"
//                   onClick={() => setActiveTab(tab.key)}
//                   onMouseEnter={() => setHovered(tab.key)}
//                   onMouseLeave={() => setHovered(null)}
//                   style={{
//                     color: isActive
//                       ? tabAccent
//                       : isHov
//                         ? tabColor
//                         : theme.tabIdle,
//                     background: isActive
//                       ? `${tabColor}10`
//                       : isHov
//                         ? `${tabColor}08`
//                         : "transparent",
//                     borderBottomColor: isActive ? tabColor : "transparent",
//                   }}
//                 >
//                   <span className="hdr-tab-emoji">{tab.emoji}</span>
//                   {tab.label}
//                   {tab.commandCount > 0 && (
//                     <span
//                       className="hdr-tab-count"
//                       style={{
//                         background: isActive
//                           ? `${tabColor}20`
//                           : theme.countIdleBg,
//                         color: isActive ? tabAccent : theme.countIdleColor,
//                         borderColor: isActive
//                           ? `${tabColor}40`
//                           : theme.countIdleBorder,
//                       }}
//                     >
//                       {tab.commandCount}
//                     </span>
//                   )}
//                   <div
//                     className="hdr-tab-line"
//                     style={{
//                       background: `linear-gradient(90deg, transparent, ${tabColor}, transparent)`,
//                       opacity: isActive ? 1 : 0,
//                     }}
//                   />
//                 </button>
//               );
//             })}

//             {/* ── Pipelines dropdown ── */}
//             <div
//               className="hdr-drop-wrap"
//               ref={dropRef}
//               onMouseEnter={() => setDropOpen(true)}
//               onMouseLeave={() => setDropOpen(false)}
//             >
//               <button
//                 className="hdr-drop-trigger"
//                 style={{
//                   color: pipelineActive
//                     ? c(PIPELINE_GROUP.accent, PIPELINE_GROUP.accentLight)
//                     : dropOpen
//                       ? c(PIPELINE_GROUP.color, PIPELINE_GROUP.colorLight)
//                       : theme.tabIdle,
//                   background: pipelineActive
//                     ? `${c(PIPELINE_GROUP.color, PIPELINE_GROUP.colorLight)}10`
//                     : dropOpen
//                       ? `${c(PIPELINE_GROUP.color, PIPELINE_GROUP.colorLight)}08`
//                       : "transparent",
//                   borderBottomColor: pipelineActive
//                     ? c(PIPELINE_GROUP.color, PIPELINE_GROUP.colorLight)
//                     : "transparent",
//                 }}
//               >
//                 <span className="hdr-tab-emoji">{PIPELINE_GROUP.emoji}</span>
//                 {PIPELINE_GROUP.label}
//                 <span className={`hdr-drop-chevron ${dropOpen ? "open" : ""}`}>
//                   ▾
//                 </span>
//                 <div
//                   className="hdr-tab-line"
//                   style={{
//                     background: `linear-gradient(90deg, transparent, ${c(PIPELINE_GROUP.color, PIPELINE_GROUP.colorLight)}, transparent)`,
//                     opacity: pipelineActive ? 1 : 0,
//                   }}
//                 />
//               </button>

//               {/* Dropdown panel */}
//               <div className={`hdr-dropdown ${dropOpen ? "open" : ""}`}>
//                 <div className="hdr-drop-header">CI / CD PIPELINES</div>
//                 {PIPELINE_GROUP.children.map((item) => {
//                   const isActive = activeTab === item.key;
//                   const itemColor = c(item.color, item.colorLight);
//                   return (
//                     <div
//                       key={item.key}
//                       className="hdr-drop-item"
//                       onClick={() => {
//                         setActiveTab(item.key);
//                         setDropOpen(false);
//                       }}
//                       style={{
//                         background: isActive ? `${itemColor}10` : undefined,
//                       }}
//                     >
//                       <div
//                         className="hdr-drop-icon"
//                         style={{
//                           background: `${itemColor}18`,
//                           border: `1px solid ${itemColor}35`,
//                           boxShadow: isActive
//                             ? `0 0 10px ${item.glow}`
//                             : "none",
//                         }}
//                       >
//                         {item.emoji}
//                       </div>
//                       <div>
//                         <div
//                           className="hdr-drop-item-label"
//                           style={{
//                             color: isActive
//                               ? itemColor
//                               : c("#c8dde8", "#1a2a38"),
//                           }}
//                         >
//                           {item.label}
//                         </div>
//                         <div className="hdr-drop-item-desc">
//                           {item.description}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </nav>

//           {/* ── Right side ── */}
//           <div className="hdr-right">
//             {activeTab ? (
//               <div
//                 className="hdr-active-chip"
//                 style={{
//                   background: `${activeColor}12`,
//                   borderColor: `${activeColor}30`,
//                   boxShadow: `0 0 10px ${activeGlow}`,
//                 }}
//               >
//                 <span style={{ fontSize: 12 }}>{active.emoji}</span>
//                 <span
//                   className="hdr-active-chip-label"
//                   style={{ color: activeAccent }}
//                 >
//                   {active.label.toUpperCase()}
//                 </span>
//               </div>
//             ) : (
//               <div className="hdr-home-chip">🏠 HOME</div>
//             )}

//             {/* Theme Toggle */}
//             <div
//               className="toggle-wrap"
//               onClick={toggleTheme}
//               title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
//             >
//               <span className="toggle-icon">🌙</span>
//               <div className="toggle-track">
//                 <div className="toggle-thumb" />
//               </div>
//               <span className="toggle-icon">☀️</span>
//             </div>
//           </div>
//         </div>

//         {/* Glow line */}
//         <div
//           className="hdr-glow"
//           style={{
//             background: `linear-gradient(90deg, transparent, ${activeColor}60, transparent)`,
//           }}
//         />
//       </header>
//     </>
//   );
// };

// // export default Header;


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

export type K8sSection =
  | "k8s-docs"
;

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

// ── Kubernetes Docs Sections ──
export const KUBERNETES_DOCS: K8sDoc[] = [
  {
    key: "k8s-docs",
    emoji: "📦",
    label: "Kubernates Info",
    description: "Pods, Deployments, ReplicaSets, StatefulSets & DaemonSets",
  },
  
];

// ── Pipelines Dropdown Group ──
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

// Direct tabs — kubernetes excluded (rendered as its own dropdown)
const DIRECT_TABS = ["docker", "terraform", "ansible", "linux", "github"];

interface HeaderProps {
  activeTab: TabKey | null;
  setActiveTab: (tab: TabKey) => void;
  onHomeClick: () => void;
  activeK8sSection?: K8sSection | null;
  setActiveK8sSection?: (section: K8sSection | null) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  onHomeClick,
  activeK8sSection,
  setActiveK8sSection,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  const [dropOpen, setDropOpen] = useState(false);
  const [k8sDropOpen, setK8sDropOpen] = useState(false);

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

  // ── Theme tokens ──
  const bg = isDark ? "rgba(9, 9, 11, 0.75)" : "rgba(255, 255, 255, 0.75)";
  const border = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
  const text = isDark ? "#a1a1aa" : "#52525b";
  const textActive = isDark ? "#fafafa" : "#09090b";
  const hoverBg = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
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

  // Pipelines
  const pipelineKeys = PIPELINE_GROUP.children.map((t) => t.key);
  const pipelineActive = activeTab && pipelineKeys.includes(activeTab);
  const pipelineColor = isDark
    ? PIPELINE_GROUP.color
    : PIPELINE_GROUP.colorLight;

  // Kubernetes
  const k8sTab = TABS.find((t) => t.key === "kubernetes")!;
  const isK8sActive = activeTab === "kubernetes";
  const k8sColor = isDark ? k8sTab.color : k8sTab.colorLight;

  return (
    <div style={s.navContainer}>
      <nav
        style={{
          ...s.island,
          background: bg,
          borderColor: border,
          boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? "0.4" : "0.1"}), 0 0 0 1px ${border}, 0 4px 20px ${activeGlow}30`,
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={onHomeClick}
          style={{ ...s.iconBtn, color: textActive }}
          title="Home"
        >
          <div style={s.cmdLogo}>
            <span style={{ color: "#3b82f6" }}>_</span>CMD
          </div>
        </button>

        <div style={{ ...s.divider, background: border }} />

        {/* ── Tabs ── */}
        <div style={s.tabsWrapper}>
          {/* Direct tabs */}
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const tabColor = isDark ? tab.color : tab.colorLight;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...s.tab,
                  color: isActive ? textActive : text,
                  background: isActive ? `${tabColor}15` : "transparent",
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseOut={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: "14px" }}>{tab.emoji}</span>
                <span style={{ fontWeight: isActive ? 600 : 500 }}>
                  {tab.label}
                </span>
                {isActive && (
                  <div
                    style={{
                      ...s.activeIndicator,
                      background: tabColor,
                      boxShadow: `0 0 8px ${tabColor}`,
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* ── Kubernetes Docs Dropdown ── */}
          <div
            ref={k8sDropRef}
            style={{ position: "relative" }}
            onClick={() => setK8sDropOpen((prev) => !prev)}
          >
            <button
              onClick={() => {
                setActiveTab("kubernetes");
                setActiveK8sSection?.(null);
              }}
              style={{
                ...s.tab,
                color: isK8sActive || k8sDropOpen ? textActive : text,
                background: isK8sActive
                  ? `${k8sColor}15`
                  : k8sDropOpen
                    ? hoverBg
                    : "transparent",
              }}
            >
              <span style={{ fontSize: "14px" }}>{k8sTab.emoji}</span>
              <span
                style={{ fontWeight: isK8sActive || k8sDropOpen ? 600 : 500 }}
              >
                Kubernetes
              </span>
              <span
                style={{
                  fontSize: "10px",
                  marginLeft: "2px",
                  opacity: k8sDropOpen ? 1 : 0.5,
                  display: "inline-block",
                  transform: k8sDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.2s ease",
                }}
              >
                ▼
              </span>
              {isK8sActive && (
                <div
                  style={{
                    ...s.activeIndicator,
                    background: k8sColor,
                    boxShadow: `0 0 8px ${k8sColor}`,
                  }}
                />
              )}
            </button>

            {/* K8s Dropdown Panel */}
            <div
              style={{
                ...s.dropdown,
                background: bg,
                boxShadow: dropdownShadow,
                opacity: k8sDropOpen ? 1 : 0,
                transform: k8sDropOpen
                  ? "translateY(0) scale(1)"
                  : "translateY(-10px) scale(0.98)",
                pointerEvents: k8sDropOpen ? "auto" : "none",
                minWidth: "290px",
              }}
            >
              {/* Section items */}
              {KUBERNETES_DOCS.map((doc) => {
                const isDocActive = isK8sActive && activeK8sSection === doc.key;
                return (
                  <button
                    key={doc.key}
                    onClick={() => {
                      setActiveTab("kubernetes");
                      setActiveK8sSection?.(doc.key);
                      setK8sDropOpen(false);
                    }}
                    style={{
                      ...s.dropItem,
                      background: isDocActive ? `${k8sColor}15` : "transparent",
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
                        ...s.dropIconBox,
                        background: `${k8sColor}20`,
                        border: `1px solid ${k8sColor}40`,
                        boxShadow: isDocActive
                          ? `0 0 10px ${k8sTab.glow}`
                          : "none",
                        fontSize: "17px",
                      }}
                    >
                      {doc.emoji}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isDocActive ? 700 : 600,
                          color: isDocActive ? k8sColor : textActive,
                        }}
                      >
                        {doc.label}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: text,
                          textAlign: "left",
                          marginTop: "2px",
                          lineHeight: 1.4,
                        }}
                      >
                        {doc.description}
                      </span>
                    </div>
                    {isDocActive && (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: k8sColor,
                          boxShadow: `0 0 6px ${k8sColor}`,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Footer — view all */}
              {/* <div
                style={{
                  borderTop: `1px solid ${border}`,
                  marginTop: "4px",
                  padding: "6px 6px 2px",
                }}
              >
                <button
                  onClick={() => {
                    setActiveTab("kubernetes");
                    setActiveK8sSection?.(null);
                    setK8sDropOpen(false);
                  }}
                  style={{
                    ...s.dropItem,
                    padding: "7px 10px",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: k8sColor,
                    fontWeight: 600,
                    background: `${k8sColor}08`,
                    borderRadius: "10px",
                    width: "100%",
                    gap: "6px",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = `${k8sColor}18`)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = `${k8sColor}08`)
                  }
                >
                  ☸️ View all {k8sTab.commandCount} commands
                </button>
              </div> */}
            </div>
          </div>

          {/* ── Pipelines Dropdown ── */}
          <div
            ref={dropRef}
            style={{ position: "relative" }}
           
          >
            <button
              onClick={() => setDropOpen((prev) => !prev)} 
              style={{
                ...s.tab,
                color: pipelineActive || dropOpen ? textActive : text,
                background: pipelineActive
                  ? `${pipelineColor}15`
                  : dropOpen
                    ? hoverBg
                    : "transparent",
              }}
            >
              <span style={{ fontSize: "14px" }}>{PIPELINE_GROUP.emoji}</span>
              <span
                style={{ fontWeight: pipelineActive || dropOpen ? 600 : 500 }}
              >
                {PIPELINE_GROUP.label}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  marginLeft: "2px",
                  opacity: dropOpen ? 1 : 0.5,
                  display: "inline-block",
                  transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "all 0.2s ease",
                }}
              >
                ▼
              </span>
              {pipelineActive && (
                <div
                  style={{
                    ...s.activeIndicator,
                    background: pipelineColor,
                    boxShadow: `0 0 8px ${pipelineColor}`,
                  }}
                />
              )}
            </button>

            {/* Pipelines Dropdown Panel */}
            <div
              style={{
                ...s.dropdown,
                background: bg,
                boxShadow: dropdownShadow,
                opacity: dropOpen ? 1 : 0,
                transform: dropOpen
                  ? "translateY(0) scale(1)"
                  : "translateY(-10px) scale(0.98)",
                pointerEvents: dropOpen ? "auto" : "none",
                minWidth: "260px",
              }}
            >
              <div
                style={{ ...s.dropHeader, borderBottom: `1px solid ${border}` }}
              >
                CI / CD Pipelines
              </div>
              {PIPELINE_GROUP.children.map((item) => {
                const isItemActive = activeTab === item.key;
                const itemColor = isDark ? item.color : item.colorLight;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setDropOpen(false);
                    }}
                    style={{
                      ...s.dropItem,
                      background: isItemActive
                        ? `${itemColor}15`
                        : "transparent",
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
                        ...s.dropIconBox,
                        background: `${itemColor}20`,
                        border: `1px solid ${itemColor}40`,
                        boxShadow: isItemActive
                          ? `0 0 10px ${item.glow}`
                          : "none",
                        fontSize: "16px",
                      }}
                    >
                      {item.emoji}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isItemActive ? 700 : 600,
                          color: isItemActive ? itemColor : textActive,
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: text,
                          textAlign: "left",
                          marginTop: "2px",
                        }}
                      >
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ ...s.divider, background: border }} />

        {/* ── Right Actions ── */}
        <div style={s.actions}>
          <button
            onClick={toggleTheme}
            style={{ ...s.iconBtn, color: text, background: hoverBg }}
            title="Toggle Theme"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
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
};