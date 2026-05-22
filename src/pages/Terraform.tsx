import React, { useState, useRef } from "react";
import { useTheme } from "../Themecontext";

interface Command {
  id: number;
  title: string;
  commands: string[];
}

export const terraformCommands: Command[] = [
  {
    id: 1,
    title: "To initialize the Terraform working directory",
    commands: ["terraform init"],
  },
  {
    id: 2,
    title: "To validate Terraform configuration files",
    commands: ["terraform validate"],
  },
  {
    id: 3,
    title: "To format Terraform configuration files",
    commands: ["terraform fmt"],
  },
  {
    id: 4,
    title: "To preview infrastructure changes",
    commands: ["terraform plan"],
  },
  {
    id: 5,
    title: "To apply Terraform configuration",
    commands: ["terraform apply"],
  },
  {
    id: 6,
    title: "To apply Terraform configuration without confirmation",
    commands: ["terraform apply -auto-approve"],
  },
  {
    id: 7,
    title: "To destroy infrastructure",
    commands: ["terraform destroy"],
  },
  {
    id: 8,
    title: "To destroy infrastructure without confirmation",
    commands: ["terraform destroy -auto-approve"],
  },
  {
    id: 9,
    title: "To show current Terraform state",
    commands: ["terraform show"],
  },
  {
    id: 10,
    title: "To list resources in Terraform state",
    commands: ["terraform state list"],
  },
  {
    id: 11,
    title: "To refresh Terraform state",
    commands: ["terraform refresh"],
  },
  {
    id: 12,
    title: "To view Terraform providers",
    commands: ["terraform providers"],
  },
  {
    id: 13,
    title: "To display Terraform output values",
    commands: ["terraform output"],
  },
  {
    id: 14,
    title: "To open Terraform console",
    commands: ["terraform console"],
  },
  {
    id: 15,
    title: "To import existing infrastructure",
    commands: [
      "terraform import",
      "terraform import aws_instance.myinstance i-1234567890abcdef0",
    ],
  },
  {
    id: 16,
    title: "To generate execution graph",
    commands: ["terraform graph"],
  },
  {
    id: 17,
    title: "To check Terraform version",
    commands: ["terraform version"],
  },
  {
    id: 18,
    title: "To download/update providers and modules",
    commands: ["terraform get"],
  },
  {
    id: 19,
    title: "To unlock Terraform state manually",
    commands: ["terraform force-unlock LOCK_ID"],
  },
  {
    id: 20,
    title: "To work with Terraform workspaces",
    commands: [
      "terraform workspace new dev",
      "terraform workspace list",
      "terraform workspace select dev",
      "terraform workspace delete dev",
    ],
  },
  {
    id: 21,
    title: "To taint a resource",
    commands: [
      "terraform taint RESOURCE_NAME",
      "terraform taint aws_instance.web",
    ],
  },
  {
    id: 22,
    title: "To remove taint from a resource",
    commands: ["terraform untaint RESOURCE_NAME"],
  },
  {
    id: 23,
    title: "To download modules and providers",
    commands: ["terraform get"],
  },
  {
    id: 24,
    title: "To work with Terraform modules",
    commands: [
      "terraform init",
      "terraform get -update",
      "terraform providers",
    ],
  },
  {
    id: 25,
    title: "To scan Terraform code using Terrascan",
    commands: [
      "brew install terrascan",
      "terrascan scan",
      "terrascan scan -d .",
      "terrascan scan -i terraform",
      "terrascan scan -v",
    ],
  },
];

