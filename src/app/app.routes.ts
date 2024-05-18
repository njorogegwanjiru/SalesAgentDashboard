import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SchoolsListComponent } from './school-management/schools/schools-list/schools-list.component';
import { InvoicesComponent } from './school-management/invoices/invoices.component';
import { CollectionsComponent } from './school-management/collections/collections.component';

import { SchoolDetailsComponent } from './school-management/schools/school-details/school-details.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect to dashboard by default
      { path: 'dashboard', component: DashboardComponent },
      
      { path: 'schools', component: SchoolsListComponent },
      { path: 'schoolDetails/:id', component: SchoolDetailsComponent },

      { path: 'invoices', component: InvoicesComponent },
      { path: 'invoices/:schoolId', component: InvoicesComponent },

      { path: 'collections', component: CollectionsComponent },
      { path: 'collections/:schoolId', component: CollectionsComponent },

    ]
  },
  { path: 'side', component: SideNavigationComponent },
  { path: '**', redirectTo: '' } // Redirect invalid routes to the default route
];
