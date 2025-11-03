import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontGrotesk, fontPressStart2P, fontWorkSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt to Signature - Powered by Modaic",
  description: "Convert prompts into signatures using DSPy",
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
        <Analytics />
      </body>
    </html>
  );
}
