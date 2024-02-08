import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
