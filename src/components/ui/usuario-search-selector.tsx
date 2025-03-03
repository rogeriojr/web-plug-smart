import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Check } from "lucide-react";
import api from "@/services/api";

interface User {
  _id: string;
  nome: string;
  email: string;
}

interface UsuarioSearchSelectorProps {
  selectedUsers: string[];
  onUsersSelected: (users: string[]) => void;
}

export const UsuarioSearchSelector = ({
  selectedUsers,
  onUsersSelected,
}: UsuarioSearchSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsersDetails, setSelectedUsersDetails] = useState<User[]>([]);

  // Carrega detalhes iniciais dos usuários selecionados
  useEffect(() => {
    const fetchInitialUsers = async () => {
      if (selectedUsers.length === 0) return;

      try {
        const existingIds = selectedUsersDetails.map((u) => u._id);
        const missingIds = selectedUsers.filter(
          (id) => !existingIds.includes(id)
        );

        if (missingIds.length > 0) {
          const response = await api.get(
            `/usuarios?ids=${missingIds.join(",")}`
          );
          setSelectedUsersDetails((prev) => [...prev, ...response.data.data]);
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchInitialUsers();
  }, [selectedUsers]); // Executa sempre que selectedUsers muda

  // Busca usuários na API
  const handleSearch = async (term: string) => {
    if (term.length > 2) {
      setIsSearching(true);
      try {
        const response = await api.get(`/usuarios?nome=${term}`);
        setSearchResults(response.data.data);
      } catch (error) {
        console.error("Erro na busca:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Adiciona/remove usuário da seleção
  const toggleUser = (userId: string) => {
    const newUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];
    onUsersSelected(newUsers);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Pesquisar usuários..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <Search className="absolute right-2 top-2 h-5 w-5 text-muted-foreground" />
      </div>

      {/* Usuários selecionados - Agora usando IDs iniciais */}
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map((userId) => {
          const user = selectedUsersDetails.find((u) => u._id === userId);
          return (
            <Badge key={userId} className="px-2 py-1">
              {user ? user.nome : "Carregando..."}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => toggleUser(userId)}
              />
            </Badge>
          );
        })}
      </div>

      {/* Resultados da busca */}
      {isSearching && <div className="text-center py-2">Buscando...</div>}

      {!isSearching && searchResults.length > 0 && (
        <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleUser(user._id)}
            >
              <div>
                <p className="font-medium">{user.nome}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {selectedUsers.includes(user._id) && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
