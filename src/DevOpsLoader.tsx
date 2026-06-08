// import React, { useEffect, useState, useRef } from "react";

// const DURATION = 10000;

// const BOOT_STAGES = [
//   { pct: 0, label: "INITIALIZING CLUSTER", color: "#326CE5" },
//   { pct: 20, label: "PULLING IMAGES", color: "#22c55e" },
//   { pct: 40, label: "MOUNTING VOLUMES", color: "#f59e0b" },
//   { pct: 60, label: "RUNNING MIGRATIONS", color: "#a855f7" },
//   { pct: 80, label: "HEALTH CHECKS PASSING", color: "#06b6d4" },
//   { pct: 95, label: "SYSTEM ONLINE", color: "#22c55e" },
// ];

// const SYSTEM_LOGS = [
//   { tag: "k8s", text: "Starting Kubernetes API Server on :6443" },
//   { tag: "kubelet", text: "Pulling image 'nginx:alpine' → sha256:a4b2c3" },
//   { tag: "alb", text: "Path-based routing initialized on port 443" },
//   { tag: "docker", text: "Container eventhub-web-prod → RUNNING" },
//   { tag: "docker", text: "Container stockvision-analytics → RUNNING" },
//   { tag: "django", text: "Apply all migrations: admin, auth, billing" },
//   { tag: "tf", text: "Acquiring state lock — this may take a moment" },
//   { tag: "k8s", text: "MountVolume.SetUp succeeded for 'cert-secret'" },
//   { tag: "alb", text: "Health checks passing — status: 200 OK" },
//   { tag: "k8s", text: "Reached target: Deployment Complete ✓" },
// ];

// const TAG_COLORS: Record<string, string> = {
//   k8s: "#326CE5",
//   kubelet: "#06b6d4",
//   alb: "#f59e0b",
//   docker: "#22c55e",
//   django: "#a855f7",
//   tf: "#f97316",
// };

// interface Props {
//   onComplete: () => void;
// }

// // ── Animated K8s wheel ──
// function K8sWheel({ spin }: { spin: boolean }) {
//   return (
//     <svg
//       width="64"
//       height="64"
//       viewBox="0 0 64 64"
//       fill="none"
//       style={{
//         animation: spin ? "k8sSpin 3s linear infinite" : "none",
//         filter: "drop-shadow(0 0 12px rgba(50,108,229,0.7))",
//       }}
//     >
//       {/* Outer ring */}
//       <circle
//         cx="32"
//         cy="32"
//         r="30"
//         stroke="#326CE5"
//         strokeWidth="2"
//         opacity="0.4"
//       />
//       {/* 7 spokes */}
//       {Array.from({ length: 7 }).map((_, i) => {
//         const angle = (i * 360) / 7;
//         const rad = (angle * Math.PI) / 180;
//         const x1 = 32 + 10 * Math.cos(rad);
//         const y1 = 32 + 10 * Math.sin(rad);
//         const x2 = 32 + 28 * Math.cos(rad);
//         const y2 = 32 + 28 * Math.sin(rad);
//         return (
//           <line
//             key={i}
//             x1={x1}
//             y1={y1}
//             x2={x2}
//             y2={y2}
//             stroke="#326CE5"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//           />
//         );
//       })}
//       {/* Hub */}
//       <circle cx="32" cy="32" r="9" fill="#326CE5" opacity="0.9" />
//       <circle cx="32" cy="32" r="5" fill="#060e23" />
//       {/* Gear teeth */}
//       {Array.from({ length: 7 }).map((_, i) => {
//         const angle = (i * 360) / 7;
//         const rad = (angle * Math.PI) / 180;
//         const cx = 32 + 28 * Math.cos(rad);
//         const cy = 32 + 28 * Math.sin(rad);
//         return <circle key={i} cx={cx} cy={cy} r="4" fill="#326CE5" />;
//       })}
//     </svg>
//   );
// }

// // ── Circular progress ring ──
// function ProgressRing({ pct }: { pct: number }) {
//   const r = 54;
//   const circ = 2 * Math.PI * r;
//   const dash = circ * (pct / 100);
//   return (
//     <svg
//       width="140"
//       height="140"
//       viewBox="0 0 140 140"
//       fill="none"
//       style={{ position: "absolute", top: 0, left: 0 }}
//     >
//       <circle
//         cx="70"
//         cy="70"
//         r={r}
//         stroke="rgba(50,108,229,0.12)"
//         strokeWidth="6"
//         fill="none"
//       />
//       <circle
//         cx="70"
//         cy="70"
//         r={r}
//         stroke="url(#ringGrad)"
//         strokeWidth="6"
//         fill="none"
//         strokeDasharray={`${dash} ${circ}`}
//         strokeDashoffset="0"
//         strokeLinecap="round"
//         transform="rotate(-90 70 70)"
//         style={{ transition: "stroke-dasharray 0.3s ease" }}
//       />
//       <defs>
//         <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stopColor="#326CE5" />
//           <stop offset="100%" stopColor="#22c55e" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }

