import React, { useState, useMemo } from "react";
import { useTheme } from "../Themecontext";

interface Command {
  description: string;
  template: string;
  example?: string;
}

interface Category {
  label: string;
  icon: string;
  color: string;
  lightColor: string;
  commands: Command[];
}

const categories: Category[] = [
  {
    label: "Pods & Nodes",
    icon: "🧊",
    color: "#60a5fa",
    lightColor: "#2563eb",
    commands: [
      { description: "List all pods", template: "kubectl get pods" },
      {
        description: "List pods in all namespaces",
        template: "kubectl get pods -A",
      },
      {
        description: "List pods with more details",
        template: "kubectl get pods -o wide",
      },
      {
        description: "Describe a pod",
        template: "kubectl describe pod <pod-name>",
      },
      { description: "Resource usage of pods", template: "kubectl top pods" },
      { description: "List all nodes", template: "kubectl get nodes" },
      {
        description: "Describe a node",
        template: "kubectl describe node <node-name>",
      },
      { description: "Resource usage of nodes", template: "kubectl top nodes" },
    ],
  },
  {
    label: "Pod Management",
    icon: "⚙️",
    color: "#8b5cf6",
    lightColor: "#7c3aed",
    commands: [
      {
        description: "Run a pod",
        template: "kubectl run <pod-name> --image=<image>",
      },
      { description: "Watch pods", template: "kubectl get pods -w" },
      {
        description: "Delete a pod",
        template: "kubectl delete pod <pod-name>",
      },
      { description: "Delete all pods", template: "kubectl delete pods --all" },
      {
        description: "Filter pods by label (recommended)",
        template: "kubectl get pods -l <key>=<value>",
      },
      {
        description: "Apply configuration",
        template: "kubectl apply -f <file.yaml>",
      },
      {
        description: "Delete configuration",
        template: "kubectl delete -f <file.yaml>",
      },
    ],
  },
  {
    label: "Deployments",
    icon: "🚀",
    color: "#f43f5e",
    lightColor: "#e11d48",
    commands: [
      { description: "List deployments", template: "kubectl get deploy" },
      {
        description: "Describe deployment",
        template: "kubectl describe deploy <name>",
      },
      {
        description: "Scale deployment",
        template: "kubectl scale deploy <name> --replicas=3",
      },
      {
        description: "Rollout status of deployment",
        template: "kubectl rollout status deploy/<name>",
      },
      {
        description: "Rollout history",
        template: "kubectl rollout history deploy/<name>",
      },
      {
        description: "Undo last rollout",
        template: "kubectl rollout undo deploy/<name>",
      },
    ],
  },
  {
    label: "Services & Ingress",
    icon: "🌐",
    color: "#14b8a6",
    lightColor: "#0d9488",
    commands: [
      { description: "List services", template: "kubectl get svc" },
      {
        description: "Services with details",
        template: "kubectl get svc -o wide",
      },
      {
        description: "Describe service",
        template: "kubectl describe svc <service-name>",
      },
      { description: "List ingresses", template: "kubectl get ingress" },
      {
        description: "Describe ingress",
        template: "kubectl describe ingress <name>",
      },
    ],
  },
  {
    label: "Config & Storage",
    icon: "💾",
    color: "#f59e0b",
    lightColor: "#d97706",
    commands: [
      { description: "List ConfigMaps", template: "kubectl get configmap" },
      {
        description: "Describe ConfigMap",
        template: "kubectl describe configmap <name>",
      },
      { description: "List secrets", template: "kubectl get secret" },
      {
        description: "Describe secret",
        template: "kubectl describe secret <name>",
      },
      {
        description: "List PersistentVolumeClaims",
        template: "kubectl get pvc",
      },
      { description: "List PersistentVolumes", template: "kubectl get pv" },
      {
        description: "Describe PVC",
        template: "kubectl describe pvc <pvc-name>",
      },
      {
        description: "All resources in current ns",
        template: "kubectl get all",
      },
      {
        description: "All resources in all namespaces",
        template: "kubectl get all -A",
      },
    ],
  },
  {
    label: "Debug & Troubleshoot",
    icon: "🐞",
    color: "#ec4899",
    lightColor: "#db2777",
    commands: [
      { description: "View pod logs", template: "kubectl logs <pod-name>" },
      {
        description: "Follow pod logs",
        template: "kubectl logs -f <pod-name>",
      },
      {
        description: "Logs of a specific container",
        template: "kubectl logs <pod-name> -c <container>",
      },
      {
        description: "Open shell in pod",
        template: "kubectl exec -it <pod-name> -- sh",
      },
      {
        description: "Run command in pod",
        template: "kubectl exec <pod-name> <cmd>",
      },
      { description: "Show events", template: "kubectl get events" },
      {
        description: "Show labels",
        template: "kubectl get pods --show-labels",
      },
      {
        description: "Get help for a resource",
        template: "kubectl explain <resource>",
      },
      {
        description: "List all API resources",
        template: "kubectl api-resources",
      },
      {
        description: "Copy from pod",
        template: "kubectl cp <pod>:<path> <local-path>",
      },
      {
        description: "Copy to pod",
        template: "kubectl cp <local-path> <pod>:<path>",
      },
    ],
  },
  {
    label: "Namespaces",
    icon: "📁",
    color: "#34d399",
    lightColor: "#059669",
    commands: [
      { description: "List all namespaces", template: "kubectl get ns" },
      {
        description: "Namespaces with details",
        template: "kubectl get ns -o wide",
      },
      {
        description: "Create a namespace",
        template: "kubectl create ns <name>",
      },
      {
        description: "Delete a namespace",
        template: "kubectl delete ns <name>",
      },
      {
        description: "Pods in kube-system namespace",
        template: "kubectl get pods -n kube-system",
      },
      {
        description: "All resources in a namespace",
        template: "kubectl get all -n <namespace>",
      },
      {
        description: "Set current namespace",
        template:
          "kubectl config set-context --current --namespace=<namespace>",
      },
      {
        description: "View current context",
        template: "kubectl config view --minify",
      },
    ],
  },
  {
    label: "Shortcuts",
    icon: "⌨️",
    color: "#94a3b8",
    lightColor: "#64748b",
    commands: [
      { description: "Shortcut: pods", template: "po" },
      { description: "Shortcut: services", template: "svc" },
      { description: "Shortcut: deployments", template: "deploy" },
      { description: "Shortcut: replicasets", template: "rs" },
      { description: "Shortcut: configmaps", template: "cm" },
      { description: "Shortcut: secrets", template: "secret" },
      { description: "Shortcut: namespaces", template: "ns" },
      { description: "Shortcut: ingresses", template: "ing" },
      { description: "Shortcut: persistentvolumeclaims", template: "pvc" },
      { description: "Shortcut: persistentvolumes", template: "pv" },
      { description: "Shortcut: nodes", template: "node" },
    ],
  },
  {
    label: "EKS Cluster",
    icon: "☁",
    color: "#f87171",
    lightColor: "#dc2626",
    commands: [
      {
        description: "Create an EKS cluster",
        template:
          "eksctl create cluster <cluster-name> --region <region> --node-type <instance-type> --nodes <count>",
        example:
          "eksctl create cluster my-cluster --region ap-south-1 --node-type m7i-flex.large --nodes 2",
      },
    ],
  },
];
export const allCommands = categories.flatMap((cat) =>
  cat.commands.map((cmd) => ({
    ...cmd,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    categoryLightColor: cat.lightColor,
    categoryIcon: cat.icon,
  })),
);

