import React, { useState, useRef } from "react";
import { useTheme } from "../Themecontext";

interface Command {
  id: number;
  title: string;
  commands: string[];
}

export const dockerCommands: Command[] = [
  {
    id: 1,
    title: "To pull the Image",
    commands: ["docker pull <image-name>", "docker pull nginx"],
  },
  {
    id: 2,
    title: "To build the image",
    commands: [
      "docker image build -t <File-name> .",
      "docker image build -t <Dockerfile>",
    ],
  },
  { id: 3, title: "To list images", commands: ["docker image ls"] },
  {
    id: 4,
    title: "To build image not in docker file format",
    commands: [
      "docker image build -t -f <Docker-file> .",
      "docker image build -t -f <mydockerfile> .",
    ],
  },
  {
    id: 5,
    title: "To create a container",
    commands: [
      "docker create --name <container-name> <image-name>",
      "docker create --name test-1 nginx",
    ],
  },
  {
    id: 6,
    title: "To start a container",
    commands: ["docker start <container-name>", "docker start test-1"],
  },
  {
    id: 7,
    title: "To run container with default port No",
    commands: [
      "docker container run -d -P --name <container-name> <image-name>",
      "docker container run -d -P --name test-1 nginx",
    ],
  },
  {
    id: 8,
    title: "To run container with custom port No",
    commands: [
      "docker container run -d -p <host-port>:<container-port> --name <container-name> <image-name>",
      "docker container run -d -p 8880:80 --name test-1 nginx",
    ],
  },
  {
    id: 9,
    title: "To check containers (running state only)",
    commands: ["docker ps"],
  },
  {
    id: 10,
    title: "To check all containers (running and exit state)",
    commands: ["docker ps -a"],
  },
  {
    id: 11,
    title: "To login into container",
    commands: [
      "docker container exec -it <container-name> /bin/bash",
      "docker container exec -it test-1 /bin/bash",
    ],
  },
  {
    id: 12,
    title: "To pause container",
    commands: ["docker pause <container-name>", "docker pause test-1"],
  },
  {
    id: 13,
    title: "To unpause container",
    commands: ["docker unpause <container-name>", "docker unpause test-1"],
  },
  {
    id: 14,
    title: "To stop container",
    commands: ["docker stop <container-name>", "docker stop test-1"],
  },
  {
    id: 15,
    title: "To stop all containers",
    commands: ["docker stop $(docker ps -aq)"],
  },
  {
    id: 16,
    title: "To delete container",
    commands: ["docker rm <container_name>", "docker rm test-1"],
  },
  {
    id: 17,
    title: "To delete all containers",
    commands: ["docker rm $(docker ps -aq)"],
  },
  {
    id: 18,
    title: "To kill container",
    commands: ["docker kill <container_name>", "docker kill test-1"],
  },
  {
    id: 19,
    title: "To scan the image",
    commands: ["trivy image <image-name>", "trivy image nginx"],
  },
  { id: 20, title: "To Docker login", commands: ["docker login"] },
  {
    id: 21,
    title: "To tag the docker image",
    commands: [
      "docker tag <image-name> <dockerhub-username>/<repository>:<tag>",
      "docker tag myapp:1.0 nikhilmarati97/mydockerimages:latest",
    ],
  },
  {
    id: 22,
    title: "To push docker image to Docker Hub",
    commands: [
      "docker push <dockerhub-username>/<image-name>:<tag>",
      "docker push nikhilmarati97/mydockerimages:latest",
    ],
  },
  {
    id: 23,
    title: "To pull docker image from Docker Hub",
    commands: [
      "docker pull <dockerhub-username>/<image-name>:<tag>",
      "docker pull nikhilmarati97/mydockerimages:latest",
    ],
  },
  {
    id: 24,
    title: "To tag the docker image in ECR",
    commands: [
      "docker tag myapp:1.0 <account-id>.dkr.ecr.ap-south-1.amazonaws.com/myrepo:latest",
    ],
  },
  {
    id: 25,
    title: "To push the docker image in ECR",
    commands: [
      "docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/myrepo:latest",
    ],
  },
  {
    id: 26,
    title: "To create custom bridge network",
    commands: ["docker network create mybridge"],
  },
  {
    id: 27,
    title: "To connect container to custom network",
    commands: ["docker network connect mybridge myapp"],
  },
  {
    id: 28,
    title: "To disconnect default bridge network",
    commands: ["docker network disconnect bridge myapp"],
  },
  {
    id: 29,
    title: "To reconnect container to custom network",
    commands: ["docker network connect mybridge myapp"],
  },
  {
    id: 30,
    title: "To run container in custom network",
    commands: [
      "docker container run -d -P --name myapp2 --network mybridge nginx:latest",
    ],
  },
  {
    id: 31,
    title: "To run container in default bridge network",
    commands: ["docker container run -d -P --name myapp3 nginx:latest"],
  },
  {
    id: 32,
    title: "To run container using host network",
    commands: [
      "docker container run -d -P --name test2 --network host nginx:latest",
    ],
  },
  {
    id: 33,
    title: "To run container using none network",
    commands: [
      "docker container run -d -P --name test3 --network none nginx:latest",
    ],
  },
  {
    id: 34,
    title: "To create volume in Docker",
    commands: ["docker create volume <volume-name>"],
  },
  {
    id: 35,
    title: "To view Volume",
    commands: ["docker volume inspect <volume-name>"],
  },
  { id: 36, title: "View Docker System", commands: ["docker system df -v"] },
  {
    id: 37,
    title: "To Mount Volume",
    commands: [
      "docker container run --mount type=volume,src=db-v1,dst=/usr -d -P --name v1 nginx:latest",
    ],
  },
  {
    id: 38,
    title: "To create a container and mount volume",
    commands: [
      "docker container run --mount type=volume,src=db-v1,dst=/usr -d -P --name v2 nginx:latest",
    ],
  },
  {
    id: 39,
    title: "To create anonymous volume using container",
    commands: ["docker container run -d -P -v /tmp nginx:latest"],
  },
  {
    id: 40,
    title: "To create hosted volume with container",
    commands: [
      "docker container run -d -P --mount src=demo,dst=/usr --name c1 nginx:latest",
    ],
  },
  {
    id: 41,
    title: "Run the application using docker-compose",
    commands: ["sudo docker-compose up -d"],
  },
  {
    id: 42,
    title: "Stop the application using docker-compose",
    commands: ["sudo docker-compose down"],
  },
];

