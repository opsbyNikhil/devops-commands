// import React, { useState, useEffect } from "react";
// import { useTheme } from "../Themecontext";
// import { TABS, TabKey } from "./Header";

// const STATS = [
//   { value: "137", label: "Commands", suffix: "+" },
//   { value: "4", label: "Tools", suffix: "" },
//   { value: "100", label: "Copy-Ready", suffix: "%" },
//   { value: "0", label: "Setup Required", suffix: "" },
// ];

// const FEATURED_COMMANDS = [
//   {
//     tool: "docker",
//     color: "#0db7ed",
//     cmd: "docker compose up -d --build",
//     desc: "Start all services in background",
//   },
//   {
//     tool: "terraform",
//     color: "#7b42bc",
//     cmd: "terraform plan -out=tfplan",
//     desc: "Preview infrastructure changes",
//   },
//   {
//     tool: "kubernetes",
//     color: "#326ce5",
//     cmd: "kubectl rollout restart deploy/app",
//     desc: "Rolling restart deployment",
//   },
//   {
//     tool: "ansible",
//     color: "#e5361a",
//     cmd: "ansible-playbook site.yml --check",
//     desc: "Dry-run playbook execution",
//   },
// ];

// interface HomePageProps {
//   onNavigate: (tab: TabKey) => void;
// }

// const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
//   const { isDark } = useTheme();

//   const [visible, setVisible] = useState(false);
//   const [hoveredCard, setHoveredCard] = useState<TabKey | null>(null);
//   const [hoveredCmd, setHoveredCmd] = useState<number | null>(null);
//   const [copied, setCopied] = useState<number | null>(null);
//   const [termLine, setTermLine] = useState(0);

//   const termLines = [
//     "$ devops-cmd --version",
//     "DevOps CMD v1.0.0",
//     "$ devops-cmd --list-tools",
//     "→ docker       [43 commands]",
//     "→ terraform    [25 commands]",
//     "→ kubernetes   [38 commands]",
//     "→ ansible      [31 commands]",
//     "$ _",
//   ];

//   useEffect(() => {
//     const timeout = setTimeout(() => setVisible(true), 50);

//     const interval = setInterval(() => {
//       setTermLine((prev) => (prev < termLines.length - 1 ? prev + 1 : prev));
//     }, 320);

//     return () => {
//       clearTimeout(timeout);
//       clearInterval(interval);
//     };
//   }, [termLines.length]);

//   const handleCopy = (cmd: string, idx: number) => {
//     navigator.clipboard.writeText(cmd).then(() => {
//       setCopied(idx);
//       setTimeout(() => setCopied(null), 1500);
//     });
//   };

//   // ── Theme tokens ────────────────────────────────────────────────────────
//   const t = {
//     rootBg: isDark ? "#040a10" : "#f0f5f9",
//     rootColor: isDark ? "#c8dde8" : "#1a3040",
//     gridLine: isDark ? "rgba(13,183,237,0.03)" : "rgba(0,0,0,0.055)",
//     eyebrow: isDark ? "#0db7ed" : "#0882b0",
//     sectionLabel: isDark ? "#1e3545" : "#7a96a8",
//     sectionLabelLine: isDark ? "#0a1820" : "#d0dce8",
//     heroTitle: isDark ? "#fff" : "#0a1e2c",
//     heroSubtitle: isDark ? "#4a7a90" : "#3a5a70",
//     btnPrimaryBg: isDark ? "#0db7ed" : "#0882b0",
//     btnPrimaryColor: isDark ? "#040a10" : "#ffffff",
//     btnPrimaryHover: isDark ? "#57cbff" : "#0670a0",
//     btnGhostColor: isDark ? "#4a7a90" : "#3a6a88",
//     btnGhostBorder: isDark ? "#0e2030" : "#c0d4e0",
//     btnGhostHoverBg: isDark ? "#0db7ed0a" : "#0db7ed10",
//     termBg: isDark ? "#070d14" : "#f8fbfd",
//     termBorder: isDark ? "#0e1e2c" : "#cddbe8",
//     termBarBg: isDark ? "#050b11" : "#eaf2f8",
//     termBarBorder: isDark ? "#0e1e2c" : "#cddbe8",
//     termTitle: isDark ? "#1e3545" : "#7a96a8",
//     termCmd: isDark ? "#57cbff" : "#0670a0",
//     termOut: isDark ? "#4a7a90" : "#5a8a9a",
//     termArrow: isDark ? "#0db7ed" : "#0882b0",
//     termCursor: isDark ? "#0db7ed" : "#0882b0",
//     statsBg: isDark ? "#070d14" : "#ffffff",
//     statsDivider: isDark ? "#0a1820" : "#e0eaf2",
//     statVal: isDark ? "#0db7ed" : "#0882b0",
//     statSuffix: isDark ? "#57cbff80" : "#0db7ed60",
//     statLabel: isDark ? "#1e3545" : "#7a96a8",
//     cardBg: isDark ? "#070d14" : "#ffffff",
//     cardBorder: isDark ? "#0e1e2c" : "#d0dce8",
//     cardName: isDark ? "#c8dde8" : "#0a2030",
//     cardDesc: isDark ? "#2a4a5e" : "#4a6a80",
//     cardDescHov: isDark ? "#4a7a90" : "#2a5a78",
//     cardArrow: isDark ? "#1e3545" : "#7a96a8",
//     cmdRowBg: isDark ? "#070d14" : "#ffffff",
//     cmdRowBorder: isDark ? "#0e1e2c" : "#d0dce8",
//     cmdCode: isDark ? "#4a7a90" : "#3a5a70",
//     cmdCodeHov: isDark ? "#e8f4ff" : "#0a2030",
//     cmdDesc: isDark ? "#1e3545" : "#7a96a8",
//     cmdDescHov: isDark ? "#4a7a90" : "#3a6a88",
//     footerBorder: isDark ? "#0a1820" : "#d0dce8",
//     footerText: isDark ? "#0e1e2c" : "#9ab0c0",
//     footerDot: isDark ? "#0a1820" : "#ccdde8",
//   };

//   const css = `
//     @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

//     .hp-root {
//       min-height: 100vh;
//       width: 100%;
//       background: ${t.rootBg};
//       font-family: 'JetBrains Mono', monospace;
//       overflow-x: hidden;
//       color: ${t.rootColor};
//       transition: background 0.3s ease, color 0.3s ease;
//       box-sizing: border-box;
//     }

//     *, *::before, *::after {
//       box-sizing: border-box;
//     }

//     .hp-grid-bg {
//       position: fixed; inset: 0;
//       background-image:
//         linear-gradient(${t.gridLine} 1px, transparent 1px),
//         linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px);
//       background-size: 40px 40px;
//       pointer-events: none; z-index: 0;
//       transition: background-image 0.3s ease;
//     }

