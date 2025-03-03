import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import clsx from "clsx";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { fetchAcessos } from "@/services/acessoService";
import { Link } from "react-router-dom";
const AcessosPage = () => {
    const [acessos, setAcessos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [limit] = useState(10);
    // Filtros
    const [nomeUsuarioFilter, setNomeUsuarioFilter] = useState("");
    const [emailUsuarioFilter, setEmailUsuarioFilter] = useState("");
    const [telefoneUsuarioFilter, setTelefoneUsuarioFilter] = useState("");
    const [nomeTravaFilter, setNomeTravaFilter] = useState("");
    const [selectedAcessoId, setSelectedAcessoId] = useState(null);
    const loadAcessos = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await fetchAcessos(page, limit, nomeUsuarioFilter, emailUsuarioFilter, telefoneUsuarioFilter, nomeTravaFilter);
            if (response && Array.isArray(response.data)) {
                setAcessos(response.data);
            }
            else if (response && response._id) {
                setAcessos([response]);
            }
            else {
                console.warn("Estrutura inesperada da resposta da API:", response);
                setAcessos([]);
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
            setErrorMessage(error.message || "Erro ao carregar acessos.");
            setAcessos([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadAcessos();
    }, [
        page,
        limit,
        nomeUsuarioFilter,
        emailUsuarioFilter,
        telefoneUsuarioFilter,
        nomeTravaFilter,
    ]);
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        loadAcessos();
    };
    const handleDelete = async (acessoId) => {
        setLoading(true);
        try {
            await deleteAcesso(acessoId);
            setAcessos((prevAcessos) => prevAcessos.filter((acesso) => acesso._id !== acessoId));
            setSelectedAcessoId(null);
            alert("Acesso excluído com sucesso");
        }
        catch (error) {
            console.error("Erro ao excluir o acesso:", error);
            let errorMessage = "Não foi possível excluir o acesso.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsx("h1", { className: "text-xl font-semibold inline-block", children: "Acessos" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4", children: [_jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }), _jsx(Breadcrumb, { children: _jsxs(BreadcrumbList, { children: [_jsx(BreadcrumbItem, { className: "hidden md:block", children: _jsx(BreadcrumbLink, { href: "#", children: "Acessos" }) }), _jsx(BreadcrumbSeparator, { className: "hidden md:block" }), _jsx(BreadcrumbItem, { children: _jsx(BreadcrumbPage, { children: "Lista de Acessos" }) })] }) })] }), _jsx("div", { className: "p-6 w-full space-y-4", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("form", { onSubmit: handleFilterSubmit, className: "flex items-center gap-2", children: [_jsx(Input, { name: "nomeUsuario", placeholder: "Nome do usu\u00E1rio", value: nomeUsuarioFilter, onChange: (e) => setNomeUsuarioFilter(e.target.value) }), _jsx(Input, { name: "emailUsuario", placeholder: "Email do usu\u00E1rio", value: emailUsuarioFilter, onChange: (e) => setEmailUsuarioFilter(e.target.value) }), _jsx(Input, { name: "telefoneUsuario", placeholder: "Telefone do usu\u00E1rio", value: telefoneUsuarioFilter, onChange: (e) => setTelefoneUsuarioFilter(e.target.value) }), _jsx(Input, { name: "nomeTrava", placeholder: "Nome da trava", value: nomeTravaFilter, onChange: (e) => setNomeTravaFilter(e.target.value) }), _jsxs(Button, { type: "submit", variant: "link", children: [_jsx(Search, { className: "w-4 h-4 mr-2" }), "Filtrar"] })] }) }) })] }), loading && _jsx("p", { children: "Carregando Acessos..." }), errorMessage && (_jsxs("div", { className: "text-center py-6", children: [_jsx("p", { className: "text-red-500 mb-4", children: errorMessage }), _jsx(Button, { variant: "outline", onClick: () => {
                            localStorage.clear(); // Limpa o armazenamento local
                            window.location.href = "/login"; // Redireciona para a página de login
                        }, className: "bg-gray-200 hover:bg-gray-300 text-black", children: "Tentar Login Novamente" })] })), !loading && !errorMessage && acessos.length > 0 && (_jsxs(Table, { className: "flex-1", children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-[100px]", children: "ID" }), _jsx(TableHead, { children: "Usu\u00E1rio" }), _jsx(TableHead, { children: "Imagem do Usu\u00E1rio" }), _jsx(TableHead, { children: "Nome da Trava" }), _jsx(TableHead, { children: "Data" }), _jsx(TableHead, { children: "Latitude" }), _jsx(TableHead, { children: "Longitude" }), _jsx(TableHead, { className: "text-right", children: "A\u00E7\u00F5es" })] }) }), _jsx(TableBody, { children: acessos.map((acesso) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: acesso._id }), _jsx(TableCell, { children: acesso.usuarioId?.nome || "Sem usuário" }), _jsx(TableCell, { children: acesso.usuarioId?.imgUsuario ? (_jsx("img", { src: `data:image/png;base64,${acesso.usuarioId.imgUsuario}`, alt: `Foto de ${acesso.usuarioId.nome}`, className: "w-16 h-16 object-cover rounded" })) : ("Sem imagem") }), _jsx(TableCell, { children: acesso.travaId?.nome || "Sem trava" }), _jsx(TableCell, { children: format(utcToZonedTime(new Date(acesso.data), "UTC"), "dd/MM/yyyy HH:mm") }), _jsx(TableCell, { children: acesso.lat || "Não informado" }), _jsx(TableCell, { children: acesso.long || "Não informado" }), _jsxs(TableCell, { className: "text-right flex gap-1 justify-end", children: [_jsx(Button, { className: "bg-green-600 hover:bg-green-700", children: _jsx(Link, { to: `/acessos/edit/${acesso._id}`, className: "text-white", children: "Visualizar" }) }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "destructive", onClick: () => {
                                                            setSelectedAcessoId(acesso._id);
                                                        }, children: "Excluir" }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmar Exclus\u00E3o" }), _jsxs(DialogDescription, { children: ["Tem certeza de que deseja excluir o acesso", " ", _jsx("strong", { children: acesso.usuarioId?.nome || acesso._id }), "? Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "destructive", onClick: () => {
                                                                        if (selectedAcessoId) {
                                                                            handleDelete(selectedAcessoId);
                                                                        }
                                                                        else {
                                                                            alert("ID do acesso não definido.");
                                                                        }
                                                                    }, disabled: loading, children: loading ? "Excluindo..." : "Excluir" }), _jsx(Button, { variant: "outline", as: DialogClose, disabled: loading, children: "Cancelar" })] })] })] })] })] }, acesso._id))) })] })), !loading && !errorMessage && acessos.length === 0 && (_jsx("p", { children: "Nenhum acesso encontrado." })), _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => hasPreviousPage && handlePageChange(page - 1), className: clsx("pagination-btn", {
                                    "opacity-50 cursor-not-allowed": !hasPreviousPage,
                                }) }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(p), className: clsx("pagination-link", { "font-bold": p === page }), children: p }) }, p))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => hasNextPage && handlePageChange(page + 1), className: clsx("pagination-btn", {
                                    "opacity-50 cursor-not-allowed": !hasNextPage,
                                }) }) })] }) })] }));
};
export default AcessosPage;
