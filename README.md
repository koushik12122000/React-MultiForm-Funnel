# Disability Path — Growth Automation Lead Qualification Funnel

A high-converting, resilient qualification funnel built with **React**, **Vite**, and **Tailwind CSS**. Designed specifically for high-intent customer acquisition, **Meta Conversion API (CAPI) deduplication**, and automated routing through **n8n &rarr; Airtable**.

---

## 🚀 Live Demo & Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or the port indicated in your terminal).

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Directory & File Structure Breakdown

Here is an architectural map of the entire codebase and the specific purpose of each folder and file:

```
Growth Automation Application/
├── public/                     # Static public assets
├── src/
│   ├── assets/                 # SVGs and brand assets
│   ├── components/             # Modular React UI components
│   │   ├── Header.jsx          # Top navigation, brand emblem, SSL status, and Lead Hub trigger
│   │   ├── ProgressBar.jsx     # Dynamic animated progress bar, back navigation, step counter
│   │   ├── QuestionCard.jsx    # Accessible, interactive question cards with keyboard (1-9) shortcuts
│   │   ├── CalculatingStep.jsx # High-converting animated audit/calculation interstitial
│   │   ├── LeadCaptureStep.jsx # Pre-qualification announcement, RFC-compliant email capture, trust seals
│   │   ├── ConfirmationStep.jsx# Celebratory confetti, benefit tier card, next steps, and event telemetry
│   │   ├── Footer.jsx          # FTC & SSA regulatory compliance disclaimers and modal triggers
│   │   ├── LegalModal.jsx      # Privacy policy and terms & conditions dialog
│   │   └── LeadInspectorModal.jsx # Developer/Assessor hub to test n8n webhooks and inspect live payloads
│   ├── data/
│   │   └── questions.js        # Canonical survey questions schema, options, badges, and icons
│   ├── services/
│   │   ├── analytics.js        # Meta Pixel + CAPI event tracking, deduplication (event_id), SHA-256 hashing
│   │   ├── leadService.js      # Resilient lead dispatcher, webhook poster, and localStorage offline vault
│   │   └── urlParams.js        # Automatic UTM and click ID (fbclid, gclid) extraction utility
│   ├── App.jsx                 # Main funnel orchestrator, state machine, and lifecycle coordinator
│   ├── index.css               # Tailwind CSS v4 styling rules and custom animations
│   └── main.jsx                # React 19 application entry point
├── .env.example                # Example environment variables (webhook URL, Pixel ID)
├── index.html                  # HTML entry point with metadata, preloaded fonts, and favicon
├── package.json                # Project dependencies and build scripts
└── vite.config.js              # Vite configuration with Tailwind CSS plugin
```

---

## 🧠 File-by-File Logic & Architecture Guide

### `src/App.jsx`
- **Purpose**: Serves as the central state machine and coordinator for the funnel.
- **Key State Variables**:
  - `currentStepIndex`: Tracks which survey question (0 through 10) is currently active.
  - `flowState`: Controls whether the user is in `'questions'`, `'calculating'`, `'lead_capture'`, or `'confirmation'`.
  - `answers`: Key-value map of question IDs to selected values.
  - `leadPayload`: Holds the prepared, standardized data packet once the lead submits their email.
- **Key Logic**:
  - Automatically records the session start timestamp to compute time-to-convert (`durationSeconds`).
  - Calls `trackEvent('PageView')` on mount with landing URL and UTM parameters.
  - Switches seamlessly between the survey questions, the calculation screen, the email capture form, and the confirmation screen.

### `src/data/questions.js`
- **Purpose**: Centralized source of truth for the 11 linear qualification questions matching the live funnel:
  1. `is_over_40` (YES / NO)
  2. `current_benefits` (SSD / SSI / Both / None)
  3. `weekly_work_hours` (Not working / 20 or less / More than 20)
  4. `employment_history_10yr` (<2 yrs / 2-4 yrs / 4-6 yrs / 6+ yrs)
  5. `asset_value` (<$2,000 / >$2,000 / Not Sure)
  6. `out_of_work_duration` (Yes / No)
  7. `medical_care_status` (Yes / No)
  8. `pending_ssd_application` (Yes / No)
  9. `gender` (Male / Female / Non-Binary / Prefer not to respond)
  10. `age_range` (Under 40 / 40-49 / 50-54 / 55-63 / 64 or older)
  11. `marital_status` (Single / Married / Widowed / Divorced / Separated)

### `src/services/analytics.js` (Meta CAPI & Pixel Deduplication)
- **Purpose**: Solves Meta event quality and deduplication requirements.
- **How Deduplication Works**:
  - Generates a unique `event_id` (UUIDv4) per conversion.
  - When the browser fires `fbq('track', 'Lead', {...}, { eventID: event_id })`, and your n8n workflow fires the Meta Conversions API with the same `event_id`, Meta combines them into a single high-fidelity conversion event.
  - Includes `getOrConstructFbp()` and `getOrConstructFbc()` to extract or construct Meta click cookies from `fbclid`.
  - Implements client-side `sha256(email)` to conform with Meta Advanced Matching rules.

