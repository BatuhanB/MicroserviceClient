interface UserCourseDialogData {
    userInfo: UserInfo;
}

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
import { Component, OnInit, Inject } from '@angular/core';
import {
    MatDialogTitle,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CourseWithCategoryViewModel } from '../models/CourseWithCategoryModel';
import { CourseService } from '../services/catalog/course.service';
import { UserInfo } from '../services/identity-service';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'dialog-data-example-dialog',
    template: `
    
<h2 mat-dialog-title>Courses</h2>
<mat-dialog-content>
    <mat-form-field>
        <mat-label>Filter</mat-label>
        <input matInput (keyup)="applyFilter($event)" #input />
    </mat-form-field>

    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let element">{{ element.description }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let element">{{ element.price }}</td>
        </ng-container>

        <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Image</th>
            <td mat-cell *matCellDef="let element">
                <img src="{{ element.image }}" width="75" height="75"/>
            </td>
        </ng-container>

        <ng-container matColumnDef="feature">
            <th mat-header-cell *matHeaderCellDef>Duration</th>
            <td mat-cell *matCellDef="let element">
                @if (element.feature) {
                    {{element.feature.duration}}
                }@else{
                    No duration has added
                }
                
            </td>
        </ng-container>

        <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let element">
                {{ element.category.name }}
            </td>
        </ng-container>

        <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let element">{{ element.createdDate | date}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

        <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">
                No data matching the filter "{{ input.value }}"
            </td>
        </tr>
    </table>
</mat-dialog-content>

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
        CommonModule
    ],
})
export class UserCourseDialog implements OnInit {
    displayedColumns: string[] = [
        'name',
        'description',
        'price',
        'image',
        'feature',
        'category',
        'date',
    ];
    dataSource = new MatTableDataSource();
    constructor(
        @Inject(MAT_DIALOG_DATA) public info: UserCourseDialogData,
        private courseService: CourseService
    ) { }

    ngOnInit(): void {
        this.getAllCourses();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getAllCourses() {
        this.courseService.getAllByUserId(this.info.userInfo.sub).subscribe({
            next: (value) => {
                this.dataSource.data = value.data;
            },
        });
    }
}
