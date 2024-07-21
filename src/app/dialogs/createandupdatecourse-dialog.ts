import { CategoryService } from './../services/catalog/category.service';
import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatFormField, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CourseService } from "../services/catalog/course.service";
import { CourseUpdateModel } from "../models/Catalog/Course/CourseUpdateModel";
import { CourseCreateModel } from "../models/Catalog/Course/CourseCreateModel";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { CategoryModel } from "../models/Catalog/Category/CategoryModel";
import { IdentityService, UserInfo } from '../services/identity-service';
import { UserCourseDialog } from './usercourse-dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
    selector: 'createandupdatecourse-dialog',
    templateUrl: 'createandupdatecourse-dialog.html',
    styles: `
    .mat-icon-button {
        border: none;
        background-color: #e7e7e7;
        border-radius: 35%;
        width: 40px;
        height: 40px;
        line-height: 1px;
        cursor: pointer;
        margin-left: 10px;
        color:black;
    }
    .mat-grid-tile-content:last-child{
        display:flex;
        justify-content: flex-start;
    }
    .button-grid{
        display: flex;
        align-items: center;
    }
    .mat-icon-button-text{
        margin-left:10px;
    }
    `,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatFormField,
        MatButtonModule,
        MatLabel,
        MatInputModule,
        MatFormFieldModule,
        CommonModule,
        MatIcon,
        MatDialogActions,
        MatDialogClose,
        MatGridListModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatSelectModule,
        FormsModule,
        MatProgressSpinnerModule
    ]
})
export class CreateAndUpdateCourseDialog implements OnInit {

    createForm: FormGroup;
    createCourseModel: CourseCreateModel = new CourseCreateModel();
    categories: CategoryModel[];
    userInfo: UserInfo;

    ngOnInit(): void {
        this.getCategories();
        this.getUserInfo();
    }
    constructor(
        @Inject(MAT_DIALOG_DATA) public updateData: CourseUpdateModel | null,
        private courseService: CourseService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private categoryService: CategoryService,
        private identityService: IdentityService,
        private dialog: MatDialog
    ) {
        this.createForm = this.fb.group({
            name: ['', [Validators.minLength(3), Validators.required]],
            description: ['', Validators.required],
            price: [0, [Validators.minLength(0), Validators.required]],
            image: [''],
            duration: [0, [Validators.minLength(0), Validators.required]],
            categoryId: ['', [Validators.required]],
        });
    }

    getCategories() {
        this.categoryService.getAll().subscribe({
            next: value => {
                this.categories = value.data;
            }
        })
    }

    onSubmit(): void {
        if (this.createForm.valid) {
            this.mapFormToModel();
            this.courseService.create(this.createCourseModel).subscribe({
                next: (response) => {
                    if (response.isSuccessful) {
                        this._snackBar.open(`${response.data.name} created successfully`, 'Okey');
                        this.dialog.closeAll();
                        this.dialog.open(UserCourseDialog, {
                            data: {
                                userInfo: this.userInfo,
                            },
                        });
                    } else {
                        console.error('error', response.errors);
                    }
                },
                error: (err) => {
                    console.error('error', err);
                },
            });
        }
    }

    mapFormToModel() {
        if (this.createForm.valid) {
            this.createCourseModel.categoryId = this.createForm.get("categoryId").value;
            this.createCourseModel.name = this.createForm.get("name").value;
            this.createCourseModel.description = this.createForm.get("description").value;
            this.createCourseModel.price = this.createForm.get("price").value;
            this.createCourseModel.feature.duration = this.createForm.get("duration").value;
            this.createCourseModel.image = this.createForm.get("image").value;
            this.createCourseModel.userId = this.identityService.getUserId();
        }
    }

    getUserInfo() {
        this.identityService.getUserProfile().subscribe({
            next: (value: UserInfo) => {
                this.userInfo = value;
            },
        });
    }
}