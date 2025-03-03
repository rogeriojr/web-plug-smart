import { User } from "@/types/user";

const api_url = import.meta.env.VITE_API_BASE_URL;

export interface UsersResponse {
  data: User[];
  pagination: {
    currentPage: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface FilterParams {
  id?: string;
  email?: string;
  nome?: string;
  telefone?: string;
  cpf?: string;
  status?: string;
  desabilitado?: string;
}

export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  filters?: FilterParams
): Promise<UsersResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const url = new URL(`${api_url}/usuarios`);

  if (filters?.id) {
    url.pathname += `/${filters.id}`;
  } else {
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          url.searchParams.append(key, value);
        }
      });
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Erro ao obter usuários.");
  }

  return await response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const response = await fetch(`${api_url}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Erro ao excluir usuário.");
  }
};
