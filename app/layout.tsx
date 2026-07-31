import type { Metadata } from "next";
import "../packages/deltaphoto/src/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deltaphoto — Before & after image comparison for React",
  description:
    "A polished, accessible before-and-after image comparison component. Add two photos and drop it into any React site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
