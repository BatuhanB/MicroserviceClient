import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormField, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CourseService } from "../services/catalog/course.service";
import { CourseUpdateModel } from "../models/Catalog/Course/CourseUpdateModel";
import { CourseCreateModel } from "../models/Catalog/Course/CourseCreateModel";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";



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
    }`,
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
        ReactiveFormsModule]
})
export class CreateAndUpdateCourseDialog implements OnInit {

    createForm: FormGroup;
    createCourseModel: CourseCreateModel;

    ngOnInit(): void {

    }
    constructor(
        @Inject(MAT_DIALOG_DATA) public updateData: CourseUpdateModel | null,
        private courseService: CourseService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
    ) {
        this.createForm = this.fb.group({
            name: ['', [Validators.minLength(3),Validators.required]],
            // description: ['', Validators.required],
            // price: [0, Validators.minLength(0), Validators.required],
            // image: [''],
            // duration: [0, Validators.minLength(0), Validators.required],
            // categoryId: [0, Validators.required]
        });
    }

    onSubmit(): void {
        if (this.createForm.valid) {
            // this.createCourseModel = this.createForm.value;
            this.courseService.create(this.createCourseModel).subscribe({
                next: (response) => {
                    this._snackBar.open(`${response.data.id} created successfully`, 'Okey');
                    console.log(response);
                },
                error: (err) => {
                    console.error('error', err);
                },
            });
        }
    }

}