import { PageRequest } from './../../models/pagerequest';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CourseViewModel } from '../../models/Catalog/Course/CourseViewModel';
import { CourseService } from './../../services/catalog/course.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  courseModel: CourseViewModel[];

  handlePageEvent(e: PageEvent) {
    this.getAllCourses();
  }
  
  constructor(private courseService: CourseService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllCourses();
  }
  getAllCourses() {
    var pageRequest = new PageRequest();
    let pageNumber = this.paginator ? this.paginator.pageIndex : 0;
    let pageSize = this.paginator ? this.paginator.pageSize : 6;
    pageRequest.pageNumber = pageNumber;
    pageRequest.pageSize = pageSize;

    this.courseService.getAllWithCategory(pageRequest).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.paginator.length = response.data.totalCount;
          this.courseModel = response.data.items;
          this.cdr.detectChanges();
        } else {
          console.error(response.errors);
        }
      }, error(err) {
        console.error(err.error);
      },
    });
  }


}
