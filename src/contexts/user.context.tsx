import api from "@/services/api";
import { User } from "@/types/user";

const api_url = import.meta.env.VITE_API_BASE_URL;
const api_token_authorization = import.meta.env.VITE_API_TOKEN_AUTHORIZATION;

import { createContext, FunctionComponent, useState, ReactNode } from "react";

interface UserContextType {
  isAuthenticated?: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const defaultValue: UserContextType = {
  currentUser: null,
  setCurrentUser: () => {},
  login: async () => {},
  logout: () => {},
};

const UserContext = createContext<UserContextType>(defaultValue);

interface Props {
  children: ReactNode;
}

const UserContextProvider: FunctionComponent<Props> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("authToken")
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", {
        email,
        senha: password,
      });

      const { usuario, access_token, refresh_token } = response.data;

      if (!usuario || !access_token || !refresh_token) {
        throw new Error(
          "Resposta inválida do servidor. Dados de autenticação incompletos."
        );
      }

      // Armazena tokens e dados do usuário
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("currentUser", JSON.stringify(usuario));

      // Atualiza estado global
      setCurrentUser(usuario);
      setAuthenticated(true);

      return usuario;
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error.response) {
        // Trata erros estruturados da API
        const apiError = error.response.data;
        errorMessage = apiError.message || errorMessage;

        if (error.response.status === 401) {
          logout();
          window.location.href = "/login";
          errorMessage = "Credenciais inválidas ou sessão expirada.";
        }
      }

      throw new Error(errorMessage);
    }
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
export default UserContextProvider;
