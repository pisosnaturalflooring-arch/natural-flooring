/** Serializa los leads a CSV para el export del endpoint admin. */

const COLUMNS = ["id", "phone", "source", "created_at"];

function escapeCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(rows) {
  const header = COLUMNS.join(",");
  if (!rows.length) return header;
  const body = rows.map((row) => COLUMNS.map((col) => escapeCell(row[col])).join(","));
  return [header, ...body].join("\n");
}
