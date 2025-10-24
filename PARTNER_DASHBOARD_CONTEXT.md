Perfect — I understand. You want a **separate, detailed document for the Dashboard UI**, now renamed to **Partner Dashboard**, that explicitly:

* Captures the **current state**.
* Expands the **missing modules**.
* Aligns them with the **Partner API** (the internal-facing API that powers the dashboard).
* Ensures partners can fully manage their apps, customers, teams, billing, support, etc.

Here’s a structured draft of that **Partner Dashboard UI Context Document**:

---

# Sonaqor Partner Dashboard — Context Document

## 1. Purpose

The Partner Dashboard is the **control center** for organizations (tenants) integrating with Sonaqor. It provides a **UI layer over the Partner API** to configure, manage, and monitor every aspect of integration — from apps and API keys, to customer intelligence, compliance workflows, and billing.

This document defines the **UI modules, flows, and data dependencies** required to close existing gaps.

---

## 2. High-Level Workflow

1. **Tenant onboarding** → Create projects, apps, and invite team members.
2. **API key issuance** → Scoped keys for integration.
3. **Data ingestion** → Partners upload statements via Public API.
4. **Analysis & results** → Dashboard visualizes customer intelligence and compliance signals.
5. **Monitoring** → Logs, usage, and webhook delivery monitoring.
6. **Customer management** → Drill-down into partner’s end-customers.
7. **Reports & billing** → Exports, invoices, and usage tracking.
8. **Support** → Docs, tickets, and training resources.

---

## 3. Dashboard Modules

### 3.1 Home/Overview

* **Current**: Stat cards, line charts, endpoint table, activity feed.
* **Gap Enhancements**:

  * Link cards to deeper modules (click → drill-down).
  * Add live job tracker (ingestions, analyses).
  * “System Health” status widget (API uptime, webhook delivery rate).

---

### 3.2 Apps & Projects

* **Current**: Missing.
* **Expected Features**:

  * Create/manage projects.
  * Create/manage apps within projects.
  * Configure app-level settings (environments, webhooks, IP allowlists).
  * View app activity summaries.

**API Dependencies**:

* `POST /partner/projects`
* `POST /partner/apps`
* `GET /partner/apps/:id/overview`

---

### 3.3 API Key Management

* **Current**: Page exists, mock data only.
* **Enhancements**:

  * Create, rotate, revoke keys.
  * Assign permission scopes.
  * Show usage stats (requests, last used, errors).
  * Audit logs of key changes.

**API Dependencies**:

* `POST /partner/api-keys`
* `PATCH /partner/api-keys/:id/rotate`
* `GET /partner/api-keys/:id/usage`

---

### 3.4 Logs

* **Current**: UI built, hardcoded entries.
* **Enhancements**:

  * Connect to Partner API for live logs.
  * Add pagination, search, export (CSV, JSON, PDF).
  * Split into **API logs** and **Webhook logs** tabs.

**API Dependencies**:

* `GET /partner/logs?filters`
* `GET /partner/webhooks/logs`

---

### 3.5 Webhooks

* **Current**: UI exists.
* **Enhancements**:

  * Register/edit/delete webhook endpoints.
  * Choose subscribed event types.
  * Delivery retry controls.
  * Live success/failure heatmap.

**API Dependencies**:

* `POST /partner/webhooks`
* `GET /partner/webhooks/:id/logs`
* `POST /partner/webhooks/test`

---

### 3.6 Team Management

* **Current**: Page exists, mock data only.
* **Enhancements**:

  * Invite members via email.
  * Assign roles and custom permissions.
  * Role-based UI visibility.
  * Team activity logs.

**API Dependencies**:

* `POST /partner/team/invite`
* `PATCH /partner/team/:id/role`
* `DELETE /partner/team/:id`

---

### 3.7 Customer Management (New)

* **Gaps Identified**: Not implemented at all.
* **Features**:

  * Search/manage end-customers linked to a tenant’s apps.
  * View per-customer:

    * Transaction history.
    * Latest persona & craving profile.
    * Risk flags & drift index.
  * Merge duplicates / archive inactive customers.

**API Dependencies**:

* `GET /partner/customers`
* `GET /partner/customers/:id/analyses`
* `PATCH /partner/customers/:id`

---

### 3.8 Customer Intelligence

* **Missing** (HIGH priority).
* **Features**:

  * Persona distribution chart.
  * Engagement craving profile breakdown.
  * Drift alerts (timeline visualization).
  * Demographic overlays (age, gender, region).
  * Contextual persona tracking.

**API Dependencies**:

* `GET /partner/analytics/personas`
* `GET /partner/analytics/cravings`
* `GET /partner/analytics/drift`

---

### 3.9 Risk & Compliance

* **Missing**.
* **Features**:

  * Anomaly detection dashboard.
  * Forensic lens (network mapping).
  * PEP/sanctions results.
  * Draft SAR reports.
* **UI**: Graph visualizations, flag tables, case builder.

**API Dependencies**:

* `GET /partner/compliance/anomalies`
* `GET /partner/compliance/network`
* `POST /partner/compliance/sar-draft`

---

### 3.10 Reports & Exports

* **Missing**.
* **Features**:

  * Prebuilt report templates (personas, anomalies, API usage).
  * Custom report builder.
  * Export formats (CSV, Excel, JSON, PDF).
  * Scheduled report delivery via email/SFTP.

**API Dependencies**:

* `POST /partner/reports/generate`
* `GET /partner/reports/:id/export`
* `POST /partner/reports/schedule`

---

### 3.11 Billing & Account

* **Partial** (billing info in settings only).
* **Enhancements**:

  * Plan overview (current plan, limits, usage).
  * Usage-based billing calculator.
  * Invoices + payment methods.
  * Overage alerts.

**API Dependencies**:

* `GET /partner/billing/plan`
* `GET /partner/billing/invoices`
* `POST /partner/billing/payment-method`

---

### 3.12 Support & Help

* **Missing**.
* **Features**:

  * Knowledge base search.
  * Ticket submission.
  * Live chat widget.
  * Training/certification material.
  * API documentation access.

**API Dependencies**:

* `POST /partner/support/tickets`
* `GET /partner/support/articles`

---

## 4. Cross-Cutting Features

* **RBAC**: Every UI component tied to roles/permissions.
* **Multi-Tenancy**: Data isolation per tenant.
* **Audit Logging**: Every key/team/billing change logged.
* **Real-time Updates**: WebSocket/SSE for jobs, logs, and webhook deliveries.
* **Exports**: CSV/Excel/PDF across modules.

---

## 5. Roadmap Priorities

1. **Phase 1**: Complete current modules (integrate APIs, add loading/error states).
2. **Phase 2**: Customer Management + Customer Intelligence.
3. **Phase 3**: Risk & Compliance + Reports.
4. **Phase 4**: Billing, Support, and Exports.
5. **Phase 5**: Security (RBAC, audit logs, multi-tenant hardening).

---

✅ This doc gives you a **blueprint for the Dashboard UI**, directly tied to the **Partner API** surface that should power it.
