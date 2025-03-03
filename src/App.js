import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
// App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
// PAGES
import LoginPage from "./pages/login/login.page";
import DashboardPage from "./pages/dashboard/dashboard.page";
import Layout from "./components/Layout";
import UsersPage from "./pages/users/UsersList/users-list.page";
import UserCreatePage from "./pages/users/UsersCreate/users-create.page";
import TravasPage from "./pages/travas/TravasList/travas-list.page";
import AcessosPage from "./pages/acessos/AcessosList/acessos-list.page";
import TravaCreatePage from "./pages/travas/TravasCreate/travas-create-page";
import UserEditPage from "./pages/users/UsersEdit/users-edit.page";
import TravaEditPage from "./pages/travas/TravasEdit/travas-edit-page";
import SmsSendPage from "./pages/sms/sms-page";
import AcessoEditPage from "./pages/acessos/AcessosList/AcessosEdit/acessos-edit-list";
import PrivacyPolicy from "./pages/privacy/privacy-page";
import AccountDeletion from "./pages/delete-account/delete-account-page";
// Simulação de estado global para autenticação
const useAuth = () => {
    const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem("authToken"));
    const login = (token) => {
        localStorage.setItem("authToken", token);
        setAuthenticated(true);
    };
    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthenticated(false);
    };
    return { isAuthenticated, login, logout };
};
// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
    const auth = useAuth();
    return auth.isAuthenticated ? children : _jsx(Navigate, { to: "/login", replace: true });
};
const App = () => {
    const { isAuthenticated, login } = useAuth();
    return (_jsxs(BrowserRouter, { children: [_jsx(Toaster, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: isAuthenticated ? (_jsx(Navigate, { to: "/dashboard", replace: true })) : (_jsx(LoginPage, { login: login })) }), _jsx(Route, { path: "/politica-privacidade", element: _jsx(PrivacyPolicy, {}) }), _jsx(Route, { path: "/exclusao-conta", element: _jsx(AccountDeletion, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(DashboardPage, {}) }) }) }), _jsx(Route, { path: "/users", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(UsersPage, {}) }) }) }), _jsx(Route, { path: "/users/create", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(UserCreatePage, {}) }) }) }), _jsx(Route, { path: "/users/edit/:id", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(UserEditPage, {}) }) }) }), _jsx(Route, { path: "/travas", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(TravasPage, {}) }) }) }), _jsx(Route, { path: "/travas/create", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(TravaCreatePage, {}) }) }) }), _jsx(Route, { path: "/travas/edit/:id", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(TravaEditPage, {}) }) }) }), _jsx(Route, { path: "/travas/acessos", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(AcessosPage, {}) }) }) }), _jsx(Route, { path: "/acessos/edit/:id", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(AcessoEditPage, {}) }) }) }), _jsx(Route, { path: "/sms", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsx(SmsSendPage, {}) }) }) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Navigate, { to: "/dashboard", replace: true }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] })] }));
};
export default App;