//     .hp-noise {
//       position: fixed; inset: 0; opacity: 0.018;
//       background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
//       pointer-events: none; z-index: 0;
//     }

//     .hp-content {
//       position: relative; z-index: 1;
//       max-width: 1100px; margin: 0 auto;
//       padding: 64px 32px 80px;
//       width: 100%;
//     }

//     /* ── Hero ── */
//     .hp-hero {
//       display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
//       align-items: center; margin-bottom: 80px;
//       opacity: 0; transform: translateY(24px);
//       transition: opacity 0.7s ease, transform 0.7s ease;
//     }
//     .hp-hero.visible { opacity: 1; transform: translateY(0); }

//     .hp-eyebrow {
//       font-size: 10px; letter-spacing: 4px; color: ${t.eyebrow};
//       font-weight: 700; margin-bottom: 16px;
//       display: flex; align-items: center; gap: 8px;
//     }
//     .hp-eyebrow::before {
//       content: ''; display: inline-block; width: 24px; height: 1px;
//       background: ${t.eyebrow};
//     }

//     .hp-title {
//       font-family: 'Rajdhani', sans-serif;
//       font-size: clamp(42px, 5vw, 64px); font-weight: 700;
//       line-height: 1.05; margin: 0 0 20px;
//       color: ${t.heroTitle}; letter-spacing: 1px;
//       transition: color 0.3s ease;
//     }
//     .hp-title span { color: ${isDark ? "#0db7ed" : "#0882b0"}; }

//     .hp-subtitle {
//       font-size: 13px; line-height: 1.8;
//       color: ${t.heroSubtitle}; max-width: 420px; margin-bottom: 32px;
//       transition: color 0.3s ease;
//     }

//     .hp-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }

//     .hp-btn-primary {
//       display: inline-flex; align-items: center; gap: 8px;
//       padding: 12px 24px; background: ${t.btnPrimaryBg};
//       color: ${t.btnPrimaryColor};
//       font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700;
//       letter-spacing: 2px; border: none; border-radius: 6px; cursor: pointer;
//       transition: all 0.2s ease;
//       box-shadow: 0 0 24px ${isDark ? "#0db7ed40" : "#0db7ed30"};
//     }
//     .hp-btn-primary:hover {
//       background: ${t.btnPrimaryHover};
//       box-shadow: 0 0 36px ${isDark ? "#0db7ed70" : "#0db7ed50"};
//       transform: translateY(-1px);
//     }

//     .hp-btn-ghost {
//       display: inline-flex; align-items: center; gap: 8px;
//       padding: 12px 24px; background: transparent;
//       color: ${t.btnGhostColor};
//       font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700;
//       letter-spacing: 2px; border: 1px solid ${t.btnGhostBorder};
//       border-radius: 6px; cursor: pointer; transition: all 0.2s ease;
//     }
//     .hp-btn-ghost:hover {
//       border-color: ${isDark ? "#0db7ed40" : "#0db7ed60"};
//       color: ${isDark ? "#0db7ed" : "#0882b0"};
//       background: ${t.btnGhostHoverBg};
//     }

//     /* ── Terminal ── */
//     .hp-terminal {
//       background: ${t.termBg}; border: 1px solid ${t.termBorder};
//       border-radius: 12px; overflow: hidden;
//       box-shadow: ${isDark ? "0 24px 60px #00000080, 0 0 0 1px #0db7ed10" : "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px #0db7ed15"};
//       transform: perspective(800px) rotateY(-4deg) rotateX(2deg);
//       transition: transform 0.4s ease, background 0.3s ease, border-color 0.3s ease;
//     }
//     .hp-terminal:hover { transform: perspective(800px) rotateY(0deg) rotateX(0deg); }

//     .hp-term-bar {
//       display: flex; align-items: center; gap: 6px;
//       padding: 10px 14px; background: ${t.termBarBg};
//       border-bottom: 1px solid ${t.termBarBorder};
//       transition: background 0.3s ease;
//     }
//     .hp-term-dot { width: 10px; height: 10px; border-radius: 50%; }
//     .hp-term-title { font-size: 10px; color: ${t.termTitle}; letter-spacing: 2px; margin-left: 8px; }

//     .hp-term-body { padding: 20px; min-height: 200px; font-size: 12px; line-height: 2; }
//     .hp-term-line { opacity: 0; animation: fadeIn 0.2s ease forwards; }
//     @keyframes fadeIn { to { opacity: 1; } }
//     .hp-term-line.cmd   { color: ${t.termCmd}; }
//     .hp-term-line.out   { color: ${t.termOut}; }
//     .hp-term-line.arrow { color: ${t.termArrow}; }
//     .hp-term-cursor {
//       display: inline-block; width: 8px; height: 14px;
//       background: ${t.termCursor}; animation: blink 1s step-end infinite;
//       vertical-align: middle; margin-left: 2px;
//     }
//     @keyframes blink { 50% { opacity: 0; } }

//     /* ── Stats ── */
//     .hp-stats {
//       display: grid; grid-template-columns: repeat(4, 1fr);
//       gap: 1px; background: ${t.statsDivider};
//       border: 1px solid ${t.statsDivider}; border-radius: 10px;
//       overflow: hidden; margin-bottom: 72px;
//       opacity: 0; transform: translateY(16px);
//       transition: opacity 0.6s 0.25s ease, transform 0.6s 0.25s ease, background 0.3s ease;
//     }
//     .hp-stats.visible { opacity: 1; transform: translateY(0); }

//     .hp-stat { background: ${t.statsBg}; padding: 28px 24px; text-align: center; transition: background 0.3s ease; }
//     .hp-stat-val {
//       font-family: 'Rajdhani', sans-serif; font-size: 40px; font-weight: 700;
//       color: ${t.statVal}; line-height: 1; transition: color 0.3s ease;
//     }
//     .hp-stat-suffix { font-size: 24px; color: ${t.statSuffix}; }
//     .hp-stat-label {
//       font-size: 10px; letter-spacing: 2px; color: ${t.statLabel};
//       margin-top: 6px; text-transform: uppercase; transition: color 0.3s ease;
//     }

//     /* ── Section label ── */
//     .hp-section-label {
//       font-size: 10px; letter-spacing: 4px; color: ${t.sectionLabel};
//       text-transform: uppercase; margin-bottom: 24px;
//       display: flex; align-items: center; gap: 12px;
//       transition: color 0.3s ease;
//     }
//     .hp-section-label::after {
//       content: ''; flex: 1; height: 1px; background: ${t.sectionLabelLine};
//     }

//     /* ── Cards ── */
//     .hp-cards {
//       display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
//       margin-bottom: 72px; opacity: 0; transform: translateY(16px);
//       transition: opacity 0.6s 0.4s ease, transform 0.6s 0.4s ease;
//     }
//     .hp-cards.visible { opacity: 1; transform: translateY(0); }

