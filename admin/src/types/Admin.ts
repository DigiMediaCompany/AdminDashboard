export interface User {
    id: number;
    supabase_id: string;
    email: string;
    name: string;
    user_permissions?: UserPermission[];
}

export interface Role {
    id: number;
    name: string;
    description?: string | null;
}

export interface Permission {
    id: number;
    name: string;
    description?: string | null;
    user_permissions?: UserPermission[];
}

export interface RolePermission {
    id: number;
    role_id: number;
    permission_id: number;
    // Optional relations
    role?: Role;
    permission?: Permission;
}

export interface UserRole {
    id: number;
    user_id: number;
    role_id: number;
    assigned_by?: number | null;
    updated_at: string; // ISO datetime string
    // Optional relations
    user?: User;
    role?: Role;
    assigned_by_user?: User;
}

export interface UserPermission {
    id: number;
    user_id: number;
    permission_id: number;
    allowed: number; // 1 = allowed, 0 = denied
    assigned_by?: number | null;
    updated_at: string; // ISO datetime string
    // Optional relations
    user?: User;
    permission?: Permission;
    assigned_by_user?: User;
}
