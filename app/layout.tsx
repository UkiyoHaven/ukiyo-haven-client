import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ukiyo Haven",
  description: "Find your calm in the ever-changing world.",
  openGraph: {
    locale: "en_US",
    title: "Ukiyo Haven",
    siteName: "Ukiyo Haven",
    description: "Find your calm in the ever-changing world.",
    type: "website",
  },

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
