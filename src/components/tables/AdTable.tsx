import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import TextArea from "../form/input/TextArea.tsx";
import {Ads, SiteProps} from "../../types/Common.ts";
import {getAds} from "../../services/commonApiService.ts";
import {useEffect, useState} from "react";
import Toast from "../../pages/UiElements/Toast.tsx";
import {useModal} from "../../hooks/useModal.ts";
import Input from "../form/input/InputField.tsx";

export default function AdTable({ site }: SiteProps) {
    const {isOpen, openModal, closeModal } = useModal();
    const [ads, setAds] = useState<Ads[]>([]);
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
        // if (info) {
        //     saveInfo(site, info)
        //         .then(() => {
        //             console.log("Successfully Saved!");
        //             setToast({
        //                 show: true,
        //                 variant: "success",
        //                 title: "Saved",
        //                 message: "Information saved successfully."
        //             });
        //         })
        //         .catch(() => {
        //             setToast({
        //                 show: true,
        //                 variant: "error",
        //                 title: "Error",
        //                 message: "Failed to save information."
        //             });
        //         });
        //     closeModal();
        // }
    };

    useEffect(() => {
        getAds(site)
            .then(result => {
                setAds(result.data)
            })
            .catch(() => {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: 'Failed to load ads.'
                });
            })
            .finally(() => setLoading(false))
    }, [site])

    if (loading) return <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Loading ads...</p>
    return (
        <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {ads && ads.length > 0 ? (ads.map(ad => (
                    <div className="space-y-6">
                        <ComponentCard title={ad?.description || '' }>
                            <Label>Id</Label>
                            <Input type="text" value={ad?.id} disabled={true}/>
                            <Label>Ad slot</Label>
                            <Input type="text" value={ad?.slot} disabled={true}/>
                            <TextArea rows={6} value={ad?.script} />
                        </ComponentCard>
                    </div>
                ))) : null}
        </div>
            {toast.show && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    message={toast.message}
                />
            )}
        </>
    )
}