// // ── Mini node cluster vis ──
// function NodeCluster({ progress }: { progress: number }) {
//   const nodes = [
//     { id: "master", x: 50, y: 50, label: "master" },
//     { id: "w1", x: 20, y: 80, label: "worker-1" },
//     { id: "w2", x: 80, y: 80, label: "worker-2" },
//     { id: "w3", x: 20, y: 20, label: "worker-3" },
//     { id: "w4", x: 80, y: 20, label: "worker-4" },
//   ];
//   const edges = [
//     ["master", "w1"],
//     ["master", "w2"],
//     ["master", "w3"],
//     ["master", "w4"],
//   ];
//   const activeNodes = Math.floor((progress / 100) * nodes.length);

//   return (
//     <svg
//       viewBox="0 0 100 100"
//       width="100%"
//       height="100%"
//       style={{ overflow: "visible" }}
//     >
//       {edges.map(([a, b], i) => {
//         const na = nodes.find((n) => n.id === a)!;
//         const nb = nodes.find((n) => n.id === b)!;
//         return (
//           <line
//             key={i}
//             x1={na.x}
//             y1={na.y}
//             x2={nb.x}
//             y2={nb.y}
//             stroke="rgba(50,108,229,0.25)"
//             strokeWidth="0.8"
//             strokeDasharray="3 2"
//           />
//         );
//       })}
//       {nodes.map((n, i) => {
//         const active = i < activeNodes;
//         const isMaster = n.id === "master";
//         return (
//           <g key={n.id}>
//             <circle
//               cx={n.x}
//               cy={n.y}
//               r={isMaster ? 7 : 5}
//               fill={active ? (isMaster ? "#326CE5" : "#22c55e") : "#1e293b"}
//               stroke={active ? (isMaster ? "#5B8FF9" : "#4ade80") : "#334155"}
//               strokeWidth="1"
//               style={{
//                 filter: active
//                   ? `drop-shadow(0 0 4px ${isMaster ? "#326CE5" : "#22c55e"})`
//                   : "none",
//               }}
//             />
//             <text
//               x={n.x}
//               y={n.y + (isMaster ? 13 : 11)}
//               textAnchor="middle"
//               fill={active ? "#94a3b8" : "#334155"}
//               fontSize="5"
//               fontFamily="'JetBrains Mono', monospace"
//             >
//               {n.label}
//             </text>
//           </g>
//         );
//       })}
//     </svg>
//   );
// }

// export default function HardcoreDevOpsLoader({ onComplete }: Props) {
//   const [progress, setProgress] = useState(0);
//   const [logs, setLogs] = useState<typeof SYSTEM_LOGS>([]);
//   const [hexDump, setHexDump] = useState<string[]>([]);
//   const [cpuCores, setCpuCores] = useState([12, 18, 9, 24]);
//   const [memPct, setMemPct] = useState(34);
//   const [visible, setVisible] = useState(true);
//   const [fadeOut, setFadeOut] = useState(false);
//   const logsEndRef = useRef<HTMLDivElement>(null);

//   const currentStage = BOOT_STAGES.reduce(
//     (acc, s) => (progress >= s.pct ? s : acc),
//     BOOT_STAGES[0],
//   );

//   useEffect(() => {
//     const start = Date.now();
//     const t = setInterval(() => {
//       const elapsed = Date.now() - start;
//       const pct = Math.min(100, Math.floor((elapsed / DURATION) * 100));
//       setProgress(pct);
//       if (elapsed >= DURATION) {
//         clearInterval(t);
//         setTimeout(() => {
//           setFadeOut(true);
//         }, 400);
//         setTimeout(() => {
//           setVisible(false);
//           onComplete();
//         }, 1100);
//       }
//     }, 40);
//     return () => clearInterval(t);
//   }, [onComplete]);

