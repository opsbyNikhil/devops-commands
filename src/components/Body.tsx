// import React from "react";
// import { TabKey, TABS } from "./Header";
// import { useTheme } from "../Themecontext";
// import Docker from "../pages/Docker";
// import Terraform from "../pages/Terraform";
// import Kubernetes from "../pages/Kubernetes";
// import Ansible from "../pages/Ansible";
// import Linux from "../pages/Linux";
// import Git from "../pages/Git";
// import Jenkins from "../pages/pipelines/jenkins";
// import Azure from "../pages/pipelines/azure";

// // ── Placeholder for tabs not yet built ───────────────────────────────────────
// const ComingSoon: React.FC<{ label: string; emoji: string; color: string }> = ({
//   label,
//   emoji,
//   color,
// }) => (
//   <div
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: 260,
//       gap: 14,
//     }}
//   >
//     <span style={{ fontSize: 44 }}>{emoji}</span>
//     <span
//       style={{
//         fontFamily: "'Space Mono', monospace",
//         fontSize: 12,
//         color,
//         letterSpacing: 3,
//         textTransform: "uppercase",
//       }}
//     >
//       {label} — Coming Soon
//     </span>
//   </div>
// );

// interface BodyProps {
//   activeTab: TabKey;
// }

// const Body: React.FC<BodyProps> = ({ activeTab }) => {
//   const { isDark } = useTheme();
//   const active = TABS.find((t) => t.key === activeTab)!;

//   // ── Theme tokens ──────────────────────────────────────────────────────────
//   const t = {
//     gridLine: isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.06)",
//     breadcrumbBase: isDark ? "#1e3040" : "#7a96a8",
//     breadcrumbSep: isDark ? "#0c1e2c" : "#b0c8d8",
//     heroTitle: isDark ? "#ffffff" : "#0a1e2c",
//     heroDesc: isDark ? "#2a4050" : "#4a6a80",
//     countLabel: isDark ? "#1e3040" : "#7a96a8",
//   };

//   // ── Route to page component ───────────────────────────────────────────────
//   const renderPage = () => {
//     switch (activeTab) {
//       case "docker":
//         return <Docker />;
//       case "terraform":
//         return <Terraform />;
//       case "kubernetes":
//         return <Kubernetes />;
//       case "ansible":
//         return <Ansible />;
//       case "jenkins":
//         return <Jenkins />;
//       case "linux":
//         return <Linux />;
//       case "github":
//         return <Git />;
//       case "azure-devops":
//         return <Azure />
//       case "github-actions":
//         return (
//           <ComingSoon label="GitHub Actions" emoji="⚡" color={active.color} />
//         );
//       default:
//         return null;
//     }
//   };

//   // ── Jenkins gets full-width layout (no hero header) ───────────────────────
//   // const isFullWidth = activeTab === "jenkins";
//   const isFullWidth = activeTab === "jenkins" || activeTab === "azure-devops";
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');

//         .body-root {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           position: relative;
//           overflow: hidden;
//           transition: background 0.3s ease;
//         }

//         .body-bg-grid {
//           position: fixed;
//           inset: 0;
//           pointer-events: none;
//           z-index: 0;
//           transition: background-image 0.3s ease;
//         }

//         .body-glow {
//           position: fixed;
//           top: -120px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 700px;
//           height: 400px;
//           border-radius: 50%;
//           pointer-events: none;
//           z-index: 0;
//           transition: background 0.5s ease;
//         }

//         .body-content {
//           position: relative;
//           z-index: 1;
//           max-width: 960px;
//           width: 100%;
//           margin: 0 auto;
//           padding: 32px 28px 48px;
//           flex: 1;
//         }

//         /* Full-width variant — used for Jenkins and future pipeline pages */
//         .body-content-full {
//           position: relative;
//           z-index: 1;
//           width: 100%;
//           flex: 1;
//           padding: 0;
//         }

//         .body-hero {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//           margin-bottom: 32px;
//           padding-bottom: 28px;
//           border-bottom: 1px solid;
//           position: relative;
//           transition: border-color 0.4s ease;
//         }

//         .body-hero-icon {
//           width: 58px;
//           height: 58px;
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 26px;
//           flex-shrink: 0;
//           position: relative;
//           transition: all 0.3s ease;
//         }

//         .body-hero-icon::after {
//           content: '';
//           position: absolute;
//           inset: -4px;
//           border-radius: 20px;
//           border: 1px solid transparent;
//           animation: ping 2.5s ease-in-out infinite;
//           transition: border-color 0.4s ease;
//         }

//         @keyframes ping {
//           0%, 100% { opacity: 0; transform: scale(1); }
//           50%       { opacity: 1; transform: scale(1.08); }
//         }

