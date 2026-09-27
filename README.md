<div align="center">
  <img src="public/ena-logo.png" width="128" alt="ENA logo: a warm continuous form representing a protected conversation and returning balance" />

# ENA

### A calmer, session-based emotional-support chatbot inspired by Entropic Neural Analysis

[![Live prototype](https://img.shields.io/badge/Live_prototype-Open_ENA-315f56?style=for-the-badge)](https://ena-theta.vercel.app)
[![CI](https://img.shields.io/github/actions/workflow/status/BaconKage/ENA/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/BaconKage/ENA/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**[Open the live prototype](https://ena-theta.vercel.app)** · [Privacy notice](https://ena-theta.vercel.app/privacy) · [Prototype terms](https://ena-theta.vercel.app/terms)

</div>

ENA is a session-based emotional-reflection chatbot inspired by the paper's **Entropic Neural Analysis (ENA)** framework. It is designed to listen, help a person untangle a concern, or support one manageable next step while adapting the length and focus of its replies to the complexity of the conversation.

> [!IMPORTANT]
> This repository is an experimental research prototype. **ENA is not therapy, a medical device, a crisis service, or a substitute for qualified professional care.**

## At a glance

| | |
| --- | --- |
| **Live application** | [ena-theta.vercel.app](https://ena-theta.vercel.app) |
| **Core idea** | Adapt response pacing as conversational information load rises or resolves. |
| **Memory model** | Transparent, browser-tab-only session notes with user-controlled clearing. |
| **AI provider** | GroqCloud, using schema-constrained responses validated with Zod. |
| **Persistence** | No application database, user accounts, local storage, or intentional chat-history logging. |
| **Status** | Research and demonstration prototype for adults aged 18 and over. |

## What the prototype does

- Offers three user-controlled support styles: **Just listen**, **Help me understand**, and **Help me plan**.
- Maintains a small, visible summary only for the current browser session.
- Lets the user inspect and clear everything ENA is keeping in mind.
- Adjusts conversation pacing between **open**, **focused**, and **gentle** modes.
- Uses GroqCloud for ordinary model responses and structured signal extraction.
- Handles clear urgent-safety phrases through a local deterministic path before any model request.
- Provides explicit prototype, privacy, age, and emergency-care boundaries.
- Does not create user accounts or intentionally write conversations to a database, local storage, or analytics service.

## How this relates to the paper

The paper models an agent with finite memory, incoming information, cognitive processing cost, accumulated entropy load, and a regulation or release mechanism. Its central dynamic is:

$$
S_{t+1}=S_t+\alpha C(I_t)-\beta D_t
$$

where:

- $S_t$ is accumulated cognitive or entropy load;
- $I_t$ is information received at time $t$;
- $C(I_t)$ is the cost of processing the information;
- $D_t$ is entropy dissipation or regulation;
- $\alpha$ and $\beta$ control accumulation and dissipation.

The symbol $D_t$ is used here deliberately. The paper uses $R_t$ both for regulatory release and, elsewhere, for the normalized collapse-risk ratio $S_t/S_{\max}$. Those are different concepts, so this implementation keeps them separate.

The paper says cognitive cost depends on semantic complexity, novelty, and redundancy, but it does not provide a complete numerical function. ENA therefore treats the paper as a design framework rather than a finished clinical or mathematical instrument.

### Prototype mapping

| Paper concept | Prototype implementation |
| --- | --- |
| Finite memory $M_t$ | A compact, user-visible session summary: current concern, goal, key points, supports, attempts, and resolved topics. |
| Information $I_t$ | The current message plus a short recent-message window. |
| Cognitive cost $C(I_t)$ | A heuristic combination of model-estimated complexity, novelty, and repetition. |
| Accumulated load $S_t$ | A bounded interaction-load value used only to select response pacing. |
| Entropy release $D_t$ | A regulation signal representing evidence of relief, clarity, or resolution. |
| Latent affect space | Valence and activation/energy signals used as conversational context. |
| Forgetting and pruning | User-controlled note clearing, session expiry, bounded history, compact memory, and removal of resolved or contradicted details. |
| Saturation response | Progressively shorter and more focused replies as interaction load rises. |

The implementation currently uses:

$$
C_t=0.40X_t+0.35N_t+0.25P_t
$$

$$
S_{t+1}=\mathrm{clip}\left(0.82S_t+0.32C_t-0.26G_t,\,0,\,1\right)
$$

where $X_t$ is semantic complexity, $N_t$ is novelty, $P_t$ is repetition, and $G_t$ is regulation. Values below $0.40$ use open pacing, values from $0.40$ use focused pacing, and values from $0.68$ use gentle pacing.

These coefficients and thresholds are **implementation choices**, not equations claimed by the paper and not validated psychological measurements. The value describes conversation-management pressure, not the user's mental state, diagnosis, intelligence, or clinical risk.

The paper also proposes the Entropy Collapse Metric components ROI, HT, and DR. They are not implemented as scores here because the paper does not provide complete formulas or a validated aggregation rule for them.

## Request flow

```text
Person's message
      │
      ├── Local urgent-language check ── urgent match ──► reviewed safety response
      │
      └── Ordinary message
              │
              ▼
        Groq structured response
        ├── supportive reply
        ├── compact session notes
        └── conversation signals
              │
              ▼
        ENA load update
              │
              ▼
        open / focused / gentle pacing
```

## Technology

- [Next.js](https://nextjs.org/) with the App Router
- React and TypeScript
- [Groq JavaScript SDK](https://github.com/groq/groq-typescript)
- Zod validation for API inputs and model outputs
- Vitest for deterministic ENA and safety tests
- CSS modules and global CSS, with no external component framework

## Run locally

Requirements: Node.js 22 or newer and a Groq API key.

```bash
git clone https://github.com/BaconKage/ENA.git
cd ENA
npm install
```

Copy `.env.example` to `.env.local` and add your key:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
GROQ_FALLBACK_MODEL=openai/gpt-oss-20b
```

Then start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Do not commit `.env.local`. The repository's `.gitignore` excludes it and other `.env*` files while keeping `.env.example` available as a template.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBaconKage%2FENA&env=GROQ_API_KEY&envDescription=A%20GroqCloud%20API%20key%20is%20required%20for%20chat%20responses.&envLink=https%3A%2F%2Fconsole.groq.com%2Fkeys)

The reference deployment is available at **[ena-theta.vercel.app](https://ena-theta.vercel.app)**.

1. Import `BaconKage/ENA` into Vercel.
2. Keep the detected framework preset as **Next.js**.
3. Add `GROQ_API_KEY` under **Project Settings → Environment Variables**.
4. Optionally add `GROQ_MODEL` and `GROQ_FALLBACK_MODEL`; otherwise the code uses the defaults shown above.
5. Deploy.

No database or persistent storage service is required. Before any public launch, review the privacy notice for your deployment, configure an appropriate Groq data-retention setting, add a real project contact, and obtain professional legal and clinical-safety review.

## Privacy model

ENA's conversation, compact notes, and pacing state live in React memory in the current tab. They are cleared when the user ends the session, refreshes or closes the tab, or leaves it inactive for approximately 30 minutes. The API route is stateless and sends `Cache-Control: no-store`.

Ordinary messages are sent to GroqCloud to produce a response. Groq's current documentation says inference inputs and outputs are not retained by default, though temporary logging may occur for reliability, troubleshooting, or suspected abuse unless Zero Data Retention is enabled. See [Groq's data documentation](https://console.groq.com/docs/your-data) and the in-app privacy notice for the current disclosure.

Session-only application storage does not mean a message never leaves the device. Users are asked not to enter names, addresses, medical records, secrets, or other identifying or highly sensitive information.

## Safety boundaries

- Adults only (18+).
- Not therapy, diagnosis, medical advice, or emergency assistance.
- Clear urgent phrases are checked locally and receive a fixed safety-oriented response.
- The interface provides a direct urgent-help panel and links to [Find A Helpline](https://findahelpline.com/).
- Pattern matching and language models can both miss risk. A person in immediate danger should contact local emergency services or a nearby trusted person rather than wait for ENA.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

The test suite covers the bounded ENA load update, pace transitions, signal clamping, and local urgent-language detection.

Every push and pull request to `main` runs linting, tests, and a production build through GitHub Actions.

## Contributing and security

Contributions that improve clarity, accessibility, privacy, safety boundaries, or the fidelity of the ENA implementation are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Please do not disclose credentials, personal conversation content, or security vulnerabilities in a public issue. Follow the private reporting process in [SECURITY.md](SECURITY.md).

## Project status

ENA is a prototype intended to explore how entropy-aware memory and pacing ideas might shape a calmer emotional-support interface. It is not a validated implementation of the paper's complete theory, and it does not establish the clinical effectiveness or safety of the ENA framework.
