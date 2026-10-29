"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Cualquier dirección que no existe (links viejos, typos) lleva a la home.
 * El servidor responde 404 y la redirección la hace el navegador: un
 * redirect() durante el render del servidor rompía la medición de
 * rendimiento de React en desarrollo ("cannot have a negative time stamp").
 */
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
