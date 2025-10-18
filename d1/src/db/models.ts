import {
    sqliteTable,
    integer,
    text,
    AnySQLiteTable,
    SQLiteInteger,
    SQLiteText,
    SQLiteReal,
} from "drizzle-orm/sqlite-core";
import {getTableColumns, relations} from "drizzle-orm";
import {FieldSchema, ModelSchema} from "../types";
import { sql } from 'drizzle-orm';

function colToFieldType(col: any): "number" | "string" {
    if (col instanceof SQLiteInteger || col instanceof SQLiteReal) return "number";
    if (col instanceof SQLiteText) return "string";

    // Fallbacks (helpful across builds)
    const ctor = col?.constructor?.name;
    if (ctor === "SQLiteInteger" || ctor === "SQLiteReal") return "number";
    if (ctor === "SQLiteText" || ctor === "SQLiteBlob") return "string";

    // Some builds expose a dataType
    if (col?.dataType === "number" || col?.dataType === "bigint") return "number";
    if (col?.dataType === "string" || col?.dataType === "json") return "string";

    return "string";
}

export function makeSchema(table: AnySQLiteTable, tableName: string): ModelSchema {
    const columns = getTableColumns(table);
    const fields: Record<string, FieldSchema> = {};

    for (const [colName, col] of Object.entries(columns)) {
        const type: "number" | "string" = colToFieldType(col as any);

        const isNotNull = Boolean((col as any).notNull);
        const hasDefault = Boolean((col as any).hasDefault);
        const isAutoInc = Boolean((col as any).autoIncrement ?? (col as any).autoincrement);

        const field: FieldSchema = { type };
        if (isNotNull && !isAutoInc && !hasDefault) {
            field.required = true;
        }
        fields[colName] = field;
    }

    return { table: tableName, fields };
}

/**
 * Categories
 */
export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
});
export const CategorySchema = makeSchema(categories, "categories");

/**
 * Series
 */
export const series = sqliteTable("series", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    category_id: integer("category_id"),
    big_context_file: text("big_context_file"),
});
export const SeriesSchema = makeSchema(series, "series");

/**
 * Usagag Videos
 */
export const usagag_videos = sqliteTable('usagag_videos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    thumbnail: text('thumbnail').notNull(),
    video: text('video').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
  });
  export const UsagagSchema = makeSchema(usagag_videos, "usagag_videos");
/**
 * Jobs
 */
export const jobs = sqliteTable("jobs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    detail: text("detail").notNull().default("{}"),
    series_id: integer("series_id").references(() => series.id),
    episode: integer("episode"),
    priority: integer("priority").notNull().default(0),
    type: integer("type").notNull(),
});
export const JobSchema = makeSchema(jobs, "jobs");

/**
 * Statuses
 */
export const statuses = sqliteTable("statuses", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    type: integer("type").notNull(),
    position: integer("position").notNull(),
});

export const StatusSchema = makeSchema(statuses, "statuses");

/**
 * Progress
 */
export const progress = sqliteTable("progress", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    status: text("status", {
        enum: ["Going", "Success", "Failed", "Standby"],
    })
        .notNull()
        .default("Standby"),
    status_id: integer("status_id")
        .notNull()
        .references(() => statuses.id),
    job_id: integer("job_id")
        .notNull()
        .references(() => jobs.id),
});

export const ProgressSchema = makeSchema(progress, "progress");

/**
 * Signals
 */
export const signals = sqliteTable("signals", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    status: integer("status").notNull(),
});

export const SignalSchema = makeSchema(signals, "signals");

/**
 * Users
 */
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    supabase_id: text("supabase_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
});
export const UserSchema = makeSchema(users, "users");

/**
 * Roles
 */
export const roles = sqliteTable("roles", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
});
export const RoleSchema = makeSchema(roles, "roles");

/**
 * Permissions
 */
export const permissions = sqliteTable("permissions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
});
export const PermissionSchema = makeSchema(permissions, "permissions");

/**
 * Role Permissions
 */
export const role_permissions = sqliteTable("role_permissions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    role_id: integer("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permission_id: integer("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
});
export const RolePermissionSchema = makeSchema(role_permissions, "role_permissions");

/**
 * User Roles
 */
