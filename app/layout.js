import { Bebas_Neue, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Natural Flooring — Pisos & Escaleras · San Fernando",
  description:
    "Showroom en San Fernando. Pisos de madera, flotantes, vinílicos, decks y escaleras a medida.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${instrumentSans.variable}`}>
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
