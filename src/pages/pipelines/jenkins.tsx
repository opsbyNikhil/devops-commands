import React, { useState } from "react";
import { useTheme } from "../../Themecontext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Step {
  id: string;
  title: string;
  node: "master" | "worker" | "browser" | "jenkins";
  commands?: string[];
  notes?: string[];
  code?: string;
  codeLabel?: string;
}

interface Pipeline {
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
  master: {
    label: "Master Node",
    color: "#d24939",
    bg: "#d2493918",
    icon: "🖥️",
  },
  worker: {
    label: "Worker Node",
    color: "#2da44e",
    bg: "#2da44e18",
    icon: "⚙️",
  },
  browser: { label: "Browser", color: "#0078d4", bg: "#0078d418", icon: "🌐" },
  jenkins: {
    label: "Jenkins UI",
    color: "#f0927f",
    bg: "#f0927f18",
    icon: "🏗️",
  },
};

// ── Shared steps (01–11) ──────────────────────────────────────────────────────
const COMMON_STEPS: Step[] = [
  {
    id: "01",
    title: "Create Master & Worker Nodes",
    node: "browser",
    notes: [
      "Provision 1 Master Node (EC2 / VM) — this runs Jenkins server",
      "Provision 1 Worker Node (EC2 / VM) — this runs pipeline jobs",
      "Ensure both nodes are in the same VPC / network and can reach each other via private IP",
    ],
  },
  {
    id: "02",
    title: "Setup Master Node",
    node: "master",
    commands: [
      "sudo apt update",
      "sudo apt install openjdk-21-jdk -y",
      "# Install Jenkins from official documentation",
      "curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null",
      "echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null",
      "sudo apt update && sudo apt install jenkins -y",
      "sudo systemctl enable jenkins && sudo systemctl start jenkins",
    ],
  },
  {
    id: "03",
    title: "Setup Worker Node",
    node: "worker",
    commands: [
      "sudo apt update",
      "sudo apt install openjdk-21-jdk -y",
      "# Java is all the worker needs — Jenkins agent runs via SSH from master",
    ],
  },
  {
    id: "04",
    title: "Access Jenkins UI",
    node: "browser",
    notes: [
      "Open your browser and navigate to the master node public IP on port 8080",
      "URL format: http://<MasterNode-Public-IP>:8080",
      "Make sure port 8080 is open in your Security Group / Firewall rules",
    ],
  },
  {
    id: "05",
    title: "Retrieve Initial Admin Password",
    node: "master",
    commands: [
      "sudo cat /var/lib/jenkins/secrets/initialAdminPassword",
      "# Copy the printed password and paste it in the Jenkins UI unlock screen",
    ],
  },
  {
    id: "06",
    title: "Install Suggested Plugins",
    node: "jenkins",
    notes: [
      'Click "Install suggested plugins" on the Getting Started screen',
      "Wait for all plugins to finish downloading and installing",
      "Jenkins will automatically proceed to the admin user creation screen",
    ],
  },
  {
    id: "07",
    title: "Create Admin Credentials",
    node: "jenkins",
    notes: [
      "Fill in: Username, Password, Confirm Password, Full Name, Email",
      'Click "Save and Continue" then "Save and Finish"',
      'Click "Start using Jenkins"',
    ],
  },
  {
    id: "08",
    title: "Create Worker Node",
    node: "jenkins",
    notes: [
      "Go to: Dashboard → Manage Jenkins → Nodes → New Node",
      "Give the node a name and select Permanent Agent",
      "Remote root directory: /home/ubuntu/<any-name>",
      "Labels: SPC  (must match the label used in pipeline agent block)",
      "Launch method: Launch agents via SSH",
      "Host: <Worker Node Private IP>",
      "Add new SSH credentials: select SSH Username with private key",
      'Click Save, then open the node and click "Log" in the sidebar',
      'Verify the log shows "Agent successfully connected and online"',
    ],
  },
  {
    id: "09",
    title: "Create a New Pipeline Item",
    node: "jenkins",
    notes: [
      'Click "New Item" from the Dashboard',
      "Enter a name for your pipeline",
      'Select "Pipeline" and click OK',
      "Under Pipeline section, choose: Pipeline script from SCM",
      "SCM: Git — enter your repository URL and branch (main)",
      "Jenkinsfile path: Jenkinsfile (must exist in repo root)",
      'Click "Save"',
    ],
  },
  {
    id: "10",
    title: "Install SonarQube Scanner Plugin",
    node: "jenkins",
    notes: [
      "Go to: Dashboard → Manage Jenkins → Plugins → Available plugins",
      'Search for "SonarQube Scanner" and install it',
      'After install, select "Restart Jenkins when no jobs are running"',
      "Wait for Jenkins to restart and log back in",
      "Go to: Manage Jenkins → System → SonarQube servers",
      "Add a new server: Name = SONAR, URL = https://sonarcloud.io",
      "Add your SonarCloud token as a Secret Text credential with ID: SONAR",
    ],
  },
];

// ── Pipeline 1 code ───────────────────────────────────────────────────────────
const CODE_P1 = `pipeline {
    agent {label 'SPC'}
    triggers {
        pollSCM('* * * * *')
    }
    stages {
        stage ('git checkout') {
            steps {
                git url: 'https://github.com/maratinikhil/spring-petclinic.git',
                    branch: 'main'
            }
        }
        stage ('build & scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]){
                withSonarQubeEnv('SONAR'){
                    sh """mvn package sonar:sonar \
                        -Dsonar.projectKey=maratinikhil_spring-petclinic \
                        -Dsonar.organization=maratinikhil \
                        -Dsonar.host.url=https://sonarcloud.io/ \
                        -Dsonar.login=$SONAR_TOKEN
                        """
                }
                }
            }
        }
    }
}`;

// ── Pipeline 2 code ───────────────────────────────────────────────────────────
const CODE_P2 = `pipeline {
    agent {label 'SPC'}
    triggers {
        pollSCM('* * * * *')
    }
    stages {
        stage ('git checkout') {
            steps {
                git url: 'https://github.com/maratinikhil/spring-petclinic.git',
                    branch: 'main'
            }
        }
        stage ('build & scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]){
                withSonarQubeEnv('SONAR'){
                    sh """mvn package sonar:sonar \
                        -Dsonar.projectKey=maratinikhil_spring-petclinic \
                        -Dsonar.organization=maratinikhil \
                        -Dsonar.host.url=https://sonarcloud.io/ \
                        -Dsonar.login=$SONAR_TOKEN
                        """
                }
                }
            }
        }
    }
post {
    always {
        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
        archiveArtifacts artifacts: 'target/surefire-reports/*.xml'
        junit '**/target/surefire-reports/*.xml'
    }
    success {
        echo 'pipeline executed successfully!'
    }
    failure {
        echo 'pipeline failed. check the logs for details'
    }
}
}`;

// ── Pipeline 3 code ───────────────────────────────────────────────────────────
const CODE_P3 = `pipeline {
    agent {label 'SPC'}
    triggers {
        pollSCM('* * * * *')
    }
    stages {
        stage ('git checkout') {
            steps {
                git url: 'https://github.com/maratinikhil/spring-petclinic.git',
                    branch: 'main'
            }
        }
        stage ('build & scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]){
                withSonarQubeEnv('SONAR'){
                    sh """mvn package sonar:sonar \
                        -Dsonar.projectKey=maratinikhil_spring-petclinic \
                        -Dsonar.organization=maratinikhil \
                        -Dsonar.host.url=https://sonarcloud.io/ \
                        -Dsonar.login=$SONAR_TOKEN
                        """
                }
                }
            }
        }
        stage ('Artifactory - Jfrog'){
            steps {
                rtUpload (
                    serverId: 'Jfrog',
                    spec: '''{
                        "files": [
                            {
                            "pattern": "target/*.jar",
                            "target": "spcjava-spc/"
                            }
                        ]
                    }''',
                )
                rtPublishBuildInfo(serverId: 'Jfrog')
            }
        }
    }
post {
    always {
        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
        archiveArtifacts artifacts: 'target/surefire-reports/*.xml'
        junit '**/target/surefire-reports/*.xml'
    }
    success {
        echo 'pipeline executed successfully!'
    }
    failure {
        echo 'pipeline failed. check the logs for details'
    }
}
}`;

const CODE_P4 = `pipeline {
    agent {label 'SPC'} 
    triggers {
        pollSCM('* * * * *')
    }
    parameters {
        choice(name: 'CHOICE', choices: ['package', 'clean install', 'verify'], description: 'Select Maven goal')
    }
        stages {
            stage ('git checkout') {
                steps {
                    git url: 'https://github.com/maratinikhil/spring-petclinic.git',
                        branch: 'main'
                }
            } 
            stage ('build & scan') {
                steps {
                    withCredentials([string(credentialsId: 'sonar_id', variable: 'SONAR_TOKEN')]){
                    withSonarQubeEnv('SONAR'){
                        sh """mvn \${params.CHOICE} sonar:sonar \
                            -Dsonar.projectKey=maratinikhil_spring-petclinic \
                            -Dsonar.organization=maratinikhil \
                            -Dsonar.host.url=https://sonarcloud.io/ \
                            -Dsonar.login=$SONAR_TOKEN
                            """
                    }
                    }
                } 
            }
            stage ('Artifactory - Jfrog'){
                steps {
                    rtUpload (  
                        serverId: 'Jfrog',
                        spec: '''{
                            "files": [
                                {
                                "pattern": "target/*.jar",
                                "target": "spcjava-spc/"
                                }
                            ]
                        }''',
                    )
                     rtPublishBuildInfo(serverId: 'Jfrog')    
                }

            }
        }
post {
    always {
        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
         archiveArtifacts artifacts: 'target/surefire-reports/*.xml'
        junit '**/target/surefire-reports/*.xml'
    }
    success {
        echo 'pipeline executed successfully!'
    }
    failure {
        echo 'pipeline failed. check the logs for details'
    }
}
}
`;

