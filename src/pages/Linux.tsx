import React, { useState, useRef } from "react";
import { useTheme } from "../Themecontext";

interface Command {
  id: number;
  title: string;
  commands: string[];
}

export const linuxCommands: Command[] = [
  // ── Navigation ──────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "To change directory",
    commands: ["cd <Dir-Name>"],
  },

  // ── Directory Management ─────────────────────────────────────────────────────
  {
    id: 2,
    title: "To create a directory",
    commands: ["mkdir <Dir-Name>"],
  },
  {
    id: 3,
    title: "To create multiple directories",
    commands: ["mkdir <Dir-Name>{1..10}"],
  },

  // ── File Management ──────────────────────────────────────────────────────────
  {
    id: 4,
    title: "To create a file",
    commands: ["touch <File-Name>"],
  },
  {
    id: 5,
    title: "To create multiple files",
    commands: ["touch <File-Name>{1..5}"],
  },

  // ── Remove ───────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "To remove a directory",
    commands: ["rm <Dir-Name>"],
  },
  {
    id: 7,
    title: "To remove a directory recursively and forcefully",
    commands: ["rm -rf <Dir-Name>"],
  },
  {
    id: 8,
    title: "To remove a file",
    commands: ["rm <File-Name>"],
  },
  {
    id: 9,
    title: "To remove a file recursively and forcefully",
    commands: ["rm -rf <File-Name>"],
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  {
    id: 10,
    title: "To list files",
    commands: ["ls"],
  },
  {
    id: 11,
    title: "To list files with full info",
    commands: ["ls -l"],
  },
  {
    id: 12,
    title: "To list files with full info in human-readable format",
    commands: ["ls -lh"],
  },
  {
    id: 13,
    title: "To list hidden files identified by (.)",
    commands: ["ls -a"],
  },
  {
    id: 14,
    title: "To list hidden files with full info",
    commands: ["ls -al"],
  },
  {
    id: 15,
    title: "To list hidden files with full info in human-readable format",
    commands: ["ls -alh"],
  },
];

