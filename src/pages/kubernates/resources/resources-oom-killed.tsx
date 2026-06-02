import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "antd";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../Themecontext";

// ══════════════════════════════════════════════════════════════════
//  Constants
// ══════════════════════════════════════════════════════════════════
const MEM_REQUEST = 100; // Mi  — scheduler guarantee
const MEM_LIMIT = 150; // Mi  — kernel OOM-kill boundary
const MEM_STRESS = 155; // Mi  — what stress --vm-bytes 155M asks for
const CPU_REQUEST = 150; // m   — millicores
const CPU_LIMIT = 200; // m

// ══════════════════════════════════════════════════════════════════
//  Types
// ══════════════════════════════════════════════════════════════════
type PodPhase =
  | "Idle"
  | "Pending"
  | "Running"
  | "OOMKilled"
  | "CrashLoopBackOff";

interface LogEntry {
  id: number;
  text: string;
  variant: "header" | "ok" | "warn" | "err";
}

// ══════════════════════════════════════════════════════════════════
//  Style helpers
// ══════════════════════════════════════════════════════════════════
const mono = (size: number, color: string): React.CSSProperties => ({
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  fontSize: size,
  color,
});

const getPhaseColors = (
  phase: PodPhase,
  isDark: boolean
): { bg: string; fg: string; dot: string } => {
  const darkMap: Record<PodPhase, { bg: string; fg: string; dot: string }> = {
    Idle: { bg: "#1F2937", fg: "#9CA3AF", dot: "#6B7280" },
    Pending: { bg: "#1E3A5F", fg: "#93C5FD", dot: "#3B82F6" },
    Running: { bg: "#064E3B", fg: "#6EE7B7", dot: "#10B981" },
    OOMKilled: { bg: "#7F1D1D", fg: "#FCA5A5", dot: "#EF4444" },
    CrashLoopBackOff: { bg: "#78350F", fg: "#FCD34D", dot: "#F59E0B" },
  };

  const lightMap: Record<PodPhase, { bg: string; fg: string; dot: string }> = {
    Idle: { bg: "#F3F4F6", fg: "#4B5563", dot: "#9CA3AF" },
    Pending: { bg: "#EFF6FF", fg: "#1D4ED8", dot: "#3B82F6" },
    Running: { bg: "#ECFDF5", fg: "#047857", dot: "#10B981" },
    OOMKilled: { bg: "#FEF2F2", fg: "#B91C1C", dot: "#EF4444" },
    CrashLoopBackOff: { bg: "#FFFBEB", fg: "#B45309", dot: "#F59E0B" },
  };

  return isDark ? darkMap[phase] : lightMap[phase];
};

// ══════════════════════════════════════════════════════════════════
//  ResourceBar
// ══════════════════════════════════════════════════════════════════
function ResourceBar({
  label,
  used,
  request,
  limit,
  unit,
  isDark,
}: {
  label: string;
  used: number;
  request: number;
  limit: number;
  unit: string;
  isDark: boolean;
}) {
  const pct = Math.min((used / limit) * 100, 100);
  const reqPct = (request / limit) * 100;
  const overLimit = used > limit;
  const barColor = overLimit ? "#EF4444" : pct > 80 ? "#F59E0B" : "#34D399";

  const textMuted = isDark ? "#9CA3AF" : "#64748B";
  const textValue = overLimit ? "#EF4444" : isDark ? "#E2E8F0" : "#0F172A";
  const slashColor = isDark ? "#4B5563" : "#94A3B8";
  const trackBg = isDark ? "#111827" : "#E2E8F0";
  const trackBorder = isDark ? "#1F2937" : "#CBD5E1";

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span style={mono(11, textMuted)}>{label}</span>
        <span style={mono(11, overLimit ? "#EF4444" : textMuted)}>
          <span style={{ color: textValue }}>
            {used}
            {unit}
          </span>
          <span style={{ color: slashColor }}>
            {" "}
            / {limit}
            {unit}
          </span>
          {overLimit && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                color: "#EF4444",
                fontWeight: 700,
              }}
            >
              ⚠ exceeds limit
            </span>
          )}
        </span>
      </div>

      {/* track */}
      <div
        style={{
          position: "relative",
          height: 18,
          background: trackBg,
          borderRadius: 4,
          border: `1px solid ${trackBorder}`,
        }}
      >
        {/* request zone tint */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: `${reqPct}%`,
            background: "rgba(52,211,153,0.12)",
            borderRadius: "3px 0 0 3px",
          }}
        />
        {/* usage fill */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 3,
            transition: "width 120ms linear, background 350ms ease",
          }}
        />
        {/* request marker */}
        <div
          style={{
            position: "absolute",
            left: `${reqPct}%`,
            top: -3,
            bottom: -3,
            width: 1.5,
            background: "#34D399",
            opacity: isDark ? 0.7 : 1,
          }}
        />
        {/* limit marker (right edge) */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: -3,
            bottom: -3,
            width: 2,
            background: "#EF4444",
            opacity: 0.9,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <span style={mono(10, isDark ? "#34D39970" : "#059669")}>
          request {request}
          {unit}
        </span>
        <span style={mono(10, isDark ? "#EF444470" : "#DC2626")}>
          limit {limit}
          {unit}
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  PhaseBadge
// ══════════════════════════════════════════════════════════════════
function PhaseBadge({ phase, isDark }: { phase: PodPhase; isDark: boolean }) {
  const cfg = getPhaseColors(phase, isDark);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px 3px 8px",
        background: cfg.bg,
        borderRadius: 4,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        fontWeight: 700,
        color: cfg.fg,
        border: `1px solid ${cfg.fg}20`,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: cfg.dot,
          ...(phase === "Running"
            ? { animation: "k8s-blink 1.2s ease-in-out infinite" }
            : phase === "OOMKilled"
              ? { animation: "k8s-blink 0.5s ease-in-out infinite" }
              : {}),
        }}
      />
      {phase}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Terminal