//     .hp-card {
//       position: relative; background: ${t.cardBg};
//       border: 1px solid ${t.cardBorder}; border-radius: 12px;
//       padding: 28px; cursor: pointer; transition: all 0.25s ease; overflow: hidden;
//     }
//     .hp-card:hover { transform: translateY(-3px); }

//     .hp-card-corner {
//       position: absolute; top: 0; right: 0;
//       width: 48px; height: 48px; border-bottom-left-radius: 12px;
//       display: flex; align-items: center; justify-content: center;
//       font-size: 18px; transition: all 0.3s ease;
//     }
//     .hp-card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
//     .hp-card-icon {
//       width: 44px; height: 44px; border-radius: 10px;
//       display: flex; align-items: center; justify-content: center;
//       font-size: 22px; flex-shrink: 0; transition: all 0.3s ease;
//     }
//     .hp-card-name {
//       font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700;
//       letter-spacing: 1px; margin-bottom: 4px; transition: color 0.2s ease;
//     }
//     .hp-card-count {
//       font-size: 10px; letter-spacing: 2px; padding: 2px 8px;
//       border-radius: 4px; display: inline-block;
//     }
//     .hp-card-desc {
//       font-size: 11px; line-height: 1.7; margin-bottom: 20px;
//       transition: color 0.3s ease;
//     }
//     .hp-card-arrow {
//       font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700;
//       letter-spacing: 2px; display: flex; align-items: center; gap: 6px;
//       transition: gap 0.2s ease;
//     }
//     .hp-card:hover .hp-card-arrow { gap: 10px; }

//     /* ── Featured commands ── */
//     .hp-cmds {
//       opacity: 0; transform: translateY(16px);
//       transition: opacity 0.6s 0.55s ease, transform 0.6s 0.55s ease;
//     }
//     .hp-cmds.visible { opacity: 1; transform: translateY(0); }

//     .hp-cmd-row {
//       display: flex; align-items: center; gap: 16px;
//       padding: 14px 20px; background: ${t.cmdRowBg};
//       border: 1px solid ${t.cmdRowBorder}; border-radius: 8px;
//       margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease;
//       position: relative; overflow: hidden;
//     }
//     .hp-cmd-row:hover { transform: translateX(4px); }
//     .hp-cmd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
//     .hp-cmd-code {
//       font-size: 12px; font-weight: 500; flex: 1; letter-spacing: 0.3px;
//       overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//       transition: color 0.2s ease;
//     }
//     .hp-cmd-desc {
//       font-size: 10px; color: ${t.cmdDesc}; white-space: nowrap;
//       flex-shrink: 0; transition: color 0.2s ease;
//     }
//     .hp-cmd-copy {
//       font-size: 10px; letter-spacing: 1px; padding: 3px 10px;
//       border-radius: 4px; border: 1px solid transparent;
//       background: transparent; cursor: pointer; flex-shrink: 0;
//       font-family: 'JetBrains Mono', monospace; transition: all 0.2s ease;
//     }

//     /* ── Footer ── */
//     .hp-footer {
//       margin-top: 72px; padding-top: 24px;
//       border-top: 1px solid ${t.footerBorder};
//       display: flex; align-items: center; justify-content: space-between;
//       transition: border-color 0.3s ease;
//     }
//     .hp-footer-text { font-size: 10px; color: ${t.footerText}; letter-spacing: 2px; transition: color 0.3s ease; }
//     .hp-footer-dots { display: flex; gap: 6px; }
//     .hp-footer-dot { width: 6px; height: 6px; border-radius: 50%; }

//     /* ── Mobile Responsive ── */
//     @media (max-width: 768px) {
//       .hp-root {
//         width: 100%;
//         min-width: 0;
//         overflow-x: hidden;
//       }

//       .hp-content {
//         padding: 36px 16px 56px;
//         width: 100%;
//       }

//       /* Hero */
//       .hp-hero {
//         grid-template-columns: 1fr;
//         gap: 0;
//         margin-bottom: 40px;
//       }

//       .hp-terminal {
//         display: none;
//       }

//       .hp-eyebrow {
//         font-size: 9px;
//         letter-spacing: 3px;
//         margin-bottom: 12px;
//       }

//       .hp-title {
//         font-size: clamp(32px, 9vw, 42px);
//         margin-bottom: 14px;
//       }

//       .hp-subtitle {
//         font-size: 12px;
//         line-height: 1.75;
//         max-width: 100%;
//         margin-bottom: 24px;
//       }

//       .hp-cta-row {
//         flex-direction: column;
//         gap: 10px;
//       }

//       .hp-btn-primary,
//       .hp-btn-ghost {
//         padding: 11px 20px;
//         font-size: 13px;
//         letter-spacing: 1.5px;
//         justify-content: center;
//         width: 100%;
//       }

//       /* Stats */
//       .hp-stats {
//         grid-template-columns: repeat(2, 1fr);
//         margin-bottom: 40px;
//       }

//       .hp-stat {
//         padding: 18px 12px;
//       }

//       .hp-stat-val {
//         font-size: 28px;
//       }

//       .hp-stat-suffix {
//         font-size: 18px;
//       }

//       .hp-stat-label {
//         font-size: 9px;
//         letter-spacing: 1px;
//         margin-top: 4px;
//       }

//       /* Section label */
//       .hp-section-label {
//         font-size: 9px;
//         letter-spacing: 3px;
//         margin-bottom: 16px;
//       }

//       /* Cards */
//       .hp-cards {
//         grid-template-columns: 1fr;
//         gap: 12px;
//         margin-bottom: 40px;
//       }

//       .hp-card {
//         padding: 18px 16px;
//         border-radius: 10px;
//       }

//       .hp-card-corner {
//         width: 40px;
//         height: 40px;
//         font-size: 15px;
//       }

//       .hp-card-header {
//         gap: 12px;
//         margin-bottom: 12px;
//       }

//       .hp-card-icon {
//         width: 38px;
//         height: 38px;
//         font-size: 18px;
//         border-radius: 8px;
//       }

//       .hp-card-name {
//         font-size: 17px;
//       }

//       .hp-card-count {
//         font-size: 9px;
//         padding: 2px 6px;
//       }

//       .hp-card-desc {
//         font-size: 11px;
//         margin-bottom: 14px;
//       }

//       .hp-card-arrow {
//         font-size: 11px;
//         letter-spacing: 1.5px;
//       }

//       /* Command rows */
//       .hp-cmds {
//         margin-bottom: 0;
//       }

//       .hp-cmd-row {
//         padding: 12px 12px 12px 16px;
//         gap: 8px;
//         flex-wrap: wrap;
//         border-radius: 8px;
//       }

//       .hp-cmd-row:hover {
//         transform: none;
//       }

//       .hp-cmd-dot {
//         width: 7px;
//         height: 7px;
//         flex-shrink: 0;
//       }

