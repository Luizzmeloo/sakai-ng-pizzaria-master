import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';  // Import Realtime Database service
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
  `]
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private auth: Auth,
    private db: AngularFireDatabase,  // Inject AngularFireDatabase for Realtime Database
    private router: Router
  ) {}

  async registerUser() {
    if (this.user.name && this.user.email && this.user.password) {
      try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(this.auth, this.user.email, this.user.password);

        // Reference to the 'users' node in Realtime Database
        const userRef = this.db.list('users'); 

        // Set user data in the 'users' node with the user's UID as the key
        await userRef.set(userCredential.user.uid, {
          name: this.user.name,
          email: this.user.email,
          createdAt: new Date().toISOString() // Store creation time as a string
        });

        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['./auth/login']);
      } catch (error) {
        console.error('Falha ao cadastrar usuario:', error);
        alert('Error: ' + error.message);
      }
    } else {
      alert('Por favor preencha todos os campos!');
    }
  }
}