interface ThemeStyles {
  bg: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  codeBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  tabBorder: string;
  tabBg: string;
  gridColor: string;
}

const getThemeStyles = (isDark: boolean): ThemeStyles => ({
  bg: isDark ? "#0c0c12" : "#f8f7ff",
  cardBg: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)",
  cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  headerBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
  codeBg: isDark ? "#0a0a0f" : "#f0eeff",
  textPrimary: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
  textSecondary: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  textMuted: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)",
  inputBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
  inputBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
  tabBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
  tabBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
  gridColor: isDark ? "rgba(167,139,250,0.025)" : "rgba(109,40,217,0.04)",
});

const CopyBtn: React.FC<{ text: string; color: string; isDark: boolean }> = ({
  text,
  color,
  isDark,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      style={{
        flexShrink: 0,
        background: copied ? `${color}22` : "transparent",
        border: `1px solid ${copied ? color : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"}`,
        borderRadius: 5,
        color: copied
          ? color
          : isDark
            ? "rgba(255,255,255,0.3)"
            : "rgba(0,0,0,0.3)",
        cursor: "pointer",
        padding: "3px 9px",
        fontSize: 10,
        fontFamily: "inherit",
        letterSpacing: 0.5,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {copied ? "✓" : "copy"}
    </button>
  );
};

const CommandCard: React.FC<{
  cmd: any;
  accentColor: string;
  showBadge?: boolean;
  t: ThemeStyles;
  isDark: boolean;
}> = ({ cmd, accentColor, showBadge, t, isDark }) => (
  <div
    style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span
        style={{ color: t.textSecondary, fontSize: 11, letterSpacing: 0.3 }}
      >
        {cmd.description}
      </span>
      {showBadge && cmd.categoryLabel && (
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 20,
            border: `1px solid ${(isDark ? cmd.categoryColor : cmd.categoryLightColor) + "55"}`,
            color: isDark ? cmd.categoryColor : cmd.categoryLightColor,
            background: `${isDark ? cmd.categoryColor : cmd.categoryLightColor}11`,
            letterSpacing: 0.4,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {cmd.categoryIcon} {cmd.categoryLabel}
        </span>
      )}
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: t.codeBg,
        border: `1px solid ${accentColor}33`,
        borderRadius: 7,
        padding: "8px 12px",
      }}
    >
      <span style={{ color: accentColor, fontWeight: 700, flexShrink: 0 }}>
        $
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12,
          color: t.textPrimary,
          wordBreak: "break-all",
        }}
      >
        {cmd.template.split(/(<[^>]+>)/g).map((part: string, i: number) =>
          part.startsWith("<") ? (
            <span
              key={i}
              style={{
                color: isDark ? "#fbbf24" : "#d97706",
                fontStyle: "italic",
              }}
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
      <CopyBtn text={cmd.template} color={accentColor} isDark={isDark} />
    </div>

    {cmd.example && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 7,
          background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.03)",
        }}
      >
        <span style={{ color: t.textMuted, fontSize: 10, flexShrink: 0 }}>
          eg
        </span>
        <span
          style={{
            flex: 1,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 11,
            color: t.textMuted,
            wordBreak: "break-all",
          }}
        >
          {cmd.example}
        </span>
        <CopyBtn
          text={cmd.example}
          color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
          isDark={isDark}
        />
      </div>
    )}
  </div>
);

