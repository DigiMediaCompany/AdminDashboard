-- Migration number: 0003 	 2025-10-18T06:47:38.598Z

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supabase_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    assigned_by INTEGER,
    updated_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    allowed INTEGER NOT NULL DEFAULT 1,
    assigned_by INTEGER,
    updated_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id
    ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id
    ON role_permissions(permission_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_role_permissions_unique
    ON role_permissions(role_id, permission_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
    ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id
    ON user_roles(role_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_unique
    ON user_roles(user_id, role_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id
    ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission_id
    ON user_permissions(permission_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_permissions_unique
    ON user_permissions(user_id, permission_id);

-- Triggers to update updated_at when someone changes perm or role
CREATE TRIGGER IF NOT EXISTS user_roles_set_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
SELECT RAISE(IGNORE);
END;

CREATE TRIGGER IF NOT EXISTS user_roles_auto_updated_at
AFTER UPDATE ON user_roles
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
UPDATE user_roles
SET updated_at = CURRENT_TIMESTAMP
WHERE id = OLD.id;
END;


CREATE TRIGGER IF NOT EXISTS user_permissions_set_updated_at
BEFORE UPDATE ON user_permissions
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
SELECT RAISE(IGNORE);
END;

CREATE TRIGGER IF NOT EXISTS user_permissions_auto_updated_at
AFTER UPDATE ON user_permissions
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
UPDATE user_permissions
SET updated_at = CURRENT_TIMESTAMP
WHERE id = OLD.id;
END;