const CODE_P5 = `pipeline{
    agent {label "Python-Sample-Project"}
    triggers {
      pollSCM('* * * * *')
    }
    stages {
        stage ("git checkout") {
            steps {
                git url: "https://github.com/maratinikhil/Auth-py-django.git",
                    branch: "main"
           }
        }
        stage ("installing dependencies"){
            steps {
                sh """
                python3 -m venv venv 
                . venv/bin/activate
                pip install -r requirements.txt
                """
            }
        }
    }
}
`;

const CODE_P6 = `pipeline {
  agent {label "spc"}
  triggers {
    pollSCM("* * * * *")
  }
  stages {
    stage ("git checkout") {
      steps {
        git url: "https://github.com/Mygit-personal/spring-petclinic.git",
          branch: "main"
      }
    }

    stage ("maven") {
      steps {
        sh "mvn package"
      }
    }

    stage ("sonar scan") {
      steps{
        withCredentials([string(credentialsId: 'sonar_id', variable:"SONAR_TOKEN")]){
        withSonarQubeEnv("Sonar"){
          sh """mvn package sonar:sonar \
              -Dsonar.projectKey=Mygit-personal_spring-petclinic \
              -Dsonar.organization=mygit-personal \
              -Dsonar.host.url=https://sonarcloud.io/ \
              -Dsonar.login=$SONAR_TOKEN
          """
        }}
      }
    }

    stage ("docker push to ECR") {
      steps {
        sh '''
          docker pull nginx:1.29
          aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com
          docker tag nginx:1.29 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest
          docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest

        '''
      }
    }
  }  
}
`;

const CODE_P7 = `pipeline {
  agent {label "SPC-JAVA"}
  
  environment {
    image_name = 'spc'
    tag_name = '1.0'
  }
  
  triggers {
    pollSCM("* * * * *")
  }
  stages {
    stage ("git checkout") {
      steps {
        git url: "https://github.com/Mygit-personal/spring-petclinic.git",
          branch: "main"
      }
    }

    stage ("maven") {
      steps {
        sh "mvn package"
      }
    }

    stage ("sonar scan") {
      steps{
        withCredentials([string(credentialsId: 'sonar_id', variable:"SONAR_TOKEN")]){
        withSonarQubeEnv("Sonar"){
          sh """mvn package sonar:sonar \
              -Dsonar.projectKey=Mygit-personal_spring-petclinic \
              -Dsonar.organization=mygit-personal \
              -Dsonar.host.url=https://sonarcloud.io/ \
              -Dsonar.login=$SONAR_TOKEN
          """
        }}
      }

    stage ('docker image') {
      steps {
        sh 'docker image build -t \${image_name}:\${tag_name} .'
      }
    }

    stage ('trivy image scan') {
      steps {
        sh '''
          trivy image \${image_name}:\${tag_name}
        '''
      }
    }

    stage ('image push to ECR') {
      steps {
        sh """aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com && \
            docker tag \${image_name}:\${tag_name} 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest && \
            docker image ls && \
            docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest"""
      }
    }

    stage ('deploy K8S') {
      steps {
        sh 'kubectl apply -f deploy-k8s/.'
      }
    }
  }  

  }
`;

const CODE_K8S_DP = `apiVersion: v1
kind: Pod
metadata:
  name: myspc-pod
  label:
    app: spc
spec:
  container:
    - name: my-spc-container
      image: "984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest"
      ports:
        - containerPort: 8080
`;

const CODE_K8S_SVC = `apiVersion: v1
kind: Services
metada:
  name: svc-spc
  spec: 
    type: NodePort
    selector: 
      app: spc
    ports:
      -port: 8080
      nodeport: 32000
`;

const CODE_P8 = `pipeline {
  agent {label "SPC-JAVA"}
  environment {
    image_name = 'spc'
    tag_name = '1.0'
  }
  
  triggers {
    pollSCM("* * * * *")
  }
  stages {
    stage ("git checkout") {
      steps {
        git url: "https://github.com/Mygit-personal/spring-petclinic.git",
          branch: "main"
      }
    }

    stage ("maven") {
      steps {
        sh "mvn package"
      }
    }

    stage ("sonar scan") {
      steps{
        withCredentials([string(credentialsId: 'sonar_id', variable:"SONAR_TOKEN")]){
        withSonarQubeEnv("Sonar"){
          sh """mvn package sonar:sonar \
              -Dsonar.projectKey=Mygit-personal_spring-petclinic \
              -Dsonar.organization=mygit-personal \
              -Dsonar.host.url=https://sonarcloud.io/ \
              -Dsonar.login=$SONAR_TOKEN
          """
        }}
      }
    

    stage ("docker push to ECR") {
      steps {
        sh '''
          docker pull nginx:1.29
          aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com
          docker tag nginx:1.29 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest
          docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest

        '''
      }
    }

    stage ('docker image') {
      steps {
        sh 'docker image build -t \${image_name}:\${tag_name} .'
      }
    }

    stage ('trivy report') {
      steps {
        sh '''
          curl -sSL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/junit.tpl -o junit.tpl

          trivy image \
            --scanners vuln \
            --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
            --format template \
            --template "@junit.tpl" \
            -o trivy-report.xml \
            \${image_name}:\${tag_name}
        '''
      }
    }

    

    stage ('image push to ECR') {
      steps {
        sh """aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com && \
            docker tag \${image_name}:\${tag_name} 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest && \
            docker image ls && \
            docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest"""
      }
    }

    stage ('deploy K8S') {
      steps {
        sh 'kubectl apply -f deploy-k8s/.'
      }
    }
  }  

  }

  post {
  always {
    archiveArtifacts artifacts: 'trivy-report.xml', fingerprint: true
    junit allowEmptyResults: true, testResults: 'trivy-report.xml'
  }
}
}
`;

const CODE_P9 = `

pipeline {
  agent {label "SPC"}
  
  environment {
    image_name = 'spc'
    tag_name = '1.0'
  }
  
  triggers {
    pollSCM("* * * * *")
  }
  stages {
    stage ("git checkout") {
      steps {
        git url: "https://github.com/Mygit-personal/spring-petclinic.git",
          branch: "main"
      }
    }

    stage ("maven") {
      steps {
        sh "mvn package"
      }
    }

    stage ("sonar scan") {
      steps{
        withCredentials([string(credentialsId: 'SONAR_ID', variable:"SONAR_TOKEN")]){
        withSonarQubeEnv("Sonar"){
          sh """mvn package sonar:sonar \
              -Dsonar.projectKey=Mygit-personal_spring-petclinic \
              -Dsonar.organization=mygit-personal \
              -Dsonar.host.url=https://sonarcloud.io/ \
              -Dsonar.login=$SONAR_TOKEN
          """
        }}
      }
    }

    stage("Quality Gate") {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          script {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
              error "❌ Pipeline stopped: Quality Gate failed"
            } else {
              echo "✅ Quality Gate passed"
            }
          }
        }
      }
    }

    stage ("docker push to ECR") {
      steps {
        sh '''
          docker pull nginx:1.29
          aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com
          docker tag nginx:1.29 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest
          docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest

        '''
      }
    }

    stage ('docker image') {
      steps {
        sh 'docker image build -t \${image_name}:\${tag_name} .'
      }
    }

    stage ('trivy report') {
      steps {
        sh '''
          curl -sSL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/junit.tpl -o junit.tpl

          trivy image \
            --scanners vuln \
            --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
            --format template \
            --template "@junit.tpl" \
            -o trivy-report.xml \
            \${image_name}:\${tag_name}
        '''
      }
    }

    

    stage ('image push to ECR') {
      steps {
        sh """aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com && \
            docker tag \${image_name}:\${tag_name} 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest && \
            docker image ls && \
            docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest"""
      }
    }
  }  

  post {
  always {
    archiveArtifacts artifacts: 'trivy-report.xml', fingerprint: true
    junit allowEmptyResults: true, testResults: 'trivy-report.xml'
    }
  }
}
`;

const CODE_P10 = `pipeline {
  agent {label "SPC"}
  
  environment {
    image_name = 'spc'
    tag_name = '1.0'
  }
  
  triggers {
    pollSCM("* * * * *")
  }
  stages {
    stage ("git checkout") {
      steps {
        git url: "https://github.com/Mygit-personal/spring-petclinic.git",
          branch: "main"
      }
    }

    stage ("maven") {
      steps {
        sh "mvn package"
      }
    }

    stage ("sonar scan") {
      steps{
        withCredentials([string(credentialsId: 'SONAR_ID', variable:"SONAR_TOKEN")]){
        withSonarQubeEnv("Sonar"){
          sh """mvn package sonar:sonar \
              -Dsonar.projectKey=Mygit-personal_spring-petclinic \
              -Dsonar.organization=mygit-personal \
              -Dsonar.host.url=https://sonarcloud.io/ \
              -Dsonar.login=$SONAR_TOKEN
          """
        }}
      }
    }

    stage("Quality Gate") {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          script {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
              error "❌ Pipeline stopped: Quality Gate failed"
            } else {
              echo "✅ Quality Gate passed"
            }
          }
        }
      }
    }

    stage ("docker push to ECR") {
      steps {
        sh '''
          docker pull nginx:1.29
          aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com          
          docker tag nginx:1.29 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest
          docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images:latest

        '''
      }
    // }

    stage ('docker image') {
      steps {
        sh 'docker image build -t \${image_name}:\${tag_name} .'
      }
    }

    stage ('trivy report') {
      steps {
        sh '''
          curl -sSL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/junit.tpl -o junit.tpl

          trivy image \
            --scanners vuln \
            --severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL \
            --format template \
            --template "@junit.tpl" \
            -o trivy-report.xml \
            \${image_name}:\${tag_name}
        '''
      }
    }

    

    stage ('image push to ECR') {
      steps {
        sh """aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 984912521466.dkr.ecr.ap-south-1.amazonaws.com && \
            docker tag \${image_name}:\${tag_name} 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest && \
            docker image ls && \
            docker push 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image:latest"""
      }
    }

    stage('Deploy K8S') {
      steps {
        withCredentials([file(credentialsId: 'myeks', variable: 'KUBECONFIG')]) {
          sh "kubectl apply -f deploy-k8s/."
        }
      }
    }
  }  

  post {
  always {
    archiveArtifacts artifacts: 'trivy-report.xml', fingerprint: true
    junit allowEmptyResults: true, testResults: 'trivy-report.xml'
    }
  }
}
}
`;

