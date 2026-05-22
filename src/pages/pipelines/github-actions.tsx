import React, { useState } from "react";
import { useTheme } from "../../Themecontext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Step {
  id: string;
  title: string;
  node: "portal" | "cli" | "vm" | "browser";
  commands?: string[];
  notes?: string[];
  code?: string;
  codeLabel?: string;
}

interface Topic {
  id: string;
  title: string;
  titleAccents: React.ReactNode;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  steps: Step[];
  checklist: string[];
}

// ── Node badge config ─────────────────────────────────────────────────────────
const NODE_CONFIG = {
  portal: {
    label: "GitHub Web",
    color: "#24292f",
    bg: "rgba(36,41,47,0.08)",
    icon: "🐙",
  },
  cli: {
    label: "Local CLI",
    color: "#00b4d8",
    bg: "#00b4d818",
    icon: "💻",
  },
  vm: {
    label: "EC2 Runner",
    color: "#2da44e",
    bg: "#2da44e18",
    icon: "🖥️",
  },
  browser: {
    label: "Browser",
    color: "#f0927f",
    bg: "#f0927f18",
    icon: "🌐",
  },
};

// ── Sample GitHub Actions YAML snippets ───────────────────────────────────────
const CODE_GH_MAVEN_YAML = `name: GitHub Actions

on: 
  push: 
    branches: 
      - main

jobs: 
  build:
      name: my-spc
      runs-on: self-hosted
      steps:
        - name: git checkout
          uses: actions/checkout@v4
          
        - name: Build java with maven
          run: mvn package`;

const CODE_GH_SONAR_YAML = `name: SonarCloud Analysis

on: 
  push: 
    branches: 
      - main

jobs: 
  build:
    name: Build and Analyze
    runs-on: self-hosted
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for SonarCloud to analyze git history!

      - name: Build Java with Maven
        run: mvn clean package

      - name: Run SonarCloud Scan
        run: | 
          mvn sonar:sonar \\
            -Dsonar.projectKey=<your-project-key> \\
            -Dsonar.organization=<your-organization> \\
            -Dsonar.host.url=https://sonarcloud.io \\
            -Dsonar.token=\${{ secrets.SONAR_TOKEN }}`;

