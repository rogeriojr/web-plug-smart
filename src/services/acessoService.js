// @ts-nocheck
const api_url = import.meta.env.VITE_API_BASE_URL;
export const fetchAcessos = async (page = 1, limit = 10) => {
    const token = localStorage.getItem("authToken");
    if (!token)
        throw new Error("Token de autenticação não encontrado.");
    const url = new URL(`${api_url}/acessos`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    const response = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    // if (response.status === 401) {
    //   // Limpar o localStorage e redirecionar para login em caso de 401
    //   localStorage.clear();
    //   window.location.href = "/login";
    //   throw new Error("Sessão expirada. Faça login novamente.");
    // }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Erro ao obter acessos.");
    }
    const result = await response.json();
    return result;
};
