import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import classNames from "classnames";
import { Toaster } from "sonner";

import { Header } from "@/components/header";
import { ModalDialog } from "@/components/modal-dialog";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event dashboard",
  description: "Take home assignment for fastbreak.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={classNames(
          geistSans.variable,
          geistMono.variable,
          "antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Toaster />
          <ModalDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
