import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from './../../services/catalog/course.service';
import { Component, OnInit } from '@angular/core';
import { CourseGetByIdModel } from '../../models/Catalog/Course/CourseGetByIdModel';
import { CategoryModel } from '../../models/Catalog/Category/CategoryModel';
import { CategoryService } from '../../services/catalog/category.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {

  course: CourseGetByIdModel;
  category: CategoryModel;

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private router: ActivatedRoute) {
    router.paramMap.subscribe({
      next: params => {
        if (params != null) {
          this.getCourse(params.get("id").toString());
        }
      }
    })
  }

  ngOnInit(): void {
  }

  addToCart(id: string, name: string) {
    this.snackBar.open(`${name} has added to cart!`, 'Okey');
  }

  getCourse(id: string) {
    this.courseService.getById(id).subscribe({
      next: response => {
        if(response.isSuccessful){
          this.getCategoryById(response.data.categoryId);
          this.course = response.data;
        }
      }
    });
  }

  getCategoryById(id: string) {
    this.categoryService.getById(id).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.category = response.data;
        }
      }
    });
  }
}