// ══════════════════════════════════════════════════════════════════
function Terminal({
  entries,
  isDark,
}: {
  entries: LogEntry[];
  isDark: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const varColor: Record<LogEntry["variant"], string> = {
    header: isDark ? "#60A5FA" : "#2563EB",
    ok: isDark ? "#34D399" : "#059669",
    warn: isDark ? "#FBBF24" : "#D97706",
    err: isDark ? "#EF4444" : "#DC2626",
  };

  const bg = isDark ? "#0D1117" : "#F8FAFC";
  const border = isDark ? "#21262D" : "#E2E8F0";
  const prompt = isDark ? "#4B5563" : "#94A3B8";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: "14px 18px",
        minHeight: 120,
        maxHeight: 240,
        overflowY: "auto",
      }}
    >
      <div style={{ ...mono(11, prompt), marginBottom: 8 }}>
        $ kubectl get po -w
      </div>
      {entries.length === 0 && (
        <div
          style={{
            ...mono(11, isDark ? "#374151" : "#CBD5E1"),
            fontStyle: "italic",
          }}
        >
          — press Run simulation to start —
        </div>
      )}
      {entries.map((e) => (
        <div
          key={e.id}
          style={{ ...mono(12, varColor[e.variant]), lineHeight: 1.9 }}
        >
          {e.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  YamlViewer
// ══════════════════════════════════════════════════════════════════
function YamlViewer({ isDark }: { isDark: boolean }) {
  // Mapping YAML syntax colors for Dark and Light mode
  const col = {
    k1: isDark ? "#C3E88D" : "#059669", // key level 1
    k2: isDark ? "#82AAFF" : "#2563EB", // key level 2
    k3: isDark ? "#FFCB6B" : "#D97706", // key level 3
    val: isDark ? "#E2E8F0" : "#0F172A", // plain string value
    str: isDark ? "#89DDFF" : "#0891B2", // quoted/image string
    err: isDark ? "#FF5370" : "#DC2626", // error string
    ok: isDark ? "#6EE7B7" : "#047857", // positive value
    warn: isDark ? "#F87171" : "#B91C1C", // warning key
    warnVal: isDark ? "#FCA5A5" : "#EF4444", // warning value
  };

  const lines: Array<{ text: string; color: string }> = [
    { text: "apiVersion: v1", color: col.k1 },
    { text: "kind: Pod", color: col.k2 },
    { text: "metadata:", color: col.k3 },
    { text: "  name: pod-stress", color: col.val },
    { text: "  labels:", color: col.val },
    { text: "    env: dev", color: col.val },
    { text: "spec:", color: col.k3 },
    { text: "  containers:", color: col.val },
    { text: "    - name: my-cont-stress", color: col.val },
    { text: "      image: polinux/stress", color: col.str },
    { text: "      ports:", color: col.val },
    { text: "        - containerPort: 80", color: col.val },
    { text: '      command: ["stress", "--vm", "1",', color: col.k1 },
    { text: '               "--vm-bytes", "155M"]', color: col.err },
    { text: "      resources:", color: col.k3 },
    { text: "        requests:", color: col.k2 },
    { text: '          cpu: "150m"', color: col.ok },
    { text: "          memory: 100Mi", color: col.ok },
    { text: "        limits:", color: col.warn },
    { text: '          cpu: "200m"', color: col.warnVal },
    { text: "          memory: 150Mi", color: col.err },
  ];

  return (
    <div>
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          background: isDark ? "#0D1117" : "#F8FAFC",
          border: `1px solid ${isDark ? "#21262D" : "#E2E8F0"}`,
          borderRadius: 8,
          overflowX: "auto",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 12,
          lineHeight: 1.75,
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.color }}>
            {l.text}
          </div>
        ))}
      </pre>
      <div
        style={{
          marginTop: 8,
          padding: "8px 12px",
          background: isDark ? "#7F1D1D22" : "#FEF2F2",
          border: `1px solid ${isDark ? "#EF444430" : "#FECACA"}`,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 11,
          color: isDark ? "#FCA5A5" : "#B91C1C",
          lineHeight: 1.6,
        }}
      >
        ⚠ stress requests <strong style={{ color: "#EF4444" }}>155Mi</strong>{" "}
        but memory.limit = <strong style={{ color: "#EF4444" }}>150Mi</strong> →
        kernel OOM-kills the container on every start
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Architecture diagram
// ══════════════════════════════════════════════════════════════════
function ArchFlow({ isDark }: { isDark: boolean }) {
  return (
    <div style={{ padding: "4px 0 8px" }}>
      {/* Pod → Worker Node */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            textAlign: "center",
            border: `1px solid ${isDark ? "#3B82F650" : "#BFDBFE"}`,
            background: isDark ? "#1E3A5F22" : "#EFF6FF",
          }}
        >
          <div style={mono(12, isDark ? "#93C5FD" : "#2563EB")}>Pod</div>
          <div style={mono(10, isDark ? "#93C5FD80" : "#60A5FA")}>
            pod-stress
          </div>
        </div>
        <span style={{ color: isDark ? "#374151" : "#94A3B8", fontSize: 18 }}>
          →
        </span>
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            textAlign: "center",
            border: `1px solid ${isDark ? "#A78BFA50" : "#DDD6FE"}`,
            background: isDark ? "#2E1F5E22" : "#F5F3FF",
          }}
        >
          <div style={mono(12, isDark ? "#C4B5FD" : "#7C3AED")}>
            Worker Node
          </div>
          <div style={mono(10, isDark ? "#C4B5FD80" : "#A78BFA")}>
            placed via requests
          </div>
        </div>
      </div>

      {/* Requests / Limits */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div
          style={{
            border: `1px solid ${isDark ? "#34D39930" : "#A7F3D0"}`,
            borderRadius: 8,
            padding: "10px 12px",
            background: isDark ? "#064E3B18" : "#ECFDF5",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: isDark ? "#34D399" : "#059669",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            REQUESTS
          </div>
          <div style={mono(11, isDark ? "#6EE7B7" : "#047857")}>
            cpu &nbsp;&nbsp; 150m
          </div>
          <div style={mono(11, isDark ? "#6EE7B7" : "#047857")}>
            memory 100Mi
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              padding: "3px 6px",
              borderRadius: 4,
              background: isDark ? "#34D39920" : "#D1FAE5",
              color: isDark ? "#6EE7B7" : "#047857",
            }}
          >
            scheduler uses this
          </div>
        </div>
        <div
          style={{
            border: `1px solid ${isDark ? "#EF444430" : "#FECACA"}`,
            borderRadius: 8,
            padding: "10px 12px",
            background: isDark ? "#7F1D1D18" : "#FEF2F2",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: isDark ? "#F87171" : "#DC2626",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            LIMITS
          </div>
          <div style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
            cpu &nbsp;&nbsp; 200m
          </div>
          <div style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
            memory 150Mi
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              padding: "3px 6px",
              borderRadius: 4,
              background: isDark ? "#EF444420" : "#FEE2E2",
              color: isDark ? "#FCA5A5" : "#B91C1C",
            }}
          >
            runtime enforced
          </div>
        </div>
      </div>

      {/* Enforcement legend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 10,
        }}
      >
        <div
          style={{
            ...mono(10, isDark ? "#34D39980" : "#05966980"),
            textAlign: "center",
          }}
        >
          CPU exceed → throttle
        </div>
        <div
          style={{
            ...mono(10, isDark ? "#EF444480" : "#DC262680"),
            textAlign: "center",
          }}
        >
          Memory exceed → OOMKill
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Callout
// ══════════════════════════════════════════════════════════════════
function Callout({
  accent,
  title,
  isDark,
  children,
}: {
  accent: string;
  title: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${accent}`,
        paddingLeft: 14,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 14,
        background: `${accent}15`,
        borderRadius: "0 6px 6px 0",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: accent,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          color: isDark ? "#9CA3AF" : "#475569",
          lineHeight: 1.65,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  SectionLabel / Stat
// ══════════════════════════════════════════════════════════════════
function SectionLabel({
  children,
  isDark,
  style,
}: {
  children: React.ReactNode;
  isDark: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: isDark ? "#6B7280" : "#64748B",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  isDark,
  danger = false,
}: {
  label: string;
  value: string | number;
  isDark: boolean;
  danger?: boolean;
}) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={mono(10, isDark ? "#6B7280" : "#64748B")}>{label}</div>
      <div
        style={mono(
          15,
          danger ? "#EF4444" : isDark ? "#E2E8F0" : "#0F172A"
        )}
      >
        {value}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Main component
// ══════════════════════════════════════════════════════════════════
export default function ResourceOOMKilled() {
  const { isDark } = useTheme();

  const [phase, setPhase] = useState<PodPhase>("Idle");
  const [memUsed, setMemUsed] = useState(0);
  const [cpuUsed, setCpuUsed] = useState(0);
  const [restarts, setRestarts] = useState(0);
  const [ageSec, setAgeSec] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [simActive, setSimActive] = useState(false);

  const logId = useRef(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const memTick = useRef<ReturnType<typeof setInterval> | null>(null);
  const ageTick = useRef<ReturnType<typeof setInterval> | null>(null);

  const log = useCallback((text: string, variant: LogEntry["variant"]) => {
    logId.current += 1;
    setLogs((prev) => [...prev, { id: logId.current, text, variant }]);
  }, []);

  const stopTimers = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    if (memTick.current) {
      clearInterval(memTick.current);
      memTick.current = null;
    }
    if (ageTick.current) {
      clearInterval(ageTick.current);
      ageTick.current = null;
    }
  }, []);

  const resetAll = useCallback(() => {
    stopTimers();
    setPhase("Idle");
    setMemUsed(0);
    setCpuUsed(0);
    setRestarts(0);
    setAgeSec(0);
    setLogs([]);
    setSimActive(false);
  }, [stopTimers]);

  const runSimulation = useCallback(() => {
    resetAll();
    setSimActive(true);

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeouts.current.push(t);
    };

    // Age counter
    ageTick.current = setInterval(() => setAgeSec((s) => s + 1), 1000);

    // t=200ms — print header
    schedule(() => {
      log("NAME         READY   STATUS      RESTARTS     AGE", "header");
    }, 200);

    // t=600ms — Pending
    schedule(() => {
      setPhase("Pending");
      log("pod-stress   0/1     Pending     0            0s", "ok");
    }, 600);

    // t=1400ms — Running, start memory + cpu ramp
    schedule(() => {
      setPhase("Running");
      setCpuUsed(110);
      log("pod-stress   1/1     Running     0            1s", "ok");

      let mem = 25;
      memTick.current = setInterval(() => {
        mem = Math.min(mem + 9, MEM_STRESS);
        setMemUsed(mem);
        setCpuUsed((c) => Math.min(c + 7, CPU_LIMIT));
      }, 110);
    }, 1400);

    // t=3800ms — OOMKilled (155Mi > 150Mi limit)
    schedule(() => {
      if (memTick.current) {
        clearInterval(memTick.current);
        memTick.current = null;
      }
      setMemUsed(MEM_STRESS);
      setCpuUsed(0);
      setPhase("OOMKilled");
      setRestarts(1);
      log("pod-stress   0/1     OOMKilled   1 (4s ago)   5s", "err");
    }, 3800);

    // t=5200ms — CrashLoopBackOff
    schedule(() => {
      setPhase("CrashLoopBackOff");
      log("pod-stress   0/1     CrashLoopBackOff   1 (11s ago)   14s", "warn");
    }, 5200);

    // t=6800ms — OOMKilled again
    schedule(() => {
      setPhase("OOMKilled");
      setRestarts(2);
      log("pod-stress   0/1     OOMKilled          2 (12s ago)   15s", "err");
    }, 6800);

    // t=8500ms — final CrashLoopBackOff
    schedule(() => {
      setPhase("CrashLoopBackOff");
      log("pod-stress   0/1     CrashLoopBackOff   2 (20s ago)   30s", "warn");
      if (ageTick.current) {
        clearInterval(ageTick.current);
        ageTick.current = null;
      }
      setSimActive(false);
    }, 8500);
  }, [resetAll, log]);

  // Cleanup on unmount
  useEffect(() => () => stopTimers(), [stopTimers]);

  // Theme Variables
  const bgMain = isDark ? "transparent" : "transparent"; // Let parent container handle background mostly, or force it.
  const textHeading = isDark ? "#F8FAFC" : "#0F172A";
  const textSub = isDark ? "#9CA3AF" : "#475569";
  const panelBg = isDark ? "#111827" : "#FFFFFF";
  const panelBorder = isDark ? "#1F2937" : "#E2E8F0";

  return (
    <>
      <style>{`
        @keyframes k8s-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
      `}</style>

      <div
        style={{
          background: bgMain,
          padding: "16px 0px",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <header style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: textHeading,
            }}
          >
            Kubernetes — Resource Requests &amp; Limits
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: textSub }}>
            Interactive demo · why{" "}
            <code style={mono(11, isDark ? "#FBBF24" : "#D97706")}>
              stress --vm-bytes 155M
            </code>{" "}
            triggers OOMKilled when{" "}
            <code style={mono(11, isDark ? "#EF4444" : "#DC2626")}>
              memory.limits = 150Mi
            </code>
          </p>
        </header>

        {/* ── Two-column grid ────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            marginBottom: 28,
          }}
        >
          {/* ── LEFT: architecture + live gauges ─────────── */}
          <div>
            <SectionLabel isDark={isDark}>Architecture</SectionLabel>
            <ArchFlow isDark={isDark} />

            <SectionLabel isDark={isDark} style={{ marginTop: 24 }}>
              Live pod metrics
            </SectionLabel>

            {/* Status row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 14px",
                marginBottom: 16,
                background: panelBg,
                border: `1px solid ${panelBorder}`,
                borderRadius: 8,
                boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <div style={mono(10, isDark ? "#6B7280" : "#64748B")}>
                  status
                </div>
                <PhaseBadge phase={phase} isDark={isDark} />
              </div>
              <div style={{ flex: 1 }} />
              <Stat
                label="restarts"
                value={restarts}
                danger={restarts > 0}
                isDark={isDark}
              />
              <Stat label="age" value={`${ageSec}s`} isDark={isDark} />
            </div>

            <ResourceBar
              label="memory"
              used={memUsed}
              request={MEM_REQUEST}
              limit={MEM_LIMIT}
              unit="Mi"
              isDark={isDark}
            />
            <ResourceBar
              label="cpu"
              used={cpuUsed}
              request={CPU_REQUEST}
              limit={CPU_LIMIT}
              unit="m"
              isDark={isDark}
            />

            {/* Controls (Using Ant Design) */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Button
                type="primary"
                onClick={runSimulation}
                disabled={simActive}
                icon={simActive ? <LoadingOutlined /> : <PlayCircleOutlined />}
                style={{
                  flex: 1,
                  height: 40,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {simActive ? "Simulating…" : "Run simulation"}
              </Button>
              <Button
                onClick={resetAll}
                icon={<ReloadOutlined />}
                style={{
                  height: 40,
                  width: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </div>
          </div>

          {/* ── RIGHT: YAML + explanation ─────────────────── */}
          <div>
            <SectionLabel isDark={isDark}>Pod specification</SectionLabel>
            <YamlViewer isDark={isDark} />

            <SectionLabel isDark={isDark} style={{ marginTop: 20 }}>
              Why it happens
            </SectionLabel>
            <Callout
              accent={isDark ? "#34D399" : "#059669"}
              title="requests — placement guarantee"
              isDark={isDark}
            >
              The scheduler needs at least{" "}
              <code style={mono(11, isDark ? "#6EE7B7" : "#047857")}>
                100Mi
              </code>{" "}
              free on a node before placing this pod. Once running, the
              container can exceed this freely — it is NOT a cap.
            </Callout>
            <Callout
              accent={isDark ? "#F87171" : "#DC2626"}
              title="limits — runtime enforcement"
              isDark={isDark}
            >
              <code style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
                memory: 150Mi
              </code>{" "}
              is enforced by the Linux kernel cgroup. When the container crosses
              it the kernel sends{" "}
              <code style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
                SIGKILL
              </code>{" "}
              → pod shows <strong>OOMKilled</strong>. CPU just throttles — no
              kill.
            </Callout>
            <Callout
              accent={isDark ? "#FBBF24" : "#D97706"}
              title="the crash loop"
              isDark={isDark}
            >
              stress asks for <strong>155Mi (&gt; 150Mi limit)</strong> every
              time it starts, so it dies every restart. Kubernetes backs off
              exponentially:{" "}
              <strong>OOMKilled → CrashLoopBackOff → OOMKilled…</strong>
            </Callout>
          </div>
        </div>

        {/* ── kubectl terminal ───────────────────────────── */}
        <SectionLabel isDark={isDark}>kubectl get po -w</SectionLabel>
        <Terminal entries={logs} isDark={isDark} />

        {/* ── Fix guide ──────────────────────────────────── */}
        <div
          style={{
            marginTop: 24,
            border: `1px solid ${isDark ? "#34D39930" : "#A7F3D0"}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              background: isDark ? "#064E3B30" : "#ECFDF5",
              borderBottom: `1px solid ${isDark ? "#34D39920" : "#D1FAE5"}`,
              fontSize: 13,
              fontWeight: 700,
              color: isDark ? "#34D399" : "#059669",
            }}
          >
            ✅ How to fix OOMKilled
          </div>
          <pre
            style={{
              margin: 0,
              padding: "14px 18px",
              background: isDark ? "#0D1117" : "#F8FAFC",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: isDark ? "#6EE7B7" : "#047857",
              lineHeight: 1.85,
              overflowX: "auto",
            }}
          >
            {`# Option A — raise the memory limit above what stress requests
limits:
  cpu: "200m"
  memory: 200Mi    # 155M < 200Mi ✓  no OOMKilled

# Option B — reduce stress bytes to stay inside the existing limit
command: ["stress", "--vm", "1", "--vm-bytes", "120M"]
#  120Mi < 150Mi ✓  pod stays Running`}
          </pre>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useCallback, useRef, useEffect } from "react";
// import { useTheme } from "../../../Themecontext";

// // ── Color tokens ───────────────────────────────────────────────────────────
// const ACCENT = "#e11d48";
// const ACCENT_DIM = "rgba(225,29,72,0.13)";
// const ACCENT_BORDER = "rgba(225,29,72,0.28)";
// const ACCENT_SHADOW = "rgba(225,29,72,0.40)";
// const AMBER = "#f59e0b";
// const AMBER_DIM = "rgba(245,158,11,0.13)";
// const AMBER_BORDER = "rgba(245,158,11,0.28)";
// const GREEN = "#22c55e";
// const GREEN_DIM = "rgba(34,197,94,0.13)";
// const GREEN_BORDER = "rgba(34,197,94,0.28)";
// const BLUE = "#326CE5";
// const BLUE_DIM = "rgba(50,108,229,0.13)";
// const BLUE_BORDER = "rgba(50,108,229,0.28)";

// // ── Styles ─────────────────────────────────────────────────────────────────
// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Rajdhani:wght@500;600;700&display=swap');

//   .oom-mem-fill {
//     transition: width 0.28s ease, background 0.4s ease;
//   }
//   @keyframes oom-pulse {
//     0%,100% { box-shadow: 0 0 0 0 rgba(225,29,72,0); }
//     50%     { box-shadow: 0 0 0 10px rgba(225,29,72,0.18); }
//   }
//   @keyframes oom-shake {
//     0%,100% { transform: translateX(0); }
//     20%     { transform: translateX(-6px); }
//     40%     { transform: translateX(6px); }
//     60%     { transform: translateX(-4px); }
//     80%     { transform: translateX(3px); }
//   }
//   @keyframes oom-blink {
//     0%,100% { opacity: 1; }
//     50%     { opacity: 0.3; }
//   }
//   @keyframes oom-appear {
//     from { opacity: 0; transform: translateY(6px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   .oom-critical { animation: oom-pulse 1.1s ease infinite; }
//   .oom-shake    { animation: oom-shake 0.45s ease; }
//   .oom-blink    { animation: oom-blink 0.75s ease infinite; }
//   .oom-appear   { animation: oom-appear 0.35s ease forwards; }
// `;

// // ── Types ──────────────────────────────────────────────────────────────────
// interface Process {
//   pid: number;
//   name: string;
//   mem: number;
//   oomScore: number;
//   status: "running" | "killed";
// }

// type SimPhase = "idle" | "growing" | "oom" | "killed";

// // ── Helpers ────────────────────────────────────────────────────────────────
// const fmtMiB = (n: number) => `${Math.round(n)} MiB`;

// const LIMIT_MIB = 256;
// const REQUEST_MIB = 128;

// const INITIAL_PROCS: Process[] = [
//   { pid: 1, name: "node server", mem: 48, oomScore: 120, status: "running" },
//   {
//     pid: 42,
//     name: "mongoose worker",
//     mem: 32,
//     oomScore: 200,
//     status: "running",
//   },
//   {
//     pid: 87,
//     name: "express handler",
//     mem: 22,
//     oomScore: 300,
//     status: "running",
//   },
//   { pid: 104, name: "cache-layer", mem: 16, oomScore: 800, status: "running" },
// ];

// // ── CopyButton ─────────────────────────────────────────────────────────────
// function CopyButton({ text, isDark }: { text: string; isDark: boolean }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button
//       onClick={() => {
//         navigator.clipboard.writeText(text).catch(() => {});
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1500);
//       }}
//       style={{
//         position: "absolute",
//         top: 10,
//         right: 10,
//         fontFamily: "'Space Mono', monospace",
//         fontSize: 9,
//         padding: "3px 9px",
//         borderRadius: 5,
//         cursor: "pointer",
//         background: copied
//           ? GREEN_DIM
//           : isDark
//             ? "rgba(255,255,255,0.06)"
//             : "rgba(0,0,0,0.05)",
//         color: copied ? GREEN : isDark ? "#94a3b8" : "#64748b",
//         border: `1px solid ${copied ? GREEN_BORDER : "rgba(100,116,139,0.2)"}`,
//         transition: "all 0.2s",
//       }}
//     >
//       {copied ? "✓ COPIED" : "COPY"}
//     </button>
//   );
// }

// // ── SectionHeader ──────────────────────────────────────────────────────────
// function SectionHeader({
//   title,
//   subtitle,
//   isDark,
// }: {
//   title: string;
//   subtitle: string;
//   isDark: boolean;
// }) {
//   return (
//     <div style={{ marginBottom: 18 }}>
//       <p
//         style={{
//           fontFamily: "'Rajdhani', sans-serif",
//           fontWeight: 700,
//           fontSize: 24,
//           color: isDark ? "#f1f5f9" : "#0f172a",
//           margin: "0 0 2px",
//         }}
//       >
//         {title}
//       </p>
//       <p
//         style={{
//           fontFamily: "'Space Mono', monospace",
//           fontSize: 10,
//           color: isDark ? "#475569" : "#94a3b8",
//           margin: 0,
//         }}
//       >
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// // ── CodeBlock ──────────────────────────────────────────────────────────────
// function CodeBlock({ code, isDark }: { code: string; isDark: boolean }) {
//   return (
//     <div style={{ position: "relative" }}>
//       <CopyButton text={code} isDark={isDark} />
//       <pre
//         style={{
//           margin: 0,
//           padding: "16px 48px 16px 18px",
//           borderRadius: 12,
//           background: isDark ? "#070d1a" : "#1e293b",
//           color: "#e2e8f0",
//           fontFamily: "'Space Mono', monospace",
//           fontSize: 12,
//           lineHeight: 1.8,
//           overflowX: "auto",
//         }}
//       >
//         <code>{code}</code>
//       </pre>
//     </div>
//   );
// }

// // ── MemBar ─────────────────────────────────────────────────────────────────
// function MemBar({
//   used,
//   limit,
//   request,
//   isDark,
// }: {
//   used: number;
//   limit: number;
//   request: number;
//   isDark: boolean;
// }) {
//   const pct = Math.min((used / limit) * 100, 100);
//   const reqPct = Math.min((request / limit) * 100, 100);
//   const color = pct < 70 ? GREEN : pct < 90 ? AMBER : ACCENT;

//   return (
//     <div>
//       <div
//         style={{
//           height: 34,
//           borderRadius: 8,
//           overflow: "hidden",
//           position: "relative",
//           background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
//           border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
//         }}
//       >
//         {/* Request line */}
//         <div
//           style={{
//             position: "absolute",
//             top: 0,
//             bottom: 0,
//             left: `${reqPct}%`,
//             width: 2,
//             background: BLUE,
//             opacity: 0.55,
//             zIndex: 2,
//           }}
//         />
//         {/* Fill */}
//         <div
//           className="oom-mem-fill"
//           style={{
//             width: `${pct}%`,
//             height: "100%",
//             background: `linear-gradient(90deg, ${color}bb, ${color})`,
//             borderRadius: 8,
//             position: "relative",
//           }}
//         >
//           {pct > 12 && (
//             <span
//               style={{
//                 position: "absolute",
//                 right: 10,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 fontFamily: "'Space Mono', monospace",
//                 fontSize: 11,
//                 fontWeight: 700,
//                 color: "white",
//               }}
//             >
//               {fmtMiB(used)}
//             </span>
//           )}
//         </div>
//       </div>
//       <div style={{ display: "flex", gap: 16, marginTop: 7 }}>
//         {[
//           { c: BLUE, label: `Request: ${fmtMiB(request)}` },
//           { c: color, label: `Used: ${fmtMiB(used)}` },
//           {
//             c: isDark ? "#334155" : "#cbd5e1",
//             label: `Limit: ${fmtMiB(limit)}`,
//           },
//         ].map(({ c, label }) => (
//           <div
//             key={label}
//             style={{ display: "flex", alignItems: "center", gap: 5 }}
//           >
//             <div
//               style={{ width: 8, height: 8, borderRadius: 2, background: c }}
//             />
//             <span
//               style={{
//                 fontFamily: "'Space Mono', monospace",
//                 fontSize: 10,
//                 color: isDark ? "#64748b" : "#94a3b8",
//               }}
//             >
//               {label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────
// export default function ResourceOOMKilled() {
//   const { isDark } = useTheme();

//   const bg = isDark ? "#020617" : "#f8fafc";
//   const cardBg = isDark ? "rgba(15,23,42,0.92)" : "#ffffff";
//   const textTitle = isDark ? "#f1f5f9" : "#0f172a";
//   const textMuted = isDark ? "#94a3b8" : "#475569";
//   const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

//   // ── Simulator state ──────────────────────────────────────────────────────
//   const [phase, setPhase] = useState<SimPhase>("idle");
//   const [procs, setProcs] = useState<Process[]>(INITIAL_PROCS);
//   const [totalMem, setTotalMem] = useState(
//     INITIAL_PROCS.reduce((s, p) => s + p.mem, 0),
//   );
//   const [oomLog, setOomLog] = useState<string[]>([]);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const resetSim = useCallback(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     setPhase("idle");
//     setProcs(INITIAL_PROCS);
//     setTotalMem(INITIAL_PROCS.reduce((s, p) => s + p.mem, 0));
//     setOomLog([]);
//   }, []);

//   const startSim = useCallback(() => {
//     if (phase !== "idle") return;
//     setPhase("growing");
//     setOomLog([]);

//     timerRef.current = setInterval(() => {
//       setProcs((prev) => {
//         const next = prev.map((p) => {
//           if (p.status === "killed") return p;
//           const growth = p.pid === 42 ? 15 : p.pid === 1 ? 6 : 2;
//           return { ...p, mem: p.mem + growth };
//         });
//         const total = next
//           .filter((p) => p.status === "running")
//           .reduce((s, p) => s + p.mem, 0);
//         setTotalMem(total);

//         if (total >= LIMIT_MIB * 0.97) {
//           setPhase("oom");
//           if (timerRef.current) clearInterval(timerRef.current);
//           setTimeout(() => {
//             setProcs((p) =>
//               p.map((proc) =>
//                 proc.pid === 42 ? { ...proc, status: "killed" as const } : proc,
//               ),
//             );
//             setTotalMem((prev) => {
//               const killed = next.find((p) => p.pid === 42);
//               return Math.max(0, prev - (killed?.mem ?? 0));
//             });
//             setOomLog([
//               "[ 8432.110] node invoked oom-killer: gfp_mask=0x1100cca, order=0, oom_score_adj=0",
//               "[ 8432.111] Mem-Info: Node 0 DMA32: total 262144kB, free 1024kB",
//               "[ 8432.112] Tasks state (memory values in pages):",
//               "[ 8432.113]   pid  uid  tgid  total_vm  rss  oom_score  name",
//               "[ 8432.114]     1    0     1    12288  4864       120  node server",
//               "[ 8432.114]    42    0    42    65536 53248       200  mongoose worker",
//               "[ 8432.115]    87    0    87     8192  5632       300  express handler",
//               "[ 8432.115]   104    0   104     4096  2048       800  cache-layer",
//               "[ 8432.116] Out of memory: Kill process 42 (mongoose) score 200 or sacrifice child",
//               "[ 8432.117] Killed process 42 (mongoose worker) total-vm:65536kB, anon-rss:53248kB",
//             ]);
//             setPhase("killed");
//           }, 550);
//         }
//         return next;
//       });
//     }, 300);
//   }, [phase]);

//   useEffect(
//     () => () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     },
//     [],
//   );

//   const pctUsed = Math.min((totalMem / LIMIT_MIB) * 100, 100);
//   const barColor = pctUsed < 70 ? GREEN : pctUsed < 90 ? AMBER : ACCENT;

//   // ── Render ───────────────────────────────────────────────────────────────
//   return (
//     <div style={{ padding: "24px 0 80px", backgroundColor: bg }}>
//       <style>{STYLES}</style>
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
//         {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div
//           style={{
//             position: "relative",
//             borderRadius: 20,
//             overflow: "hidden",
//             marginBottom: 36,
//             padding: "28px 32px",
//             backgroundColor: cardBg,
//             border: `1px solid ${ACCENT_BORDER}`,
//             boxShadow: isDark
//               ? `0 8px 40px rgba(0,0,0,0.5)`
//               : `0 4px 32px rgba(225,29,72,0.10)`,
//           }}
//         >
//           {/* Stripe */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               height: 3,
//               background: "linear-gradient(90deg, #be123c, #e11d48, #fb7185)",
//             }}
//           />
//           {/* Glow */}
//           <div
//             style={{
//               position: "absolute",
//               top: -70,
//               left: -70,
//               width: 240,
//               height: 240,
//               borderRadius: "50%",
//               pointerEvents: "none",
//               background: `radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 70%)`,
//             }}
//           />
//           {/* Hex BG */}
//           <svg
//             style={{
//               position: "absolute",
//               right: -20,
//               bottom: -20,
//               width: 200,
//               height: 200,
//               opacity: 0.06,
//               pointerEvents: "none",
//             }}
//             viewBox="0 0 100 115"
//             fill="none"
//           >
//             <polygon
//               points="50,5 93,28 93,87 50,110 7,87 7,28"
//               stroke={ACCENT}
//               strokeWidth="4"
//               fill="none"
//             />
//             <polygon
//               points="50,18 83,35 83,80 50,97 17,80 17,35"
//               stroke={ACCENT}
//               strokeWidth="2"
//               fill="none"
//             />
//             <polygon
//               points="50,31 73,42 73,73 50,84 27,73 27,42"
//               stroke={ACCENT}
//               strokeWidth="1"
//               fill="none"
//             />
//           </svg>

//           <div
//             style={{
//               position: "relative",
//               zIndex: 2,
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 22,
//             }}
//           >
//             {/* Icon */}
//             <div
//               style={{
//                 width: 68,
//                 height: 68,
//                 borderRadius: 18,
//                 flexShrink: 0,
//                 marginTop: 4,
//                 background: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: `0 6px 28px ${ACCENT_SHADOW}`,
//               }}
//             >
//               <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
//                 <rect
//                   x="4"
//                   y="4"
//                   width="16"
//                   height="16"
//                   rx="3"
//                   stroke="white"
//                   strokeWidth="1.5"
//                   fill="rgba(255,255,255,0.12)"
//                 />
//                 <path
//                   d="M8 4V2M12 4V2M16 4V2M8 22v-2M12 22v-2M16 22v-2M4 8H2M4 12H2M4 16H2M22 8h-2M22 12h-2M22 16h-2"
//                   stroke="white"
//                   strokeWidth="1.4"
//                   strokeLinecap="round"
//                 />
//                 <path
//                   d="M9 12h6M12 9v6"
//                   stroke="white"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             </div>

//             <div style={{ flex: 1 }}>
//               {/* Badge */}
//               <div
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 6,
//                   marginBottom: 10,
//                   padding: "3px 12px",
//                   borderRadius: 20,
//                   background: ACCENT_DIM,
//                   color: ACCENT,
//                   border: `1px solid ${ACCENT_BORDER}`,
//                   fontFamily: "'Space Mono', monospace",
//                   fontSize: 10,
//                   letterSpacing: "0.1em",
//                 }}
//               >
//                 KUBERNETES · RESOURCE · OOM
//               </div>
//               <p
//                 style={{
//                   fontFamily: "'Rajdhani', sans-serif",
//                   fontWeight: 700,
//                   fontSize: 38,
//                   color: textTitle,
//                   margin: "0 0 4px",
//                   lineHeight: 1.05,
//                 }}
//               >
//                 OOMKilled
//               </p>
//               <p
//                 style={{
//                   fontFamily: "'Space Mono', monospace",
//                   fontSize: 11,
//                   color: ACCENT,
//                   margin: "0 0 14px",
//                 }}
//               >
//                 v1 · core/Container · Exit Code 137
//               </p>
//               <p
//                 style={{
//                   fontFamily: "'Space Mono', monospace",
//                   fontSize: 11,
//                   lineHeight: 1.75,
//                   color: textMuted,
//                   margin: "0 0 18px",
//                   maxWidth: 560,
//                 }}
//               >
//                 OOMKilled occurs when a container exceeds its memory limit. The
//                 Linux kernel's OOM killer fires a{" "}
//                 <span style={{ color: ACCENT }}>SIGKILL</span> signal (exit code
//                 137) at the process with the highest{" "}
//                 <span style={{ color: AMBER }}>oom_score</span> — no graceful
//                 shutdown, no last words.
//               </p>
//               {/* Tags */}
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {[
//                   {
//                     l: "Exit Code 137",
//                     c: ACCENT,
//                     bg: ACCENT_DIM,
//                     b: ACCENT_BORDER,
//                   },
//                   { l: "SIGKILL", c: ACCENT, bg: ACCENT_DIM, b: ACCENT_BORDER },
//                   {
//                     l: "Memory Limit",
//                     c: AMBER,
//                     bg: AMBER_DIM,
//                     b: AMBER_BORDER,
//                   },
//                   { l: "oom_score", c: BLUE, bg: BLUE_DIM, b: BLUE_BORDER },
//                   { l: "cgroups v2", c: GREEN, bg: GREEN_DIM, b: GREEN_BORDER },
//                 ].map((t) => (
//                   <span
//                     key={t.l}
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 9,
//                       padding: "3px 10px",
//                       borderRadius: 12,
//                       letterSpacing: "0.06em",
//                       background: t.bg,
//                       color: t.c,
//                       border: `1px solid ${t.b}`,
//                     }}
//                   >
//                     {t.l}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ━━ MEMORY HIERARCHY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="Memory Hierarchy"
//             subtitle="How Kubernetes enforces memory boundaries via Linux cgroups"
//             isDark={isDark}
//           />
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//               gap: 16,
//             }}
//           >
//             {[
//               {
//                 badge: "requests.memory",
//                 color: BLUE,
//                 dim: BLUE_DIM,
//                 bdr: BLUE_BORDER,
//                 icon: "📌",
//                 title: "Memory Request",
//                 lines: [
//                   "Guaranteed allocation reserved on the node.",
//                   "Scheduler uses this to select a viable node.",
//                   "Container always gets at least this amount.",
//                   "Set to your app's typical steady-state baseline.",
//                 ],
//               },
//               {
//                 badge: "limits.memory",
//                 color: ACCENT,
//                 dim: ACCENT_DIM,
//                 bdr: ACCENT_BORDER,
//                 icon: "🚫",
//                 title: "Memory Limit",
//                 lines: [
//                   "Hard ceiling enforced by Linux cgroups v2.",
//                   "Any access beyond this triggers OOMKill.",
//                   "Kernel sends SIGKILL — exit code 137.",
//                   "Container restarts per restartPolicy.",
//                 ],
//               },
//               {
//                 badge: "oom_score_adj",
//                 color: AMBER,
//                 dim: AMBER_DIM,
//                 bdr: AMBER_BORDER,
//                 icon: "⚖️",
//                 title: "OOM Score",
//                 lines: [
//                   "Each process has a kernel-calculated oom_score.",
//                   "Higher score = killed first by OOM killer.",
//                   "Kubernetes tunes scores based on QoS class.",
//                   "BestEffort pods receive score 1000 — first to die.",
//                 ],
//               },
//             ].map((card) => (
//               <div
//                 key={card.badge}
//                 style={{
//                   borderRadius: 16,
//                   padding: "20px 22px",
//                   backgroundColor: cardBg,
//                   border: `1px solid ${card.bdr}`,
//                   boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
//                 }}
//               >
//                 <span
//                   style={{
//                     display: "inline-block",
//                     marginBottom: 14,
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     padding: "2px 9px",
//                     borderRadius: 10,
//                     background: card.dim,
//                     color: card.color,
//                     border: `1px solid ${card.bdr}`,
//                   }}
//                 >
//                   {card.badge}
//                 </span>
//                 <p
//                   style={{
//                     fontFamily: "'Rajdhani', sans-serif",
//                     fontWeight: 700,
//                     fontSize: 19,
//                     color: textTitle,
//                     margin: "0 0 14px",
//                   }}
//                 >
//                   {card.icon} {card.title}
//                 </p>
//                 {card.lines.map((l) => (
//                   <div
//                     key={l}
//                     style={{
//                       display: "flex",
//                       gap: 8,
//                       marginBottom: 8,
//                       alignItems: "flex-start",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: 4,
//                         height: 4,
//                         borderRadius: "50%",
//                         background: card.color,
//                         marginTop: 6,
//                         flexShrink: 0,
//                       }}
//                     />
//                     <p
//                       style={{
//                         fontFamily: "'Space Mono', monospace",
//                         fontSize: 11,
//                         color: textMuted,
//                         margin: 0,
//                         lineHeight: 1.65,
//                       }}
//                     >
//                       {l}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ━━ QOS CLASS TABLE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="QoS Classes & OOM Priority"
//             subtitle="Which pods get killed first under memory pressure"
//             isDark={isDark}
//           />
//           <div
//             style={{
//               borderRadius: 16,
//               overflow: "hidden",
//               border: `1px solid ${border}`,
//               boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
//             }}
//           >
//             {/* Header row */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "160px 1fr 140px 200px",
//                 padding: "10px 20px",
//                 gap: 12,
//                 background: isDark
//                   ? "rgba(255,255,255,0.03)"
//                   : "rgba(0,0,0,0.02)",
//                 borderBottom: `1px solid ${border}`,
//               }}
//             >
//               {["QoS Class", "Condition", "OOM Score", "Killed When"].map(
//                 (h) => (
//                   <span
//                     key={h}
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 10,
//                       color: isDark ? "#475569" : "#94a3b8",
//                       letterSpacing: "0.07em",
//                     }}
//                   >
//                     {h}
//                   </span>
//                 ),
//               )}
//             </div>
//             {[
//               {
//                 qos: "BestEffort",
//                 c: ACCENT,
//                 dim: ACCENT_DIM,
//                 bdr: ACCENT_BORDER,
//                 cond: "No requests or limits set",
//                 score: "1000",
//                 killed: "First — immediately",
//               },
//               {
//                 qos: "Burstable",
//                 c: AMBER,
//                 dim: AMBER_DIM,
//                 bdr: AMBER_BORDER,
//                 cond: "requests < limits",
//                 score: "1 – 999",
//                 killed: "Second — when node is pressured",
//               },
//               {
//                 qos: "Guaranteed",
//                 c: GREEN,
//                 dim: GREEN_DIM,
//                 bdr: GREEN_BORDER,
//                 cond: "requests == limits (both set)",
//                 score: "< 0",
//                 killed: "Last — only if over limit",
//               },
//             ].map((row, i, arr) => (
//               <div
//                 key={row.qos}
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "160px 1fr 140px 200px",
//                   padding: "14px 20px",
//                   gap: 12,
//                   alignItems: "center",
//                   borderBottom:
//                     i < arr.length - 1 ? `1px solid ${border}` : "none",
//                   backgroundColor: cardBg,
//                 }}
//               >
//                 <span
//                   style={{
//                     display: "inline-flex",
//                     justifyContent: "center",
//                     padding: "3px 10px",
//                     borderRadius: 10,
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     background: row.dim,
//                     color: row.c,
//                     border: `1px solid ${row.bdr}`,
//                   }}
//                 >
//                   {row.qos}
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 11,
//                     color: textMuted,
//                   }}
//                 >
//                   {row.cond}
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 11,
//                     color: row.c,
//                     fontWeight: 700,
//                   }}
//                 >
//                   {row.score}
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 11,
//                     color: textMuted,
//                   }}
//                 >
//                   {row.killed}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ━━ LIVE SIMULATOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="Memory Leak Simulator"
//             subtitle="Watch the OOM killer pick its victim in real-time"
//             isDark={isDark}
//           />
//           <div
//             className={phase === "oom" ? "oom-critical" : ""}
//             style={{
//               borderRadius: 20,
//               overflow: "hidden",
//               border: `1px solid ${phase === "oom" || phase === "killed" ? ACCENT_BORDER : border}`,
//               backgroundColor: cardBg,
//               boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.35)" : "none",
//               transition: "border-color 0.3s",
//             }}
//           >
//             <div style={{ padding: "22px 24px 0" }}>
//               {/* Controls */}
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 10,
//                   alignItems: "center",
//                   marginBottom: 22,
//                 }}
//               >
//                 <button
//                   onClick={startSim}
//                   disabled={phase !== "idle"}
//                   style={{
//                     padding: "8px 22px",
//                     borderRadius: 8,
//                     cursor: phase === "idle" ? "pointer" : "not-allowed",
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 11,
//                     background:
//                       phase === "idle" ? ACCENT : "rgba(225,29,72,0.25)",
//                     color: "white",
//                     border: "none",
//                     opacity: phase === "idle" ? 1 : 0.55,
//                     transition: "all 0.2s",
//                     fontWeight: 700,
//                   }}
//                 >
//                   ▶ Simulate Memory Leak
//                 </button>
//                 <button
//                   onClick={resetSim}
//                   style={{
//                     padding: "8px 20px",
//                     borderRadius: 8,
//                     cursor: "pointer",
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 11,
//                     background: isDark
//                       ? "rgba(255,255,255,0.05)"
//                       : "rgba(0,0,0,0.04)",
//                     color: textMuted,
//                     border: `1px solid ${border}`,
//                   }}
//                 >
//                   ↺ Reset
//                 </button>
//                 {phase === "growing" && (
//                   <span
//                     className="oom-blink"
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 10,
//                       color: AMBER,
//                     }}
//                   >
//                     ● MEMORY GROWING...
//                   </span>
//                 )}
//                 {(phase === "oom" || phase === "killed") && (
//                   <span
//                     className="oom-blink"
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 10,
//                       color: ACCENT,
//                       fontWeight: 700,
//                     }}
//                   >
//                     ● OOM KILLER TRIGGERED
//                   </span>
//                 )}
//               </div>

//               {/* Memory bar */}
//               <div style={{ marginBottom: 22 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: 8,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 10,
//                       color: textMuted,
//                     }}
//                   >
//                     Container Memory Usage
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 11,
//                       fontWeight: 700,
//                       color: barColor,
//                     }}
//                   >
//                     {fmtMiB(totalMem)} / {fmtMiB(LIMIT_MIB)} (
//                     {pctUsed.toFixed(0)}%)
//                   </span>
//                 </div>
//                 <MemBar
//                   used={totalMem}
//                   limit={LIMIT_MIB}
//                   request={REQUEST_MIB}
//                   isDark={isDark}
//                 />
//               </div>

//               {/* Process table header */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 65px 100px 90px",
//                   padding: "6px 12px",
//                   gap: 8,
//                   fontFamily: "'Space Mono', monospace",
//                   fontSize: 10,
//                   color: isDark ? "#475569" : "#94a3b8",
//                   letterSpacing: "0.07em",
//                   borderBottom: `1px solid ${border}`,
//                 }}
//               >
//                 <span>PROCESS</span>
//                 <span>PID</span>
//                 <span>MEMORY</span>
//                 <span>STATUS</span>
//               </div>

//               {/* Process rows */}
//               {procs.map((proc) => {
//                 const memColor =
//                   proc.mem > 100 ? ACCENT : proc.mem > 60 ? AMBER : GREEN;
//                 return (
//                   <div
//                     key={proc.pid}
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "1fr 65px 100px 90px",
//                       padding: "11px 12px",
//                       gap: 8,
//                       borderBottom: `1px solid ${border}`,
//                       background:
//                         proc.status === "killed"
//                           ? isDark
//                             ? "rgba(225,29,72,0.07)"
//                             : "rgba(225,29,72,0.04)"
//                           : "transparent",
//                       transition: "background 0.3s",
//                       opacity: proc.status === "killed" ? 0.65 : 1,
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontFamily: "'Space Mono', monospace",
//                         fontSize: 11,
//                         color: proc.status === "killed" ? ACCENT : textTitle,
//                         textDecoration:
//                           proc.status === "killed" ? "line-through" : "none",
//                       }}
//                     >
//                       {proc.name}
//                     </span>
//                     <span
//                       style={{
//                         fontFamily: "'Space Mono', monospace",
//                         fontSize: 11,
//                         color: textMuted,
//                       }}
//                     >
//                       {proc.pid}
//                     </span>
//                     <span
//                       style={{
//                         fontFamily: "'Space Mono', monospace",
//                         fontSize: 11,
//                         color: proc.status === "killed" ? textMuted : memColor,
//                         fontWeight: proc.mem > 100 ? 700 : 400,
//                       }}
//                     >
//                       {fmtMiB(proc.mem)}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontFamily: "'Space Mono', monospace",
//                         fontSize: 9,
//                         padding: "2px 8px",
//                         borderRadius: 6,
//                         width: 68,
//                         background:
//                           proc.status === "killed" ? ACCENT_DIM : GREEN_DIM,
//                         color: proc.status === "killed" ? ACCENT : GREEN,
//                         border: `1px solid ${proc.status === "killed" ? ACCENT_BORDER : GREEN_BORDER}`,
//                       }}
//                     >
//                       {proc.status === "killed" ? "KILLED" : "RUNNING"}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Kernel OOM log */}
//             {oomLog.length > 0 && (
//               <div
//                 className="oom-appear"
//                 style={{
//                   background: "#07111f",
//                   borderTop: `1px solid ${ACCENT_BORDER}`,
//                   padding: "16px 22px",
//                   fontFamily: "'Space Mono', monospace",
//                   fontSize: 11,
//                   lineHeight: 1.75,
//                 }}
//               >
//                 <div
//                   style={{
//                     color: ACCENT,
//                     marginBottom: 10,
//                     fontSize: 10,
//                     letterSpacing: "0.12em",
//                     fontWeight: 700,
//                   }}
//                 >
//                   ── KERNEL OOM LOG ─────────────────────────────────────────
//                 </div>
//                 {oomLog.map((line, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       color:
//                         line.includes("Killed") || line.includes("Kill process")
//                           ? ACCENT
//                           : "#64748b",
//                       fontWeight: line.includes("Killed") ? 700 : 400,
//                       marginBottom: 1,
//                     }}
//                   >
//                     {line}
//                   </div>
//                 ))}
//                 <div style={{ marginTop: 12, color: GREEN, fontSize: 10 }}>
//                   ✓ Pod scheduled for restart (restartPolicy: Always). Restart
//                   count incremented.
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ━━ YAML CONFIGURATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="Resource Configuration"
//             subtitle="How to set memory requests and limits correctly"
//             isDark={isDark}
//           />
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
//               gap: 16,
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   marginBottom: 10,
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     padding: "2px 9px",
//                     borderRadius: 8,
//                     background: ACCENT_DIM,
//                     color: ACCENT,
//                     border: `1px solid ${ACCENT_BORDER}`,
//                   }}
//                 >
//                   ❌ NO LIMITS
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     color: textMuted,
//                   }}
//                 >
//                   BestEffort — killed first
//                 </span>
//               </div>
//               <CodeBlock
//                 isDark={isDark}
//                 code={`containers:
//   - name: app
//     image: my-app:latest
//     # ⚠️ No resources block at all
//     # QoS Class  : BestEffort
//     # OOM Score  : 1000 (killed first!)
//     # Risk       : Can consume all node memory`}
//               />
//             </div>
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   marginBottom: 10,
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     padding: "2px 9px",
//                     borderRadius: 8,
//                     background: AMBER_DIM,
//                     color: AMBER,
//                     border: `1px solid ${AMBER_BORDER}`,
//                   }}
//                 >
//                   ⚠️ ONLY REQUESTS
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     color: textMuted,
//                   }}
//                 >
//                   Burstable — partial protection
//                 </span>
//               </div>
//               <CodeBlock
//                 isDark={isDark}
//                 code={`containers:
//   - name: app
//     image: my-app:latest
//     resources:
//       requests:
//         memory: "128Mi"
//         cpu: "250m"
//       # No limits set
//       # QoS Class  : Burstable
//       # OOM Score  : 1–999 (varies by usage)
//       # Risk       : Still killable under pressure`}
//               />
//             </div>
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   marginBottom: 10,
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     padding: "2px 9px",
//                     borderRadius: 8,
//                     background: GREEN_DIM,
//                     color: GREEN,
//                     border: `1px solid ${GREEN_BORDER}`,
//                   }}
//                 >
//                   ✅ GUARANTEED
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 10,
//                     color: textMuted,
//                   }}
//                 >
//                   Safest — lowest OOM priority
//                 </span>
//               </div>
//               <CodeBlock
//                 isDark={isDark}
//                 code={`containers:
//   - name: app
//     image: my-app:latest
//     resources:
//       requests:
//         memory: "256Mi"  # == limits
//         cpu: "500m"      # == limits
//       limits:
//         memory: "256Mi"  # Hard ceiling
//         cpu: "500m"
//     # QoS Class  : Guaranteed
//     # OOM Score  : < 0 (never killed first)
//     # Killed only : if it exceeds its own limit`}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ━━ kubectl DESCRIBE OUTPUT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="kubectl describe pod Output"
//             subtitle="What OOMKilled looks like after the fact"
//             isDark={isDark}
//           />
//           <CodeBlock
//             isDark={isDark}
//             code={`Name:         my-app-7d6f9-x8k2p
// Namespace:    production
// Node:         ip-10-0-1-44.ec2.internal

// Containers:
//   app:
//     State:          Running
//       Started:      Tue, 02 Jun 2026 11:20:05 +0530
//     Last State:     Terminated
//       Reason:       OOMKilled           ← you want to see this
//       Exit Code:    137
//       Started:      Tue, 02 Jun 2026 11:14:58 +0530
//       Finished:     Tue, 02 Jun 2026 11:19:52 +0530
//     Ready:          True
//     Restart Count:  4                   ← escalating restarts = CrashLoopBackOff next
//     Limits:
//       memory:       256Mi
//     Requests:
//       memory:       128Mi

// Conditions:
//   Type              Status
//   Initialized       True
//   Ready             True
//   ContainersReady   True
//   PodScheduled      True

// Events:
//   Type     Reason      Age    From     Message
//   ----     ------      ---    ----     -------
//   Warning  OOMKilling  5m42s  kubelet  Memory cgroup out of memory:
//                                        Kill process 42 (mongoose) score 200
//                                        or sacrifice child`}
//           />
//         </div>

//         {/* ━━ DEBUG COMMANDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="Debug Commands"
//             subtitle="Diagnose OOMKilled events in your cluster"
//             isDark={isDark}
//           />
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {[
//               {
//                 cmd: "kubectl describe pod <pod-name> -n <namespace>",
//                 comment:
//                   "# Look for: Last State: OOMKilled, Exit Code: 137, Restart Count",
//                 color: ACCENT,
//               },
//               {
//                 cmd: "kubectl get events -n <namespace> --sort-by='.lastTimestamp'",
//                 comment: "# Filter for OOMKilling events across the namespace",
//                 color: AMBER,
//               },
//               {
//                 cmd: "kubectl top pod <pod-name> --containers",
//                 comment:
//                   "# Real-time memory usage per container (requires metrics-server)",
//                 color: BLUE,
//               },
//               {
//                 cmd: "kubectl logs <pod-name> --previous",
//                 comment: "# Logs from the killed container instance",
//                 color: GREEN,
//               },
//               {
//                 cmd: "kubectl get pod <pod-name> -o jsonpath='{.status.containerStatuses[0].lastState}'",
//                 comment: "# Raw JSON of the last termination state",
//                 color: isDark ? "#94a3b8" : "#64748b",
//               },
//             ].map(({ cmd, comment, color }) => (
//               <div key={cmd} style={{ position: "relative" }}>
//                 <CopyButton text={cmd} isDark={isDark} />
//                 <div
//                   style={{
//                     background: isDark ? "#07111f" : "#1e293b",
//                     borderRadius: 10,
//                     padding: "14px 56px 14px 18px",
//                     borderLeft: `3px solid ${color}`,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 12,
//                       color: "#e2e8f0",
//                       marginBottom: 4,
//                     }}
//                   >
//                     {cmd}
//                   </div>
//                   <div
//                     style={{
//                       fontFamily: "'Space Mono', monospace",
//                       fontSize: 11,
//                       color: color,
//                       opacity: 0.7,
//                     }}
//                   >
//                     {comment}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ━━ COMMON CAUSES & FIXES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="Common Causes & Fixes"
//             subtitle="Root causes of OOMKilled and how to resolve each one"
//             isDark={isDark}
//           />
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//               gap: 14,
//             }}
//           >
//             {[
//               {
//                 icon: "🔴",
//                 cause: "Memory Leak",
//                 color: ACCENT,
//                 dim: ACCENT_DIM,
//                 bdr: ACCENT_BORDER,
//                 fix: "Profile with heap snapshots (node --inspect, pprof). Fix leaking references. Set limits as a safety net — not a substitute for fixing the leak.",
//               },
//               {
//                 icon: "🟡",
//                 cause: "Limit Too Low",
//                 color: AMBER,
//                 dim: AMBER_DIM,
//                 bdr: AMBER_BORDER,
//                 fix: "Measure actual p99 memory usage with kubectl top. Set limit 25–40% above p99 to absorb spikes without risking OOM under normal traffic.",
//               },
//               {
//                 icon: "🔵",
//                 cause: "JVM Heap Overflow",
//                 color: BLUE,
//                 dim: BLUE_DIM,
//                 bdr: BLUE_BORDER,
//                 fix: "Set -Xmx well below the memory limit (~75%). Older JVMs ignore cgroup limits. Use Java 11+ which reads cgroup v2 correctly.",
//               },
//               {
//                 icon: "🟢",
//                 cause: "Missing LimitRange",
//                 color: GREEN,
//                 dim: GREEN_DIM,
//                 bdr: GREEN_BORDER,
//                 fix: "Apply a LimitRange resource to the namespace. This sets default requests/limits for all containers that omit them.",
//               },
//               {
//                 icon: "⚪",
//                 cause: "Noisy Neighbour",
//                 color: isDark ? "#94a3b8" : "#64748b",
//                 dim: "rgba(100,116,139,0.1)",
//                 bdr: "rgba(100,116,139,0.2)",
//                 fix: "Multiple high-memory pods sharing a node can cause cascading OOMs. Use node affinity or pod disruption budgets to spread load.",
//               },
//               {
//                 icon: "🔶",
//                 cause: "Init Container OOM",
//                 color: AMBER,
//                 dim: AMBER_DIM,
//                 bdr: AMBER_BORDER,
//                 fix: "Init containers share the pod's cgroup. A large database migration script can OOM before the main app even starts. Set separate limits.",
//               },
//             ].map((c) => (
//               <div
//                 key={c.cause}
//                 style={{
//                   borderRadius: 14,
//                   padding: "18px 20px",
//                   backgroundColor: cardBg,
//                   border: `1px solid ${c.bdr}`,
//                   boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontFamily: "'Rajdhani', sans-serif",
//                     fontWeight: 700,
//                     fontSize: 18,
//                     color: c.color,
//                     margin: "0 0 10px",
//                   }}
//                 >
//                   {c.icon} {c.cause}
//                 </p>
//                 <p
//                   style={{
//                     fontFamily: "'Space Mono', monospace",
//                     fontSize: 11,
//                     color: textMuted,
//                     margin: 0,
//                     lineHeight: 1.7,
//                   }}
//                 >
//                   {c.fix}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ━━ LIMITRANGE YAML ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div style={{ marginBottom: 36 }}>
//           <SectionHeader
//             title="LimitRange — Namespace Defaults"
//             subtitle="Prevent BestEffort pods by enforcing defaults cluster-wide"
//             isDark={isDark}
//           />
//           <CodeBlock
//             isDark={isDark}
//             code={`apiVersion: v1
// kind: LimitRange
// metadata:
//   name: default-resource-limits
//   namespace: production
// spec:
//   limits:
//   - type: Container
//     default:          # applied when limits are omitted
//       memory: "256Mi"
//       cpu: "500m"
//     defaultRequest:   # applied when requests are omitted
//       memory: "128Mi"
//       cpu: "250m"
//     max:              # hard maximum any container can request
//       memory: "2Gi"
//       cpu: "2"`}
//           />
//         </div>

//         {/* ━━ VPA TIP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//         <div
//           style={{
//             borderRadius: 16,
//             padding: "20px 22px",
//             background: isDark ? BLUE_DIM : "rgba(50,108,229,0.04)",
//             border: `1px solid ${BLUE_BORDER}`,
//           }}
//         >
//           <p
//             style={{
//               fontFamily: "'Rajdhani', sans-serif",
//               fontWeight: 700,
//               fontSize: 18,
//               color: BLUE,
//               margin: "0 0 10px",
//             }}
//           >
//             💡 Pro Tip: Vertical Pod Autoscaler (VPA)
//           </p>
//           <p
//             style={{
//               fontFamily: "'Space Mono', monospace",
//               fontSize: 11,
//               color: textMuted,
//               margin: "0 0 12px",
//               lineHeight: 1.7,
//             }}
//           >
//             The VPA analyses historical resource usage and automatically
//             recommends or sets requests/limits. After running for a few hours
//             under production traffic, check its recommendations:
//           </p>
//           <div style={{ position: "relative" }}>
//             <CopyButton
//               text="kubectl describe vpa my-app-vpa -n production"
//               isDark={isDark}
//             />
//             <pre
//               style={{
//                 margin: 0,
//                 padding: "12px 48px 12px 16px",
//                 borderRadius: 10,
//                 background: isDark ? "#07111f" : "#1e293b",
//                 color: BLUE,
//                 fontFamily: "'Space Mono', monospace",
//                 fontSize: 12,
//                 lineHeight: 1.6,
//               }}
//             >{`kubectl describe vpa my-app-vpa -n production
// # Recommendation:
// #   Container: app
// #     Lower Bound:  memory: 192Mi
// #     Target:       memory: 240Mi   ← set this as your limit
// #     Upper Bound:  memory: 512Mi`}</pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Button } from "antd";
// import {
//   PlayCircleOutlined,
//   ReloadOutlined,
//   LoadingOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
// } from "@ant-design/icons";
// import { useTheme } from "../../Themecontext";

// // ══════════════════════════════════════════════════════════════════
// //  Constants
// // ══════════════════════════════════════════════════════════════════
// const MEM_REQUEST = 100; // Mi  — scheduler guarantee
// const MEM_LIMIT = 150; // Mi  — kernel OOM-kill boundary
// const CPU_REQUEST = 150; // m   — millicores
// const CPU_LIMIT = 200; // m

// // ══════════════════════════════════════════════════════════════════
// //  Types
// // ══════════════════════════════════════════════════════════════════
// type PodPhase =
//   | "Idle"
//   | "Pending"
//   | "Running"
//   | "OOMKilled"
//   | "CrashLoopBackOff";

// type Scenario = "healthy" | "failing";

// interface LogEntry {
//   id: number;
//   text: string;
//   variant: "header" | "ok" | "warn" | "err";
// }

// // ══════════════════════════════════════════════════════════════════
// //  Style helpers
// // ══════════════════════════════════════════════════════════════════
// const mono = (size: number, color: string): React.CSSProperties => ({
//   fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
//   fontSize: size,
//   color,
// });

// const getPhaseColors = (
//   phase: PodPhase,
//   isDark: boolean
// ): { bg: string; fg: string; dot: string } => {
//   const darkMap: Record<PodPhase, { bg: string; fg: string; dot: string }> = {
//     Idle: { bg: "#1F2937", fg: "#9CA3AF", dot: "#6B7280" },
//     Pending: { bg: "#1E3A5F", fg: "#93C5FD", dot: "#3B82F6" },
//     Running: { bg: "#064E3B", fg: "#6EE7B7", dot: "#10B981" },
//     OOMKilled: { bg: "#7F1D1D", fg: "#FCA5A5", dot: "#EF4444" },
//     CrashLoopBackOff: { bg: "#78350F", fg: "#FCD34D", dot: "#F59E0B" },
//   };

//   const lightMap: Record<PodPhase, { bg: string; fg: string; dot: string }> = {
//     Idle: { bg: "#F3F4F6", fg: "#4B5563", dot: "#9CA3AF" },
//     Pending: { bg: "#EFF6FF", fg: "#1D4ED8", dot: "#3B82F6" },
//     Running: { bg: "#ECFDF5", fg: "#047857", dot: "#10B981" },
//     OOMKilled: { bg: "#FEF2F2", fg: "#B91C1C", dot: "#EF4444" },
//     CrashLoopBackOff: { bg: "#FFFBEB", fg: "#B45309", dot: "#F59E0B" },
//   };

//   return isDark ? darkMap[phase] : lightMap[phase];
// };

// // ══════════════════════════════════════════════════════════════════
// //  ResourceBar
// // ══════════════════════════════════════════════════════════════════
// function ResourceBar({
//   label,
//   used,
//   request,
//   limit,
//   unit,
//   isDark,
// }: {
//   label: string;
//   used: number;
//   request: number;
//   limit: number;
//   unit: string;
//   isDark: boolean;
// }) {
//   const pct = Math.min((used / limit) * 100, 100);
//   const reqPct = (request / limit) * 100;
//   const overLimit = used > limit;
//   const barColor = overLimit ? "#EF4444" : pct > 80 ? "#F59E0B" : "#34D399";

//   const textMuted = isDark ? "#9CA3AF" : "#64748B";
//   const textValue = overLimit ? "#EF4444" : isDark ? "#E2E8F0" : "#0F172A";
//   const slashColor = isDark ? "#4B5563" : "#94A3B8";
//   const trackBg = isDark ? "#111827" : "#E2E8F0";
//   const trackBorder = isDark ? "#1F2937" : "#CBD5E1";

//   return (
//     <div style={{ marginBottom: 20 }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 6,
//         }}
//       >
//         <span style={mono(11, textMuted)}>{label}</span>
//         <span style={mono(11, overLimit ? "#EF4444" : textMuted)}>
//           <span style={{ color: textValue }}>
//             {used}
//             {unit}
//           </span>
//           <span style={{ color: slashColor }}>
//             {" "}
//             / {limit}
//             {unit}
//           </span>
//           {overLimit && (
//             <span
//               style={{
//                 marginLeft: 8,
//                 fontSize: 10,
//                 color: "#EF4444",
//                 fontWeight: 700,
//               }}
//             >
//               ⚠ exceeds limit
//             </span>
//           )}
//         </span>
//       </div>

//       {/* track */}
//       <div
//         style={{
//           position: "relative",
//           height: 18,
//           background: trackBg,
//           borderRadius: 4,
//           border: `1px solid ${trackBorder}`,
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             inset: "0 auto 0 0",
//             width: `${reqPct}%`,
//             background: "rgba(52,211,153,0.12)",
//             borderRadius: "3px 0 0 3px",
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             inset: "0 auto 0 0",
//             width: `${pct}%`,
//             background: barColor,
//             borderRadius: 3,
//             transition: "width 120ms linear, background 350ms ease",
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             left: `${reqPct}%`,
//             top: -3,
//             bottom: -3,
//             width: 1.5,
//             background: "#34D399",
//             opacity: isDark ? 0.7 : 1,
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             right: 0,
//             top: -3,
//             bottom: -3,
//             width: 2,
//             background: "#EF4444",
//             opacity: 0.9,
//           }}
//         />
//       </div>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginTop: 4,
//         }}
//       >
//         <span style={mono(10, isDark ? "#34D39970" : "#059669")}>
//           request {request}
//           {unit}
//         </span>
//         <span style={mono(10, isDark ? "#EF444470" : "#DC2626")}>
//           limit {limit}
//           {unit}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// //  PhaseBadge
// // ══════════════════════════════════════════════════════════════════
// function PhaseBadge({ phase, isDark }: { phase: PodPhase; isDark: boolean }) {
//   const cfg = getPhaseColors(phase, isDark);
//   return (
//     <span
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: 6,
//         padding: "3px 10px 3px 8px",
//         background: cfg.bg,
//         borderRadius: 4,
//         fontFamily: "'JetBrains Mono', monospace",
//         fontSize: 12,
//         fontWeight: 700,
//         color: cfg.fg,
//         border: `1px solid ${cfg.fg}20`,
//       }}
//     >
//       <span
//         style={{
//           width: 7,
//           height: 7,
//           borderRadius: "50%",
//           background: cfg.dot,
//           ...(phase === "Running"
//             ? { animation: "k8s-blink 1.2s ease-in-out infinite" }
//             : phase === "OOMKilled"
//               ? { animation: "k8s-blink 0.5s ease-in-out infinite" }
//               : {}),
//         }}
//       />
//       {phase}
//     </span>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// //  Terminal
// // ══════════════════════════════════════════════════════════════════
// function Terminal({
//   entries,
//   isDark,
// }: {
//   entries: LogEntry[];
//   isDark: boolean;
// }) {
//   const bottomRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [entries]);

//   const varColor: Record<LogEntry["variant"], string> = {
//     header: isDark ? "#60A5FA" : "#2563EB",
//     ok: isDark ? "#34D399" : "#059669",
//     warn: isDark ? "#FBBF24" : "#D97706",
//     err: isDark ? "#EF4444" : "#DC2626",
//   };

//   const bg = isDark ? "#0D1117" : "#F8FAFC";
//   const border = isDark ? "#21262D" : "#E2E8F0";
//   const prompt = isDark ? "#4B5563" : "#94A3B8";

//   return (
//     <div
//       style={{
//         background: bg,
//         border: `1px solid ${border}`,
//         borderRadius: 8,
//         padding: "14px 18px",
//         minHeight: 120,
//         maxHeight: 240,
//         overflowY: "auto",
//       }}
//     >
//       <div style={{ ...mono(11, prompt), marginBottom: 8 }}>
//         $ kubectl get po -w
//       </div>
//       {entries.length === 0 && (
//         <div
//           style={{
//             ...mono(11, isDark ? "#374151" : "#CBD5E1"),
//             fontStyle: "italic",
//           }}
//         >
//           — press Run simulation to start —
//         </div>
//       )}
//       {entries.map((e) => (
//         <div
//           key={e.id}
//           style={{ ...mono(12, varColor[e.variant]), lineHeight: 1.9 }}
//         >
//           {e.text}
//         </div>
//       ))}
//       <div ref={bottomRef} />
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// //  YamlViewer
// // ══════════════════════════════════════════════════════════════════
// function YamlViewer({
//   isDark,
//   scenario,
// }: {
//   isDark: boolean;
//   scenario: Scenario;
// }) {
//   const col = {
//     k1: isDark ? "#C3E88D" : "#059669",
//     k2: isDark ? "#82AAFF" : "#2563EB",
//     k3: isDark ? "#FFCB6B" : "#D97706",
//     val: isDark ? "#E2E8F0" : "#0F172A",
//     str: isDark ? "#89DDFF" : "#0891B2",
//     err: isDark ? "#FF5370" : "#DC2626",
//     ok: isDark ? "#6EE7B7" : "#047857",
//     warn: isDark ? "#F87171" : "#B91C1C",
//     warnVal: isDark ? "#FCA5A5" : "#EF4444",
//   };

//   const isHealthy = scenario === "healthy";
//   const vmBytes = isHealthy ? "125M" : "155M";

//   const lines: Array<{ text: string; color: string }> = [
//     { text: "apiVersion: v1", color: col.k1 },
//     { text: "kind: Pod", color: col.k2 },
//     { text: "metadata:", color: col.k3 },
//     { text: "  name: pod-stress", color: col.val },
//     { text: "  labels:", color: col.val },
//     { text: "    env: dev", color: col.val },
//     { text: "spec:", color: col.k3 },
//     { text: "  containers:", color: col.val },
//     { text: "    - name: my-cont-stress", color: col.val },
//     { text: "      image: polinux/stress", color: col.str },
//     { text: "      ports:", color: col.val },
//     { text: "        - containerPort: 80", color: col.val },
//     { text: '      command: ["stress", "--vm", "1",', color: col.k1 },
//     {
//       text: `               "--vm-bytes", "${vmBytes}"]`,
//       color: isHealthy ? col.ok : col.err,
//     },
//     { text: "      resources:", color: col.k3 },
//     { text: "        requests:", color: col.k2 },
//     { text: '          cpu: "150m"', color: col.ok },
//     { text: "          memory: 100Mi", color: col.ok },
//     { text: "        limits:", color: col.warn },
//     { text: '          cpu: "200m"', color: col.warnVal },
//     { text: "          memory: 150Mi", color: col.err },
//   ];

//   return (
//     <div>
//       <pre
//         style={{
//           margin: 0,
//           padding: "14px 16px",
//           background: isDark ? "#0D1117" : "#F8FAFC",
//           border: `1px solid ${isDark ? "#21262D" : "#E2E8F0"}`,
//           borderRadius: 8,
//           overflowX: "auto",
//           fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//           fontSize: 12,
//           lineHeight: 1.75,
//         }}
//       >
//         {lines.map((l, i) => (
//           <div key={i} style={{ color: l.color }}>
//             {l.text}
//           </div>
//         ))}
//       </pre>
//       <div
//         style={{
//           marginTop: 8,
//           padding: "8px 12px",
//           background: isHealthy
//             ? isDark
//               ? "#064E3B30"
//               : "#ECFDF5"
//             : isDark
//               ? "#7F1D1D22"
//               : "#FEF2F2",
//           border: `1px solid ${
//             isHealthy
//               ? isDark
//                 ? "#34D39930"
//                 : "#A7F3D0"
//               : isDark
//                 ? "#EF444430"
//                 : "#FECACA"
//           }`,
//           borderRadius: 6,
//           fontFamily: "monospace",
//           fontSize: 11,
//           color: isHealthy
//             ? isDark
//               ? "#6EE7B7"
//               : "#047857"
//             : isDark
//               ? "#FCA5A5"
//               : "#B91C1C",
//           lineHeight: 1.6,
//         }}
//       >
//         {isHealthy ? (
//           <>
//             ✅ stress requests{" "}
//             <strong style={{ color: isDark ? "#34D399" : "#059669" }}>
//               125Mi
//             </strong>{" "}
//             which is &lt; limit (150Mi) → Pod stays Running and healthy.
//           </>
//         ) : (
//           <>
//             ⚠ stress requests{" "}
//             <strong style={{ color: "#EF4444" }}>155Mi</strong> but memory.limit
//             = <strong style={{ color: "#EF4444" }}>150Mi</strong> → kernel
//             OOM-kills the container.
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// //  Main component
// // ══════════════════════════════════════════════════════════════════
// export default function ResourceOOMKilled() {
//   const { isDark } = useTheme();

//   const [scenario, setScenario] = useState<Scenario>("healthy");
//   const [phase, setPhase] = useState<PodPhase>("Idle");
//   const [memUsed, setMemUsed] = useState(0);
//   const [cpuUsed, setCpuUsed] = useState(0);
//   const [restarts, setRestarts] = useState(0);
//   const [ageSec, setAgeSec] = useState(0);
//   const [logs, setLogs] = useState<LogEntry[]>([]);
//   const [simActive, setSimActive] = useState(false);

//   const logId = useRef(0);
//   const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
//   const memTick = useRef<ReturnType<typeof setInterval> | null>(null);
//   const ageTick = useRef<ReturnType<typeof setInterval> | null>(null);

//   const log = useCallback((text: string, variant: LogEntry["variant"]) => {
//     logId.current += 1;
//     setLogs((prev) => [...prev, { id: logId.current, text, variant }]);
//   }, []);

//   const stopTimers = useCallback(() => {
//     timeouts.current.forEach(clearTimeout);
//     timeouts.current = [];
//     if (memTick.current) {
//       clearInterval(memTick.current);
//       memTick.current = null;
//     }
//     if (ageTick.current) {
//       clearInterval(ageTick.current);
//       ageTick.current = null;
//     }
//   }, []);

//   const resetAll = useCallback(() => {
//     stopTimers();
//     setPhase("Idle");
//     setMemUsed(0);
//     setCpuUsed(0);
//     setRestarts(0);
//     setAgeSec(0);
//     setLogs([]);
//     setSimActive(false);
//   }, [stopTimers]);

//   // Reset when scenario changes
//   useEffect(() => {
//     resetAll();
//   }, [scenario, resetAll]);

//   const runSimulation = useCallback(() => {
//     resetAll();
//     setSimActive(true);

//     const memTarget = scenario === "healthy" ? 125 : 155;

//     const schedule = (fn: () => void, ms: number) => {
//       const t = setTimeout(fn, ms);
//       timeouts.current.push(t);
//     };

//     // Age counter
//     ageTick.current = setInterval(() => setAgeSec((s) => s + 1), 1000);

//     // t=200ms — print header
//     schedule(() => {
//       log("NAME         READY   STATUS      RESTARTS     AGE", "header");
//     }, 200);

//     // t=600ms — Pending
//     schedule(() => {
//       setPhase("Pending");
//       log("pod-stress   0/1     Pending     0            0s", "ok");
//     }, 600);

//     // t=1400ms — Running, start memory + cpu ramp
//     schedule(() => {
//       setPhase("Running");
//       setCpuUsed(110);
//       log("pod-stress   1/1     Running     0            1s", "ok");

//       let mem = 25;
//       memTick.current = setInterval(() => {
//         mem = Math.min(mem + 9, memTarget);
//         setMemUsed(mem);
//         setCpuUsed((c) => Math.min(c + 7, CPU_LIMIT));

//         // Stop memory tick if we hit the target
//         if (mem >= memTarget) {
//           if (memTick.current) clearInterval(memTick.current);
//         }
//       }, 110);
//     }, 1400);

//     if (scenario === "failing") {
//       // t=3800ms — OOMKilled (155Mi > 150Mi limit)
//       schedule(() => {
//         setMemUsed(memTarget);
//         setCpuUsed(0);
//         setPhase("OOMKilled");
//         setRestarts(1);
//         log("pod-stress   0/1     OOMKilled   1 (4s ago)   5s", "err");
//       }, 3800);

//       // t=5200ms — CrashLoopBackOff
//       schedule(() => {
//         setPhase("CrashLoopBackOff");
//         log(
//           "pod-stress   0/1     CrashLoopBackOff   1 (11s ago)   14s",
//           "warn"
//         );
//       }, 5200);

//       // t=6800ms — OOMKilled again
//       schedule(() => {
//         setPhase("OOMKilled");
//         setRestarts(2);
//         log("pod-stress   0/1     OOMKilled          2 (12s ago)   15s", "err");
//       }, 6800);

//       // t=8500ms — final CrashLoopBackOff
//       schedule(() => {
//         setPhase("CrashLoopBackOff");
//         log(
//           "pod-stress   0/1     CrashLoopBackOff   2 (20s ago)   30s",
//           "warn"
//         );
//         if (ageTick.current) {
//           clearInterval(ageTick.current);
//           ageTick.current = null;
//         }
//         setSimActive(false);
//       }, 8500);
//     } else {
//       // Healthy scenario -> it stays running.
//       schedule(() => {
//         log("pod-stress   1/1     Running     0            5s", "ok");
//       }, 5000);

//       schedule(() => {
//         log("pod-stress   1/1     Running     0            10s", "ok");
//         // End simulation loop gracefully
//         setSimActive(false);
//       }, 10000);
//     }
//   }, [resetAll, log, scenario]);

//   // Cleanup on unmount
//   useEffect(() => () => stopTimers(), [stopTimers]);

//   // Theme Variables
//   const bgMain = "transparent";
//   const textHeading = isDark ? "#F8FAFC" : "#0F172A";
//   const textSub = isDark ? "#9CA3AF" : "#475569";
//   const panelBg = isDark ? "#111827" : "#FFFFFF";
//   const panelBorder = isDark ? "#1F2937" : "#E2E8F0";

//   return (
//     <>
//       <style>{`
//         @keyframes k8s-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//       `}</style>

//       <div
//         style={{
//           background: bgMain,
//           padding: "16px 0px",
//           fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
//           boxSizing: "border-box",
//         }}
//       >
//         {/* ── Header ─────────────────────────────────────── */}
//         <header style={{ marginBottom: 32 }}>
//           <h1
//             style={{
//               margin: 0,
//               fontSize: 20,
//               fontWeight: 600,
//               letterSpacing: "-0.025em",
//               color: textHeading,
//             }}
//           >
//             Kubernetes — Resource Requests &amp; Limits
//           </h1>
//           <p style={{ margin: "6px 0 0", fontSize: 13, color: textSub }}>
//             Interactive demo · Observe how Pods react when{" "}
//             <code style={mono(11, isDark ? "#FBBF24" : "#D97706")}>
//               --vm-bytes
//             </code>{" "}
//             is adjusted against the 150Mi limit.
//           </p>
//         </header>

//         {/* ── Two-column grid ────────────────────────────── */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//             gap: 28,
//             marginBottom: 28,
//           }}
//         >
//           {/* ── LEFT: controls + live gauges ─────────── */}
//           <div>
//             <div
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: isDark ? "#6B7280" : "#64748B",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 marginBottom: 10,
//               }}
//             >
//               Select Configuration
//             </div>

//             {/* Custom Scenario Toggle */}
//             <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
//               <Button
//                 type={scenario === "healthy" ? "primary" : "default"}
//                 onClick={() => setScenario("healthy")}
//                 disabled={simActive}
//                 icon={<CheckCircleOutlined />}
//                 style={{
//                   flex: 1,
//                   background:
//                     scenario === "healthy"
//                       ? isDark
//                         ? "#059669"
//                         : "#10B981"
//                       : undefined,
//                   borderColor:
//                     scenario === "healthy"
//                       ? isDark
//                         ? "#059669"
//                         : "#10B981"
//                       : undefined,
//                   fontWeight: scenario === "healthy" ? 600 : 400,
//                 }}
//               >
//                 Healthy (125M)
//               </Button>
//               <Button
//                 type={scenario === "failing" ? "primary" : "default"}
//                 danger={scenario === "failing"}
//                 onClick={() => setScenario("failing")}
//                 disabled={simActive}
//                 icon={<CloseCircleOutlined />}
//                 style={{
//                   flex: 1,
//                   fontWeight: scenario === "failing" ? 600 : 400,
//                 }}
//               >
//                 Failing (155M)
//               </Button>
//             </div>

//             <div
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: isDark ? "#6B7280" : "#64748B",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 marginBottom: 10,
//               }}
//             >
//               Live pod metrics
//             </div>

//             {/* Status row */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 14,
//                 padding: "10px 14px",
//                 marginBottom: 16,
//                 background: panelBg,
//                 border: `1px solid ${panelBorder}`,
//                 borderRadius: 8,
//                 boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
//               }}
//             >
//               <div>
//                 <div style={mono(10, isDark ? "#6B7280" : "#64748B")}>
//                   status
//                 </div>
//                 <PhaseBadge phase={phase} isDark={isDark} />
//               </div>
//               <div style={{ flex: 1 }} />
//               <div style={{ textAlign: "right" }}>
//                 <div style={mono(10, isDark ? "#6B7280" : "#64748B")}>
//                   restarts
//                 </div>
//                 <div
//                   style={mono(
//                     15,
//                     restarts > 0
//                       ? "#EF4444"
//                       : isDark
//                         ? "#E2E8F0"
//                         : "#0F172A"
//                   )}
//                 >
//                   {restarts}
//                 </div>
//               </div>
//               <div style={{ textAlign: "right", minWidth: 40 }}>
//                 <div style={mono(10, isDark ? "#6B7280" : "#64748B")}>age</div>
//                 <div style={mono(15, isDark ? "#E2E8F0" : "#0F172A")}>
//                   {ageSec}s
//                 </div>
//               </div>
//             </div>

//             <ResourceBar
//               label="memory"
//               used={memUsed}
//               request={MEM_REQUEST}
//               limit={MEM_LIMIT}
//               unit="Mi"
//               isDark={isDark}
//             />
//             <ResourceBar
//               label="cpu"
//               used={cpuUsed}
//               request={CPU_REQUEST}
//               limit={CPU_LIMIT}
//               unit="m"
//               isDark={isDark}
//             />

//             {/* Controls */}
//             <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
//               <Button
//                 type="primary"
//                 onClick={runSimulation}
//                 disabled={simActive}
//                 icon={simActive ? <LoadingOutlined /> : <PlayCircleOutlined />}
//                 style={{
//                   flex: 1,
//                   height: 40,
//                   fontFamily: "'JetBrains Mono', monospace",
//                   fontWeight: 600,
//                   fontSize: 13,
//                 }}
//               >
//                 {simActive ? "Simulating…" : "Run simulation"}
//               </Button>
//               <Button
//                 onClick={resetAll}
//                 icon={<ReloadOutlined />}
//                 style={{
//                   height: 40,
//                   width: 48,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               />
//             </div>
//           </div>

//           {/* ── RIGHT: YAML + explanation ─────────────────── */}
//           <div>
//             <div
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: isDark ? "#6B7280" : "#64748B",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 marginBottom: 10,
//               }}
//             >
//               Pod specification
//             </div>
//             <YamlViewer isDark={isDark} scenario={scenario} />

//             <div
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: isDark ? "#6B7280" : "#64748B",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 marginBottom: 10,
//                 marginTop: 20,
//               }}
//             >
//               Why it happens
//             </div>

//             {scenario === "healthy" ? (
//               <div
//                 style={{
//                   borderLeft: `3px solid ${isDark ? "#34D399" : "#059669"}`,
//                   padding: "10px 14px",
//                   background: `${isDark ? "#34D399" : "#059669"}15`,
//                   borderRadius: "0 6px 6px 0",
//                   marginBottom: 12,
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 700,
//                     color: isDark ? "#34D399" : "#059669",
//                     marginBottom: 4,
//                   }}
//                 >
//                   limits — runtime enforcement
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 12,
//                     color: isDark ? "#9CA3AF" : "#475569",
//                     lineHeight: 1.65,
//                   }}
//                 >
//                   Because the application only allocates <strong>125M</strong>,
//                   it stays safely below the{" "}
//                   <code style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
//                     limits.memory: 150Mi
//                   </code>{" "}
//                   threshold. The Linux OOM killer does not intervene, and the
//                   Pod remains healthy.
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div
//                   style={{
//                     borderLeft: `3px solid ${isDark ? "#F87171" : "#DC2626"}`,
//                     padding: "10px 14px",
//                     background: `${isDark ? "#F87171" : "#DC2626"}15`,
//                     borderRadius: "0 6px 6px 0",
//                     marginBottom: 12,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 12,
//                       fontWeight: 700,
//                       color: isDark ? "#F87171" : "#DC2626",
//                       marginBottom: 4,
//                     }}
//                   >
//                     limits — runtime enforcement
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 12,
//                       color: isDark ? "#9CA3AF" : "#475569",
//                       lineHeight: 1.65,
//                     }}
//                   >
//                     <code style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
//                       memory: 150Mi
//                     </code>{" "}
//                     is enforced by the Linux kernel cgroup. When the container
//                     attempts to allocate <strong>155Mi</strong>, it crosses the
//                     limit. The kernel sends{" "}
//                     <code style={mono(11, isDark ? "#FCA5A5" : "#B91C1C")}>
//                       SIGKILL
//                     </code>{" "}
//                     → pod shows <strong>OOMKilled</strong>.
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     borderLeft: `3px solid ${isDark ? "#FBBF24" : "#D97706"}`,
//                     padding: "10px 14px",
//                     background: `${isDark ? "#FBBF24" : "#D97706"}15`,
//                     borderRadius: "0 6px 6px 0",
//                     marginBottom: 12,
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 12,
//                       fontWeight: 700,
//                       color: isDark ? "#FBBF24" : "#D97706",
//                       marginBottom: 4,
//                     }}
//                   >
//                     the crash loop
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 12,
//                       color: isDark ? "#9CA3AF" : "#475569",
//                       lineHeight: 1.65,
//                     }}
//                   >
//                     stress asks for <strong>155Mi (&gt; 150Mi limit)</strong>{" "}
//                     every time it starts, so it dies every restart. Kubernetes
//                     backs off exponentially:{" "}
//                     <strong>OOMKilled → CrashLoopBackOff → OOMKilled…</strong>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* ── kubectl terminal ───────────────────────────── */}
//         <div
//           style={{
//             fontSize: 10,
//             fontWeight: 700,
//             color: isDark ? "#6B7280" : "#64748B",
//             letterSpacing: "0.1em",
//             textTransform: "uppercase",
//             marginBottom: 10,
//           }}
//         >
//           kubectl get po -w
//         </div>
//         <Terminal entries={logs} isDark={isDark} />
//       </div>
//     </>
//   );
// }