//         .body-hero-text { flex: 1; }

//         .body-hero-title {
//           font-family: 'Syne', sans-serif;
//           font-size: 28px;
//           font-weight: 800;
//           letter-spacing: 2px;
//           line-height: 1;
//           margin-bottom: 8px;
//           display: flex;
//           align-items: baseline;
//           gap: 10px;
//           flex-wrap: wrap;
//           transition: color 0.3s ease;
//         }

//         .body-hero-slash {
//           font-size: 16px;
//           font-weight: 400;
//           letter-spacing: 1px;
//           opacity: 0.5;
//           transition: color 0.4s ease;
//         }

//         .body-hero-desc {
//           font-family: 'Space Mono', monospace;
//           font-size: 11px;
//           line-height: 1.7;
//           letter-spacing: 0.4px;
//           transition: color 0.3s ease;
//         }

//         .body-hero-right {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-end;
//           gap: 6px;
//           flex-shrink: 0;
//         }

//         .body-hero-count {
//           font-family: 'Syne', sans-serif;
//           font-size: 42px;
//           font-weight: 800;
//           line-height: 1;
//           transition: color 0.4s ease;
//         }

//         .body-hero-count-label {
//           font-family: 'Space Mono', monospace;
//           font-size: 9px;
//           letter-spacing: 3px;
//           text-transform: uppercase;
//           transition: color 0.3s ease;
//         }

//         .body-hero-badge {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           padding: 4px 12px;
//           border-radius: 20px;
//           font-family: 'Space Mono', monospace;
//           font-size: 9px;
//           font-weight: 700;
//           letter-spacing: 1.5px;
//           border: 1px solid transparent;
//           transition: all 0.4s ease;
//         }

//         .body-breadcrumb {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-family: 'Space Mono', monospace;
//           font-size: 10px;
//           letter-spacing: 1px;
//           margin-bottom: 20px;
//           transition: color 0.3s ease;
//         }

//         .body-breadcrumb-active { transition: color 0.4s ease; }

//         .body-page { animation: pageIn 0.3s ease forwards; }

//         @keyframes pageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>

//       <main className="body-root">
//         {/* Background grid */}
//         <div
//           className="body-bg-grid"
//           style={{
//             backgroundImage: `
//               linear-gradient(${t.gridLine} 1px, transparent 1px),
//               linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)
//             `,
//             backgroundSize: "48px 48px",
//           }}
//         />

//         {/* Radial glow */}
//         <div
//           className="body-glow"
//           style={{
//             background: `radial-gradient(ellipse, ${active.color}${isDark ? "22" : "18"} 0%, transparent 70%)`,
//           }}
//         />

//         {/* Depth orbs */}
//         <div
//           style={{
//             position: "fixed",
//             bottom: "10%",
//             right: "5%",
//             width: 400,
//             height: 400,
//             borderRadius: "50%",
//             background: `radial-gradient(circle, ${active.color}${isDark ? "08" : "06"} 0%, transparent 70%)`,
//             pointerEvents: "none",
//             zIndex: 0,
//           }}
//         />
//         <div
//           style={{
//             position: "fixed",
//             top: "40%",
//             left: "-5%",
//             width: 300,
//             height: 300,
//             borderRadius: "50%",
//             background: `radial-gradient(circle, ${active.color}${isDark ? "06" : "05"} 0%, transparent 70%)`,
//             pointerEvents: "none",
//             zIndex: 0,
//           }}
//         />

//         {/* ── Full-width pages (Jenkins, future pipeline pages) ── */}
//         {isFullWidth ? (
//           <div className="body-content-full">
//             <div className="body-page" key={activeTab}>
//               {renderPage()}
//             </div>
//           </div>
//         ) : (
//           /* ── Standard pages with hero header ── */
//           <div className="body-content">
//             {/* Breadcrumb */}
//             <div
//               className="body-breadcrumb"
//               style={{ color: t.breadcrumbBase }}
//             >
//               <span>devops-cmd</span>
//               <span style={{ color: t.breadcrumbSep }}>/</span>
//               <span>commands</span>
//               <span style={{ color: t.breadcrumbSep }}>/</span>
//               <span
//                 className="body-breadcrumb-active"
//                 style={{ color: active.color }}
//               >
//                 {active.label.toLowerCase()}
//               </span>
//             </div>

//             {/* Hero Section */}
//             <div
//               className="body-hero"
//               style={{ borderBottomColor: active.color + "22" }}
//             >
//               {/* Icon */}
//               <div
//                 className="body-hero-icon"
//                 style={{
//                   background: `linear-gradient(135deg, ${active.color}28, ${active.color}0a)`,
//                   border: `1px solid ${active.color}44`,
//                   boxShadow: `0 0 24px ${active.color}${isDark ? "30" : "20"}`,
//                 }}
//               >
//                 {active.emoji}
//                 <style>{`.body-hero-icon::after { border-color: ${active.color}44; }`}</style>
//               </div>

