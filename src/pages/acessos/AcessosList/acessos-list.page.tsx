// @ts-nocheck
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { useEffect, useState } from "react";
import { fetchAcessos } from "@/services/acessoService";

import { Acesso } from "@/types/acesso";

import { Link } from "react-router-dom";

const AcessosPage: React.FC = () => {
  const [acessos, setAcessos] = useState<Acesso[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [limit] = useState(10);

  // Filtros
  const [filters, setFilters] = useState({
    nomeUsuario: "",
    emailUsuario: "",
    telefoneUsuario: "",
    nomeTrava: "",
  });

  const [selectedAcessoId, setSelectedAcessoId] = useState<string | null>(null);

  const loadAcessos = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchAcessos(page, limit, filters);

      if (response && Array.isArray(response.data)) {
        setAcessos(response.data);
      } else if (response && response._id) {
        setAcessos([response]);
      } else {
        console.warn("Estrutura inesperada da resposta da API:", response);
        setAcessos([]);
      }

      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
        setHasPreviousPage(response.pagination.hasPreviousPage || false);
        setHasNextPage(response.pagination.hasNextPage || false);
      } else {
        setTotalPages(1);
        setHasPreviousPage(false);
        setHasNextPage(false);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao carregar acessos.");
      setAcessos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcessos();
  }, [page, limit, filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadAcessos();
  };

  const handleDelete = async (acessoId: string) => {
    setLoading(true);
    try {
      await deleteAcesso(acessoId);
      setAcessos((prevAcessos) =>
        prevAcessos.filter((acesso) => acesso._id !== acessoId)
      );
      setSelectedAcessoId(null);
      alert("Acesso excluído com sucesso");
    } catch (error: unknown) {
      console.error("Erro ao excluir o acesso:", error);
      let errorMessage = "Não foi possível excluir o acesso.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold inline-block">Acessos</h1>
        </div>

        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Lista de Acessos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="p-6 w-full space-y-4">
          <div className="flex items-center justify-between">
            <form
              onSubmit={handleFilterSubmit}
              className="flex items-center gap-2"
            >
              <Input
                name="nomeUsuario"
                placeholder="Nome do usuário"
                value={filters.nomeUsuario}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />

              <Input
                name="emailUsuario"
                placeholder="Email do usuário"
                value={filters.emailUsuarior}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Input
                name="telefoneUsuario"
                placeholder="Telefone do usuário"
                value={filters.telefoneUsuario}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Input
                name="nomeTrava"
                placeholder="Nome da trava"
                value={filters.nomeTrava}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <Button type="submit" variant="link">
                <Search className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </form>
          </div>
        </div>
      </header>
      {loading && <p>Carregando Acessos...</p>}
      {errorMessage && (
        <div className="text-center py-6">
          <p className="text-red-500 mb-4">{errorMessage}</p>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.clear(); // Limpa o armazenamento local
              window.location.href = "/login"; // Redireciona para a página de login
            }}
            className="bg-gray-200 hover:bg-gray-300 text-black"
          >
            Tentar Login Novamente
          </Button>
        </div>
      )}

      {!loading && !errorMessage && acessos.length > 0 && (
        <Table className="flex-1">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Imagem do Usuário</TableHead>
              <TableHead>Nome da Trava</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acessos.map((acesso) => (
              <TableRow key={acesso._id}>
                <TableCell className="font-medium">{acesso._id}</TableCell>
                <TableCell>{acesso.usuarioId?.nome || "Sem usuário"}</TableCell>
                <TableCell>
                  {acesso.usuarioId?.imgUsuario ? (
                    <img
                      src={`data:image/png;base64,${acesso.usuarioId.imgUsuario}`}
                      alt={`Foto de ${acesso.usuarioId.nome}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "Sem imagem"
                  )}
                </TableCell>
                <TableCell>{acesso.travaId?.nome || "Sem trava"}</TableCell>
                <TableCell>
                  {format(
                    toZonedTime(new Date(acesso.data), "UTC"), // Convertendo para UTC
                    "dd/MM/yyyy HH:mm"
                  )}
                </TableCell>

                <TableCell>{acesso.lat || "Não informado"}</TableCell>
                <TableCell>{acesso.long || "Não informado"}</TableCell>
                <TableCell className="text-right flex gap-1 justify-end">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Link
                      to={`/acessos/edit/${acesso._id}`}
                      className="text-white"
                    >
                      Visualizar
                    </Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedAcessoId(acesso._id);
                        }}
                      >
                        Excluir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                          Tem certeza de que deseja excluir o acesso{" "}
                          <strong>
                            {acesso.usuarioId?.nome || acesso._id}
                          </strong>
                          ? Esta ação não pode ser desfeita.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (selectedAcessoId) {
                              handleDelete(selectedAcessoId);
                            } else {
                              alert("ID do acesso não definido.");
                            }
                          }}
                          disabled={loading}
                        >
                          {loading ? "Excluindo..." : "Excluir"}
                        </Button>
                        <Button
                          variant="outline"
                          as={DialogClose}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {!loading && !errorMessage && acessos.length === 0 && (
        <p>Nenhum acesso encontrado.</p>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPreviousPage && handlePageChange(page - 1)}
              className={clsx("pagination-btn", {
                "opacity-50 cursor-not-allowed": !hasPreviousPage,
              })}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => handlePageChange(p)}
                className={clsx("pagination-link", { "font-bold": p === page })}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && handlePageChange(page + 1)}
              className={clsx("pagination-btn", {
                "opacity-50 cursor-not-allowed": !hasNextPage,
              })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default AcessosPage;
