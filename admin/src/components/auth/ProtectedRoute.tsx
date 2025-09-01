import { Navigate } from 'react-router-dom'
import {JSX} from "react";
import {useAppSelector} from "../../store";
import {constants} from "../../utils/constants.ts";

interface Props {
    children: JSX.Element
    requiredRoles?: string[]
}

export default function ProtectedRoute({ children, requiredRoles = Object.values(constants.ROLES) }: Props) {
    const authState = useAppSelector((state) => state.auth)
    if (authState.loading) {
        return null
    }

    if (!authState.user) {
        return <Navigate to="/signin" />
    }

    const userRole = authState.user?.user_metadata?.role

    if (!requiredRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />
    }
    return <>{children}</>
}