const categories = [
  { label: "Navigation", emoji: "🧭", color: "#16a34a", ids: [1] },
  { label: "Directory Management", emoji: "📁", color: "#15803d", ids: [2, 3] },
  { label: "File Management", emoji: "📄", color: "#22c55e", ids: [4, 5] },
  { label: "Remove", emoji: "🗑️", color: "#dc2626", ids: [6, 7, 8, 9] },
  {
    label: "List",
    emoji: "📋",
    color: "#4ade80",
    ids: [10, 11, 12, 13, 14, 15],
  },
];

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
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
const Linux: React.FC = () => {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const t = {
    // Search
    searchBg: isDark ? "rgba(34,197,94,0.05)" : "rgba(34,197,94,0.04)",
    searchBgFocus: isDark ? "rgba(34,197,94,0.09)" : "rgba(34,197,94,0.07)",
    searchBorder: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.25)",
    searchBorderF: isDark ? "rgba(34,197,94,0.55)" : "rgba(34,197,94,0.6)",
    searchColor: isDark ? "#d1fae5" : "#052e16",
    searchPlaceholder: isDark ? "rgba(34,197,94,0.3)" : "rgba(34,197,94,0.35)",
    searchIcon: isDark ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.5)",
    clearBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    clearBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    clearColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    // Pills
    pillIdleBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
    pillIdleBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    pillIdleColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.45)",
    // Section
    sectionCountBg: isDark ? "#052e16" : "#dcfce7",
    sectionCountBorder: isDark ? "#14532d" : "#86efac",
    // Card
    cardBg: isDark
      ? "linear-gradient(135deg,rgba(34,197,94,0.07) 0%,rgba(0,0,0,0.45) 100%)"
      : "linear-gradient(135deg,rgba(34,197,94,0.04) 0%,rgba(255,255,255,0.92) 100%)",
    cardBorder: isDark ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.18)",
    cardTitle: isDark ? "rgba(187,247,208,0.9)" : "#052e16",
    // Command row
    cmdText: isDark ? "#4ade80" : "#15803d",
    cmdTextSecond: isDark ? "rgba(74,222,128,0.6)" : "rgba(21,128,61,0.6)",
    rowBorder: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
    rowHoverBg: isDark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.05)",
    // Empty
    emptyColor: isDark ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.3)",
  };

  const allCategories = ["All", ...categories.map((c) => c.label)];

  const filtered = linuxCommands.filter((cmd) => {
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

        .lx-wrap { font-family: 'JetBrains Mono', monospace; }

        /* ── Search ── */
        .lx-search-wrap { position: relative; margin-bottom: 20px; }

        .lx-search {
          width: 100%; border-radius: 12px;
          padding: 13px 44px 13px 42px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          outline: none; box-sizing: border-box; transition: all 0.3s ease;
        }
        .lx-search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); font-size: 14px; pointer-events: none;
        }
        .lx-search-clear {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          border-radius: 50%; cursor: pointer; width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; transition: all 0.2s;
        }

        /* ── Category pills ── */
        .lx-cats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }

        .lx-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 50px;
          font-family: 'Exo 2', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.5px; cursor: pointer; transition: all 0.25s ease;
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .lx-pill::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── Section ── */
        .lx-section { margin-bottom: 40px; }
        .lx-section-hdr {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }
        .lx-section-label {
          font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 900;
          letter-spacing: 4px; text-transform: uppercase;
        }
        .lx-section-line { flex: 1; height: 1px; opacity: 0.2; }
        .lx-section-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
          padding: 2px 10px; border-radius: 20px;
        }

        /* ── Card ── */
        .lx-card {
          border-radius: 14px; overflow: hidden; margin-bottom: 10px;
          position: relative; transition: all 0.25s ease;
        }
        .lx-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
          pointer-events: none; z-index: 2;
        }
        .lx-card-hdr {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; position: relative;
        }
        .lx-card-hdr::after {
          content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
          height: 1px; opacity: 0.12;
          background: linear-gradient(90deg, currentColor, transparent);
        }
        .lx-num {
          font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 900;
          padding: 2px 8px; border-radius: 6px; letter-spacing: 1px; flex-shrink: 0;
        }
        .lx-card-title {
          font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;
        }

        /* ── Command row ── */
        .lx-cmd-row {
          display: flex; align-items: center; gap: 12px; padding: 10px 16px;
          transition: background 0.2s;
        }
        .lx-cmd-prompt {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          flex-shrink: 0; font-weight: 700; user-select: none;
          text-shadow: 0 0 8px currentColor;
        }
        .lx-cmd-text {
          flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 12px;
          line-height: 1.6; word-break: break-all; letter-spacing: 0.2px;
        }

        /* ── Empty ── */
        .lx-empty {
          text-align: center; padding: 80px 0;
          font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing: 3px;
        }

        /* ── Animations ── */
        @keyframes lxSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lx-section { animation: lxSlideIn 0.4s ease forwards; }
        .lx-section:nth-child(1) { animation-delay: 0.05s; }
        .lx-section:nth-child(2) { animation-delay: 0.10s; }
        .lx-section:nth-child(3) { animation-delay: 0.15s; }
        .lx-section:nth-child(4) { animation-delay: 0.20s; }
        .lx-section:nth-child(5) { animation-delay: 0.25s; }
      `}</style>

      <div className="lx-wrap">
        {/* ── Search ── */}
        <div className="lx-search-wrap">
          <span className="lx-search-icon" style={{ color: t.searchIcon }}>
            ⌕
          </span>
          <input
            className="lx-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Linux commands..."
            style={{
              background: search ? t.searchBgFocus : t.searchBg,
              border: `1px solid ${search ? t.searchBorderF : t.searchBorder}`,
              color: t.searchColor,
              boxShadow: search
                ? `0 0 24px ${isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)"}`
                : "none",
            }}
          />
          {search && (
            <button
              className="lx-search-clear"
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
        <div className="lx-cats">
          {allCategories.map((cat) => {
            const catData = categories.find((c) => c.label === cat);
            const isActive = activeCategory === cat;
            const col = catData?.color ?? "#22c55e";
            return (
              <button
                key={cat}
                className="lx-pill"
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
          <div className="lx-empty" style={{ color: t.emptyColor }}>
            NO COMMANDS FOUND FOR "{search.toUpperCase()}"
          </div>
        ) : (
          grouped.map((group) => (
            <div className="lx-section" key={group.label}>
              {/* Section header */}
              <div className="lx-section-hdr">
                <span
                  className="lx-section-label"
                  style={{ color: group.color }}
                >
                  {group.emoji} {group.label}
                </span>
                <div
                  className="lx-section-line"
                  style={{
                    background: `linear-gradient(90deg,${group.color},transparent)`,
                  }}
                />
                <span
                  className="lx-section-badge"
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
              {group.items.map((cmd) => (
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
                    className="lx-card-hdr"
                    style={{
                      background: `linear-gradient(90deg,${group.color}12,transparent)`,
                    }}
                  >
                    <span
                      className="lx-num"
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
                      className="lx-card-title"
                      style={{ color: t.cardTitle }}
                    >
                      {cmd.title}
                    </span>
                  </div>

                  {/* Command rows */}
                  {cmd.commands.map((c, i) => (
                    <div
                      className="lx-cmd-row"
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
                        className="lx-cmd-prompt"
                        style={{ color: group.color, opacity: 0.7 }}
                      >
                        $
                      </span>
                      <code
                        className="lx-cmd-text"
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

export default Linux;
