import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENA — A quiet place to feel heard",
  description:
    "A private, session-based emotional reflection companion built around Entropic Neural Analysis.",
  icons: {
    icon: "/ena-logo.png",
    apple: "/ena-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
