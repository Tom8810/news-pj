import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multilingual Blog",
  description: "A blog with i18n support",
};

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default async function RootLayout({
  children,
  params: { lang },
}: Props) {
  return (
    <html lang={lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