//               {/* Title + desc */}
//               <div className="body-hero-text">
//                 <div className="body-hero-title" style={{ color: t.heroTitle }}>
//                   {active.label.toUpperCase()}
//                   <span
//                     className="body-hero-slash"
//                     style={{ color: active.color }}
//                   >
//                     / commands
//                   </span>
//                 </div>
//                 <div className="body-hero-desc" style={{ color: t.heroDesc }}>
//                   {active.description}
//                 </div>
//               </div>

//               {/* Count + badge */}
//               <div className="body-hero-right">
//                 {active.commandCount > 0 ? (
//                   <>
//                     <div
//                       className="body-hero-count"
//                       style={{ color: active.color }}
//                     >
//                       {active.commandCount}
//                     </div>
//                     <div
//                       className="body-hero-count-label"
//                       style={{ color: t.countLabel }}
//                     >
//                       commands
//                     </div>
//                   </>
//                 ) : (
//                   <div
//                     className="body-hero-badge"
//                     style={{
//                       background: active.color + "12",
//                       borderColor: active.color + "33",
//                       color: active.accent,
//                     }}
//                   >
//                     <span>⏳</span> COMING SOON
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Page Content */}
//             <div className="body-page" key={activeTab}>
//               {renderPage()}
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// };

// export default Body;
import React from "react";
import { TabKey, TABS } from "./Header";
import { useTheme } from "../Themecontext";
import Docker from "../pages/Docker";
import Terraform from "../pages/Terraform";
import Kubernetes from "../pages/Kubernetes";
import Ansible from "../pages/Ansible";
import Linux from "../pages/Linux";
import Git from "../pages/Git";
import Jenkins from "../pages/pipelines/jenkins";
import Azure from "../pages/pipelines/azure";
import GitHub from "../pages/pipelines/github-actions";

// ── Placeholder for tabs not yet built ───────────────────────────────────────
const ComingSoon: React.FC<{ label: string; emoji: string; color: string }> = ({
  label,
  emoji,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 260,
      gap: 14,
    }}
  >
    <span style={{ fontSize: 44 }}>{emoji}</span>
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12,
        color,
        letterSpacing: 3,
        textTransform: "uppercase",
      }}
    >
      {label} — Coming Soon
    </span>
  </div>
);

interface BodyProps {
  activeTab: TabKey;
}

