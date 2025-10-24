# **Partner Dashboard - Implementation Workplan**

**Last Updated:** October 24, 2025  
**Goal:** Align dashboard to PRD requirements while maintaining design autonomy

---

## **Current Status Summary**

### ✅ **Existing (6 modules)**

- Home/Overview
- API Logs
- Webhooks
- API Keys
- Team Management
- Settings

### ❌ **Missing (6 modules - Required by PRD)**

- Projects & Apps
- Customer Management
- Customer Intelligence
- Risk & Compliance
- Reports & Exports
- Billing & Account
- Support & Help

---

## **Phase 1: Navigation & Structure** ⏱️ 2-3 hours

### **Task 1.1: Update Sidebar Navigation**

- [ ] Add new menu items for all PRD modules
- [ ] Organize into logical groups:
  - **Core**: Overview, Projects & Apps
  - **Development**: API Keys, Logs, Webhooks
  - **Intelligence**: Customers, Customer Intelligence, Risk & Compliance
  - **Management**: Reports, Billing, Team
  - **Support**: Help & Support, Settings
- [ ] Add section separators with labels
- [ ] Add icons for new modules (from lucide-react)
- [ ] Maintain glass morphism design
- [ ] Test navigation on collapsed/expanded states

**Files to Edit:**

- `/src/components/Sidebar.tsx`

**Estimated Time:** 1 hour

---

### **Task 1.2: Create Placeholder Pages**

- [ ] Create `/src/app/projects/page.tsx`
- [ ] Create `/src/app/customers/page.tsx`
- [ ] Create `/src/app/intelligence/page.tsx`
- [ ] Create `/src/app/compliance/page.tsx`
- [ ] Create `/src/app/reports/page.tsx`
- [ ] Create `/src/app/billing/page.tsx`
- [ ] Create `/src/app/support/page.tsx`
- [ ] Each page: Basic layout with DashboardLayout wrapper
- [ ] Each page: "Coming Soon" or skeleton UI
- [ ] Test all routes are accessible

**Files to Create:**

- 7 new page files

**Estimated Time:** 1 hour

---

## **Phase 2: Data Sources** ⏱️ 3-4 hours

### **Task 2.1: Projects & Apps Data Source**

- [ ] Create `/src/data/projects.ts`
- [ ] Define TypeScript interfaces:
  - `Project` (id, name, description, createdAt, appCount)
  - `App` (id, projectId, name, environment, status, apiCalls, webhooks, ipWhitelist)
  - `ProjectsData` (projects, apps, stats)
- [ ] Create `getProjectsData()` function
- [ ] Create `getAppDetails(appId)` function
- [ ] Mock data: 3 projects, 5-7 apps
- [ ] Include app activity summaries

**Estimated Time:** 45 minutes

---

### **Task 2.2: Customer Management Data Source**

- [ ] Create `/src/data/customers.ts`
- [ ] Define TypeScript interfaces:
  - `Customer` (id, externalRef, name, email, status, lastAnalysis, riskLevel, persona)
  - `CustomerTransaction` (id, date, amount, category, merchantName)
  - `CustomerAnalysis` (personaType, cravingProfile, confidence, driftIndex)
  - `CustomerDetail` (customer, transactions, analyses, riskFlags)
- [ ] Create `getCustomersData(filters)` function
- [ ] Create `getCustomerDetail(customerId)` function
- [ ] Mock data: 20-30 customers with full profiles
- [ ] Include transaction history, persona evolution

**Estimated Time:** 1 hour

---

### **Task 2.3: Customer Intelligence Data Source**

- [ ] Create `/src/data/intelligence.ts`
- [ ] Define TypeScript interfaces:
  - `PersonaDistribution` (type, count, percentage, trend)
  - `CravingProfile` (type, percentage, confidence, description)
  - `DriftAlert` (customerId, previousPersona, currentPersona, driftScore, timestamp)
  - `DemographicData` (ageGroup, gender, region, income, personaType, count)
  - `IntelligenceData` (personas, cravings, driftAlerts, demographics)
- [ ] Create `getIntelligenceData(timeRange, filters)` function
- [ ] Mock data: Persona distributions, craving breakdowns, drift timeline
- [ ] Include contextual persona tracking data

**Estimated Time:** 1 hour

---

### **Task 2.4: Risk & Compliance Data Source**

