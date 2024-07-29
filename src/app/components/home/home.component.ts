import { IdentityService } from './../../services/identity-service';
import { BasketModel } from './../../models/Basket/basketmodel';
import { PageRequest } from './../../models/pagerequest';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Category, CourseViewModel, Feature } from '../../models/Catalog/Course/CourseViewModel';
import { CourseService } from './../../services/catalog/course.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BasketItemModel } from '../../models/Basket/basketmodel';
import { BasketService } from '../../services/basket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BasketDialog } from '../../dialogs/basket/basket-dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  courseModel: CourseViewModelForHome[] = [];
  spinnerVal:boolean = false;
  authState:boolean = false;

  handlePageEvent(e: PageEvent) {
    this.getAllCourses();
  }
  
  constructor(
    private courseService: CourseService,
    private basketService:BasketService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    private identity:IdentityService
  ) { }

  ngOnInit(): void {
    this.checkAuthState();
    this.getAllCourses();
  }

  private checkAuthState() {
    this.identity.getAuthStatus().subscribe(resp => this.authState = resp);
  }

  addToCart(course:CourseViewModel) {
    var basketItem = this.mapToBasketItem(course);
    this.basketService.addToBasket(basketItem).subscribe({
      next:response=>{
        if(response.data){
          this.getAllCourses();
          this.snackBar.open(`${course.name} has added to cart!`, 'Okay', {
            duration: 4000
          });
        }else{
          console.log("Error");
        }
      }
    });
  }
  
  mapToBasketItem(course:CourseViewModel):BasketItemModel{
    let basketItem:BasketItemModel = new BasketItemModel();
    basketItem.courseId = course.id;
    basketItem.courseName = course.name;
    basketItem.price = course.price;
    basketItem.priceWithDiscount = 0;
    basketItem.quantity = 1;
    return basketItem;
  }
  
  getAllCourses() {
    var pageRequest = new PageRequest();
    let pageNumber = this.paginator ? this.paginator.pageIndex : 0;
    let pageSize = this.paginator ? this.paginator.pageSize : 6;
    pageRequest.pageNumber = pageNumber;
    pageRequest.pageSize = pageSize;
    this.spinnerVal = true;
    this.courseService.getAllWithCategory(pageRequest).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.mapCourseToCourseForHomeModel(response.data.items);
          this.paginator.length = response.data.totalCount;
        } else {
          console.error(response.errors);
        }
      }, error(err) {
        console.error(err.error);
      },
    });
  }

  openCart(){
    this.dialog.open(BasketDialog);
  }

  mapCourseToCourseForHomeModel(courses:CourseViewModel[]){
    this.courseModel = [];
    courses.forEach((course)=>{
      let courseModelForHome:CourseViewModelForHome = new CourseViewModelForHome();
      courseModelForHome.name = course.name;
      courseModelForHome.description = course.description;
      courseModelForHome.price = course.price;
      courseModelForHome.image = course.image;
      courseModelForHome.userId = course.userId;
      courseModelForHome.feature = course.feature;
      courseModelForHome.category = course.category;
      courseModelForHome.id = course.id;
      courseModelForHome.createdDate = course.createdDate;

      if(this.authState){
        this.basketService.get().subscribe({
          next: response => {
            if (response.isSuccessful) {
              courseModelForHome.isExistInCart = response.data.basketItems.find((val) => val.courseId == course.id) ? true : false;
            }
          }
        });
      }
      this.courseModel.push(courseModelForHome);
    })
  }
}

class CourseViewModelForHome{
    name: string
    description: string
    price: number
    image: string
    userId: string
    feature: Feature
    category: Category
    id: string
    createdDate: string
    isExistInCart:boolean
}
