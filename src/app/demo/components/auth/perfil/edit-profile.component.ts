import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { ProfileService } from './profile.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
  `]
})
export class EditProfileComponent implements OnInit {
  profile = {
    nome: '',
    rua: '',
    bairro: '',
    numero: null,
    cidade: '',
    cep: '',
    estado: '',
    telefone: '',
    cpf: '',
    sexo: 'Masculino',
  };

  userId: string | null = null;
  estados: any[] = []; // Stores list of states
  cidades: string[] = []; // Add this to store list of cities

  saving = false; // Add this property to track the loading state

  constructor(private profileService: ProfileService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserProfile();
      } else {
        alert('Please log in to access this page.');
        this.router.navigate(['/auth/login']); // Redirect to login
      }
    });
  }

  loadUserProfile() {
    if (this.userId) {
      this.profileService.getProfile(this.userId).subscribe((data: any) => {
        if (data) {
          this.profile = data;
        }
      });
    }
  }

  updateProfile() {
    if (this.userId) {
      this.saving = true; // Add a flag to show a loading spinner
      this.profileService
        .updateProfile(this.userId, this.profile)
        .then(() => {
          alert('Perfil alterado com sucesso');
          this.router.navigate(['./']);
        })
        .catch((err) => {
          alert('Falha ao alterar dados do usuario: ' + err.message);
        })
        .finally(() => {
          this.saving = false; // Hide the loading spinner
        });
    }
  }


  // Fetch address details from ViaCEP API
  fetchAddress() {
    if (this.profile.cep) {
      this.http.get(`https://viacep.com.br/ws/${this.profile.cep}/json/`).subscribe({
        next: (data: any) => {
          this.profile.rua = data.logradouro;
          this.profile.bairro = data.bairro;
          this.profile.cidade = data.localidade;
          this.profile.estado = data.uf;
        },
        error: () => alert('CEP inválido ou erro ao buscar o endereço'),
      });
    }
  }

  // Fetch list of states from IBGE API
  fetchEstados() {
    this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').subscribe({
      next: (data: any[]) => {
        this.estados = data.map((estado) => ({ nome: estado.nome, sigla: estado.sigla }));
        console.log('Estados loaded:', this.estados); // Debug: Verify states
      },
      error: (err) => {
        console.error('Error fetching estados:', err);
        alert('Erro ao buscar os estados');
      },
    });
  }
  
  fetchCidades() {
  if (this.profile.estado) {
    const estadoSigla = this.profile.estado.toUpperCase(); // Ensure uppercase for API
    console.log('Fetching cities for estado:', estadoSigla); // Debugging log

    this.http
      .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`)
      .subscribe({
        next: (data: any[]) => {
          console.log('API Response:', data); // Debugging: Log raw API response
          this.cidades = data.map((cidade) => cidade.nome); // Assign cities
          console.log('Cidades:', this.cidades); // Debugging: Log processed cities
        },
        error: (err) => {
          console.error('Error fetching cidades:', err);
          alert('Erro ao buscar as cidades');
        },
      });
  } else {
    console.warn('No estado selected. Clearing cidades.'); // Debugging log
    this.cidades = []; // Clear cities if no estado is selected
  }
}

  
  
}