const CODE_P11 = `pipeline{
  agent {label 'SPC'}
    stages{
      stage ('git checkout'){
        steps {
          git url: "https://github.com/Mygit-personal/spring-petclinic.git",
            branch: "main"

        }
      }
      stage ("build") {
        steps {
          script {
            def buildScript = load "my-shared-library/vars/build.groovy"
            buildScript()
          }
        }
      }
    }
}
`;

const CODE_SHARED_LIB_BUILD = `def call() {
    sh 'mvn package'
}

return this`;

const CODE_P12 = `@Library('shared-lb@main') _
pipeline{
  agent {label 'SPC'}
    stages{
      stage ('git checkout'){
        steps {
          git url: "https://github.com/Mygit-personal/spring-petclinic.git",
            branch: "main"
        }
      }
      stage ("build") {
        steps {
          build1()
        }
      }
    }
}`;

const CODE_SHARED_LIB_BUILD2 = `def call(){
    sh 'mvn package'
}`;

const CODE_P13 = `@Library('shared-lb-1@main') _
pipeline{
  agent {label 'SPC'}
    stages{
      stage ('git checkout'){
        steps {
          git url: "https://github.com/Mygit-personal/spring-petclinic.git",
            branch: "main"
        }
      }
      stage ("build") {
        steps {
          mybuild.build()
        }
      }
    }
}`;

const CODE_SHARED_LIB_EXTERNAL = `def build(){
    sh "mvn package"
}`;

const CODE_P14 = `pipeline {
  agent {label "SPC"}

  environment {
    image_name = 'spc'
    tag_name = '1.0'
  }

  triggers {
    pollSCM("* * * * *")
  }
  stages {
    stage ("git checkout") {
      steps {
        git url: "https://github.com/Mygit-personal/spring-petclinic.git",
          branch: "main"
      }
    }

    stage ("maven") {
      when {
        expression {
          currentBuild.currentResult == null || currentBuild.currentResult == "SUCCESS"
        }
      }
      steps {
        sh "mvn package"
      }
    }

    stage ("sonar scan") {
      when {
        expression {
          currentBuild.currentResult == null || currentBuild.currentResult == "SUCCESS"
        }
      }
      steps{
        withCredentials([string(credentialsId: 'SONAR_ID', variable:"SONAR_TOKEN")]){
        withSonarQubeEnv("SONAR"){
          sh """mvn sonar:sonar \\
              -Dsonar.projectKey=Mygit-personal_spring-petclinic \\
              -Dsonar.organization=mygit-personal \\
              -Dsonar.host.url=https://sonarcloud.io/ \\
              -Dsonar.login=$SONAR_TOKEN
          """
        }}
      }
    }

    stage ('docker image') {
      steps {
        sh 'docker image build -t \${image_name}:\${tag_name} .'
      }
    }
  }
}`;

