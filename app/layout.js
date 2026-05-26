import { Arimo, Cabin, League_Spartan } from "next/font/google";
import "./globals.css";

// Display font: Manual de marca pide "Glacial Indifference".
// Mientras no tengamos el .woff2 oficial, usamos Cabin que tiene
// proporciones muy parecidas (geométrica, ancha, terminaciones limpias).
// Para swap: reemplazar este import por next/font/local apuntando a
// /public/fonts/glacial-indifference-{regular,bold}.woff2
const displayFont = Cabin({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const arimo = Arimo({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
});

export const metadata = {
  title: "Natural Flooring — Pisos & Escaleras · San Fernando",
  description:
    "Showroom en San Fernando. Pisos de madera, flotantes, vinílicos, decks y escaleras a medida.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${arimo.variable} ${leagueSpartan.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
