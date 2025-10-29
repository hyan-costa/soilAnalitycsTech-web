import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Page, User, UserService } from '../../user.service';
import { NgbDropdownModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbPaginationModule,
    NgbDropdownModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  usersPage$!: Observable<Page<User>>;
  currentPage = 1;
  pageSize = 10;
  userToDeactivate: User | null = null;

  constructor(private userService: UserService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersPage$ = this.userService.getUsers(this.currentPage - 1, this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN': return 'badge bg-primary';
      case 'ROLE_USER': return 'badge bg-secondary';
      default: return 'badge bg-light text-dark';
    }
  }

  openDeactivationModal(content: any, user: User) {
    this.userToDeactivate = user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then(
      (result) => {
        if (result === 'confirm' && this.userToDeactivate) {
          this.userService.deleteUser(this.userToDeactivate.usuarioId).subscribe(() => {
            this.loadUsers(); // Recarrega a lista após a desativação
          });
        }
      },
      (reason) => {
        // Modal foi dispensado (clique fora, Esc, etc.)
      }
    );
  }
}