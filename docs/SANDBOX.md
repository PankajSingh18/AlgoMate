# 🐳 Code Execution Sandbox

## Overview

AlgoBuddy uses Docker-based sandboxing for secure code execution with resource isolation.

## Architecture
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Request │────▶│ Executor │────▶│ Docker │
│ │ │ Queue │ │ Manager │
└─────────────┘ └─────────────┘ └─────────────┘
│
▼
┌─────────────┐
│ Container │
│ Pool │
└─────────────┘

text

## Resource Limits

| Resource | Limit |
|----------|-------|
| Memory | 512 MB |
| CPU | 50% of one core |
| Processes | 20 max |
| Execution Time | 30 seconds |
| Code Size | 10 KB |

## Supported Languages

- JavaScript (Node.js 20)
- Python (3.11)
- Java (17)
- C++ (g++)
- C (gcc)

## Security Features

1. **Container Isolation**
   - Each execution runs in isolated container
   - No access to host system
   - User namespace isolation

2. **Resource Limits**
   - Memory limits prevent exhaustion
   - CPU limits prevent freezing
   - Process limits prevent fork bombs

3. **Code Validation**
   - Dangerous patterns blocked
   - Code size limits
   - Infinite loop detection

4. **Rate Limiting**
   - Per-user limits
   - Global limits
   - Queue management

## Usage

### API Endpoint


POST /api/execute
{
  "code": "console.log('Hello')",
  "language": "javascript"
}
Response
javascript
{
  "success": true,
  "data": {
    "output": "Hello\n",
    "error": "",
    "exitCode": 0,
    "executionTime": 15,
    "memoryUsed": 0
  }
}
Monitoring
## Health Check

GET /api/execute/health
Status

GET /api/execute
Development

## Start Docker

docker-compose up -d

## Build Sandbox Image

docker build -t algobuddy-sandbox -f Dockerfile.sandbox .

## Run Tests

npm test -- sandbox