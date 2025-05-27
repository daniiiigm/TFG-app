import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl:'./sidebar.component.css',
  standalone: true,
  imports:[RouterModule]
})
export class AdminSidebarComponent {
  @Input() checkInDone: boolean = false;
  @Input() fichajeStatus: string = '';
  @Input() fichar!: () => void;
  @Input() logout!: () => void;
  
}

