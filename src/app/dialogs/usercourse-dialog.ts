import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialog
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../services/catalog/course.service';
import { UserInfo } from '../services/identity-service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CreateAndUpdateCourseDialog } from './createandupdatecourse-dialog';
import { CourseUpdateModel } from '../models/Catalog/Course/CourseUpdateModel';

interface UserCourseDialogData {
  userInfo: UserInfo;
}
@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'usercourse-dialog.html',
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
    MatFormField,
    MatLabel,
    MatTable,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatIcon,
    MatDialogActions,
    MatDialogClose,
    MatSortModule
  ],
})
export class UserCourseDialog implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'image',
    'feature',
    'category',
    'date',
    'update',
    'delete'
  ];
  dataSource = new MatTableDataSource();
  updateCourseData: CourseUpdateModel;
  constructor(
    @Inject(MAT_DIALOG_DATA) public info: UserCourseDialogData,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnInit(): void {
    this.getAllCourses();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateCourse(name: string, id: string) {
    this._snackBar.open(`${name} updated`, 'Okey');
  }

  createCourse() {
    this.dialog.open(CreateAndUpdateCourseDialog, {
      data: {
        //updateData: this.updateCourse
      },
    });
  }

  getById(id: string) {
    this.courseService.getById(id).subscribe({
      next: response => {
        this.updateCourse = response.data;
      }
    })
  }

  deleteCourse(name: string, id: string) {
    this._snackBar.open(`${name} deleted`, 'Okey');
  }

  getAllCourses() {
    this.courseService.getAllByUserId(this.info.userInfo.sub).subscribe({
      next: (value) => {
        this.dataSource.data = value.data;
      },
    });
  }
}