export const Kubernates: React.FC = () => {
  const { isDark } = useTheme();
  const t = getThemeStyles(isDark);

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    const pool =
      active === "All"
        ? allCommands
        : allCommands.filter((c) => c.categoryLabel === active);
    return pool.filter(
      (c) =>
        c.description.toLowerCase().includes(q) ||
        c.template.toLowerCase().includes(q) ||
        c.example?.toLowerCase().includes(q),
    );
  }, [search, active]);

  const tabs = [
    { label: "All", icon: "✦ ✦", color: isDark ? "#a78bfa" : "#7c3aed" },
    ...categories.map((c) => ({
      label: c.label,
      icon: c.icon,
      color: isDark ? c.color : c.lightColor,
    })),
  ];

  const displayedCategories =
    active === "All"
      ? categories
      : categories.filter((c) => c.label === active);

  return (
    <div
      style={{
        background: t.bg,
        minHeight: "100vh",
        padding: "28px 20px 48px",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        boxSizing: "border-box",
        backgroundImage: `
          linear-gradient(${t.gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: t.inputBg,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 18,
          }}
        >
          <span style={{ color: t.textMuted, fontSize: 15 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Kubernetes commands..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
              fontFamily: "inherit",
              fontSize: 13,
              letterSpacing: 0.3,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "transparent",
                border: "none",
                color: t.textMuted,
                cursor: "pointer",
                fontSize: 14,
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 28,
          }}
        >
          {tabs.map((tab) => {
            const isActive = active === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActive(tab.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 999,
                  border: `1px solid ${isActive ? tab.color : t.tabBorder}`,
                  background: isActive ? `${tab.color}1a` : t.tabBg,
                  color: isActive ? tab.color : t.textSecondary,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: 0.4,
                  fontWeight: isActive ? 700 : 400,
                  transition: "all 0.18s",
                  outline: "none",
                  boxShadow: isActive ? `0 0 14px ${tab.color}25` : "none",
                }}
              >
                <span style={{ fontSize: tab.label === "All" ? 9 : 13 }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search results */}
        {search.trim() && filtered !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  color: t.textMuted,
                  textAlign: "center",
                  padding: "40px 0",
                  fontSize: 12,
                }}
              >
                No commands match "{search}"
              </div>
            ) : (
              filtered.map((cmd, i) => (
                <CommandCard
                  key={i}
                  cmd={cmd}
                  accentColor={
                    isDark ? cmd.categoryColor : cmd.categoryLightColor
                  }
                  showBadge={active === "All"}
                  t={t}
                  isDark={isDark}
                />
              ))
            )}
          </div>
        )}

        {/* Category cards */}
        {!search.trim() && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {displayedCategories.map((cat) => {
              const accent = isDark ? cat.color : cat.lightColor;
              return (
                <div
                  key={cat.label}
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 18px",
                      borderBottom: `1px solid ${t.cardBorder}`,
                      background: `${accent}08`,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{cat.icon}</span>
                    <span
                      style={{
                        color: accent,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 0.5,
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        color: t.textMuted,
                        fontSize: 11,
                      }}
                    >
                      {cat.commands.length} cmd
                      {cat.commands.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {cat.commands.map((cmd, i) => (
                      <CommandCard
                        key={i}
                        cmd={cmd}
                        accentColor={accent}
                        showBadge={false}
                        t={t}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: t.textMuted, fontSize: 11 }}>
            <span style={{ color: isDark ? "#fbbf24" : "#d97706" }}>
              &lt;param&gt;
            </span>{" "}
            = replace with your value
          </span>
          <span style={{ color: t.textMuted, fontSize: 11 }}>
            <span style={{ color: isDark ? "#a78bfa" : "#7c3aed" }}>$</span> =
            run in terminal
          </span>
        </div>
      </div>
    </div>
  );
};

export default Kubernates;
