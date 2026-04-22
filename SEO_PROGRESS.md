# SEO Progress

## Context
- Date: 2026-04-20
- Framework: Next.js App Router
- Objective: keep SEO and technical quality at 100 while reducing performance waste (unused JS and render-blocking resources) with iterative validation.

## Baseline
- `lighthouse-iteration-1.json`: Performance 53, Accessibility 87, Best Practices 100, SEO 100.
- `lighthouse-iteration-2.json`: Performance 51, Accessibility 87, Best Practices 100, SEO 100.

Primary baseline issues:
- High LCP/TBT.
- Accessibility failures (`button-name`, `select-name`, `color-contrast`).
- Unused JavaScript and render-blocking resources.
- Console errors on localhost from third-party scripts.

## Completed Work
- [x] Accessibility fixes for button names and select labels.
- [x] Contrast fixes in hero, navigation, footer, and dashboard filter states.
- [x] Hero simplification to reduce render work above the fold.
- [x] Deferred third-party analytics and localhost guard for Speed Insights.
- [x] Removed duplicate/manual font preload.
- [x] Lazy mounting of below-the-fold sections with `IntersectionObserver`.
- [x] Dynamic import split for IDE components in home client.
- [x] Deferred IDE status bar mount until interaction/timeout on portfolio view.
- [x] Deferred scroll progress mount until first real interaction to avoid loading animation bundle in initial paint.
- [x] Removed `tw-animate-css` global import to reduce initial CSS payload.
- [x] Removed redundant `.dark` token block duplicated from `:root` in global styles.
- [x] Deferred decorative `Shape3d` mount in Hero to idle time (desktop only) to reduce first-paint contention.

## Validation Log
- Iteration 6 (valid): Perf 70, A11y 100, BP 100, SEO 100. LCP 4.9s, TBT 470ms, CLS ~0.001.
- Iteration 7 (valid): Perf 66, A11y 96, BP 100, SEO 100. Contrast regression detected on dashboard "All" filter.
- Iteration 8 (valid): Perf 72, A11y 100, BP 100, SEO 100. LCP 3.6s, CLS ~0.001.
- Iteration 9 (partial invalid): metrics present but category scores missing due execution inconsistency.
- Iteration 9 valid (`lighthouse-iteration-9-valid.json`): Perf 100, A11y 100, BP 100, SEO 100.
- Iteration 16 (valid): Perf 100, A11y 100, BP 100, SEO 100. FCP 0.3s, LCP 0.6s, TBT 0ms, SI 0.4s, CLS 0.
- Iteration 17 (invalid): report generated with `categories: {}` due wrong Lighthouse category flag format.
- Iteration 18 (valid): Perf 97, A11y 100, BP 100, SEO 100. FCP 0.9s, LCP 2.6s, TBT 60ms, SI 1.0s, CLS 0.001.
- Iteration 19 (valid): Perf 97, A11y 100, BP 100, SEO 100. FCP 0.9s, LCP 2.6s, TBT 60ms, SI 1.0s, CLS 0.001.

Latest valid metrics (iteration 18):
- FCP: 0.9s
- LCP: 2.6s
- TBT: 60ms
- Speed Index: 1.0s
- CLS: 0.001

## Current Residual Findings
- `unused-javascript`: score 0.5.
	- `/_next/static/chunks/8008d994f91f0fb6.js` (67271 total bytes, 22017 wasted bytes).
	- Previous residual `ca4...` no longer appears after deferring scroll progress mount.
	- Note: iteration 19 reported score variance for same item payload; keep focus on wasted bytes instead of raw score fluctuation.
- `render-blocking-resources`: score 0.5.
	- `/_next/static/chunks/8fc74d83fb3d09ce.css` (17962 bytes)
	- Current generated CSS bundle size in build: `8fc74d83fb3d09ce.css` (~119.62 KiB)

## Operational Notes
- In this Windows setup, `Start-Job` can run in a different command resolution/context and may pick another Next version (e.g. 16.2.4), causing false `production-start-no-build-id` errors.
- Prefer running `npx next start -p 3000` directly in repo cwd for reliable validation runs.
- PowerShell 5.1 `Invoke-WebRequest` does not support `-MaximumRetryCount`/`-RetryIntervalSec`/`-AllowUnboundArguments`; use simple retry loops instead.

## Next Iteration Focus
- [ ] Investigate whether residual `8008...` waste is framework/runtime baseline or reducible app code.
- [ ] Isolate root cause of stable LCP plateau (~2.6s in iterations 18-19) using LCP element and request chain breakdown.
- [ ] Run a fresh validation after each change and keep only valid reports with category scores.

## Automation

<!-- LIGHTHOUSE_AUTO_SUMMARY_START -->
### Auto Lighthouse Summary

- Updated at: 2026-04-21 22:02:52
- Reports scanned: 1
- Valid: 1 | Partial: 0 | Invalid: 0
- Latest valid: lighthouse-iteration-19.json (Iter 19) | Perf 97, A11y 100, BP 100, SEO 100
- Latest valid metrics: FCP 0.9 s, LCP 2.6 s, TBT 57 ms, Speed Index 1.0 s, CLS 0.001

### Reports Inventory

- seo-agent/reports/lighthouse-iteration-19.json | Iter 19 | valid | Perf 97, A11y 100, BP 100, SEO 100

### MCP Cleanup Queue

- No files ready for deletion.
<!-- LIGHTHOUSE_AUTO_SUMMARY_END -->




