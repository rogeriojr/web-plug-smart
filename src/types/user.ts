export interface User {
  _id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  urlFoto?: string | null;
  tipo?: string;
  status?: string;
  dataDeNascimento?: string;
  desabilitarUsuario?: boolean;
}
