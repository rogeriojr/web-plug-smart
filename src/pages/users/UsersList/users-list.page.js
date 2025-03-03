import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import clsx from "clsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "@/services/userService";
import { Link } from "react-router-dom";
const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [limit] = useState(10);
    const [idFilter, setIdFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const loadUsers = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await fetchUsers(page, limit, idFilter, emailFilter);
            if (response && Array.isArray(response.data)) {
                setUsers(response.data);
            }
            else if (response && response._id) {
                setUsers([response]);
            }
            else {
                console.warn("Estrutura inesperada da resposta da API:", response);
                setUsers([]);
            }
            if (response.pagination) {
                setTotalPages(response.pagination.totalPages || 1);
                setHasPreviousPage(response.pagination.hasPreviousPage || false);
                setHasNextPage(response.pagination.hasNextPage || false);
            }
            else {
                setTotalPages(1);
                setHasPreviousPage(false);
                setHasNextPage(false);
            }
        }
        catch (error) {
            setErrorMessage(error.message || "Erro ao carregar usuários.");
            setUsers([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadUsers();
    }, [page, limit, idFilter, emailFilter]);
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        loadUsers();
    };
    const handleDelete = async (userId) => {
        setLoading(true);
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            setSelectedUserId(null);
            alert("Usuário excluído com sucesso");
        }
        catch (error) {
            console.error("Erro ao excluir o usuário:", error);
            let errorMessage = "Não foi possível excluir o usuário.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsx("h1", { className: "text-xl font-semibold inline-block", children: "Usu\u00E1rios" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4", children: [_jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }), _jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { className: "hidden md:block", children: _jsx(BreadcrumbLink, { href: "#", children: "Usu\u00E1rios" }) }), _jsx(BreadcrumbSeparator, { className: "hidden md:block" }), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Lista de usu\u00E1rios" }) })] }) })] }), _jsx("div", { className: "p-6 w-full space-y-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("form", { onSubmit: handleFilterSubmit, className: "flex items-center gap-2", children: [_jsx(Input, { name: "id", placeholder: "ID do usu\u00E1rio", value: idFilter, onChange: (e) => setIdFilter(e.target.value) }), _jsx(Input, { name: "email", placeholder: "Email do usu\u00E1rio", value: emailFilter, onChange: (e) => setEmailFilter(e.target.value) }), _jsxs(Button, { type: "submit", variant: "link", children: [_jsx(Search, { className: "w-4 h-4 mr-2" }), "Filtrar"] })] }), _jsxs(Button, { children: [_jsx(PlusCircle, { className: "w-4 h-4 mr-2" }), _jsx(Link, { to: "/users/create", children: "Novo usu\u00E1rio" })] })] }) })] }), loading && _jsx("p", { children: "Carregando usu\u00E1rios..." }), errorMessage && (_jsxs("div", { className: "text-center py-6", children: [_jsx("p", { className: "text-red-500 mb-4", children: errorMessage }), _jsx(Button, { variant: "outline", onClick: () => {
                            localStorage.clear(); // Limpa o armazenamento local
                            window.location.href = "/login"; // Redireciona para a página de login
                        }, className: "bg-gray-200 hover:bg-gray-300 text-black", children: "Tentar Login Novamente" })] })), !loading && !errorMessage && users.length > 0 && (_jsxs(Table, { className: "flex-1", children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-[100px]", children: "ID" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Nome" }), _jsx(TableHead, { children: "E-mail" }), _jsx(TableHead, { children: "Telefone" }), _jsx(TableHead, { children: "CPF" }), _jsx(TableHead, { children: "Data de Nascimento" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Usu\u00E1rio Desabilitado" }), " ", _jsx(TableHead, { className: "text-right", children: "A\u00E7\u00F5es" })] }) }), _jsx(TableBody, { children: users.map((user) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: user._id }), _jsx(TableCell, { children: user.tipo }), _jsx(TableCell, { children: user.nome }), _jsx(TableCell, { children: user.email }), _jsx(TableCell, { children: user.telefone }), _jsx(TableCell, { children: user.cpf }), _jsx(TableCell, { children: user.dataDeNascimento }), _jsx(TableCell, { children: _jsx(Badge, { className: "bg-blue-500 hover:bg-blue-600", children: user.status }) }), _jsx(TableCell, { children: _jsx(Badge, { className: clsx({
                                            "bg-red-500 hover:bg-red-600": user.desabilitarUsuario, // Vermelho se desabilitado
                                            "bg-green-500 hover:bg-green-600": !user.desabilitarUsuario, // Verde se habilitado
                                        }), children: user.desabilitarUsuario ? "Desabilitado" : "Habilitado" }) }), _jsxs(TableCell, { className: "text-right flex gap-1 justify-end", children: [_jsx(Button, { className: "bg-green-600 hover:bg-green-700", children: _jsx(Link, { to: `/users/edit/${user._id}`, children: "Editar" }) }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", onClick: () => {
                                                            setSelectedUserId(user._id);
                                                        }, children: "Excluir" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmar Exclus\u00E3o" }), _jsxs(DialogDescription, { children: ["Tem certeza de que deseja excluir o usu\u00E1rio", " ", _jsx("strong", { children: user.nome }), "? Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "destructive", onClick: () => {
                                                                        if (selectedUserId) {
                                                                            handleDelete(selectedUserId);
                                                                        }
                                                                        else {
                                                                            alert("ID do usuário não definido.");
                                                                        }
                                                                    }, disabled: loading, children: loading ? "Excluindo..." : "Excluir" }), _jsx(Button, { variant: "outline", as: DialogClose, disabled: loading, children: "Cancelar" })] })] })] })] })] }, user._id))) })] })), !loading && !errorMessage && users.length === 0 && (_jsx("p", { children: "Nenhum usu\u00E1rio encontrado." })), _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => hasPreviousPage && handlePageChange(page - 1), className: clsx("pagination-btn", {
                                    "opacity-50 cursor-not-allowed": !hasPreviousPage,
                                }) }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(p), className: clsx("pagination-link", { "font-bold": p === page }), children: p }) }, p))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => hasNextPage && handlePageChange(page + 1), className: clsx("pagination-btn", {
                                    "opacity-50 cursor-not-allowed": !hasNextPage,
                                }) }) })] }) })] }));
};
export default UsersPage;
