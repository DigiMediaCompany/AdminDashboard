import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import Toast from "../UiElements/Toast.tsx";
import {useEffect, useState} from "react";
import {useModal} from "../../hooks/useModal.ts";
import PageMeta from "../../components/common/PageMeta.tsx";
import {useParams} from "react-router";
import UserDetailTable from "../../components/tables/admin/UserDetailTable.tsx";
import {getApi, postApi} from "../../services/commonApiService.ts";
import PermissionModal from "../../components/modals/PermissionModal.tsx";
import {Permission, User} from "../../types/Admin.ts";

export default function Detail() {
    const { id } = useParams<{ id: string }>();


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




    useEffect(() => {
        if (!id) return;
        getApi<User>({
            model: 'users',
            module: '/admin',
            filter: {
                id: id
            }
        })
            .then(result => {
                setUser(result.data[0]);
            })
            .catch(() => {
            })
    }, [id])

    if (!id) {
        return <p>Invalid route: missing id</p>;
    }

    if (!user) {
        return <p>User does not exist</p>;
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
            <PageBreadcrumb pageTitle={`${user.name}'s permissions `} />
            <div className="space-y-6">
                <ComponentCard title="Permission"
                               onClick={()=>{openModal()}}>
                    <UserDetailTable userId={id} />
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
                                user_id: parseInt(id),
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
