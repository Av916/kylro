import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klyro — Build what matters",
  description: "AI-powered developer workspace for teams that ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
