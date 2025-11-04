import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Perfil, Laboratorio, Cliente, UserService } from '../../user.service';
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
  perfis$!: Observable<Perfil[]>;
  laboratorios$!: Observable<Laboratorio[]>;
  clientes$!: Observable<Cliente[]>;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      senhaConfirmacao: ['', [Validators.required]],
      perfilId: ['', Validators.required],
      laboratorioId: [''],
      clienteId: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // Validador customizado para verificar se as senhas coincidem
  passwordMatchValidator(formGroup: FormGroup) {
    const senha = formGroup.get('senha')?.value;
    const senhaConfirmacao = formGroup.get('senhaConfirmacao')?.value;

    if (senha && senhaConfirmacao && senha !== senhaConfirmacao) {
      formGroup.get('senhaConfirmacao')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Remove o erro se as senhas coincidem
      const senhaConfirmacaoControl = formGroup.get('senhaConfirmacao');
      if (senhaConfirmacaoControl?.hasError('passwordMismatch')) {
        senhaConfirmacaoControl.setErrors(null);
      }
      return null;
    }
  }

  ngOnInit(): void {
    this.perfis$ = this.userService.getPerfis();
    this.laboratorios$ = this.userService.getLaboratorios();
    this.clientes$ = this.userService.getClientes();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Preparar payload convertendo strings vazias para null
    const formValue = this.userForm.value;
    const payload = {
      nomeCompleto: formValue.nomeCompleto,
      email: formValue.email,
      senha: formValue.senha,
      perfilId: formValue.perfilId,
      laboratorioId: formValue.laboratorioId || null,
      clienteId: formValue.clienteId || null,
      ativo: true // Novo usuário sempre ativo por padrão
      // senhaConfirmacao não é enviado ao backend
    };

    this.userService.createUser(payload).subscribe({
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

  get email() { return this.userForm.get('email'); }
  get senha() { return this.userForm.get('senha'); }
  get senhaConfirmacao() { return this.userForm.get('senhaConfirmacao'); }
  get perfilId() { return this.userForm.get('perfilId'); }
}
