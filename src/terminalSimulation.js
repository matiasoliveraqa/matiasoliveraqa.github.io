/**
 * Interactive QA Terminal & Simulator
 * Lets hiring managers & engineering leads test-run Matías's automation suites in real-time.
 */

export const testSuites = {
  playwright: {
    name: 'Playwright E2E Suite',
    file: 'tests/e2e/checkout-flow.spec.ts',
    cmd: 'npx playwright test tests/e2e/checkout-flow.spec.ts --reporter=list,allure-playwright',
    lines: [
      { text: '$ npx playwright test tests/e2e/checkout-flow.spec.ts --workers=3', type: 'cmd' },
      { text: 'Running 6 tests using 3 workers across [chromium, firefox, webkit]', type: 'info' },
      { text: '  ✓ [chromium] › auth.setup.ts:12:3 › global authentication state saved (412ms)', type: 'success' },
      { text: '  ✓ [chromium] › checkout.spec.ts:19:5 › POM CheckoutPage: add item, fill shipping (820ms)', type: 'success' },
      { text: '  ✓ [firefox]  › checkout.spec.ts:19:5 › POM CheckoutPage: verify card validation (945ms)', type: 'success' },
      { text: '  ✓ [webkit]   › checkout.spec.ts:19:5 › POM CheckoutPage: cross-browser order confirmation (1.1s)', type: 'success' },
      { text: '  ✓ [chromium] › checkout.spec.ts:48:5 › Edge Case: network error handling & retry toast (680ms)', type: 'success' },
      { text: '  ✓ [firefox]  › checkout.spec.ts:48:5 › Intercept API /api/orders: mock 500 status fallback (590ms)', type: 'success' },
      { text: '', type: 'dim' },
      { text: '  6 passed (2.8s)', type: 'success' },
      { text: '  Allure results written to: allure-results/ (6 test cases, 0 flakes)', type: 'info' },
      { text: '  Artifact: playwright-report/index.html & trace.zip generated.', type: 'dim' }
    ]
  },
  api: {
    name: 'Payment API & Idempotency',
    file: 'tests/api/payments-idempotency.spec.ts',
    cmd: 'newman run postman/fintech-payments.collection.json -e env/prod-mock.json',
    lines: [
      { text: '$ newman run postman/fintech-payments.collection.json -e env/prod-mock.json', type: 'cmd' },
      { text: 'Fintech Payments & Gateway Idempotency Suite [v2.4]', type: 'info' },
      { text: '  → POST /v1/auth/token [200 OK, 114ms]', type: 'success' },
      { text: '      ✓ Response time is < 200ms', type: 'success' },
      { text: '      ✓ JWT Token matches RFC 7519 format', type: 'success' },
      { text: '  → POST /v1/payments [Idempotency-Key: a8f9-4bc2] [201 Created, 210ms]', type: 'success' },
      { text: '      ✓ Transaction ID exists and status is "AUTHORIZED"', type: 'success' },
      { text: '      ✓ Ledger balance decremented precisely', type: 'success' },
      { text: '  → REPEAT POST /v1/payments [Same Idempotency-Key: a8f9-4bc2] [200 OK, 95ms]', type: 'warn' },
      { text: '      ✓ Idempotent replay detected: No duplicate charge in database', type: 'success' },
      { text: '      ✓ Original transaction record returned with header "X-Cache-Replay: true"', type: 'success' },
      { text: '', type: 'dim' },
      { text: 'All 8 API assertions passed without defect. Data integrity verified via SQL check.', type: 'success' }
    ]
  },
  k6: {
    name: 'k6 Performance & Load SLA',
    file: 'tests/perf/stress-checkout.js',
    cmd: 'k6 run --vus 500 --duration 30s tests/perf/stress-checkout.js',
    lines: [
      { text: '$ k6 run --vus 500 --duration 30s tests/perf/stress-checkout.js', type: 'cmd' },
      { text: '          /\    |‾‾| /‾‾/ /‾/  ', type: 'dim' },
      { text: '     /\  /  \   |  |/  / / /   ', type: 'dim' },
      { text: '    /  \/    \  |     ( /   ‾‾\\  k6 v0.51.0 (https://k6.io/)', type: 'dim' },
      { text: '', type: 'dim' },
      { text: '  execution: local', type: 'info' },
      { text: '  script: tests/perf/stress-checkout.js', type: 'info' },
      { text: '  scenarios: (100.00%) 1 scenario, 500 max VUs, 30s max duration', type: 'info' },
      { text: '', type: 'dim' },
      { text: '     ✓ status is 200/201 ....................: 99.88%', type: 'success' },
      { text: '     ✓ p(95) latency < 200ms ................: 142ms [PASS]', type: 'success' },
      { text: '     ✓ transaction error rate < 0.5% ........: 0.12% [PASS]', type: 'success' },
      { text: '     checks .................................: 100.00% ✓ 14820   ✗ 0', type: 'success' },
      { text: '     http_req_duration ......................: avg=112ms min=48ms med=98ms max=420ms p(95)=142ms', type: 'info' },
      { text: '     http_reqs ..............................: 14,820 (494 req/s)', type: 'info' },
      { text: '', type: 'dim' },
      { text: '  All performance thresholds met SLA specifications.', type: 'success' }
    ]
  }
};

export function initTerminalSimulator() {
  const terminalBody = document.getElementById('terminal-body');
  const runBtn = document.getElementById('term-run-btn');
  const tabs = document.querySelectorAll('.term-tab');
  if (!terminalBody || !runBtn) return;

  let currentKey = 'playwright';
  let isRunning = false;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (isRunning) return;
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentKey = tab.dataset.suite;
      renderInitialTerminal(currentKey);
    });
  });

  function renderInitialTerminal(key) {
    const suite = testSuites[key];
    terminalBody.innerHTML = `
      <div class="term-line dim">// Selected Suite: ${suite.name} (${suite.file})</div>
      <div class="term-line cmd">$ ${suite.cmd}</div>
      <div class="term-line dim">// Ready. Click "Run Test Suite" above to execute simulated automated pipeline.</div>
    `;
  }

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    executeSimulation(currentKey);
  });

  function executeSimulation(key) {
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = `Running... <span class="arrow">⏳</span>`;
    terminalBody.innerHTML = '';

    const lines = testSuites[key].lines;
    let index = 0;

    function printNextLine() {
      if (index < lines.length) {
        const item = lines[index];
        const lineEl = document.createElement('div');
        lineEl.className = `term-line ${item.type}`;
        lineEl.textContent = item.text;
        terminalBody.appendChild(lineEl);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        index++;

        const delay = item.type === 'cmd' ? 400 : Math.floor(Math.random() * 120) + 70;
        setTimeout(printNextLine, delay);
      } else {
        isRunning = false;
        runBtn.disabled = false;
        runBtn.innerHTML = `Re-run Suite <span class="arrow">▶</span>`;
      }
    }

    printNextLine();
  }

  renderInitialTerminal(currentKey);
}
