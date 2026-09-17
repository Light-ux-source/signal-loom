import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Loom | AI signal monitoring",
  description: "Track the signals that matter across X with AI-assisted filtering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
