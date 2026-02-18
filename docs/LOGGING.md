# 📊 Professional Logging System

## **Overview**

The portfolio project now uses a comprehensive, structured logging system designed for production environments with efficient monitoring, debugging, and security event tracking.

---

## **🏗️ Architecture**

### **Backend Logging (Python/FastAPI)**
- **Framework**: Structured logging with `structlog`
- **Format**: JSON logs for machine readability
- **Correlation**: Request ID tracking across all logs
- **Performance**: Automatic timing and metrics collection
- **Security**: Specialized security event detection

### **Frontend Logging (TypeScript/React)**
- **Framework**: Custom logging utility
- **Features**: User interaction tracking, API monitoring, error capturing
- **Storage**: Local storage + optional remote logging
- **Performance**: Automatic slow operation detection

---

## **📁 Log Files Structure**

```
backend/logs/
├── app.jsonl           # Main application logs (10MB, 5 backups)
├── errors.jsonl        # Error-specific logs (5MB, 3 backups)
└── security.jsonl      # Security events (5MB, 10 backups)
```

### **Log Rotation**
- **Automatic rotation** when files reach size limits
- **Configurable retention** (default: 30 days)
- **JSON Lines format** for efficient parsing

---

## **🔍 Log Levels & Usage**

### **Backend Log Levels**
```python
logger.debug("Detailed debug information")
logger.info("General information", extra_field="value")
logger.warning("Warning condition", alert_level="medium")
logger.error("Error occurred", exc_info=True)
```

### **Frontend Log Levels**
```typescript
log.debug("Debug information", { component: "App" });
log.info("User action", { action: "button_click" });
log.warn("Non-critical issue", { retryAttempt: 2 });
log.error("Critical error", error, { component: "API" });
```

---

## **🎯 Specialized Loggers**

### **1. Security Logger**
Tracks authentication, authorization, and suspicious activities:
```python
security_logger.auth_failure("192.168.1.1", "invalid_password")
security_logger.rate_limit_exceeded("192.168.1.1", "/api/v1/chat")
security_logger.suspicious_activity("192.168.1.1", "multiple_failed_attempts")
```

### **2. Performance Logger**
Monitors API performance and slow operations:
```python
performance_logger.api_request("POST", "/api/v1/chat", 1.234, 200)
performance_logger.ai_processing("strategic-fit", 2.567, True)
performance_logger.slow_query("portfolio_data_load", 5.123)
```

### **3. Frontend Performance Tracking**
```typescript
log.performance("component_render", 150, { component: "ProjectCard" });
log.apiCall("POST", "/api/v1/chat", 1234, 200);
log.userAction("button_click", "Navbar", { button: "AI Analysis" });
```

---

## **🔧 Configuration**

### **Backend Environment Variables**
```env
LOG_LEVEL=INFO                    # DEBUG, INFO, WARNING, ERROR
LOG_TO_FILE=true                  # Enable file logging
LOG_ROTATION_SIZE=10485760        # 10MB in bytes
LOG_RETENTION_DAYS=30             # Log retention period
```

### **Frontend Environment Variables**
```env
VITE_ENABLE_CONSOLE_LOGS=true     # Console output in development
VITE_ENABLE_REMOTE_LOGS=false     # Send logs to backend
VITE_API_BASE_URL=http://localhost:8000
```

---

## **📊 Log Format Examples**

### **Structured Backend Log**
```json
{
  "timestamp": "2024-01-20T15:30:45.123Z",
  "level": "info",
  "event": "API request completed",
  "request_id": "req_abc123",
  "method": "POST",
  "path": "/api/v1/chat",
  "duration_ms": 1234.56,
  "status_code": 200,
  "client_ip": "192.168.1.1",
  "environment": "production",
  "service": "portfolio-backend",
  "version": "1.0.0"
}
```

### **Frontend Error Log**
```json
{
  "timestamp": "2024-01-20T15:30:45.123Z",
  "level": "error",
  "message": "API call failed",
  "context": {
    "sessionId": "session_1642692645123_abc123",
    "component": "JobAnalysis",
    "action": "submit_job_description"
  },
  "error": {
    "name": "NetworkError",
    "message": "Failed to fetch",
    "stack": "Error: Failed to fetch\n    at fetch..."
  },
  "userAgent": "Mozilla/5.0...",
  "url": "https://yourname.vercel.app/",
  "environment": "production"
}
```

---

## **🚀 Production Deployment**

### **Backend (Railway)**
```env
LOG_LEVEL=WARNING
DEBUG=false
ENVIRONMENT=production
```

### **Frontend (Vercel)**
```env
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENABLE_REMOTE_LOGS=true
VITE_API_BASE_URL=https://your-backend.railway.app
```

---

## **🔍 Monitoring & Analysis**

### **Log Analysis Tools**
- **jq**: Parse JSON logs efficiently
- **grep**: Search for specific patterns
- **tail -f**: Real-time log monitoring

### **Common Queries**
```bash
# View all errors in the last hour
cat logs/errors.jsonl | jq 'select(.timestamp > "2024-01-20T14:00:00Z")'

# Count API requests by endpoint
cat logs/app.jsonl | jq -r 'select(.event == "API request completed") | .path' | sort | uniq -c

# Find slow operations
cat logs/app.jsonl | jq 'select(.duration_ms > 1000)'

# Security events analysis
cat logs/security.jsonl | jq 'select(.alert_level == "high")'
```

### **Performance Monitoring**
- **Request duration tracking**: All API calls timed automatically
- **Slow operation alerts**: Operations >1000ms flagged
- **Memory usage**: Logged with each request
- **Error rate monitoring**: Tracked per endpoint

---

## **🛡️ Security Event Detection**

### **Automatic Detection**
- **Failed authentication attempts**
- **Rate limit violations**
- **Suspicious IP activity**
- **Unusual request patterns**

### **Alert Triggers**
- High-priority security events
- Multiple failed attempts from same IP
- Requests exceeding rate limits
- Potential attack patterns

---

## **📈 Benefits**

### **Development**
- **Rich debugging information** with request correlation
- **Performance insights** for optimization
- **Clear error tracking** with full context

### **Production**
- **Structured monitoring** for automated analysis
- **Security event detection** for threat prevention
- **Performance tracking** for optimization
- **Audit trail** for compliance

### **Deployment Ready**
- **Efficient log rotation** prevents disk space issues
- **JSON format** compatible with log aggregation tools
- **Environment-specific configuration** for optimal settings
- **Remote logging** for centralized monitoring

---

## **🔗 Integration with Monitoring Tools**

The structured JSON format is compatible with:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk** for enterprise monitoring
- **DataDog** for cloud-native monitoring
- **Grafana + Loki** for visualization
- **CloudWatch** for AWS deployments

Your portfolio now has enterprise-grade logging ready for production deployment! 🚀
