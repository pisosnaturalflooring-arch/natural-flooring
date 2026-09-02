"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "../NaturalFlooringPage.module.css";
import { cx } from "./shared";

/**
 * Barrido de tablones entre vistas.
 *
 * Estaba embebido en WoodRecommenderSection; se extrajo porque el visualizador
 * necesita el mismo gesto y no tiene sentido tener dos transiciones distintas
 * para las dos herramientas del sitio.
 *
 * Cuatro tablones cruzan en cascada y el contenido cambia tapado por ellos. El
 * cambio va por temporizador, no atado a que la animacion termine: si el
 * navegador no la corre, la vista cambia igual y solo se pierde el efecto.
 */

const TABLONES = [
  { clase: "panelPine", delay: 0 },
  { clase: "panelOak", delay: 0.05 },
  { clase: "panelWalnut", delay: 0.1 },
  { clase: "panelWenge", delay: 0.15 },
];

/** El punto del barrido donde los tablones tapan todo y conviene cambiar. */
export const WIPE_SWAP_MS = 380;
const WIPE_END_MS = 900;

export function useWoodWipe() {
  const [activo, setActivo] = useState(false);
  const [direccion, setDireccion] = useState("forward");
  const reduceMotion = useReducedMotion();
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const barrer = useCallback(
    (dir, cambiarVista) => {
      if (reduceMotion) {
        cambiarVista();
        return;
      }
      timers.current.forEach(clearTimeout);
      setDireccion(dir);
      setActivo(true);
      timers.current = [
        setTimeout(cambiarVista, WIPE_SWAP_MS),
        setTimeout(() => setActivo(false), WIPE_END_MS),
      ];
    },
    [reduceMotion]
  );

  return { activo, direccion, barrer };
}

export default function WoodWipe({ activo, direccion = "forward" }) {
  const desde = direccion === "forward" ? "100%" : "-100%";
  const hasta = direccion === "forward" ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {activo && (
        <div className={styles.woodWipeOverlayHorizontal}>
          {TABLONES.map(({ clase, delay }) => (
            <motion.div
              key={clase}
              className={cx(styles.woodWipePanelHorizontal, styles[clase])}
              initial={{ x: desde }}
              animate={{ x: [desde, "0%", hasta] }}
              transition={{ duration: 0.75, delay, times: [0, 0.45, 1], ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