// ── 3 Pipeline definitions ────────────────────────────────────────────────────
export const PIPELINES: Pipeline[] = [
  {
    id: "P1",
    title: "Jenkins Pipeline + SonarCloud",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#f0927f" }}>SonarCloud</span>
      </>
    ),
    subtitle: "MASTER / WORKER SETUP · CI/CD PIPELINE · CODE QUALITY SCAN",
    accentColor: "#f0927f",
    accentBg: "rgba(240,146,127,0.1)",
    steps: [
      ...COMMON_STEPS,
      {
        id: "11",
        title: "Pipeline Script — SonarCloud",
        node: "jenkins",
        code: CODE_P1,
        codeLabel: "JENKINSFILE · SONARCLOUD",
        notes: [
          "agent label 'SPC' — runs on the worker node with label SPC",
          "pollSCM('* * * * *') — checks for changes every minute",
          "stage git checkout — clones the spring-petclinic repo",
          "stage build & scan — runs Maven build + SonarCloud analysis",
          "SONAR credentialsId must match the Secret Text credential ID you created",
          "sonar.projectKey and sonar.organization must match your SonarCloud project",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group (for SSH agent)",
      "SonarCloud project created at sonarcloud.io with correct projectKey & organization",
      "SONAR token added in Jenkins → Credentials as Secret Text with ID: sonar_id",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
    ],
  },
  {
    id: "P2",
    title: "Jenkins Pipeline + SonarCloud + Archive Artifact",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#f0927f" }}>SonarCloud</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#a78bfa" }}>Archive Artifact</span>
      </>
    ),
    subtitle:
      "MASTER / WORKER SETUP · CI/CD PIPELINE · CODE QUALITY SCAN · TEST REPORTS",
    accentColor: "#a78bfa",
    accentBg: "rgba(167,139,250,0.1)",
    steps: [
      ...COMMON_STEPS,
      {
        id: "11",
        title: "Pipeline Script — SonarCloud + Archive Artifact",
        node: "jenkins",
        code: CODE_P2,
        codeLabel: "JENKINSFILE · SONARCLOUD + ARCHIVE",
        notes: [
          "archiveArtifacts '**/target/*.jar' — saves the built JAR; DevOps engineers download it from 'Build Artifacts' in the sidebar",
          "archiveArtifacts 'target/surefire-reports/*.xml' — archives XML test reports alongside the build",
          "junit '**/target/surefire-reports/*.xml' — parses Surefire XML and renders a Test Results graph on the build page",
          "fingerprint: true — Jenkins fingerprints the JAR to trace which build produced which artifact",
          "post { always { ... } } — runs whether build passes or fails so the report is always available",
          "To share with your DevOps engineer: open the build → click 'Build Artifacts' → copy the direct download link",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group (for SSH agent)",
      "SonarCloud project created with correct projectKey & organization",
      "SONAR token added in Jenkins → Credentials as Secret Text with ID: sonar_id",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
      "Surefire plugin in pom.xml so tests generate reports under target/surefire-reports/",
    ],
  },
  {
    id: "P3",
    title: "Jenkins Pipeline + SonarCloud + Archive Artifact + JFrog",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#f0927f" }}>SonarCloud</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#a78bfa" }}>Archive</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#38bdf8" }}>JFrog</span>
      </>
    ),
    subtitle:
      "MASTER / WORKER SETUP · CI/CD PIPELINE · CODE QUALITY SCAN · ARTIFACT MANAGEMENT",
    accentColor: "#38bdf8",
    accentBg: "rgba(56,189,248,0.1)",
    steps: [
      ...COMMON_STEPS,
      {
        id: "11",
        title: "Install Artifactory & JFrog Plugin",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Plugins → Available plugins",
          'Search for "Artifactory" and install the JFrog Artifactory plugin',
          'After install, select "Restart Jenkins when no jobs are running"',
          "Log back into Jenkins after restart",
          "Go to: Manage Jenkins → System → JFrog section",
          "Click 'Add JFrog Platform Instance' — Server ID: Jfrog (must match pipeline serverId exactly)",
          "Enter your JFrog Artifactory URL and add credentials (username + API token)",
          "Click 'Test Connection' to verify, then Save",
        ],
      },
      {
        id: "12",
        title: "Pipeline Script — SonarCloud + Archive + JFrog",
        node: "jenkins",
        code: CODE_P3,
        codeLabel: "JENKINSFILE · SONARCLOUD + ARCHIVE + JFROG",
        notes: [
          "stage 'Artifactory - Jfrog' — uploads the built JAR to your JFrog Artifactory repository",
          "rtUpload serverId: 'Jfrog' — must exactly match the Server ID set in Manage Jenkins → System → JFrog",
          "pattern: 'target/*.jar' — selects the JAR produced by the Maven build",
          "target: 'spcjava-spc/' — the Artifactory repository name and optional folder path",
          "rtPublishBuildInfo — publishes build name, number, and timestamp to Artifactory for full traceability",
          "archiveArtifacts + junit still run in post block — artifacts stored both in Jenkins AND Artifactory",
          "DevOps engineers access the artifact from the JFrog Artifactory UI under the spcjava-spc repository",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group (for SSH agent)",
      "SonarCloud project created with correct projectKey & organization",
      "SONAR token added in Jenkins → Credentials as Secret Text with ID: sonar_id",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
      "Surefire plugin in pom.xml so tests generate under target/surefire-reports/",
      "JFrog Artifactory plugin installed from Jenkins Plugin Manager",
      "JFrog Platform Instance configured: Manage Jenkins → System → JFrog, Server ID = Jfrog",
      "Repository 'spcjava-spc' created in your Artifactory instance before running",
      "JFrog credentials (username + API token) added and Test Connection passes",
    ],
  },

  {
    id: "P4",
    title: "Jenkins Pipeline + Parameters",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#38bdf8" }}>Parameters</span>
      </>
    ),
    subtitle: "MASTER / WORKER SETUP · CI/CD PIPELINE · PARAMETERIZED BUILD",
    accentColor: "#38bdf8",
    accentBg: "rgba(56,189,248,0.1)",
    steps: [
      ...COMMON_STEPS,
      {
        id: "11",
        title: "Install JFrog Plugin", // same as P3 step 11
        node: "jenkins",
        notes: [
          /* copy P3's step 11 notes */
        ],
      },
      {
        id: "12",
        title: "Add Parameter to Pipeline",
        node: "jenkins",
        notes: [
          "Go to your Pipeline item → Configure",
          'Check "This project is parameterised" — Jenkins auto-detects it from Jenkinsfile on first run',
          "Re-run the pipeline once; after that 'Build Now' becomes 'Build with Parameters'",
          "CHOICE parameter lets you pick: package / clean install / verify before each build",
        ],
      },
      {
        id: "13",
        title: "Pipeline Script — Parameters + JFrog",
        node: "jenkins",
        code: CODE_P4,
        codeLabel: "JENKINSFILE · PARAMETERS + JFROG",
        notes: [
          "parameters block declares a choice dropdown shown before each build",
          "params.CHOICE — injects the selected Maven goal into the mvn command",
          "Everything else (Sonar, JFrog, archive) is identical to P3",
        ],
      },
    ],
    checklist: [
      "All P3 checklist items apply here too",
      "Run the pipeline once first — Jenkins reads the parameters block and enables 'Build with Parameters'",
      "After first run, click 'Build with Parameters' and select your Maven goal",
    ],
  },

  {
    id: "P5",
    title: "Jenkins Pipeline — Python Django",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#3fb950" }}>Python Django</span>
      </>
    ),
    subtitle: "MASTER / WORKER SETUP · CI/CD PIPELINE · PYTHON · VENV",
    accentColor: "#3fb950",
    accentBg: "rgba(63,185,80,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 2), // Step 01 & 02 — Create nodes + Master setup
      {
        id: "03",
        title: "Setup Worker Node — Java + Maven + Python venv",
        node: "worker",
        commands: [
          "sudo apt update",
          "sudo apt install openjdk-21-jdk -y",
          "sudo apt install maven -y",
          "sudo apt install python3.12-venv -y",
        ],
      },
      ...COMMON_STEPS.slice(3, 9), // Steps 04–09 — Jenkins UI, password, plugins, admin, node, pipeline item
      {
        id: "10",
        title: "Clone Project & Navigate to Directory",
        node: "worker",
        commands: [
          "git clone https://github.com/maratinikhil/Auth-py-django.git",
          "cd Auth-py-django",
          "# Create Jenkinsfile in the project root",
        ],
      },
      {
        id: "11",
        title: "Pipeline Script — Python Django",
        node: "jenkins",
        code: CODE_P5,
        codeLabel: "JENKINSFILE · PYTHON DJANGO",
        notes: [
          "agent label 'Python-Sample-Project' — worker node label must match exactly",
          "python3 -m venv venv — creates an isolated virtual environment in the workspace",
          ". venv/bin/activate — activates the venv (note the leading dot, not 'source')",
          "pip install -r requirements.txt — installs all Django dependencies inside the venv",
          "pollSCM('* * * * *') — triggers a build every minute if new commits are detected",
          "Make sure python3.12-venv is installed on the worker node before running",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group (for SSH agent)",
      "Java 21 installed on both master and worker nodes",
      "Maven installed on worker node",
      "python3.12-venv installed on worker node",
      "Worker node label set to 'Python-Sample-Project' matching pipeline agent block",
      "Jenkinsfile committed to root of the GitHub repository",
      "requirements.txt exists in the project root",
    ],
  },

  {
    id: "P6",
    title: "Jenkins Pipeline + Docker + ECR",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#2496ed" }}>Docker</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#ff9900" }}>ECR</span>
      </>
    ),
    subtitle: "MASTER / WORKER SETUP · CI/CD PIPELINE · DOCKER · AWS ECR",
    accentColor: "#2496ed",
    accentBg: "rgba(36,150,237,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3), // 01 Create nodes, 02 Master setup, 03 Worker setup
      {
        id: "04",
        title: "Install Docker on Worker Node",
        node: "worker",
        commands: [
          "sudo apt update",
          "sudo apt install docker.io -y",
          "sudo usermod -aG docker ubuntu",
          "sudo usermod -aG docker jenkins",
          "# Configure AWS CLI on worker node",
          "sudo apt install awscli -y",
          "aws configure",
          "# Enter: AWS Access Key, Secret Key, Region (ap-south-1), Output format (json)",
        ],
      },
      ...COMMON_STEPS.slice(3, 10), // 04-09 Jenkins UI steps → now become 05-10
      {
        id: "11",
        title: "Install Docker Plugin in Jenkins",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Plugins → Available plugins",
          "Search 'Docker' and install the Docker plugin",
          "Restart Jenkins after install",
        ],
      },
      {
        id: "12",
        title: "Create ECR Repository in AWS",
        node: "browser",
        notes: [
          "Go to AWS Console → ECR → Create repository",
          "Name it: prod/images (must match the pipeline push target)",
          "Region: ap-south-1",
          "After creation, copy the repository URI: 984912521466.dkr.ecr.ap-south-1.amazonaws.com/prod/images",
        ],
      },
      {
        id: "13",
        title: "Configure Docker Cloud in Jenkins",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Clouds → New Cloud → Docker",
          "Under Docker Agent Templates, click Add",
          "Set Label: spc (must match pipeline agent label exactly)",
          "Give it a Name and configure the Docker image",
          "Click Registry Authentication → Add → Jenkins → Kind: Username & Password",
          "Username: AWS  |  Password: paste ECR login token from aws ecr get-login-password",
          "In Credentials dropdown select the AWS/**** entry you just created",
          "Click Save",
        ],
      },
      {
        id: "14",
        title: "Pipeline Script — Docker + ECR",
        node: "jenkins",
        code: CODE_P6,
        codeLabel: "JENKINSFILE · DOCKER + ECR",
        notes: [
          "agent label 'spc' — must match the Docker agent template label set in Clouds",
          "stage maven — runs mvn package to build the JAR before Docker operations",
          "stage sonar scan — runs SonarCloud analysis same as previous pipelines",
          "docker pull nginx:1.29 — pulls the base image to the worker node",
          "aws ecr get-login-password — authenticates Docker to your ECR registry",
          "docker tag — tags the pulled image with your ECR repository URI",
          "docker push — pushes the tagged image to ECR prod/images repository",
          "AWS CLI must be configured on the worker node (aws configure) before running",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Docker installed on worker node: sudo apt install docker.io -y",
      "Jenkins user added to docker group: sudo usermod -aG docker jenkins",
      "AWS CLI installed and configured on worker node (aws configure)",
      "IAM user has ECR permissions: ecr:GetLoginPassword, ecr:PutImage, ecr:BatchCheckLayerAvailability",
      "ECR repository 'prod/images' created in ap-south-1",
      "Docker plugin installed in Jenkins",
      "Docker Cloud configured in Manage Jenkins → Clouds with label 'spc'",
      "ECR credentials added in Jenkins with ID matching pipeline credentialsId",
      "SonarCloud project created with correct projectKey & organization",
      "SONAR token added as Secret Text with ID: sonar_id",
    ],
  },
  {
    id: "P7",
    title: "Jenkins Pipeline + Dockerfile + ECR + Trivy + K8S",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#2496ed" }}>Dockerfile</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#ff9900" }}>ECR</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#e85d4a" }}>Trivy</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#326ce5" }}>K8S</span>
      </>
    ),
    subtitle: "DOCKER BUILD · TRIVY SCAN · ECR PUSH · KUBERNETES DEPLOY",
    accentColor: "#326ce5",
    accentBg: "rgba(50,108,229,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      {
        id: "04",
        title: "Install Docker + Trivy + kubectl on Worker Node",
        node: "worker",
        commands: [
          "# Docker",
          "sudo apt update && sudo apt install docker.io -y",
          "sudo usermod -aG docker ubuntu",
          "sudo usermod -aG docker jenkins",
          "# AWS CLI",
          "sudo apt install awscli -y",
          "aws configure",
          "# Trivy",
          "sudo apt install wget apt-transport-https gnupg -y",
          "wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -",
          'echo "deb https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee /etc/apt/sources.list.d/trivy.list',
          "sudo apt update && sudo apt install trivy -y",
          "# kubectl",
          "sudo snap install kubectl --classic",
          "aws eks update-kubeconfig --region ap-south-1 --name <your-cluster-name>",
        ],
      },
      ...COMMON_STEPS.slice(3, 10),
      {
        id: "11",
        title: "Install Docker Plugin in Jenkins",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Plugins → Available plugins",
          "Search 'Docker' and install the Docker plugin",
          "Restart Jenkins after install",
          "Configure Docker Cloud: Manage Jenkins → Clouds → New Cloud → Docker",
          "Set label: SPC-JAVA (must match pipeline agent label exactly)",
        ],
      },
      {
        id: "12",
        title: "Create ECR Repository in AWS",
        node: "browser",
        notes: [
          "Go to AWS Console → ECR → Create repository",
          "Name it: spc/image (must match the pipeline push target)",
          "Region: ap-south-1",
          "Repository URI: 984912521466.dkr.ecr.ap-south-1.amazonaws.com/spc/image",
          "IAM user must have: ecr:GetLoginPassword, ecr:PutImage, ecr:BatchCheckLayerAvailability",
        ],
      },
      {
        id: "13",
        title: "Create deploy-k8s/ folder with YAML files",
        node: "worker",
        notes: [
          "Create folder deploy-k8s/ in the root of your project repository",
          "Add dp.yaml (Pod definition) and svc.yaml (Service definition) shown below",
          "Commit and push both files to GitHub before running the pipeline",
          "kubectl apply -f deploy-k8s/. applies all YAMLs in that folder",
        ],
      },
      {
        id: "14",
        title: "deploy-k8s/dp.yaml — Pod Definition",
        node: "worker",
        code: CODE_K8S_DP,
        codeLabel: "KUBERNETES · POD MANIFEST",
        notes: [
          "image pulls from ECR — worker node must be authenticated via aws configure",
          "containerPort: 8080 — matches Spring PetClinic default port",
          "label app: spc — must match the selector in svc.yaml",
        ],
      },
      {
        id: "15",
        title: "deploy-k8s/svc.yaml — Service Definition",
        node: "worker",
        code: CODE_K8S_SVC,
        codeLabel: "KUBERNETES · SERVICE MANIFEST",
        notes: [
          "type: NodePort — exposes the app on worker node's public IP",
          "nodePort: 32000 — access the app at http://<WorkerNode-IP>:32000",
          "selector app: spc — must match the label in dp.yaml",
          "Make sure port 32000 is open in the worker node Security Group",
        ],
      },
      {
        id: "16",
        title: "Pipeline Script — Dockerfile + Trivy + ECR + K8S",
        node: "jenkins",
        code: CODE_P7,
        codeLabel: "JENKINSFILE · DOCKER + TRIVY + ECR + K8S",
        notes: [
          "environment block — image_name and tag_name reused across all docker stages",
          "stage docker image — builds image from Dockerfile in project root using mvn-built JAR",
          "stage trivy scan — scans the built image for CVEs before pushing; build continues even if vulnerabilities found",
          "stage image push to ECR — authenticates, tags, and pushes image to ECR spc/image repo",
          "stage deploy K8S — runs kubectl apply on all YAMLs inside deploy-k8s/ folder",
          "Dockerfile must exist in the root of the repository alongside Jenkinsfile",
          "Worker node must have kubectl configured: aws eks update-kubeconfig --region ap-south-1 --name <cluster>",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Port 32000 open on Worker Node Security Group (NodePort access)",
      "Docker installed on worker + jenkins user added to docker group",
      "Trivy installed on worker node",
      "kubectl installed and kubeconfig set up on worker node",
      "AWS CLI installed and configured on worker node (aws configure)",
      "IAM user has ECR + EKS permissions",
      "ECR repository 'spc/image' created in ap-south-1",
      "Docker plugin installed in Jenkins, Cloud label set to 'SPC-JAVA'",
      "SonarCloud project created with correct projectKey & organization",
      "SONAR token added as Secret Text with ID: sonar_id",
      "Dockerfile exists in the root of the GitHub repository",
      "deploy-k8s/dp.yaml and deploy-k8s/svc.yaml committed to the repository",
      "EKS cluster running and reachable from the worker node",
    ],
  },

  {
    id: "P8",
    title: "Jenkins Pipeline + Trivy XML Report + ECR + K8S",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#e85d4a" }}>Trivy XML</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#ff9900" }}>ECR</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#326ce5" }}>K8S</span>
      </>
    ),
    subtitle: "TRIVY VULNERABILITY REPORT · XML FORMAT · ECR PUSH · K8S DEPLOY",
    accentColor: "#e85d4a",
    accentBg: "rgba(232,93,74,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      {
        id: "04",
        title: "Install Docker + Trivy + kubectl on Worker Node",
        node: "worker",
        commands: [
          "# Docker",
          "sudo apt update && sudo apt install docker.io -y",
          "sudo usermod -aG docker ubuntu",
          "sudo usermod -aG docker jenkins",
          "# AWS CLI",
          "sudo apt install awscli -y",
          "aws configure",
          "# Trivy",
          "sudo apt install wget apt-transport-https gnupg -y",
          "wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -",
          'echo "deb https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee /etc/apt/sources.list.d/trivy.list',
          "sudo apt update && sudo apt install trivy -y",
          "# kubectl",
          "sudo snap install kubectl --classic",
          "aws eks update-kubeconfig --region ap-south-1 --name <your-cluster-name>",
        ],
      },
      ...COMMON_STEPS.slice(3, 10),
      {
        id: "11",
        title: "Install Docker + JUnit Plugins in Jenkins",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Plugins → Available plugins",
          "Install: Docker plugin",
          "Install: JUnit plugin (needed to render trivy-report.xml as a test report)",
          "Restart Jenkins after both installs",
          "Configure Docker Cloud: Manage Jenkins → Clouds → New Cloud → Docker",
          "Set label: SPC-JAVA (must match pipeline agent label exactly)",
        ],
      },
      {
        id: "12",
        title: "Create Both ECR Repositories in AWS",
        node: "browser",
        notes: [
          "Repository 1 — prod/images (for nginx base image push)",
          "Repository 2 — spc/image (for custom built image push)",
          "Both in region: ap-south-1",
          "IAM user must have: ecr:GetLoginPassword, ecr:PutImage, ecr:BatchCheckLayerAvailability",
        ],
      },
      {
        id: "13",
        title: "How Trivy XML Report Works",
        node: "jenkins",
        notes: [
          "curl downloads the junit.tpl template from Trivy's official GitHub repo",
          "--format template --template '@junit.tpl' converts Trivy output into JUnit XML format",
          "-o trivy-report.xml saves the report file in the Jenkins workspace",
          "--scanners vuln scans only vulnerabilities (skips secrets/misconfigs)",
          "--severity UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL includes all severity levels",
          "post { always { junit ... } } parses the XML and shows a Vulnerability Trend graph on the build page",
          "archiveArtifacts saves trivy-report.xml so it can be downloaded from Build Artifacts",
          "allowEmptyResults: true prevents build failure if no vulnerabilities are found",
        ],
      },
      {
        id: "14",
        title: "Pipeline Script — Trivy XML + ECR + K8S",
        node: "jenkins",
        code: CODE_P8,
        codeLabel: "JENKINSFILE · TRIVY XML + ECR + K8S",
        notes: [
          "stage docker push to ECR — pushes nginx:1.29 base image to prod/images repo",
          "stage docker image — builds custom app image from Dockerfile using built JAR",
          "stage trivy report — scans image, outputs JUnit XML; build continues regardless of findings",
          "stage image push to ECR — pushes custom image to spc/image repo",
          "stage deploy K8S — applies all YAMLs in deploy-k8s/ folder to your EKS cluster",
          "post always block — archives XML + renders vulnerability report on Jenkins build page",
          "To view report: open the build → click 'Test Results' in the sidebar",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Port 32000 open on Worker Node Security Group (NodePort access)",
      "Docker installed on worker + jenkins user added to docker group",
      "Trivy installed on worker node",
      "kubectl installed and kubeconfig configured on worker node",
      "AWS CLI installed and configured on worker node",
      "IAM user has ECR + EKS permissions",
      "ECR repository 'prod/images' created in ap-south-1",
      "ECR repository 'spc/image' created in ap-south-1",
      "Docker plugin installed in Jenkins, Cloud label set to 'SPC-JAVA'",
      "JUnit plugin installed in Jenkins (for XML report rendering)",
      "SonarCloud project created with correct projectKey & organization",
      "SONAR token added as Secret Text with ID: sonar_id",
      "Dockerfile exists in the root of the GitHub repository",
      "deploy-k8s/dp.yaml and deploy-k8s/svc.yaml committed to the repository",
      "EKS cluster running and reachable from the worker node",
    ],
  },
  {
    id: "P9",
    title: "Jenkins Pipeline + Quality Gate + Trivy XML + ECR",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#f0927f" }}>Quality Gate</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#e85d4a" }}>Trivy XML</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#ff9900" }}>ECR</span>
      </>
    ),
    subtitle: "SONAR QUALITY GATE · CONDITIONAL STOP · TRIVY XML · ECR PUSH",
    accentColor: "#f0927f",
    accentBg: "rgba(240,146,127,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      {
        id: "04",
        title: "Install Docker + Trivy on Worker Node",
        node: "worker",
        commands: [
          "# Docker",
          "sudo apt update && sudo apt install docker.io -y",
          "sudo usermod -aG docker ubuntu",
          "sudo usermod -aG docker jenkins",
          "# AWS CLI",
          "sudo apt install awscli -y",
          "aws configure",
          "# Trivy",
          "sudo apt install wget apt-transport-https gnupg -y",
          "wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -",
          'echo "deb https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee /etc/apt/sources.list.d/trivy.list',
          "sudo apt update && sudo apt install trivy -y",
        ],
      },
      ...COMMON_STEPS.slice(3, 10),
      {
        id: "11",
        title: "Install Docker + JUnit Plugins in Jenkins",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Plugins → Available plugins",
          "Install: Docker plugin",
          "Install: JUnit plugin (renders trivy-report.xml as a test/vulnerability report)",
          "Restart Jenkins after both installs",
          "Configure Docker Cloud: Manage Jenkins → Clouds → New Cloud → Docker",
          "Set label: SPC (must match pipeline agent label exactly)",
        ],
      },
      {
        id: "12",
        title: "Enable SonarCloud Webhook for Quality Gate",
        node: "browser",
        notes: [
          "Go to SonarCloud → Your Project → Administration → Webhooks",
          "Click Create — Name: Jenkins",
          "URL: http://<MasterNode-Public-IP>:8080/sonarqube-webhook/",
          "Leave Secret blank, click Create",
          "This webhook is what sends the Quality Gate result back to Jenkins",
          "Without it, waitForQualityGate() will hang until the 1-minute timeout",
          "Credential ID changed to SONAR_ID in this pipeline — update Jenkins credential ID accordingly",
        ],
      },
      {
        id: "13",
        title: "How Quality Gate Condition Works",
        node: "jenkins",
        notes: [
          "waitForQualityGate() pauses the pipeline and waits for SonarCloud webhook callback",
          "timeout(time: 1, unit: 'MINUTES') — fails the stage if no callback received within 1 minute",
          "qg.status != 'OK' — stops the entire pipeline with error() if code quality fails",
          "qg.status == 'OK' — pipeline continues to Docker and ECR stages",
          "Quality Gate rules are configured in SonarCloud: coverage %, duplications, bugs, vulnerabilities",
          "K8S deploy stage is commented out — uncomment when cluster is ready",
        ],
      },
      {
        id: "14",
        title: "Pipeline Script — Quality Gate + Trivy XML + ECR",
        node: "jenkins",
        code: CODE_P9,
        codeLabel: "JENKINSFILE · QUALITY GATE + TRIVY XML + ECR",
        notes: [
          "credentialsId changed to 'SONAR_ID' (uppercase) — must match exactly in Jenkins credentials",
          "stage Quality Gate — conditionally blocks pipeline if SonarCloud analysis fails",
          "stage docker push to ECR — only runs if Quality Gate passes",
          "stage trivy report — scans built image, outputs JUnit XML for Jenkins to render",
          "stage image push to ECR — pushes to spc/image repo after trivy scan",
          "deploy K8S stage is commented out — remove // to re-enable when needed",
          "post always — archives trivy-report.xml and renders Vulnerability Trend graph",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Docker installed on worker + jenkins user added to docker group",
      "Trivy installed on worker node",
      "AWS CLI installed and configured on worker node",
      "IAM user has ECR permissions",
      "ECR repository 'prod/images' created in ap-south-1",
      "ECR repository 'spc/image' created in ap-south-1",
      "Docker plugin installed in Jenkins, Cloud label set to 'SPC'",
      "JUnit plugin installed in Jenkins",
      "SonarCloud project created with correct projectKey & organization",
      "SonarCloud Webhook created pointing to http://<Master-IP>:8080/sonarqube-webhook/",
      "SONAR token added as Secret Text with ID: SONAR_ID (uppercase — different from previous pipelines)",
      "Quality Gate rules configured in SonarCloud project settings",
      "Dockerfile exists in the root of the GitHub repository",
    ],
  },
  {
    id: "P10",
    title: "Jenkins Pipeline + eksctl + Quality Gate + Trivy XML + EKS Deploy",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#ff9900" }}>eksctl</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#f0927f" }}>Quality Gate</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#326ce5" }}>EKS Deploy</span>
      </>
    ),
    subtitle:
      "EKSCTL CLUSTER · KUBECONFIG SECRET · QUALITY GATE · TRIVY XML · EKS",
    accentColor: "#ff9900",
    accentBg: "rgba(255,153,0,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      {
        id: "04",
        title: "Install AWS CLI + eksctl on Worker Node",
        node: "worker",
        commands: [
          "# AWS CLI",
          "sudo apt update && sudo apt install awscli -y",
          "aws configure",
          "# eksctl — detect platform and download",
          "ARCH=amd64",
          "PLATFORM=$(uname -s)_$ARCH",
          'curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"',
          "# Verify checksum (optional)",
          'curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check',
          "tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz",
          "sudo install -m 0755 /tmp/eksctl /usr/local/bin && rm /tmp/eksctl",
          "eksctl version",
        ],
      },
      {
        id: "05",
        title: "Install kubectl on Worker Node",
        node: "worker",
        commands: [
          'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"',
          'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"',
          "sudo chmod +x kubectl",
          "sudo mv kubectl /usr/local/bin",
          "kubectl version --client",
        ],
      },
      {
        id: "06",
        title: "Install Docker + Trivy on Worker Node",
        node: "worker",
        commands: [
          "sudo apt install docker.io -y",
          "sudo usermod -aG docker ubuntu",
          "sudo usermod -aG docker jenkins",
          "# Trivy",
          "sudo apt install wget apt-transport-https gnupg -y",
          "wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -",
          'echo "deb https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee /etc/apt/sources.list.d/trivy.list',
          "sudo apt update && sudo apt install trivy -y",
        ],
      },
      ...COMMON_STEPS.slice(3, 10),
      {
        id: "13",
        title: "Create EKS Cluster",
        node: "worker",
        commands: [
          "eksctl create cluster --name mycluster --region ap-south-1 --nodes 2 --node-type c7i-flex.large",
          "# Takes ~15 minutes — wait until it completes",
          "kubectl get no",
          "# Both nodes should show STATUS: Ready",
        ],
      },
      {
        id: "14",
        title: "Copy kubeconfig & Add as Jenkins Secret File",
        node: "worker",
        commands: [
          "# Confirm kubeconfig exists",
          "ls -al ~/.kube",
          "# View the config file",
          "cat ~/.kube/config",
          "# Copy the entire output and save it locally as a file e.g. eks-config.txt",
        ],
      },
      {
        id: "15",
        title: "Add kubeconfig as Secret File in Jenkins",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → Credentials → Global → Add Credentials",
          "Kind: Secret file",
          "Upload the eks-config.txt file you copied from ~/.kube/config",
          "ID: myeks (must match credentialsId in pipeline exactly)",
          "Click Create",
          "The pipeline uses withCredentials([file(credentialsId: 'myeks', variable: 'KUBECONFIG')]) to inject this file at runtime",
        ],
      },
      {
        id: "16",
        title: "Enable SonarCloud Webhook for Quality Gate",
        node: "browser",
        notes: [
          "Go to SonarCloud → Your Project → Administration → Webhooks → Create",
          "Name: Jenkins",
          "URL: http://<MasterNode-Public-IP>:8080/sonarqube-webhook/",
          "Leave Secret blank → Create",
          "Without this webhook, waitForQualityGate() will hang until timeout",
        ],
      },
      {
        id: "17",
        title: "Verify Deployment After Pipeline Runs",
        node: "worker",
        commands: [
          "kubectl get po",
          "# Pods should show STATUS: Running",
          "kubectl get svc",
          "# Note the NodePort (32000) assigned to svc-spc",
          "# Access the app at: http://<WorkerNode-Public-IP>:32000",
        ],
      },
      {
        id: "18",
        title: "Pipeline Script — eksctl + Quality Gate + Trivy XML + EKS",
        node: "jenkins",
        code: CODE_P10,
        codeLabel: "JENKINSFILE · EKSCTL + QUALITY GATE + TRIVY + EKS",
        notes: [
          "agent label 'SPC' — worker node must have eksctl, kubectl, docker, trivy, aws cli installed",
          "stage Quality Gate — pipeline stops here if SonarCloud analysis fails",
          "stage docker push to ECR — pushes nginx base image to prod/images repo",
          "stage docker image — builds custom app image from Dockerfile",
          "stage trivy report — scans image and outputs JUnit XML vulnerability report",
          "stage image push to ECR — pushes custom image to spc/image repo",
          "stage Deploy K8S — injects kubeconfig from Jenkins secret file via KUBECONFIG env var",
          "kubectl apply -f deploy-k8s/. — deploys all YAMLs in deploy-k8s/ to EKS cluster",
          "post always — archives trivy-report.xml and renders Vulnerability Trend graph in Jenkins",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Port 32000 open on EKS Worker Node Security Group (NodePort access)",
      "AWS CLI installed and configured on worker node",
      "eksctl installed on worker node",
      "kubectl installed on worker node",
      "Docker installed + jenkins user added to docker group",
      "Trivy installed on worker node",
      "IAM user has EKS + ECR + EC2 permissions for eksctl cluster creation",
      "EKS cluster created: eksctl create cluster --name mycluster --region ap-south-1",
      "kubectl get no shows both nodes in Ready state",
      "~/.kube/config copied and uploaded to Jenkins as Secret File with ID: myeks",
      "ECR repository 'prod/images' created in ap-south-1",
      "ECR repository 'spc/image' created in ap-south-1",
      "Docker + JUnit plugins installed in Jenkins",
      "Docker Cloud configured in Jenkins with label 'SPC'",
      "SonarCloud Webhook created pointing to http://<Master-IP>:8080/sonarqube-webhook/",
      "SONAR token added as Secret Text with ID: SONAR_ID",
      "deploy-k8s/dp.yaml and deploy-k8s/svc.yaml committed to repository",
      "Dockerfile exists in the root of the GitHub repository",
    ],
  },

  {
    id: "P11",
    title: "Jenkins Pipeline + Shared Library (Same Repo)",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#a3e635" }}>Shared Library</span>{" "}
        <span style={{ color: "rgba(163,230,53,0.55)", fontSize: 13 }}>
          (Within Same Repo)
        </span>
      </>
    ),
    subtitle: "SHARED LIBRARY · VARS · REUSABLE GROOVY STEPS · SAME REPO",
    accentColor: "#a3e635",
    accentBg: "rgba(163,230,53,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      ...COMMON_STEPS.slice(3, 9),
      {
        id: "10",
        title: "Create Shared Library Directory Structure",
        node: "worker",
        commands: [
          "# Inside your project repo root",
          "mkdir -p my-shared-library/vars",
          "mkdir -p my-shared-library/src",
          "mkdir -p my-shared-library/resources",
          "# Create the reusable build step",
          "touch my-shared-library/vars/build.groovy",
          "# Commit and push to GitHub",
          "git add . && git commit -m 'add shared library' && git push",
        ],
      },
      {
        id: "11",
        title: "Write the Shared Library Groovy File",
        node: "worker",
        code: CODE_SHARED_LIB_BUILD,
        codeLabel: "my-shared-library/vars/build.groovy",
        notes: [
          "def call() — the entry point Jenkins invokes when buildScript() is called",
          "sh 'mvn package' — the reusable step; replace or extend with any shell commands",
          "return this — required so the load() call in Jenkinsfile gets a reference to this script object",
          "You can add more functions (e.g. def sonarScan(), def dockerBuild()) in the same file or separate .groovy files under vars/",
        ],
      },
      {
        id: "12",
        title: "Configure Global Trusted Pipeline Libraries",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → System → scroll to Global Trusted Pipeline Libraries",
          "Click Add — Name: shared-library (this is the @Library name if used globally)",
          "Default version: main (your default branch)",
          "Retrieval method: Modern SCM → Git",
          "Project Repository: https://github.com/Mygit-personal/spring-petclinic.git",
          "Credentials: add if repo is private; leave blank for public repos",
          "Click Save",
          "Note: Since the library lives in the same repo, the pipeline uses load() instead of @Library — no annotation needed in the Jenkinsfile",
        ],
      },
      {
        id: "13",
        title: "Pipeline Script — Shared Library via load()",
        node: "jenkins",
        code: CODE_P11,
        codeLabel: "JENKINSFILE · SHARED LIBRARY",
        notes: [
          "load 'my-shared-library/vars/build.groovy' — loads the Groovy file from the same repo checkout",
          "buildScript() — calls the def call() function defined in build.groovy",
          "No @Library annotation needed — load() works within the same repository",
          "script { } block is required to use the load() method inside a declarative pipeline",
          "Extend this pattern: create sonar.groovy, docker.groovy etc. under vars/ and load each one in its own stage",
          "This keeps your Jenkinsfile clean while all logic lives in the shared library files",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group (for SSH agent)",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "my-shared-library/vars/build.groovy created and committed to the repo root",
      "build.groovy contains def call() { ... } and ends with return this",
      "Global Trusted Pipeline Libraries configured in Manage Jenkins → System",
      "Library name, repo URL, and branch set correctly in Jenkins system config",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
      "Jenkinsfile committed to root of the GitHub repository",
      "Pipeline item configured: Pipeline script from SCM → Git → branch: main",
    ],
  },

  {
    id: "P12",
    title: "Jenkins Pipeline + Shared Library (vars at Project Level)",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#fb923c" }}>Shared Library</span>{" "}
        <span style={{ color: "rgba(251,146,60,0.55)", fontSize: 13 }}>
          (vars at Project Level)
        </span>
      </>
    ),
    subtitle:
      "SHARED LIBRARY · @LIBRARY ANNOTATION · VARS IN PROJECT ROOT · SAME REPO",
    accentColor: "#fb923c",
    accentBg: "rgba(251,146,60,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      ...COMMON_STEPS.slice(3, 9),
      {
        id: "10",
        title: "Create vars/ Directory at Project Root",
        node: "worker",
        commands: [
          "# Inside your project repo root (no separate shared-library folder)",
          "mkdir -p vars",
          "touch vars/build1.groovy",
          "# Your repo structure should look like:",
          "# spring-petclinic/",
          "#   vars/",
          "#     build1.groovy",
          "#   Jenkinsfile",
          "#   pom.xml",
          "#   src/",
          "git add . && git commit -m 'add vars/build1.groovy' && git push",
        ],
      },
      {
        id: "11",
        title: "Write vars/build1.groovy",
        node: "worker",
        code: CODE_SHARED_LIB_BUILD2,
        codeLabel: "vars/build1.groovy",
        notes: [
          "def call() — Jenkins automatically maps the filename to the function name",
          "build1.groovy → build1() — the function name in Jenkinsfile must match the filename exactly",
          "No return this needed here — unlike load(), @Library imports resolve automatically",
          "Keep this file at the project root under vars/ — not inside any subfolder",
          "You can create more files: vars/sonarScan.groovy → sonarScan(), vars/dockerBuild.groovy → dockerBuild()",
        ],
      },
      {
        id: "12",
        title: "Configure Global Trusted Pipeline Libraries",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → System → Global Trusted Pipeline Libraries",
          "Click Add",
          "Name: shared-lb (must match exactly what's in @Library('shared-lb@main'))",
          "Default version: main",
          "Retrieval method: Modern SCM → Git",
          "Project Repository: https://github.com/Mygit-personal/spring-petclinic.git",
          "Credentials: add if repo is private; leave blank for public repos",
          "Click Save",
          "The @Library annotation tells Jenkins to load the vars/ folder from this repo at the specified branch",
        ],
      },
      {
        id: "13",
        title: "Pipeline Script — @Library Annotation",
        node: "jenkins",
        code: CODE_P12,
        codeLabel: "JENKINSFILE · @LIBRARY ANNOTATION",
        notes: [
          "@Library('shared-lb@main') _ — loads the shared library named 'shared-lb' from the 'main' branch",
          "The trailing underscore _ is required when no import statement follows — it's a Groovy syntax placeholder",
          "build1() — directly calls the def call() from vars/build1.groovy; no script{} or load() needed",
          "This is cleaner than load() — the function is available globally throughout the entire pipeline",
          "shared-lb must match the Library Name set in Manage Jenkins → System → Global Trusted Pipeline Libraries",
          "Difference from P11: P11 used load() for same-repo subfolder; P12 uses @Library with vars/ at project root",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "vars/ directory created at the project root (not inside a subfolder)",
      "vars/build1.groovy created with def call() { sh 'mvn package' }",
      "vars/build1.groovy committed and pushed to the main branch",
      "Global Trusted Pipeline Libraries configured: Manage Jenkins → System",
      "Library Name set to 'shared-lb' — must match @Library('shared-lb@main') exactly",
      "Repo URL and branch (main) set correctly in the library config",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
      "Jenkinsfile with @Library annotation committed to repo root",
      "Pipeline item configured: Pipeline script from SCM → Git → branch: main",
    ],
  },

  {
    id: "P13",
    title: "Jenkins Pipeline + Shared Library (Separate Repo)",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#e879f9" }}>Shared Library</span>{" "}
        <span style={{ color: "rgba(232,121,249,0.55)", fontSize: 13 }}>
          (Separate Repo)
        </span>
      </>
    ),
    subtitle:
      "SHARED LIBRARY · SEPARATE REPO · @LIBRARY ANNOTATION · CROSS-REPO REUSE",
    accentColor: "#e879f9",
    accentBg: "rgba(232,121,249,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      ...COMMON_STEPS.slice(3, 9),
      {
        id: "10",
        title: "Create a New Shared Library Repository on GitHub",
        node: "browser",
        notes: [
          "Go to GitHub → New Repository",
          "Name it: shared-library (or any name — this is a dedicated library repo)",
          "Initialize with a README, set branch to main",
          "This repo will ONLY contain shared pipeline logic — no application code",
          "The structure inside must follow Jenkins convention: vars/ at the root level",
          "Any project repo (spring-petclinic, django-app etc.) can import from this single shared repo",
        ],
      },
      {
        id: "11",
        title: "Create vars/mybuild.groovy in the Shared Library Repo",
        node: "worker",
        commands: [
          "# Clone your new shared library repo",
          "git clone https://github.com/Mygit-personal/shared-library.git",
          "cd shared-library",
          "mkdir -p vars",
          "touch vars/mybuild.groovy",
          "# Add the groovy content, then commit and push",
          "git add . && git commit -m 'add mybuild step' && git push",
          "# Repo structure:",
          "# shared-library/",
          "#   vars/",
          "#     mybuild.groovy",
        ],
      },
      {
        id: "12",
        title: "Write vars/mybuild.groovy",
        node: "worker",
        code: CODE_SHARED_LIB_EXTERNAL,
        codeLabel: "shared-library/vars/mybuild.groovy",
        notes: [
          "def build() — named function (not def call()); called as mybuild.build() in the Jenkinsfile",
          "Difference from P12: P12 used def call() → build1(); here def build() → mybuild.build()",
          "def call() is implicit (filename = function name); def build() is explicit (filename.functionname)",
          "You can add multiple functions in the same file: def test(), def sonar(), def deploy()",
          "All functions in mybuild.groovy are available as mybuild.test(), mybuild.sonar() etc.",
          "Commit this file to the shared-library repo — NOT to the spring-petclinic repo",
        ],
      },
      {
        id: "13",
        title: "Configure Global Trusted Pipeline Libraries",
        node: "jenkins",
        notes: [
          "Go to: Dashboard → Manage Jenkins → System → Global Trusted Pipeline Libraries",
          "Click Add",
          "Name: shared-lb-1 (must match exactly what's in @Library('shared-lb-1@main'))",
          "Default version: main",
          "Retrieval method: Modern SCM → Git",
          "Project Repository: https://github.com/Mygit-personal/shared-library.git  ← the LIBRARY repo, not the app repo",
          "Credentials: add if repo is private; leave blank for public repos",
          "Click Save",
          "Key difference from P12: the repo URL here points to the dedicated shared-library repo, not the project repo",
        ],
      },
      {
        id: "14",
        title: "Pipeline Script — Shared Library from Separate Repo",
        node: "jenkins",
        code: CODE_P13,
        codeLabel: "JENKINSFILE · SEPARATE REPO SHARED LIBRARY",
        notes: [
          "@Library('shared-lb-1@main') _ — loads from the shared-library repo configured in Jenkins system",
          "shared-lb-1 must match the Name set in Global Trusted Pipeline Libraries exactly",
          "@main pins to the main branch — change to a tag or commit SHA for version locking",
          "mybuild.build() — calls def build() from vars/mybuild.groovy in the shared-library repo",
          "The spring-petclinic repo has NO vars/ folder — all logic lives in the separate shared-library repo",
          "Any other project can reuse this: just add @Library('shared-lb-1@main') _ to their Jenkinsfile",
          "This is the recommended pattern for organizations with multiple project repos sharing common CI/CD logic",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "Separate GitHub repo created for shared library (e.g. shared-library)",
      "vars/mybuild.groovy created in the shared-library repo with def build() { sh 'mvn package' }",
      "vars/mybuild.groovy committed and pushed to main branch of the shared-library repo",
      "Global Trusted Pipeline Libraries configured: Manage Jenkins → System",
      "Library Name set to 'shared-lb-1' — must match @Library('shared-lb-1@main') exactly",
      "Repo URL in library config points to shared-library repo (NOT the app repo)",
      "Branch set to main in library config",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
      "Jenkinsfile with @Library annotation committed to root of spring-petclinic repo",
      "Pipeline item configured: Pipeline script from SCM → Git → branch: main",
    ],
  },
  {
    id: "P14",
    title: "Jenkins Pipeline + Parallelism + when{} Conditions",
    titleAccents: (
      <>
        Jenkins Pipeline <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#34d399" }}>Parallelism</span>{" "}
        <span style={{ color: "#d24939" }}>+</span>{" "}
        <span style={{ color: "#fbbf24" }}>when{"{}"} Conditions</span>
      </>
    ),
    subtitle:
      "PARALLEL EXECUTION · CONDITIONAL STAGES · WHEN EXPRESSION · DOCKER BUILD",
    accentColor: "#34d399",
    accentBg: "rgba(52,211,153,0.1)",
    steps: [
      ...COMMON_STEPS.slice(0, 3),
      {
        id: "04",
        title: "Install Docker on Worker Node",
        node: "worker",
        commands: [
          "sudo apt update && sudo apt install docker.io -y",
          "sudo usermod -aG docker ubuntu",
          "sudo usermod -aG docker jenkins",
          "sudo systemctl restart jenkins",
        ],
      },
      ...COMMON_STEPS.slice(3, 10),
      {
        id: "11",
        title: "What is Parallelism in Jenkins",
        node: "jenkins",
        notes: [
          "Parallelism means running multiple stages or steps simultaneously instead of one after another",
          "Reduces total pipeline execution time — e.g. sonar scan and docker build can run at the same time",
          "Defined using parallel { } block inside a stage, or by using when { } to control stage execution flow",
          "This pipeline uses when { expression { } } — a conditional guard that skips a stage if a prior stage failed",
          "currentBuild.currentResult == null — true at the very start before any stage has run",
          "currentBuild.currentResult == 'SUCCESS' — true as long as all previous stages passed",
          "If maven stage fails → currentResult becomes FAILURE → sonar scan stage is automatically skipped",
          "This avoids wasting time running downstream stages when an upstream stage has already broken the build",
        ],
      },
      {
        id: "12",
        title: "How when{} Expression Works",
        node: "jenkins",
        notes: [
          "when { expression { ... } } — evaluates a Groovy expression; stage runs only if it returns true",
          "currentBuild.currentResult == null — the result is null before any stage sets it; this covers the first stage",
          "|| currentBuild.currentResult == 'SUCCESS' — allows the stage to run if everything so far has passed",
          "Place when { } block inside any stage you want to conditionally guard",
          "Stages without when { } always run regardless of prior results (e.g. git checkout, docker image)",
          "Other when conditions: when { branch 'main' }, when { environment name: 'ENV', value: 'prod' }, when { not { branch 'main' } }",
          "when { } is evaluated before the stage's agent and steps — so skipped stages don't consume executor time",
        ],
      },
      {
        id: "13",
        title: "Pipeline Script — Parallelism + when{} Conditions",
        node: "jenkins",
        code: CODE_P14,
        codeLabel: "JENKINSFILE · PARALLELISM + WHEN CONDITIONS",
        notes: [
          "stage maven — guarded by when { expression }; skipped if any prior stage failed",
          "stage sonar scan — also guarded; only runs if maven stage succeeded",
          "stage docker image — no when { } guard; always runs even if sonar fails",
          "environment block — image_name and tag_name available as env vars across all stages",
          "pollSCM('* * * * *') — triggers pipeline every minute on new commits",
          "This pattern prevents cascading failures: a broken build won't waste time on sonar or docker",
          "To make maven and sonar run in parallel: wrap both inside a parallel { } block in a single stage",
        ],
      },
    ],
    checklist: [
      "Port 8080 open on Master Node Security Group",
      "Port 22 open on Worker Node Security Group",
      "Worker node label set to 'SPC' matching pipeline agent block",
      "Docker installed on worker node: sudo apt install docker.io -y",
      "Jenkins user added to docker group: sudo usermod -aG docker jenkins",
      "Maven installed on Worker Node or via Jenkins Global Tool Configuration",
      "SonarCloud project created with correct projectKey & organization",
      "SONAR token added as Secret Text with ID: SONAR_ID (uppercase)",
      "SonarQube Scanner plugin installed in Jenkins",
      "SonarQube server configured: Manage Jenkins → System → SonarQube servers → Name: SONAR",
      "Dockerfile exists in the root of the GitHub repository",
      "Jenkinsfile committed to root of the GitHub repository",
      "Pipeline item configured: Pipeline script from SCM → Git → branch: main",
    ],
  },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────
