import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import type { AnyMySqlTable } from 'drizzle-orm/mysql-core';
import { eq } from 'drizzle-orm';

// Typed DB helper utilities for common CRUD patterns.
// These accept a `db` instance (driver-specific) and a Drizzle table.

export async function insertAndFetch<T extends AnyMySqlTable>(
  db: any,
  table: T,
  values: InferInsertModel<T>
): Promise<InferSelectModel<T> | null> {
  // Prefer using returning() when the driver supports it.
  const maybeRows = await db.insert(table).values(values).returning?.().execute?.();
  if (Array.isArray(maybeRows) && maybeRows.length > 0) return maybeRows[0] as InferSelectModel<T>;

  // Some drivers return an insertId or array of ids.
  const result = maybeRows ?? (await db.insert(table).values(values).execute?.());

  let insertId: number | undefined;
  if (Array.isArray(result)) {
    const first = result[0];
    if (typeof first === 'object' && first !== null && 'id' in first) insertId = Number((first as any).id);
    else if (typeof first === 'number') insertId = first as number;
  } else if (result && typeof result === 'object' && 'insertId' in result) {
    insertId = Number((result as any).insertId);
  } else if (typeof result === 'number') {
    insertId = result as number;
  }

  if (!insertId) return null;

  const [record] = await db.select().from(table).where(eq((table as any).id, insertId)).limit(1);
  return (record ?? null) as InferSelectModel<T> | null;
}

export async function updateAndReturn<T extends AnyMySqlTable>(
  db: any,
  table: T,
  where: any,
  // Accept arbitrary values (including SQL fragments) for updates.
  values: Record<string, any>
): Promise<InferSelectModel<T> | null> {
  const maybeRows = await db.update(table).set(values).where(where).returning?.().execute?.();
  if (Array.isArray(maybeRows) && maybeRows.length > 0) return maybeRows[0] as InferSelectModel<T>;

  // If returning is not supported, attempt to select the updated row(s).
  // Try to derive an id from the where clause if possible.
  if (where && typeof where === 'object' && 'eq' in where) {
    // Can't reliably extract id here; fall through to generic select.
  }

  const result = maybeRows ?? (await db.update(table).set(values).where(where).execute?.());

  // If the driver returned affected rows only, do a select using the where clause.
  const [record] = await db.select().from(table).where(where).limit(1);
  return (record ?? null) as InferSelectModel<T> | null;
}

export async function deleteAndReturn<T extends AnyMySqlTable>(
  db: any,
  table: T,
  where: any
): Promise<InferSelectModel<T> | null> {
  const maybeRows = await db.delete(table).where(where).returning?.().execute?.();
  if (Array.isArray(maybeRows) && maybeRows.length > 0) return maybeRows[0] as InferSelectModel<T>;

  // If returning not supported, try to fetch the row before deleting (best-effort).
  const [before] = await db.select().from(table).where(where).limit(1);
  await db.delete(table).where(where).execute?.();
  return (before ?? null) as InferSelectModel<T> | null;
}

export default { insertAndFetch, updateAndReturn, deleteAndReturn };
