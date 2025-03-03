export interface Usuario {
  _id: string;
  nome: string;
  email?: string;
  // Outras propriedades conforme necessário
}

export interface Trava {
  _id: string;
  nome: string;
  deviceId: string;
  codigo: string;
  qrCode?: string;
  status?: string;
  deviceStatus?: string;
  powerStatus?: string;
  // Outras propriedades conforme necessário
}

export interface Acesso {
  _id: string;
  usuarioId: Usuario | null;
  travaId: Trava | null;
  data: string;
  lat?: string;
  long?: string;
}
