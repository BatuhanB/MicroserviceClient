import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService, UserInfo } from '../../services/identity-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private identityService: IdentityService,
    private router: Router,
  ) {
    this.signInForm = this.fb.group({
      email: ['admin@mail.com', [Validators.required, Validators.email]],
      password: ['Password12*', Validators.required],
      isRemember: [false],
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      this.identityService.signIn(this.signInForm.value).pipe(
        switchMap(response=>{
            return this.identityService.getUserProfile();
      })).subscribe({
        next: (val: UserInfo) => {
          localStorage.setItem('user_name', val.name);
          this.identityService.updateAuthStatus(true);
          this.router.navigate(['/']);
        },
      });
    }
  }
}
