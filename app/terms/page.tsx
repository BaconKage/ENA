import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Prototype Terms — ENA",
  description: "Terms for using the experimental ENA emotional-support prototype.",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Image src="/ena-logo.png" width={40} height={40} alt="" /> ENA</Link>
        <Link href="/" className={styles.back}><ArrowLeft size={15} /> Back to ENA</Link>
      </header>

      <article className={styles.document}>
        <div className={styles.prototype}><FlaskConical size={14} /> Experimental project prototype</div>
        <h1>Prototype terms of use</h1>
        <p className={styles.updated}>Last updated: 27 September 2026</p>
        <p className={styles.summary}>
          ENA is an early-stage research and demonstration project. It provides general emotional reflection, not therapy, diagnosis, medical advice, professional advice, or emergency assistance. By using this prototype, you acknowledge its experimental nature and the limitations below.
        </p>

        <section>
          <h2>1. Acceptance of these terms</h2>
          <p>These terms apply to your use of the ENA prototype. If you do not agree with them or with the <Link href="/privacy">Privacy Notice</Link>, do not begin or continue a session.</p>
        </section>

        <section>
          <h2>2. Prototype status</h2>
          <p>ENA is an experimental software project used to explore session-based emotional reflection and concepts derived from Entropic Neural Analysis. It is incomplete, may change without notice, may be unavailable, and may produce inaccurate, unsuitable, repetitive, or unexpected responses.</p>
          <p>Access to this prototype does not create a therapist–client, doctor–patient, counsellor–client, fiduciary, or other professional relationship.</p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>You may use this prototype only if you are at least 18 years old and are permitted to use the service in your location. Do not allow a child or anyone under 18 to use it.</p>
        </section>

        <section>
          <h2>4. What ENA can and cannot do</h2>
          <p>ENA may help you express a concern, reflect on feelings, separate issues into smaller parts, or identify a manageable next step.</p>
          <p>ENA does not provide medical, mental-health, legal, financial, employment, or other professional advice. It does not diagnose conditions, prescribe treatment, recommend medication changes, assess whether you are clinically safe, or replace a qualified professional.</p>
        </section>

        <section>
          <h2>5. Emergencies and immediate danger</h2>
          <p>ENA is not an emergency or crisis service and cannot contact emergency responders on your behalf. It may fail to recognize urgent danger.</p>
          <div className={styles.warning}><strong>If you or another person may be in immediate danger, contact your local emergency service or go to the nearest emergency department. If possible, involve a trusted person nearby. Do not wait for an ENA response.</strong></div>
        </section>

        <section>
          <h2>6. Artificial-intelligence limitations</h2>
          <p>Responses are generated using language models hosted through GroqCloud. Generated content may be incorrect, incomplete, biased, or inappropriate. You remain responsible for deciding whether and how to act on any response. Do not make important health, safety, legal, financial, or relationship decisions solely on the basis of ENA output.</p>
        </section>

        <section>
          <h2>7. Privacy and third-party processing</h2>
          <p>ENA’s application does not intentionally save a permanent conversation history, but ordinary messages and responses are processed through GroqCloud. Groq states that inference inputs and outputs are not retained by default, although temporary logging may occur for reliability, troubleshooting, or suspected abuse unless Zero Data Retention is enabled. Read the <Link href="/privacy">Privacy Notice</Link> before entering a message.</p>
          <p>Do not submit identifying, confidential, proprietary, medical-record, or similarly sensitive information.</p>
        </section>

        <section>
          <h2>8. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use ENA to harm, threaten, exploit, harass, deceive, or impersonate another person.</li>
            <li>Attempt to bypass safety controls or obtain prohibited content.</li>
            <li>Use ENA for clinical practice, medical advice, regulated healthcare, or any safety-critical decision.</li>
            <li>Reverse engineer, disrupt, overload, probe, or gain unauthorized access to the service.</li>
            <li>Use the prototype in violation of applicable law or Groq’s service policies.</li>
          </ul>
        </section>

        <section>
          <h2>9. Session control and availability</h2>
          <p>You can inspect the summary ENA uses through “Session notes,” clear those notes, or end the session. Ending a session clears application-held browser state but does not control independent processing by Groq or infrastructure providers.</p>
          <p>The prototype may be changed, rate-limited, suspended, or discontinued at any time. No service level, uptime, response time, or data-recovery commitment is provided.</p>
        </section>

        <section>
          <h2>10. Intellectual property</h2>
          <p>The ENA name, interface, original logo, project materials, and implementation remain subject to their applicable ownership and licence rights. You retain any rights you already hold in the original content you type. AI-generated outputs may not be unique and similar outputs may be generated for others.</p>
        </section>

        <section>
          <h2>11. No warranties</h2>
          <p>To the maximum extent permitted by applicable law, the prototype is provided “as is” and “as available,” without warranties of accuracy, reliability, availability, fitness for a particular purpose, non-infringement, or suitability for emotional, medical, or safety needs.</p>
        </section>

        <section>
          <h2>12. Responsibility and limitation</h2>
          <p>You use the prototype at your own discretion and remain responsible for your actions and decisions. To the maximum extent permitted by applicable law, the project operator is not responsible for indirect, incidental, special, consequential, or reliance-based loss arising from use of, inability to use, or reliance on the prototype. Nothing in these terms excludes liability that cannot legally be excluded.</p>
        </section>

        <section>
          <h2>13. Changes and project contact</h2>
          <p>These terms may be updated as ENA changes. The date at the top will be revised when material changes are made. Questions should be directed to the project operator through the same channel from which you received access.</p>
          <p>A named legal entity, direct support contact, governing-law clause, and jurisdiction-specific consumer terms must be added and professionally reviewed before a public production launch.</p>
        </section>

        <nav className={styles.nav} aria-label="Legal pages">
          <Link href="/"><ArrowLeft size={14} /> Return to ENA</Link>
          <Link href="/privacy">Read the privacy notice →</Link>
        </nav>
      </article>
    </main>
  );
}
