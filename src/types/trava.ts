import { User } from "./user";

export interface Trava {
    _id: string;
    nome: string;
    deviceId: string;
    codigo?: string;
    qrCode?: string;
    status?: string;
    deviceStatus?: boolean;
    powerStatus?: string;
    nomeMercado?: string;
    usuarios?: User[];

  }
  