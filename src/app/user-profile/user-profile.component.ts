import { UserInfo } from './../../services/identity-service';
import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../services/identity-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  user: UserInfo;

  constructor(private identityService: IdentityService) {}

  ngOnInit(): void {
    this.identityService.getUserProfile().subscribe({
      next: (value: UserInfo) => {
        this.user = value;
      },
    });
  }
}
