# Real-Time Security Observability & Threat Monitoring System

An automated Threat Monitoring and SOC Security Observability stack built with **Node.js Express**, **Prometheus**, and **Grafana**.

This system instruments custom application-level security metrics-such as brute-force authentication spikes and unauthorized path traversal probes-to detect and visualize active cyber threats in real time without heavy log-parsing latency.

---

## ?? System Architecture & Data Flow

```text
+-------------------------------------------------------------------------------+
|                                DOCKER NETWORK                                 |
|                                                                               |
|  +-----------------------+              +----------------------------------+  |
|  |  Attack Simulator /   |              |  Target API Gateway (Node.js)    |  |
|  |  Postman / cURL       | --Attacks--> |  Exposes API on :5000            |  |
|  +-----------------------+              |  Exposes Metrics on :5000/metrics |  |
|                                         +----------------------------------+  |
|                                                          |                    |
|                                                 Scrapes every 5s              |
|                                                          v                    |
|  +-----------------------+              +----------------------------------+  |
|  |  Grafana Visualizer   |              |  Prometheus Metrics Engine       |  |
|  |  Dashboard on :3000   | <---PromQL-- |  Time-Series DB on :9090          |  |
|  +-----------------------+              +----------------------------------+  |
+-------------------------------------------------------------------------------+
```

---

## ??? Prerequisites & Installation

Ensure you have the following installed on your system:
* **Docker Desktop** (Windows / macOS / Linux)
* **Git**
* (Optional) **Postman** or **Python 3** for manual attack simulations.

---

## ?? Project Directory Structure

Ensure your project folder is structured as follows:

```text
security-dashboard-project/
docker-compose.yml
prometheus.yml
app.js
package.json
README.md
```

---

## ?? Step-by-Step Execution Guide

### Step 1: Open Project Directory
Navigate into your project directory in your terminal:
```bash
cd security-dashboard-project
```

### Step 2: Start the Docker Infrastructure
Ensure Docker Desktop is running, then launch the multi-container stack:
```bash
docker-compose up -d
```

Verify that all three containers (`security_app`, `prometheus`, and `grafana`) are active:
```bash
docker ps
```

### Step 3: Access Running Services
* **Target Security Application:** `http://localhost:5000`
* **Raw Security Metrics Endpoint:** `http://localhost:5000/metrics`
* **Prometheus Web Console:** `http://localhost:9090`
* **Grafana Security Dashboard:** `http://localhost:3000` (*Default Credentials: `admin` / `admin`*)

---

## ? Attack Simulation & Threat Generation

Run any of the following methods to generate simulated malicious traffic against the API:

### Method A: Using Windows Command Prompt (`cmd.exe`)
```cmd
:: 1. Brute-Force Password Attack (15 Failed Logins)
for /L %%i in (1,1,15) do curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"password\":\"wrong_pwd\"}"

:: 2. Successful Login Verification
curl -s -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d "{\"password\":\"admin123\"}"

:: 3. Unauthorized Endpoint Probing (10 Forbidden Access Attempts)
for /L %%i in (1,1,10) do curl -s http://localhost:5000/api/admin
```

### Method B: Using Postman Collection Runner
1. Create a new Collection named **`SOC Attacks`**.
2. Add a `POST` request to `http://localhost:5000/api/login` with raw JSON body `{"password": "wrong"}`.
3. Add a `GET` request to `http://localhost:5000/api/admin`.
4. Right-click the Collection -> Click **Run Collection** -> Set **Iterations: 30** -> Click **Run**.

---

## ?? Grafana Security Dashboard Configuration

1. Log into Grafana at **`http://localhost:3000`** (User: `admin` | Password: `admin`).
2. Navigate to **Connections > Data Sources > Add Prometheus**.
3. Set **Prometheus server URL** to `http://prometheus:9090` and click **Save & Test**.
4. Create a **New Dashboard** and add panels using these PromQL queries:

| Panel Title | PromQL Query | Visualization Type | Security Metric Focus |
| :--- | :--- | :--- | :--- |
| **Brute-Force Rate** | `sum(rate(security_auth_attempts_total{status="failure"}[1m])) * 60` | **Stat** / **Time Series** | Detects rapid authentication failures per minute |
| **Auth Ratio** | `sum by (status) (security_auth_attempts_total)` | **Pie Chart** | Compares successful logins against attack volume |
| **Path Probing** | `sum(increase(security_access_violations_total[5m]))` | **Bar Gauge** | Identifies 403 Forbidden endpoint scanning |

---

## ?? Stopping & Cleaning Up

To stop all running containers and clear environment resources:
```bash
docker-compose down
```
