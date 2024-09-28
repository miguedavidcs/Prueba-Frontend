import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaService } from '../services/tarea.service';
import { Usuario } from "../model/usuario.model";
import { Tare } from "../model/tarea.model";

@Component({
  selector: 'app-tarea',
  standalone: true,
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css'],
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  providers: [TareaService]
})
export class TareaComponent {
  formularioTarea: FormGroup;  // Formulario principal
  tareas: any[] = [];
  tareasFiltradas: any[] = [];
  tareasPaginas: any[] = [];   // Tareas por página para paginación
  tareasPorPagina = 2;         // Número de tareas por página
  paginaActual = 0;
  busqueda: string = '';

  constructor(private fb: FormBuilder, private tareaService: TareaService) {
    this.formularioTarea = this.fb.group({
      nombre: ['', Validators.required],           // Nombre de la tarea
      fecha_limite: ['', Validators.required],     // Fecha límite de la tarea
      estado: ['pendiente', Validators.required],
      usuarios: this.fb.array([this.crearUsuario()], Validators.required) // Al menos un usuario
    });

    this.cargarTareas(); // Carga inicial de tareas
  }

  // Método para crear un nuevo usuario con una habilidad por defecto
  crearUsuario(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      habilidades: this.fb.array([this.fb.control('', Validators.required)], Validators.minLength(1)) // Al menos una habilidad
    });
  }
  buscarTareas(): void {
    const filtroLower = this.busqueda.toLowerCase();
    this.tareasFiltradas = this.tareas.filter((tarea: Tare) =>
      tarea.nombre.toLowerCase().includes(filtroLower) ||
      tarea.estado.toLowerCase().includes(filtroLower) ||
      tarea.fecha_limite.toLowerCase().includes(filtroLower) ||
      tarea.usuario.some((usuario: Usuario) =>
        usuario.nombre.toLowerCase().includes(filtroLower)
      )
    );
    this.paginaActual = 0; // Reinicia a la primera página al aplicar filtro
    this.actualizarPaginacion();
  }

// Método para cambiar el estado de la tarea
toggleEstado(tarea: Tare): void {
  // Cambiar el estado de la tarea
  tarea.estado = tarea.estado === 'pendiente' ? 'realizado' : 'pendiente';

  // Actualizar el estado de la tarea en localStorage
  this.tareaService.actualizarTarea(tarea);
  console.log('Estado actualizado exitosamente:', tarea.estado);
}
  // Método para agregar un usuario al formulario
  agregarUsuario() {
    const usuario = this.crearUsuario(); // Usuario con una habilidad por defecto
    this.usuarios.push(usuario);
  }

  // Método para agregar una habilidad a un usuario específico
  agregarHabilidad(usuarioIndex: number) {
    const habilidad = this.fb.control('', Validators.required); // Nueva habilidad
    this.habilidades(usuarioIndex).push(habilidad);
  }

  // Getter para obtener el array de usuarios del formulario
  get usuarios() {
    return this.formularioTarea.get('usuarios') as FormArray;
  }

  // Método para eliminar una habilidad específica de un usuario
  eliminarHabilidad(usuarioIndex: number, habilidadIndex: number) {
    this.habilidades(usuarioIndex).removeAt(habilidadIndex);
  }

  // Método para eliminar un usuario completo del formulario
  eliminarUsuario(usuarioIndex: number) {
    this.usuarios.removeAt(usuarioIndex);
  }

  // Getter para obtener el array de habilidades de un usuario específico
  habilidades(usuarioIndex: number) {
    return this.usuarios.at(usuarioIndex).get('habilidades') as FormArray;
  }

  // Método para cargar las tareas del servicio (ej. localStorage o API)
  cargarTareas() {
    this.tareas = this.tareaService.obtenerTareas();
    console.log(this.tareas);
    this.actualizarPaginacion();
  }

  // Método para cambiar cuántas tareas se muestran por página
  cambiarTareasPorPagina(event: any) {
    this.tareasPorPagina = event.target.value;
    this.actualizarPaginacion();
  }

  // Método para actualizar las tareas que se muestran en la página actual
  actualizarPaginacion() {
    const inicio = this.paginaActual * this.tareasPorPagina;
    const fin = inicio + this.tareasPorPagina;
    this.tareasPaginas = this.tareas.slice(inicio, fin);
  }

  // Método para obtener el total de páginas
  totalPaginas() {
    return Math.ceil(this.tareas.length / this.tareasPorPagina);
  }

  // Método para ir a la página anterior
  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  // Método para ir a la página siguiente
  siguientePagina() {
    if (this.paginaActual < this.totalPaginas() - 1) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  // Método para enviar el formulario de tarea
  enviarFormulario() {
    if (this.formularioTarea.valid) {
      const nuevaTarea = this.formularioTarea.value;
      this.tareaService.guardarTarea(nuevaTarea);
      this.cargarTareas();

      // Reseteamos el formulario y volvemos a agregar un usuario y una habilidad por defecto
      this.formularioTarea.reset();
      this.usuarios.clear();
      this.usuarios.push(this.crearUsuario());
    }
  }
}
