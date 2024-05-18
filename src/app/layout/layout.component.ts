import { Component } from '@angular/core';
import { SideNavigationComponent } from "../components/side-navigation/side-navigation.component";
import { NavbarComponentComponent } from "../components/navbar-component/navbar-component.component";
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    imports: [SideNavigationComponent, NavbarComponentComponent, RouterOutlet, DashboardComponent]
})
export class LayoutComponent {

}
