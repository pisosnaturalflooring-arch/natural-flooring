"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LazyOnView from "./LazyOnView";

// Asesor + visualizador: lo más pesado de la home (y lo único que todavía usa
// framer-motion). Se baja recién cuando la sección se acerca a la pantalla.
const ToolsSection = dynamic(() => import("./sections/ToolsSection"));
const ChatbotWidget = dynamic(() => import("./sections/ChatbotWidget"), { ssr: false });
const NewsletterPopup = dynamic(() => import("./sections/NewsletterPopup"), { ssr: false });

export function LazyTools() {
  return (
    <LazyOnView id="herramientas" minHeight="1500px">
      <ToolsSection />
    </LazyOnView>
  );
}

/**
 * Chatbot y popup de promo: no hacen falta para la primera pintura. Se cargan
 * cuando el navegador queda libre después de la carga.
 */
export function DeferredWidgets({ chatbotFaq }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <>
      <ChatbotWidget faq={chatbotFaq} />
      <NewsletterPopup />
    </>
  );
}
