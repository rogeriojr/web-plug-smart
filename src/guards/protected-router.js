import { jsx as _jsx } from "react/jsx-runtime";
// ProtectedRoute.tsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/contexts/user.context";
const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(UserContext);
    if (!currentUser) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
};
export default ProtectedRoute;
