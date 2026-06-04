// import React, { useState } from "react";
// import { ThemeProvider, useTheme } from "./Themecontext";
// import Header, { TabKey, K8sSection } from "./components/Header";
// import Footer from "./components/Footer";
// import Body from "./components/Body";
// import HomePage from "./components/Homepage";
// import DevOpsLoader from "./DevOpsLoader";
// import FullViewK8s from "./pages/kubernates/full-view-k8s";

// const AppContent: React.FC = () => {
//   const { isDark } = useTheme();
//   const [activeTab, setActiveTab] = useState<TabKey | null>(null);
//   const [activeK8sSection, setActiveK8sSection] = useState<K8sSection | null>(
//     null,
//   ); // ← add this

//   const handleTabClick = (tab: TabKey) => {
//     setActiveTab(tab);
//     if (tab !== "kubernetes") setActiveK8sSection(null);
//   };

//   const handleHomeClick = () => {
//     setActiveTab(null);
//     setActiveK8sSection(null);
//   };

//   // ── decide what to render ──
//   const renderContent = () => {
//     if (activeTab === null) {
//       return <HomePage onNavigate={handleTabClick} />;
//     }

//     if (activeTab === "kubernetes" && activeK8sSection === "k8s-docs") {
//       return <FullViewK8s />;
//     }

//     return (
//       <>
//         <Body activeTab={activeTab} />
//         <Footer activeTab={activeTab} />
//       </>
//     );
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: isDark ? "#04080e" : "#e8f2f8",
//         display: "flex",
//         flexDirection: "column",
//         transition: "background 0.3s ease",
//       }}
//     >
//       <Header
//         activeTab={activeTab}
//         setActiveTab={handleTabClick}
//         onHomeClick={handleHomeClick}
//         activeK8sSection={activeK8sSection}
//         setActiveK8sSection={setActiveK8sSection}
//       />

//       {renderContent()}
//     </div>
//   );
// };

// function App() {
//   const [loading, setLoading] = useState(true);

//   if (loading) {
//     return <DevOpsLoader onComplete={() => setLoading(false)} />;
//   }

//   return (
//     <ThemeProvider>
//       <AppContent />
//     </ThemeProvider>
//   );
// }

// export default App;

import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./Themecontext";
import Header, {
  TabKey,
  K8sSection,
  SIDEBAR_EXPANDED_W,
  SIDEBAR_COLLAPSED_W,
} from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import HomePage from "./components/Homepage";
import DevOpsLoader from "./DevOpsLoader";
// ⚠️ If FullViewK8s uses `export default`, keep this line:
import FullViewK8s from "./pages/kubernates/full-view-k8s";
// ⚠️ If FullViewK8s uses `export const FullViewK8s` (named), use this instead:
// import { FullViewK8s } from "./pages/kubernates/full-view-k8s";

const MOBILE_BREAKPOINT = 768;

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [activeK8sSection, setActiveK8sSection] = useState<K8sSection | null>(
    null,
  );
  // Track sidebar state so we can offset the content correctly
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

  // Content left offset: 0 on mobile (sidebar becomes a drawer), sidebar width on desktop
  const contentMarginLeft = isMobile
    ? 0
    : sidebarExpanded
      ? SIDEBAR_EXPANDED_W
      : SIDEBAR_COLLAPSED_W;

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab !== "kubernetes") setActiveK8sSection(null);
  };

  const handleHomeClick = () => {
    setActiveTab(null);
    setActiveK8sSection(null);
  };

  const renderContent = () => {
    if (activeTab === null) {
      return <HomePage onNavigate={handleTabClick} />;
    }

    if (activeTab === "kubernetes" && activeK8sSection === "k8s-docs") {
      return <FullViewK8s />;
    }

    return (
      <>
        <Body activeTab={activeTab} />
        <Footer activeTab={activeTab} />
      </>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#04080e" : "#e8f2f8",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s ease",
      }}
    >
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabClick}
        onHomeClick={handleHomeClick}
        activeK8sSection={activeK8sSection}
        setActiveK8sSection={setActiveK8sSection}
        onSidebarToggle={setSidebarExpanded}
      />

      {/* ── Main content — pushed right by the sidebar width ── */}
      <div
        style={{
          marginLeft: isMobile ? 0 : `${contentMarginLeft}px`,
          transition: "margin-left 0.3s cubic-bezier(0.16,1,0.3,1)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          // On mobile add top padding for the fixed 56px top bar
          paddingTop: isMobile ? "56px" : 0,
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <DevOpsLoader onComplete={() => setLoading(false)} />;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;