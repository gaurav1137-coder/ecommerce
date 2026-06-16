import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ["./login.scss"]
})
export class Login {

  mobileNumber = '';
  otp = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {}

  login() {
    if (!this.mobileNumber.trim()) {
      this.toastr.warning('Please enter a mobile number');
      return;
    }
    if (!this.otp.trim()) {
      this.toastr.warning('Please enter OTP');
      return;
    }

    this.auth.login(this.mobileNumber, this.otp).subscribe({
      next: (result) => {
        this.toastr.success('Welcome back! Logged in successfully.');
        const role = result.user.roleId === 1 ? 'admin' : 'user';
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error || 'Invalid credentials or OTP');
      }
    });
  }
}