const categories = [
  { label: "Images", emoji: "🖼️", color: "#0db7ed", ids: [1, 2, 3, 4] },
  {
    label: "Containers",
    emoji: "📦",
    color: "#00d4ff",
    ids: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    label: "Registry",
    emoji: "🗂️",
    color: "#38bdf8",
    ids: [19, 20, 21, 22, 23, 24, 25],
  },
  {
    label: "Networking",
    emoji: "🌐",
    color: "#22d3ee",
    ids: [26, 27, 28, 29, 30, 31, 32, 33],
  },
  {
    label: "Volumes",
    emoji: "💾",
    color: "#06b6d4",
    ids: [34, 35, 36, 37, 38, 39, 40],
  },
  { label: "Docker Compose", emoji: "🐙", color: "#0891b2", ids: [41, 42] },
];

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    el.style.boxShadow = `0 20px 60px ${color}22, 0 0 30px ${color}15, inset 0 1px 0 ${color}30`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    el.style.boxShadow = `0 4px 24px ${color}10`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.15s ease, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
        boxShadow: `0 4px 24px ${color}10`,
        willChange: "transform",
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
const Docker: React.FC = () => {
  const { isDark } = useTheme(); // ← global theme
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const t = {
    pageBg: isDark ? "transparent" : "transparent",
    searchBg: isDark ? "rgba(13,183,237,0.04)" : "rgba(13,120,180,0.04)",
    searchBorder: isDark ? "rgba(13,183,237,0.2)" : "rgba(13,120,180,0.25)",
    searchBorderF: isDark ? "rgba(13,183,237,0.6)" : "rgba(13,120,180,0.7)",
    searchBgF: isDark ? "rgba(13,183,237,0.07)" : "rgba(13,120,180,0.07)",
    searchColor: isDark ? "#e0f7ff" : "#0a2a3a",
    searchPlaceholder: isDark
      ? "rgba(13,183,237,0.25)"
      : "rgba(13,120,180,0.35)",
    clearBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    clearBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    clearColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
    pillIdleBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
    pillIdleBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    pillIdleColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.45)",
    cardBg: isDark
      ? "linear-gradient(135deg,rgba(13,183,237,0.06) 0%,rgba(0,0,0,0.4) 100%)"
      : "linear-gradient(135deg,rgba(13,120,180,0.05) 0%,rgba(255,255,255,0.85) 100%)",
    cardBorder: isDark ? "rgba(13,183,237,0.12)" : "rgba(13,120,180,0.18)",
    cardTitleColor: isDark ? "rgba(200,230,245,0.9)" : "#1a3a50",
    rowHoverBg: isDark ? "rgba(13,183,237,0.05)" : "rgba(13,120,180,0.06)",
    rowBorderTop: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
    cmdPrimaryColor: isDark ? "#a8e6f8" : "#0a4a6a",
    cmdSecondColor: isDark ? "rgba(168,230,248,0.6)" : "rgba(10,74,106,0.55)",
    emptyColor: isDark ? "rgba(13,183,237,0.2)" : "rgba(13,120,180,0.25)",
  };

  const allCategories = ["All", ...categories.map((c) => c.label)];

  const filtered = dockerCommands.filter((cmd) => {
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

        .dk3-root { font-family: 'Exo 2', sans-serif; position: relative; }

        .dk3-search-wrap { position: relative; margin-bottom: 20px; }

        .dk3-search {
          width: 100%; border-radius: 12px;
          padding: 13px 44px 13px 42px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          outline: none; box-sizing: border-box; transition: all 0.3s ease;
        }

        .dk3-search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); font-size: 14px; pointer-events: none;
        }
        .dk3-clear {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          border-radius: 50%; cursor: pointer; width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; transition: all 0.2s;
        }

        .dk3-cats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }

        .dk3-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 50px;
          font-family: 'Exo 2', sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.5px; cursor: pointer; transition: all 0.25s ease;
          white-space: nowrap; position: relative; overflow: hidden;
        }
        .dk3-pill::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .dk3-section { margin-bottom: 40px; }

        .dk3-section-hdr {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px; position: relative;
        }
        .dk3-section-label {
          font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 900;
          letter-spacing: 4px; text-transform: uppercase;
        }
        .dk3-section-line { flex: 1; height: 1px; opacity: 0.15; }
        .dk3-section-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
          padding: 2px 10px; border-radius: 20px;
        }

        .dk3-card {
          border-radius: 14px; overflow: hidden; margin-bottom: 10px;
          position: relative; transition: background 0.3s ease, border-color 0.3s ease;
        }
        .dk3-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.18) 70%, transparent 100%);
          pointer-events: none; z-index: 2;
        }
        .dk3-card::after {
          content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%);
          pointer-events: none; z-index: 2;
        }

        .dk3-card-hdr {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; position: relative;
        }
        .dk3-card-hdr::after {
          content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
          height: 1px; background: linear-gradient(90deg, currentColor, transparent); opacity: 0.12;
        }

        .dk3-num {
          font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: 900;
          padding: 2px 8px; border-radius: 6px; letter-spacing: 1px; flex-shrink: 0;
          position: relative; overflow: hidden;
        }
        .dk3-num::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          pointer-events: none;
        }

        .dk3-card-title { font-family: 'Exo 2', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.3px; }

        .dk3-row {
          display: flex; align-items: center; gap: 12px; padding: 10px 16px;
          position: relative; transition: background 0.2s;
        }

        .dk3-prompt {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; flex-shrink: 0;
          font-weight: 700; user-select: none; text-shadow: 0 0 8px currentColor;
        }
        .dk3-cmd {
          flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 12px;
          line-height: 1.6; word-break: break-all; letter-spacing: 0.2px;
        }

        .dk3-empty {
          text-align: center; padding: 80px 0;
          font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing: 3px;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px) translateZ(-20px); }
          to   { opacity: 1; transform: translateY(0) translateZ(0); }
        }
        .dk3-section { animation: slideIn 0.4s ease forwards; }
        .dk3-section:nth-child(1) { animation-delay: 0.05s; }
        .dk3-section:nth-child(2) { animation-delay: 0.10s; }
        .dk3-section:nth-child(3) { animation-delay: 0.15s; }
        .dk3-section:nth-child(4) { animation-delay: 0.20s; }
        .dk3-section:nth-child(5) { animation-delay: 0.25s; }
        .dk3-section:nth-child(6) { animation-delay: 0.30s; }
      `}</style>

      <div className="dk3-root">
        {/* ── Search ── */}
        <div className="dk3-search-wrap">
          <span
            className="dk3-search-icon"
            style={{
              color: isDark ? "rgba(13,183,237,0.4)" : "rgba(13,120,180,0.5)",
            }}
          >
            ⌕
          </span>
          <input
            className="dk3-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands or descriptions..."
            style={{
              background: search ? t.searchBgF : t.searchBg,
              border: `1px solid ${search ? t.searchBorderF : t.searchBorder}`,
              color: t.searchColor,
              boxShadow: search
                ? `0 0 24px ${isDark ? "rgba(13,183,237,0.15)" : "rgba(13,120,180,0.12)"}`
                : "none",
            }}
          />
          {search && (
            <button
              className="dk3-clear"
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
        <div className="dk3-cats">
          {allCategories.map((cat) => {
            const catData = categories.find((c) => c.label === cat);
            const isActive = activeCategory === cat;
            const col = catData?.color ?? "#0db7ed";
            return (
              <button
                key={cat}
                className="dk3-pill"
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg,${col}30,${col}15)`
                    : t.pillIdleBg,
                  borderColor: isActive ? `${col}70` : t.pillIdleBorder,
                  color: isActive ? col : t.pillIdleColor,
                  boxShadow: isActive
                    ? `0 4px 20px ${col}30,0 0 0 1px ${col}20,inset 0 1px 0 rgba(255,255,255,0.15)`
                    : "none",
                  transform: isActive ? "translateY(-1px)" : "none",
                  border: `1px solid ${isActive ? `${col}70` : t.pillIdleBorder}`,
                }}
              >
                {catData?.emoji ?? "✦"} {cat}
              </button>
            );
          })}
        </div>

        {/* ── Commands ── */}
        {filtered.length === 0 ? (
          <div className="dk3-empty" style={{ color: t.emptyColor }}>
            NO COMMANDS FOUND FOR "{search.toUpperCase()}"
          </div>
        ) : (
          grouped.map((group) => (
            <div className="dk3-section" key={group.label}>
              {/* Section header */}
              <div className="dk3-section-hdr">
                <span
                  className="dk3-section-label"
                  style={{ color: group.color }}
                >
                  {group.emoji} {group.label}
                </span>
                <div
                  className="dk3-section-line"
                  style={{
                    background: `linear-gradient(90deg,${group.color},transparent)`,
                  }}
                />
                <span
                  className="dk3-section-badge"
                  style={{
                    background: `${group.color}18`,
                    border: `1px solid ${group.color}35`,
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
                    className="dk3-card-hdr"
                    style={{
                      background: `linear-gradient(90deg,${group.color}14,transparent)`,
                    }}
                  >
                    <span
                      className="dk3-num"
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
                      className="dk3-card-title"
                      style={{ color: t.cardTitleColor }}
                    >
                      {cmd.title}
                    </span>
                  </div>

                  {/* Command rows */}
                  {cmd.commands.map((c, i) => (
                    <div
                      className="dk3-row"
                      key={i}
                      style={{ borderTop: `1px solid ${t.rowBorderTop}` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = t.rowHoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span
                        className="dk3-prompt"
                        style={{ color: group.color, opacity: 0.7 }}
                      >
                        $
                      </span>
                      <code
                        className="dk3-cmd"
                        style={{
                          color: i === 0 ? t.cmdPrimaryColor : t.cmdSecondColor,
                        }}
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

export default Docker;