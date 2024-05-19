import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SchoolService } from '../school.service';
import { NavbarComponentComponent } from "../../../components/navbar-component/navbar-component.component";
import { School } from '../../../shared/models/school.model';

@Component({
  selector: 'app-school-details',
  standalone: true,
  templateUrl: './school-details.component.html',
  styleUrl: './school-details.component.css',
  imports: [NavbarComponentComponent, CommonModule]
})

export class SchoolDetailsComponent implements OnInit {
  schoolId!: number;
  schoolDetails!: School | undefined;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.schoolId = +id; // Convert string to number
      this.fetchSchoolDetails();
    } else {
      console.error('School ID is undefined.');
      this.isLoading = false;
    }
  }

  fetchSchoolDetails(): void {
    this.schoolService.getSchoolDetails(this.schoolId).subscribe(
      school => {
        this.schoolDetails = school;
        this.isLoading = false;
        if (this.schoolDetails) {
          console.log('School details:', this.schoolDetails);
        } else {
          console.error('School not found.');
        }
      },
      error => {
        console.error('Error fetching school details:', error);
        this.isLoading = false;
      }
    );
  }


  viewInvoices(schoolId: number): void {
    this.router.navigate(['/invoices', schoolId]);
  }

  viewCollections(schoolId: number): void {
    this.router.navigate(['/collections', schoolId]);
  }
}
