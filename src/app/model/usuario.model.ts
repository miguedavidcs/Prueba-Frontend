import { Habilidades } from "./habilidades.model";
export interface Usuario {
  id:number;
  nombre: string;
  edad: number;
  habilidades: Habilidades[];
}