const Body: React.FC<BodyProps> = ({ activeTab }) => {
  const { isDark } = useTheme();
  const active = TABS.find((t) => t.key === activeTab)!;

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const t = {
    gridLine: isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.06)",
    breadcrumbBase: isDark ? "#1e3040" : "#7a96a8",
    breadcrumbSep: isDark ? "#0c1e2c" : "#b0c8d8",
    heroTitle: isDark ? "#ffffff" : "#0a1e2c",
    heroDesc: isDark ? "#2a4050" : "#4a6a80",
    countLabel: isDark ? "#1e3040" : "#7a96a8",
  };

  // ── Route to page component ───────────────────────────────────────────────
  const renderPage = () => {
    switch (activeTab) {
      case "docker":
        return <Docker />;
      case "terraform":
        return <Terraform />;
      case "kubernetes":
        return <Kubernetes />;
      case "ansible":
        return <Ansible />;
      case "jenkins":
        return <Jenkins />;
      case "linux":
        return <Linux />;
      case "github":
        return <Git />;
      case "azure-devops":
        return <Azure />;
      case "github-actions":
        return <GitHub />
        return (
          <ComingSoon label="GitHub Actions" emoji="⚡" color={active.color} />
        );
      default:
        return null;
    }
  };

  // ── Jenkins gets full-width layout (no hero header) ───────────────────────
  const isFullWidth = activeTab === "jenkins" || activeTab === "azure-devops";
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');

        .body-root {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
          padding-top: 120px; /* <--- FIX: Pushes everything down below the floating navbar */
        }

        @media (max-width: 768px) {
          .body-root {
            padding-top: 90px; /* <--- FIX: Mobile spacing */
          }
        }

        .body-bg-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          transition: background-image 0.3s ease;
        }

        .body-glow {
          position: fixed;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 400px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          transition: background 0.5s ease;
        }

        .body-content {
          position: relative;
          z-index: 1;
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 28px 48px;
          flex: 1;
        }

        /* Full-width variant — used for Jenkins and future pipeline pages */
        .body-content-full {
          position: relative;
          z-index: 1;
          width: 100%;
          flex: 1;
          padding: 0;
        }

        .body-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 28px;
          border-bottom: 1px solid;
          position: relative;
          transition: border-color 0.4s ease;
        }

        .body-hero-icon {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
          position: relative;
          transition: all 0.3s ease;
        }

        .body-hero-icon::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 20px;
          border: 1px solid transparent;
          animation: ping 2.5s ease-in-out infinite;
          transition: border-color 0.4s ease;
        }

        @keyframes ping {
          0%, 100% { opacity: 0; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.08); }
        }

        .body-hero-text { flex: 1; }

        .body-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 2px;
          line-height: 1;
          margin-bottom: 8px;
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
          transition: color 0.3s ease;
        }

        .body-hero-slash {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 1px;
          opacity: 0.5;
          transition: color 0.4s ease;
        }

        .body-hero-desc {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.7;
          letter-spacing: 0.4px;
          transition: color 0.3s ease;
        }

        .body-hero-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }

        .body-hero-count {
          font-family: 'Syne', sans-serif;
          font-size: 42px;
          font-weight: 800;
          line-height: 1;
          transition: color 0.4s ease;
        }

        .body-hero-count-label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .body-hero-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          border: 1px solid transparent;
          transition: all 0.4s ease;
        }

        .body-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          margin-bottom: 20px;
          transition: color 0.3s ease;
        }

        .body-breadcrumb-active { transition: color 0.4s ease; }

        .body-page { animation: pageIn 0.3s ease forwards; }

        @keyframes pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="body-root">
        {/* Background grid */}
        <div
          className="body-bg-grid"
          style={{
            backgroundImage: `
              linear-gradient(${t.gridLine} 1px, transparent 1px),
              linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Radial glow */}
        <div
          className="body-glow"
          style={{
            background: `radial-gradient(ellipse, ${active.color}${isDark ? "22" : "18"} 0%, transparent 70%)`,
          }}
        />

        {/* Depth orbs */}
        <div
          style={{
            position: "fixed",
            bottom: "10%",
            right: "5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${active.color}${isDark ? "08" : "06"} 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "40%",
            left: "-5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${active.color}${isDark ? "06" : "05"} 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Full-width pages (Jenkins, future pipeline pages) ── */}
        {isFullWidth ? (
          <div className="body-content-full">
            <div className="body-page" key={activeTab}>
              {renderPage()}
            </div>
          </div>
        ) : (
          /* ── Standard pages with hero header ── */
          <div className="body-content">
            {/* Breadcrumb */}
            <div
              className="body-breadcrumb"
              style={{ color: t.breadcrumbBase }}
            >
              <span>devops-cmd</span>
              <span style={{ color: t.breadcrumbSep }}>/</span>
              <span>commands</span>
              <span style={{ color: t.breadcrumbSep }}>/</span>
              <span
                className="body-breadcrumb-active"
                style={{ color: active.color }}
              >
                {active.label.toLowerCase()}
              </span>
            </div>

            {/* Hero Section */}
            <div
              className="body-hero"
              style={{ borderBottomColor: active.color + "22" }}
            >
              {/* Icon */}
              <div
                className="body-hero-icon"
                style={{
                  background: `linear-gradient(135deg, ${active.color}28, ${active.color}0a)`,
                  border: `1px solid ${active.color}44`,
                  boxShadow: `0 0 24px ${active.color}${isDark ? "30" : "20"}`,
                }}
              >
                {active.emoji}
                <style>{`.body-hero-icon::after { border-color: ${active.color}44; }`}</style>
              </div>

              {/* Title + desc */}
              <div className="body-hero-text">
                <div className="body-hero-title" style={{ color: t.heroTitle }}>
                  {active.label.toUpperCase()}
                  <span
                    className="body-hero-slash"
                    style={{ color: active.color }}
                  >
                    / commands
                  </span>
                </div>
                <div className="body-hero-desc" style={{ color: t.heroDesc }}>
                  {active.description}
                </div>
              </div>

              {/* Count + badge */}
              <div className="body-hero-right">
                {active.commandCount > 0 ? (
                  <>
                    <div
                      className="body-hero-count"
                      style={{ color: active.color }}
                    >
                      {active.commandCount}
                    </div>
                    <div
                      className="body-hero-count-label"
                      style={{ color: t.countLabel }}
                    >
                      commands
                    </div>
                  </>
                ) : (
                  <div
                    className="body-hero-badge"
                    style={{
                      background: active.color + "12",
                      borderColor: active.color + "33",
                      color: active.accent,
                    }}
                  >
                    <span>⏳</span> COMING SOON
                  </div>
                )}
              </div>
            </div>

            {/* Page Content */}
            <div className="body-page" key={activeTab}>
              {renderPage()}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Body;