//   useEffect(() => {
//     let i = 0;
//     const interval = (DURATION - 800) / SYSTEM_LOGS.length;
//    const stream = setInterval(() => {
//      if (i < SYSTEM_LOGS.length) {
//        const entry = SYSTEM_LOGS[i];
//        if (entry) setLogs((prev) => [...prev, entry]);
//        i++;
//      } else {
//        clearInterval(stream);
//      }
//    }, interval);
//     return () => clearInterval(stream);
//   }, []);

//   useEffect(() => {
//     const stream = setInterval(() => {
//       const addr = Math.floor(Math.random() * 0xffffffff)
//         .toString(16)
//         .padStart(8, "0");
//       const bytes = Array.from({ length: 8 }, () =>
//         Math.floor(Math.random() * 256)
//           .toString(16)
//           .padStart(2, "0"),
//       ).join(" ");
//       setHexDump((prev) => [...prev.slice(-10), `0x${addr}  ${bytes}`]);
//     }, 90);
//     return () => clearInterval(stream);
//   }, []);

//   useEffect(() => {
//     const jitter = setInterval(() => {
//       setCpuCores((prev) =>
//         prev.map(() => Math.floor(Math.random() * 75) + 10),
//       );
//       setMemPct(Math.floor(progress * 0.6 + Math.random() * 15));
//     }, 350);
//     return () => clearInterval(jitter);
//   }, [progress]);

//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [logs]);

//   if (!visible) return null;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
//         @keyframes k8sSpin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         @keyframes blink      { 0%,100%{opacity:1} 49%{opacity:1} 50%,99%{opacity:0} }
//         @keyframes scanMove   { from{background-position:0 0} to{background-position:0 100%} }
//         @keyframes fadeUp     { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes loaderExit { to{opacity:0;transform:scale(1.03)} }
//         @keyframes hexPulse   { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
//         @keyframes glowPulse  { 0%,100%{box-shadow:0 0 20px rgba(50,108,229,0.15)} 50%{box-shadow:0 0 40px rgba(50,108,229,0.35)} }

//         .devops-loader { animation: ${fadeOut ? "loaderExit 0.7s ease forwards" : "none"}; }
//         .log-line { animation: fadeUp 0.25s ease both; }

//         .cpu-bar-fill {
//           display: inline-block;
//           height: 6px;
//           border-radius: 2px;
//           transition: width 0.3s ease;
//         }
//         .panel-box {
//           background: rgba(6,10,26,0.85);
//           border: 1px solid rgba(50,108,229,0.18);
//           border-radius: 10px;
//           overflow: hidden;
//           display: flex;
//           flex-direction: column;
//         }
//         .panel-title {
//           padding: 6px 12px;
//           background: rgba(50,108,229,0.08);
//           border-bottom: 1px solid rgba(50,108,229,0.15);
//           font-size: 10px;
//           font-weight: 700;
//           letter-spacing: 0.12em;
//           color: #326CE5;
//           text-transform: uppercase;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }
//         .panel-dot {
//           width: 6px; height: 6px; border-radius: 50%;
//           background: #326CE5;
//           box-shadow: 0 0 6px #326CE5;
//           animation: blink 1.2s infinite;
//         }
//         .hex-bg {
//           position: absolute; inset: 0; pointer-events: none; z-index: 0;
//           opacity: 0.04;
//           animation: hexPulse 4s ease-in-out infinite;
//         }
//       `}</style>

//       <div
//         className="devops-loader"
//         style={{
//           position: "fixed",
//           inset: 0,
//           zIndex: 9999,
//           background:
//             "radial-gradient(ellipse at 30% 20%, rgba(50,108,229,0.08) 0%, transparent 60%), #04080f",
//           fontFamily: "'JetBrains Mono', monospace",
//           display: "flex",
//           flexDirection: "column",
//           padding: "20px",
//           boxSizing: "border-box",
//           overflow: "hidden",
//         }}
//       >
//         {/* Hex grid SVG background */}
//         <svg
//           className="hex-bg"
//           viewBox="0 0 800 500"
//           preserveAspectRatio="xMidYMid slice"
//         >
//           {Array.from({ length: 8 }).map((_, row) =>
//             Array.from({ length: 12 }).map((_, col) => {
//               const x = col * 70 + (row % 2) * 35;
//               const y = row * 60;
//               const pts = Array.from({ length: 6 })
//                 .map((__, i) => {
//                   const a = (Math.PI / 3) * i;
//                   return `${x + 28 * Math.cos(a)},${y + 28 * Math.sin(a)}`;
//                 })
//                 .join(" ");
//               return (
//                 <polygon
//                   key={`${row}-${col}`}
//                   points={pts}
//                   stroke="#326CE5"
//                   strokeWidth="0.8"
//                   fill="none"
//                 />
//               );
//             }),
//           )}
//         </svg>

