/**
 * Interactive QA Test Runner with Visual Browser Execution
 * Drives a simulated Playwright browser viewport and synced live assertions.
 */

export function initTestRunner() {
  const runBtn = document.getElementById('run-suite-btn');
  const browserScreen = document.getElementById('browser-screen');
  const browserUrl = document.getElementById('browser-url');
  const assertionList = document.getElementById('assertion-list');
  const execTimeEl = document.getElementById('exec-time');
  const suiteStatusEl = document.getElementById('suite-status');
  const tabE2e = document.getElementById('tab-e2e');
  const tabPerf = document.getElementById('tab-perf');

  if (!runBtn || !browserScreen) return;

  let isRunning = false;
  let currentMode = 'e2e'; // 'e2e' or 'perf'

  tabE2e?.addEventListener('click', () => {
    if (isRunning) return;
    currentMode = 'e2e';
    tabE2e.classList.add('active');
    tabPerf?.classList.remove('active');
    resetToIdleE2E();
  });

  tabPerf?.addEventListener('click', () => {
    if (isRunning) return;
    currentMode = 'perf';
    tabPerf.classList.add('active');
    tabE2e?.classList.remove('active');
    resetToIdlePerf();
  });

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    if (currentMode === 'e2e') {
      runE2ESimulation();
    } else {
      runPerfSimulation();
    }
  });

  function resetToIdleE2E() {
    browserUrl.textContent = 'https://store-staging.internal/login';
    suiteStatusEl.textContent = 'READY';
    suiteStatusEl.className = 'runner-status ready';
    execTimeEl.textContent = '0.0s';
    runBtn.innerHTML = `Run Test Suite <span class="arrow">▶</span>`;

    browserScreen.innerHTML = `
      <div class="mock-browser-idle">
        <div class="idle-icon">⚡</div>
        <div class="idle-title">Playwright E2E Runner Ready</div>
        <div class="idle-desc">Click "Run Test Suite" to watch the automated journey interact with the live viewport.</div>
      </div>
    `;

    assertionList.innerHTML = `
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>auth.spec.ts › loginWithStandardUser()</span>
      </div>
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>inventory.spec.ts › addItemToCart("SKU-BACKPACK")</span>
      </div>
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>checkout.spec.ts › submitShippingAndPayment()</span>
      </div>
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>expect(orderHeader).toHaveText("THANK YOU FOR YOUR ORDER")</span>
      </div>
    `;
  }

  function resetToIdlePerf() {
    browserUrl.textContent = 'https://api-staging.internal/v1/payments/stress';
    suiteStatusEl.textContent = 'READY';
    suiteStatusEl.className = 'runner-status ready';
    execTimeEl.textContent = '0.0s';
    runBtn.innerHTML = `Run Load Benchmark <span class="arrow">▶</span>`;

    browserScreen.innerHTML = `
      <div class="mock-browser-idle">
        <div class="idle-icon">📈</div>
        <div class="idle-title">k6 Performance Benchmark Ready</div>
        <div class="idle-desc">Simulate 500 virtual users targeting high-concurrency payment APIs.</div>
      </div>
    `;

    assertionList.innerHTML = `
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>k6 SLA check › p(95) response time &lt; 200ms</span>
      </div>
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>k6 Reliability check › error rate &lt; 0.5%</span>
      </div>
      <div class="assertion-item pending">
        <span class="a-icon">○</span>
        <span>Fintech Idempotency check › 0 duplicate debits under load</span>
      </div>
    `;
  }

  function runE2ESimulation() {
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = `Running Suite... <span class="arrow">⏳</span>`;
    suiteStatusEl.textContent = 'EXECUTING';
    suiteStatusEl.className = 'runner-status executing';

    const t0 = performance.now();
    const timerInterval = setInterval(() => {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
      execTimeEl.textContent = `${elapsed}s`;
    }, 100);

    // Step 1: Login Form
    browserUrl.textContent = 'https://store-staging.internal/login';
    browserScreen.innerHTML = `
      <div class="mock-app-page fade-in">
        <div class="mock-login-box">
          <div class="mock-logo">ENTERPRISE STORE</div>
          <div class="mock-field active-field">
            <label>Username</label>
            <div class="mock-input typing">standard_user<span class="cursor">|</span></div>
          </div>
          <div class="mock-field">
            <label>Password</label>
            <div class="mock-input">••••••••••••</div>
          </div>
          <div class="mock-btn-sim clicked">Sign In →</div>
        </div>
      </div>
    `;

    setTimeout(() => {
      // Complete assertion 1
      updateAssertion(0, true, 'auth.spec.ts › login successful (340ms)');

      // Step 2: Product Catalog & Add to Cart
      browserUrl.textContent = 'https://store-staging.internal/inventory';
      browserScreen.innerHTML = `
        <div class="mock-app-page fade-in">
          <div class="mock-catalog-nav">
            <span class="nav-brand">Products</span>
            <span class="mock-cart-badge badge-pop">Cart (1)</span>
          </div>
          <div class="mock-products-grid">
            <div class="mock-prod-card selected">
              <div class="mock-prod-img"></div>
              <div class="mock-prod-name">Sauce Labs Backpack</div>
              <div class="mock-prod-price">$29.99</div>
              <div class="mock-add-btn added">✓ Added to Cart</div>
            </div>
            <div class="mock-prod-card">
              <div class="mock-prod-img"></div>
              <div class="mock-prod-name">Bike Light</div>
              <div class="mock-prod-price">$9.99</div>
              <div class="mock-add-btn">Add to Cart</div>
            </div>
          </div>
        </div>
      `;
    }, 1200);

    setTimeout(() => {
      // Complete assertion 2
      updateAssertion(1, true, 'inventory.spec.ts › item SKU-BACKPACK added, badge count = 1 (410ms)');

      // Step 3: Checkout Form Auto-fill
      browserUrl.textContent = 'https://store-staging.internal/checkout-step-one';
      browserScreen.innerHTML = `
        <div class="mock-app-page fade-in">
          <div class="mock-checkout-box">
            <div class="checkout-title">Checkout: Shipping Information</div>
            <div class="mock-form-row">
              <div class="mock-field"><label>First Name</label><div class="mock-input">Alex</div></div>
              <div class="mock-field"><label>Last Name</label><div class="mock-input">Vance</div></div>
            </div>
            <div class="mock-field"><label>Postal Code</label><div class="mock-input">11000</div></div>
            <div class="mock-btn-sim clicked" style="margin-top:14px">Continue to Overview →</div>
          </div>
        </div>
      `;
    }, 2400);

    setTimeout(() => {
      // Complete assertion 3
      updateAssertion(2, true, 'checkout.spec.ts › POM fillShippingInfo() & tax calculated (520ms)');

      // Step 4: Order Confirmation
      browserUrl.textContent = 'https://store-staging.internal/checkout-complete';
      browserScreen.innerHTML = `
        <div class="mock-app-page fade-in">
          <div class="mock-success-screen">
            <div class="mock-check-circle">✓</div>
            <div class="mock-success-h1">THANK YOU FOR YOUR ORDER</div>
            <div class="mock-success-sub">Order ID: #ORD-77491-E2E</div>
            <div class="mock-summary-card">
              <div class="s-row"><span>Item Total:</span><span>$29.99</span></div>
              <div class="s-row"><span>Tax (8%):</span><span>$2.40</span></div>
              <div class="s-row total"><span>Total:</span><span>$32.39</span></div>
            </div>
            <div class="mock-verified-pill">Allure Test Report Generated • Trace Verified</div>
          </div>
        </div>
      `;
    }, 3600);

    setTimeout(() => {
      // Complete assertion 4
      updateAssertion(3, true, 'expect(orderHeader).toHaveText("THANK YOU FOR YOUR ORDER") (210ms)');

      clearInterval(timerInterval);
      isRunning = false;
      runBtn.disabled = false;
      runBtn.innerHTML = `Re-run Suite <span class="arrow">↺</span>`;
      suiteStatusEl.textContent = 'ALL PASSED (4/4)';
      suiteStatusEl.className = 'runner-status passed';
    }, 4500);
  }

  function runPerfSimulation() {
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = `Benchmarking... <span class="arrow">⏳</span>`;
    suiteStatusEl.textContent = 'RAMPING UP';
    suiteStatusEl.className = 'runner-status executing';

    const t0 = performance.now();
    const timerInterval = setInterval(() => {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
      execTimeEl.textContent = `${elapsed}s`;
    }, 100);

    browserScreen.innerHTML = `
      <div class="mock-app-page fade-in" style="padding:24px;">
        <div class="perf-dashboard">
          <div class="perf-metric-row">
            <div class="perf-box">
              <span class="p-label">Active Virtual Users</span>
              <span class="p-value" id="perf-vu">120 VUs</span>
            </div>
            <div class="perf-box">
              <span class="p-label">p(95) Response Time</span>
              <span class="p-value good" id="perf-p95">118 ms</span>
            </div>
            <div class="perf-box">
              <span class="p-label">Throughput</span>
              <span class="p-value" id="perf-rps">485 req/s</span>
            </div>
          </div>
          <div class="perf-bar-chart">
            <div class="p-bar-label">Concurrency Stress Spectrum (500 max)</div>
            <div class="p-bar-track">
              <div class="p-bar-fill" id="perf-fill" style="width: 45%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      document.getElementById('perf-vu').textContent = '350 VUs';
      document.getElementById('perf-p95').textContent = '142 ms';
      document.getElementById('perf-rps').textContent = '820 req/s';
      document.getElementById('perf-fill').style.width = '78%';
      updateAssertion(0, true, 'p(95) latency SLA met: 142ms < 200ms boundary');
    }, 1400);

    setTimeout(() => {
      document.getElementById('perf-vu').textContent = '500 VUs';
      document.getElementById('perf-p95').textContent = '168 ms';
      document.getElementById('perf-rps').textContent = '1,120 req/s';
      document.getElementById('perf-fill').style.width = '100%';
      updateAssertion(1, true, 'Error rate 0.08% < 0.5% threshold');
    }, 2800);

    setTimeout(() => {
      updateAssertion(2, true, '1,000 duplicate POST requests evaluated: 100% Idempotent cache hit');
      clearInterval(timerInterval);
      isRunning = false;
      runBtn.disabled = false;
      runBtn.innerHTML = `Re-run Benchmark <span class="arrow">↺</span>`;
      suiteStatusEl.textContent = 'SLA VERIFIED';
      suiteStatusEl.className = 'runner-status passed';
    }, 4200);
  }

  function updateAssertion(index, passed, text) {
    const items = assertionList.querySelectorAll('.assertion-item');
    if (items[index]) {
      items[index].className = `assertion-item ${passed ? 'passed' : 'failed'}`;
      items[index].innerHTML = `
        <span class="a-icon">${passed ? '✓' : '✗'}</span>
        <span>${text}</span>
      `;
    }
  }

  // Initial state
  resetToIdleE2E();
}