// ── GitHub topic definitions ──────────────────────────────────────────────────
export const GITHUB_TOPICS: Topic[] = [
  {
    id: "GH1",
    title: "GitHub Actions — Self-Hosted Runner Setup",
    titleAccents: (
      <>
        GitHub <span style={{ color: "#2da44e" }}>Actions</span>{" "}
        <span
          style={{
            color: "rgba(45,164,78,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          Self-Hosted Runner
        </span>
      </>
    ),
    subtitle: "EC2 INSTANCE · JAVA/MAVEN · RUNNER CONFIG · YAML PIPELINE",
    accentColor: "#2da44e",
    accentBg: "rgba(45,164,78,0.1)",
    steps: [
      {
        id: "01",
        title: "Provision & Connect to EC2",
        node: "vm",
        notes: [
          "Create a new EC2 instance in your AWS Console (Ubuntu AMI).",
          "Ensure your security group allows inbound SSH traffic.",
        ],
        commands: ["ssh ubuntu@<public-ip>"],
      },
      {
        id: "02",
        title: "Install Java 17 & Maven",
        node: "vm",
        commands: [
          "sudo apt update",
          "sudo apt install openjdk-17-jdk -y",
          "sudo apt install maven -y",
        ],
      },
      {
        id: "03",
        title: "Download Runner Setup",
        node: "portal",
        notes: [
          "Go to your GitHub Repository => Settings => Actions => Runners.",
          "Click 'New self-hosted runner', select 'Linux' as the OS.",
          "Copy the provided download commands (curl and tar) and run them on your EC2 instance.",
        ],
      },
      {
        id: "04",
        title: "Configure and Start Runner",
        node: "vm",
        notes: [
          "Run the configuration script and follow the prompts. You can leave most settings as default by pressing Enter.",
          "Once started, verify the runner appears as 'Idle' (with a green dot) in your GitHub Settings.",
        ],
        commands: [
          "./config.sh --url https://github.com/<your-org>/<your-repo> --token <YOUR_TOKEN>",
          "./run.sh",
        ],
      },
      {
        id: "05",
        title: "Create Workflow Directory",
        node: "cli",
        notes: [
          "Clone your repository to your local machine (if not already done).",
          "GitHub Actions requires the YAML file to be in a very specific hidden folder structure.",
        ],
        commands: [
          "mkdir -p .github/workflows",
          "touch .github/workflows/github-actions.yaml",
        ],
      },
      {
        id: "06",
        title: "Write & Push Pipeline",
        node: "cli",
        code: CODE_GH_MAVEN_YAML,
        codeLabel: "GITHUB ACTIONS · YAML",
        notes: [
          "Paste this configuration into your github-actions.yaml file.",
          "Notice 'runs-on: self-hosted' — this forces the job to use your EC2 instance instead of GitHub's cloud servers.",
          "Commit and push to the 'main' branch to trigger the action automatically.",
        ],
      },
    ],
    checklist: [
      "EC2 instance is running and accessible via SSH",
      "Java 17 and Maven are successfully installed",
      "Runner is configured and showing as 'Idle' in GitHub Repo Settings",
      "Workflow YAML file is placed strictly inside the '.github/workflows/' directory",
      "'runs-on: self-hosted' is properly set in the YAML job definition",
    ],
  },
  {
    id: "GH2",
    title: "GitHub Actions — SonarCloud Integration",
    titleAccents: (
      <>
        GitHub <span style={{ color: "#f3702a" }}>Actions</span>{" "}
        <span
          style={{
            color: "rgba(243,112,42,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          + SonarCloud
        </span>
      </>
    ),
    subtitle: "GITHUB APP · SONAR TOKEN · REPO SECRETS · MAVEN SCAN",
    accentColor: "#f3702a",
    accentBg: "rgba(243,112,42,0.1)",
    steps: [
      {
        id: "01",
        title: "Verify Self-Hosted Runner",
        node: "vm",
        notes: [
          "Ensure you have already provisioned an EC2 instance and installed Java/Maven.",
          "Check your repository settings (Actions => Runners) to verify your runner is 'Idle' and ready to pick up jobs.",
        ],
      },
      {
        id: "02",
        title: "Install SonarCloud GitHub App",
        node: "portal",
        notes: [
          "Go to your GitHub Repository Settings => GitHub Apps.",
          "Search for 'SonarQubeCloud' (formerly SonarCloud) and install it for your repository.",
          "You will be redirected to the SonarCloud dashboard to authorize and select your repo.",
        ],
      },
      {
        id: "03",
        title: "Generate Sonar Token",
        node: "browser",
        notes: [
          "In the SonarCloud dashboard, navigate to your Account Settings => Security.",
          "Generate a new token for this project and copy it to your clipboard.",
        ],
      },
      {
        id: "04",
        title: "Add GitHub Secret",
        node: "portal",
        notes: [
          "Go back to your GitHub Repository Settings => Secrets and variables => Actions.",
          "Click 'New repository secret'.",
          "Name the secret 'SONAR_TOKEN' and paste the value you copied from SonarCloud.",
        ],
      },
      {
        id: "05",
        title: "Create Workflow Pipeline",
        node: "cli",
        code: CODE_GH_SONAR_YAML,
        codeLabel: "GITHUB ACTIONS · SONAR YAML",
        notes: [
          "Create or update your .github/workflows/github-actions.yaml file with this configuration.",
          "Replace the <your-project-key> and <your-organization> placeholders with the actual names from your SonarCloud project.",
          "Commit and push to trigger the pipeline on your EC2 runner!",
        ],
      },
    ],
    checklist: [
      "EC2 self-hosted runner is active and 'Idle'",
      "SonarQubeCloud app has explicit access to the target repository",
      "Repository secret is named EXACTLY 'SONAR_TOKEN' to match the YAML",
      "fetch-depth: 0 is included in the checkout step to prevent blame/coverage errors",
    ],
  },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────
const makeTokens = (isDark: boolean) => ({
  pageBg: isDark ? "#080c10" : "#f4f6f8",
  gridLine: isDark ? "rgba(45,164,78,0.03)" : "rgba(45,164,78,0.06)",
  cardBg: isDark ? "rgba(255,255,255,0.015)" : "#ffffff",
  cardBorder: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
  cardHeaderBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
  cardDivider: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
  termBg: "#070b10",
  termDivider: "rgba(255,255,255,0.05)",
  termHeader: "rgba(255,255,255,0.02)",
  textPrimary: isDark ? "rgba(255,255,255,0.88)" : "#1a1a1a",
  textMuted: isDark ? "rgba(255,255,255,0.55)" : "#444444",
  textDim: isDark ? "rgba(255,255,255,0.25)" : "#999999",
  textComment: "rgba(255,255,255,0.25)",
  textMono: "rgba(255,255,255,0.82)",
  headingColor: isDark ? "#ffffff" : "#1a1a1a",
  subtitleColor: isDark ? "rgba(255,255,255,0.3)" : "#888888",
  numBg: isDark ? "rgba(45,164,78,0.15)" : "rgba(45,164,78,0.1)",
  numBorder: isDark ? "#2da44e40" : "rgba(45,164,78,0.3)",
  copyBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
  copyColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
  checklistBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
  checklistBdr: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
  stripBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
  stripBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  colBgOn: isDark ? "rgba(45,164,78,0.08)" : "rgba(45,164,78,0.07)",
  colBdrOn: isDark ? "rgba(45,164,78,0.3)" : "rgba(45,164,78,0.35)",
  colBgOff: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
  colBdrOff: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  colTxtOff: isDark ? "rgba(255,255,255,0.4)" : "#666666",
});

type Tokens = ReturnType<typeof makeTokens>;

// ── CopyButton ────────────────────────────────────────────────────────────────
const CopyButton: React.FC<{ text: string; accent: string; t: Tokens }> = ({
  text,
  accent,
  t,
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
        background: copied ? `${accent}22` : "transparent",
        border: `1px solid ${copied ? accent : t.copyBorder}`,
        borderRadius: 5,
        color: copied ? accent : t.copyColor,
        cursor: "pointer",
        padding: "3px 10px",
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: 0.5,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
};

// ── StepCard ──────────────────────────────────────────────────────────────────
const StepCard: React.FC<{
  step: Step;
  forceOpen: boolean;
  accent: string;
  t: Tokens;
}> = ({ step, forceOpen, accent, t }) => {
  const [open, setOpen] = useState(true);
  const nodeCfg = NODE_CONFIG[step.node];

  React.useEffect(() => {
    setOpen(forceOpen);
  }, [forceOpen]);

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "background 0.3s",
      }}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          cursor: "pointer",
          background: open ? t.cardHeaderBg : "transparent",
          borderBottom: open ? `1px solid ${t.cardDivider}` : "none",
          userSelect: "none",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            flexShrink: 0,
            background: t.numBg,
            border: `1px solid ${t.numBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: accent,
          }}
        >
          {step.id}
        </div>

        <span
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: t.textPrimary,
            letterSpacing: 0.4,
            flex: 1,
          }}
        >
          {step.title}
        </span>

        <span
          style={{
            padding: "2px 9px",
            borderRadius: 20,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 0.4,
            background: nodeCfg.bg,
            color: nodeCfg.color,
            border: `1px solid ${nodeCfg.color}40`,
            flexShrink: 0,
          }}
        >
          {nodeCfg.icon} {nodeCfg.label}
        </span>

        <span style={{ color: t.textDim, fontSize: 10, marginLeft: 4 }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {step.commands && (
            <div
              style={{
                background: t.termBg,
                border: `1px solid ${accent}35`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 14px",
                  borderBottom: `1px solid ${t.termDivider}`,
                  background: t.termHeader,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: accent,
                    letterSpacing: 2,
                  }}
                >
                  TERMINAL
                </span>
                <CopyButton
                  text={step.commands
                    .filter((c) => !c.startsWith("#"))
                    .join("\n")}
                  accent={accent}
                  t={t}
                />
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {step.commands.map((cmd, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    {cmd.startsWith("#") ? (
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: t.textComment,
                          fontStyle: "italic",
                          wordBreak: "break-all",
                        }}
                      >
                        {cmd}
                      </span>
                    ) : (
                      <>
                        <span
                          style={{
                            color: accent,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          $
                        </span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: t.textMono,
                            wordBreak: "break-all",
                          }}
                        >
                          {cmd}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.code && (
            <div
              style={{
                background: t.termBg,
                border: `1px solid ${accent}35`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 14px",
                  borderBottom: `1px solid ${t.termDivider}`,
                  background: t.termHeader,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: accent,
                    letterSpacing: 2,
                  }}
                >
                  {step.codeLabel || "SCRIPT"}
                </span>
                <CopyButton text={step.code} accent={accent} t={t} />
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "14px 16px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.7,
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                {step.code.split("\n").map((line, i) => {
                  const tr = line.trim();
                  const isCmd =
                    tr.startsWith("name:") ||
                    tr.startsWith("on:") ||
                    tr.startsWith("jobs:") ||
                    tr.startsWith("steps:");
                  const isComment = tr.startsWith("#");
                  const isStr =
                    !isCmd &&
                    !isComment &&
                    (line.includes("'") || line.includes('"'));
                  return (
                    <span key={i}>
                      {isComment ? (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontStyle: "italic",
                          }}
                        >
                          {line}
                        </span>
                      ) : isCmd ? (
                        <span style={{ color: accent }}>{line}</span>
                      ) : isStr ? (
                        <span style={{ color: "#6fdd8b" }}>{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                      {"\n"}
                    </span>
                  );
                })}
              </pre>
            </div>
          )}

          {step.notes && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {step.notes.map((note, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      color: accent,
                      fontSize: 10,
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    ▸
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: t.textMuted,
                      lineHeight: 1.6,
                    }}
                  >
                    {note}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── TopicCard ─────────────────────────────────────────────────────────────────
const TopicCard: React.FC<{ topic: Topic; t: Tokens }> = ({ topic, t }) => {
  const [open, setOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(true);

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${open ? `${topic.accentColor}40` : t.cardBorder}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.3s, background 0.3s",
      }}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 22px",
          cursor: "pointer",
          background: open ? `${topic.accentColor}0e` : "transparent",
          borderBottom: open ? `1px solid ${t.cardDivider}` : "none",
          transition: "background 0.2s",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            flexShrink: 0,
            background: topic.accentColor,
            boxShadow: open ? `0 0 8px ${topic.accentColor}80` : "none",
            transition: "box-shadow 0.3s",
          }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: 17,
              color: t.headingColor,
              letterSpacing: 0.5,
              lineHeight: 1.2,
            }}
          >
            {topic.titleAccents}
          </div>
          <div
            style={{
              fontSize: 9,
              color: t.subtitleColor,
              letterSpacing: 1.1,
              marginTop: 3,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {topic.subtitle}
          </div>
        </div>

        <span
          style={{
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            background: topic.accentBg,
            color: topic.accentColor,
            border: `1px solid ${topic.accentColor}40`,
            flexShrink: 0,
          }}
        >
          {topic.steps.length} steps
        </span>

        <div
          style={{
            padding: "5px 16px",
            borderRadius: 20,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: 0.8,
            flexShrink: 0,
            transition: "all 0.2s",
            background: open ? topic.accentBg : "transparent",
            color: open ? topic.accentColor : t.textDim,
            border: `1px solid ${open ? `${topic.accentColor}50` : t.cardBorder}`,
          }}
        >
          {open ? "▲ Hide" : "▼ Show me"}
        </div>
      </div>

      {open && (
        <div
          style={{
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                background: t.stripBg,
                border: `1px solid ${t.stripBorder}`,
                borderRadius: 8,
                padding: "8px 14px",
                overflowX: "auto",
                gap: 0,
                minWidth: 0,
              }}
            >
              {topic.steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <span
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 11,
                      color:
                        i === topic.steps.length - 1
                          ? topic.accentColor
                          : t.subtitleColor,
                      whiteSpace: "nowrap",
                      fontWeight: 700,
                      letterSpacing: 0.4,
                    }}
                  >
                    {s.title}
                  </span>
                  {i < topic.steps.length - 1 && (
                    <span
                      style={{
                        color: topic.accentColor,
                        fontSize: 11,
                        margin: "0 6px",
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setAllOpen((v) => !v);
              }}
              style={{
                background: allOpen ? t.colBgOn : t.colBgOff,
                border: `1px solid ${allOpen ? t.colBdrOn : t.colBdrOff}`,
                borderRadius: 20,
                // color: allOpen ? t.accentColor : t.colTxtOff,
                // ✅ TO THIS:
                color: allOpen ? topic.accentColor : t.colTxtOff,
                cursor: "pointer",
                padding: "5px 14px",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {allOpen ? "▲ Collapse All" : "▼ Expand All"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topic.steps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                forceOpen={allOpen}
                accent={topic.accentColor}
                t={t}
              />
            ))}
          </div>

          <div
            style={{
              marginTop: 6,
              padding: "14px 18px",
              background: t.checklistBg,
              border: `1px solid ${t.checklistBdr}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                color: topic.accentColor,
                fontSize: 9,
                letterSpacing: 2,
                marginBottom: 8,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ⚠ CHECKLIST BEFORE RUNNING
            </div>
            {topic.checklist.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: topic.accentColor, flexShrink: 0 }}>
                  ▸
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.55,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const GitHubActionsTopics: React.FC = () => {
  const { isDark } = useTheme();
  const t = makeTokens(isDark);

  return (
    <div
      style={{
        background: t.pageBg,
        minHeight: "100vh",
        padding: "32px 20px 60px",
        fontFamily: "'JetBrains Mono', monospace",
        boxSizing: "border-box",
        transition: "background 0.3s",
        backgroundImage: `
          linear-gradient(${t.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');`}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(45,164,78,0.15)",
                border: "1px solid #2da44e40",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🐙
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: t.headingColor,
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                GitHub <span style={{ color: "#2da44e" }}>Actions</span> CI/CD
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  color: t.subtitleColor,
                  letterSpacing: 1,
                  marginTop: 3,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                1 TOPIC · CLICK ANY CARD BELOW TO EXPAND ALL STEPS
              </p>
            </div>
          </div>
        </div>

        {/* Topic cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {GITHUB_TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubActionsTopics;
