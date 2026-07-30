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

// Dominio final del sitio. Se puede pisar por entorno (Vercel/Cloudflare)
// sin tocar código, para previews o si el dominio cambia.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naturalflooring.com.ar";

const title = "Natural Flooring — Pisos & Escaleras · San Fernando";
const description =
  "Showroom en San Fernando. Pisos de madera, flotantes, vinílicos, decks y escaleras a medida.";

export const metadata = {
  // Necesario para que las URLs de Open Graph salgan absolutas: sin esto
  // los previews de WhatsApp e Instagram no cargan la imagen.
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Natural Flooring",
    title,
    description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Frente del showroom de Natural Flooring en San Fernando",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
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
