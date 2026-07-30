import { useEffect, useRef, useState } from "react";
import styles from "../NaturalFlooringPage.module.css";
import { ExternalLink } from "./shared";

export default function ChatbotWidget({ faq }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: faq.greeting }]);
  const [askedIds, setAskedIds] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, isOpen]);

  function askQuestion(item) {
    if (isTyping) return;
    setMessages((prev) => [...prev, { from: "user", text: item.q }]);
    setAskedIds((prev) => [...prev, item.id]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: item.a }]);
      setIsTyping(false);
    }, 700);
  }

  const remaining = faq.items.filter((item) => !askedIds.includes(item.id));

  return (
    <>
      {isOpen && (
        <div className={styles.chatbotPanel} role="dialog" aria-label={faq.title}>
          <div className={styles.chatbotHeader}>
            <div className={styles.chatbotHeaderDot} />
            <div>
              <div className={styles.chatbotHeaderTitle}>{faq.title}</div>
              <div className={styles.chatbotHeaderSubtitle}>{faq.subtitle}</div>
            </div>
            <button
              type="button"
              className={styles.chatbotClose}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.chatbotMessages} ref={scrollRef}>
            {messages.map((message, i) => (
              <div
                key={i}
                className={
                  message.from === "bot" ? styles.chatbotBubbleBot : styles.chatbotBubbleUser
                }
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className={styles.chatbotBubbleBot}>
                <span className={styles.chatbotTyping}>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          <div className={styles.chatbotChips}>
            {remaining.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.chatbotChip}
                onClick={() => askQuestion(item)}
              >
                {item.q}
              </button>
            ))}
            <ExternalLink href={faq.ctaHref} className={styles.chatbotCta}>
              {faq.ctaLabel}
            </ExternalLink>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.chatbotLauncher}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat de preguntas frecuentes"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}
