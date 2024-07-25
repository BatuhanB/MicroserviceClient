import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from './../../services/catalog/course.service';
import { Component, OnInit } from '@angular/core';
import { CourseGetByIdModel } from '../../models/Catalog/Course/CourseGetByIdModel';
import { CategoryModel } from '../../models/Catalog/Category/CategoryModel';
import { CategoryService } from '../../services/catalog/category.service';
import { BasketService } from '../../services/basket.service';
import { BasketItemModel, BasketModel } from '../../models/Basket/basketmodel';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  spinnerVal: boolean = false;
  course: CourseGetByIdModel = new CourseGetByIdModel();
  category: CategoryModel = new CategoryModel();
  basket:BasketModel;

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private router: ActivatedRoute,
    private basketService: BasketService,
    private cartService:CartService) {
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

  addToCart(course:CourseGetByIdModel) {
    var basketItem = this.mapToBasketItem(course);
    this.cartService.addToCart(basketItem);
    
    this.snackBar.open(`${course.name} has added to cart!`, 'Okey', {
      duration: 2000
    });
  }

  removeFromCart(courseId:string){
    this.cartService.removeFromCart(courseId);
  }

  mapToBasketItem(course:CourseGetByIdModel):BasketItemModel{
    let basketItem:BasketItemModel;
    basketItem.courseId = course.id;
    basketItem.courseName = course.name;
    basketItem.price = course.price;
    basketItem.quantity = 1;
    return basketItem;
  }

  getCourse(id: string) {
    this.courseService.getById(id).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.getCategoryById(response.data.categoryId);
          this.course = response.data;
          this.spinnerVal = true;
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
