import Button from "../ui/button/Button.tsx";
import {Modal} from "../ui/modal";
import {User} from "../../types/Admin.ts";
import {constants} from "../../utils/constants.ts";
import {useAppSelector} from "../../store";
import {useEffect, useState} from "react";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (result: OnSaveType) => void;
    user: User | null;
}

interface OnSaveType {
    user: User
}


export default function UserEditModal({
                                          isOpen,
                                          onClose,
                                          onSave,
                                          user,
                                      }: BaseModalProps) {

    const [userData, setUserData] = useState<User | null>(null);

    const authState = useAppSelector((state) => state.auth)
    const role = authState.user?.user_metadata?.role;
    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (userData) {
            onSave({
                user: userData
            })
        }

        onClose()
    };

    useEffect(() => {
        if (!user) return;
        setUserData(user)
    }, [user, isOpen])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div
                className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className=" text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Edit user
                    </h4>
                </div>

                <form className="flex flex-col">
                    {/* ===== BASIC INFO ===== */}

                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            <div>
                                <Label>Name</Label>
                                <Input type="text" value=""/>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">

                            </div>
                        </div>

                    </div>


                    {/* ===== ACTIONS ===== */}
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {role === constants.ROLES.SUPER_ADMIN ? (<>
                            <Button size="sm" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </>) : null}

                    </div>
                </form>
            </div>
        </Modal>
    );
}