//         {/* Scanlines overlay */}
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             pointerEvents: "none",
//             zIndex: 1,
//             background:
//               "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
//           }}
//         />

//         <div
//           style={{
//             position: "relative",
//             zIndex: 2,
//             display: "flex",
//             flexDirection: "column",
//             flex: 1,
//             gap: 14,
//           }}
//         >
//           {/* ── HEADER ── */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <K8sWheel spin={progress < 100} />
//               <div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: "#326CE5",
//                     letterSpacing: "0.18em",
//                     fontWeight: 700,
//                   }}
//                 >
//                   KUBERNETES · CLUSTER BOOTSTRAP
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 18,
//                     fontWeight: 700,
//                     color: "#f1f5f9",
//                     letterSpacing: "0.05em",
//                     marginTop: 2,
//                     textShadow: "0 0 20px rgba(50,108,229,0.5)",
//                   }}
//                 >
//                   {currentStage.label}
//                   <span
//                     style={{
//                       animation: "blink 0.9s step-end infinite",
//                       color: currentStage.color,
//                     }}
//                   >
//                     {" "}
//                     █
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Progress ring */}
//             <div
//               style={{
//                 position: "relative",
//                 width: 140,
//                 height: 140,
//                 flexShrink: 0,
//               }}
//             >
//               <ProgressRing pct={progress} />
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 28,
//                     fontWeight: 700,
//                     color: "#f1f5f9",
//                     lineHeight: 1,
//                   }}
//                 >
//                   {progress}
//                   <span style={{ fontSize: 14, color: "#64748b" }}>%</span>
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 9,
//                     color: "#475569",
//                     letterSpacing: "0.1em",
//                     marginTop: 3,
//                   }}
//                 >
//                   DEPLOYING
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── MAIN GRID ── */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr",
//               gridTemplateRows: "auto 1fr",
//               gap: 12,
//               flex: 1,
//               minHeight: 0,
//             }}
//           >
//             {/* CPU Metrics */}
//             <div
//               className="panel-box"
//               style={{ animation: "glowPulse 3s ease-in-out infinite" }}
//             >
//               <div className="panel-title">
//                 <div className="panel-dot" />
//                 node-worker-01 · metrics
//               </div>
//               <div
//                 style={{
//                   padding: "10px 12px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 8,
//                 }}
//               >
//                 {cpuCores.map((val, i) => (
//                   <div
//                     key={i}
//                     style={{ display: "flex", alignItems: "center", gap: 8 }}
//                   >
//                     <span style={{ fontSize: 10, color: "#475569", width: 36 }}>
//                       CPU{i}
//                     </span>
//                     <div
//                       style={{
//                         flex: 1,
//                         height: 6,
//                         background: "rgba(50,108,229,0.1)",
//                         borderRadius: 3,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <div
//                         className="cpu-bar-fill"
//                         style={{
//                           width: `${val}%`,
//                           background:
//                             val > 70
//                               ? "linear-gradient(90deg,#f59e0b,#ef4444)"
//                               : val > 40
//                                 ? "linear-gradient(90deg,#326CE5,#06b6d4)"
//                                 : "linear-gradient(90deg,#22c55e,#326CE5)",
//                         }}
//                       />
//                     </div>
//                     <span
//                       style={{
//                         fontSize: 10,
//                         color: "#64748b",
//                         width: 32,
//                         textAlign: "right",
//                       }}
//                     >
//                       {val}%
//                     </span>
//                   </div>
//                 ))}
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     marginTop: 2,
//                   }}
//                 >
//                   <span style={{ fontSize: 10, color: "#475569", width: 36 }}>
//                     MEM
//                   </span>
//                   <div
//                     style={{
//                       flex: 1,
//                       height: 6,
//                       background: "rgba(168,85,247,0.1)",
//                       borderRadius: 3,
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       className="cpu-bar-fill"
//                       style={{
//                         width: `${memPct}%`,
//                         background: "linear-gradient(90deg,#a855f7,#ec4899)",
//                       }}
//                     />
//                   </div>
//                   <span
//                     style={{
//                       fontSize: 10,
//                       color: "#64748b",
//                       width: 32,
//                       textAlign: "right",
//                     }}
//                   >
//                     {memPct}%
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     borderTop: "1px solid rgba(50,108,229,0.1)",
//                     marginTop: 4,
//                     paddingTop: 8,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 3,
//                   }}
//                 >
//                   {[
//                     ["TASKS", "114 total · 2 running"],
//                     ["LOAD", "1.42 · 1.28 · 1.14"],
//                     ["UP", "0d 0h 0m"],
//                   ].map(([k, v]) => (
//                     <div
//                       key={k}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 9,
//                           color: "#334155",
//                           letterSpacing: "0.1em",
//                         }}
//                       >
//                         {k}
//                       </span>
//                       <span style={{ fontSize: 9, color: "#64748b" }}>{v}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Node cluster */}
//             <div className="panel-box">
//               <div className="panel-title">
//                 <div
//                   className="panel-dot"
//                   style={{
//                     background: "#22c55e",
//                     boxShadow: "0 0 6px #22c55e",
//                   }}
//                 />
//                 cluster topology
//               </div>
//               <div
//                 style={{
//                   flex: 1,
//                   padding: "10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 8,
//                 }}
//               >
//                 <div style={{ flex: 1 }}>
//                   <NodeCluster progress={progress} />
//                 </div>
//                 <div
//                   style={{
//                     borderTop: "1px solid rgba(50,108,229,0.1)",
//                     paddingTop: 8,
//                     display: "flex",
//                     gap: 8,
//                   }}
//                 >
//                   {[
//                     { label: "NODES", val: "5", color: "#326CE5" },
//                     {
//                       label: "PODS",
//                       val: `${Math.floor(progress / 12)}`,
//                       color: "#22c55e",
//                     },
//                     { label: "SVC", val: "3", color: "#a855f7" },
//                   ].map(({ label, val, color }) => (
//                     <div
//                       key={label}
//                       style={{
//                         flex: 1,
//                         textAlign: "center",
//                         padding: "6px 4px",
//                         background: `${color}10`,
//                         borderRadius: 6,
//                         border: `1px solid ${color}25`,
//                       }}
//                     >
//                       <div style={{ fontSize: 16, fontWeight: 700, color }}>
//                         {val}
//                       </div>
//                       <div
//                         style={{
//                           fontSize: 8,
//                           color: "#475569",
//                           letterSpacing: "0.1em",
//                         }}
//                       >
//                         {label}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Hex / network dump */}
//             <div className="panel-box">
//               <div className="panel-title">
//                 <div
//                   className="panel-dot"
//                   style={{
//                     background: "#06b6d4",
//                     boxShadow: "0 0 6px #06b6d4",
//                   }}
//                 />
//                 tcpdump · eth0:443
//               </div>
//               <div
//                 style={{
//                   flex: 1,
//                   padding: "10px 12px",
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 3,
//                 }}
//               >
//                 {hexDump.map((line, i) => {
//                   const [addr, ...rest] = line.split("  ");
//                   return (
//                     <div
//                       key={i}
//                       style={{ display: "flex", gap: 8, fontSize: 10 }}
//                     >
//                       <span style={{ color: "#334155", flexShrink: 0 }}>
//                         {addr}
//                       </span>
//                       <span
//                         style={{ color: "#06b6d4", letterSpacing: "0.05em" }}
//                       >
//                         {rest.join("  ")}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Deployment log — spans full width */}
//             <div className="panel-box" style={{ gridColumn: "1 / -1" }}>
//               <div className="panel-title">
//                 <div className="panel-dot" />
//                 tail -f /var/log/k8s-deploy.log
//               </div>
//               <div
//                 style={{
//                   flex: 1,
//                   padding: "10px 14px",
//                   overflowY: "auto",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 5,
//                   maxHeight: 160,
//                   scrollbarWidth: "none",
//                 }}
//               >
//                 {logs.filter(Boolean).map((log, i) => {
//                   const tagColor = TAG_COLORS[log.tag] || "#64748b";
//                   return (
//                     <div
//                       key={i}
//                       className="log-line"
//                       style={{
//                         display: "flex",
//                         gap: 10,
//                         alignItems: "baseline",
//                         animationDelay: `${i * 0.02}s`,
//                       }}
//                     >
//                       <span
//                         style={{ color: "#334155", fontSize: 9, flexShrink: 0 }}
//                       >
//                         {new Date().toISOString().substring(11, 19)}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: 9,
//                           padding: "1px 6px",
//                           borderRadius: 4,
//                           background: `${tagColor}18`,
//                           border: `1px solid ${tagColor}35`,
//                           color: tagColor,
//                           flexShrink: 0,
//                           letterSpacing: "0.08em",
//                           fontWeight: 700,
//                           minWidth: 52,
//                           textAlign: "center",
//                         }}
//                       >
//                         {log.tag.toUpperCase()}
//                       </span>
//                       <span style={{ fontSize: 11, color: "#94a3b8" }}>
//                         {log.text}
//                       </span>
//                       {i === logs.length - 1 && (
//                         <span
//                           style={{
//                             color: tagColor,
//                             animation: "blink 0.7s step-end infinite",
//                           }}
//                         >
//                           ▌
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//                 <div ref={logsEndRef} />
//               </div>
//             </div>
//           </div>

