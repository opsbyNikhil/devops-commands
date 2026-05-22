import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./Themecontext";
import Header, { TabKey } from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body";
import HomePage from "./components/Homepage";
import DevOpsLoader from "./DevOpsLoader";

// Inner component so it can access useTheme() inside ThemeProvider
const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  const handleTabClick = (tab: TabKey) => setActiveTab(tab);
  const handleHomeClick = () => setActiveTab(null);

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
      />

      {activeTab === null ? (
        <HomePage onNavigate={handleTabClick} />
      ) : (
        <>
          <Body activeTab={activeTab} />
          <Footer activeTab={activeTab} />
        </>
      )}
    </div>
  );
};

// Loader gates the entire app — ThemeProvider mounts only after loading
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
