import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { BasketComponent } from './components/basket/basket.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutResultComponent } from './components/checkout-result/checkout-result.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { NotificationComponent } from './components/notification/notification.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'course/:id', component: CourseDetailComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: 'user/order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'checkout/result/:orderId', component: CheckoutResultComponent, canActivate: [AuthGuard] },
  { path: 'checkout/result', component: CheckoutResultComponent, canActivate: [AuthGuard] },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
  { path: 'user/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
