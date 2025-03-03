// ProtectedRoute.tsx
import { ReactElement, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/contexts/user.context";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