//       .hp-cmd-code {
//         font-size: 11px;
//         flex: 1;
//         min-width: 0;
//         white-space: nowrap;
//         overflow: hidden;
//         text-overflow: ellipsis;
//       }

//       .hp-cmd-desc {
//         font-size: 9px;
//         white-space: nowrap;
//         flex-shrink: 0;
//         display: none;
//       }

//       .hp-cmd-copy {
//         font-size: 9px;
//         padding: 3px 8px;
//         letter-spacing: 0.5px;
//         flex-shrink: 0;
//       }

//       /* Footer */
//       .hp-footer {
//         margin-top: 40px;
//         padding-top: 20px;
//         flex-direction: column;
//         align-items: flex-start;
//         gap: 12px;
//       }

//       .hp-footer-text {
//         font-size: 9px;
//         letter-spacing: 1.5px;
//       }
//     }

//     /* Extra small devices */
//     @media (max-width: 380px) {
//       .hp-content {
//         padding: 28px 12px 48px;
//       }

//       .hp-title {
//         font-size: 28px;
//       }

//       .hp-stat-val {
//         font-size: 24px;
//       }

//       .hp-stat-suffix {
//         font-size: 16px;
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{css}</style>

//       <div className="hp-root">
//         <div className="hp-grid-bg" />
//         <div className="hp-noise" />

//         <div className="hp-content">
//           {/* ── HERO ── */}
//           <section className={`hp-hero ${visible ? "visible" : ""}`}>
//             <div>
//               <div className="hp-eyebrow">DEVOPS CMD REFERENCE</div>
//               <h1 className="hp-title">
//                 Your DevOps
//                 <br />
//                 <span>Command</span>
//                 <br />
//                 Handbook
//               </h1>
//               <p className="hp-subtitle">
//                 DevOps CMD Reference is a complete DevOps command guide for
//                 Docker, Kubernetes, Terraform, Linux, AWS and Ansible.
//                 Copy-ready commands for DevOps engineers and cloud automation.
//               </p>
//               <div className="hp-cta-row">
//                 <button
//                   className="hp-btn-primary"
//                   onClick={() => onNavigate("docker")}
//                 >
//                   🐋 Browse Docker
//                 </button>
//                 <button
//                   className="hp-btn-ghost"
//                   onClick={() => onNavigate("terraform")}
//                 >
//                   🏗️ Explore Terraform
//                 </button>
//               </div>
//             </div>

//             {/* Terminal */}
//             <div className="hp-terminal">
//               <div className="hp-term-bar">
//                 <div
//                   className="hp-term-dot"
//                   style={{ background: "#ff5f57" }}
//                 />
//                 <div
//                   className="hp-term-dot"
//                   style={{ background: "#febc2e" }}
//                 />
//                 <div
//                   className="hp-term-dot"
//                   style={{ background: "#28c840" }}
//                 />
//                 <span className="hp-term-title">TERMINAL — devops-cmd</span>
//               </div>
//               <div className="hp-term-body">
//                 {termLines.slice(0, termLine + 1).map((line, i) => {
//                   const isCmd = line.startsWith("$");
//                   const isArrow = line.startsWith("→");
//                   const isLast = i === termLine && line === "$ _";
//                   return (
//                     <div
//                       key={i}
//                       className={`hp-term-line ${isCmd ? "cmd" : isArrow ? "arrow" : "out"}`}
//                       style={{ animationDelay: `${i * 0.05}s` }}
//                     >
//                       {isLast ? (
//                         <span>
//                           $ <span className="hp-term-cursor" />
//                         </span>
//                       ) : (
//                         line
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </section>

//           {/* ── STATS ── */}
//           <div className={`hp-stats ${visible ? "visible" : ""}`}>
//             {STATS.map((s) => (
//               <div key={s.label} className="hp-stat">
//                 <div className="hp-stat-val">
//                   {s.value}
//                   <span className="hp-stat-suffix">{s.suffix}</span>
//                 </div>
//                 <div className="hp-stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* ── TOOL CARDS ── */}
//           <div className="hp-section-label">TOOLS</div>
//           <div className={`hp-cards ${visible ? "visible" : ""}`}>
//             {TABS.map((tab) => {
//               const isHov = hoveredCard === tab.key;
//               return (
//                 <div
//                   key={tab.key}
//                   className="hp-card"
//                   onClick={() => onNavigate(tab.key)}
//                   onMouseEnter={() => setHoveredCard(tab.key)}
//                   onMouseLeave={() => setHoveredCard(null)}
//                   style={{
//                     borderColor: isHov ? `${tab.color}40` : t.cardBorder,
//                     boxShadow: isHov
//                       ? `0 8px 32px ${tab.glow}, inset 0 0 40px ${tab.color}06`
//                       : "none",
//                   }}
//                 >
//                   <div
//                     className="hp-card-corner"
//                     style={{
//                       background: isHov ? `${tab.color}15` : `${tab.color}08`,
//                       borderLeft: `1px solid ${isHov ? tab.color + "30" : tab.color + "10"}`,
//                       borderBottom: `1px solid ${isHov ? tab.color + "30" : tab.color + "10"}`,
//                     }}
//                   >
//                     {tab.emoji}
//                   </div>

//                   <div className="hp-card-header">
//                     <div
//                       className="hp-card-icon"
//                       style={{
//                         background: `${tab.color}15`,
//                         border: `1px solid ${tab.color}30`,
//                         boxShadow: isHov ? `0 0 16px ${tab.glow}` : "none",
//                         fontSize: isHov ? "26px" : "22px",
//                       }}
//                     >
//                       {tab.emoji}
//                     </div>
//                     <div>
//                       <div
//                         className="hp-card-name"
//                         style={{ color: isHov ? tab.accent : t.cardName }}
//                       >
//                         {tab.label}
//                       </div>
//                       <span
//                         className="hp-card-count"
//                         style={{
//                           background: `${tab.color}15`,
//                           color: tab.accent,
//                           border: `1px solid ${tab.color}25`,
//                         }}
//                       >
//                         {tab.commandCount} commands
//                       </span>
//                     </div>
//                   </div>

//                   <p
//                     className="hp-card-desc"
//                     style={{ color: isHov ? t.cardDescHov : t.cardDesc }}
//                   >
//                     {tab.description}
//                   </p>

