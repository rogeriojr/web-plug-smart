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
import { fetchUsers, deleteUser } from "@/services/userService";

import { User } from "@/types/user";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [limit] = useState(20);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    status: "",
    desabilitado: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchUsers(page, limit, filters);

      if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response && response._id) {
        setUsers([response]);
      } else {
        console.warn("Estrutura inesperada da resposta da API:", response);
        setUsers([]);
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
      setErrorMessage(error.message || "Erro ao carregar usuários.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, limit, filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setSelectedUserId(null);
      alert("Usuário excluído com sucesso");
    } catch (error: unknown) {
      console.error("Erro ao excluir o usuário:", error);
      let errorMessage = "Não foi possível excluir o usuário.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <header className="flex flex-col h-auto shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-auto">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold inline-block">Usuários</h1>
        </div>

        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Usuários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Lista de usuários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="p-6 w-full space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <form
              onSubmit={handleFilterSubmit}
              className="flex flex-wrap items-center gap-2 w-full md:w-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
                <Input
                  name="nome"
                  placeholder="Nome"
                  value={filters?.nome}
                  onChange={handleFilterChange}
                />
                <Input
                  name="telefone"
                  placeholder="Telefone"
                  value={filters?.telefone}
                  onChange={handleFilterChange}
                />
                <Input
                  name="email"
                  placeholder="Email"
                  value={filters?.email}
                  onChange={handleFilterChange}
                />
                <Input
                  name="cpf"
                  placeholder="CPF"
                  value={filters?.cpf}
                  onChange={handleFilterChange}
                />
                <select
                  name="status"
                  value={filters?.status}
                  onChange={handleFilterChange}
                  className="p-2 border rounded"
                >
                  <option value="">Todos status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <select
                  name="desabilitado"
                  value={filters.desabilitado}
                  onChange={handleFilterChange}
                  className="p-2 border rounded"
                >
                  <option value="">Todos estados</option>
                  <option value="habilitado">Habilitado</option>
                  <option value="desabilitado">Desabilitado</option>
                </select>
              </div>
            </form>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="link"
                className="flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Link
                to="/users/create"
                className="flex items-center p-2 text-white"
              >
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Novo usuário
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {loading && <p>Carregando usuários...</p>}
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

      {!loading && !errorMessage && users.length > 0 && (
        <Table className="flex-1">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usuário Desabilitado</TableHead> {/* Nova coluna */}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user?._id}>
                <TableCell className="font-medium">{user?._id}</TableCell>
                <TableCell>{user?.tipo}</TableCell>
                <TableCell>{user?.nome}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.telefone}</TableCell>
                <TableCell>{user?.cpf}</TableCell>
                <TableCell>
                  {format(
                    toZonedTime(new Date(user.dataDeNascimento), "UTC"), // Convertendo para UTC
                    "dd/MM/yyyy"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "ativo"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={clsx({
                      "bg-red-500 hover:bg-red-600": user.desabilitarUsuario, // Vermelho se desabilitado
                      "bg-green-500 hover:bg-green-600":
                        !user.desabilitarUsuario, // Verde se habilitado
                    })}
                  >
                    {user.desabilitarUsuario ? "Desabilitado" : "Habilitado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex gap-1 justify-end">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Link to={`/users/edit/${user._id}`}>Editar</Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedUserId(user._id);
                        }}
                      >
                        Excluir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                          Tem certeza de que deseja excluir o usuário{" "}
                          <strong>{user?.nome}</strong>? Esta ação não pode ser
                          desfeita.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (selectedUserId) {
                              handleDelete(selectedUserId);
                            } else {
                              alert("ID do usuário não definido.");
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
      {!loading && !errorMessage && users.length === 0 && (
        <p>Nenhum usuário encontrado.</p>
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

export default UsersPage;
