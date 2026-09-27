import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ena-theta.vercel.app"),
  title: {
    default: "ENA — A quiet place to feel heard",
    template: "%s | ENA",
  },
  description:
    "A private, session-based emotional reflection companion built around Entropic Neural Analysis.",
  applicationName: "ENA",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/ena-logo.png",
    apple: "/ena-logo.png",
  },
  openGraph: {
    title: "ENA — A quiet place to feel heard",
    description:
      "A private, session-based emotional reflection companion built around Entropic Neural Analysis.",
    url: "/",
    siteName: "ENA",
    images: [{ url: "/ena-logo.png", alt: "ENA" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ENA — A quiet place to feel heard",
    description:
      "A private, session-based emotional reflection companion built around Entropic Neural Analysis.",
    images: ["/ena-logo.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