export const user_roles = sqliteTable("user_roles", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role_id: integer("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    assigned_by: integer("assigned_by").references(() => users.id, { onDelete: "set null" }),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
export const UserRoleSchema = makeSchema(user_roles, "user_roles");

/**
 * User Permissions
 */
export const user_permissions = sqliteTable("user_permissions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    permission_id: integer("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
    allowed: integer("allowed").notNull().default(1),
    assigned_by: integer("assigned_by").references(() => users.id, { onDelete: "set null" }),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
export const UserPermissionSchema = makeSchema(user_permissions, "user_permissions");


export const tableRegistry: Record<string, any> = {
    jobs,
    series,
    categories,
    progress,
    statuses,
    usagag_videos,
    signals,
    users,
    roles,
    permissions,
    role_permissions,
    user_roles,
    user_permissions,
};

// Note: use custom relationship here since Drizzle relationships does not work well with dynamic setup
// TODO: switch back to standard ORM relationship
export const relationMap: Record<
    string,
    Record<string, { foreignKey: string; target: string; targetKey: string; many?: boolean }>
> = {
    jobs: {
        series: {
            foreignKey: "series_id", // jobs.series_id → series.id
            target: "series",
            targetKey: "id",
        },
        progress: {
            foreignKey: "id",       // jobs.id
            target: "progress",     // progress.job_id
            targetKey: "job_id",
            many: true,             // 1 job → many progress
        },
    },
    series: {
        category: {
            foreignKey: "category_id", // series.category_id → categories.id
            target: "categories",
            targetKey: "id",
        },
        jobs: {
            foreignKey: "id",       // series.id
            target: "jobs",         // jobs.series_id
            targetKey: "series_id",
            many: true,             // 1 series → many jobs
        },
    },

    categories: {
        series: {
            foreignKey: "id",       // categories.id
            target: "series",       // series.category_id
            targetKey: "category_id",
            many: true,             // 1 category → many series
        },
    },

    progress: {
        job: {
            foreignKey: "job_id",   // progress.job_id → jobs.id
            target: "jobs",
            targetKey: "id",
        },
        status: {
            foreignKey: "status_id", // progress.status_id → statuses.id
            target: "statuses",
            targetKey: "id",
        },
    },

    statuses: {
        progress: {
            foreignKey: "id",       // statuses.id
            target: "progress",     // progress.status_id
            targetKey: "status_id",
            many: true,             // 1 status → many progress
        },
    },

    users: {
        user_roles: {
            foreignKey: "id", // users.id → user_roles.user_id
            target: "user_roles",
            targetKey: "user_id",
            many: true,
        },
        user_permissions: {
            foreignKey: "id", // users.id → user_permissions.user_id
            target: "user_permissions",
            targetKey: "user_id",
            many: true,
        },
    },

    roles: {
        role_permissions: {
            foreignKey: "id", // roles.id → role_permissions.role_id
            target: "role_permissions",
            targetKey: "role_id",
            many: true,
        },
        user_roles: {
            foreignKey: "id", // roles.id → user_roles.role_id
            target: "user_roles",
            targetKey: "role_id",
            many: true,
        },
    },

    permissions: {
        role_permissions: {
            foreignKey: "id", // permissions.id → role_permissions.permission_id
            target: "role_permissions",
            targetKey: "permission_id",
            many: true,
        },
        user_permissions: {
            foreignKey: "id", // permissions.id → user_permissions.permission_id
            target: "user_permissions",
            targetKey: "permission_id",
            many: true,
        },
    },

    role_permissions: {
        role: {
            foreignKey: "role_id",
            target: "roles",
            targetKey: "id",
        },
        permission: {
            foreignKey: "permission_id",
            target: "permissions",
            targetKey: "id",
        },
    },

    user_roles: {
        user: {
            foreignKey: "user_id",
            target: "users",
            targetKey: "id",
        },
        role: {
            foreignKey: "role_id",
            target: "roles",
            targetKey: "id",
        },
    },

    user_permissions: {
        user: {
            foreignKey: "user_id",
            target: "users",
            targetKey: "id",
        },
        permission: {
            foreignKey: "permission_id",
            target: "permissions",
            targetKey: "id",
        },
    },
};
