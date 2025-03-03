// @ts-nocheck
import { Acesso } from "@/types/acesso";

const api_url = import.meta.env.VITE_API_BASE_URL;

export interface AcessosResponse {
  data: Acesso[];
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
  usuarioNome?: string;
  usuarioEmail?: string;
  usuarioTelefone?: string;
  travaNome?: string;
  travaMercado?: string;
  data?: string;
  latitude?: string;
  longitude?: string;
}

export const fetchAcessos = async (
  page: number = 1,
  limit: number = 10,
  filters?: FilterParams
): Promise<AcessosResponse> => {
  const token = localStorage.getItem("authToken");

  if (!token) throw new Error("Token de autenticação não encontrado.");

  const url = new URL(`${api_url}/acessos`);

  // Parâmetros de paginação
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());

  // Parâmetros de filtro
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Erro ao obter acessos.");
  }

  return await response.json();
};

export const deleteAcesso = async (id: string): Promise<void> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const response = await fetch(`${api_url}/acessos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Erro ao excluir o acesso.");
  }
};

// Restante das funções permanecem igual...