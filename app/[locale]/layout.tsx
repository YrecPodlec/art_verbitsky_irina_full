import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import {NextIntlClientProvider} from "next-intl";

export const metadata: Metadata = {
  title: "VERBITSKY IRINA | ARTIST",
  description: "VERBITSKY IRINA website about artist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
            {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
