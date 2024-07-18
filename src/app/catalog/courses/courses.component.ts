import { IdentityService } from './../../services/identity-service';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/catalog/course.service';
import { CourseWithCategoryViewModel } from '../../models/CourseWithCategoryModel';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  courses: CourseWithCategoryViewModel[];

  constructor(
    private courseService: CourseService,
    private identityService: IdentityService
  ) {}

  ngOnInit(): void {
    this.getAllByUserId();
  }

  getAllByUserId() {
    var userId:string =  this.identityService.getUserId();
    this.courseService.getAllByUserId(userId).subscribe({
      next:(value)=>{
        this.courses = value.data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
}
