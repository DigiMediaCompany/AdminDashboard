import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {useEffect, useState} from "react";
import {Info, Site} from "../../types/Common.ts";
import {getInfo, saveInfo} from "../../services/commonApiService.ts";
import {snakeToTitleCase} from "../../utils/helper.ts";
import Toast from "../../pages/UiElements/Toast.tsx";

type WebsiteInfoCardProps = {
    site: Site;
};

export default function WebsiteInfoCard({ site }: WebsiteInfoCardProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const [info, setInfo] = useState<Info | null>(null);
    const [loading, setLoading] = useState(true);
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
    const handleSave = () => {
        if (info) {
            saveInfo(site, info)
                .then(() => {
                    console.log("Successfully Saved!");
                    setToast({
                        show: true,
                        variant: "success",
                        title: "Saved",
                        message: "Information saved successfully."
                    });
                })
                .catch(() => {
                    setToast({
                        show: true,
                        variant: "error",
                        title: "Error",
                        message: "Failed to save information."
                    });
                });
            closeModal();
        }
    };

    useEffect(() => {
        getInfo(site)
            .then(result => setInfo(result))
            .catch(() => {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: 'Failed to load info.'
                });
            })
            .finally(() => setLoading(false))
    }, [site])

    if (loading) return <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Loading info...</p>
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Basic Website Information
                        </h4>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            {info? (Object.entries(info).map(([key, value]) => (
                                <div key={key}>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        {snakeToTitleCase(key)}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {value}
                                    </p>
                                </div>
                            ))) : null}
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                        Edit
                    </button>
                </div>

                {toast.show && (
                    <Toast
                        variant={toast.variant}
                        title={toast.title}
                        message={toast.message}
                    />
                )}
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Website Info
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Wait 5 minutes after saving for changes to update on website.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                {info? (Object.entries(info).map(([key, value]) => (
                                    <div key={key}>
                                        <Label>{snakeToTitleCase(key)}</Label>
                                        <Input type="text" value={value}
                                               onChange={(e) =>
                                                   setInfo((prev) => ({
                                                       ...prev,
                                                       [key]: e.target.value,
                                                   }))
                                               }
                                        />
                                    </div>
                                ))) : (
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        Nothing here
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

        </>
    );
}