const makeTokens = (isDark: boolean) => ({
  pageBg: isDark ? "#080c10" : "#f4f6f8",
  gridLine: isDark ? "rgba(210,73,57,0.03)" : "rgba(210,73,57,0.06)",
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
  numBg: isDark ? "rgba(210,73,57,0.15)" : "rgba(210,73,57,0.1)",
  numBorder: isDark ? "#d2493940" : "rgba(210,73,57,0.3)",
  copyBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
  copyColor: isDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
  checklistBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
  checklistBdr: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
  stripBg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
  stripBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
  colBgOn: isDark ? "rgba(210,73,57,0.08)" : "rgba(210,73,57,0.07)",
  colBdrOn: isDark ? "rgba(210,73,57,0.3)" : "rgba(210,73,57,0.35)",
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
        {/* Step number */}
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

        {/* Node badge */}
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
          {/* Terminal commands */}
          {step.commands && (
            <div
              style={{
                background: t.termBg,
                border: `1px solid rgba(210,73,57,0.25)`,
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
                    color: "#d24939",
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
                            color: "#d24939",
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

          {/* Code block */}
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
                  {step.codeLabel || "JENKINSFILE · GROOVY"}
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
                  const isKw = [
                    "pipeline",
                    "agent",
                    "triggers",
                    "stages",
                    "stage",
                    "post",
                    "always",
                    "success",
                    "failure",
                  ].some((k) => tr.startsWith(k));
                  const isAction = [
                    "steps",
                    "sh ",
                    "rtUpload",
                    "rtPublishBuildInfo",
                    "archiveArtifacts",
                    "junit",
                    "echo",
                    "git ",
                    "withCredentials",
                    "withSonarQubeEnv",
                  ].some((k) => tr.startsWith(k));
                  const isStr =
                    !isKw &&
                    !isAction &&
                    (line.includes("'") || line.includes('"'));
                  const isCmt = tr.startsWith("//") || tr.startsWith("#");
                  return (
                    <span key={i}>
                      {isKw ? (
                        <span style={{ color: "#82a8ff" }}>{line}</span>
                      ) : isAction ? (
                        <span style={{ color: accent }}>{line}</span>
                      ) : isStr ? (
                        <span style={{ color: "#6fdd8b" }}>{line}</span>
                      ) : isCmt ? (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontStyle: "italic",
                          }}
                        >
                          {line}
                        </span>
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

          {/* Notes */}
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

// ── PipelineCard ──────────────────────────────────────────────────────────────
const PipelineCard: React.FC<{ pipeline: Pipeline; t: Tokens }> = ({
  pipeline,
  t,
}) => {
  const [open, setOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(true);

  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${open ? `${pipeline.accentColor}40` : t.cardBorder}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.3s, background 0.3s",
      }}
    >
      {/* ── Pipeline header — click to expand/collapse ── */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 22px",
          cursor: "pointer",
          background: open ? `${pipeline.accentColor}0e` : "transparent",
          borderBottom: open ? `1px solid ${t.cardDivider}` : "none",
          transition: "background 0.2s",
          userSelect: "none",
        }}
      >
        {/* Accent dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            flexShrink: 0,
            background: pipeline.accentColor,
            boxShadow: open ? `0 0 8px ${pipeline.accentColor}80` : "none",
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
            {pipeline.titleAccents}
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
            {pipeline.subtitle}
          </div>
        </div>

        {/* Step count badge */}
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            background: pipeline.accentBg,
            color: pipeline.accentColor,
            border: `1px solid ${pipeline.accentColor}40`,
            flexShrink: 0,
          }}
        >
          {pipeline.steps.length} steps
        </span>

        {/* Expand pill */}
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
            background: open ? pipeline.accentBg : "transparent",
            color: open ? pipeline.accentColor : t.textDim,
            border: `1px solid ${open ? `${pipeline.accentColor}50` : t.cardBorder}`,
          }}
        >
          {open ? "▲ Hide" : "▼ Show me"}
        </div>
      </div>

      {/* ── Pipeline body ── */}
      {open && (
        <div
          style={{
            padding: "18px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Collapse / Expand all + flow strip row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Flow strip */}
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
              {pipeline.steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <span
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 11,
                      color:
                        i === pipeline.steps.length - 1
                          ? pipeline.accentColor
                          : t.subtitleColor,
                      whiteSpace: "nowrap",
                      fontWeight: 700,
                      letterSpacing: 0.4,
                    }}
                  >
                    {s.title}
                  </span>
                  {i < pipeline.steps.length - 1 && (
                    <span
                      style={{
                        color: pipeline.accentColor,
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

            {/* Collapse all button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAllOpen((v) => !v);
              }}
              style={{
                background: allOpen ? t.colBgOn : t.colBgOff,
                border: `1px solid ${allOpen ? t.colBdrOn : t.colBdrOff}`,
                borderRadius: 20,
                color: allOpen ? "#f0927f" : t.colTxtOff,
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

          {/* Step cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pipeline.steps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                forceOpen={allOpen}
                accent={pipeline.accentColor}
                t={t}
              />
            ))}
          </div>

          {/* Checklist */}
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
                color: pipeline.accentColor,
                fontSize: 9,
                letterSpacing: 2,
                marginBottom: 8,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ⚠ CHECKLIST BEFORE RUNNING
            </div>
            {pipeline.checklist.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: pipeline.accentColor, flexShrink: 0 }}>
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
export const JenkinsPipelines: React.FC = () => {
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
                background: "rgba(210,73,57,0.15)",
                border: "1px solid #d2493940",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🏗️
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
                Jenkins <span style={{ color: "#d24939" }}>CI/CD</span>{" "}
                Pipelines
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
                3 PIPELINE SETUPS · CLICK ANY CARD BELOW TO EXPAND ALL STEPS
              </p>
            </div>
          </div>
        </div>

        {/* 3 independent pipeline cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PIPELINES.map((pipeline) => (
            <PipelineCard key={pipeline.id} pipeline={pipeline} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JenkinsPipelines;
