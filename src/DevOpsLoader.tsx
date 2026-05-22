import React, { useEffect, useState, useRef } from "react";

const DURATION = 3000; // 10-second boot sequence

// Simulated deployment logs
const SYSTEM_LOGS = [
  "systemd[1]: Starting Kubernetes API Server...",
  "kubelet[842]: Pulling image 'nginx:alpine'",
  "aws-alb[1192]: Configuring target group rules for mysitedesign.site...",
  "aws-alb[1192]: Path-based routing initialized on port 443",
  "docker[2041]: Starting container eventhub-web-prod...",
  "docker[2042]: Starting container stockvision-analytics-engine...",
  "django[3010]: Running migrations for pharmacy-billing module...",
  "django[3010]: Apply all migrations: admin, auth, billing, sessions...",
  "terraform[4001]: Acquiring state lock. This may take a few moments...",
  "k8s-pod[5921]: MountVolume.SetUp succeeded for volume 'cert-secret'",
  "aws-ec2[6022]: Health checks passing. Status: 200 OK",
  "systemd[1]: Reached target Deployment Complete.",
];

interface HardcoreLoaderProps {
  onComplete: () => void;
}

export default function HardcoreDevOpsLoader({
  onComplete,
}: HardcoreLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hexDump, setHexDump] = useState<string[]>([]);
  const [cpuCores, setCpuCores] = useState([0, 0, 0, 0]);
  const [visible, setVisible] = useState(true);

  const logsRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<HTMLDivElement>(null);

  // 1. Master Progress & Exit
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / DURATION) * 100));
      setProgress(pct);

      if (elapsed >= DURATION) {
        clearInterval(t);
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 800); // Hang on 100% for a split second
      }
    }, 50);
    return () => clearInterval(t);
  }, [onComplete]);

  // 2. Slow Logs Stream (Main deployment steps)
  useEffect(() => {
    let i = 0;
    const interval = (DURATION - 1500) / SYSTEM_LOGS.length;
    const stream = setInterval(() => {
      if (i < SYSTEM_LOGS.length) {
        const time = new Date().toISOString().substring(11, 23);
        setLogs((prev) => [...prev, `[${time}] ${SYSTEM_LOGS[i]}`]);
        i++;
      }
    }, interval);
    return () => clearInterval(stream);
  }, []);

  // 3. Fast Hex Dump Stream (Simulated network/memory traffic)
  useEffect(() => {
    const stream = setInterval(() => {
      const addr = Math.floor(Math.random() * 0xffffffff)
        .toString(16)
        .padStart(8, "0");
      const data = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 0xffff)
          .toString(16)
          .padStart(4, "0"),
      ).join(" ");
      setHexDump((prev) => [...prev.slice(-14), `0x${addr}  ${data}`]);
    }, 80);
    return () => clearInterval(stream);
  }, []);

  // 4. CPU Core Jitter (htop style)
  useEffect(() => {
    const jitter = setInterval(() => {
      setCpuCores((prev) =>
        prev.map(() => Math.floor(Math.random() * 80) + 10),
      );
    }, 400);
    return () => clearInterval(jitter);
  }, []);

  // Auto-scroll refs
  useEffect(() => {
    logsRef.current?.scrollIntoView({ behavior: "auto" });
  }, [logs]);

  useEffect(() => {
    hexRef.current?.scrollIntoView({ behavior: "auto" });
  }, [hexDump]);

  if (!visible) return null;

  const renderAsciiBar = (pct: number, length: number = 20) => {
    const filled = Math.round((pct / 100) * length);
    return `[${"|".repeat(filled)}${" ".repeat(length - filled)}]`;
  };

  return (
    <div style={s.overlay}>
      <div style={s.scanlines} />

      <div style={s.grid}>
        {/* TOP LEFT: CPU / Metrics (htop style) */}
        <div style={s.panel}>
          <div style={s.panelTitle}>top - node-worker-01</div>
          <div style={s.metricsContent}>
            {cpuCores.map((val, i) => (
              <div key={i} style={s.metricRow}>
                <span style={s.cyan}>CPU{i}</span>
                <span style={s.green}>{renderAsciiBar(val, 24)}</span>
                <span style={s.dim}>{val.toString().padStart(3, " ")}%</span>
              </div>
            ))}
            <div style={s.metricRow}>
              <span style={s.cyan}>MEM </span>
              <span style={s.yellow}>{renderAsciiBar(progress, 24)}</span>
              <span style={s.dim}>{progress.toString().padStart(3, " ")}%</span>
            </div>
            <br />
            <div style={s.dim}>Tasks: 114 total, 2 running, 112 sleeping</div>
            <div style={s.dim}>Load average: 1.42, 1.28, 1.14</div>
          </div>
        </div>

        {/* TOP RIGHT: Network Hex Dump */}
        <div style={s.panel}>
          <div style={s.panelTitle}>tcpdump -i eth0 port 443</div>
          <div style={s.hexContent}>
            {hexDump.map((line, i) => (
              <div key={i} style={s.hexLine}>
                {line}
              </div>
            ))}
            <div ref={hexRef} />
          </div>
        </div>

        {/* BOTTOM WIDE: Main Deployment Logs */}
        <div style={{ ...s.panel, ...s.widePanel }}>
          <div style={s.panelTitle}>tail -f /var/log/deploy.log</div>
          <div style={s.logContent}>
            {logs.map((log, i) => (
              <div key={i}>
                <span style={s.dim}>{log.split("] ")[0] + "] "}</span>
                <span
                  style={
                    log.includes("aws")
                      ? s.yellow
                      : log.includes("docker") || log.includes("k8s")
                        ? s.cyan
                        : log.includes("django")
                          ? s.green
                          : { color: "#ccc" } // Fixed here
                  }
                >
                  {log.split("] ")[1]}
                </span>
              </div>
            ))}
            <div ref={logsRef} />
          </div>
        </div>
      </div>

      {/* FOOTER: Master Progress */}
      <div style={s.footer}>
        <div style={s.statusBlink}>
          {progress < 100 ? "DEPLOYMENT IN PROGRESS" : "SYSTEM ONLINE"}
        </div>
        <div style={s.masterBar}>
          {renderAsciiBar(progress, 50)} {progress}%
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "#050505",
    color: "#ccc",
    fontFamily: "'Courier New', Courier, monospace", // Raw server font
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    zIndex: 9999,
    padding: "20px",
    boxSizing: "border-box",
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
    backgroundSize: "100% 4px, 3px 100%",
    pointerEvents: "none",
    zIndex: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "auto 1fr",
    gap: "16px",
    flex: 1,
    minHeight: 0,
  },
  panel: {
    border: "1px solid #333",
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  widePanel: {
    gridColumn: "1 / -1", // Spans the full width at the bottom
  },
  panelTitle: {
    background: "#1a1a1a",
    color: "#fff",
    padding: "4px 8px",
    borderBottom: "1px solid #333",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  metricsContent: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metricRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  hexContent: {
    padding: "12px",
    overflowY: "hidden",
    color: "#5f87af", // Terminal blue-grey
    fontSize: "13px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  hexLine: {
    whiteSpace: "pre",
  },
  logContent: {
    padding: "12px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
    scrollbarWidth: "none", // Hide scrollbars
  },
  footer: {
    marginTop: "16px",
    border: "1px solid #333",
    background: "#111",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
  },
  masterBar: {
    color: "#00ff00",
    letterSpacing: "2px",
    whiteSpace: "pre",
  },
  statusBlink: {
    color: "#ff0055",
    animation: "pulse 1s steps(2, start) infinite",
  },
  cyan: { color: "#00d7d7" },
  green: { color: "#87af5f" },
  yellow: { color: "#d7af5f" },
  dim: { color: "#666" },
};