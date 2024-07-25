import { IdentityService } from './../../services/identity-service';
import { Component, OnInit, Inject, } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialog
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../services/catalog/course.service';
import { UserInfo } from '../../services/identity-service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CourseDeleteModel } from '../../models/Catalog/Course/CourseDeleteModel';
import { UserCourseDialog } from '../course-list/usercourse-dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'user-course-delete-dialog',
  templateUrl: 'usercoursedelete-dialog.html',
  styles: `
  .dialog-title{
    height:45px;
    font-size:25px;
  }
  .dialog-top-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-and-button {
      display: flex;
      align-items: center;
  }
  .mat-icon-button {
      border: none;
      background-color: #e7e7e7;
      border-radius: 35%;
      width: 40px;
      height: 40px;
      line-height: 1px;
      cursor: pointer;
      margin-left: 10px; /* Adjust this margin as needed */
  }
  .title-and-button span {
      font-size:18px;
      margin-left: 10px; /* Adjust this margin as needed */
  }
  `,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    CommonModule,
    MatIcon,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
})
export class UserCourseDeleteDialog implements OnInit{
  userInfo:UserInfo;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CourseDeleteModel,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private identity:IdentityService
  ) { }


  ngOnInit(): void {
    this.getUserProfile();
  }


  getUserProfile(){
    this.identity.getUserProfile().subscribe({
      next:res=>{
        this.userInfo = res;
      }
    });
  }

  deleteCourse() {
    this.courseService.delete(this.data.id).subscribe({
      next: response => {
          this._snackBar.open(`You successfully deleted ${this.data.name}`, 'close',{
            duration:2000
          });
          this.dialog.closeAll();
          this.dialog.open(UserCourseDialog, {
            data: {
              userInfo: this.userInfo,
            },
          });
      }, error: (err) => {
        console.error(err.error);
      },
    })
  }
}