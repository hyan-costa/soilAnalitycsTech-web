import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Role, UserService } from '../../user.service';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbAlertModule
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  userForm: FormGroup;
  roles$!: Observable<Role[]>;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: [[] as string[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.roles$ = this.userService.getRoles();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Ocorreu um erro ao criar o usuário.';
        console.error(err);
      }
    });
  }

  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get roles() { return this.userForm.get('roles'); }
}
