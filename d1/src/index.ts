import {
    series,
    jobs,
    categories,
    CategorySchema,
    SeriesSchema,
    JobSchema,
    progress,
    StatusSchema,
    ProgressSchema,
    statuses,
    usagag_videos,
    UsagagSchema,
    signals, SignalSchema, users, UserSchema,
    roles, RoleSchema,
    permissions, PermissionSchema,
    role_permissions,
    RolePermissionSchema,
    user_roles,
    UserRoleSchema, user_permissions, UserPermissionSchema
} from "./db/models";
import {createCrudRoutes} from "./utils/crud";

import { Env } from "./types";
import {STATUS_SEED} from "./utils/constant";
import { sql } from "drizzle-orm";

const articleGroup = "/article"
const usagagGroup = "/usagag"
const adminGroup = "/admin"

// Usagag
const usagagVideosHandler = createCrudRoutes({
    table: usagag_videos,
    columns: {id: usagag_videos.id, title: usagag_videos.title, slug: usagag_videos.slug, thumbnail: usagag_videos.thumbnail, video: usagag_videos.video },
    schema: UsagagSchema
});

// Article
const categoriesHandler = createCrudRoutes({
    table: categories,
    columns: { id: categories.id, name: categories.name },
    schema: CategorySchema,
});

const seriesHandler = createCrudRoutes({
    table: series,
    columns: {
        id: series.id,
        name: series.name,
        category_id: series.category_id,
        big_context_file: series.big_context_file,
    },
    schema: SeriesSchema,
});

const jobsHandler = createCrudRoutes(
    {
        table: jobs,
        columns: {
            id: jobs.id,
            detail: jobs.detail,
            series_id: jobs.series_id,
            episode: jobs.episode,
            priority: jobs.priority,
            type: jobs.type,
        },
        schema: JobSchema,
        custom: (app, db) => {
            app.post(`${articleGroup}/jobs`, async (c) => {
                const body = await c.req.json();


                const [newJob] = await db
                    .insert(jobs)
                    .values({
                        detail: body.detail ?? "{}",
                        series_id: body.series_id ?? null,
                        episode: body.episode ?? null,
                        priority: body.priority ?? 0,
                        type: body.type,
                    })
                    .returning();


                const statusRows = STATUS_SEED.filter((s) => s.type === newJob.type);

                if (statusRows.length) {
                    const progressInserts = statusRows.map((s) => ({
                        job_id: newJob.id,
                        status_id: s.id,
                    }));

                    await db.insert(progress).values(progressInserts).all();
                }

                return c.json({
                    newJob,
                });
            });
        }
    },
);

const statusesHandler = createCrudRoutes({
    table: statuses,
    columns: {
        id: statuses.id,
        name: statuses.name,
        type: statuses.type,
        position: statuses.position,
    },
    schema: StatusSchema,
});

const progressHandler = createCrudRoutes({
    table: progress,
    columns: {
        id: progress.id,
        status: progress.status,
        status_id: progress.status_id,
        job_id: progress.job_id,
    },
    schema: ProgressSchema,
});

const signalHandler = createCrudRoutes({
    table: signals,
    columns: {
        id: signals.id,
        status: signals.status,
    },
    schema: SignalSchema,
});

// Admin

const usersHandler = createCrudRoutes({
    table: users,
    columns: {
        id: users.id,
        supabase_id: users.supabase_id,
        email: users.email,
        name: users.name,
    },
    schema: UserSchema,
});

const rolesHandler = createCrudRoutes({
    table: roles,
    columns: {
        id: roles.id,
        name: roles.name,
        description: roles.description,
    },
    schema: RoleSchema,
});

const permissionsHandler = createCrudRoutes({
    table: permissions,
    columns: {
        id: permissions.id,
        name: permissions.name,
        description: permissions.description,
    },
    schema: PermissionSchema,
});

const rolePermissionsHandler = createCrudRoutes({
    table: role_permissions,
    columns: {
        id: role_permissions.id,
        role_id: role_permissions.role_id,
        permission_id: role_permissions.permission_id,
    },
    schema: RolePermissionSchema,
});

const userRolesHandler = createCrudRoutes({
    table: user_roles,
    columns: {
        id: user_roles.id,
        user_id: user_roles.user_id,
        role_id: user_roles.role_id,
        assigned_by: user_roles.assigned_by,
        updated_at: user_roles.updated_at,
    },
    schema: UserRoleSchema,
});

const userPermissionsHandler = createCrudRoutes({
    table: user_permissions,
    columns: {
        id: user_permissions.id,
        user_id: user_permissions.user_id,
        permission_id: user_permissions.permission_id,
        allowed: user_permissions.allowed,
        assigned_by: user_permissions.assigned_by,
        updated_at: user_permissions.updated_at,
    },
    schema: UserPermissionSchema,
});


export default {
    async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(req.url);

        // Article
        if (url.pathname.startsWith(`${articleGroup}/categories`)) {
            return categoriesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/series`)) {
            return seriesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/jobs`)) {
            return jobsHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/statuses`)) {
            return statusesHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/progress`)) {
            return progressHandler(req, env);
        }
        if (url.pathname.startsWith(`${articleGroup}/signals`)) {
            return signalHandler(req, env);
        }
        // Usagag
        if (url.pathname.startsWith(`${usagagGroup}/videos`)) {
            return usagagVideosHandler(req, env);
        }
        // Admin
        if (url.pathname.startsWith(`${adminGroup}/users`)) {
            return usersHandler(req, env);
        }
        if (url.pathname.startsWith(`${adminGroup}/roles`)) {
            return rolesHandler(req, env);
        }
        if (url.pathname.startsWith(`${adminGroup}/permissions`)) {
            return permissionsHandler(req, env);
        }
        if (url.pathname.startsWith(`${adminGroup}/role_permissions`)) {
            return rolePermissionsHandler(req, env);
        }
        if (url.pathname.startsWith(`${adminGroup}/user_roles`)) {
            return userRolesHandler(req, env);
        }
        if (url.pathname.startsWith(`${adminGroup}/user_permissions`)) {
            return userPermissionsHandler(req, env);
        }

        return new Response("Not Found", { status: 404 });
    },
};
