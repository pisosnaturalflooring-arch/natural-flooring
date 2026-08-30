import { DatabaseSync } from "node:sqlite";
import path from "node:path";

// Base de datos SQLite local (archivo leads.db en la raíz del proyecto).
// No requiere instalar nada: node:sqlite viene incluido en Node 24.
let db;

export function getDb() {
  if (!db) {
    const file = path.join(process.cwd(), "leads.db");
    db = new DatabaseSync(file);
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        source TEXT,
        created_at TEXT NOT NULL
      )
    `);
  }
  return db;
}

export function insertLead({ phone, source }) {
  getDb()
    .prepare("INSERT INTO leads (phone, source, created_at) VALUES (?, ?, ?)")
    .run(phone, source || "popup", new Date().toISOString());
}

export function listLeads() {
  return getDb().prepare("SELECT id, phone, source, created_at FROM leads ORDER BY id DESC").all();
}