- [ ] Create `/src/data/compliance.ts`
- [ ] Define TypeScript interfaces:
  - `Anomaly` (id, customerId, type, severity, confidence, timestamp, details)
  - `NetworkNode` (id, customerId, name, riskScore, connections)
  - `SARDraft` (id, customerId, reasons, narrative, status, createdAt)
  - `PEPCheck` (customerId, name, matchType, confidence, source)
  - `ComplianceData` (anomalies, network, sarDrafts, pepChecks, stats)
- [ ] Create `getComplianceData(filters)` function
- [ ] Create `generateSARDraft(customerId, reasons)` function
- [ ] Mock data: Anomalies, network relationships, PEP/sanctions results
- [ ] Include forensic lens network data

**Estimated Time:** 1 hour

---

### **Task 2.5: Reports & Exports Data Source**

- [ ] Create `/src/data/reports.ts`
- [ ] Define TypeScript interfaces:
  - `ReportTemplate` (id, name, description, type, parameters)
  - `Report` (id, templateId, name, status, createdAt, downloadUrl)
  - `ReportSchedule` (id, templateId, frequency, recipients, nextRun)
  - `ReportsData` (templates, reports, schedules)
- [ ] Create `getReportsData()` function
- [ ] Create `generateReport(templateId, params)` function
- [ ] Create `scheduleReport(templateId, schedule)` function
- [ ] Mock data: 5-7 report templates, recent reports, active schedules

**Estimated Time:** 45 minutes

---

### **Task 2.6: Billing Data Source**

- [ ] Create `/src/data/billing.ts` (or expand existing settings.ts)
- [ ] Define TypeScript interfaces:
  - `BillingPlan` (name, tier, limits, pricing, features)
  - `Invoice` (id, date, amount, status, pdfUrl, items)
  - `UsageMetrics` (apiCalls, customers, storage, bandwidth, limit, percentage)
  - `PaymentMethod` (id, type, last4, expiryDate, isDefault)
  - `BillingData` (plan, usage, invoices, paymentMethods, alerts)
- [ ] Create `getBillingData()` function
- [ ] Create `addPaymentMethod()`, `updatePlan()` functions
- [ ] Mock data: Current plan, usage stats, invoice history
- [ ] Include overage alerts logic

**Estimated Time:** 45 minutes

---

### **Task 2.7: Support Data Source**

- [ ] Create `/src/data/support.ts`
- [ ] Define TypeScript interfaces:
  - `SupportTicket` (id, subject, status, priority, createdAt, messages)
  - `KnowledgeArticle` (id, title, category, content, helpful, views)
  - `SupportData` (tickets, articles, categories)
- [ ] Create `getSupportData()` function
- [ ] Create `createTicket(subject, description)` function
- [ ] Create `searchArticles(query)` function
- [ ] Mock data: Support tickets, knowledge base articles

**Estimated Time:** 30 minutes

---

## **Phase 3: Core Pages Implementation** ⏱️ 8-10 hours

### **Task 3.1: Projects & Apps Page**

- [ ] Design app/project card layout
- [ ] Create project list view with stats
- [ ] Add "Create New Project" modal
- [ ] Add "Create New App" modal within projects
- [ ] Show app environment badges (Production, Staging, Dev)
- [ ] Display app activity metrics (API calls, webhooks, last used)
- [ ] Add app settings panel (IP whitelist, rate limits)
- [ ] Implement search and filters
- [ ] Add animations and glass morphism styling
- [ ] Connect to data source with useEffect
- [ ] Add loading states

**Files to Edit:**

- `/src/app/projects/page.tsx`

**Estimated Time:** 2.5 hours

---

### **Task 3.2: Customer Management Page**

- [ ] Design customer table with columns:
  - Customer ID, Name, Email, Last Analysis, Persona, Risk Level, Status
- [ ] Add search by ID/name/email
- [ ] Add filters: Risk Level, Persona Type, Status
- [ ] Add customer detail modal/page with tabs:
  - Overview, Transactions, Analyses, Risk Flags, Drift History
- [ ] Display transaction timeline
- [ ] Show persona evolution chart
- [ ] Add merge/archive actions
- [ ] Add export customer report button
- [ ] Implement pagination
- [ ] Connect to data source
- [ ] Add loading states and animations

**Files to Edit:**

- `/src/app/customers/page.tsx`

**Estimated Time:** 3 hours

---

### **Task 3.3: Customer Intelligence Dashboard**

