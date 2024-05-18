import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


 import { SchoolService } from '../school.service';
import { NavbarComponentComponent } from "../../../components/navbar-component/navbar-component.component";
import { School } from '../../../shared/models/school.model';

@Component({
  selector: 'app-schools-list',
  standalone: true,
  templateUrl: './schools-list.component.html',
  styleUrl: './schools-list.component.css',
  imports: [CommonModule, NavbarComponentComponent, NgbPaginationModule, FormsModule]
})
export class SchoolsListComponent implements OnInit {
  schools!: School[];
  filteredSchools: any[] = [];

  searchText: string = '';
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private schoolService: SchoolService,
     private config: NgbPaginationConfig,private router: Router) {
    config.pageSize = this.itemsPerPage;

  }

  ngOnInit(): void {
    this.schools = this.schoolService.getSchools();
    this.filterSchools();

  }
  viewSchoolDetails(schoolId: string) {
    // Navigate to the SchoolDetailsComponent with the schoolId as a route parameter
    this.router.navigate(['/schoolDetails', schoolId]);
  }

  applyFilter() {
    this.currentPage = 1;
    this.filterSchools();
  }

  filterSchools() {
    this.filteredSchools = this.schools.filter(school =>
      school.name.toLowerCase().includes(this.searchText.toLowerCase())
     );
    this.totalItems = this.filteredSchools.length;
  }
  onPageChange(page: number) {
    this.currentPage = page;
  }
}
