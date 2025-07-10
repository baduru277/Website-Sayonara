import type { Metadata } from "next";
import { Inter, Montserrat, Quicksand } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Sayonara - Barter & Resell Platform",
  description: "Trade, barter, and resell items in a sustainable marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className + ' ' + montserrat.className + ' ' + inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
