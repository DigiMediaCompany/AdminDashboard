import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import UserTable from "../../components/tables/admin/UserTable.tsx";
import {useModal} from "../../hooks/useModal.ts";
import {useState} from "react";
import Toast from "../UiElements/Toast.tsx";
import {postApi} from "../../services/commonApiService.ts";
import UserCreateModel from "../../components/modals/UserCreateModel.tsx";
import {signUp} from "../../services/authService.ts";

export default function User() {

    const { isOpen, openModal, closeModal } = useModal();
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
            <PageBreadcrumb pageTitle="Users" />
            <div className="space-y-6">
                <ComponentCard title="Users" desc="Manage your users and their roles"
                               onClick={()=>{openModal()}}>
                    <UserTable />
                </ComponentCard>
            </div>

            <UserCreateModel
                isOpen={isOpen}
                onClose={closeModal}
                onSave={async  (user) => {
                    const { data, error } = await signUp(
                        user.email, user.password, user.name)

                    if (error) {
                        setToast({
                            show: true,
                            variant: "error",
                            title: error.name,
                            message: error.message
                        })
                    } else {
                        if (data) {
                            postApi({
                                model: 'users',
                                payload: {
                                    name: user.name,
                                    email: user.email,
                                    supabase_id: data.user?.id
                                },
                                module: '/admin'
                            }).then(() => {
                                window.location.reload();
                            }).catch(() => {
                            })
                        }
                        setToast({
                            show: true,
                            variant: "success",
                            title: "Success",
                            message: "Signup successful! Check your email to confirm."
                        })

                    }
                }}
            />
        </>
    );
}
