import { Inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from '../interceptors/auth-interceptor';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import { CoursesComponent } from './components/courses/courses.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { PhotoHelperNotStPipe } from './pipes/photo-helper-notst';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DurationFormatterPipe } from './pipes/duration-formatter.pipe';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { BasketComponent } from './components/basket/basket.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {MatStepperModule} from '@angular/material/stepper';
import { ExpirationDateDirective } from './directives/expirationdate-directive';
import { CardNumberDirective } from './directives/cardnumber-directive';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { CheckoutResultComponent } from './components/checkout-result/checkout-result.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { IdentityService } from './services/identity-service';
import { NotificationComponent } from './components/notification/notification.component';
import {MatBadgeModule} from '@angular/material/badge';
import { TimeComparisonPipe } from './pipes/time-comparison-pipe';
import { InvoiceUrlHelperPipe } from './pipes/invoice-url-helper.pipe';


export function tokenGetter(identityService: IdentityService) {
  return identityService.getAccessToken();
}

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    UserProfileComponent,
    HeaderComponent,
    HomeComponent,
    CoursesComponent,
    PhotoHelperNotStPipe,
    DurationFormatterPipe,
    CourseDetailComponent,
    TimeComparisonPipe,
    BasketComponent,
    CheckoutComponent,
    ExpirationDateDirective,
    CardNumberDirective,
    CheckoutResultComponent,
    OrderHistoryComponent,
    NotificationComponent,
    InvoiceUrlHelperPipe
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatChipsModule,
    MatSortModule,
    MatTableModule,
    MatStepperModule,
    MatDialogModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatBadgeModule,
    JwtModule.forRoot({
      config:{
        tokenGetter: ()=> tokenGetter(Inject(IdentityService))
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    IdentityService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
