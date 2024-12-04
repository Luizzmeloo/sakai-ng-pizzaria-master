import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})

export class LoginComponent {
    email: string = '';
    password: string = '';
  
    constructor(private auth: Auth, private router: Router) {}
  
    async loginUser() {
      if (this.email && this.password) {
        try {
          // Firebase Authentication
          await signInWithEmailAndPassword(this.auth, this.email, this.password);
          alert('Login com sucesso!');
          this.router.navigate(['./']);
        } catch (error) {
          console.error('Erro ao tentar logar:', error);
          alert('Falha ao tentar logar: ' + error.message);
        }
      } else {
        alert('Por favor preencha o email e senha!');
      }
    }
  }
