import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Perfil, Laboratorio, Cliente, User, UserService } from '../../user.service';
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
  perfis$!: Observable<Perfil[]>;
  laboratorios$!: Observable<Laboratorio[]>;
  clientes$!: Observable<Cliente[]>;
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
      senha: [''], // Opcional
      senhaConfirmacao: [''], // Opcional
      perfilId: ['', Validators.required],
      laboratorioId: [''],
      clienteId: [''],
      ativo: [true]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador customizado para verificar se as senhas coincidem (apenas se senha foi preenchida)
  passwordMatchValidator(formGroup: FormGroup) {
    const senha = formGroup.get('senha')?.value;
    const senhaConfirmacao = formGroup.get('senhaConfirmacao')?.value;

    // Só valida se a senha foi preenchida
    if (senha && senha.trim() !== '') {
      if (senhaConfirmacao !== senha) {
        formGroup.get('senhaConfirmacao')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
    }

    // Remove o erro se as senhas coincidem ou se senha está vazia
    const senhaConfirmacaoControl = formGroup.get('senhaConfirmacao');
    if (senhaConfirmacaoControl?.hasError('passwordMismatch')) {
      senhaConfirmacaoControl.setErrors(null);
    }
    return null;
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.perfis$ = this.userService.getPerfis();
    this.laboratorios$ = this.userService.getLaboratorios();
    this.clientes$ = this.userService.getClientes();

    this.userService.getUserById(this.userId).subscribe(user => {
      this.userForm.patchValue({
        email: user.email,
        nomeCompleto: user.nomeCompleto,
        perfilId: user.perfilId,
        laboratorioId: user.laboratorioId || '',
        clienteId: user.clienteId || '',
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
      email: formValue.email, // Incluir email mesmo que seja read-only
      perfilId: formValue.perfilId,
      laboratorioId: formValue.laboratorioId || null,
      clienteId: formValue.clienteId || null,
      ativo: formValue.ativo
    };

    // Apenas incluir senha se foi fornecida (senhaConfirmacao não é enviado)
    if (formValue.senha && formValue.senha.trim() !== '') {
      payload.senha = formValue.senha;
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