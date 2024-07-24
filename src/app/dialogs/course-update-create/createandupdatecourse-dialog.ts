import { catchError, switchMap, tap } from 'rxjs/operators';
import { PhotostockService } from './../../services/photostock.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatFormField, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { CategoryModel } from '../../models/Catalog/Category/CategoryModel';
import { CourseCreateModel } from '../../models/Catalog/Course/CourseCreateModel';
import { CourseUpdateModel } from '../../models/Catalog/Course/CourseUpdateModel';
import { FeatureViewModel } from '../../models/Catalog/Course/FeatureViewModel';
import { CategoryService } from '../../services/catalog/category.service';
import { CourseService } from '../../services/catalog/course.service';
import { UserInfo, IdentityService } from '../../services/identity-service';
import { UserCourseDialog } from '../course-list/usercourse-dialog';
import { PhotostockModel } from '../../models/photostock/photostockmodel';
import { throwError } from 'rxjs';
import { CourseViewModel } from '../../models/Catalog/Course/CourseViewModel';
import { CourseGetByIdModel } from '../../models/Catalog/Course/CourseGetByIdModel';



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
    .file-input {
        display: none;
    }
    .file-upload{
        display:flex;
        justify-content:space-between;
        width:210px;
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
        MatProgressSpinnerModule,
    ]
})
export class CreateAndUpdateCourseDialog implements OnInit {
    createForm: FormGroup;
    createCourseModel: CourseCreateModel = new CourseCreateModel();
    updateCourseModel: CourseUpdateModel = new CourseUpdateModel();
    categories: CategoryModel[];
    userInfo: UserInfo;
    selectedCourseId: string;
    fileUrl: string = '';
    imageUrl:string = 'http://localhost:5000/services/photostock/';
    fileFormData = new FormData();

    ngOnInit(): void {
        this.getCategories();
        this.getUserInfo();
        if (this.updateDataId != null) { this.getCourseById(this.updateDataId); }
    }
    constructor(
        @Inject(MAT_DIALOG_DATA) public updateDataId: string | null,
        private courseService: CourseService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private categoryService: CategoryService,
        private identityService: IdentityService,
        private dialog: MatDialog,
        private photoStockService:PhotostockService
    ) {
        this.createForm = this.fb.group({
            name: ['', [Validators.minLength(3), Validators.required]],
            description: ['', Validators.required],
            price: [0, [Validators.minLength(0), Validators.required]],
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

    //todo Check if uploadPhoto method triggers to directly course services
    onSubmit(): void {
        if (this.createForm.valid) {
            this.uploadPhoto().pipe(
                switchMap(() => {
                    if (this.selectedCourseId != null) {
                        this.mapFormDataToUpdateModel();
                        return this.courseService.update(this.updateCourseModel);
                    } else {
                        this.mapFormToCreateModel();
                        return this.courseService.create(this.createCourseModel);
                    }
                })
            ).subscribe({
                next: (response) => {
                    if (this.selectedCourseId != null) {
                        this._snackBar.open(`Updated successfully`, 'Okey');
                    } else {
                        if (response.isSuccessful) {
                            this._snackBar.open(`${response.data.name} created successfully`, 'Okey');
                        } else {
                            console.error('error', response.errors);
                        }
                    }
                    this.dialog.closeAll();
                    this.dialog.open(UserCourseDialog, {
                        data: {
                            userInfo: this.userInfo,
                        },
                    });
                },
                error: (err) => {
                    console.error('error', err);
                },
            });
        }
    }
    
    uploadPhoto() {
        return this.photoStockService.upload(this.fileFormData).pipe(
            tap(response => {
                if (response.isSuccessful) {
                    this.fileUrl = response.data.url;
                } else {
                    console.error(response.errors);
                }
            }),
            catchError(err => {
                console.error(err);
                return throwError(err);
            })
        );
    }

    getCourseById(id: string) {
        this.courseService.getById(id).subscribe({
            next: response => {
                if (response.isSuccessful) {
                    this.fillInputsByUpdateModel(response.data);
                } else {
                    console.error(response.errors);
                }
            }
        });
    }

    mapFormDataToUpdateModel(){
        if (this.createForm.valid 
            && (this.selectedCourseId != null 
                || this.selectedCourseId != '')) {

            this.updateCourseModel.id = this.selectedCourseId;
            this.updateCourseModel.categoryId = this.createForm.get("categoryId").value;
            this.updateCourseModel.name = this.createForm.get("name").value;
            this.updateCourseModel.description = this.createForm.get("description").value;
            this.updateCourseModel.price = this.createForm.get("price").value;
            this.updateCourseModel.feature.duration = this.createForm.get("duration").value;
            this.updateCourseModel.image = this.fileUrl;
            this.updateCourseModel.userId = this.identityService.getUserId();
        }
    }

    mapFormToCreateModel() {
        if (this.createForm.valid) {
            this.createCourseModel.categoryId = this.createForm.get("categoryId").value;
            this.createCourseModel.name = this.createForm.get("name").value;
            this.createCourseModel.description = this.createForm.get("description").value;
            this.createCourseModel.price = this.createForm.get("price").value;
            this.createCourseModel.feature.duration = this.createForm.get("duration").value;
            this.createCourseModel.image = this.fileUrl;
            this.createCourseModel.userId = this.identityService.getUserId();
        }
    }

    fillInputsByUpdateModel(courseModel: CourseGetByIdModel) {
        this.selectedCourseId = courseModel.id;
        this.fileUrl = courseModel.image;
        this.createForm.setValue({
            name: courseModel.name,
            price: courseModel.price,
            description: courseModel.description,
            duration: courseModel.feature.duration,
            categoryId: courseModel.categoryId,
        })
    }

    getUserInfo() {
        this.identityService.getUserProfile().subscribe({
            next: (value: UserInfo) => {
                this.userInfo = value;
            },
        });
    }

    onFileSelected(event) {
        const file: File = event.target.files[0];
        if (file) {
            this.fileFormData.append("file", file);
        }
    }
}