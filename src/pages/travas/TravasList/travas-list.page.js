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
import { fetchTravas, downloadQrCode, deleteTrava, } from "@/services/travaService";
import { Link, useNavigate } from "react-router-dom"; // Adicionado useNavigate
const TravasPage = () => {
    const [Travas, setTravas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [limit] = useState(10);
    const [idFilter, setIdFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [selectedTravaId, setSelectedTravaId] = useState(null);
    const navigate = useNavigate(); // Adicionado para redirecionamento
    const loadTravas = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await fetchTravas(page, limit);
            if (response && Array.isArray(response.data)) {
                setTravas(response.data);
            }
            else if (response && response._id) {
                setTravas([response]);
            }
            else {
                console.warn("Estrutura inesperada da resposta da API:", response);
                setTravas([]);
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
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate("/login"); // Redireciona para login se não autenticado
            }
            else {
                setErrorMessage(error.message || "Erro ao carregar usuários.");
            }
            setTravas([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadTravas();
    }, [page, limit, idFilter, emailFilter]);
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        loadTravas();
    };
    const handleDelete = async (TravaId) => {
        setLoading(true);
        try {
            await deleteTrava(TravaId);
            setTravas((prevTravas) => prevTravas.filter((Trava) => Trava._id !== TravaId));
            setSelectedTravaId(null);
            alert("Trava excluída com sucesso");
        }
        catch (error) {
            console.error("Erro ao excluir o usuário:", error);
            let errorMessage = "Não foi possível excluir a trava.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsx("h1", { className: "text-xl font-semibold inline-block", children: "Travas" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4", children: [_jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }), _jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { className: "hidden md:block", children: _jsx(BreadcrumbLink, { href: "#", children: "Travas" }) }), _jsx(BreadcrumbSeparator, { className: "hidden md:block" }), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Lista de travas" }) })] }) })] }), _jsx("div", { className: "p-6 w-full space-y-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("form", { onSubmit: handleFilterSubmit, className: "flex items-center gap-2", children: [_jsx(Input, { name: "id", placeholder: "ID da trava", value: idFilter, onChange: (e) => setIdFilter(e.target.value) }), _jsx(Input, { name: "nome", placeholder: "Nome da Trava", value: emailFilter, onChange: (e) => setEmailFilter(e.target.value) }), _jsxs(Button, { type: "submit", variant: "link", children: [_jsx(Search, { className: "w-4 h-4 mr-2" }), "Filtrar"] })] }), _jsx(Button, { asChild: true, children: _jsxs(Link, { to: "/travas/create", children: [_jsx(PlusCircle, { className: "w-4 h-4 mr-2" }), "Nova trava"] }) })] }) })] }), loading && _jsx("p", { children: "Carregando travas..." }), errorMessage && (_jsxs("div", { className: "text-center py-6", children: [_jsx("p", { className: "text-red-500 mb-4", children: errorMessage }), _jsx(Button, { variant: "outline", onClick: () => {
                            localStorage.clear();
                            navigate("/login"); // Redireciona para login
                        }, className: "bg-gray-200 hover:bg-gray-300 text-black", children: "Tentar Login Novamente" })] })), !loading && !errorMessage && Travas.length > 0 && (_jsxs(Table, { className: "flex-1", children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-[100px]", children: "ID" }), _jsx(TableHead, { children: "Nome" }), _jsx(TableHead, { children: "Id do Disp." }), _jsx(TableHead, { children: "C\u00F3digo" }), _jsx(TableHead, { children: "QRCode" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Power Status" }), _jsx(TableHead, { children: "Nome do Mercado" }), _jsx(TableHead, { children: "Usu\u00E1rios" }), _jsx(TableHead, { children: "Tempo de Desligamento (s)" }), _jsx(TableHead, { className: "text-right", children: "A\u00E7\u00F5es" })] }) }), _jsx(TableBody, { children: Travas.map((Trava) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: Trava._id }), _jsx(TableCell, { children: Trava.nome }), _jsx(TableCell, { children: Trava.deviceId }), _jsx(TableCell, { children: Trava.codigo }), _jsx(TableCell, { children: _jsx(Button, { onClick: () => {
                                            downloadQrCode(Trava.codigo);
                                        }, children: "Baixar" }) }), _jsx(TableCell, { children: _jsx(Badge, { className: "bg-blue-500 hover:bg-blue-600 ", children: Trava.status }) }), _jsx(TableCell, { children: Trava.powerStatus }), _jsx(TableCell, { children: Trava.nomeMercado }), _jsx(TableCell, { children: Trava.usuarios.length }), _jsx(TableCell, { children: Trava.tempoDesligamento
                                        ? (Trava.tempoDesligamento / 1000).toFixed(0) + "s"
                                        : "30s" }), _jsxs(TableCell, { className: "text-right flex gap-1 justify-end", children: [_jsx(Button, { asChild: true, className: "bg-green-600 hover:bg-green-700", children: _jsx(Link, { to: `/travas/edit/${Trava._id}`, children: "Editar" }) }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", onClick: () => {
                                                            setSelectedTravaId(Trava._id);
                                                        }, children: "Excluir" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmar Exclus\u00E3o" }), _jsxs(DialogDescription, { children: ["Tem certeza de que deseja excluir a trava", " ", _jsx("strong", { children: Trava.nome }), "? Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "destructive", onClick: () => {
                                                                        if (selectedTravaId) {
                                                                            handleDelete(selectedTravaId);
                                                                        }
                                                                        else {
                                                                            alert("ID da trava não definida.");
                                                                        }
                                                                    }, disabled: loading, children: loading ? "Excluindo..." : "Excluir" }), _jsx(Button, { variant: "outline", as: DialogClose, disabled: loading, children: "Cancelar" })] })] })] })] })] }, Trava._id))) })] })), !loading && !errorMessage && Travas.length === 0 && (_jsx("p", { children: "Nenhuma trava encontrada." })), _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => hasPreviousPage && handlePageChange(page - 1), className: clsx("pagination-btn", {
                                    "opacity-50 cursor-not-allowed": !hasPreviousPage,
                                }) }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(p), className: clsx("pagination-link", { "font-bold": p === page }), children: p }) }, p))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => hasNextPage && handlePageChange(page + 1), className: clsx("pagination-btn", {
                                    "opacity-50 cursor-not-allowed": !hasNextPage,
                                }) }) })] }) })] }));
};
export default TravasPage;
