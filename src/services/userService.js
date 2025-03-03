const api_url = import.meta.env.VITE_API_BASE_URL;
export const fetchUsers = async (page = 1, limit = 10, id, email) => {
    const token = localStorage.getItem("authToken");
    if (!token)
        throw new Error("Token de autenticação não encontrado.");
    let url;
    if (id) {
        url = new URL(`${api_url}/usuarios/${id}`);
    }
    else if (email) {
        url = new URL(`${api_url}/usuarios/email/${email}`);
    }
    else {
        url = new URL(`${api_url}/usuarios`);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
    }
    const response = await fetch(url.toString(), {
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
        const errorData = await response.json();
        localStorage.clear();
        throw new Error(errorData?.message || "Erro ao obter usuários.");
    }
    const result = await response.json();
    return result;
};
export const deleteUser = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token)
        throw new Error("Token de autenticação não encontrado.");
    const url = new URL(`${api_url}/usuarios/${id}`);
    const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Sessão expirada. Faça login novamente.");
    }
    if (!response.ok) {
        let errorMessage = "Erro ao excluir usuário.";
        try {
            // Tenta analisar como JSON
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
        }
        catch (e) {
            // Se falhar, tenta obter o texto da resposta
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
    }
};
