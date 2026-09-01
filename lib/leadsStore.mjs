/**
 * Persistencia de los leads en Turso (libsql).
 *
 * Reemplaza al SQLite local: en Vercel y Netlify el filesystem es efimero,
 * asi que un archivo leads.db se pierde en cada deploy y en cada cold start.
 * El dialecto sigue siendo SQLite, asi que el esquema es el mismo.
 */

import { createClient } from "@libsql/client";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL UNIQUE,
    source TEXT,
    created_at TEXT NOT NULL
  )
`;

export function createLeadsStore(client) {
  return {
    async init() {
      await client.execute(CREATE_TABLE);
    },

    /**
     * Un telefono repetido no crea una fila nueva: actualiza la que existe.
     * Sin esto la misma persona insistiendo con el popup ensucia la lista.
     */
    async insertLead({ phone, source }) {
      await client.execute({
        sql: `INSERT INTO leads (phone, source, created_at) VALUES (?, ?, ?)
              ON CONFLICT(phone) DO UPDATE SET source = excluded.source, created_at = excluded.created_at`,
        args: [phone, source, new Date().toISOString()],
      });
    },

    async listLeads() {
      const result = await client.execute(
        "SELECT id, phone, source, created_at FROM leads ORDER BY created_at DESC, id DESC"
      );
      return result.rows.map((row) => ({ ...row }));
    },
  };
}

let cached;

/** Store configurado desde el entorno, reutilizado entre invocaciones. */
export async function getLeadsStore() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return null;

  if (!cached) {
    const store = createLeadsStore(createClient({ url, authToken }));
    cached = store.init().then(() => store);
  }
  return cached;
}
