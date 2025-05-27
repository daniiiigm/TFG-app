import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-sidebar',
  templateUrl: './employee-sidebar.component.html',
  styleUrl:'./sidebar.component.css',
  standalone: true,
  imports:[RouterModule]
})
export class EmployeeSidebarComponent {
  @Input() checkInDone: boolean = false;
  @Input() fichajeStatus: string = '';
  @Input() fichar!: () => void;
  @Input() logout!: () => void;
}