//           {/* ── FOOTER PROGRESS ── */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 16,
//               padding: "10px 14px",
//               background: "rgba(6,10,26,0.9)",
//               border: "1px solid rgba(50,108,229,0.2)",
//               borderRadius: 10,
//             }}
//           >
//             <div
//               style={{
//                 fontSize: 10,
//                 color: currentStage.color,
//                 fontWeight: 700,
//                 letterSpacing: "0.15em",
//                 animation: "blink 1.5s step-end infinite",
//                 flexShrink: 0,
//               }}
//             >
//               ● {currentStage.label}
//             </div>
//             <div
//               style={{
//                 flex: 1,
//                 height: 4,
//                 background: "rgba(50,108,229,0.1)",
//                 borderRadius: 4,
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   borderRadius: 4,
//                   width: `${progress}%`,
//                   background: "linear-gradient(90deg, #326CE5, #22c55e)",
//                   transition: "width 0.2s ease",
//                   boxShadow: "0 0 10px rgba(50,108,229,0.6)",
//                 }}
//               />
//             </div>
//             <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
//               {BOOT_STAGES.map((s, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: "50%",
//                     background: progress >= s.pct ? s.color : "#1e293b",
//                     border: `1px solid ${progress >= s.pct ? s.color : "#334155"}`,
//                     boxShadow:
//                       progress >= s.pct ? `0 0 6px ${s.color}` : "none",
//                     transition: "all 0.3s ease",
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";

