import { eq, type AnyColumn } from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

/**
 * Generic CRUD Repository
 * Type-safe for any table in Drizzle
 */
export class CrudRepository<
  TTable extends AnySQLiteTable,
  TIdColumn extends keyof TTable
> {
  constructor(
    private readonly db: DrizzleD1Database,
    private readonly table: TTable,
    private readonly idColumn: TIdColumn
  ) {}

  async findAll(): Promise<InferSelectModel<TTable>[]> {
    return await this.db.select().from(this.table);
  }

  async findById(
    id: string | number
  ): Promise<InferSelectModel<TTable> | null> {
    const idCol = this.table[this.idColumn] as unknown as AnyColumn;

    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(idCol, id))
      .limit(1);

    return rows[0] ?? null;
  }

  async create(data: InferInsertModel<TTable>): Promise<boolean> {
    try {
      const result = await this.db.insert(this.table).values(data).run();
      return (result.meta?.changes ?? 0) > 0;
    } catch (err) {
      console.error(`[CrudRepository] Insert failed:`, err);
      return false;
    }
  }

  async delete(id: string | number): Promise<boolean> {
    const idCol = this.table[this.idColumn] as unknown as AnyColumn;
    try {
      const result = await this.db
        .delete(this.table)
        .where(eq(idCol, id))
        .run();
      return (result.meta?.changes ?? 0) > 0;
    } catch (err) {
      console.error(`[CrudRepository] Delete failed:`, err);
      return false;
    }
  }

  async findByField<K extends keyof InferSelectModel<TTable>>(
    field: K,
    value: InferSelectModel<TTable>[K]
  ): Promise<InferSelectModel<TTable>[]> {
    const column = this.table[field as string] as unknown as AnyColumn;
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(column, value))
      .all();
    return result;
  }
}
