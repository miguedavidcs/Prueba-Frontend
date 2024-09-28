import { Injectable } from '@angular/core';
import { Tare } from "../model/tarea.model";

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private tareas: any[] = [];

  constructor() {}

  // Método para obtener las tareas (simulando localStorage o base de datos)
  obtenerTareas(): any[] {
    // Aquí podrías obtener las tareas desde un localStorage o una API
    return this.tareas;
  }
  // Método para actualizar el estado de una tarea
  actualizarTarea(tarea: Tare): void {
    // Busca la tarea por ID y actualiza su estado
    const index = this.tareas.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
      this.tareas[index] = tarea; // Actualiza la tarea en el array
      // Aquí también puedes implementar la lógica para guardar en localStorage si es necesario
      localStorage.setItem('tareas', JSON.stringify(this.tareas)); // Guarda en localStorage
    }
  }

  // Método para guardar una nueva tarea
  guardarTarea(tarea: any) {
    // Agregamos la nueva tarea al array de tareas
    this.tareas.push(tarea);
  }
}
