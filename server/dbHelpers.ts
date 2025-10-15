import { eq } from "drizzle-orm";

// Minimal typed helper for MySQL-style insert-and-fetch patterns
export async function insertAndFetch(db: any, table: any, data: any) {
  const result = await db.insert(table).values(data);
  // result may be number, { insertId }, or array of ids/objects depending on driver
  let insertId: number | undefined;

  if (Array.isArray(result)) {
    // result[0] can be { id: number } or a plain number
    const first = result[0];
    if (typeof first === 'object' && first !== null && 'id' in first) {
      insertId = Number((first as any).id);
    } else if (typeof first === 'number') {
      insertId = first as number;
    }
  } else if (result && typeof result === 'object' && 'insertId' in result) {
    insertId = Number((result as any).insertId);
  } else if (typeof result === 'number') {
    insertId = result as number;
  }

  if (!insertId) return null;

  const [record] = await db.select().from(table).where(eq(table.id, insertId)).limit(1);
  return record;
}
