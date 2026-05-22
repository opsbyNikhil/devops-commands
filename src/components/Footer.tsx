import React from "react";
import { TABS, TabKey } from "./Header";
import { useTheme } from "../Themecontext";
import { githubCommands } from "../pages/Git";
import { dockerCommands } from "../pages/Docker";
import { terraformCommands } from "../pages/Terraform";
import { Kubernates } from "../pages/Kubernetes";
import { Ansible } from "../pages/Ansible";
import { linuxCommands } from "../pages/Linux";
import { JenkinsPipelines } from "../pages/pipelines/jenkins";

interface FooterProps {
  activeTab: TabKey;
}

const commandCounts: Record<TabKey, number> = {
  linux: linuxCommands.length,
  github: githubCommands.length,
  docker: dockerCommands.length,
  terraform: terraformCommands.length,
  kubernetes: Kubernates.length,
  ansible: Ansible.length,
  jenkins: JenkinsPipelines.length,
  "azure-devops": 0,
  "github-actions": 0,
};

const Footer: React.FC<FooterProps> = ({ activeTab }) => {
  const active = TABS.find((t) => t.key === activeTab)!;
  const { isDark, toggleTheme } = useTheme();

  // ── Semantic token maps ─────────────────────────────────────────────────────
  const tokens = {
    // Backgrounds
    rootBg: isDark ? "#04080e" : "#f0f4f8",
    innerBg: isDark ? "#060d16" : "#ffffff",
    statBg: isDark ? "#060d16" : "#f8fafc",
    statHoverBg: isDark ? "#080f1a" : "#eef2f7",
    chipActiveBg: (color: string) => color + (isDark ? "18" : "22"),
    chipIdleBg: isDark ? "#060d16" : "#f0f4f8",
    toolCountActiveBg: (color: string) => color + (isDark ? "18" : "22"),
    toolCountIdleBg: isDark ? "#060d16" : "#edf2f7",

    // Borders
    borderRoot: isDark ? "#0c1a24" : "#dde4ed",
    borderStat: isDark ? "#0c1a24" : "#dde4ed",
    borderStatHover: isDark ? "#1a3040" : "#b8c8d8",
    chipActiveBorder: (color: string) => color + (isDark ? "44" : "55"),
    chipIdleBorder: isDark ? "#0c1a24" : "#dde4ed",
    toolCountActiveBorder: (color: string) => color + (isDark ? "44" : "55"),
    toolCountIdleBorder: isDark ? "#0c1a24" : "#dde4ed",
    badgeActiveBorder: (color: string) => color + (isDark ? "44" : "55"),
    badgeIdleBorder: isDark ? "#0e1e2c" : "#d0dae6",

    // Text
    logoName: isDark ? "#ffffff" : "#0d1f2d",
    tagline: isDark ? "#1e3a4a" : "#6b8599",
    statLabel: isDark ? "#1e3040" : "#7a96a8",
    linksTitle: isDark ? "#1e3040" : "#7a96a8",
    linkIdle: isDark ? "#2a4050" : "#5a7a8a",
    linkHover: isDark ? "#a0c0d0" : "#0d3d5a",
    chipIdleText: isDark ? "#1e3040" : "#6b8599",
    bottomLeft: isDark ? "#162530" : "#7a96a8",
    bottomRight: isDark ? "#0f2030" : "#8a9fb0",
    divider: isDark ? "#0f2030" : "#c8d8e4",
    toolCountIdleText: isDark ? "#2a4050" : "#6b8599",
    badgeIdleText: isDark ? "#1e3040" : "#7a96a8",
    badgeActiveBg: (color: string) => color + (isDark ? "20" : "25"),
    badgeIdleBg: isDark ? "#0a1820" : "#edf2f7",

    // Grid
    gridLine: isDark ? "#ffffff05" : "#00000008",

    // Toggle button
    toggleBg: isDark ? "#0c1a24" : "#e2ecf4",
    toggleBorder: isDark ? "#1a3040" : "#c0d4e4",
    toggleText: isDark ? "#4a7a94" : "#3a6a84",
    toggleHoverBg: isDark ? "#162530" : "#d4e6f1",
  };

  const stats = [
    { label: "Tools Covered", value: "4" },
    {
      label: `${active.label} Commands`,
      value:
        commandCounts[activeTab] > 0
          ? String(commandCounts[activeTab])
          : "Soon",
    },
    {
      label: "Total Commands",
      value: String(Object.values(commandCounts).reduce((a, b) => a + b, 0)),
    },
  ];

  const links = [
    { label: "Docker Docs", href: "https://docs.docker.com", color: "#0db7ed" },
    {
      label: "Terraform Docs",
      href: "https://developer.hashicorp.com/terraform",
      color: "#7b42bc",
    },
    {
      label: "Kubernetes Docs",
      href: "https://kubernetes.io/docs",
      color: "#326ce5",
    },
    {
      label: "Ansible Docs",
      href: "https://docs.ansible.com",
      color: "#e5361a",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');

        /* ── Root ── */
        .footer-root {
          background: ${tokens.rootBg};
          border-top: 1px solid ${tokens.borderRoot};
          position: relative;
          overflow: hidden;
          transition: background 0.35s ease, border-color 0.35s ease;
        }

        .footer-glow-line {
          height: 1px;
          transition: background 0.4s ease;
        }

        .footer-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(${tokens.gridLine} 1px, transparent 1px),
            linear-gradient(90deg, ${tokens.gridLine} 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          transition: background-image 0.35s ease;
        }

        /* ── Layout ── */
        .footer-inner {
          position: relative;
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 28px 24px;
        }

        .footer-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          padding-bottom: 28px;
          border-bottom: 1px solid ${tokens.borderRoot};
          flex-wrap: wrap;
          transition: border-color 0.35s ease;
        }

        /* ── Brand ── */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 260px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          transition: all 0.3s ease;
        }

        .footer-logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: ${tokens.logoName};
          letter-spacing: 1px;
          transition: color 0.35s ease;
        }

        .footer-tagline {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: ${tokens.tagline};
          line-height: 1.7;
          letter-spacing: 0.5px;
          transition: color 0.35s ease;
        }

        /* ── Theme Toggle ── */
        .theme-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid ${tokens.toggleBorder};
          background: ${tokens.toggleBg};
          color: ${tokens.toggleText};
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          outline: none;
          width: fit-content;
        }
        .theme-toggle-btn:hover {
          background: ${tokens.toggleHoverBg};
          border-color: ${active.color}66;
          color: ${active.accent ?? active.color};
          box-shadow: 0 0 12px ${active.color}30;
        }

        .theme-toggle-track {
          position: relative;
          width: 28px;
          height: 15px;
          border-radius: 10px;
          background: ${isDark ? active.color + "44" : "#c8d8e4"};
          transition: background 0.3s ease;
          flex-shrink: 0;
        }
        .theme-toggle-thumb {
          position: absolute;
          top: 2px;
          left: ${isDark ? "14px" : "2px"};
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: ${isDark ? active.color : "#ffffff"};
          box-shadow: ${isDark ? `0 0 6px ${active.color}88` : "0 1px 3px rgba(0,0,0,0.2)"};
          transition: left 0.25s ease, background 0.3s ease, box-shadow 0.3s ease;
        }

        /* ── Stats ── */
        .footer-stats {
          display: flex;
          gap: 2px;
        }

        .footer-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 20px;
          border-radius: 10px;
          background: ${tokens.statBg};
          border: 1px solid ${tokens.borderStat};
          min-width: 90px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .footer-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: ${active.color}66;
          transition: background 0.4s ease;
        }
        .footer-stat:hover {
          border-color: ${tokens.borderStatHover};
          background: ${tokens.statHoverBg};
          transform: translateY(-2px);
        }

        .footer-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
          transition: color 0.4s ease;
        }

        .footer-stat-label {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          color: ${tokens.statLabel};
          letter-spacing: 1px;
          text-align: center;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        /* ── Per-tool command count row ── */
        .footer-tool-counts {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .footer-tool-count-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: all 0.3s ease;
          cursor: default;
        }

        .footer-tool-count-emoji { font-size: 13px; }

        .footer-tool-count-name {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .footer-tool-count-badge {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 10px;
          border: 1px solid transparent;
        }

        /* ── Links ── */
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-links-title {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          color: ${tokens.linksTitle};
          text-transform: uppercase;
          margin-bottom: 4px;
          transition: color 0.35s ease;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: ${tokens.linkIdle};
          transition: all 0.2s ease;
          padding: 3px 0;
        }
        .footer-link:hover { color: ${tokens.linkHover}; transform: translateX(3px); }

        .footer-link-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: box-shadow 0.2s ease;
        }
        .footer-link:hover .footer-link-dot { box-shadow: 0 0 6px currentColor; }

        /* ── Bottom ── */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-bottom-left {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: ${tokens.bottomLeft};
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.35s ease;
        }

        .footer-tools-row {
          display: flex;
          gap: 5px;
          align-items: center;
          flex-wrap: wrap;
        }

        .footer-tool-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: 1px solid transparent;
          transition: all 0.25s ease;
          cursor: default;
        }

        .footer-bottom-right {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          color: ${tokens.bottomRight};
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.35s ease;
        }

        .footer-heart {
          display: inline-block;
          animation: heartbeat 1.8s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.25); }
        }

        .footer-divider { color: ${tokens.divider}; }

        /* ── Light mode shadow elevation ── */
        ${
          !isDark
            ? `
          .footer-stat {
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          }
          .footer-stat:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .footer-tool-count-item {
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
        `
            : ""
        }
      `}</style>

      <footer className="footer-root">
        {/* Glow line */}
        <div
          className="footer-glow-line"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${active.color}55 50%, transparent 100%)`,
          }}
        />

        <div className="footer-grid-bg" />

        <div className="footer-inner">
          {/* ── TOP ── */}
          <div className="footer-top">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div
                  className="footer-logo-icon"
                  style={{
                    background: active.color + (isDark ? "18" : "22"),
                    border: `1px solid ${active.color}${isDark ? "33" : "44"}`,
                    boxShadow: `0 0 14px ${active.color}${isDark ? "25" : "18"}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  {active.emoji}
                </div>
                <div className="footer-logo-name">
                  Dev
                  <span
                    style={{ color: active.color, transition: "color 0.3s" }}
                  >
                    Ops
                  </span>
                  <span style={{ color: isDark ? "#ffffff55" : "#0d1f2d44" }}>
                    {" "}
                    CMD
                  </span>
                </div>
              </div>

              <p className="footer-tagline">
                Your go-to reference for Docker, Terraform,
                <br />
                Kubernetes & Ansible commands.
                <br />
                Built for DevOps engineers.
              </p>

              {/* ── Theme Toggle ── */}
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <span style={{ fontSize: 12 }}>{isDark ? "☀️" : "🌙"}</span>
                <div className="theme-toggle-track">
                  <div className="theme-toggle-thumb" />
                </div>
                {isDark ? "Light" : "Dark"}
              </button>

              {/* ── Per-tool count row ── */}
              <div className="footer-tool-counts">
                {TABS.map((tab) => {
                  const count = commandCounts[tab.key];
                  const isActive = tab.key === activeTab;
                  return (
                    <div
                      key={tab.key}
                      className="footer-tool-count-item"
                      style={{
                        background: isActive
                          ? tokens.toolCountActiveBg(tab.color)
                          : tokens.toolCountIdleBg,
                        borderColor: isActive
                          ? tokens.toolCountActiveBorder(tab.color)
                          : tokens.toolCountIdleBorder,
                        boxShadow: isActive
                          ? `0 0 10px ${tab.color}20`
                          : "none",
                      }}
                    >
                      <span className="footer-tool-count-emoji">
                        {tab.emoji}
                      </span>
                      <span
                        className="footer-tool-count-name"
                        style={{
                          color: isActive
                            ? (tab.accent ?? tab.color)
                            : tokens.toolCountIdleText,
                        }}
                      >
                        {tab.label}
                      </span>
                      <span
                        className="footer-tool-count-badge"
                        style={{
                          background: isActive
                            ? tokens.badgeActiveBg(tab.color)
                            : tokens.badgeIdleBg,
                          borderColor: isActive
                            ? tokens.badgeActiveBorder(tab.color)
                            : tokens.badgeIdleBorder,
                          color: isActive
                            ? (tab.accent ?? tab.color)
                            : tokens.badgeIdleText,
                        }}
                      >
                        {count > 0 ? count : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="footer-stats">
              {stats.map((s) => (
                <div className="footer-stat" key={s.label}>
                  <span
                    className="footer-stat-value"
                    style={{ color: active.accent ?? active.color }}
                  >
                    {s.value}
                  </span>
                  <span className="footer-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <div className="footer-links-title">Official Docs</div>
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <span
                    className="footer-link-dot"
                    style={{ background: link.color, color: link.color }}
                  />
                  {link.label}
                  <span style={{ fontSize: 9, color: tokens.linksTitle }}>
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── BOTTOM ── */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>© 2025 DevOps CMD</span>
              <span className="footer-divider">·</span>
              <span>All commands verified</span>
            </div>

            <div className="footer-tools-row">
              {TABS.map((tab) => (
                <div
                  key={tab.key}
                  className="footer-tool-chip"
                  style={{
                    background:
                      tab.key === activeTab
                        ? tokens.chipActiveBg(tab.color)
                        : tokens.chipIdleBg,
                    borderColor:
                      tab.key === activeTab
                        ? tokens.chipActiveBorder(tab.color)
                        : tokens.chipIdleBorder,
                    color:
                      tab.key === activeTab
                        ? (tab.accent ?? tab.color)
                        : tokens.chipIdleText,
                  }}
                >
                  <span style={{ fontSize: 11 }}>{tab.emoji}</span>
                  {tab.label}
                </div>
              ))}
            </div>

            <div className="footer-bottom-right">
              Made with{" "}
              <span className="footer-heart" style={{ color: active.color }}>
                ♥
              </span>{" "}
              for DevOps Engineers
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
