# 🚀 Growth Automation Funnel Platform

> Production-grade lead capture, qualification, tracking, scoring, alerting, and recovery system built for the LexHive Growth Automation Engineer Assessment.

## 🎯 Overview

This project goes beyond a traditional form submission workflow by combining:

- React + Vite Qualification Funnel
- Meta Conversions API (CAPI) Integration
- n8n Automation & Orchestration
- Airtable CRM
- Lead Scoring & Value-Based Bidding (VBB)
- Duplicate Detection & Idempotency Controls
- Recovery Queue & Reconciliation Logic
- Real-Time Slack & Gmail Alerting

---

## 🌐 Live Demo

### Live Funnel
https://react-multi-form-funnel.vercel.app/

### GitHub Repository
https://github.com/koushik12122000/React-MultiForm-Funnel

---

# 🏗️ System Architecture

```text
React Funnel (Vercel)
        │
        ▼
Webhook (n8n)
        │
        ▼
Validation & Normalization
        │
        ▼
Duplicate Detection
        │
        ▼
Lead Scoring Engine
        │
        ├────────────► Meta CAPI
        │
        └────────────► Airtable CRM
                              │
                              ▼
                    Reconciliation Layer
                              │
                              ▼
                    Slack / Email Alerts

Failure Handling
       │
       ▼
Recovery Queue
       │
       ▼
Retry Workflow
```

---

# ✨ Key Features

## Multi-Step Qualification Funnel

- Reverse-engineered DisabilityPath qualification flow
- Dynamic branching logic
- Mobile responsive UI
- Form validation
- Progress tracking
- UTM attribution capture
- Conversion focused UX

---

## Meta Conversions API (CAPI)

Implemented server-side conversion tracking through n8n.

### Advanced Matching Signals

✅ Email

✅ Phone

✅ First Name

✅ Gender

✅ Country

✅ External ID

✅ IP Address

✅ User Agent

✅ FBP

### Event Deduplication

A unique UUID-based Event ID is generated and propagated throughout the funnel lifecycle.

```text
Browser Event
      ↓
Server Event
      ↓
Meta CAPI
```

This prevents duplicate conversion reporting.

### Event Match Quality

```text
3.2 / 10  →  6.5 / 10
```

Improved through advanced matching signals and server-side tracking.

---

## Validation & Data Quality Layer

Before any writes occur, every lead is normalized and validated.

### Validation Rules

- Email Format Validation
- Phone Validation
- Required Field Validation
- Data Normalization
- Input Sanitization

Invalid leads are quarantined before entering downstream systems.

---

## Duplicate Detection & Idempotency

Before creating records:

```text
Email
Phone Number
Meta Event ID
```

are checked against Airtable.

### Benefits

- Prevents duplicate CRM records
- Prevents duplicate Meta conversions
- Avoids duplicate outreach
- Preserves attribution accuracy

---

## Lead Scoring Engine

Every submission receives a qualification score.

### Example Scoring Rules

```text
SSD Benefits          +25
Not Working           +25
Income < $2000        +20
Age 40+               +10
```

### Lead Classification

```text
HOT    ≥ 80
WARM   ≥ 50
COLD   < 50
```

---

## Value-Based Bidding (VBB)

Lead quality directly influences Meta conversion value.

```text
HOT    → $100
WARM   → $45
COLD   → $15
```

This allows Meta's optimization algorithm to prioritize higher-value prospects.

---

# 🗄️ Airtable CRM Architecture

## Table 1 — CRM Leads

Primary operational database.

Stores:

- Lead Information
- Qualification Answers
- Lead Score
- Lead Grade
- Meta Event ID
- UTM Attribution
- Submission Metadata

---

## Table 2 — Recovery Queue

Dead Letter Queue (DLQ) for operational recovery.

Stores:

- Failed Events
- Retry Status
- Error Reason
- Processing State

### States

```text
RETRY_PENDING
COMPLETED
PERMANENT_FAILURE
```

---

## Table 3 — Duplicate Vault

Stores duplicate submissions separately from production CRM data.

Benefits:

- Maintains clean reporting
- Prevents duplicate outreach
- Preserves audit history

---

# 🔄 Reliability & Recovery Design

The system treats Meta CAPI and Airtable as independent downstream sinks.

### Processing Flow

```text
Lead
 ├─ Meta CAPI
 └─ Airtable CRM
```

Failures in one destination do not block delivery to the other.

---

## Reconciliation Layer

After sink execution, the workflow evaluates both outcomes.

Possible states:

```text
COMPLETED
RETRY_PENDING
PERMANENT_FAILURE
```

---

## Automated Recovery Pipeline

Failed transactions enter a recovery queue.

```text
Failure
   ↓
Recovery Queue
   ↓
Backoff Wait
   ↓
Retry
   ↓
Resolution
```

This ensures leads are never silently lost.

---

# 🔔 Operational Alerting

## HOT Lead Notifications

When:

```text
Lead Score >= 80
```

the system triggers:

- Slack Alerts
- Gmail Alerts

to enable rapid follow-up.

---

## Failure Notifications

Automatic alerts for:

- Meta Delivery Failure
- Airtable Failure
- Critical Pipeline Failure

---

# 🛠️ Tech Stack

### Frontend

```text
React
Vite
Tailwind CSS
JavaScript
```

### Automation

```text
n8n
```

### CRM

```text
Airtable
```

### Tracking

```text
Meta Conversions API
```

### Notifications

```text
Slack
Gmail
```

### Deployment

```text
Vercel
```

---

# 🚀 What Makes This Different?

Most lead generation systems:

```text
Form
 ↓
Database
```

This implementation:

```text
Qualification Funnel
 ↓
Validation
 ↓
Deduplication
 ↓
Lead Scoring
 ↓
Meta CAPI
 ↓
CRM
 ↓
Reconciliation
 ↓
Recovery Queue
 ↓
Alerting
```

The focus was not simply collecting leads but building resilient marketing infrastructure with tracking accuracy, failure recovery, and operational visibility.

---

# 📌 Assignment Objectives Covered

✅ React Funnel

✅ Lead Capture

✅ Meta Conversions API

✅ Advanced Matching

✅ Event Deduplication

✅ n8n Automation

✅ Airtable CRM

✅ Duplicate Detection

✅ Lead Scoring

✅ Value-Based Bidding

✅ Recovery Queue

✅ Retry Handling

✅ Operational Alerting

✅ Reliability & Observability

---

# 👨‍💻 Author

**Koushik Pesaru**

- GitHub: https://github.com/koushik12122000
- LinkedIn: https://www.linkedin.com/in/koushik-pesaru/

---

## Final Note

This project was designed as a production-oriented Growth Automation system focused on:

- High-quality conversion tracking
- Lead qualification
- Reliability
- Recoverability
- Operational visibility
- Marketing attribution

rather than a simple form-to-database implementation.