- [ ] Create persona distribution chart (donut/pie chart)
- [ ] Create craving types breakdown (bar chart)
- [ ] Add drift alerts timeline visualization
- [ ] Create demographic overlay filters
- [ ] Add contextual persona tracking table
- [ ] Time range selector (24h, 7d, 30d, 90d)
- [ ] Add confidence score indicators
- [ ] Create trend indicators (up/down arrows)
- [ ] Add drill-down capability (click persona → see customers)
- [ ] Implement SVG charts with Framer Motion animations
- [ ] Connect to intelligence data source
- [ ] Add loading skeletons

**Files to Edit:**

- `/src/app/intelligence/page.tsx`

**Estimated Time:** 3 hours

---

### **Task 3.4: Risk & Compliance Dashboard**

- [ ] Create anomaly detection chart (timeline/heatmap)
- [ ] Build network mapping visualization (force-directed graph)
- [ ] Add PEP/sanctions check results table
- [ ] Create SAR draft builder panel
- [ ] Add severity filters (Low, Medium, High, Critical)
- [ ] Add anomaly type filters
- [ ] Show customer risk scores
- [ ] Add "Generate SAR Draft" button with form
- [ ] Display network relationship connections
- [ ] Add export compliance report button
- [ ] Connect to compliance data source
- [ ] Add animations for graph interactions

**Files to Edit:**

- `/src/app/compliance/page.tsx`

**Estimated Time:** 3.5 hours

---

## **Phase 4: Secondary Pages Implementation** ⏱️ 6-7 hours

### **Task 4.1: Reports & Exports Page**

- [ ] Create report templates grid/list
- [ ] Add "Generate Report" modal with parameter inputs
- [ ] Show recent reports table with status
- [ ] Add download buttons for completed reports
- [ ] Create report scheduler UI
- [ ] Add frequency selector (Daily, Weekly, Monthly, Custom cron)
- [ ] Add recipient email inputs
- [ ] Show active schedules table
- [ ] Add edit/delete schedule actions
- [ ] Connect to reports data source
- [ ] Add loading states for report generation

**Files to Edit:**

- `/src/app/reports/page.tsx`

**Estimated Time:** 2.5 hours

---

### **Task 4.2: Billing & Account Page**

- [ ] Create current plan overview card
- [ ] Display usage metrics with progress bars
- [ ] Add usage-based cost calculator
- [ ] Create invoices table (date, amount, status, download)
- [ ] Show payment methods list
- [ ] Add "Add Payment Method" modal
- [ ] Display overage alerts prominently
- [ ] Add "Upgrade Plan" button with plan comparison
- [ ] Show billing cycle and next charge date
- [ ] Connect to billing data source
- [ ] Add animations for usage meters

**Files to Edit:**

- `/src/app/billing/page.tsx`

**Estimated Time:** 2 hours

---

### **Task 4.3: Support & Help Page**

- [ ] Create knowledge base search bar
- [ ] Display article categories
- [ ] Show featured/popular articles
- [ ] Create ticket submission form
- [ ] Display open tickets table with status
- [ ] Add ticket detail view with message thread
- [ ] Integrate "API Documentation" link
- [ ] Add "Live Chat" button (placeholder/widget)
- [ ] Show training resources section
- [ ] Connect to support data source
- [ ] Add search functionality for articles

**Files to Edit:**

- `/src/app/support/page.tsx`

**Estimated Time:** 2 hours

---

## **Phase 5: Enhancements & Polish** ⏱️ 4-5 hours

### **Task 5.1: Home/Overview Enhancements**

- [ ] Update stat cards to match PRD (Active Customers, Drift Alerts, Risk Flags)
- [ ] Add live job tracker widget
- [ ] Add system health status widget
- [ ] Make stat cards clickable (drill-down to modules)
- [ ] Connect to dashboard data source (remove hardcoded data)
- [ ] Add useEffect for data fetching
- [ ] Add loading states
- [ ] Test time range filters update data correctly

**Files to Edit:**

- `/src/app/page.tsx`

**Estimated Time:** 1.5 hours

---

### **Task 5.2: Integrate Data Sources**

- [ ] Connect API Keys page to apiKeys.ts
- [ ] Connect Logs page to logs.ts
- [ ] Connect Webhooks page to webhooks.ts
- [ ] Connect Team page to team.ts
- [ ] Connect Settings page to settings.ts
- [ ] Add useEffect hooks for all pages
- [ ] Add loading states for all pages
- [ ] Test filter/search functionality with data sources

**Files to Edit:**

- `/src/app/api-keys/page.tsx`
- `/src/app/logs/page.tsx`
- `/src/app/webhooks/page.tsx`
- `/src/app/team/page.tsx`
- `/src/app/settings/page.tsx`

**Estimated Time:** 2 hours

---

