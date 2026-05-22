import React from "react";

export const Ansible: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        gap: 16,
        color: "#1e3a4a",
        fontFamily: "'Space Mono', monospace",
        fontSize: 13,
      }}
    >
      <span style={{ fontSize: 40 }}>🚧</span>
      <span style={{ letterSpacing: 2 }}>Ansible commands coming soon.</span>
    </div>
  );
};

export default Ansible;
