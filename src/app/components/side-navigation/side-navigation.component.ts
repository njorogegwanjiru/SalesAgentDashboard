import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-navigation',
  standalone: true,
  templateUrl: './side-navigation.component.html',
  imports: [CommonModule,RouterModule],
  styleUrl: './side-navigation.component.css'
})
export class SideNavigationComponent {

  activeSubmenus: { [key: string]: boolean } = {};

  toggleSubmenu(menu: string): void {
    this.activeSubmenus[menu] = !this.activeSubmenus[menu];
  }

  isSubmenuOpen(menu: string): boolean {
    return this.activeSubmenus[menu];
  }
}
