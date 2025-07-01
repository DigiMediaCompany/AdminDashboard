import { Navigate } from 'react-router-dom'
import {JSX} from "react";
import {useAppSelector} from "../../store";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const user = useAppSelector((state) => state.auth.user)
    return user ? children : <Navigate to="/signin" replace />
}

