/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { User, AuthState } from '../model/auth.model';

// DTOs
import { LoginCredentialsDto, LoginResponseDto, UpdateUserDto } from '../dto/auth.dto';

// Constants
import { AUTH_STORAGE_KEY } from '../constants/auth.constants';

/* ************************************************************************** */
/*                                  Service                                   */
/* ************************************************************************** */

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* ********************************************************************** */
  /*                          Private Properties                            */
  /* ********************************************************************** */

  private authStateSignal = signal<AuthState>(this.loadAuthStateFromStorage());

  /* ********************************************************************** */
  /*                           Computed signals                             */
  /* ********************************************************************** */

  user = computed(() => this.authStateSignal().user);
  isAuthenticated = computed(() => this.authStateSignal().isAuthenticated);
  userEmail = computed(() => this.authStateSignal().user?.email || '');
  userId = computed(() => this.authStateSignal().user?.id || null);
  userFullName = computed(() => {
    const user = this.authStateSignal().user;
    if (!user) return '';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return `${firstName} ${lastName}`.trim() || user.email;
  });

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor(private router: Router) {
    effect(() => {
      this.saveAuthStateToStorage(this.authStateSignal());
    });
  }

  /* ********************************************************************** */
  /*                       Public Methods                                   */
  /* ********************************************************************** */

  login(credentialsDto: LoginCredentialsDto): LoginResponseDto {
    if (this.validateCredentials(credentialsDto)) {
      const user: User = {
        id: Date.now(),
        email: credentialsDto.email,
        firstName: this.extractFirstName(credentialsDto.email),
        lastName: 'User',
        role: 'user'
      };

      this.setAuthState({
        user,
        isAuthenticated: true
      });

      return new LoginResponseDto(
        true,
        user,
        'fake-jwt-token-' + Date.now(),
        'Connexion réussie'
      );
    }

    return new LoginResponseDto(
      false,
      undefined,
      undefined,
      'Email ou mot de passe incorrect'
    );
  }
  logout(): void {
    this.setAuthState({
      user: null,
      isAuthenticated: false
    });

    this.router.navigate(['/login']);
  }
  updateUser(updateDto: UpdateUserDto): boolean {
    const currentUser = this.user();
    
    if (currentUser) {
      this.setAuthState({
        user: { ...currentUser, ...updateDto },
        isAuthenticated: true
      });
      return true;
    }

    return false;
  }
  updateEmail(newEmail: string): boolean {
    return this.updateUser(new UpdateUserDto({ email: newEmail }));
  }

  hasRole(role: string): boolean {
    const user = this.user();
    return user?.role === role;
  }

  refreshAuthState(): void {
    const state = this.loadAuthStateFromStorage();
    this.authStateSignal.set(state);
  }

  /* ********************************************************************** */
  /*                            Private Methods                             */
  /* ********************************************************************** */

  private setAuthState(state: AuthState): void {
    this.authStateSignal.set(state);
  }

  private validateCredentials(credentialsDto: LoginCredentialsDto): boolean {
    return credentialsDto.email.length > 0 && credentialsDto.password.length > 0;
  }

  private extractFirstName(email: string): string {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /* ********************************************************************** */
  /*                          Storage Methods                               */
  /* ********************************************************************** */

  private loadAuthStateFromStorage(): AuthState {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed.user || null,
          isAuthenticated: parsed.isAuthenticated || false
        };
      }
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
    }

    return {
      user: null,
      isAuthenticated: false
    };
  }

  private saveAuthStateToStorage(state: AuthState): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving auth state to storage:', error);
    }
  }

  private clearAuthStateFromStorage(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth state from storage:', error);
    }
  }
}