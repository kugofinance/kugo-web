import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Providers from "./providers";
import { Header } from "./components/header/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "KUGO",
  description: "Next Generation Development Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Theme accentColor="bronze" appearance="dark" radius="none">
          <Providers>
            <main className="w-screen h-screen max-h-screen p-2 overflow-hidden">
              <div className={"w-full h-full"}>
                <Header />
                {children}
              </div>
            </main>
          </Providers>
        </Theme>
      </body>
    </html>
  );
}
