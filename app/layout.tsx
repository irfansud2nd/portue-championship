"use client";
import BackgroundImages from "@/components/BackgroundImages";
import "./globals.css";
import SponsorLogo from "@/components/SponsorLogo";
import { ContextProvider } from "@/context/Context";
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
          <main className="grid grid-rows-[auto_1fr] min-h-screen w-full max-w-[1440px]">
            <SponsorLogo />
            <section className="h-full">{children}</section>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
