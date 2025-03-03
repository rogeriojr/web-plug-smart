import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/icon.png";
const DashboardPage = () => {
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "flex flex-col h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto", children: _jsxs("div", { className: "flex items-center gap-2 px-4", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }), _jsx(Breadcrumb, { children: _jsx(BreadcrumbList, { children: _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Bem-vindo" }) }) }) })] }) }), _jsxs("div", { className: "flex flex-1 flex-col items-center justify-center p-4 gap-6 bg-muted/50", children: [_jsx("div", { className: "w-32 h-32", children: _jsx("img", { src: logo, alt: "Logo", className: "object-contain" }) }), _jsx("h1", { className: "text-3xl font-bold text-primary text-center", children: "Bem-vindo ao Painel de Controle!" }), _jsx("p", { className: "text-lg text-muted-foreground text-center", children: "Explore as funcionalidades do sistema usando o menu lateral." })] })] }));
};
export default DashboardPage;
