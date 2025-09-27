# Cloudflare D1 Workers

This is a Cloudflare Worker with CRUD generator using [Drizzle](https://github.com/drizzle-team/drizzle-orm).

## Feature
- Setting up a model/relation as you can see in `models.ts`
- Each model/relation will allow you to have some default behaviours
    - Pagination
    - Filter/sorting using query param
    - Load relation using query param 'include'
    - No N+1
    - GET/POST/PATCH/DELETE/OPTION endpoint with standard behaviour

EXAMPLE:
```
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
});

export const StatusSchema = makeSchema(users, "users");

export const relationMap: Record<
    string,
    Record<string, { foreignKey: string; target: string; targetKey: string; many?: boolean }>
> = {
    users: {
        items: {
            foreignKey: "id",       // users.id
            target: "items",     // items.user_id
            targetKey: "item_id",
            many: true,             // 1 user → many items
        },
    },
};
```
This should generate the following
- GET /users and /users/id (params: include=items, name='', sort=name, sort=-name, page=n)
- POST /users and PATCH /users/id with validations and allow fields based on schema (you can add custom validation)
- DELETE /users/id
- OPTION /users and users/id with CORS setup

## Installation
- Prerequisites
    - Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
    - Get wrangler
    - For more details look up Cloudflare document on `wrangler d1` and `wrangler migration`
- Change your mapping/env on `wrangler.json`
    - database_id and name as you choose
    - `API_TOKEN` as a random string
```
wrangler d1 migrations apply D1_DATABASE
wranger dev
```
- Open `http://localhost:8787/` in your browser to see the Swagger interface where you can try the endpoints.
- To deploy
```
wrangler login
wrangler d1 migrations apply D1_DATABASE --remote
wranger deploy
```

## TODO
- Redo the secret/env var
- Adjust CORS setting
- Make a real authentication/authorization