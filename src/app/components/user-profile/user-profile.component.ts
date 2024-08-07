import { IdentityService } from '../../services/identity-service';
import {
  MatDialog,
} from '@angular/material/dialog';
import { UserInfo } from '../../services/identity-service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserCourseDialog } from '../../dialogs/course-list/usercourse-dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  encapsulation:ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  userInfo: UserInfo;

  constructor(
    private identityService: IdentityService,
    private dialog: MatDialog
  ) {}

  openDialog() {
    this.dialog.open(UserCourseDialog, {
      data: {
        userInfo: this.userInfo,
      },
    });
  }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.identityService.getUserProfile().subscribe({
      next: (value: UserInfo) => {
        this.userInfo = value;
      },
    });
  }
}