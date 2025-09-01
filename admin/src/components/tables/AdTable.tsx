import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import TextArea from "../form/input/TextArea.tsx";
import {Ads, SiteProps} from "../../types/Common.ts";
import {getAds, updateAds} from "../../services/commonApiService.ts";
import {useEffect, useState} from "react";
import Toast from "../../pages/UiElements/Toast.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {FolderArrowDownIcon} from "@heroicons/react/24/outline";

export default function AdTable({site}: SiteProps) {
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

    const handleSave = (ad: Ads) => {
        updateAds(ad.script, ad.id)
            .then(() => {
                setToast({
                    show: true,
                    variant: "success",
                    title: "Saved",
                    message: "Ad saved successfully."
                });
            })
            .catch(() => {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: "Failed to save ad."
                });
            });
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
                {ads && ads.length > 0 ? (ads.map((ad) => (
                    <ComponentCard key={ad.id} title={ad?.description || ''}>
                        <div className="flex space-x-6 items-center">

                            <Label>Slot</Label>
                            <Input type="text" value={ad?.slot} disabled={true}/>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    handleSave(ad)
                                }}
                                startIcon={<FolderArrowDownIcon className="size-5"/>}
                            >
                                Save
                            </Button>
                        </div>
                        <TextArea rows={6} value={ad?.script}
                                  onChange={(newScript) => {
                                      setAds((prevAds) =>
                                          prevAds.map((a) =>
                                              a.id === ad.id ? {...a, ...{script: newScript}} : a
                                          )
                                      );
                                  }}
                        />
                    </ComponentCard>
                ))) : null}
            </div>
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
        </>
    )
}