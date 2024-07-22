import { IdentityService } from '../../services/identity-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '../../services/catalog/course.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CourseWithCategoryViewModel } from '../../models/Catalog/Course/CourseWithCategoryModel';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  courses: CourseWithCategoryViewModel[];
  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'image',
    'feature',
    'category',
    'date',
  ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(
    private courseService: CourseService,
    private identityService: IdentityService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.getAllByUserId();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllByUserId() {
    var userId: string = this.identityService.getUserId();
    this.courseService.getAllByUserId(userId).subscribe({
      next: (value) => {
        this.dataSource.data = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
