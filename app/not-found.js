import { redirect } from "next/navigation";

/** Cualquier dirección que no existe (links viejos, typos) lleva a la home. */
export default function NotFound() {
  redirect("/");
}