//                   <div
//                     className="hp-card-arrow"
//                     style={{ color: isHov ? tab.accent : t.cardArrow }}
//                   >
//                     EXPLORE COMMANDS <span>→</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ── FEATURED COMMANDS ── */}
//           <div className={`hp-cmds ${visible ? "visible" : ""}`}>
//             <div className="hp-section-label">QUICK PICKS</div>
//             {FEATURED_COMMANDS.map((fc, idx) => {
//               const isHov = hoveredCmd === idx;
//               return (
//                 <div
//                   key={idx}
//                   className="hp-cmd-row"
//                   onMouseEnter={() => setHoveredCmd(idx)}
//                   onMouseLeave={() => setHoveredCmd(null)}
//                   style={{
//                     borderColor: isHov ? `${fc.color}30` : t.cmdRowBorder,
//                     background: isHov ? `${fc.color}06` : t.cmdRowBg,
//                   }}
//                 >
//                   {/* Left accent bar */}
//                   <div
//                     style={{
//                       position: "absolute",
//                       left: 0,
//                       top: 0,
//                       bottom: 0,
//                       width: 3,
//                       background: fc.color,
//                       opacity: isHov ? 1 : 0.2,
//                       borderRadius: "2px 0 0 2px",
//                     }}
//                   />
//                   <div
//                     className="hp-cmd-dot"
//                     style={{
//                       background: fc.color,
//                       boxShadow: isHov ? `0 0 8px ${fc.color}` : "none",
//                     }}
//                   />
//                   <code
//                     className="hp-cmd-code"
//                     style={{ color: isHov ? t.cmdCodeHov : t.cmdCode }}
//                   >
//                     {fc.cmd}
//                   </code>
//                   <span
//                     className="hp-cmd-desc"
//                     style={{ color: isHov ? t.cmdDescHov : t.cmdDesc }}
//                   >
//                     {fc.desc}
//                   </span>
//                   <button
//                     className="hp-cmd-copy"
//                     onClick={() => handleCopy(fc.cmd, idx)}
//                     style={{
//                       color: copied === idx ? "#28c840" : fc.color,
//                       borderColor:
//                         copied === idx ? "#28c84040" : `${fc.color}30`,
//                       background:
//                         copied === idx ? "#28c84010" : `${fc.color}10`,
//                     }}
//                   >
//                     {copied === idx ? "✓ COPIED" : "COPY"}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ── FOOTER ── */}
//           <div className="hp-footer">
//             <span className="hp-footer-text">
//               DEVOPS CMD © 2025 — ALL RIGHTS RESERVED
//             </span>
//             <div className="hp-footer-dots">
//               {TABS.map((tab) => (
//                 <div
//                   key={tab.key}
//                   className="hp-footer-dot"
//                   style={{ background: tab.color + "60" }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HomePage;
import React, { useState, useEffect } from "react";
import { useTheme } from "../Themecontext";
import { TABS, TabKey } from "./Header";

const STATS = [
  { value: "137", label: "Commands", suffix: "+" },
  { value: "4", label: "Tools", suffix: "" },
  { value: "100", label: "Copy-Ready", suffix: "%" },
  { value: "0", label: "Setup Required", suffix: "" },
];

const FEATURED_COMMANDS = [
  {
    tool: "docker",
    color: "#0db7ed",
    cmd: "docker compose up -d --build",
    desc: "Start all services in background",
  },
  {
    tool: "terraform",
    color: "#7b42bc",
    cmd: "terraform plan -out=tfplan",
    desc: "Preview infrastructure changes",
  },
  {
    tool: "kubernetes",
    color: "#326ce5",
    cmd: "kubectl rollout restart deploy/app",
    desc: "Rolling restart deployment",
  },
  {
    tool: "ansible",
    color: "#e5361a",
    cmd: "ansible-playbook site.yml --check",
    desc: "Dry-run playbook execution",
  },
];

