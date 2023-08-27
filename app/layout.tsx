"use client";
import BackgroundImages from "@/components/BackgroundImages";
import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Dancing_Script, Staatliches } from "next/font/google";
import SponsorLogo from "@/components/SponsorLogo";
import { ContextProvider } from "@/context/Context";

export const metadata: Metadata = {
  title: "Portue Silat Bandung Championship",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-poppins">
        <ContextProvider>
          <BackgroundImages />
          <main className="grid grid-rows-[auto_1fr] min-h-screen">
            <SponsorLogo />
            <section className="h-full">{children}</section>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
