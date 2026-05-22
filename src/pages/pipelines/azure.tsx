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
    label: "Azure Portal",
    color: "#0078d4",
    bg: "#0078d418",
    icon: "☁️",
  },
  cli: {
    label: "Azure CLI",
    color: "#00b4d8",
    bg: "#00b4d818",
    icon: "💻",
  },
  vm: {
    label: "Virtual Machine",
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

const CODE_AZ_MAVEN_YAML = `trigger:
  - main
pool: 'Default'

stages: 
  - stage: 'build_stage'
    jobs:
      - job: 'Build'
        steps:
          - task: Maven@3
            inputs:
              mavenPOMFile: 'pom.xml'
              goals: 'package'
              publishJUnitResults: true
              testResultsFiles: '**/surefire-reports/TEST-*.xml'
          
          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: $(System.DefaultWorkingDirectory)
              artifactName: drop`;
const CODE_AZ_SONAR_YAML = `trigger:
  - main

pool: 'Default'

variables:
  - group: Sonar-cloud-token-variable
  # - name: system.debug
  #   value: true

stages:
  - stage: "build_stage"
    jobs:
      - job: "Build"
        steps:
          - checkout: self
            fetchDepth: 0

          - task: SonarCloudPrepare@4
            displayName: 'Prepare SonarCloud Analysis'
            inputs:
              SonarCloud: "<your-service-connection-name>"
              organization: "<your-organization-name>"
              scannerMode: "other"
              projectKey: "<your-project-key>"
              projectName: "<your-project-name>"

          - task: Maven@3
            displayName: 'Build & Run Tests'
            inputs:
              mavenPOMFile: "pom.xml"
              goals: "clean package"
              publishJUnitResults: true
              testResultsFiles: "**/surefire-reports/TEST-*.xml"

          - task: Maven@3
            displayName: 'Run SonarCloud Analysis'
            inputs:
              mavenPOMFile: "pom.xml"
              goals: "sonar:sonar"
              options: "-Dsonar.token=$(SONARCLOUD_TOKEN) -Dsonar.projectKey=<your-project-key> -Dsonar.organization=<your-organization-name>"
              publishJUnitResults: false

          - task: SonarCloudPublish@4
            displayName: "Publish Quality Gate Result"
            inputs:
              pollingTimeoutSec: "300"

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: $(System.DefaultWorkingDirectory)
              artifactName: drop`;

const CODE_AZ_JFROG_YAML = `trigger:
  - main

pool: "Default"

variables:
  - group: Sonar-cloud-token-variable
  # - name: system.debug
  #   value: true

stages:
  - stage: "build_stage"
    jobs:
      - job: "Build"
        steps:
          - checkout: self
            fetchDepth: 0

          - task: SonarCloudPrepare@4
            displayName: 'Prepare SonarCloud Analysis'
            inputs:
              SonarCloud: "<your-sonar-service-connection>"
              organization: "<your-organization-name>"
              scannerMode: "other"
              projectKey: "<your-project-key>"
              projectName: "<your-project-name>"

          - task: Maven@3
            displayName: 'Build & Run Tests'
            inputs:
              mavenPOMFile: "pom.xml"
              goals: "clean package"
              publishJUnitResults: true
              testResultsFiles: "**/surefire-reports/TEST-*.xml"

          - task: Maven@3
            displayName: 'Run SonarCloud Analysis'
            inputs:
              mavenPOMFile: "pom.xml"
              goals: "sonar:sonar"
              options: "-Dsonar.token=$(SONARCLOUD_TOKEN) -Dsonar.projectKey=<your-project-key> -Dsonar.organization=<your-organization-name>"
              publishJUnitResults: false

          - task: SonarCloudPublish@4
            displayName: "Publish Quality Gate Result"
            inputs:
              pollingTimeoutSec: "300"

          - task: JFrogMaven@1
            displayName: 'Publish to JFrog Artifactory'
            inputs:
              mavenPOMFile: 'pom.xml'
              goals: 'deploy'
              artifactoryService: '<your-jfrog-service-connection>'
              targetResolveReleaseRepo: '<your-release-repo>'
              targetResolveSnapshotRepo: '<your-snapshot-repo>'
              targetDeployReleaseRepo: '<your-release-repo>'
              targetDeploySnapshotRepo: '<your-snapshot-repo>'
              collectBuildInfo: true
              buildName: '$(Build.DefinitionName)'
              buildNumber: '$(Build.BuildNumber)'

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: $(System.DefaultWorkingDirectory)
              artifactName: drop`;

// ── Common Steps ──────────────────────────────────────────────────────────────
const COMMON_STEPS: Step[] = [
  {
    id: "01",
    title: "Provision & Connect to EC2",
    node: "portal",
    notes: [
      "Create a new EC2 instance in your AWS Console (Ubuntu AMI).",
      "Ensure your security group allows inbound SSH traffic.",
    ],
    commands: ["ssh ubuntu@<public-ip>"],
  },
  {
    id: "02",
    title: "Install Required Dependencies",
    node: "vm",
    commands: [
      "sudo apt update",
      "sudo apt install openjdk-17-jdk -y",
      "sudo apt install maven -y",
    ],
  },
  {
    id: "03",
    title: "Download Pipeline Agent",
    node: "browser",
    notes: [
      "Go to Project Settings => Agent Pools => New Agent.",
      "Choose 'Linux' in the prompt screen to reveal download instructions.",
    ],
    commands: ["wget <link>", "tar -xvf <tar>"],
  },
  {
    id: "04",
    title: "Configure and Run Agent",
    node: "vm",
    commands: [
      "./config.sh",
      "# 1. Provide the Azure DevOps server URL when prompted",
      "# 2. Provide your PAT (Personal Access Token) for authentication",
      "./run.sh",
    ],
  },
];

// ── Azure topic definitions ───────────────────────────────────────────────────
export const AZURE_TOPICS: Topic[] = [
  {
    id: "AZ1",
    title: "Azure DevOps — Classic Pipeline Setup",
    titleAccents: (
      <>
        Azure <span style={{ color: "#a456f0" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(164,86,240,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          Classic Pipeline
        </span>
      </>
    ),
    subtitle: "EC2 INSTANCE · AGENT CONFIGURATION · JAVA/MAVEN · PIPELINE",
    accentColor: "#a456f0",
    accentBg: "rgba(164,86,240,0.1)",
    steps: [
      ...COMMON_STEPS, // <--- Reused steps injected here
      {
        id: "05",
        title: "Create and Queue Pipeline",
        node: "browser",
        notes: [
          "Navigate to Pipelines and create a new Classic Pipeline.",
          "Configure your tasks and ensure the Agent Pool matches your newly created agent.",
          "Click Save and Queue to trigger your build.",
        ],
      },
    ],
    checklist: [
      "EC2 instance is running and accessible via SSH",
      "Java 17 and Maven are successfully installed",
      "Azure DevOps PAT is active with Agent Pool read/manage permissions",
      "Agent is successfully registered and showing as 'Online'",
    ],
  },
  {
    id: "AZ2",
    title: "Azure DevOps — SSH Clone & Agent Setup",
    titleAccents: (
      <>
        Azure <span style={{ color: "#e83d8f" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(232,61,143,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          SSH & Agent Setup
        </span>
      </>
    ),
    subtitle: "SSH KEYS · GIT CLONE · EC2 INSTANCE · JAVA 21",
    accentColor: "#e83d8f",
    accentBg: "rgba(232,61,143,0.1)",
    steps: [
      {
        id: "01",
        title: "Generate RSA SSH Key",
        node: "cli",
        notes: [
          "Azure DevOps does not support the newer ed25519 key format.",
          "You must generate an RSA key (4096-bit) to authenticate successfully.",
        ],
        commands: [
          "ssh-keygen -t rsa -b 4096",
          "# Copy the output of the public key to your clipboard",
          "cat ~/.ssh/id_rsa.pub",
        ],
      },
      {
        id: "02",
        title: "Add Key to Azure DevOps",
        node: "portal",
        notes: [
          "Login to Azure DevOps.",
          "Navigate to your repository, click 'Clone', and select 'SSH'.",
          "Click on 'Manage SSH Keys' and paste your copied RSA public key.",
        ],
      },
      {
        id: "03",
        title: "Clone Repo via SSH",
        node: "cli",
        notes: [
          "Go back to your repository, click 'Clone' again, and copy the SSH URL.",
          "Once cloned, create your initial pipeline file with a .yaml extension.",
        ],
        commands: [
          "git clone <ssh_url>",
          "cd <repository-name>",
          "touch azure-pipelines.yaml",
        ],
      },
      {
        id: "04",
        title: "Provision & Connect to EC2",
        node: "vm",
        notes: [
          "Create a new EC2 instance in AWS (Ubuntu AMI).",
          "Connect to your newly created instance via SSH.",
        ],
        commands: ["ssh ubuntu@<public-ip>"],
      },
      {
        id: "05",
        title: "Install Java 21 & Maven",
        node: "vm",
        commands: [
          "sudo apt update",
          "sudo apt install openjdk-21-jdk -y",
          "sudo apt install maven -y",
        ],
      },
      {
        id: "06",
        title: "Configure Pipeline Agent",
        node: "browser",
        notes: [
          "Go to Organization Settings => Pipelines => Agent pools => Default.",
          "Click 'New agent', select 'Linux', and follow the provided script.",
        ],
        commands: [
          "mkdir myagent && cd myagent",
          "wget <link>",
          "tar -xvf <tar>",
          "./config.sh",
          "# Provide server URL and PAT when prompted",
          "./run.sh",
        ],
      },
    ],
    checklist: [
      "RSA format SSH key generated and added to Azure DevOps profile",
      "Repository cloned using the SSH URL instead of HTTPS",
      "Empty .yaml pipeline file created in the repository",
      "EC2 instance provisioned with Java 21 and Maven installed",
      "Agent successfully installed and registered in the 'Default' organization pool",
    ],
  },
  {
    id: "AZ3",
    title: "Azure DevOps — Maven YAML Pipeline",
    titleAccents: (
      <>
        Azure <span style={{ color: "#f57c00" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(245,124,0,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          Maven YAML Pipeline
        </span>
      </>
    ),
    subtitle:
      "PREREQUISITES · YAML DEFINITION · AZURE REPOS · PUBLISH ARTIFACT",
    accentColor: "#f57c00",
    accentBg: "rgba(245,124,0,0.1)",
    steps: [
      ...COMMON_STEPS, // <--- This injects steps 01 through 04 right here!
      {
        id: "05",
        title: "Create the Pipeline YAML",
        node: "cli",
        code: CODE_AZ_MAVEN_YAML,
        codeLabel: "AZURE PIPELINES · YAML",
        notes: [
          "Create a file named azure-pipelines.yaml in the root of your cloned repository.",
          "Paste this configuration to build the Maven package and publish the artifact.",
          "Commit and push this file to your Azure Repos Git repository.",
        ],
      },
      {
        id: "06",
        title: "Create Pipeline in Azure DevOps",
        node: "portal",
        notes: [
          "Navigate to Pipelines in your Azure DevOps project sidebar.",
          "Click 'New pipeline' (or 'Create Pipeline').",
          "When asked 'Where is your code?', select 'Azure Repos Git'.",
          "Select your project repository from the list.",
        ],
      },
      {
        id: "07",
        title: "Select Existing YAML",
        node: "portal",
        notes: [
          "On the configure tab, scroll down and select 'Existing Azure Pipelines YAML file'.",
          "A drawer will appear asking for the branch and path.",
          "Select your branch (e.g., main) and choose the .yaml or .yml file you created.",
          "Click 'Continue'.",
        ],
      },
      {
        id: "08",
        title: "Run the Pipeline",
        node: "browser",
        notes: [
          "Review your YAML configuration in the browser editor.",
          "Click the 'Run' button in the top right corner.",
          "Click into the job to watch the live logs as your self-hosted EC2 agent builds the project.",
        ],
      },
    ],
    checklist: [
      "EC2 agent is 'Online' in the Default pool before running the pipeline",
      "pom.xml exists in the root of the repository matching the YAML path",
      "YAML indentation is strictly enforced (spaces, no tabs)",
      "Pipeline artifact 'drop' is successfully published at the end of the run",
    ],
  },
  {
    id: "AZ4",
    title: "Azure DevOps — SonarCloud & Maven Integration",
    titleAccents: (
      <>
        Azure <span style={{ color: "#00bfa5" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(0,191,165,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          SonarCloud Pipeline
        </span>
      </>
    ),
    subtitle: "JAVA 21 · AGENT SETUP · SONAR EXTENSIONS · SERVICE CONNECTIONS",
    accentColor: "#00bfa5",
    accentBg: "rgba(0,191,165,0.1)",
    steps: [
      {
        id: "01",
        title: "Provision EC2 & Install Dependencies",
        node: "vm",
        notes: [
          "Create a new EC2 instance and connect via SSH.",
          "Install Java 21 (required for newer Sonar scanners) and Maven.",
        ],
        commands: [
          "ssh ubuntu@<public-ip>",
          "sudo apt update",
          "sudo apt install openjdk-21-jdk -y",
          "sudo apt install maven -y",
        ],
      },
      {
        id: "02",
        title: "Configure Pipeline Agent",
        node: "cli",
        notes: [
          "In Azure DevOps, go to Project Settings => Agent Pools => Default.",
          "Click 'New agent', follow the download instructions, and configure it.",
        ],
        commands: [
          "./config.sh",
          "# Provide server URL and authentication PAT",
          "./run.sh",
        ],
      },
      {
        id: "03",
        title: "Install Sonar Extensions",
        node: "portal",
        notes: [
          "Navigate to Organization Settings (bottom left).",
          "Click on Extensions => Browse Marketplace (top right).",
          "Search for 'SonarCloud' and 'SonarQube' and click 'Get it free' to install them into your organization.",
        ],
      },
      {
        id: "04",
        title: "Create Service Connection",
        node: "portal",
        notes: [
          "Go back to Project Settings => Service connections => New service connection.",
          "Search for 'SonarCloud'.",
          "Generate a token in your SonarCloud account, paste it here, give the connection a name, and click Verify & Save.",
        ],
      },
      {
        id: "05",
        title: "Create Variable Group",
        node: "portal",
        notes: [
          "Go to Pipelines => Library => + Variable group.",
          "Name it 'Sonar-cloud-token-variable'.",
          "Add a variable named 'SONARCLOUD_TOKEN' and paste your SonarCloud token as the value. Save the group.",
        ],
      },
      {
        id: "06",
        title: "Create & Run YAML Pipeline",
        node: "browser",
        code: CODE_AZ_SONAR_YAML,
        codeLabel: "AZURE PIPELINES · SONAR YAML",
        notes: [
          "Go to your Project level and create a new YAML pipeline.",
          "Ensure your fetchDepth is set to 0 so Sonar can analyze the full git history.",
          "Save, run the pipeline, and check the SonarCloud dashboard for your code quality gates!",
        ],
      },
    ],
    checklist: [
      "EC2 agent is 'Online' and running Java 21",
      "SonarCloud extension is successfully installed at the Organization level",
      "Service connection 'sonar-cloud-token' is verified and active",
      "Variable group 'Sonar-cloud-token-variable' is linked correctly in the YAML",
      "The Project Key and Organization fields in the YAML match your actual SonarCloud project",
    ],
  },
  {
    id: "AZ5",
    title: "Azure DevOps — Run Agent as Background Service",
    titleAccents: (
      <>
        Azure <span style={{ color: "#6366f1" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(99,102,241,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          Background Service
        </span>
      </>
    ),
    subtitle: "SVC.SH · SYSTEMCTL · DAEMON · CONTINUOUS EXECUTION",
    accentColor: "#6366f1",
    accentBg: "rgba(99,102,241,0.1)",
    steps: [
      {
        id: "01",
        title: "Install the Service",
        node: "vm",
        notes: [
          "Run this from inside your agent directory after successfully running ./config.sh.",
          "This registers the agent as a systemd service so it can run independently of your terminal session.",
        ],
        commands: ["sudo ./svc.sh install"],
      },
      {
        id: "02",
        title: "Start the Service",
        node: "vm",
        notes: [
          "Starts the background process immediately.",
          "Once started, you can safely close your SSH connection and the agent will remain 'Online'.",
        ],
        commands: ["sudo ./svc.sh start"],
      },
      {
        id: "03",
        title: "Check Status (via svc.sh)",
        node: "vm",
        notes: [
          "Quickly verify if the local agent service is actively running.",
        ],
        commands: ["sudo ./svc.sh status"],
      },
      {
        id: "04",
        title: "Check Status (via systemctl)",
        node: "vm",
        notes: [
          "Alternatively, use native Linux commands to check detailed logs and daemon status.",
          "Replace <your-org> and <your-agent> with your actual Azure DevOps organization and agent name (e.g., vsts.agent.maratinikhil9.Default.my\\x2dagent.service).",
        ],
        commands: [
          "sudo systemctl status 'vsts.agent.<your-org>.Default.<your-agent>.service'",
        ],
      },
      {
        id: "05",
        title: "Stop the Service (Optional)",
        node: "vm",
        notes: [
          "If you ever need to halt the agent temporarily, use the stop command.",
          "To completely remove the service, you can also run 'sudo ./svc.sh uninstall'.",
        ],
        commands: ["sudo ./svc.sh stop"],
      },
    ],
    checklist: [
      "Agent is fully configured (./config.sh ran successfully) before installing the service",
      "All ./svc.sh commands are executed with 'sudo' privileges",
      "Agent status remains 'Online' in the Azure DevOps portal after closing the terminal",
    ],
  },
  {
    id: "AZ6",
    title: "Azure VM — Persistent Sessions & Tmux",
    titleAccents: (
      <>
        Azure <span style={{ color: "#10b981" }}>VM</span>{" "}
        <span
          style={{
            color: "rgba(16,185,129,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          Persistent Sessions
        </span>
      </>
    ),
    subtitle: "SSH KEEP-ALIVE · TMUX · SCP KEY TRANSFER · BACKGROUND TASKS",
    accentColor: "#10b981",
    accentBg: "rgba(16,185,129,0.1)",
    steps: [
      {
        id: "01",
        title: "Configure SSH Keep-Alive (Local)",
        node: "cli",
        notes: [
          "To prevent the VM connection from dropping due to inactivity, edit your local SSH config file.",
          "Add the ServerAlive configurations under the 'Host *' block.",
        ],
        commands: [
          "vi ~/.ssh/config",
          "# Add the following lines:",
          "# Host *",
          "#   ServerAliveInterval 60",
          "#   ServerAliveCountMax 5",
        ],
      },
      {
        id: "02",
        title: "Install Tmux on the VM",
        node: "vm",
        notes: [
          "Tmux (Terminal Multiplexer) allows you to run processes in the background even after you close your SSH terminal.",
        ],
        commands: [
          "ssh ubuntu@<public-ip>",
          "sudo apt update",
          "sudo apt install tmux -y",
        ],
      },
      {
        id: "03",
        title: "Transfer SSH Keys (Local to VM)",
        node: "cli",
        notes: [
          "If you need to SSH to other servers from inside this VM, securely copy (scp) your keys over.",
          "Run this from your LOCAL terminal (e.g., Windows PowerShell or Mac/Linux terminal).",
        ],
        commands: [
          "# Exit the VM first, or open a new local terminal tab",
          "scp ~/.ssh/id_ed25519.pub ubuntu@<public-ip>:~",
          "scp ~/.ssh/id_ed25519 ubuntu@<public-ip>:~",
        ],
      },
      {
        id: "04",
        title: "Secure Keys Inside the VM",
        node: "vm",
        notes: [
          "Log back into the VM and move the keys into the hidden .ssh directory.",
          "CRITICAL: You must restrict permissions on the private key, or SSH will reject it.",
        ],
        commands: [
          "ssh ubuntu@<public-ip>",
          "mv ~/id_ed25519* ~/.ssh/",
          "chmod 600 ~/.ssh/id_ed25519",
        ],
      },
      {
        id: "05",
        title: "Start Tmux & Connect",
        node: "vm",
        notes: [
          "Start a new tmux session. Any command you run here will survive a disconnect.",
          "To detach and leave it running in the background, press 'Ctrl+B' then 'D'.",
        ],
        commands: ["tmux", "ssh -i ~/.ssh/id_ed25519 ubuntu@<target-ip>"],
      },
    ],
    checklist: [
      "Local ~/.ssh/config is updated to prevent idle timeout disconnects",
      "Private key (id_ed25519) has 'chmod 600' permissions applied on the VM",
      "Tmux is actively running before kicking off long-running scripts",
    ],
  },
  {
    id: "AZ7",
    title: "Azure DevOps — JFrog Artifactory & SonarCloud",
    titleAccents: (
      <>
        Azure <span style={{ color: "#41bf47" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(65,191,71,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          JFrog Pipeline
        </span>
      </>
    ),
    subtitle: "JAVA 21 PATH · JFROG EXTENSION · MAVEN DEPLOY · ARTIFACTORY",
    accentColor: "#41bf47",
    accentBg: "rgba(65,191,71,0.1)",
    steps: [
      {
        id: "01",
        title: "Provision EC2 & Setup Java Home",
        node: "vm",
        notes: [
          "Connect to your EC2 instance and install Java 21.",
          "You must explicitly export JAVA_HOME in your bash profile for the pipeline to resolve it correctly during Maven builds.",
        ],
        commands: [
          "sudo apt update",
          "sudo apt install openjdk-21-jdk -y",
          "echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc",
          "echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc",
          "source ~/.bashrc",
          "java --version",
          "sudo apt install maven -y",
        ],
      },
      {
        id: "02",
        title: "Configure Pipeline Agent",
        node: "cli",
        notes: [
          "In Azure DevOps, go to Project Settings => Agent Pools => Default.",
          "Download and configure your agent, then start it to ensure it is 'Online'.",
        ],
        commands: ["./config.sh", "./run.sh"],
      },
      {
        id: "03",
        title: "Install JFrog Extension",
        node: "portal",
        notes: [
          "Navigate to Organization Settings (bottom left).",
          "Click on Extensions => Browse Marketplace (top right).",
          "Search for 'JFrog Artifactory' and click 'Get it free' to install it into your DevOps organization.",
        ],
      },
      {
        id: "04",
        title: "Create JFrog Service Connection",
        node: "portal",
        notes: [
          "Go to Project Settings => Service connections => New service connection.",
          "Search for 'JFrog Artifactory' and select it.",
          "Provide your JFrog Server URL, Username, and Password/Token.",
          "Give the connection a recognizable name, then click Verify & Save.",
        ],
      },
      {
        id: "05",
        title: "Create & Run JFrog YAML Pipeline",
        node: "browser",
        code: CODE_AZ_JFROG_YAML,
        codeLabel: "AZURE PIPELINES · JFROG + SONAR",
        notes: [
          "This pipeline runs SonarCloud analysis first, then packages and deploys the artifact directly to your JFrog Artifactory repositories.",
          "Make sure to replace all the <placeholder> tags with your actual service connections and repo names before running!",
        ],
      },
    ],
    checklist: [
      "JAVA_HOME is properly exported in ~/.bashrc on the EC2 agent",
      "JFrog Artifactory extension is installed in Organization settings",
      "JFrog Service Connection is verified and active",
      "JFrog repository names in the YAML match the repositories created in your JFrog dashboard",
    ],
  },
  {
    id: "AZ8",
    title: "Azure DevOps — Microsoft Hosted Agents",
    titleAccents: (
      <>
        Azure <span style={{ color: "#4f46e5" }}>DevOps</span>{" "}
        <span
          style={{
            color: "rgba(79,70,229,0.7)",
            fontWeight: 500,
            fontSize: "0.95em",
          }}
        >
          Hosted Agents
        </span>
      </>
    ),
    subtitle: "YAML SCOPE · PIPELINE LEVEL · STAGE LEVEL · JOB LEVEL",
    accentColor: "#4f46e5",
    accentBg: "rgba(79,70,229,0.1)",
    steps: [
      {
        id: "01",
        title: "Pipeline Level Scope",
        node: "cli",
        code: `pool:
  vmImage: "ubuntu-24.04"

stages:
  - stage: Build
    jobs:
      - job: Example
        steps:
          - script: echo "I run on ubuntu-24.04!"`,
        codeLabel: "YAML · GLOBAL POOL",
        notes: [
          "Defining the pool at the top level applies it to all stages, jobs, and steps by default.",
          "This is the best approach if your entire pipeline runs on a single OS/environment.",
        ],
      },
      {
        id: "02",
        title: "Stage Level Scope",
        node: "cli",
        code: `stages:
  - stage: BuildLinux
    pool:
      vmImage: "ubuntu-24.04"
    jobs:
      - job: LinuxJob
        steps:
          - script: echo "Linux specific build"

  - stage: BuildWindows
    pool:
      vmImage: "windows-2022"
    jobs:
      - job: WindowsJob
        steps:
          - script: echo "Windows specific build"`,
        codeLabel: "YAML · STAGE POOL",
        notes: [
          "You can override the global pool for a specific stage.",
          "Useful when an entire stage (like testing on Windows) requires a different environment than the build stage.",
        ],
      },
      {
        id: "03",
        title: "Job Level Scope",
        node: "cli",
        code: `jobs:
  - job: LinuxBuild
    pool:
      vmImage: "ubuntu-24.04"
    steps:
      - script: echo "Building Linux artifact"

  - job: MacBuild
    pool:
      vmImage: "macos-13"
    steps:
      - script: echo "Building macOS artifact"`,
        codeLabel: "YAML · JOB POOL",
        notes: [
          "Most commonly used scope. Each job within a stage can run on completely different agents.",
          "This allows you to run parallel builds or matrix testing across multiple operating systems simultaneously.",
        ],
      },
    ],
    checklist: [
      "Microsoft Hosted agents are billed by execution minutes (first 1,800 min/month are free for public projects)",
      "Always specify the exact vmImage version (e.g., ubuntu-24.04) rather than 'ubuntu-latest' to prevent unexpected pipeline breaks during OS upgrades",
      "More specific scopes override broader scopes (Job > Stage > Pipeline)",
    ],
  },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────
const makeTokens = (isDark: boolean) => ({
  pageBg: isDark ? "#080c10" : "#f4f6f8",
  gridLine: isDark ? "rgba(0,120,212,0.03)" : "rgba(0,120,212,0.06)",
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
  numBg: isDark ? "rgba(0,120,212,0.15)" : "rgba(0,120,212,0.1)",
  numBorder: isDark ? "#0078d440" : "rgba(0,120,212,0.3)",
  copyBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
  copyColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
  checklistBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
  checklistBdr: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
  stripBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
  stripBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  colBgOn: isDark ? "rgba(0,120,212,0.08)" : "rgba(0,120,212,0.07)",
  colBdrOn: isDark ? "rgba(0,120,212,0.3)" : "rgba(0,120,212,0.35)",
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
                border: `1px solid rgba(0,120,212,0.25)`,
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
                    color: "#0078d4",
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
                            color: "#0078d4",
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
                  {step.codeLabel || "AZURE CLI · SCRIPT"}
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
                    tr.startsWith("az ") ||
                    tr.startsWith("kubectl") ||
                    tr.startsWith("docker");
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
                color: allOpen ? "#0078d4" : t.colTxtOff,
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
export const AzureTopics: React.FC = () => {
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
                background: "rgba(0,120,212,0.15)",
                border: "1px solid #0078d440",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              ☁️
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
                Microsoft <span style={{ color: "#0078d4" }}>Azure</span> Cloud
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
                3 TOPICS · CLICK ANY CARD BELOW TO EXPAND ALL STEPS
              </p>
            </div>
          </div>
        </div>

        {/* Topic cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {AZURE_TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AzureTopics;
