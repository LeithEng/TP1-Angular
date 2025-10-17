/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

// Models
import { User, AuthState } from '../model/auth.model';

// DTOs
import {
  LoginCredentialsDto,
  LoginResponseDto,
  UpdateUserDto,
} from '../dto/auth.dto';

// Constants
import { AUTH_STORAGE_KEY } from '../constants/auth.constants';

// Config
import { API } from '../../../config/api.config';

/* ************************************************************************** */
/*                                  Service                                   */
/* ************************************************************************** */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* ********************************************************************** */
  /*                          Private Properties                            */
  /* ********************************************************************** */

  private http = inject(HttpClient);
  private router = inject(Router);
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

  constructor() {
    effect(() => {
      this.saveAuthStateToStorage(this.authStateSignal());
    });
  }

  /* ********************************************************************** */
  /*                       Public Methods                                   */
  /* ********************************************************************** */

  login(credentialsDto: LoginCredentialsDto): Observable<LoginResponseDto> {
    return this.http
      .post<any>(API.login, {
        email: credentialsDto.email,
        password: credentialsDto.password,
      })
      .pipe(
        map((response) => {
          const user: User = {
            id: response.id,
            email: credentialsDto.email,
            firstName: this.extractFirstName(credentialsDto.email),
            lastName: 'User',
            role: 'user',
          };

          this.setAuthState({
            user,
            isAuthenticated: true,
          });

          return new LoginResponseDto(
            true,
            user,
            response.id,
            'Connexion réussie'
          );
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(
            new LoginResponseDto(
              false,
              undefined,
              undefined,
              error.error?.message || 'Email ou mot de passe incorrect'
            )
          );
        })
      );
  }
  logout(): void {
    this.setAuthState({
      user: null,
      isAuthenticated: false,
    });

    this.router.navigate(['/login']);
  }
  updateUser(updateDto: UpdateUserDto): boolean {
    const currentUser = this.user();

    if (currentUser) {
      this.setAuthState({
        user: { ...currentUser, ...updateDto },
        isAuthenticated: true,
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
          isAuthenticated: parsed.isAuthenticated || false,
        };
      }
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
    }

    return {
      user: null,
      isAuthenticated: false,
    };
  }

  private saveAuthStateToStorage(state: AuthState): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving auth state to storage:', error);
    }
  }

}
