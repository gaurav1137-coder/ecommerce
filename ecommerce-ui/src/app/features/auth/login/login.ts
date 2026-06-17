import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ["./login.scss"]
})
export class Login {

  mobileNumber = '';
  otp = '';
  showOtp = false;
  loading = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {}

  toggleOtpVisibility() {
    this.showOtp = !this.showOtp;
  }

  login() {
    if (this.loading) {
      return;
    }

    if (!this.mobileNumber.trim() || this.mobileNumber.length < 10) {
      this.toastr.warning('Please enter a valid mobile number');
      return;
    }
    if (!this.otp.trim()) {
      this.toastr.warning('Please enter OTP');
      return;
    }

    this.loading = true;
    this.auth.login(this.mobileNumber, this.otp).subscribe({
      next: (result) => {
        this.loading = false;
        this.toastr.success('Welcome back! Logged in successfully.');
        const user = result?.user ?? result?.User;
        const roleId = user?.roleId ?? user?.RoleId;
        const role = roleId === 1 ? 'admin' : 'user';
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        const message = err?.name === 'TimeoutError'
          ? 'Login request timed out. Please check that the backend API is running and the database is reachable.'
          : (err.error || 'Invalid credentials or OTP');
        this.toastr.error(message);
      }
    });
  }
}
