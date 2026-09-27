# Contributing to ENA

Thank you for helping improve ENA. This project sits at the intersection of human-computer interaction, emotional support, privacy, and experimental AI architecture, so changes should be both technically sound and careful about user impact.

## Before you start

- Read the project boundaries and paper mapping in [README.md](README.md).
- Search existing issues before opening a new one.
- Never include real conversation transcripts, credentials, medical records, or identifying information in an issue, fixture, screenshot, or test.
- Use synthetic examples when testing emotional-support behaviour.

## Local development

```bash
git clone https://github.com/BaconKage/ENA.git
cd ENA
npm install
```

Copy `.env.example` to `.env.local`, add a Groq API key, and run:

```bash
npm run dev
```

## Required checks

Before opening a pull request, run:

```bash
npm run lint
npm test
npm run build
```

## Pull requests

Keep pull requests focused and explain:

1. What changed and why.
2. How the change was tested.
3. Whether it changes privacy, safety behaviour, session memory, model prompts, or third-party processing.
4. Any new limitation or follow-up work.

Changes to crisis-language handling, privacy disclosures, age boundaries, or the distinction between emotional support and professional care require particular scrutiny. Do not describe an implementation heuristic as a validated psychological or clinical measure.

## Reporting vulnerabilities

Do not open a public issue for a vulnerability or exposed secret. Follow [SECURITY.md](SECURITY.md) instead.
