import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Role, User, UserService } from '../../user.service';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbAlertModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  userForm: FormGroup;
  roles$!: Observable<Role[]>;
  userId!: string;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      nomeCompleto: ['', Validators.required],
      password: [''], // Opcional
      roles: [[] as string[], Validators.required],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.roles$ = this.userService.getRoles();

    this.userService.getUserById(this.userId).subscribe(user => {
      this.userForm.patchValue({
        email: user.email,
        nomeCompleto: user.nomeCompleto,
        roles: user.roles,
        ativo: user.ativo
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formValue = this.userForm.getRawValue();
    const payload: any = {
      nomeCompleto: formValue.nomeCompleto,
      roles: formValue.roles,
      ativo: formValue.ativo
    };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    this.userService.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Ocorreu um erro ao atualizar o usuário.';
        console.error(err);
      }
    });
  }
}