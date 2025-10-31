import type { Metadata } from "next";
import { fontGrotesk, fontPressStart2P, fontWorkSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt to Signature",
  description: "Convert natural language prompts into function signatures using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontGrotesk.variable} ${fontPressStart2P.variable} ${fontWorkSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
