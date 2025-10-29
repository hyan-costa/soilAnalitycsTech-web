import { Component, OnDestroy } from '@angular/core';
import { AuthService, UserPayload } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  isSidebarExpanded = false;
  isAdmin = false;
  currentUser: UserPayload | null = null;
  private userSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  logout(): void {
    this.authService.logout();
  }
}
