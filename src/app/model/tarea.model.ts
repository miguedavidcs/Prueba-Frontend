import { Usuario } from "./usuario.model";
export interface Tare{
  id:number;
  nombre:string;
  estado: 'pendiente' | 'realizado'; // pendiente y realizado
  fecha_limite:string;
  usuario:Usuario[]
}