### `src/services/leadService.js` (Resilience & Webhook Delivery)
- **Purpose**: Handles lead preparation, live webhook transmission, and resilient failure recovery.
- **Resilience Engine**:
  - `submitLead(payload)` attempts to POST the structured payload to the configured webhook (e.g. n8n).
  - **Graceful Failure Handling**: If the webhook fails, times out, or triggers a CORS error, the lead is **never lost**. It is immediately stored in `localStorage` under `offline_leads_vault` with an error message and timestamp.
  - `retryVaultedLeads()`: Allows automatic or manual retries of all queued offline leads.
  - In absence of a live webhook URL, it runs in **Simulation Mode**, logging the complete payload and saving it to local history so assessors can inspect it immediately.

### `src/services/urlParams.js` (Attribution Engine)
- **Purpose**: Captures marketing campaign parameters without manual setup:
  - UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
  - Ad Click IDs: `fbclid` (Meta), `gclid` (Google Ads), `ttclid` (TikTok)
  - Device context: User Agent, Language, Timezone, Screen Resolution, Referrer

### UI Components:
- **`Header.jsx`**: Displays clean branding ("DisabilityPath") and "Official 2026 Guidelines" badge without backend clutter.
- **`ProgressBar.jsx`**: Displays dynamic percentage progress, estimated completion time ("~60 sec"), and a functional "Back" button to step back through the user's specific branch history.
- **`QuestionCard.jsx`**: Premium interactive question layout with card lift hover effects, active border rings, checkmark badges, and **keyboard shortcuts** (press 1-9 to select).
- **`CalculatingStep.jsx`**: Interstitial animation simulating real-time SSA eligibility matching to increase user perceived value before the lead form.
- **`LeadCaptureStep.jsx`**: The core conversion point: captures **Full Name**, **Phone Number** (with auto-formatting `(XXX) XXX-XXXX`), and **Email Address** with live input validation and trust guarantees.
- **`ConfirmationStep.jsx`**: Celebratory confetti trigger, personalized welcome, estimated benefit tier summary ($4,152/mo), and next steps timeline.

---

## 🔗 How to Connect to n8n & Airtable

### 1. Configure the Webhook Endpoint
In your application `.env` file:
```bash
VITE_LEAD_WEBHOOK_URL=https://your-n8n-instance.com/webhook/disability-lead
```

### 2. Sample Payload Dispatched to n8n
```json
{
  "lead_id": "lead_1727685600000_3x9z",
  "meta_event_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "created_at": "2026-09-30T07:15:00.000Z",
  "submission_duration_seconds": 42,
  "lead": {
    "full_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "(555) 234-5678",
    "normalized_phone": "15552345678",
    "email": "john.doe@example.com",
    "hashed_email": "...",
    "hashed_phone": "...",
    "hashed_first_name": "...",
    "hashed_last_name": "..."
  },
  "qualification_answers": {
    "is_over_40": "yes",
    "receiving_ben": "None",
    "page_sm72h5": "Not working",
    "lastworked": "4 to 7 months ago",
    "fiveyearwork": "Between 4 and 6 years",
    "outofwork": "Yes",
    "conditionstart": "6 to 12 months ago",
    "visit": "Yes",
    "page_igxwft": "No",
    "page_1kwm6b": "Male",
    "page_uhs14w": "50-54",
    "page_8w2qbu": "Married"
  },
  "attribution": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "disability_50_plus",
    "landing_page_url": "https://funnel.example.com/?utm_source=facebook"
  },
  "meta_capi_data": {
    "event_name": "Lead",
    "event_time": 1727685600,
    "event_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "action_source": "website",
    "user_data": {
      "em": ["..."],
      "ph": ["..."],
      "fn": ["..."],
      "ln": ["..."],
      "fbp": "fb.1.1727685600.123456789",
      "fbc": "fb.1.1727685600.IwAR2..."
    },
    "custom_data": {
      "currency": "USD",
      "value": 4152.00,
      "lead_type": "disability_pre_qualification"
    }
  }
}
```

### 3. n8n Workflow Construction
1. **Webhook Node**: Set HTTP Method to `POST`, Response Mode to `On Received`.
2. **Branch 1 &rarr; Meta Conversions API (HTTP Request Node)**:
   - URL: `https://graph.facebook.com/v19.0/{{$env.META_PIXEL_ID}}/events?access_token={{$env.META_CAPI_TOKEN}}`
   - Body: Send the `meta_capi_data` object directly. The matching `event_id` ensures 100% deduplication against browser pixel events.
3. **Branch 2 &rarr; Airtable Node**:
   - Operation: `Append`
   - Field Mapping:
     - `Email`: `{{$json.lead.email}}`
     - `Age Range`: `{{$json.qualification_answers.age_range}}`
     - `Work Status`: `{{$json.qualification_answers.weekly_work_hours}}`
     - `Asset Value`: `{{$json.qualification_answers.asset_value}}`
     - `Meta Event ID`: `{{$json.meta_event_id}}`
     - `UTM Source`: `{{$json.attribution.utm_source}}`

---

## 🛡️ Resilience & Fault Tolerance Highlights
1. **Zero Lead Loss via Offline Vault**: If n8n or the network is momentarily down, the lead payload is safely queued in `localStorage` under `offline_leads_vault`.
2. **Automated & Manual Retries**: Retries can be triggered from the in-app inspector or synced automatically upon reconnection.
3. **Data Normalization**: All survey answers are mapped to canonical identifiers, preventing schema mismatch in downstream databases.
#   R e a c t - M u l t i F o r m - F u n n e l  
 