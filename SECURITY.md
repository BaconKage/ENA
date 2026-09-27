# Security policy

## Supported version

ENA is an early-stage prototype. Security updates are applied to the latest commit on the `main` branch; older commits and third-party forks are not supported.

## Reporting a vulnerability

Use GitHub's private vulnerability-reporting form for this repository:

[Report a vulnerability privately](https://github.com/BaconKage/ENA/security/advisories/new)

Please include:

- a concise description of the issue;
- the affected route, component, or dependency;
- reproducible steps using synthetic data;
- the likely impact; and
- a suggested remediation, if known.

Do not include API keys, real emotional-support conversations, medical information, or other personal data in a report. Please allow the maintainer time to investigate before disclosing the issue publicly.

## Scope notes

The repository intentionally excludes `.env.local`. Groq credentials must be stored in local or Vercel environment variables and must never be committed. Reports about exposed credentials, message leakage, unintended persistence, prompt injection that defeats safety boundaries, or bypasses of security headers are in scope.
