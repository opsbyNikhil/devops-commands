import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./Themecontext";
import Header, { TabKey, K8sSection } from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import HomePage from "./components/Homepage";
import DevOpsLoader from "./DevOpsLoader";
import FullViewK8s from "./pages/kubernates/full-view-k8s"; 

const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [activeK8sSection, setActiveK8sSection] = useState<K8sSection | null>(
    null,
  ); // ← add this

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    if (tab !== "kubernetes") setActiveK8sSection(null);
  };

  const handleHomeClick = () => {
    setActiveTab(null);
    setActiveK8sSection(null); 
  };

  // ── decide what to render ──
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
      />

      {renderContent()}
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
