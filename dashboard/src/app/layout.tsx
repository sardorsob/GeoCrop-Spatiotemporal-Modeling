import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "GeoCrop Interactive Dashboard",
  description:
    "Interactive dashboard scaffold for the GeoCrop Spatiotemporal Modeling project."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
