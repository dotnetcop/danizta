# Danizta

## [1.0.0] - 2026-02-23

### Added
- Initial release of the Danizta website.

---

## Security Concerns — Pending Fixes

### 🔴 High Severity

| # | Issue | File | Description | Fix |
|---|-------|------|-------------|-----|
| 1 | `innerHTML` usage | `js/script.js` (lines 141, 143, 151) | Nav toggle uses `innerHTML` to swap icons. This is a dangerous pattern — if dynamic content is ever introduced, it becomes an XSS vector. | Replace with `document.createElement()` and `replaceChildren()`. |
| 2 | Unsanitized `localStorage` → DOM | `index.html` (lines 26–29) | Values from `localStorage` are injected directly into `data-theme` and `data-palette` attributes without validation. An attacker who gains write access to `localStorage` (via XSS or shared origin) can inject arbitrary attribute values. | Validate against an allowlist (`['dark','light']` and `['default','slack','github','stripe']`) before applying. |

### 🟠 Medium Severity

| # | Issue | File | Description | Fix |
|---|-------|------|-------------|-----|
| 3 | No Subresource Integrity (SRI) on CDN resources | `index.html` (line 19) | Font Awesome is loaded from cdnjs without `integrity` or `crossorigin` attributes. If the CDN is compromised, malicious CSS can be injected. | Add `integrity="sha512-..."` and `crossorigin="anonymous"` attributes. |
| 4 | No Content Security Policy (CSP) | `index.html` | No CSP header or meta tag exists. The page has no defense-in-depth against injected scripts, styles, or resources. | Add `<meta http-equiv="Content-Security-Policy">` with appropriate directives restricting `default-src`, `script-src`, `style-src`, `font-src`, `img-src`, and `frame-ancestors`. |
| 5 | No CSRF protection on contact form | `index.html` (line 383) | The contact form has no CSRF token. When a backend is added, the form will be vulnerable to cross-site request forgery. | Add a hidden CSRF token field and validate server-side. |
| 6 | Missing `rel="noopener noreferrer"` on social links | `index.html` (lines 377–380) | Social links currently point to `#`, but when real external URLs are added without `rel="noopener noreferrer"`, they will be vulnerable to tabnabbing attacks via `window.opener`. | Add `target="_blank" rel="noopener noreferrer"` to all external links. |

### 🟡 Low Severity

| # | Issue | File | Description | Fix |
|---|-------|------|-------------|-----|
| 7 | No clickjacking protection | Server / `index.html` | Without `X-Frame-Options` or `frame-ancestors` CSP directive, the page can be embedded in a malicious `<iframe>` for clickjacking. | Add `frame-ancestors 'none'` to CSP or set `X-Frame-Options: DENY` server header. |
| 8 | No input length limit on chat input | `index.html` (line 479) | The chatbot text input has no `maxlength` attribute, allowing extremely long strings that may cause UI issues or memory pressure. | Add `maxlength="500"` to the input element. |
| 9 | Missing `autocomplete` attributes on form inputs | `index.html` (lines 386–394) | Name, email, and message inputs lack explicit `autocomplete` attributes, which may cause browsers to autofill sensitive data into the wrong fields. | Add `autocomplete="name"`, `autocomplete="email"`, and `autocomplete="off"` respectively. |
| 10 | Unvalidated `data-palette` value from DOM | `js/script.js` (line 75) | `btn.dataset.palette` is read from the DOM and applied directly. If an attacker can modify the DOM (via devtools or XSS), arbitrary attribute values can be injected. | Validate against known palette names before applying. |