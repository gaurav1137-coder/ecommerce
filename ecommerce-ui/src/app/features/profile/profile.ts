import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile {

  editMode = false;

  user = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

    const data = this.auth.getUser();

    this.user = {
      name: data?.username || '',
      email: data?.email || '',
      phone: data?.mobileNumber || ''
    };

    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    this.auth.updateUser(this.user);
    this.editMode = false;
    alert('Profile updated successfully ✅');
  }

  cancelEdit() {
    this.editMode = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
