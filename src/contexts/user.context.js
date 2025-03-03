import { jsx as _jsx } from "react/jsx-runtime";
const api_url = import.meta.env.VITE_API_BASE_URL;
const api_token_authorization = import.meta.env.VITE_API_TOKEN_AUTHORIZATION;
import { createContext, useState } from "react";
const defaultValue = {
    currentUser: null,
    setCurrentUser: () => { },
    login: async () => { },
    logout: () => { },
};
const UserContext = createContext(defaultValue);
const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("currentUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const login = async (email, senha) => {
        try {
            const response = await fetch(`${api_url}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${api_token_authorization}`, // Adicionar token de autorização
                },
                body: JSON.stringify({ email, senha }),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    // Limpar localStorage e redirecionar para login em caso de erro 401
                    logout();
                    window.location.href = "/login";
                    throw new Error("Sessão expirada. Faça login novamente.");
                }
                const errorData = await response.json();
                const errorMessage = errorData?.message ||
                    "Erro ao fazer login. Verifique suas credenciais.";
                throw new Error(errorMessage);
            }
            const result = await response.json();
            const { usuario, access_token } = result;
            if (!usuario || !access_token) {
                throw new Error("Resposta inesperada do servidor. Falta o token de acesso ou informações do usuário.");
            }
            localStorage.setItem("authToken", access_token);
            setCurrentUser(usuario);
            localStorage.setItem("currentUser", JSON.stringify(usuario));
        }
        catch (error) {
            throw error;
        }
    };
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
    };
    return (_jsx(UserContext.Provider, { value: {
            currentUser,
            setCurrentUser,
            login,
            logout,
        }, children: children }));
};
export { UserContext, UserContextProvider };
export default UserContextProvider;
