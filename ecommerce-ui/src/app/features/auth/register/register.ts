import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  name = '';
  email = '';
  mobileNumber = '';
  loading = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  register() {
    if (!this.name.trim()) {
      this.toastr.warning('Please enter your name');
      return;
    }
    if (!this.email.trim() || !this.email.includes('@')) {
      this.toastr.warning('Please enter a valid email address');
      return;
    }
    if (!this.mobileNumber.trim() || this.mobileNumber.length < 10) {
      this.toastr.warning('Please enter a valid mobile number (min 10 digits)');
      return;
    }

    this.loading = true;
    this.auth.register(this.name, this.email, this.mobileNumber).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastr.success('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.toastr.error(err.error || 'Registration failed. Please try again.');
      }
    });
  }
}
