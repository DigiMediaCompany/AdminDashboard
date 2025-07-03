import { useState, useEffect } from "react";
import Alert from "../../components/ui/alert/Alert.tsx";

type ToastProps = {
    variant?: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
    duration?: number;
};

export default function Toast({
                                  variant = "info",
                                  title,
                                  message,
                                  duration = 3000,
                              }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm">
            <Alert
                variant={variant}
                title={title}
                message={message}
            />
        </div>
    );
}
