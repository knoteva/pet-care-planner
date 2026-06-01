import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Care Planner",
  description: "A capstone app for pet groups, walks and care events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
