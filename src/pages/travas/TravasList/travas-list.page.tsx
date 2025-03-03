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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchTravas,
  downloadQrCode,
  deleteTrava,
} from "@/services/travaService";
import { Link, useNavigate } from "react-router-dom";
import { Trava } from "@/types/trava";

const TravasPage: React.FC = () => {
  const [travas, setTravas] = useState<Trava[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [limit] = useState(10);
  const [idFilter, setIdFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [selectedTravaId, setSelectedTravaId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    nomeMercado: "",
    deviceId: "",
    status: "",
  });

  const navigate = useNavigate();

  const loadTravas = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetchTravas(page, limit, filters);
      if (response && Array.isArray(response.data)) {
        setTravas(response.data);
      } else {
        setTravas([]);
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
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setErrorMessage(error.message || "Erro ao carregar travas.");
      }
      setTravas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravas();
  }, [page, limit, idFilter, emailFilter, filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTravas();
  };

  const handleDelete = async (travaId: string) => {
    setLoading(true);
    try {
      await deleteTrava(travaId);
      setTravas((prev) => prev.filter((t) => t._id !== travaId));
      setSelectedTravaId(null);
      alert("Trava excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert(error instanceof Error ? error.message : "Erro ao excluir");
      let errorMessage = "Não foi possível excluir a trava.";
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
          <h1 className="text-xl font-semibold inline-block">Travas</h1>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Travas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Lista de travas</BreadcrumbPage>
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
                name="nomeMercado"
                placeholder="Nome do Mercado"
                value={filters.nomeMercado}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    nomeMercado: e.target.value,
                  }))
                }
              />
              <Input
                name="deviceId"
                placeholder="ID do Dispositivo"
                value={filters.deviceId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, deviceId: e.target.value }))
                }
              />
              <Button type="submit" variant="link">
                <Search className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </form>
            <Button asChild>
              <Link to="/travas/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Nova trava
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {loading && <p>Carregando travas...</p>}

      {errorMessage && (
        <div className="text-center py-6">
          <p className="text-red-500 mb-4">{errorMessage}</p>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-gray-200 hover:bg-gray-300 text-black"
          >
            Tentar Login Novamente
          </Button>
        </div>
      )}

      {!loading && !errorMessage && travas.length > 0 && (
        <Table className="flex-1">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Id do Disp.</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>QRCode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Power Status</TableHead>
              <TableHead>Personalizada</TableHead>
              <TableHead>Maiores 18</TableHead>
              <TableHead>Nome do Mercado</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead>Tempo Desligamento (s)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travas.map((trava) => (
              <TableRow key={trava?._id}>
                <TableCell className="font-medium">{trava._id}</TableCell>
                <TableCell>{trava?.nome}</TableCell>
                <TableCell>{trava?.deviceId}</TableCell>
                <TableCell>{trava?.codigo}</TableCell>
                <TableCell>
                  <Button onClick={() => downloadQrCode(trava.codigo)}>
                    Baixar
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      trava.status === "ativa"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    }
                  >
                    {trava.status === "ativa" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>{trava.powerStatus}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      trava.isPersonalizada ? "bg-purple-500" : "bg-gray-200"
                    }
                  >
                    {trava.isPersonalizada ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={trava.maioresDe18 ? "bg-red-500" : "bg-gray-200"}
                  >
                    {trava.maioresDe18 ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell>{trava.powerStatus}</TableCell>
                <TableCell>{trava.nomeMercado}</TableCell>
                <TableCell>{trava.usuarios.length}</TableCell>
                <TableCell>
                  {trava.tempoDesligamento
                    ? (trava.tempoDesligamento / 1000).toFixed(0) + "s"
                    : "30s"}
                </TableCell>
                <TableCell className="text-right flex gap-1 justify-end">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link to={`/travas/edit/${trava._id}`}>Editar</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => setSelectedTravaId(trava._id)}
                      >
                        Excluir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                          Tem certeza de que deseja excluir a trava{" "}
                          <strong>{trava.nome}</strong>?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            selectedTravaId && handleDelete(selectedTravaId)
                          }
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

      {!loading && !errorMessage && travas.length === 0 && (
        <p>Nenhuma trava encontrada.</p>
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

export default TravasPage;
