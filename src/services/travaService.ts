import { saveAs } from "file-saver";
import QRCode from "qrcode";
import { Trava } from "@/types/trava";

const api_url = import.meta.env.VITE_API_BASE_URL;

export interface TravasResponse extends Trava {
  data: Trava[];
  pagination: {
    currentPage: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const fetchTravas = async (
  page: number = 1,
  limit: number = 10,
  filters?: { nomeMercado?: string; deviceId?: string; status?: string }
): Promise<TravasResponse> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const url = new URL(`${api_url}/travas`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
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
    throw new Error(errorData?.message || "Erro ao obter travas.");
  }

  return await response.json();
};

export const downloadQrCode = async (codigoTrava: string) => {
  try {
    const link = `${api_url}/acesso_com_auto_ligamento/${codigoTrava}`;

    const qrCodeDataUrl = await QRCode.toDataURL(link);

    const response = await fetch(qrCodeDataUrl);
    const blob = await response.blob();

    saveAs(blob, `qrcode_${codigoTrava}.png`);
  } catch (error) {
    console.error("Erro ao gerar ou baixar o QR Code:", error);
    alert("Falha ao gerar o QR Code. Tente novamente.");
  }
};

export const deleteTrava = async (id: string): Promise<void> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token de autenticação não encontrado.");

  const url = new URL(`${api_url}/travas/${id}`);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // if (response.status === 401) {
  //   localStorage.clear();
  //   window.location.href = "/login";
  //   throw new Error("Sessão expirada. Faça login novamente.");
  // }

  if (!response.ok) {
    let errorMessage = "Erro ao excluir trava.";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch (e) {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
};
