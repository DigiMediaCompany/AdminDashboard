import { useState } from "react";
import Button from "../ui/button/Button.tsx";
import { Modal } from "../ui/modal";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import { constants } from "../../utils/constants.ts";
import { useAppSelector } from "../../store";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UserData) => void;
}

interface UserData {
    name: string;
    email: string;
    password: string;
}

export default function UserCreateModel({
                                            isOpen,
                                            onClose,
                                            onSave,
                                        }: BaseModalProps) {
    const [userData, setUserData] = useState<UserData>({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!userData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!userData.password) {
            newErrors.password = "Password is required";
        } else if (userData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        } else if (!/\d/.test(userData.password)) {
            newErrors.password = "Password must contain at least one number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (validate()) {
            onSave(userData);
            setUserData({ name: "", email: "", password: "" });
            onClose();
        }
    };

    const authState = useAppSelector((state) => state.auth);
    const role = authState.user?.user_metadata?.role;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full m-4 lg:max-w-[900px]"
        >
            <div className="no-scrollbar relative w-full h-[90vh] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14 mb-10">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Create a new user
                    </h4>
                </div>

                <form className="flex flex-col">
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-3">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) =>
                                        setUserData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) =>
                                        setUserData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Label>Password</Label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={userData.password}
                                    onChange={(e) =>
                                        setUserData((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                />
                                {/* Show/Hide toggle */}
                                <button
                                    type="button"
                                    className="absolute right-3 top-[38px] text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {role === constants.ROLES.SUPER_ADMIN && (
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={!userData.email || !userData.password}
                            >
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
}
