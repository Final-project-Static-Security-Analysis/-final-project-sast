

# 🔐 Python SAST Scanner

![Python](https://img.shields.io/badge/Python-3.11-blue)
![AST](https://img.shields.io/badge/AST-Analysis-orange)
![SARIF](https://img.shields.io/badge/SARIF-2.1.0-green)
![React](https://img.shields.io/badge/React-Dashboard-61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Base44](https://img.shields.io/badge/Base44-Low_Code_Platform-purple)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-black)
![Security](https://img.shields.io/badge/Security-SAST-red)
![Taint Analysis](https://img.shields.io/badge/Taint-Tracking-purple)

Static Application Security Testing (SAST) platform for detecting security vulnerabilities in Python applications through static code analysis, taint tracking, SARIF reporting, and interactive findings visualization.


## 🔗 Quick Links

| Resource | Description |
|-----------|-------------|
|  Live Demo | https://scan-python-safe.base44.app |
|  Scanner CLI | [Scanner Documentation](scanner/README.md) |
|  Web Dashboard | [UI Documentation](ui/README.md) |
|  GitHub Action | [GitHub Action Usage](scanner/README.md#github-action) |
|  Docker Usage | [Docker Guide](scanner/README.md#docker) |
|  Sample Applications | [Vulnerable Samples](samples/) |


##  Project Overview

This project provides an end-to-end Static Application Security Testing (SAST) solution for Python applications.

The platform analyzes Python source code, identifies security vulnerabilities, tracks the flow of user-controlled data through the application, generates findings in SARIF format, and visualizes the results through an interactive React dashboard.

The project demonstrates the complete workflow used by modern SAST tools:

**Source Code → Static Analysis → Taint Tracking → SARIF Generation → Findings Visualization**



## Architecture

```text
Python Source Code
        │
        ▼
   Scanner Engine
        │
        ▼
 Vulnerability Detection
        │
        ▼
   Taint Analysis
        │
        ▼
   SARIF Report
        │
        ▼
 React Dashboard
```



##  Main Features

* Static analysis of Python source code
* AST-based code inspection
* Security vulnerability detection
* Source-to-sink taint tracking
* SARIF 2.1.0 report generation
* Interactive findings dashboard
* Code snippet visualization
* Code flow visualization
* Dockerized scanner execution
* GitHub Actions integration
* SARIF upload and inspection
* Vulnerability severity reporting



## 🛠️ Technologies Used

### Scanner Engine

* Python 3.11
* Abstract Syntax Tree (AST)
* Static Code Analysis
* Taint Analysis
* SARIF 2.1.0

### User Interface

* React
* JavaScript (ES6)
* Vite
* HTML5
* CSS3
* Base44

### DevOps & Automation

* Docker
* GitHub Actions
* YAML

### Development Tools

* Git
* GitHub
* VS Code



## 🔍 Supported Vulnerabilities

| Vulnerability                      | CWE               | Description                                              |
| ---------------------------------- | ----------------- | -------------------------------------------------------- |
| SQL Injection                      | CWE-89            | User input embedded directly into SQL queries            |
| OS Command Injection               | CWE-78            | User input passed to operating system commands           |
| Path Traversal                     | CWE-22            | User-controlled file paths used without validation       |
| Code Injection                     | CWE-94            | Untrusted input passed to eval() or exec()               |
| Cross-Site Scripting (XSS)         | CWE-79            | User input rendered into HTML without escaping           |
| Hardcoded Secrets                  | CWE-200           | Credentials embedded directly in source code             |
| Insecure Deserialization           | CWE-502           | Unsafe deserialization using pickle.loads()              |
| Server-Side Request Forgery (SSRF) | CWE-918           | User-controlled URLs used in server-side requests        |
| Weak Cryptography                  | CWE-327 / CWE-328 | Weak hashing algorithms and insecure randomness          |
| Missing Authorization              | CWE-862           | Sensitive operations performed without permission checks |



##  Project Structure

```text
final-project-sast
│
├── scanner/          # Scanner engine, CLI, SARIF generation
├── ui/               # React findings visualization dashboard
├── samples/          # Vulnerable sample applications
└── README.md
```



## 🔄 Workflow

### 1. Scan

Analyze Python source code using the scanner engine.

### 2. Detect

Identify vulnerable code patterns and dangerous data flows.

### 3. Track

Perform taint analysis from sources to sinks.

### 4. Generate

Create findings in SARIF 2.1.0 format.

### 5. Upload

Load SARIF results into the dashboard.

### 6. Visualize

Explore findings, code snippets, vulnerability descriptions, and code flows.



## 📸 Screenshots

###  Home Page

<p align="center">
  <img src="https://github.com/user-attachments/assets/f515d424-8214-4573-8fc9-21fd8f66f583" width="1000">
</p>



###  Findings Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/25e37899-e4e9-4f16-ad74-99ac71fe29a4" width="1000">
</p>



###  Vulnerability Details View

<p align="center">
  <img src="https://github.com/user-attachments/assets/fc2908bd-49ed-4b12-8cbe-bf941d69e886" width="800">
</p>



###  Code Flow Visualization

<p align="center">
  <img src="https://github.com/user-attachments/assets/0f92e15a-7081-4ace-a058-1b9687cdd5ff" width="800">
</p>



## 🎓 Academic Project

**B.Sc. Computer Science – Final Project**

**Bar-Ilan University | 2026**

### Research Areas

* Static Application Security Testing (SAST)
* Secure Software Engineering
* Vulnerability Detection
* Taint Analysis
* Static Program Analysis
* SARIF-Based Security Reporting
* Security Findings Visualization

Developed as a complete proof-of-concept security scanner demonstrating how modern static analysis tools detect, track, and report security vulnerabilities in Python applications.
