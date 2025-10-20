
import {useEffect, useState} from "react";
import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import MultiSelect from "../form/MultiSelect.tsx";
import {Permission} from "../../types/Admin.ts";
import {getApi} from "../../services/commonApiService.ts";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: unknown) => void;
}

interface UserData {
    name: string,
    permissions: string[],
}

export default function UserModal({
                                            isOpen,
                                            onClose,
                                            onSave,
                                        }: BaseModalProps) {
    // const [quiz, setQuiz] = useState<string>();
    const [userData, setUserData] = useState<UserData>({
        name: "",
        permissions: [],
    });
    const [seriesList, setSeriesList] = useState<Permission[]>([]);

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (userData) {
            onSave(userData);
            // setUserData({
            //     name: "",
            //     permissions: []
            // })
        }
        onClose()
    };

    // TODO: get permission list from outside
    useEffect(() => {
        getApi<Permission>({
            model: 'permissions',
            module: '/admin'
        })
            .then(result => {
                setSeriesList(result.data);
            })
            .catch(() => {
            })
    }, [])

    const permissionOptions = [
        { value: "1", text: "Showcase", selected: false },
        { value: "3", text: "Admin dashboard", selected: false },
        { value: "4", text: "Usagag", selected: false },
        { value: "5", text: "Youtube Article", selected: false },
        { value: "6", text: "PostFunny", selected: false },
        { value: "7", text: "FreeApk", selected: false },
        { value: "8", text: "GonoGame", selected: false },
        { value: "9", text: "MzGenz", selected: false },
        { value: "10", text: "TikGame", selected: false },
    ];


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className=" text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Create a new permission
                    </h4>
                </div>

                <form className="flex flex-col">
                    {/* ===== BASIC INFO ===== */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) =>
                                        setUserData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                    </div>

                    <MultiSelect
                        label="Permissions"
                        options={permissionOptions}
                        onChange={(values) => setUserData((prev) => ({
                            ...prev,
                            permissions: values,
                        }))
                        }
                    />

                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
