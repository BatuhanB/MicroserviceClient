import { UserInfo } from '../services/identity-service';
import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../services/identity-service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource = new MatTableDataSource<UserInfo>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private identityService: IdentityService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.identityService.getUserProfile().subscribe({
      next: (value: UserInfo) => {
        this.dataSource.data.push(value);
      },
    });
  }
}