interface HomePageProps {
  onNavigate: (tab: TabKey) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isDark } = useTheme();

  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<TabKey | null>(null);
  const [hoveredCmd, setHoveredCmd] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [termLine, setTermLine] = useState(0);

  const termLines = [
    "$ devops-cmd --version",
    "DevOps CMD v1.0.0",
    "$ devops-cmd --list-tools",
    "→ docker       [43 commands]",
    "→ terraform    [25 commands]",
    "→ kubernetes   [38 commands]",
    "→ ansible      [31 commands]",
    "$ _",
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);

    const interval = setInterval(() => {
      setTermLine((prev) => (prev < termLines.length - 1 ? prev + 1 : prev));
    }, 320);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [termLines.length]);

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  // ── Theme tokens ────────────────────────────────────────────────────────
  const t = {
    rootBg: isDark ? "#040a10" : "#f0f5f9",
    rootColor: isDark ? "#c8dde8" : "#1a3040",
    gridLine: isDark ? "rgba(13,183,237,0.03)" : "rgba(0,0,0,0.055)",
    eyebrow: isDark ? "#0db7ed" : "#0882b0",
    sectionLabel: isDark ? "#1e3545" : "#7a96a8",
    sectionLabelLine: isDark ? "#0a1820" : "#d0dce8",
    heroTitle: isDark ? "#fff" : "#0a1e2c",
    heroSubtitle: isDark ? "#4a7a90" : "#3a5a70",
    btnPrimaryBg: isDark ? "#0db7ed" : "#0882b0",
    btnPrimaryColor: isDark ? "#040a10" : "#ffffff",
    btnPrimaryHover: isDark ? "#57cbff" : "#0670a0",
    btnGhostColor: isDark ? "#4a7a90" : "#3a6a88",
    btnGhostBorder: isDark ? "#0e2030" : "#c0d4e0",
    btnGhostHoverBg: isDark ? "#0db7ed0a" : "#0db7ed10",
    termBg: isDark ? "#070d14" : "#f8fbfd",
    termBorder: isDark ? "#0e1e2c" : "#cddbe8",
    termBarBg: isDark ? "#050b11" : "#eaf2f8",
    termBarBorder: isDark ? "#0e1e2c" : "#cddbe8",
    termTitle: isDark ? "#1e3545" : "#7a96a8",
    termCmd: isDark ? "#57cbff" : "#0670a0",
    termOut: isDark ? "#4a7a90" : "#5a8a9a",
    termArrow: isDark ? "#0db7ed" : "#0882b0",
    termCursor: isDark ? "#0db7ed" : "#0882b0",
    statsBg: isDark ? "#070d14" : "#ffffff",
    statsDivider: isDark ? "#0a1820" : "#e0eaf2",
    statVal: isDark ? "#0db7ed" : "#0882b0",
    statSuffix: isDark ? "#57cbff80" : "#0db7ed60",
    statLabel: isDark ? "#1e3545" : "#7a96a8",
    cardBg: isDark ? "#070d14" : "#ffffff",
    cardBorder: isDark ? "#0e1e2c" : "#d0dce8",
    cardName: isDark ? "#c8dde8" : "#0a2030",
    cardDesc: isDark ? "#2a4a5e" : "#4a6a80",
    cardDescHov: isDark ? "#4a7a90" : "#2a5a78",
    cardArrow: isDark ? "#1e3545" : "#7a96a8",
    cmdRowBg: isDark ? "#070d14" : "#ffffff",
    cmdRowBorder: isDark ? "#0e1e2c" : "#d0dce8",
    cmdCode: isDark ? "#4a7a90" : "#3a5a70",
    cmdCodeHov: isDark ? "#e8f4ff" : "#0a2030",
    cmdDesc: isDark ? "#1e3545" : "#7a96a8",
    cmdDescHov: isDark ? "#4a7a90" : "#3a6a88",
    footerBorder: isDark ? "#0a1820" : "#d0dce8",
    footerText: isDark ? "#0e1e2c" : "#9ab0c0",
    footerDot: isDark ? "#0a1820" : "#ccdde8",
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

    .hp-root {
      min-height: 100vh;
      width: 100%;
      background: ${t.rootBg};
      font-family: 'JetBrains Mono', monospace;
      overflow-x: hidden;
      color: ${t.rootColor};
      transition: background 0.3s ease, color 0.3s ease;
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .hp-grid-bg {
      position: fixed; inset: 0;
      background-image:
        linear-gradient(${t.gridLine} 1px, transparent 1px),
        linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none; z-index: 0;
      transition: background-image 0.3s ease;
    }

    .hp-noise {
      position: fixed; inset: 0; opacity: 0.018;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 0;
    }

    .hp-content {
      position: relative; z-index: 1;
      max-width: 1100px; margin: 0 auto;
      /* INCREASED TOP PADDING FROM 64px to 140px to clear the floating navbar */
      padding: 140px 32px 80px; 
      width: 100%;
    }

    /* ── Hero ── */
    .hp-hero {
      display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
      align-items: center; margin-bottom: 80px;
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .hp-hero.visible { opacity: 1; transform: translateY(0); }

    .hp-eyebrow {
      font-size: 10px; letter-spacing: 4px; color: ${t.eyebrow};
      font-weight: 700; margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }
    .hp-eyebrow::before {
      content: ''; display: inline-block; width: 24px; height: 1px;
      background: ${t.eyebrow};
    }

    .hp-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: clamp(42px, 5vw, 64px); font-weight: 700;
      line-height: 1.05; margin: 0 0 20px;
      color: ${t.heroTitle}; letter-spacing: 1px;
      transition: color 0.3s ease;
    }
    .hp-title span { color: ${isDark ? "#0db7ed" : "#0882b0"}; }

    .hp-subtitle {
      font-size: 13px; line-height: 1.8;
      color: ${t.heroSubtitle}; max-width: 420px; margin-bottom: 32px;
      transition: color 0.3s ease;
    }

    .hp-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }

    .hp-btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; background: ${t.btnPrimaryBg};
      color: ${t.btnPrimaryColor};
      font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700;
      letter-spacing: 2px; border: none; border-radius: 6px; cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 0 24px ${isDark ? "#0db7ed40" : "#0db7ed30"};
    }
    .hp-btn-primary:hover {
      background: ${t.btnPrimaryHover};
      box-shadow: 0 0 36px ${isDark ? "#0db7ed70" : "#0db7ed50"};
      transform: translateY(-1px);
    }

    .hp-btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 24px; background: transparent;
      color: ${t.btnGhostColor};
      font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700;
      letter-spacing: 2px; border: 1px solid ${t.btnGhostBorder};
      border-radius: 6px; cursor: pointer; transition: all 0.2s ease;
    }
    .hp-btn-ghost:hover {
      border-color: ${isDark ? "#0db7ed40" : "#0db7ed60"};
      color: ${isDark ? "#0db7ed" : "#0882b0"};
      background: ${t.btnGhostHoverBg};
    }

    /* ── Terminal ── */
    .hp-terminal {
      background: ${t.termBg}; border: 1px solid ${t.termBorder};
      border-radius: 12px; overflow: hidden;
      box-shadow: ${isDark ? "0 24px 60px #00000080, 0 0 0 1px #0db7ed10" : "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px #0db7ed15"};
      transform: perspective(800px) rotateY(-4deg) rotateX(2deg);
      transition: transform 0.4s ease, background 0.3s ease, border-color 0.3s ease;
    }
    .hp-terminal:hover { transform: perspective(800px) rotateY(0deg) rotateX(0deg); }

    .hp-term-bar {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 14px; background: ${t.termBarBg};
      border-bottom: 1px solid ${t.termBarBorder};
      transition: background 0.3s ease;
    }
    .hp-term-dot { width: 10px; height: 10px; border-radius: 50%; }
    .hp-term-title { font-size: 10px; color: ${t.termTitle}; letter-spacing: 2px; margin-left: 8px; }

    .hp-term-body { padding: 20px; min-height: 200px; font-size: 12px; line-height: 2; }
    .hp-term-line { opacity: 0; animation: fadeIn 0.2s ease forwards; }
    @keyframes fadeIn { to { opacity: 1; } }
    .hp-term-line.cmd   { color: ${t.termCmd}; }
    .hp-term-line.out   { color: ${t.termOut}; }
    .hp-term-line.arrow { color: ${t.termArrow}; }
    .hp-term-cursor {
      display: inline-block; width: 8px; height: 14px;
      background: ${t.termCursor}; animation: blink 1s step-end infinite;
      vertical-align: middle; margin-left: 2px;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* ── Stats ── */
    .hp-stats {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 1px; background: ${t.statsDivider};
      border: 1px solid ${t.statsDivider}; border-radius: 10px;
      overflow: hidden; margin-bottom: 72px;
      opacity: 0; transform: translateY(16px);
      transition: opacity 0.6s 0.25s ease, transform 0.6s 0.25s ease, background 0.3s ease;
    }
    .hp-stats.visible { opacity: 1; transform: translateY(0); }

    .hp-stat { background: ${t.statsBg}; padding: 28px 24px; text-align: center; transition: background 0.3s ease; }
    .hp-stat-val {
      font-family: 'Rajdhani', sans-serif; font-size: 40px; font-weight: 700;
      color: ${t.statVal}; line-height: 1; transition: color 0.3s ease;
    }
    .hp-stat-suffix { font-size: 24px; color: ${t.statSuffix}; }
    .hp-stat-label {
      font-size: 10px; letter-spacing: 2px; color: ${t.statLabel};
      margin-top: 6px; text-transform: uppercase; transition: color 0.3s ease;
    }

    /* ── Section label ── */
    .hp-section-label {
      font-size: 10px; letter-spacing: 4px; color: ${t.sectionLabel};
      text-transform: uppercase; margin-bottom: 24px;
      display: flex; align-items: center; gap: 12px;
      transition: color 0.3s ease;
    }
    .hp-section-label::after {
      content: ''; flex: 1; height: 1px; background: ${t.sectionLabelLine};
    }

    /* ── Cards ── */
    .hp-cards {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
      margin-bottom: 72px; opacity: 0; transform: translateY(16px);
      transition: opacity 0.6s 0.4s ease, transform 0.6s 0.4s ease;
    }
    .hp-cards.visible { opacity: 1; transform: translateY(0); }

    .hp-card {
      position: relative; background: ${t.cardBg};
      border: 1px solid ${t.cardBorder}; border-radius: 12px;
      padding: 28px; cursor: pointer; transition: all 0.25s ease; overflow: hidden;
    }
    .hp-card:hover { transform: translateY(-3px); }

    .hp-card-corner {
      position: absolute; top: 0; right: 0;
      width: 48px; height: 48px; border-bottom-left-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; transition: all 0.3s ease;
    }
    .hp-card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
    .hp-card-icon {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0; transition: all 0.3s ease;
    }
    .hp-card-name {
      font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700;
      letter-spacing: 1px; margin-bottom: 4px; transition: color 0.2s ease;
    }
    .hp-card-count {
      font-size: 10px; letter-spacing: 2px; padding: 2px 8px;
      border-radius: 4px; display: inline-block;
    }
    .hp-card-desc {
      font-size: 11px; line-height: 1.7; margin-bottom: 20px;
      transition: color 0.3s ease;
    }
    .hp-card-arrow {
      font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700;
      letter-spacing: 2px; display: flex; align-items: center; gap: 6px;
      transition: gap 0.2s ease;
    }
    .hp-card:hover .hp-card-arrow { gap: 10px; }

    /* ── Featured commands ── */
    .hp-cmds {
      opacity: 0; transform: translateY(16px);
      transition: opacity 0.6s 0.55s ease, transform 0.6s 0.55s ease;
    }
    .hp-cmds.visible { opacity: 1; transform: translateY(0); }

    .hp-cmd-row {
      display: flex; align-items: center; gap: 16px;
      padding: 14px 20px; background: ${t.cmdRowBg};
      border: 1px solid ${t.cmdRowBorder}; border-radius: 8px;
      margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease;
      position: relative; overflow: hidden;
    }
    .hp-cmd-row:hover { transform: translateX(4px); }
    .hp-cmd-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .hp-cmd-code {
      font-size: 12px; font-weight: 500; flex: 1; letter-spacing: 0.3px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      transition: color 0.2s ease;
    }
    .hp-cmd-desc {
      font-size: 10px; color: ${t.cmdDesc}; white-space: nowrap;
      flex-shrink: 0; transition: color 0.2s ease;
    }
    .hp-cmd-copy {
      font-size: 10px; letter-spacing: 1px; padding: 3px 10px;
      border-radius: 4px; border: 1px solid transparent;
      background: transparent; cursor: pointer; flex-shrink: 0;
      font-family: 'JetBrains Mono', monospace; transition: all 0.2s ease;
    }

    /* ── Footer ── */
    .hp-footer {
      margin-top: 72px; padding-top: 24px;
      border-top: 1px solid ${t.footerBorder};
      display: flex; align-items: center; justify-content: space-between;
      transition: border-color 0.3s ease;
    }
    .hp-footer-text { font-size: 10px; color: ${t.footerText}; letter-spacing: 2px; transition: color 0.3s ease; }
    .hp-footer-dots { display: flex; gap: 6px; }
    .hp-footer-dot { width: 6px; height: 6px; border-radius: 50%; }

    /* ── Mobile Responsive ── */
    @media (max-width: 768px) {
      .hp-root {
        width: 100%;
        min-width: 0;
        overflow-x: hidden;
      }

      .hp-content {
        /* INCREASED TOP PADDING FOR MOBILE */
        padding: 100px 16px 56px;
        width: 100%;
      }

      /* Hero */
      .hp-hero {
        grid-template-columns: 1fr;
        gap: 0;
        margin-bottom: 40px;
      }

      .hp-terminal {
        display: none;
      }

      .hp-eyebrow {
        font-size: 9px;
        letter-spacing: 3px;
        margin-bottom: 12px;
      }

      .hp-title {
        font-size: clamp(32px, 9vw, 42px);
        margin-bottom: 14px;
      }

      .hp-subtitle {
        font-size: 12px;
        line-height: 1.75;
        max-width: 100%;
        margin-bottom: 24px;
      }

      .hp-cta-row {
        flex-direction: column;
        gap: 10px;
      }

      .hp-btn-primary,
      .hp-btn-ghost {
        padding: 11px 20px;
        font-size: 13px;
        letter-spacing: 1.5px;
        justify-content: center;
        width: 100%;
      }

      /* Stats */
      .hp-stats {
        grid-template-columns: repeat(2, 1fr);
        margin-bottom: 40px;
      }

      .hp-stat {
        padding: 18px 12px;
      }

      .hp-stat-val {
        font-size: 28px;
      }

      .hp-stat-suffix {
        font-size: 18px;
      }

      .hp-stat-label {
        font-size: 9px;
        letter-spacing: 1px;
        margin-top: 4px;
      }

      /* Section label */
      .hp-section-label {
        font-size: 9px;
        letter-spacing: 3px;
        margin-bottom: 16px;
      }

      /* Cards */
      .hp-cards {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 40px;
      }

      .hp-card {
        padding: 18px 16px;
        border-radius: 10px;
      }

      .hp-card-corner {
        width: 40px;
        height: 40px;
        font-size: 15px;
      }

      .hp-card-header {
        gap: 12px;
        margin-bottom: 12px;
      }

      .hp-card-icon {
        width: 38px;
        height: 38px;
        font-size: 18px;
        border-radius: 8px;
      }

      .hp-card-name {
        font-size: 17px;
      }

      .hp-card-count {
        font-size: 9px;
        padding: 2px 6px;
      }

      .hp-card-desc {
        font-size: 11px;
        margin-bottom: 14px;
      }

      .hp-card-arrow {
        font-size: 11px;
        letter-spacing: 1.5px;
      }

      /* Command rows */
      .hp-cmds {
        margin-bottom: 0;
      }

      .hp-cmd-row {
        padding: 12px 12px 12px 16px;
        gap: 8px;
        flex-wrap: wrap;
        border-radius: 8px;
      }

      .hp-cmd-row:hover {
        transform: none;
      }

      .hp-cmd-dot {
        width: 7px;
        height: 7px;
        flex-shrink: 0;
      }

      .hp-cmd-code {
        font-size: 11px;
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hp-cmd-desc {
        font-size: 9px;
        white-space: nowrap;
        flex-shrink: 0;
        display: none;
      }

      .hp-cmd-copy {
        font-size: 9px;
        padding: 3px 8px;
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }

      /* Footer */
      .hp-footer {
        margin-top: 40px;
        padding-top: 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .hp-footer-text {
        font-size: 9px;
        letter-spacing: 1.5px;
      }
    }

    /* Extra small devices */
    @media (max-width: 380px) {
      .hp-content {
        /* INCREASED TOP PADDING FOR EXTRA SMALL */
        padding: 90px 12px 48px;
      }

      .hp-title {
        font-size: 28px;
      }

      .hp-stat-val {
        font-size: 24px;
      }

      .hp-stat-suffix {
        font-size: 16px;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>

      <div className="hp-root">
        <div className="hp-grid-bg" />
        <div className="hp-noise" />

        <div className="hp-content">
          {/* ── HERO ── */}
          <section className={`hp-hero ${visible ? "visible" : ""}`}>
            <div>
              <div className="hp-eyebrow">DEVOPS CMD REFERENCE</div>
              <h1 className="hp-title">
                Your DevOps
                <br />
                <span>Command</span>
                <br />
                Handbook
              </h1>
              <p className="hp-subtitle">
                DevOps CMD Reference is a complete DevOps command guide for
                Docker, Kubernetes, Terraform, Linux, AWS and Ansible.
                Copy-ready commands for DevOps engineers and cloud automation.
              </p>
              <div className="hp-cta-row">
                <button
                  className="hp-btn-primary"
                  onClick={() => onNavigate("docker")}
                >
                  🐋 Browse Docker
                </button>
                <button
                  className="hp-btn-ghost"
                  onClick={() => onNavigate("terraform")}
                >
                  🏗️ Explore Terraform
                </button>
              </div>
            </div>

            {/* Terminal */}
            <div className="hp-terminal">
              <div className="hp-term-bar">
                <div
                  className="hp-term-dot"
                  style={{ background: "#ff5f57" }}
                />
                <div
                  className="hp-term-dot"
                  style={{ background: "#febc2e" }}
                />
                <div
                  className="hp-term-dot"
                  style={{ background: "#28c840" }}
                />
                <span className="hp-term-title">TERMINAL — devops-cmd</span>
              </div>
              <div className="hp-term-body">
                {termLines.slice(0, termLine + 1).map((line, i) => {
                  const isCmd = line.startsWith("$");
                  const isArrow = line.startsWith("→");
                  const isLast = i === termLine && line === "$ _";
                  return (
                    <div
                      key={i}
                      className={`hp-term-line ${isCmd ? "cmd" : isArrow ? "arrow" : "out"}`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {isLast ? (
                        <span>
                          $ <span className="hp-term-cursor" />
                        </span>
                      ) : (
                        line
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── STATS ── */}
          <div className={`hp-stats ${visible ? "visible" : ""}`}>
            {STATS.map((s) => (
              <div key={s.label} className="hp-stat">
                <div className="hp-stat-val">
                  {s.value}
                  <span className="hp-stat-suffix">{s.suffix}</span>
                </div>
                <div className="hp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── TOOL CARDS ── */}
          <div className="hp-section-label">TOOLS</div>
          <div className={`hp-cards ${visible ? "visible" : ""}`}>
            {TABS.map((tab) => {
              const isHov = hoveredCard === tab.key;
              return (
                <div
                  key={tab.key}
                  className="hp-card"
                  onClick={() => onNavigate(tab.key)}
                  onMouseEnter={() => setHoveredCard(tab.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    borderColor: isHov ? `${tab.color}40` : t.cardBorder,
                    boxShadow: isHov
                      ? `0 8px 32px ${tab.glow}, inset 0 0 40px ${tab.color}06`
                      : "none",
                  }}
                >
                  <div
                    className="hp-card-corner"
                    style={{
                      background: isHov ? `${tab.color}15` : `${tab.color}08`,
                      borderLeft: `1px solid ${isHov ? tab.color + "30" : tab.color + "10"}`,
                      borderBottom: `1px solid ${isHov ? tab.color + "30" : tab.color + "10"}`,
                    }}
                  >
                    {tab.emoji}
                  </div>

                  <div className="hp-card-header">
                    <div
                      className="hp-card-icon"
                      style={{
                        background: `${tab.color}15`,
                        border: `1px solid ${tab.color}30`,
                        boxShadow: isHov ? `0 0 16px ${tab.glow}` : "none",
                        fontSize: isHov ? "26px" : "22px",
                      }}
                    >
                      {tab.emoji}
                    </div>
                    <div>
                      <div
                        className="hp-card-name"
                        style={{ color: isHov ? tab.accent : t.cardName }}
                      >
                        {tab.label}
                      </div>
                      <span
                        className="hp-card-count"
                        style={{
                          background: `${tab.color}15`,
                          color: tab.accent,
                          border: `1px solid ${tab.color}25`,
                        }}
                      >
                        {tab.commandCount} commands
                      </span>
                    </div>
                  </div>

                  <p
                    className="hp-card-desc"
                    style={{ color: isHov ? t.cardDescHov : t.cardDesc }}
                  >
                    {tab.description}
                  </p>

                  <div
                    className="hp-card-arrow"
                    style={{ color: isHov ? tab.accent : t.cardArrow }}
                  >
                    EXPLORE COMMANDS <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── FEATURED COMMANDS ── */}
          <div className={`hp-cmds ${visible ? "visible" : ""}`}>
            <div className="hp-section-label">QUICK PICKS</div>
            {FEATURED_COMMANDS.map((fc, idx) => {
              const isHov = hoveredCmd === idx;
              return (
                <div
                  key={idx}
                  className="hp-cmd-row"
                  onMouseEnter={() => setHoveredCmd(idx)}
                  onMouseLeave={() => setHoveredCmd(null)}
                  style={{
                    borderColor: isHov ? `${fc.color}30` : t.cmdRowBorder,
                    background: isHov ? `${fc.color}06` : t.cmdRowBg,
                  }}
                >
                  {/* Left accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: fc.color,
                      opacity: isHov ? 1 : 0.2,
                      borderRadius: "2px 0 0 2px",
                    }}
                  />
                  <div
                    className="hp-cmd-dot"
                    style={{
                      background: fc.color,
                      boxShadow: isHov ? `0 0 8px ${fc.color}` : "none",
                    }}
                  />
                  <code
                    className="hp-cmd-code"
                    style={{ color: isHov ? t.cmdCodeHov : t.cmdCode }}
                  >
                    {fc.cmd}
                  </code>
                  <span
                    className="hp-cmd-desc"
                    style={{ color: isHov ? t.cmdDescHov : t.cmdDesc }}
                  >
                    {fc.desc}
                  </span>
                  <button
                    className="hp-cmd-copy"
                    onClick={() => handleCopy(fc.cmd, idx)}
                    style={{
                      color: copied === idx ? "#28c840" : fc.color,
                      borderColor:
                        copied === idx ? "#28c84040" : `${fc.color}30`,
                      background:
                        copied === idx ? "#28c84010" : `${fc.color}10`,
                    }}
                  >
                    {copied === idx ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── FOOTER ── */}
          <div className="hp-footer">
            <span className="hp-footer-text">
              DEVOPS CMD © 2025 — ALL RIGHTS RESERVED
            </span>
            <div className="hp-footer-dots">
              {TABS.map((tab) => (
                <div
                  key={tab.key}
                  className="hp-footer-dot"
                  style={{ background: tab.color + "60" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;