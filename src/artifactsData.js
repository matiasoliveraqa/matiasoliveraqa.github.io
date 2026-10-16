/**
 * Data for QA Artifacts Showcase
 * Demonstrating the engineering deliverables of a Lead QA / Senior SDET
 */

export const artifacts = {
  bugReport: {
    title: "CRITICAL: Race condition in checkout causes double payment settlement without order creation",
    severity: "CRITICAL / P1",
    environment: "Staging v4.12.0 (Chromium 124, WebKit 17.4)",
    discoveredBy: "Automated Concurrency Fixture + Exploratory Edge Test",
    steps: [
      "1. Add item 'Enterprise SKU-99' to cart ($499.00).",
      "2. Proceed to checkout and submit valid credit card payload.",
      "3. Trigger rapid successive click on 'Authorize Payment' (< 180ms delta) or simulate network jitter during TLS handshake.",
      "4. Observe frontend state and backend ledger."
    ],
    actualResult: "Both payment gateway tokens get debited independently at the payment gateway, but backend ledger database rolls back due to duplicate key constraint, resulting in customer being charged $998.00 with ZERO order generated.",
    expectedResult: "Idempotency key enforcement on API gateway must discard the duplicate request with HTTP 409 or return the existing transaction record without duplicate debit.",
    reproRate: "100% under high network latency simulation (k6 / Charles Proxy throttling).",
    evidence: "cURL and Playwright trace attached. Video reproduction available in Allure build #148.",
    impact: "Direct financial discrepancy and customer friction in production."
  },
  testStrategy: {
    title: "Risk-Based Test Architecture: High-Volume CCaaS & Payment Platform",
    principles: [
      {
        name: "Testing Pyramid Distribution",
        detail: "70% Unit & Integration (API contract tests via Postman/Newman), 20% Automated E2E User Journeys (Playwright POM), 10% Risk-focused Exploratory & Chaos Testing."
      },
      {
        name: "Idempotency & Concurrency Validation",
        detail: "Every state-mutating transaction (payments, VoIP call state, SMS dispatch) must be tested against network timeouts, retries, and simultaneous duplicate requests."
      },
      {
        name: "Shift-Left CI/CD Quality Gates",
        detail: "Pull requests run automated linting, security scans, and headless Playwright sanity suites. Merge to main triggers full cross-browser regression matrix in parallel runners."
      },
      {
        name: "Continuous Observability & Flakiness Zero-Tolerance",
        detail: "Any flaky test is quarantined within 24 hours, analyzed with traces/video recordings, and refactored with resilient locator strategies (getByRole, getByTestId) instead of brittle XPath."
      }
    ]
  },
  ciPipeline: {
    title: "Enterprise CI/CD Quality Pipeline Architecture (GitHub Actions)",
    stages: [
      {
        step: "01. Trigger & Pre-flight",
        desc: "PR opened / commit pushed → Checkout code → Install dependencies with frozen lockfile (`npm ci`)."
      },
      {
        step: "02. Parallel Automated Matrix",
        desc: "Split test specs across 3 parallel workers: Chromium, Firefox, WebKit. Headless execution with auto-retry on network failures."
      },
      {
        step: "03. Artifacts & Observability",
        desc: "Generate Playwright HTML report, capture trace.zip on failure, and generate Allure TestOps metrics."
      },
      {
        step: "04. Quality Gate Check",
        desc: "PR is automatically blocked if any test fails or SLA threshold is exceeded. Summary markdown posted as PR comment."
      }
    ]
  }
};
