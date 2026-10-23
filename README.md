Real-Time Security Observability & Threat Monitoring SystemA lightweight, automated SOC security monitoring stack using Node.js, Prometheus, and Grafana. This project captures live web application attack metrics—such as brute-force authentication attempts and unauthorized path probing—scraping time-series security data into real-time Grafana dashboards for rapid incident detection.📋 System Architecture & Data Flow+-----------------------+              +-----------------------------------+              +-----------------------+
|  Attack Simulator     |              |  Target Security API              |              |  Prometheus Server    |
|  (cURL / Postman /    | --Attacks--> |  (Node.js + Express)              | <--Scrape--  |  (Time Series Database|
|   Python Script)      |              |  Exposes /metrics on port 5000    |  (Every 5s)  |   on port 9090)       |
+-----------------------+              +-----------------------------------+              +-----------------------+
                                                                                                      |
                                                                                                Queries PromQL
                                                                                                      v
                                                                                          +-----------------------+
                                                                                          |  Grafana Dashboard    |
                                                                                          |  (Visualizations      |
                                                                                          |   on port 3000)       |
                                                                                          +-----------------------+
🛠️ Prerequisites & InstallationBefore running the project, ensure you have the following installed on your machine:Docker Desktop (Windows / macOS / Linux)Git (optional, for cloning)Postman or Python 3 (optional, for running attack simulations)📁 File StructureCreate a root directory named security-dashboard-project and ensure it contains the following files:security-dashboard-project/
├── docker-compose.yml
├── prometheus.yml
├── app.js
├── package.json
└── README.md
🚀 How to Run the ProjectStep 1: Start the InfrastructureOpen your terminal inside the project directory and start the containers using Docker Compose:docker-compose up -d
Verify that all three services (security_app, prometheus, and grafana) are active:docker ps
Step 2: Simulate Cyber Attacks (Generate Security Metrics)Run the following commands in your terminal to simulate malicious traffic patterns against the API:Option A: Windows Command Prompt (cmd.exe):: 1. Brute-Force Attack Simulation (15 Failed Logins)
for /L %i in (1,1,15) do curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"password\":\"wrong\"}"

:: 2. Legitimate User Login (1 Successful Login)
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"password\":\"admin123\"}"

:: 3. Unauthorized Endpoint Reconnaissance (10 Forbidden Access Requests)
for /L %i in (1,1,10) do curl http://localhost:5000/api/admin
Option B: Linux / Git Bash / macOS# 1. Brute-Force Attack Simulation
for i in {1..15}; do curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"password":"wrong"}'; done

# 2. Legitimate Login
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"password":"admin123"}'

# 3. Unauthorized Endpoint Reconnaissance
for i in {1..10}; do curl http://localhost:5000/api/admin; done
Step 3: Configure Grafana Security DashboardOpen your browser and go to http://localhost:3000.Log in with the default credentials:Username: adminPassword: adminAdd Prometheus Data Source:Go to Connections > Data Sources > Add Data Source.Select Prometheus.Set the Server URL to: http://prometheus:9090Scroll down and click Save & Test.Create the Dashboard Panels:Go to Dashboards > New Dashboard > Add Visualization.Select Prometheus as the data source and switch the query editor to Code mode.Dashboard Queries & Panels TablePanel TitlePromQL QueryRecommended Panel TypeSecurity InsightBrute-Force Attack Ratesum(rate(security_auth_attempts_total{status="failure"}[1m])) * 60Stat / Time SeriesTracks failed login spikes per minute.Auth Success vs. Failuresum by (status) (security_auth_attempts_total)Pie ChartVisualizes legitimate vs. malicious login ratios.Unauthorized Probing Accesssum(increase(security_access_violations_total[5m]))Bar Gauge / StatDetects endpoint enumeration scans (403 Forbidden).🔍 Service Port ReferenceTarget Security Application: http://localhost:5000Metrics Scrape Endpoint: http://localhost:5000/metricsPrometheus Web UI: http://localhost:9090Grafana Web UI: http://localhost:3000🛑 Stopping the LabTo shut down all containers and clean up resources, execute:docker-compose down
