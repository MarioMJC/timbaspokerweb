export function parseCsv(text: string): Record<string, string>[] {
  const input = text.replace(/^\uFEFF/, "");

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const next = input[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (c === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
      continue;
    }

    if ((c === "\n" || c === "\r") && !inQuotes) {
      if (c === "\r" && next === "\n") i++;

      row.push(field.trim());
      field = "";

      if (row.some((x) => x.length > 0)) rows.push(row);
      row = [];
      continue;
    }

    field += c;
  }

  row.push(field.trim());
  if (row.some((x) => x.length > 0)) rows.push(row);

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const data = rows.slice(1);

  return data.map((cols) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? "").trim();
    });
    return obj;
  });
}

export async function fetchCsv(path: string): Promise<Record<string, string>[]> {
  const res = await fetch(path, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`No se pudo cargar ${path}: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return parseCsv(text);
}

export function parseMoney(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  const s = String(value).trim();
  if (!s || s === "-1") return null;

  const normalized = s
    .replace("€", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function parsePosition(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  const s = String(value).trim();
  if (!s || s === "-1") return null;

  const cleaned = s.replace("°", "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function parseJornada(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  const s = String(value).trim();
  if (!s) return null;

  const cleaned = s.replace("°", "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function pickHeader(headers: string[], keywords: string[]): string | null {
  const norm = (x: string) => x.toLowerCase().replace(/\s+/g, "");
  const normalizedHeaders = headers.map((h) => ({ raw: h, norm: norm(h) }));

  for (const kw of keywords.map(norm)) {
    const found = normalizedHeaders.find((h) => h.norm.includes(kw));
    if (found) return found.raw;
  }

  return null;
}