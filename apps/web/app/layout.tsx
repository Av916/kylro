import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import { ThemeProvider, ThemeScript } from "../components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Kylro — Make space for good work",
  description:
    "A calm workspace for planning projects, tracking progress, and working together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
