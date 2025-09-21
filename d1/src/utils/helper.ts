import { and, asc, desc, eq, inArray, type SQL } from "drizzle-orm";
import {ModelSchema} from "../types";
import {relationMap, tableRegistry} from "../db/models";


export function parseInclude(url: URL): string[][] {
    const inc = url.searchParams.get("include");
    if (!inc) return [];
    return inc
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(path => path.split(".").map(s => s.trim()).filter(Boolean));
}


export async function loadRelations(
    db: any,
    rootTable: string,
    rows: any[],
    includes: string[][]
) {
    if (!rows.length || !includes.length) return rows;

    // Group include paths by their first hop
    const bySegment: Record<string, string[][]> = {};
    for (const path of includes) {
        const [head, ...tail] = path;
        if (!head) continue;
        if (!bySegment[head]) bySegment[head] = [];
        if (tail.length) bySegment[head].push(tail);
    }

    // Process each relation in batch
    for (const segment of Object.keys(bySegment)) {
        const rel = relationMap[rootTable]?.[segment];
        if (!rel) continue;

        const parentRows = rows.filter((r) => r != null);
        if (!parentRows.length) continue;

        const ids = [
            ...new Set(
                parentRows.map((r) => r?.[rel.foreignKey]).filter((v: any) => v != null)
            ),
        ];
        if (!ids.length) continue;

        const targetTable = tableRegistry[rel.target];
        if (!targetTable) continue;

        const related = await db
            .select()
            .from(targetTable)
            .where(inArray(targetTable[rel.targetKey], ids))
            .all();

        const targetMap = new Map<any, any[]>();

        if (rel.many) {
            // one-to-many → collect into arrays
            for (const r of related) {
                const key = r[rel.targetKey];
                if (!targetMap.has(key)) targetMap.set(key, []);
                targetMap.get(key)!.push(r);
            }
        } else {
            // one-to-one → simple map
            for (const r of related) {
                targetMap.set(r[rel.targetKey], r);
            }
        }

        // Attach back to parent rows
        for (const parent of parentRows) {
            const fk = parent[rel.foreignKey];
            if (rel.many) {
                parent[segment] = fk != null ? targetMap.get(fk) ?? [] : [];
            } else {
                parent[segment] = fk != null ? targetMap.get(fk) ?? null : null;
            }
        }

        // Recursively hydrate nested includes
        const childIncludes = bySegment[segment];
        if (childIncludes.length) {
            const children = rel.many
                ? parentRows.flatMap((r) => r[segment] ?? [])
                : parentRows.map((r) => r[segment]).filter(Boolean);

            if (children.length) {
                await loadRelations(db, rel.target, children, childIncludes);
            }
        }
    }

    return rows;
}


export type ColumnMap = Record<string, any>;

export function parseFilters(url: URL, columns: ColumnMap) {
    const clauses: SQL[] = [];
    for (const [key, value] of url.searchParams.entries()) {
        if (!(key in columns)) continue;
        if (value.includes(",")) {
            clauses.push(inArray(columns[key], value.split(",")));
        } else {
            clauses.push(eq(columns[key], value));
        }
    }
    return clauses.length ? and(...clauses) : undefined;
}

export function parseSort(url: URL, columns: ColumnMap) {
    const sort = url.searchParams.get("sort");
    if (!sort) return [];
    return sort.split(",").map((part) => {
        const isDesc = part.startsWith("-");
        const key = part.replace("-", "");
        const col = columns[key];
        if (!col) return null;
        return isDesc ? desc(col) : asc(col);
    }).filter(Boolean);
}

export function parsePagination(url: URL) {
    const limit = Math.max(1, Number(url.searchParams.get("limit")) || 10);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const offset = (page - 1) * limit;

    return { limit, page, offset };
}

export function validateData(schema: ModelSchema, data: any, is_patch: boolean = false) {
    for (const [field, rules] of Object.entries(schema.fields)) {
        const value = data[field];

        if (!is_patch && rules.required && (value === undefined || value === null)) {
            throw new Error(`Field '${field}' is required`);
        }

        if (is_patch && value === undefined) {
            continue;
        }

        if (rules.type === "string" && value !== undefined) {
            if (typeof value !== "string") throw new Error(`Field '${field}' must be a string`);
            if (rules.minLength && value.length < rules.minLength)
                throw new Error(`Field '${field}' must be at least ${rules.minLength} chars`);
            if (rules.maxLength && value.length > rules.maxLength)
                throw new Error(`Field '${field}' must be at most ${rules.maxLength} chars`);
        }

        if (rules.type === "number" && value !== undefined) {
            if (typeof value !== "number") throw new Error(`Field '${field}' must be a number`);
            if (rules.min !== undefined && value < rules.min)
                throw new Error(`Field '${field}' must be >= ${rules.min}`);
            if (rules.max !== undefined && value > rules.max)
                throw new Error(`Field '${field}' must be <= ${rules.max}`);
        }

        if (rules.enum && value !== undefined && !rules.enum.includes(value)) {
            throw new Error(`Field '${field}' must be one of: ${rules.enum.join(", ")}`);
        }
    }
}