const STEPS = [
  "Initializing pipeline",
  "Running tests",
  "Building image",
  "Pushing to registry",
  "Deploying",
  "Health checks",
  "All systems go 🚀",
];

function gearPath(R = 90, r = 72, teeth = 12, holeR = 28) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step - step * 0.5;
    const a1 = i * step - step * 0.18;
    const a2 = i * step + step * 0.18;
    const a3 = i * step + step * 0.5;
    pts.push(
      `${r * Math.cos(a0)},${r * Math.sin(a0)}`,
      `${R * Math.cos(a1)},${R * Math.sin(a1)}`,
      `${R * Math.cos(a2)},${R * Math.sin(a2)}`,
      `${r * Math.cos(a3)},${r * Math.sin(a3)}`,
    );
  }
  const hole = `M ${holeR},0 A ${holeR},${holeR} 0 1 0 ${-holeR},0 A ${holeR},${holeR} 0 1 0 ${holeR},0 Z`;
  return `M ${pts[0]} ${pts
    .slice(1)
    .map((p) => "L " + p)
    .join(" ")} Z ${hole}`;
}

const GEAR = gearPath();

interface DevOpsLoaderProps {
  onComplete?: () => void;
}

export default function DevOpsLoader({ onComplete }: DevOpsLoaderProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        const nextStep = (s + 1) % STEPS.length;
        if (nextStep === STEPS.length - 1) {
          onComplete?.();
        }
        return nextStep;
      });
      setProgress((p) => Math.min(p + 100 / STEPS.length, 100));
    }, 1200);
    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 32,
          boxShadow: "0 12px 60px #c7daf230",
          padding: "44px 52px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          minWidth: 380,
        }}
      >
        {/* ── Illustration SVG ── */}
        <svg
          viewBox="0 0 520 360"
          width="380"
          height="260"
          style={{ overflow: "visible" }}
        >
          <defs>
            <style>{`
              .gear-l  { animation: spinCCW 7s linear infinite; transform-origin: 160px 185px; }
              .gear-r  { animation: spinCW  5s linear infinite; transform-origin: 345px 195px; }
              .arr     { animation: spinCW  6s linear infinite; transform-origin: 252px 185px; }
              .bdg-l   { animation: floatY 2.6s ease-in-out infinite; }
              .bdg-r   { animation: floatY 2.2s ease-in-out infinite reverse; }
              .p-bob   { animation: bob 2.8s ease-in-out infinite; }
              .w-sway  { animation: sway 3.2s ease-in-out infinite; }
              @keyframes spinCW  { to { transform: rotate( 360deg); } }
              @keyframes spinCCW { to { transform: rotate(-360deg); } }
              @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
              @keyframes bob     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
              @keyframes sway    { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
            `}</style>
          </defs>

          {/* ── Left Gear ── */}
          <g className="gear-l">
            <path
              d={GEAR}
              transform="translate(160,185) scale(0.95)"
              fill="#bfdbfe"
              stroke="#93c5fd"
              strokeWidth="2"
              fillRule="evenodd"
            />
          </g>

          {/* ── Right Gear ── */}
          <g className="gear-r">
            <path
              d={GEAR}
              transform="translate(345,195) scale(1.05)"
              fill="#c7d7f4"
              stroke="#93c5fd"
              strokeWidth="2"
              fillRule="evenodd"
            />
          </g>

          {/* ── Circular dashed arrows ── */}
          <g className="arr">
            <path
              d="M 180,90 A 130,130 0 0 1 360,130"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="14 9"
            />
            <path
              d="M 330,295 A 130,130 0 0 1 150,255"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="14 9"
            />
            <polygon points="360,118 374,138 350,140" fill="#3b82f6" />
            <polygon points="148,267 134,247 158,245" fill="#3b82f6" />
          </g>

          {/* ── Left Character (purple jacket, green notepad) ── */}
          <g className="p-bob">
            {/* torso */}
            <rect
              x="127"
              y="148"
              width="46"
              height="52"
              rx="10"
              fill="#a78bfa"
            />
            {/* inner shirt */}
            <rect
              x="140"
              y="149"
              width="20"
              height="30"
              rx="5"
              fill="#38bdf8"
            />
            {/* skirt */}
            <path
              d="M124 196 Q150 210 176 196 L172 230 Q150 240 128 230 Z"
              fill="#2563eb"
            />
            {/* head */}
            <ellipse cx="150" cy="132" rx="19" ry="21" fill="#f5c5a3" />
            {/* hair */}
            <path
              d="M131,126 Q133,106 150,108 Q167,106 169,126 Q166,108 150,109 Q134,108 131,126Z"
              fill="#1a1a2e"
            />
            {/* eyes */}
            <ellipse cx="144" cy="131" rx="2.2" ry="2.5" fill="#1a1a2e" />
            <ellipse cx="156" cy="131" rx="2.2" ry="2.5" fill="#1a1a2e" />
            {/* smile */}
            <path
              d="M145,139 Q150,143 155,139"
              stroke="#b45309"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* left arm */}
            <path
              d="M127,158 Q112,175 118,192"
              stroke="#f5c5a3"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* right arm + hand */}
            <path
              d="M173,158 Q188,165 192,180"
              stroke="#f5c5a3"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* notepad */}
            <rect
              x="174"
              y="162"
              width="28"
              height="36"
              rx="4"
              fill="#4ade80"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
            <rect x="177" y="157" width="4" height="10" rx="2" fill="#9ca3af" />
            <rect x="183" y="157" width="4" height="10" rx="2" fill="#9ca3af" />
            <rect x="189" y="157" width="4" height="10" rx="2" fill="#9ca3af" />
            <line
              x1="178"
              y1="174"
              x2="198"
              y2="174"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <line
              x1="178"
              y1="180"
              x2="196"
              y2="180"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <line
              x1="178"
              y1="186"
              x2="194"
              y2="186"
              stroke="#fff"
              strokeWidth="1.5"
            />
            {/* pen */}
            <line
              x1="164"
              y1="175"
              x2="180"
              y2="165"
              stroke="#374151"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* legs */}
            <path
              d="M134,228 Q132,255 128,270"
              stroke="#2563eb"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M166,228 Q170,253 166,268"
              stroke="#2563eb"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            {/* shoes */}
            <ellipse cx="128" cy="273" rx="12" ry="6" fill="#1a1a2e" />
            <ellipse cx="166" cy="272" rx="12" ry="6" fill="#1a1a2e" />
          </g>

          {/* ── Right Character (green hoodie, laptop) ── */}
          <g className="w-sway">
            {/* torso hoodie */}
            <rect
              x="308"
              y="168"
              width="56"
              height="60"
              rx="12"
              fill="#4ade80"
            />
            {/* hoodie pocket */}
            <rect
              x="324"
              y="208"
              width="24"
              height="16"
              rx="5"
              fill="#22c55e"
            />
            {/* head */}
            <ellipse cx="337" cy="152" rx="20" ry="22" fill="#f5c5a3" />
            {/* hair */}
            <path
              d="M317,147 Q320,128 337,129 Q354,128 357,147 Q354,129 337,130 Q320,129 317,147Z"
              fill="#1a1a2e"
            />
            {/* ponytail */}
            <path
              d="M355,138 Q368,132 366,148"
              stroke="#1a1a2e"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* eyes */}
            <ellipse cx="331" cy="151" rx="2.2" ry="2.5" fill="#1a1a2e" />
            <ellipse cx="343" cy="151" rx="2.2" ry="2.5" fill="#1a1a2e" />
            {/* smile */}
            <path
              d="M332,159 Q337,163 342,159"
              stroke="#b45309"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* gesturing arm */}
            <path
              d="M308,180 Q290,188 283,202"
              stroke="#f5c5a3"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* right arm on laptop */}
            <path
              d="M364,178 Q376,192 374,210"
              stroke="#4ade80"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* laptop base */}
            <rect
              x="298"
              y="240"
              width="90"
              height="10"
              rx="5"
              fill="#93c5fd"
            />
            {/* laptop screen */}
            <rect
              x="302"
              y="200"
              width="82"
              height="42"
              rx="5"
              fill="#1e40af"
            />
            <rect
              x="306"
              y="204"
              width="74"
              height="34"
              rx="3"
              fill="#3b82f6"
            />
            {/* screen content */}
            <rect
              x="310"
              y="208"
              width="30"
              height="3"
              rx="1"
              fill="#bfdbfe"
              opacity="0.8"
            />
            <rect
              x="310"
              y="214"
              width="46"
              height="3"
              rx="1"
              fill="#bfdbfe"
              opacity="0.5"
            />
            <rect
              x="310"
              y="220"
              width="38"
              height="3"
              rx="1"
              fill="#bfdbfe"
              opacity="0.5"
            />
            <rect
              x="310"
              y="226"
              width="50"
              height="3"
              rx="1"
              fill="#4ade80"
              opacity="0.8"
            />
            <circle cx="343" cy="241" r="3" fill="#60a5fa" />
            {/* legs */}
            <path
              d="M316,226 Q310,256 308,272"
              stroke="#2563eb"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M358,226 Q362,255 360,272"
              stroke="#2563eb"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* sneakers */}
            <ellipse cx="307" cy="276" rx="14" ry="7" fill="#38bdf8" />
            <ellipse cx="360" cy="276" rx="14" ry="7" fill="#38bdf8" />
            <ellipse cx="307" cy="274" rx="12" ry="5" fill="#7dd3fc" />
            <ellipse cx="360" cy="274" rx="12" ry="5" fill="#7dd3fc" />
          </g>

          {/* ── Code badge bottom-left ── */}
          <g className="bdg-l" transform="translate(52,228)">
            <rect
              width="72"
              height="36"
              rx="8"
              fill="white"
              stroke="#1e3a5f"
              strokeWidth="2"
              style={{ filter: "drop-shadow(2px 3px 0px #b6d4f8)" }}
            />
            <text
              x="36"
              y="24"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="16"
              fontWeight="800"
              fill="#1e3a5f"
            >
              &lt;/&gt;
            </text>
          </g>

          {/* ── Code badge top-right ── */}
          <g className="bdg-r" transform="translate(390,48)">
            <rect
              width="72"
              height="36"
              rx="8"
              fill="white"
              stroke="#1e3a5f"
              strokeWidth="2"
              style={{ filter: "drop-shadow(2px 3px 0px #b6d4f8)" }}
            />
            <text
              x="36"
              y="24"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="16"
              fontWeight="800"
              fill="#1e3a5f"
            >
              &lt;/&gt;
            </text>
          </g>
        </svg>

        {/* ── Label ── */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#1e3a5f",
              letterSpacing: -0.5,
            }}
          >
            Pipeline Running
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              fontFamily: "monospace",
              color: "#64748b",
              minHeight: 20,
            }}
          >
            {STEPS[step]}
            <span style={{ opacity: 0.4 }}>...</span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div
          style={{
            width: "100%",
            height: 8,
            background: "#e0eaf8",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
              borderRadius: 99,
              transition: "width 1s cubic-bezier(.4,0,.2,1)",
              boxShadow: "0 0 10px #3b82f666",
            }}
          />
        </div>

        {/* ── Step dots ── */}
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i <= step ? "#3b82f6" : "#e0eaf8",
                transition: "width .3s,background .3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}