import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kylro — Make space for good work",
  description: "A calm workspace for planning projects, tracking progress, and working together.",
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
