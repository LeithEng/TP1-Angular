/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Service
import { AuthService } from '../services/auth.service';

// DTOs
import { LoginCredentialsDto } from '../dto/auth.dto';

/* ************************************************************************** */
/*                                 Component                                  */
/* ************************************************************************** */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /* ********************************************************************** */
  /*                          Injected Services                             */
  /* ********************************************************************** */

  private authService = inject(AuthService);
  private router = inject(Router);

  /* ********************************************************************** */
  /*                               Signals                                  */
  /* ********************************************************************** */

  errorMessageSignal = signal('');
  isLoadingSignal = signal(false);

  /* ********************************************************************** */
  /*                            Properties                                  */
  /* ********************************************************************** */

  email = '';
  password = '';
  showPassword = false;

  /* ********************************************************************** */
  /*                            Public Methods                              */
  /* ********************************************************************** */
  onLogin(): void {
    this.errorMessageSignal.set('');
    if (!this.validateInputs()) {
      return;
    }
    this.isLoadingSignal.set(true);
    const credentialsDto = new LoginCredentialsDto(this.email, this.password);
    setTimeout(() => {
      const response = this.authService.login(credentialsDto);

      this.isLoadingSignal.set(false);

      if (response.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessageSignal.set(response.message || 'Erreur de connexion');
      }
    }, 500);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessageSignal.set('');
  }

  /* ********************************************************************** */
  /*                            Private Methods                             */
  /* ********************************************************************** */

  private validateInputs(): boolean {
    if (!this.email.trim()) {
      this.errorMessageSignal.set('Veuillez entrer votre email');
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessageSignal.set('Veuillez entrer un email valide');
      return false;
    }

    if (!this.password.trim()) {
      this.errorMessageSignal.set('Veuillez entrer votre mot de passe');
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessageSignal.set('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}