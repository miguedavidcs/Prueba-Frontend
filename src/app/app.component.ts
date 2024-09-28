import { Component } from '@angular/core';
import { TareaComponent } from './tarea/tarea.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TareaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'apiprueba';
}