### **Task 5.3: Error Handling & Edge Cases**

- [ ] Add error boundaries for each module
- [ ] Add error states for failed API calls
- [ ] Add empty states (no data)
- [ ] Add retry mechanisms
- [ ] Test pagination edge cases
- [ ] Test filter combinations
- [ ] Add toast notifications for actions (create, delete, update)
- [ ] Test responsive behavior on smaller screens

**Files to Edit:**

- All page files

**Estimated Time:** 1.5 hours

---

## **Phase 6: Export & Real-time Features** ⏱️ 3-4 hours

### **Task 6.1: Export Functionality**

- [ ] Implement CSV export for tables (customers, logs, webhooks)
- [ ] Implement PDF export for reports
- [ ] Add "Export" button to all relevant pages
- [ ] Create export utility functions
- [ ] Add loading states during export
- [ ] Test export with large datasets

**Files to Create:**

- `/src/utils/export.ts`

**Files to Edit:**

- Multiple page files

**Estimated Time:** 2 hours

---

### **Task 6.2: Real-time Updates (Optional)**

- [ ] Add auto-refresh for logs page
- [ ] Add auto-refresh for webhooks delivery
- [ ] Add live job status updates
- [ ] Add WebSocket/SSE placeholder
- [ ] Test auto-refresh intervals
- [ ] Add pause/resume controls

**Files to Edit:**

- `/src/app/logs/page.tsx`
- `/src/app/webhooks/page.tsx`
- `/src/app/page.tsx` (job tracker)

**Estimated Time:** 2 hours

---

## **Phase 7: Testing & Documentation** ⏱️ 2-3 hours

### **Task 7.1: Manual Testing**

- [ ] Test all navigation links
- [ ] Test all filters and search functionality
- [ ] Test all modals and forms
- [ ] Test pagination on all pages
- [ ] Test time range selectors
- [ ] Test data refresh on filter changes
- [ ] Test mobile responsiveness
- [ ] Test keyboard navigation
- [ ] Test accessibility (screen readers)

**Estimated Time:** 1.5 hours

---

### **Task 7.2: Update Documentation**

- [ ] Update CURRENT_IMPLEMENTATION_STATUS.md
- [ ] Add screenshots to documentation
- [ ] Document data source structure
- [ ] Document component props
- [ ] Create API integration guide (for when ready)
- [ ] Update README with setup instructions

**Files to Edit:**

- `/CURRENT_IMPLEMENTATION_STATUS.md`
- `/README.md`

**Estimated Time:** 1 hour

---

## **Total Estimated Time: 28-35 hours**

---

## **Priority Order**

### **🔴 Critical (Must Have)**

1. Phase 1: Navigation & Structure
2. Phase 2: All Data Sources
3. Task 3.2: Customer Management
4. Task 3.3: Customer Intelligence
5. Task 3.4: Risk & Compliance
6. Task 5.1: Home Enhancements
7. Task 5.2: Integrate Existing Pages

### **🟡 High Priority (Should Have)**

8. Task 3.1: Projects & Apps
9. Task 4.1: Reports & Exports
10. Task 4.2: Billing
11. Task 6.1: Export Functionality

### **🟢 Medium Priority (Nice to Have)**

12. Task 4.3: Support & Help
13. Task 5.3: Error Handling
14. Task 6.2: Real-time Updates
15. Phase 7: Testing & Documentation

---

## **Dependencies**

- **Phase 2 must complete before Phase 3-4** (pages need data sources)
- **Phase 1 can run in parallel with Phase 2**
- **Phase 5 depends on Phase 3-4 completion**
- **Phase 6-7 are final polish phases**

---

## **Success Criteria**

✅ All 12 PRD modules have functioning pages  
✅ All pages have data sources connected  
✅ Navigation includes all modules with proper organization  
✅ Design maintains glass morphism aesthetic  
✅ All charts use trading-style visualizations  
✅ Loading states implemented everywhere  
✅ Export functionality works for key pages  
✅ No TypeScript errors  
✅ Responsive on desktop (primary target)  
✅ Documentation updated

---

## **Notes**

- **Design Autonomy:** Maintain current glass morphism, gradients, animations, and trading-style charts
- **TypeScript First:** All data sources must have comprehensive interfaces
- **Consistent Patterns:** Follow established patterns from existing pages
- **Mock Data:** All data sources use realistic mock data with 100ms delay
- **Future-Ready:** Structure allows easy replacement with real API calls

---

**Ready to begin implementation? Start with Phase 1, Task 1.1!** 🚀
