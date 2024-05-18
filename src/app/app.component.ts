import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolsListComponent } from './school-management/schools/schools-list/schools-list.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
import { ModalContentComponent } from './modal-content/modal-content.component';


import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,

    CommonModule,
    NgbPaginationModule,
    ModalContentComponent,

    DashboardComponent,
    SchoolsListComponent,
    SideNavigationComponent,
    NavbarComponentComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'sales-agent-dashboard';
}
