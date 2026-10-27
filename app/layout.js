import localFont from "next/font/local";
import "./globals.css";

// Display font: Manual de marca pide "Glacial Indifference".
// Mientras no tengamos el .woff2 oficial, usamos Cabin que tiene
// proporciones muy parecidas (geométrica, ancha, terminaciones limpias).
// Las fuentes están en el repo para compilar sin descargar archivos de Google.
// Para swap: usar los archivos oficiales de Glacial Indifference en src.
const displayFont = localFont({
  src: "./fonts/cabin-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

const arimo = localFont({
  src: "./fonts/arimo-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

// Solo se usa en etiquetas chicas: no se precarga, así no compite con la foto del hero.
const leagueSpartan = localFont({
  src: "./fonts/league-spartan-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-secondary",
  display: "swap",
  preload: false,
});

// Dominio final del sitio. Se puede pisar por entorno (Vercel/Cloudflare)
// sin tocar código, para previews o si el dominio cambia.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://naturalflooring.com.ar";

const title = "Natural Flooring — Pisos & Escaleras · San Fernando";
const description =
  "Showrooms en San Fernando y Escobar. Pisos de madera, SPC y MDF, revestimientos, escaleras, decks, pérgolas y muelles.";

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
