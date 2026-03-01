import type { Metadata } from "next";
import { Inter, Montserrat, Quicksand } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import Script from "next/script";

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
      <head>
        {/* Commented out Google Sign-In - Uncomment when ready to use
        <meta name="google-signin-client_id" content="380078509373-814un77hbu18p9s6s8tqeit1t18lfnk1.apps.googleusercontent.com" />
        <script src="https://apis.google.com/js/api.js" async defer></script>
        */}
      </head>
      <body className={quicksand.className + ' ' + montserrat.className + ' ' + inter.className}>
        {/* Google Ads Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17539090940"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17539090940');
          `}
        </Script>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
