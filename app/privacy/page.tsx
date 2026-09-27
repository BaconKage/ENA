import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Notice — ENA Prototype",
  description: "How the ENA emotional-support prototype handles session data.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Image src="/ena-logo.png" width={40} height={40} alt="" /> ENA</Link>
        <Link href="/" className={styles.back}><ArrowLeft size={15} /> Back to ENA</Link>
      </header>

      <article className={styles.document}>
        <div className={styles.prototype}><FlaskConical size={14} /> Experimental project prototype</div>
        <h1>Privacy notice</h1>
        <p className={styles.updated}>Last updated: 27 September 2026</p>
        <p className={styles.summary}>
          ENA is a research and demonstration prototype. It intentionally does not create accounts or save a permanent conversation history. However, ordinary messages are sent to GroqCloud so that a response can be generated. This prototype is not suitable for confidential, identifying, or highly sensitive information.
        </p>

        <section>
          <h2>1. What this notice covers</h2>
          <p>This notice explains how this local ENA prototype handles information during an emotional-support session. “ENA,” “we,” and “the project” refer to the ENA prototype project and its operator.</p>
          <p>This is a prototype privacy notice, not a claim that ENA is a production healthcare, counselling, or clinical service.</p>
        </section>

        <section>
          <h2>2. Information processed during a session</h2>
          <p>When you use ENA, the following information may be processed:</p>
          <ul>
            <li>The messages you type and ENA’s responses.</li>
            <li>Your selected support style: listen, understand, or plan.</li>
            <li>A short in-session summary containing the concern, goal, key points, supports, things tried, and resolved topics.</li>
            <li>Non-clinical conversation signals used to adjust pacing, such as complexity, repetition, energy, and unresolved thread count.</li>
            <li>Standard technical request information that may be processed by the hosting environment or API provider, such as an IP address, request time, operational status, and token usage.</li>
          </ul>
          <p>ENA does not ask for your name, email address, telephone number, home address, medical record, or account profile. Please do not include those details in a message.</p>
        </section>

        <section>
          <h2>3. How the project uses information</h2>
          <p>Information is used only to generate the current response, maintain continuity inside the current tab, adjust response length and pacing, and activate the safety response when urgent language is detected.</p>
          <p>Direct urgent phrases may be handled by ENA’s local safety rules without sending that message to GroqCloud. Ordinary messages are sent to GroqCloud for response generation.</p>
        </section>

        <section>
          <h2>4. Session-only storage</h2>
          <p>ENA keeps the conversation, session notes, and ENA pacing state in temporary browser memory. The project does not intentionally write this content to a database, browser local storage, or an ENA user account.</p>
          <p>The browser-held state is cleared when you press <strong>End session</strong>, refresh or close the tab, or leave the session inactive for approximately 30 minutes. The server endpoint is designed to be stateless and does not intentionally log message bodies.</p>
          <p>This session-only design controls ENA’s own storage. It does not control processing performed independently by Groq, a hosting provider, a browser, an operating system, or a network administrator.</p>
        </section>

        <section>
          <h2>5. GroqCloud processing</h2>
          <p>This prototype uses the GroqCloud API. Groq states that inference inputs and outputs are not retained by default. Groq may temporarily log inference data for system reliability, troubleshooting, or suspected abuse, generally for up to 30 days. Groq also offers a Zero Data Retention setting; this notice does not claim that it is enabled for this project.</p>
          <p>Groq retains usage metadata, such as request time and token counts, for service operation. Groq states that this metadata does not contain the message input or generated output. Provider practices can change, so review Groq’s current documents before using the prototype.</p>
          <ul>
            <li><a href="https://console.groq.com/docs/your-data" target="_blank" rel="noreferrer">Groq: Your data</a></li>
            <li><a href="https://groq.com/privacy-policy/" target="_blank" rel="noreferrer">Groq Privacy Policy</a></li>
            <li><a href="https://console.groq.com/docs/legal" target="_blank" rel="noreferrer">Groq legal documents</a></li>
          </ul>
          <div className={styles.warning}><strong>Do not use this prototype for secrets, medical records, identifying information, or anything you would not want processed by GroqCloud.</strong></div>
        </section>

        <section>
          <h2>6. Cookies, analytics, and advertising</h2>
          <p>The current prototype does not intentionally use advertising trackers, behavioural analytics, session-replay tools, or cookies to build a user profile. It does not sell conversation content.</p>
        </section>

        <section>
          <h2>7. External services and links</h2>
          <p>ENA links to Find A Helpline for country-specific crisis resources. Opening an external link takes you to a separate service with its own privacy practices. ENA does not receive the information you enter on that service.</p>
        </section>

        <section>
          <h2>8. Adults only</h2>
          <p>This prototype is intended only for adults aged 18 and over. It is not directed toward children, and it should not be made available where it is likely to be accessed by anyone under 18.</p>
        </section>

        <section>
          <h2>9. Your choices</h2>
          <ul>
            <li>Do not enter identifying or confidential information.</li>
            <li>Open “Session notes” at any time to see the complete summary ENA is using.</li>
            <li>Select “Clear all session notes” to remove the summary while keeping the visible conversation.</li>
            <li>Select “End session” to clear the browser-held conversation and notes.</li>
            <li>Stop using the prototype if you do not agree with Groq’s data terms.</li>
          </ul>
        </section>

        <section>
          <h2>10. Questions and changes</h2>
          <p>For questions about this local prototype, contact the project operator through the same channel from which you received access. A dedicated privacy contact and jurisdiction-specific rights process must be added before any public production deployment.</p>
          <p>This notice may change as the prototype architecture or service providers change. The updated date above will be revised when material changes are made.</p>
        </section>

        <nav className={styles.nav} aria-label="Legal pages">
          <Link href="/"><ArrowLeft size={14} /> Return to ENA</Link>
          <Link href="/terms">Read the prototype terms →</Link>
        </nav>
      </article>
    </main>
  );
}
