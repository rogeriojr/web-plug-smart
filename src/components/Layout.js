import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppSidebar from "./groups/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
const Layout = ({ children }) => {
    return (_jsx(SidebarProvider, { children: _jsxs("div", { className: "flex min-h-screen w-full", children: [_jsx(AppSidebar, {}), _jsx("div", { className: "flex-1 p-4", children: _jsx(SidebarInset, { children: children }) })] }) }));
};
export default Layout;
