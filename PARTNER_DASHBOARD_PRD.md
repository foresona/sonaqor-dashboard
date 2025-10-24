Great — let’s turn the **Partner Dashboard context** into a **production-style requirements document**. This version is structured for engineering and design teams, with **user stories, acceptance criteria, and UI notes**.

---

# Sonaqor Partner Dashboard — Product Requirements Document (PRD)

## 1. Purpose

The Partner Dashboard provides tenant organizations with a **self-service control center** to integrate and manage Sonaqor. It is powered by the **Partner API**, ensuring all features available in the dashboard can also be automated via API.

---

## 2. Key Roles

* **Tenant Owner** – sets up projects, billing, and permissions.
* **Admin** – manages apps, keys, logs, webhooks, and teams.
* **Developer** – integrates via API, monitors logs.
* **Analyst** – views intelligence results, compliance dashboards, and exports.
* **Viewer** – read-only access.

---

## 3. Modules & Requirements

### 3.1 Home / Overview

**User Story:**
As a partner, I want a single page overview of usage, jobs, and health so I can see the state of my integration.

**Acceptance Criteria:**

* Stat cards: Active Customers, API Calls, Drift Alerts, Risk Flags.
* Time-range selector (24h, 7d, 30d, 90d).
* Live job tracker (ingestion → analysis).
* API uptime widget (status, SLA compliance).
* Click-through to detailed modules.

---

### 3.2 Projects & Apps

**User Story:**
As an admin, I want to create apps under projects so I can separate environments and integrations.

**Acceptance Criteria:**

* Create/edit/delete projects.
* Create/edit/delete apps within projects.
* Configure app-level settings: environment, webhook endpoints, IP allowlists.
* View app activity summary (last 7d).

**UI Notes:**

* Table view of apps with environment tags.
* App detail page with tabs (Overview, Keys, Webhooks, Logs).

---

### 3.3 API Keys

**User Story:**
As a developer, I want to issue and manage API keys with scopes so I can secure access.

**Acceptance Criteria:**

* Create new API key (label + scopes).
* Rotate/revoke keys.
* Copy to clipboard with warning banner.
* Show usage stats: requests today, last used, error rate.
* Audit log of key events.

**UI Notes:**

* Key list with environment badge.
* Drawer/modal for create/rotate actions.

---

### 3.4 Logs

**User Story:**
As a developer, I want to filter logs by status and endpoint so I can debug integrations.

**Acceptance Criteria:**

* Search logs by path, IP, or key.
* Filter by status code group (2xx, 4xx, 5xx).
* Expandable log entry: request, response, headers.
* Pagination for large datasets.
* Export CSV/JSON/PDF.

**UI Notes:**

* Tabbed view: **API Logs** | **Webhook Logs**.
* Color-coded status badges.

---

### 3.5 Webhooks

**User Story:**
As an admin, I want to manage webhooks so my systems are notified when analyses complete.

**Acceptance Criteria:**

* Add/edit/delete webhook endpoints.
* Choose subscribed events.
* Delivery logs: timestamp, status code, payload.
* Retry failed deliveries.
* Test webhook button.

**UI Notes:**

* Webhook list with success % indicator.
* Delivery log expandable cards.

---

### 3.6 Team Management

**User Story:**
As an owner, I want to invite team members with roles so I can delegate responsibilities.

**Acceptance Criteria:**

* Invite by email.
* Assign role (Owner, Admin, Analyst, Viewer).
* Edit role or remove member.
* Track join date and status (active/invited).
* Team activity log.

**UI Notes:**

* Table with role badges.
* Role permissions matrix modal.

---

### 3.7 Customer Management (New)

**User Story:**
As an analyst, I want to view end-customer data so I can interpret their behaviors.

**Acceptance Criteria:**

* Search/filter customers (ID, external ref).
* View customer profile: transactions, analyses, drift history, risk flags.
* Merge duplicates / archive inactive customers.
* Export customer report.

**UI Notes:**

* Customer table with personas and risk flags columns.
* Detail page with tabs: **Transactions | Persona | Risk | Drift**.

---

### 3.8 Customer Intelligence

**User Story:**
As an analyst, I want to see persona and craving distributions so I can understand customer bases.

**Acceptance Criteria:**

* Persona distribution chart (pie/bar).
* Craving type breakdown with confidence scores.
* Drift alert feed.
* Demographic overlays (region, age, gender).
* Contextual persona timeline.

**UI Notes:**

* Multi-chart dashboard with filters.

---

### 3.9 Risk & Compliance

**User Story:**
As a compliance officer, I want anomaly and sanctions detection tools so I can meet regulatory needs.

**Acceptance Criteria:**

* Anomaly detection chart.
* Forensic lens (network mapping visualization).
* SAR draft builder.
* PEP/sanctions check list.
* Export compliance report.

**UI Notes:**

* Graph visualization for relationships.
* Case builder panel.

---

### 3.10 Reports & Exports

**User Story:**
As an analyst, I want prebuilt and custom reports so I can share insights.

**Acceptance Criteria:**

* Generate standard reports (usage, personas, anomalies).
* Build custom report queries.
* Export CSV, Excel, JSON, PDF.
* Schedule delivery (email, SFTP).

**UI Notes:**

* Report templates list.
* Scheduler UI with cron-like presets.

---

### 3.11 Billing & Account

**User Story:**
As an owner, I want to manage subscriptions and invoices so I can track costs.

**Acceptance Criteria:**

* Current plan overview (limits, usage).
* Usage-based billing calculator.
* Invoices list (PDF download).
* Add/remove payment methods.
* Alerts for approaching quotas.

**UI Notes:**

* Billing summary card + invoice table.

---

### 3.12 Support & Help

**User Story:**
As a partner, I want support options so I can resolve issues quickly.

**Acceptance Criteria:**

* Knowledge base search.
* Submit tickets.
* Live chat widget.
* API documentation links.
* Training/certification resources.

**UI Notes:**

* Sidebar with tabs: Knowledge Base | Tickets | Chat.

---

## 4. Cross-Cutting Requirements

* **Authentication**: JWT sessions with MFA, SSO later.
* **RBAC**: Role-based UI visibility.
* **Multi-tenancy**: Enforced isolation across tenants.
* **Audit Logging**: All sensitive actions logged.
* **Real-time Updates**: SSE/WebSocket for jobs/logs.
* **Accessibility**: ARIA support, keyboard nav.
* **Responsiveness**: Desktop-first, optimized for tablet/mobile.

---

## 5. Roadmap Phases

* **Phase 1**: Integrate existing modules with Partner API (keys, logs, webhooks).
* **Phase 2**: Customer Management + Customer Intelligence.
* **Phase 3**: Risk & Compliance + Reports.
* **Phase 4**: Billing & Support.
* **Phase 5**: Security hardening (RBAC, audit trails, multi-tenant).

---

✅ This PRD gives the **Partner Dashboard team a detailed blueprint**: every module framed as user stories, acceptance criteria, and UI notes, with a roadmap tied to Partner API dependencies.
