import { PageEvent } from '@angular/material/paginator';
import { CourseViewModel } from '../../models/Catalog/Course/CourseViewModel';
import { CourseService } from './../../services/catalog/course.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  courseModel: CourseViewModel[];
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.getAllCourses();
    this.length = 12;
    this.pageSize = 6;
  }

  getAllCourses() {
    this.courseService.getAllWithCategory().subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.courseModel = response.data;
        } else {
          console.error(response.errors);
        }
      }, error(err) {
        console.error(err.error);
      },
    });
  }


}
