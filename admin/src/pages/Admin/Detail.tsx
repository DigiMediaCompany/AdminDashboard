import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import Toast from "../UiElements/Toast.tsx";
import {useEffect, useMemo, useState} from "react";
import {useModal} from "../../hooks/useModal.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import {useParams} from "react-router";
import UserDetailTable from "../../components/tables/admin/UserDetailTable.tsx";
import {getApi, postApi} from "../../services/commonApiService.ts";
import PermissionModal from "../../components/modals/PermissionModal.tsx";
import {Permission, User} from "../../types/Admin.ts";
import {useAppSelector} from "../../store";
import {constants} from "../../utils/constants.ts";

interface DetailProps {
    isCreator?: boolean;
}

export default function Detail({ isCreator = true }: DetailProps) {
    const authState = useAppSelector((state) => state.auth)
    const supabaseId = authState.user?.id;
    const role = authState.user?.user_metadata.role;
    const isAllowedCreate = role === constants.ROLES.ADMIN || role === constants.ROLES.SUPER_ADMIN;
    const params = useParams<{ id?: string }>();
    const routeId = params.id ?? null;


    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error";
        title: string;
        message: string;
    }>({
        show: false,
        variant: "success",
        title: "",
        message: ""
    });
    const { isOpen, openModal, closeModal } = useModal();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);


    const target = useMemo<
        | { mode: "creator"; supabaseId: string }
        | { mode: "byId"; id: string }
        | { mode: "invalid" }
    >(() => {
        if (isCreator) {
            if (supabaseId) return { mode: "creator", supabaseId };
            return { mode: "invalid" };
        }
        if (routeId) return { mode: "byId", id: routeId };
        return { mode: "invalid" };
    }, [isCreator, supabaseId, routeId]);

    // Fetch user based on the chosen mode
    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setLoadError(null);

            try {
                if (target.mode === "creator") {
                    const result = await getApi<User>({
                        model: "users",
                        module: "/admin",
                        filter: { supabase_id: target.supabaseId },
                    });

                    const u = result.data?.[0] ?? null;
                    if (!cancelled) {
                        if (u) {
                            setUser(u);
                        } else {
                            setLoadError("User not found for current account.");
                            setUser(null);
                        }
                    }
                } else if (target.mode === "byId") {
                    const result = await getApi<User>({
                        model: "users",
                        module: "/admin",
                        filter: { id: target.id },
                    });

                    const u = result.data?.[0] ?? null;
                    if (!cancelled) {
                        if (u) {
                            setUser(u);
                        } else {
                            setLoadError("User does not exist.");
                            setUser(null);
                        }
                    }
                } else {
                    if (!cancelled) {
                        setLoadError(
                            isCreator
                                ? "Invalid state: missing Supabase user id."
                                : "Invalid route: missing id."
                        );
                        setUser(null);
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    console.log(e)
                    setLoadError("Failed to load user.");
                    setUser(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run().then(() => {}).catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [target, isCreator]);

    // Early UI states
    if (loading) {
        return <p>Loading…</p>;
    }

    if (loadError) {
        return <p>{loadError}</p>;
    }

    if (!user) {
        // If we’re here, we already showed a specific error above.
        return <p>User not available.</p>;
    }

    return (
        <>
            {toast.show && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                    changeState={() => setToast({ show: false,
                        variant: "success",
                        title: "",
                        message: ""
                    })}
                />
            )}
            <PageMeta/>
            <PageBreadcrumb pageTitle={`${user.name}'s domains `} />

            <div className="space-y-6">
                <ComponentCard title="Domain"
                               onClick={()=>{openModal()}}
                               showCreateButton={isAllowedCreate}
                >
                    <UserDetailTable userId={user.id.toString()} />
                </ComponentCard>
            </div>
            <PermissionModal
                isOpen={isOpen}
                onClose={closeModal}
                onSave={(result) => {
                    postApi<Permission>({
                        model: 'permissions',
                        payload: {
                            name: result.name,
                            description: result.description,
                        },
                        module: '/admin'
                    }).then((result) => {
                        postApi({
                            model: 'user_permissions',
                            payload: {
                                user_id: user.id,
                                permission_id: result.id
                            },
                            module: '/admin'
                        }).then(() => {
                            setToast({
                                show: true,
                                variant: "success",
                                title: "Created",
                                message: "Created successfully."
                            });
                            window.location.reload();
                        }).catch(() => {
                            setToast({
                                show: true,
                                variant: "error",
                                title: "Error",
                                message: "Failed."
                            });
                        })
                    }). catch(() => {})

                }}
            />
        </>
    );
}