const categories = [
  { label: "Setup & Init", emoji: "⚙️", color: "#7b42bc", ids: [1, 2, 3] },
  {
    label: "Plan & Apply",
    emoji: "🚀",
    color: "#9333ea",
    ids: [4, 5, 6, 7, 8],
  },
  { label: "State", emoji: "📋", color: "#a855f7", ids: [9, 10, 11] },
  {
    label: "Inspect",
    emoji: "🔍",
    color: "#c084fc",
    ids: [12, 13, 14, 15, 16, 17, 18],
  },
  { label: "Workspaces", emoji: "🗂️", color: "#8b5cf6", ids: [19, 20] },
  { label: "Resources", emoji: "🧱", color: "#7c3aed", ids: [21, 22, 23] },
  { label: "Modules", emoji: "📦", color: "#6d28d9", ids: [24] },
  { label: "Security Scan", emoji: "🛡️", color: "#5b21b6", ids: [25] },
];

// ── 3D Tilt Card (same pattern as Docker) ────────────────────────────────────
function TiltCard({
  children,
  color,
  style,
}: {
  children: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    el.style.boxShadow = `0 16px 48px ${color}22, 0 0 24px ${color}15, inset 0 1px 0 ${color}30`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    el.style.boxShadow = `0 4px 20px ${color}10`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.15s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: `0 4px 20px ${color}10`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyBtn({
  text,
  color,
  isDark,
}: {
  text: string;
  color: string;
  isDark: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      style={{
        flexShrink: 0,
        background: copied
          ? `${color}28`
          : isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.04)",
        border: `1px solid ${copied ? color + "88" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"}`,
        borderRadius: 6,
        color: copied
          ? color
          : isDark
            ? "rgba(255,255,255,0.25)"
            : "rgba(0,0,0,0.35)",
        cursor: "pointer",
        padding: "3px 12px",
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: 1.5,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "✓ DONE" : "COPY"}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const Terraform: React.FC = () => {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const t = {
    // Search
    searchBg: isDark ? "rgba(123,66,188,0.05)" : "rgba(123,66,188,0.04)",
    searchBgFocus: isDark ? "rgba(123,66,188,0.09)" : "rgba(123,66,188,0.07)",
    searchBorder: isDark ? "rgba(123,66,188,0.2)" : "rgba(123,66,188,0.25)",
    searchBorderF: isDark ? "rgba(123,66,188,0.55)" : "rgba(123,66,188,0.6)",
    searchColor: isDark ? "#e2d4f5" : "#1a0a30",
    searchPlaceholder: isDark
      ? "rgba(123,66,188,0.3)"
      : "rgba(123,66,188,0.35)",
    searchIcon: isDark ? "rgba(123,66,188,0.4)" : "rgba(123,66,188,0.5)",
    clearBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    clearBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    clearColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    // Pills
    pillIdleBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
    pillIdleBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    pillIdleColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.45)",
    // Section
    sectionLine: isDark ? "#1e0a38" : "#d8ccea",
    sectionCountBg: isDark ? "#120820" : "#ede8f5",
    sectionCountBorder: isDark ? "#1a0e2e" : "#cbbfe0",
    // Card
    cardBg: isDark
      ? "linear-gradient(135deg,rgba(123,66,188,0.07) 0%,rgba(0,0,0,0.45) 100%)"
      : "linear-gradient(135deg,rgba(123,66,188,0.04) 0%,rgba(255,255,255,0.92) 100%)",
    cardBorder: isDark ? "rgba(123,66,188,0.14)" : "rgba(123,66,188,0.18)",
    cardHdrBg: isDark ? "rgba(123,66,188,0.08)" : "rgba(123,66,188,0.05)",
    cardHdrBorder: isDark ? "rgba(123,66,188,0.1)" : "rgba(123,66,188,0.12)",
    cardTitle: isDark ? "rgba(200,180,230,0.9)" : "#2a0a4a",
    // Command row
    cmdPrompt: isDark ? "rgba(123,66,188,0.45)" : "rgba(123,66,188,0.55)",
    cmdText: isDark ? "#c084fc" : "#5b21b6",
    cmdTextSecond: isDark ? "rgba(192,132,252,0.6)" : "rgba(91,33,182,0.6)",
    rowBorder: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
    rowHoverBg: isDark ? "rgba(123,66,188,0.06)" : "rgba(123,66,188,0.05)",
    // Empty
    emptyColor: isDark ? "rgba(123,66,188,0.25)" : "rgba(123,66,188,0.3)",
  };

  const allCategories = ["All", ...categories.map((c) => c.label)];

  const filtered = terraformCommands.filter((cmd) => {
    const matchSearch =
      !search.trim() ||
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.commands.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const matchCat =
      activeCategory === "All" ||
      categories.find((c) => c.label === activeCategory)?.ids.includes(cmd.id);
    return matchSearch && matchCat;
  });

  const grouped = categories
    .map((cat) => ({
      ...cat,
      items: filtered.filter((cmd) => cat.ids.includes(cmd.id)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;700&display=swap');

        .tf-wrap { font-family: 'JetBrains Mono', monospace; }

        /* ── Search ── */
        .tf-search-wrap { position: relative; margin-bottom: 20px; }

        .tf-search {
          width: 100%; border-radius: 12px;
          padding: 13px 44px 13px 42px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          outline: none; box-sizing: border-box; transition: all 0.3s ease;
        }
        .tf-search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); font-size: 14px; pointer-events: none;
        }
        .tf-search-clear {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          border-radius: 50%; cursor: pointer; width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; transition: all 0.2s;
        }

        /* ── Category pills ── */
        .tf-cats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }

        .tf-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 50px;
          font-family: 'Exo 2', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.5px; cursor: pointer; transition: all 0.25s ease;
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .tf-pill::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── Section ── */
        .tf-section { margin-bottom: 40px; }
        .tf-section-hdr {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }
        .tf-section-label {
          font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 900;
          letter-spacing: 4px; text-transform: uppercase;
        }
        .tf-section-line { flex: 1; height: 1px; opacity: 0.2; }
        .tf-section-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
          padding: 2px 10px; border-radius: 20px;
        }

        /* ── Card ── */
        .tf-card {
          border-radius: 14px; overflow: hidden; margin-bottom: 10px;
          position: relative; transition: all 0.25s ease;
        }
        .tf-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
          pointer-events: none; z-index: 2;
        }
        .tf-card-hdr {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; position: relative;
        }
        .tf-card-hdr::after {
          content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
          height: 1px; opacity: 0.12;
          background: linear-gradient(90deg, currentColor, transparent);
        }
        .tf-num {
          font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 900;
          padding: 2px 8px; border-radius: 6px; letter-spacing: 1px; flex-shrink: 0;
        }
        .tf-card-title {
          font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;
        }

        /* ── Command row ── */
        .tf-cmd-row {
          display: flex; align-items: center; gap: 12px; padding: 10px 16px;
          transition: background 0.2s;
        }
        .tf-cmd-prompt {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          flex-shrink: 0; font-weight: 700; user-select: none;
          text-shadow: 0 0 8px currentColor;
        }
        .tf-cmd-text {
          flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 12px;
          line-height: 1.6; word-break: break-all; letter-spacing: 0.2px;
        }

        /* ── Empty ── */
        .tf-empty {
          text-align: center; padding: 80px 0;
          font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing: 3px;
        }

        /* ── Animations ── */
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tf-section { animation: slideIn 0.4s ease forwards; }
        .tf-section:nth-child(1) { animation-delay: 0.05s; }
        .tf-section:nth-child(2) { animation-delay: 0.10s; }
        .tf-section:nth-child(3) { animation-delay: 0.15s; }
        .tf-section:nth-child(4) { animation-delay: 0.20s; }
        .tf-section:nth-child(5) { animation-delay: 0.25s; }
        .tf-section:nth-child(6) { animation-delay: 0.30s; }
      `}</style>

      <div className="tf-wrap">
        {/* ── Search ── */}
        <div className="tf-search-wrap">
          <span className="tf-search-icon" style={{ color: t.searchIcon }}>
            ⌕
          </span>
          <input
            className="tf-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Terraform commands..."
            style={{
              background: search ? t.searchBgFocus : t.searchBg,
              border: `1px solid ${search ? t.searchBorderF : t.searchBorder}`,
              color: t.searchColor,
              boxShadow: search
                ? `0 0 24px ${isDark ? "rgba(123,66,188,0.15)" : "rgba(123,66,188,0.1)"}`
                : "none",
            }}
          />
          {search && (
            <button
              className="tf-search-clear"
              onClick={() => setSearch("")}
              style={{
                background: t.clearBg,
                border: `1px solid ${t.clearBorder}`,
                color: t.clearColor,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* ── Category pills ── */}
        <div className="tf-cats">
          {allCategories.map((cat) => {
            const catData = categories.find((c) => c.label === cat);
            const isActive = activeCategory === cat;
            const col = catData?.color ?? "#7b42bc";
            return (
              <button
                key={cat}
                className="tf-pill"
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg,${col}30,${col}15)`
                    : t.pillIdleBg,
                  border: `1px solid ${isActive ? `${col}70` : t.pillIdleBorder}`,
                  color: isActive ? col : t.pillIdleColor,
                  boxShadow: isActive
                    ? `0 4px 20px ${col}30, inset 0 1px 0 rgba(255,255,255,0.15)`
                    : "none",
                  transform: isActive ? "translateY(-1px)" : "none",
                }}
              >
                {catData?.emoji ?? "✦"} {cat === "All" ? "✦ All" : cat}
              </button>
            );
          })}
        </div>

        {/* ── Commands ── */}
        {filtered.length === 0 ? (
          <div className="tf-empty" style={{ color: t.emptyColor }}>
            NO COMMANDS FOUND FOR "{search.toUpperCase()}"
          </div>
        ) : (
          grouped.map((group) => (
            <div className="tf-section" key={group.label}>
              {/* Section header */}
              <div className="tf-section-hdr">
                <span
                  className="tf-section-label"
                  style={{ color: group.color }}
                >
                  {group.emoji} {group.label}
                </span>
                <div
                  className="tf-section-line"
                  style={{
                    background: `linear-gradient(90deg,${group.color},transparent)`,
                  }}
                />
                <span
                  className="tf-section-badge"
                  style={{
                    background: t.sectionCountBg,
                    border: `1px solid ${t.sectionCountBorder}`,
                    color: group.color,
                  }}
                >
                  {group.items.length} cmds
                </span>
              </div>

              {/* Cards */}
              {group.items.map((cmd, idx) => (
                <TiltCard
                  key={cmd.id}
                  color={group.color}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: 14,
                    marginBottom: 10,
                    overflow: "hidden",
                  }}
                >
                  {/* Card header */}
                  <div
                    className="tf-card-hdr"
                    style={{
                      background: `linear-gradient(90deg,${group.color}12,transparent)`,
                    }}
                  >
                    <span
                      className="tf-num"
                      style={{
                        background: `linear-gradient(135deg,${group.color}30,${group.color}15)`,
                        border: `1px solid ${group.color}44`,
                        color: group.color,
                        textShadow: `0 0 10px ${group.color}80`,
                      }}
                    >
                      #{String(cmd.id).padStart(2, "0")}
                    </span>
                    <span
                      className="tf-card-title"
                      style={{ color: t.cardTitle }}
                    >
                      {cmd.title}
                    </span>
                  </div>

                  {/* Command rows */}
                  {cmd.commands.map((c, i) => (
                    <div
                      className="tf-cmd-row"
                      key={i}
                      style={{ borderTop: `1px solid ${t.rowBorder}` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = t.rowHoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        className="tf-cmd-prompt"
                        style={{ color: group.color, opacity: 0.7 }}
                      >
                        $
                      </span>
                      <code
                        className="tf-cmd-text"
                        style={{ color: i === 0 ? t.cmdText : t.cmdTextSecond }}
                      >
                        {c}
                      </code>
                      <CopyBtn text={c} color={group.color} isDark={isDark} />
                    </div>
                  ))}
                </TiltCard>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Terraform;
