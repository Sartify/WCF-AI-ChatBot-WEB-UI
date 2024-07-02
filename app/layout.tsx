import type { Metadata } from "next";
import "./globals.css";
import "./markdown.css";

export const metadata: Metadata = {
  title: "WCF-Chatbot System",
  description: "Welcome to WCF-CHAT. A 24/7 available system to assist you on every problem you have with about WCF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
